import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../constants'
import type { MediaSummaryItem } from '../types'

type ApiList<T> = { success: boolean; data: T }

const sentimentLabel = (s: MediaSummaryItem['sentiment']) =>
  s === 'BULLISH' ? '강세' : s === 'BEARISH' ? '약세' : '관망'

const sentimentTone = (s: MediaSummaryItem['sentiment']) =>
  s === 'BULLISH' ? 'up' : s === 'BEARISH' ? 'down' : 'base'

function formatPublished(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const m = d.getMonth() + 1
  const day = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${m}/${day} ${hh}:${mm}`
}

export function MediaSummaryPanel() {
  const [items, setItems] = useState<MediaSummaryItem[]>([])
  const [openId, setOpenId] = useState<string>('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(`${API_BASE_URL}/api/v1/media/summaries?limit=5`)
      .then((r) => r.json())
      .then((json: ApiList<MediaSummaryItem[]>) => {
        if (!alive || !json.success) return
        setItems(json.data ?? [])
        if (json.data && json.data.length > 0) setOpenId(json.data[0].id)
      })
      .catch(() => { /* 조용히 무시 */ })
      .finally(() => { if (alive) setLoaded(true) })
    return () => { alive = false }
  }, [])

  if (loaded && items.length === 0) return null

  return (
    <section className="panel media-summary-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Daily Broadcast Digest</p>
          <h2>📺 데일리 방송 요약</h2>
        </div>
        <small style={{ color: 'var(--t4)' }}>{items.length}건</small>
      </div>

      {items.map((item) => {
        const isOpen = item.id === openId
        const tone = sentimentTone(item.sentiment)
        return (
          <article key={item.id} className={`media-summary-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="media-summary-header"
              onClick={() => setOpenId(isOpen ? '' : item.id)}
            >
              <div className="media-summary-meta">
                <span className="label">{item.channelTitle}</span>
                <strong>{item.videoTitle}</strong>
                <small>{formatPublished(item.publishedAt)}{!item.hasTranscript ? ' · 제목 기반 요약' : ''}</small>
              </div>
              <span className={`mini-badge ${tone}`}>{sentimentLabel(item.sentiment)}</span>
            </button>

            {isOpen ? (
              <div className="media-summary-body">
                <div className="media-summary-section">
                  <p className="label">오늘의 요약</p>
                  <p className="media-summary-text">{item.summary}</p>
                </div>

                <div className={`media-summary-flow media-summary-flow--${tone}`}>
                  <p className="label">시장 흐름</p>
                  <p>{item.flowAnalysis}</p>
                </div>

                {item.keyTickers.length > 0 ? (
                  <div className="media-summary-section">
                    <p className="label">언급된 종목</p>
                    <div className="signal-chip-row">
                      {item.keyTickers.map((t) => (
                        <span key={t} className="signal-data-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="media-summary-link"
                >
                  ↗ 유튜브에서 영상 보기
                </a>
              </div>
            ) : null}
          </article>
        )
      })}
    </section>
  )
}
