import { SourceBadge } from '../SourceBadge'
import { formatNumber, formatSignedRate } from '../../lib/format'
import type { PaperPositionForm, PaperTradeForm, PaperTradingSummary } from '../../types'

type Props = {
  paperTrading: PaperTradingSummary
  paperPositionForm: PaperPositionForm
  setPaperPositionForm: React.Dispatch<React.SetStateAction<PaperPositionForm>>
  paperTradeForm: PaperTradeForm
  setPaperTradeForm: React.Dispatch<React.SetStateAction<PaperTradeForm>>
  isSavingPaperPosition: boolean
  isSavingPaperTrade: boolean
  onSavePaperPosition: () => void | Promise<void>
  onDeletePaperPosition: (id: string) => void | Promise<void>
  onSavePaperTrade: () => void | Promise<void>
  onDeletePaperTrade: (id: string) => void | Promise<void>
}

export function PaperTab({
  paperTrading,
  paperPositionForm,
  setPaperPositionForm,
  paperTradeForm,
  setPaperTradeForm,
  isSavingPaperPosition,
  isSavingPaperTrade,
  onSavePaperPosition,
  onDeletePaperPosition,
  onSavePaperTrade,
  onDeletePaperTrade,
}: Props) {
  return (
    <>
      <section className="grid cards">
        <article className="panel metric-card">
          <span className="label">Cash</span>
          <strong>{formatNumber(paperTrading.cash ?? 0)}</strong>
          <small>모의 투자 현금</small>
        </article>
        <article className="panel metric-card">
          <span className="label">Evaluation</span>
          <strong>{formatNumber(paperTrading.evaluation ?? 0)}</strong>
          <small>평가 자산</small>
        </article>
        <article className="panel metric-card">
          <span className="label">Return</span>
          <strong>{formatSignedRate(paperTrading.totalReturnRate ?? 0)}</strong>
          <small>누적 수익률</small>
        </article>
      </section>

      <section className="grid content stocks-layout">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Open Positions</p>
              <h2>모의 보유 종목</h2>
            </div>
            <SourceBadge label="MIXED" tone="mixed" />
          </div>
          <div className="watchlist">
            {paperTrading.openPositions.map((position) => (
              <article key={`${position.source}-${position.id || position.ticker}-${position.market}`} className="watch-item">
                <div>
                  <strong>{position.name}</strong>
                  <span>{position.market} · {position.ticker} · {position.quantity}주</span>
                </div>
                <div className="watch-metrics">
                  <strong>{formatNumber(position.currentPrice)}</strong>
                  <span className={position.returnRate >= 0 ? 'up' : 'down'}>{formatSignedRate(position.returnRate)}</span>
                </div>
                <p>평단 {formatNumber(position.averagePrice)}</p>
                <div className="inline-actions">
                  <span className={`mini-badge ${position.source === 'USER' ? 'user' : 'base'}`}>{position.source}</span>
                  {position.source === 'USER' && position.id ? (
                    <button type="button" className="ghost-button danger" onClick={() => void onDeletePaperPosition(position.id)}>
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
              <p className="eyebrow">Paper Position Input</p>
              <h2>모의 보유종목 추가</h2>
            </div>
          </div>
          <div className="watch-form">
            <div className="form-grid">
              <select value={paperPositionForm.market} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
                <option value="KR">한국</option>
                <option value="US">미국</option>
              </select>
              <input value={paperPositionForm.ticker} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
              <input value={paperPositionForm.name} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
              <input value={paperPositionForm.averagePrice} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, averagePrice: event.target.value }))} placeholder="평단" />
              <input value={paperPositionForm.currentPrice} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, currentPrice: event.target.value }))} placeholder="현재가" />
              <input value={paperPositionForm.quantity} onChange={(event) => setPaperPositionForm((prev) => ({ ...prev, quantity: event.target.value }))} placeholder="수량" />
            </div>
            <div className="inline-actions">
              <button type="button" className="primary-button" disabled={isSavingPaperPosition} onClick={() => void onSavePaperPosition()}>
                {isSavingPaperPosition ? '저장 중...' : '모의 보유 저장'}
              </button>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Trade Log</p>
              <h2>최근 모의 거래</h2>
            </div>
            <SourceBadge label="MOCK" tone="mock" />
          </div>
          <div className="watch-form">
            <div className="form-grid">
              <input type="date" value={paperTradeForm.tradeDate} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, tradeDate: event.target.value }))} />
              <select value={paperTradeForm.side} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, side: event.target.value as 'BUY' | 'SELL' }))}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              <select value={paperTradeForm.market} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
                <option value="KR">한국</option>
                <option value="US">미국</option>
              </select>
              <input value={paperTradeForm.ticker} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
              <input value={paperTradeForm.name} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
              <input value={paperTradeForm.price} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="가격" />
              <input value={paperTradeForm.quantity} onChange={(event) => setPaperTradeForm((prev) => ({ ...prev, quantity: event.target.value }))} placeholder="수량" />
            </div>
            <div className="inline-actions">
              <button type="button" className="primary-button" disabled={isSavingPaperTrade} onClick={() => void onSavePaperTrade()}>
                {isSavingPaperTrade ? '저장 중...' : '거래 로그 저장'}
              </button>
            </div>
          </div>
          <div className="watchlist">
            {paperTrading.recentTrades.map((trade) => (
              <article key={`${trade.source}-${trade.id || `${trade.tradeDate}-${trade.side}-${trade.ticker}`}`} className="watch-item">
                <div>
                  <strong>{trade.name}</strong>
                  <span>{trade.tradeDate} · {trade.market} · {trade.side}</span>
                </div>
                <div className="watch-metrics">
                  <strong>{formatNumber(trade.price)}</strong>
                  <span>{trade.quantity}주</span>
                </div>
                <div className="inline-actions">
                  <span className={`mini-badge ${trade.source === 'USER' ? 'user' : 'base'}`}>{trade.source}</span>
                  {trade.source === 'USER' && trade.id ? (
                    <button type="button" className="ghost-button danger" onClick={() => void onDeletePaperTrade(trade.id)}>
                      삭제
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
