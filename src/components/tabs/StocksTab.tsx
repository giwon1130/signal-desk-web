import { SourceBadge } from '../SourceBadge'
import { formatNumber, formatSignedRate } from '../../lib/format'
import { emptyWatchForm } from '../../constants'
import type { StockDetailSnapshot, StockMarketFilter, TickerSnapshot, WatchForm, WatchItem } from '../../types'

type Props = {
  stockSearch: string
  setStockSearch: React.Dispatch<React.SetStateAction<string>>
  stockMarketFilter: StockMarketFilter
  setStockMarketFilter: React.Dispatch<React.SetStateAction<StockMarketFilter>>
  isSearchingStocks: boolean
  isSearchMode: boolean
  filteredMovers: TickerSnapshot[]
  onSelectStock: (detailKey: string) => void
  onApplyMoverToWatchForm: (item: TickerSnapshot, market: 'KR' | 'US') => void
  koreaMarketTickers: string[]
  selectedStockDetail: StockDetailSnapshot | null
  watchForm: WatchForm
  setWatchForm: React.Dispatch<React.SetStateAction<WatchForm>>
  isSavingWatch: boolean
  onSaveWatchItem: () => void | Promise<void>
  filteredWatchlist: WatchItem[]
  onApplyWatchToPortfolioForm: (item: WatchItem) => void
  onDeleteWatchItem: (id: string) => void | Promise<void>
}

export function StocksTab({
  stockSearch,
  setStockSearch,
  stockMarketFilter,
  setStockMarketFilter,
  isSearchingStocks,
  isSearchMode,
  filteredMovers,
  onSelectStock,
  onApplyMoverToWatchForm,
  koreaMarketTickers,
  selectedStockDetail,
  watchForm,
  setWatchForm,
  isSavingWatch,
  onSaveWatchItem,
  filteredWatchlist,
  onApplyWatchToPortfolioForm,
  onDeleteWatchItem,
}: Props) {
  return (
    <section className="grid content stocks-layout">
      <article className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Market Movers</p>
            <h2>종목 보기</h2>
          </div>
          <SourceBadge label="MIXED" tone="mixed" />
        </div>
        <div className="stock-toolbar">
          <input
            value={stockSearch}
            onChange={(event) => setStockSearch(event.target.value)}
            className="stock-search-input"
            placeholder="종목명, 티커, 섹터 검색 (2자 이상)"
          />
          <div className="stock-market-filter">
            {(['ALL', 'KR', 'US'] as StockMarketFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                className={`period-chip${stockMarketFilter === f ? ' active' : ''}`}
                onClick={() => setStockMarketFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="stock-search-meta">
          {isSearchingStocks
            ? <span className="stock-result-count">검색 중...</span>
            : isSearchMode
              ? <span className="stock-result-count">검색 결과 {filteredMovers.length}개</span>
              : <span className="stock-result-count">주요 종목 {filteredMovers.length}개</span>
          }
        </div>
        <div className="watchlist">
          {filteredMovers.length === 0 && !isSearchingStocks ? (
            <p className="stock-result-count">
              {isSearchMode ? `'${stockSearch}' 검색 결과가 없어.` : '종목 데이터를 불러오는 중이야.'}
            </p>
          ) : filteredMovers.map((item) => {
            const market = ('market' in item ? (item as { market: string }).market : null)
              ?? (koreaMarketTickers.includes(item.ticker) ? 'KR' : 'US')
            const detailKey = `${market}:${item.ticker}`
            return (
              <article key={`${item.ticker}-${item.name}`} className="watch-item">
                <div>
                  <strong>{item.name}</strong>
                  <span><span className={`mini-badge ${market === 'KR' ? 'user' : 'base'}`}>{market}</span> {item.ticker} · {item.sector}</span>
                </div>
                <div className="watch-metrics">
                  <strong>{formatNumber(item.price)}</strong>
                  <span className={item.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(item.changeRate)}</span>
                </div>
                <p>{item.stance}</p>
                <div className="inline-actions">
                  <button type="button" className="ghost-button" onClick={() => onSelectStock(detailKey)}>
                    상세 보기
                  </button>
                  <button type="button" className="action-button" onClick={() => onApplyMoverToWatchForm(item, market as 'KR' | 'US')}>
                    관심 추가
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {selectedStockDetail ? (
          <article className="stock-detail-panel">
            <div className="stock-detail-header">
              <div>
                <p className="eyebrow">Stock Detail</p>
                <h3>{selectedStockDetail.name}</h3>
                <span>{selectedStockDetail.market} · {selectedStockDetail.ticker} · {selectedStockDetail.sector}</span>
              </div>
              <div className="watch-metrics">
                <strong>{formatNumber(selectedStockDetail.price)}</strong>
                <span className={selectedStockDetail.changeRate >= 0 ? 'up' : 'down'}>
                  {formatSignedRate(selectedStockDetail.changeRate)}
                </span>
              </div>
            </div>

            <p>{selectedStockDetail.stance}</p>

            <div className="stock-detail-grid">
              <article className="stock-detail-card">
                <span className="label">관심종목</span>
                <strong>{selectedStockDetail.watchItem ? '등록됨' : '미등록'}</strong>
                <p>{selectedStockDetail.watchItem?.note ?? '아직 관심종목 메모가 없어.'}</p>
              </article>
              <article className="stock-detail-card">
                <span className="label">포트폴리오</span>
                <strong>{selectedStockDetail.portfolioPosition ? '보유 중' : '미보유'}</strong>
                <p>
                  {selectedStockDetail.portfolioPosition
                    ? `${selectedStockDetail.portfolioPosition.quantity}주 · ${formatSignedRate(selectedStockDetail.portfolioPosition.profitRate)}`
                    : '현재 포트폴리오에 없음'}
                </p>
              </article>
              <article className="stock-detail-card">
                <span className="label">AI 추천</span>
                <strong>{selectedStockDetail.aiPick ? '추천 있음' : '추천 없음'}</strong>
                <p>
                  {selectedStockDetail.aiPick
                    ? `신뢰도 ${selectedStockDetail.aiPick.confidence} · 예상 ${formatSignedRate(selectedStockDetail.aiPick.expectedReturnRate)}`
                    : '현재 AI 추천 목록에 없음'}
                </p>
              </article>
            </div>

            <div className="stock-detail-news">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Related News</p>
                  <h3>연관 뉴스</h3>
                </div>
              </div>
              {selectedStockDetail.relatedNews.length ? (
                <div className="source-list">
                  {selectedStockDetail.relatedNews.map((item) => (
                    <a key={`${item.source}-${item.title}`} href={item.url} target="_blank" rel="noreferrer" className="source-item">
                      <strong>{item.title}</strong>
                      <span>{item.source} · {item.impact}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="source-summary">직접 매칭된 뉴스가 없어. 뉴스 분류 기준을 확장하면 연결률이 올라가.</p>
              )}
            </div>
          </article>
        ) : null}
      </article>

      <article className="panel side-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Watchlist</p>
            <h2>관심 종목</h2>
          </div>
          <SourceBadge label="MIXED" tone="mixed" />
        </div>
        <div className="watch-form">
          <div className="form-grid">
            <select value={watchForm.market} onChange={(event) => setWatchForm((prev) => ({ ...prev, market: event.target.value as 'KR' | 'US' }))}>
              <option value="KR">한국</option>
              <option value="US">미국</option>
            </select>
            <input value={watchForm.ticker} onChange={(event) => setWatchForm((prev) => ({ ...prev, ticker: event.target.value }))} placeholder="티커" />
            <input value={watchForm.name} onChange={(event) => setWatchForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="종목명" />
            <input value={watchForm.sector} onChange={(event) => setWatchForm((prev) => ({ ...prev, sector: event.target.value }))} placeholder="섹터" />
            <input value={watchForm.price} onChange={(event) => setWatchForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="현재가" />
            <input value={watchForm.changeRate} onChange={(event) => setWatchForm((prev) => ({ ...prev, changeRate: event.target.value }))} placeholder="등락률" />
          </div>
          <input value={watchForm.stance} onChange={(event) => setWatchForm((prev) => ({ ...prev, stance: event.target.value }))} placeholder="관점" />
          <textarea value={watchForm.note} onChange={(event) => setWatchForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="메모" rows={3} />
          <div className="inline-actions">
            <button type="button" className="primary-button" disabled={isSavingWatch} onClick={() => void onSaveWatchItem()}>
              {isSavingWatch ? '저장 중...' : '관심종목 저장'}
            </button>
            <button type="button" className="ghost-button" onClick={() => setWatchForm(emptyWatchForm)}>
              초기화
            </button>
          </div>
        </div>

        <div className="watchlist">
          {filteredWatchlist.map((item) => (
            <article key={`${item.source}-${item.id || item.ticker}-${item.market}`} className="watch-item">
              <div>
                <strong>{item.name}</strong>
                <span>{item.market} · {item.ticker} · {item.sector}</span>
              </div>
              <div className="watch-metrics">
                <strong>{formatNumber(item.price)}</strong>
                <span className={item.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(item.changeRate)}</span>
              </div>
              <p>{item.stance} · {item.note}</p>
              <div className="inline-actions">
                <span className={`mini-badge ${item.source === 'USER' ? 'user' : 'base'}`}>{item.source}</span>
                <button type="button" className="action-button" onClick={() => onApplyWatchToPortfolioForm(item)}>
                  보유 편입
                </button>
                {item.source === 'USER' && item.id ? (
                  <button type="button" className="ghost-button danger" onClick={() => void onDeleteWatchItem(item.id)}>
                    삭제
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}
