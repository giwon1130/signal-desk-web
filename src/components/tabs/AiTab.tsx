import { SourceBadge } from '../SourceBadge'
import { formatNumber, formatSignedRate } from '../../lib/format'
import { getDirectionLabel } from '../../lib/news'
import type { AIRecommendationSection, AiPickForm, AiPickNewsLink, AiTrackRecordForm } from '../../types'

type Props = {
  aiRecommendations: AIRecommendationSection
  aiPickNewsLinks: AiPickNewsLink[]
  aiPickForm: AiPickForm
  setAiPickForm: React.Dispatch<React.SetStateAction<AiPickForm>>
  aiTrackRecordForm: AiTrackRecordForm
  setAiTrackRecordForm: React.Dispatch<React.SetStateAction<AiTrackRecordForm>>
  isSavingAiPick: boolean
  isSavingAiTrackRecord: boolean
  onSaveAiPick: () => void | Promise<void>
  onDeleteAiPick: (id: string) => void | Promise<void>
  onSaveAiTrackRecord: () => void | Promise<void>
  onDeleteAiTrackRecord: (id: string) => void | Promise<void>
}

export function AiTab({
  aiRecommendations,
  aiPickNewsLinks,
  aiPickForm,
  setAiPickForm,
  aiTrackRecordForm,
  setAiTrackRecordForm,
  isSavingAiPick,
  isSavingAiTrackRecord,
  onSaveAiPick,
  onDeleteAiPick,
  onSaveAiTrackRecord,
  onDeleteAiTrackRecord,
}: Props) {
  return (
    <section className="grid content stocks-layout">
      <article className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AI Picks</p>
            <h2>오늘 사면 좋을 종목</h2>
          </div>
          <SourceBadge label="MIXED" tone="mixed" />
          <span className="tag">{aiRecommendations.generatedDate}</span>
        </div>
        <p className="headline">{aiRecommendations.summary}</p>
        <div className="watchlist">
          {aiRecommendations.picks.map((pick) => {
            const newsBridge = aiPickNewsLinks.find((item) => item.pickKey === `${pick.market}-${pick.ticker}-${pick.id || pick.name}`)

            return (
              <article key={`${pick.source}-${pick.id || `${pick.market}-${pick.ticker}`}`} className="watch-item">
                <div>
                  <strong>{pick.name}</strong>
                  <span>{pick.market} · {pick.ticker}</span>
                </div>
                <div className="watch-metrics">
                  <strong>신뢰도 {pick.confidence}</strong>
                  <span className="up">예상 {formatSignedRate(pick.expectedReturnRate)}</span>
                </div>
                <p>{pick.basis} · {pick.note}</p>
                {newsBridge?.relatedClusters.length ? (
                  <div className="ai-news-bridge">
                    <div className="ai-news-bridge-header">
                      <span className="label">Related News</span>
                      <span>{newsBridge.relatedClusters.length}건 연결</span>
                    </div>
                    <div className="ai-news-link-list">
                      {newsBridge.relatedClusters.slice(0, 1).map((cluster) => (
                        <article key={`${pick.ticker}-${cluster.clusterKey}`} className="ai-news-link-card">
                          <div className="news-title-row">
                            <strong>{cluster.summary}</strong>
                            <span className={`news-signal-chip ${cluster.direction}`}>
                              {getDirectionLabel(cluster.direction)}
                            </span>
                          </div>
                          <div className="news-chip-row ai-news-link-chips">
                            <span className="news-signal-chip sector">{cluster.sector}</span>
                            <span className="news-signal-chip impact">영향도 {cluster.marketImpactScore}</span>
                            <span className="news-signal-chip impact">{cluster.items.length}건 묶음</span>
                          </div>
                          <div className="ai-news-link-headlines">
                            {cluster.items.slice(0, 1).map((item) => (
                              <a
                                key={`${pick.ticker}-${item.source}-${item.title}`}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="ai-news-link-item"
                              >
                                {item.classification.icon} {item.title}
                              </a>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                    {newsBridge.relatedClusters.length > 1 ? (
                      <small>연관 뉴스 {newsBridge.relatedClusters.length - 1}건은 뉴스 탭에서 이어서 확인.</small>
                    ) : null}
                  </div>
                ) : (
                  <div className="ai-news-bridge empty">
                    <div className="ai-news-bridge-header">
                      <span className="label">Related News</span>
                      <span>연결 대기</span>
                    </div>
                    <p>현재 연결된 섹터 뉴스가 아직 충분하지 않아. 이후 AI 분류를 붙이면 이 매칭 정확도를 더 올릴 수 있어.</p>
                  </div>
                )}
                <div className="inline-actions">
                  <span className={`mini-badge ${pick.source === 'USER' ? 'user' : 'base'}`}>{pick.source}</span>
                  {pick.source === 'USER' && pick.id ? (
                    <button type="button" className="ghost-button danger" onClick={() => void onDeleteAiPick(pick.id)}>
                      삭제
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </article>

      <article className="panel side-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AI Pick Input</p>
            <h2>추천 종목 추가</h2>
          </div>
        </div>
        <div className="watch-form">
          <div className="form-grid">
            <select value={aiPickForm.market} onChange={(event) => setAiPickForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
              <option value="KR">한국</option>
              <option value="US">미국</option>
            </select>
            <input value={aiPickForm.ticker} onChange={(event) => setAiPickForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
            <input value={aiPickForm.name} onChange={(event) => setAiPickForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
            <input value={aiPickForm.confidence} onChange={(event) => setAiPickForm((prev) => ({ ...prev, confidence: event.target.value }))} placeholder="신뢰도" />
            <input value={aiPickForm.expectedReturnRate} onChange={(event) => setAiPickForm((prev) => ({ ...prev, expectedReturnRate: event.target.value }))} placeholder="예상 수익률" />
            <input value={aiPickForm.basis} onChange={(event) => setAiPickForm((prev) => ({ ...prev, basis: event.target.value }))} placeholder="추천 근거" />
          </div>
          <textarea value={aiPickForm.note} onChange={(event) => setAiPickForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="추천 메모" rows={3} />
          <div className="inline-actions">
            <button type="button" className="primary-button" disabled={isSavingAiPick} onClick={() => void onSaveAiPick()}>
              {isSavingAiPick ? '저장 중...' : 'AI 추천 저장'}
            </button>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Track Record</p>
            <h2>추천 신뢰도</h2>
          </div>
          <SourceBadge label="MIXED" tone="mixed" />
        </div>
        <div className="watch-form">
          <div className="form-grid">
            <input type="date" value={aiTrackRecordForm.recommendedDate} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, recommendedDate: event.target.value }))} />
            <select value={aiTrackRecordForm.market} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
              <option value="KR">한국</option>
              <option value="US">미국</option>
            </select>
            <input value={aiTrackRecordForm.ticker} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
            <input value={aiTrackRecordForm.name} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
            <input value={aiTrackRecordForm.entryPrice} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, entryPrice: event.target.value }))} placeholder="진입가" />
            <input value={aiTrackRecordForm.latestPrice} onChange={(event) => setAiTrackRecordForm((prev) => ({ ...prev, latestPrice: event.target.value }))} placeholder="현재가" />
          </div>
          <div className="inline-actions">
            <button type="button" className="primary-button" disabled={isSavingAiTrackRecord} onClick={() => void onSaveAiTrackRecord()}>
              {isSavingAiTrackRecord ? '저장 중...' : '추천 성과 저장'}
            </button>
          </div>
        </div>
        <div className="watchlist">
          {aiRecommendations.trackRecords.map((record) => (
            <article key={`${record.source}-${record.id || `${record.recommendedDate}-${record.market}-${record.ticker}`}`} className="watch-item">
              <div>
                <strong>{record.name}</strong>
                <span>{record.recommendedDate} · {record.market} · {record.ticker}</span>
              </div>
              <div className="watch-metrics">
                <strong>{formatNumber(record.entryPrice)} → {formatNumber(record.latestPrice)}</strong>
                <span className={record.realizedReturnRate >= 0 ? 'up' : 'down'}>
                  {formatSignedRate(record.realizedReturnRate)}
                </span>
              </div>
              <p>{record.success ? '추천 이후 수익권' : '추천 이후 손실권'}</p>
              <div className="inline-actions">
                <span className={`mini-badge ${record.source === 'USER' ? 'user' : 'base'}`}>{record.source}</span>
                {record.source === 'USER' && record.id ? (
                  <button type="button" className="ghost-button danger" onClick={() => void onDeleteAiTrackRecord(record.id)}>
                    삭제
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Execution Log</p>
            <h2>추천 근거/성과 로그</h2>
          </div>
          <SourceBadge label="MIXED" tone="mixed" />
        </div>
        <div className="watchlist">
          {aiRecommendations.executionLogs.map((log) => (
            <article key={`${log.date}-${log.market}-${log.ticker}-${log.stage}`} className="watch-item">
              <div>
                <strong>{log.name}</strong>
                <span>{log.date} · {log.market} · {log.ticker} · {log.stage}</span>
              </div>
              <div className="watch-metrics">
                <strong>{log.status}</strong>
                <span className={(log.realizedReturnRate ?? 0) >= 0 ? 'up' : 'down'}>
                  {log.realizedReturnRate == null ? '-' : formatSignedRate(log.realizedReturnRate)}
                </span>
              </div>
              <p>{log.rationale}</p>
              <div className="inline-actions">
                {log.confidence != null ? <span className="mini-badge base">신뢰도 {log.confidence}</span> : null}
                {log.expectedReturnRate != null ? <span className="mini-badge base">예상 {formatSignedRate(log.expectedReturnRate)}</span> : null}
                <span className={`mini-badge ${log.source === 'USER' ? 'user' : 'base'}`}>{log.source}</span>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}
