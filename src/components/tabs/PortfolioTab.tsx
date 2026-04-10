import { emptyPortfolioForm } from '../../constants'
import { formatNumber, formatSignedRate } from '../../lib/format'
import { SourceBadge } from '../SourceBadge'
import type { DailyBriefing, PortfolioForm, PortfolioSummary } from '../../types'

type Props = {
  portfolio: PortfolioSummary
  userPortfolioCount: number
  portfolioForm: PortfolioForm
  setPortfolioForm: React.Dispatch<React.SetStateAction<PortfolioForm>>
  isSavingPortfolio: boolean
  onSavePortfolioPosition: () => void | Promise<void>
  onDeletePortfolioPosition: (id: string) => void | Promise<void>
  briefing: DailyBriefing
}

export function PortfolioTab({
  portfolio,
  userPortfolioCount,
  portfolioForm,
  setPortfolioForm,
  isSavingPortfolio,
  onSavePortfolioPosition,
  onDeletePortfolioPosition,
  briefing,
}: Props) {
  return (
    <>
      <section className="grid cards">
        <article className="panel metric-card">
          <span className="label">Total Cost</span>
          <strong>{formatNumber(portfolio.totalCost ?? 0)}</strong>
          <small>총 매입금액</small>
        </article>
        <article className="panel metric-card">
          <span className="label">Evaluation</span>
          <strong>{formatNumber(portfolio.totalValue ?? 0)}</strong>
          <small>평가금액</small>
        </article>
        <article className="panel metric-card">
          <span className="label">Profit</span>
          <strong>{formatNumber(portfolio.totalProfit ?? 0)}</strong>
          <p className={(portfolio.totalProfitRate ?? 0) >= 0 ? 'up' : 'down'}>
            {formatSignedRate(portfolio.totalProfitRate ?? 0)}
          </p>
          <small>현재 수익률</small>
        </article>
        <article className="panel metric-card">
          <span className="label">User Positions</span>
          <strong>{userPortfolioCount}</strong>
          <small>직접 추가한 보유 종목</small>
        </article>
      </section>

      <section className="grid content stocks-layout">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Positions</p>
              <h2>보유 종목</h2>
            </div>
            <SourceBadge label="MIXED" tone="mixed" />
          </div>
          <div className="watchlist">
            {portfolio.positions.map((position) => (
              <article key={`${position.source}-${position.id || position.ticker}-${position.market}`} className="watch-item">
                <div>
                  <strong>{position.name}</strong>
                  <span>{position.market} · {position.ticker} · {position.quantity}주</span>
                </div>
                <div className="watch-metrics">
                  <strong>{formatNumber(position.currentPrice)}</strong>
                  <span className={position.profitRate >= 0 ? 'up' : 'down'}>{formatSignedRate(position.profitRate)}</span>
                </div>
                <p>
                  매수가 {formatNumber(position.buyPrice)} / 평가금액 {formatNumber(position.evaluationAmount)} / 손익 {formatNumber(position.profitAmount)}
                </p>
                <div className="inline-actions">
                  <span className={`mini-badge ${position.source === 'USER' ? 'user' : 'base'}`}>{position.source}</span>
                  {position.source === 'USER' && position.id ? (
                    <button type="button" className="ghost-button danger" onClick={() => void onDeletePortfolioPosition(position.id)}>
                      삭제
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel side-stack">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Portfolio Input</p>
              <h2>보유 종목 추가</h2>
            </div>
          </div>
          <div className="watch-form">
            <div className="form-grid">
              <select value={portfolioForm.market} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
                <option value="KR">한국</option>
                <option value="US">미국</option>
              </select>
              <input value={portfolioForm.ticker} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
              <input value={portfolioForm.name} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
              <input value={portfolioForm.buyPrice} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, buyPrice: event.target.value }))} placeholder="매수가" />
              <input value={portfolioForm.currentPrice} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, currentPrice: event.target.value }))} placeholder="현재가" />
              <input value={portfolioForm.quantity} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, quantity: event.target.value }))} placeholder="수량" />
            </div>
            <div className="inline-actions">
              <button type="button" className="primary-button" disabled={isSavingPortfolio} onClick={() => void onSavePortfolioPosition()}>
                {isSavingPortfolio ? '저장 중...' : '포트폴리오 저장'}
              </button>
              <button type="button" className="ghost-button" onClick={() => setPortfolioForm(emptyPortfolioForm)}>
                초기화
              </button>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Daily Briefing</p>
              <h2>장전 / 장후</h2>
            </div>
          </div>
          <p className="headline">{briefing.headline}</p>
          <div className="split-list">
            <div>
              <span className="label">Pre Market</span>
              <ul className="brief-list">
                {briefing.preMarket.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <span className="label">After Market</span>
              <ul className="brief-list">
                {briefing.afterMarket.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </>
  )
}
