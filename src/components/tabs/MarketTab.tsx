import { lazy, Suspense } from 'react'
import { SourceBadge } from '../SourceBadge'
import { getSentimentIcon } from '../../lib/format'
import { getImpactLevelLabel } from '../../lib/news'
import type { AlternativeSignal, MarketPrimaryTab, MarketSection, MarketTab, NewsCluster } from '../../types'

const MarketIndexCharts = lazy(() => import('../MarketIndexCharts'))

type Props = {
  activeMarketTab: MarketTab
  setActiveMarketTab: React.Dispatch<React.SetStateAction<MarketTab>>
  activeMarketPrimaryTab: MarketPrimaryTab
  setActiveMarketPrimaryTab: React.Dispatch<React.SetStateAction<MarketPrimaryTab>>
  marketSection: MarketSection
  alternativeSignals: AlternativeSignal[]
  marketNewsDigest: string
  newsClusters: NewsCluster[]
  visibleNewsClusters: NewsCluster[]
  expandedNewsClusters: string[]
  onToggleNewsCluster: (clusterKey: string) => void
  showAllNewsGroups: boolean
  setShowAllNewsGroups: React.Dispatch<React.SetStateAction<boolean>>
}

export function MarketTab({
  activeMarketTab,
  setActiveMarketTab,
  activeMarketPrimaryTab,
  setActiveMarketPrimaryTab,
  marketSection,
  alternativeSignals,
  marketNewsDigest,
  newsClusters,
  visibleNewsClusters,
  expandedNewsClusters,
  onToggleNewsCluster,
  showAllNewsGroups,
  setShowAllNewsGroups,
}: Props) {
  const getAlternativeTone = (score: number) => {
    if (score >= 75) return 'hot'
    if (score >= 45) return 'warm'
    return 'calm'
  }

  return (
    <>
      <section className="sub-tab-bar">
        {(['KR', 'US'] as const).map((market) => (
          <button
            key={market}
            type="button"
            className={`sub-tab-chip${activeMarketTab === market ? ' active' : ''}`}
            onClick={() => setActiveMarketTab(market)}
          >
            {market === 'KR' ? '한국 시장' : '미국 시장'}
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel market-main-panel">
          <div className="market-main-header">
            <div>
              <p className="eyebrow">{marketSection?.title ?? 'Market'}</p>
              <h2>{activeMarketPrimaryTab === 'chart' ? '지수와 차트' : '개인 · 외국인 · 기관'}</h2>
            </div>
            <SourceBadge
              label={activeMarketPrimaryTab === 'chart'
                ? activeMarketTab === 'KR' ? 'LIVE' : 'LIVE+'
                : activeMarketTab === 'KR' ? 'LIVE' : 'MOCK'}
              tone={activeMarketPrimaryTab === 'chart'
                ? 'live'
                : activeMarketTab === 'KR' ? 'live' : 'mock'}
            />
          </div>

          <div className="market-insight-header">
            <div className="sub-tab-bar compact">
              <button
                type="button"
                className={`sub-tab-chip${activeMarketPrimaryTab === 'chart' ? ' active' : ''}`}
                onClick={() => setActiveMarketPrimaryTab('chart')}
              >
                지수와 차트
              </button>
              <button
                type="button"
                className={`sub-tab-chip${activeMarketPrimaryTab === 'flow' ? ' active' : ''}`}
                onClick={() => setActiveMarketPrimaryTab('flow')}
              >
                개인 · 외국인 · 기관
              </button>
            </div>
          </div>

          {activeMarketPrimaryTab === 'chart' ? (
            <Suspense fallback={<div className="tv-chart-container chart-loading">차트 모듈 로딩 중...</div>}>
              <MarketIndexCharts indices={marketSection?.indices ?? []} />
            </Suspense>
          ) : (
            <div className="flow-list market-insight-list">
              {marketSection?.investorFlows.map((flow) => (
                <article key={flow.investor} className="watch-item">
                  <div>
                    <strong>{flow.investor}</strong>
                    <span>{flow.positive ? '순매수' : '순매도'}</span>
                  </div>
                  <div className="watch-metrics">
                    <strong>{flow.amountBillionWon > 0 ? '+' : ''}{flow.amountBillionWon.toFixed(0)}억</strong>
                  </div>
                  <p>{flow.note}</p>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="grid content">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sentiment</p>
              <h2>공포 · 열기 지표</h2>
            </div>
            <SourceBadge label={activeMarketTab === 'KR' ? 'LIVE' : 'LIVE+'} tone="live" />
          </div>
          <div className="signal-list market-insight-list">
            {marketSection?.sentiment.map((metric) => (
              <article key={metric.label} className="signal-item">
                <div className="signal-title-row">
                  <span className="label">{metric.label}</span>
                  <span className="sentiment-icon" aria-hidden="true">{getSentimentIcon(metric.score)}</span>
                </div>
                <strong>{metric.state} · {metric.score}</strong>
                <p>{metric.note}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Alternative</p>
              <h2>실험 지표</h2>
            </div>
            <SourceBadge label="EXPERIMENTAL" tone="mock" />
          </div>
          <div className="signal-list market-insight-list">
            {alternativeSignals.map((signal) => (
              <article key={signal.label} className={`signal-item signal-item-alt signal-item-alt--${getAlternativeTone(signal.score)}`}>
                <div className="signal-title-row">
                  <span className="label">{signal.label}</span>
                  <span className="sentiment-icon" aria-hidden="true">{getSentimentIcon(signal.score)}</span>
                </div>
                <div className="signal-score-row">
                  <strong>{signal.state}</strong>
                  <span className="signal-score-badge">{signal.score}</span>
                </div>
                <div className="signal-chip-row">
                  {signal.highlights.map((item) => (
                    <span key={`${signal.label}-${item}`} className="signal-data-chip">{item}</span>
                  ))}
                </div>
                <p>{signal.note}</p>
                <a className="news-inline-link" href={signal.url} target="_blank" rel="noreferrer">
                  {signal.source}
                </a>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">News Radar</p>
              <h2>주요 뉴스</h2>
            </div>
            <SourceBadge label="LIVE" tone="live" />
          </div>
          <article className="market-news-digest">
            <div>
              <span className="label">Market Digest</span>
              <strong>{activeMarketTab === 'KR' ? '한국 시장 뉴스 요약' : '미국 시장 뉴스 요약'}</strong>
            </div>
            <p>{marketNewsDigest}</p>
          </article>
          <div className="news-summary-grid">
            {newsClusters.slice(0, 3).map((cluster) => (
              <article key={cluster.clusterKey} className="news-summary-card">
                <span className="label">{cluster.sector}</span>
                <strong>{cluster.marketImpactScore}</strong>
                <p>{cluster.summary}</p>
                <small>{cluster.items.length}건 묶음</small>
              </article>
            ))}
          </div>
          <div className="news-list">
            {visibleNewsClusters.map((cluster) => {
              const expanded = expandedNewsClusters.includes(cluster.clusterKey)
              const itemsToRender = expanded ? cluster.items : cluster.items.slice(0, 1)

              return (
                <article key={cluster.clusterKey} className="news-group-card">
                  <div className="news-group-header">
                    <div>
                      <strong>{cluster.summary}</strong>
                      <p>{cluster.sector} · 시장 영향도 {cluster.marketImpactScore}</p>
                    </div>
                    <span className={`news-signal-chip ${cluster.direction}`}>
                      {cluster.direction === 'positive' ? '호재 묶음' : cluster.direction === 'negative' ? '악재 묶음' : '중립 묶음'}
                    </span>
                  </div>
                  <div className="news-group-list">
                    {itemsToRender.map((item) => {
                      const signal = item.classification
                      return (
                        <a key={`${item.source}-${item.title}`} className="news-item" href={item.url} target="_blank" rel="noreferrer">
                          <div className="news-title-row">
                            <strong>{item.title}</strong>
                            <span className="news-icon" aria-label={signal.label}>{signal.icon}</span>
                          </div>
                          <div className="news-meta-row">
                            <span>{item.source}</span>
                            <div className="news-chip-row">
                              <span className={`news-signal-chip ${signal.direction}`}>{signal.label}</span>
                              <span className="news-signal-chip sector">{signal.sector}</span>
                              <span className="news-signal-chip impact">{getImpactLevelLabel(signal.impactLevel)}</span>
                              <span className="news-signal-chip impact">영향도 {signal.marketImpactScore}</span>
                            </div>
                          </div>
                          <p>{item.impact}</p>
                        </a>
                      )
                    })}
                  </div>
                  {cluster.items.length > 1 ? (
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onToggleNewsCluster(cluster.clusterKey)}
                      >
                        {expanded ? '접기' : `기사 ${cluster.items.length - 1}개 더보기`}
                      </button>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
          {newsClusters.length > 3 ? (
            <div className="inline-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowAllNewsGroups((prev) => !prev)}
              >
                {showAllNewsGroups ? '뉴스 묶음 축약' : `뉴스 묶음 전체 보기 (${newsClusters.length})`}
              </button>
            </div>
          ) : null}
        </article>
      </section>
    </>
  )
}
