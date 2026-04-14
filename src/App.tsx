import { useEffect, useMemo, useState } from 'react'
import { SourceBadge } from './components/SourceBadge'
import { SourceMapPanel } from './components/SourceMapPanel'
import { AiTab } from './components/tabs/AiTab'
import { MarketTab } from './components/tabs/MarketTab'
import { PaperTab } from './components/tabs/PaperTab'
import { PortfolioTab } from './components/tabs/PortfolioTab'
import { StocksTab } from './components/tabs/StocksTab'
import {
  API_BASE_URL,
  emptyAiPickForm,
  emptyAiTrackRecordForm,
  emptyPaperPositionForm,
  emptyPaperTradeForm,
  emptyPortfolioForm,
  emptyWatchForm,
  mainTabs,
} from './constants'
import { buildFreshnessLabel, formatNumber, formatSignedRate, getSentimentIcon } from './lib/format'
import {
  buildMarketNewsDigest,
  buildNewsClusterKey,
  classifyNews,
  summarizeCluster,
} from './lib/news'
import { useMarketData } from './hooks/useMarketData'
import { useWorkspaceActions } from './hooks/useWorkspaceActions'
import type {
  AiPickForm,
  AiPickNewsLink,
  AiTrackRecordForm,
  MainTab,
  MarketPrimaryTab,
  MarketTab,
  NewsClassification,
  NewsCluster,
  PaperPositionForm,
  PaperTradeForm,
  PortfolioForm,
  MarketNews,
  StockDetailSnapshot,
  StockMarketFilter,
  StockSearchResult,
  WatchForm,
} from './types'

export default function App() {
  const {
    overview,
    loadedTabs,
    workspaceCounts,
    tabErrors,
    setTabErrors,
    tabLoading,
    fetchSummary,
    fetchStocksTabData,
    fetchPortfolioTabData,
    fetchAiTabData,
    fetchPaperTabData,
  } = useMarketData()
  const [activeTab, setActiveTab] = useState<MainTab>('market')
  const [activeMarketTab, setActiveMarketTab] = useState<MarketTab>('KR')
  const [activeMarketPrimaryTab, setActiveMarketPrimaryTab] = useState<MarketPrimaryTab>('chart')
  const [stockSearch, setStockSearch] = useState('')
  const [stockMarketFilter, setStockMarketFilter] = useState<StockMarketFilter>('ALL')
  const [stockSearchResults, setStockSearchResults] = useState<StockSearchResult[]>([])
  const [isSearchingStocks, setIsSearchingStocks] = useState(false)
  const [watchForm, setWatchForm] = useState<WatchForm>(emptyWatchForm)
  const [portfolioForm, setPortfolioForm] = useState<PortfolioForm>(emptyPortfolioForm)
  const [isSavingWatch, setIsSavingWatch] = useState(false)
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false)
  const [paperPositionForm, setPaperPositionForm] = useState<PaperPositionForm>(emptyPaperPositionForm)
  const [paperTradeForm, setPaperTradeForm] = useState<PaperTradeForm>(emptyPaperTradeForm)
  const [isSavingPaperPosition, setIsSavingPaperPosition] = useState(false)
  const [isSavingPaperTrade, setIsSavingPaperTrade] = useState(false)
  const [aiPickForm, setAiPickForm] = useState<AiPickForm>(emptyAiPickForm)
  const [aiTrackRecordForm, setAiTrackRecordForm] = useState<AiTrackRecordForm>(emptyAiTrackRecordForm)
  const [isSavingAiPick, setIsSavingAiPick] = useState(false)
  const [isSavingAiTrackRecord, setIsSavingAiTrackRecord] = useState(false)
  const [showAllNewsGroups, setShowAllNewsGroups] = useState(false)
  const [expandedNewsClusters, setExpandedNewsClusters] = useState<string[]>([])
  const [selectedStockKey, setSelectedStockKey] = useState('')

  useEffect(() => {
    if (activeTab === 'stocks' && !loadedTabs.stocks) {
      void fetchStocksTabData()
    }
    if (activeTab === 'portfolio' && !loadedTabs.portfolio) {
      void fetchPortfolioTabData()
    }
    if (activeTab === 'ai' && !loadedTabs.ai) {
      void fetchAiTabData()
    }
    if (activeTab === 'paper' && !loadedTabs.paper) {
      void fetchPaperTabData()
    }
  }, [activeTab, loadedTabs])

  useEffect(() => {
    setShowAllNewsGroups(false)
    setExpandedNewsClusters([])
  }, [activeMarketTab])

  // Debounced stock search
  useEffect(() => {
    const keyword = stockSearch.trim()
    if (keyword.length < 2) {
      setStockSearchResults([])
      return
    }
    setIsSearchingStocks(true)
    const timer = setTimeout(async () => {
      try {
        const marketParam = stockMarketFilter !== 'ALL' ? `&market=${stockMarketFilter}` : ''
        const response = await fetch(`${API_BASE_URL}/api/v1/market/stocks/search?q=${encodeURIComponent(keyword)}${marketParam}&limit=30`)
        if (!response.ok) throw new Error('search')
        const result = await response.json() as { success: boolean; data: StockSearchResult[] }
        setStockSearchResults(result.data)
      } catch {
        setStockSearchResults([])
      } finally {
        setIsSearchingStocks(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [stockSearch, stockMarketFilter])

  const marketSection = useMemo(
    () => (activeMarketTab === 'KR' ? overview.koreaMarket : overview.usMarket),
    [activeMarketTab, overview],
  )

  const filteredMovers = useMemo(() => {
    // When search API results are available, use them
    if (stockSearch.trim().length >= 2 && stockSearchResults.length > 0) {
      return stockSearchResults
    }
    // Otherwise filter leading stocks by market filter + keyword
    const baseItems = [...overview.koreaMarket.leadingStocks, ...overview.usMarket.leadingStocks]
    const marketFiltered = stockMarketFilter === 'ALL'
      ? baseItems
      : baseItems.filter((item) => {
          const isKr = overview.koreaMarket.leadingStocks.some((s) => s.ticker === item.ticker)
          return stockMarketFilter === 'KR' ? isKr : !isKr
        })
    const keyword = stockSearch.trim().toLowerCase()
    if (!keyword) return marketFiltered
    return marketFiltered.filter((item) =>
      `${item.ticker} ${item.name} ${item.sector}`.toLowerCase().includes(keyword),
    )
  }, [overview, stockSearch, stockSearchResults, stockMarketFilter])

  const filteredWatchlist = useMemo(() => {
    const keyword = stockSearch.trim().toLowerCase()
    const items = overview.watchlist
    if (!keyword) return items
    return items.filter((item) =>
      `${item.market} ${item.ticker} ${item.name} ${item.sector}`.toLowerCase().includes(keyword),
    )
  }, [overview, stockSearch])

  const selectedStockDetail = useMemo<StockDetailSnapshot | null>(() => {
    if (!selectedStockKey) return null
    const [market, ticker] = selectedStockKey.split(':')
    if (!market || !ticker) return null
    const isKr = market === 'KR'
    const source = isKr ? overview.koreaMarket.leadingStocks : overview.usMarket.leadingStocks
    const target = source.find((item) => item.ticker === ticker)
    if (!target) return null

    const relatedNews = overview.news
      .filter((item) => item.market === market)
      .filter((item) => {
        const text = `${item.title} ${item.impact}`.toLowerCase()
        return text.includes(target.ticker.toLowerCase())
          || text.includes(target.name.toLowerCase())
          || text.includes(target.sector.toLowerCase())
      })
      .slice(0, 4)

    return {
      market: isKr ? 'KR' : 'US',
      ticker: target.ticker,
      name: target.name,
      sector: target.sector,
      price: target.price,
      changeRate: target.changeRate,
      stance: target.stance,
      watchItem: overview.watchlist.find((item) => item.market === market && item.ticker === ticker),
      portfolioPosition: overview.portfolio.positions.find((item) => item.market === market && item.ticker === ticker),
      aiPick: overview.aiRecommendations.picks.find((item) => item.market === market && item.ticker === ticker),
      relatedNews,
    }
  }, [overview, selectedStockKey])

  const userWatchCount = useMemo(
    () => workspaceCounts.watchlistCount,
    [workspaceCounts],
  )

  const userPortfolioCount = useMemo(
    () => workspaceCounts.portfolioCount,
    [workspaceCounts],
  )

  const classifiedNews = useMemo(() => {
    return overview.news
      .filter((item) => item.market === activeMarketTab)
      .map((item) => ({
        ...item,
        classification: classifyNews(item.title, item.impact),
      }))
  }, [activeMarketTab, overview.news])

  const newsClusters = useMemo<NewsCluster[]>(() => {
    const grouped = new Map<string, Array<MarketNews & { classification: NewsClassification }>>()

    classifiedNews.forEach((item) => {
      const key = buildNewsClusterKey(item.title, item.classification.sector)
      const bucket = grouped.get(key) ?? []
      bucket.push(item)
      grouped.set(key, bucket)
    })

    return Array.from(grouped.entries())
      .map(([clusterKey, items]) => {
        const averageImpact = items.reduce((sum, item) => sum + item.classification.marketImpactScore, 0) / items.length
        const direction = items[0]?.classification.direction ?? 'neutral'
        const sector = items[0]?.classification.sector ?? '시장 전반'
        return {
          clusterKey,
          summary: summarizeCluster(items),
          sector,
          marketImpactScore: Math.round(averageImpact),
          direction,
          items,
        }
      })
      .sort((a, b) => b.marketImpactScore - a.marketImpactScore)
  }, [classifiedNews])

  const marketNewsDigest = useMemo(() => buildMarketNewsDigest(newsClusters), [newsClusters])
  const visibleNewsClusters = useMemo(
    () => (showAllNewsGroups ? newsClusters : newsClusters.slice(0, 3)),
    [newsClusters, showAllNewsGroups],
  )

  const aiPickNewsLinks = useMemo<AiPickNewsLink[]>(() => {
    return overview.aiRecommendations.picks.map((pick) => {
      const relatedClusters = newsClusters.filter((cluster) => {
        const sectorMatch = cluster.sector.toLowerCase().includes(pick.name.toLowerCase())
          || cluster.sector.toLowerCase().includes(pick.ticker.toLowerCase())
          || pick.note.toLowerCase().includes(cluster.sector.toLowerCase())
          || pick.basis.toLowerCase().includes(cluster.sector.toLowerCase())

        const itemMatch = cluster.items.some((item) => {
          const text = `${item.title} ${item.impact}`.toLowerCase()
          return text.includes(pick.name.toLowerCase())
            || text.includes(pick.ticker.toLowerCase())
            || text.includes(pick.note.toLowerCase().split(' ')[0] ?? '')
        })

        return sectorMatch || itemMatch
      }).slice(0, 2)

      return {
        pickKey: `${pick.market}-${pick.ticker}-${pick.id || pick.name}`,
        ticker: pick.ticker,
        name: pick.name,
        market: pick.market,
        relatedClusters,
      }
    })
  }, [newsClusters, overview.aiRecommendations.picks])

  useEffect(() => {
    if (!filteredMovers.length) {
      setSelectedStockKey('')
      return
    }
    const selectedStillExists = filteredMovers.some((item) => {
      const market = overview.koreaMarket.leadingStocks.some((stock) => stock.ticker === item.ticker) ? 'KR' : 'US'
      return `${market}:${item.ticker}` === selectedStockKey
    })
    if (selectedStillExists) return

    const first = filteredMovers[0]
    const market = overview.koreaMarket.leadingStocks.some((stock) => stock.ticker === first.ticker) ? 'KR' : 'US'
    setSelectedStockKey(`${market}:${first.ticker}`)
  }, [filteredMovers, overview.koreaMarket.leadingStocks, selectedStockKey])

  const toggleNewsCluster = (clusterKey: string) => {
    setExpandedNewsClusters((prev) =>
      prev.includes(clusterKey)
        ? prev.filter((key) => key !== clusterKey)
        : [...prev, clusterKey],
    )
  }
  const {
    applyMoverToWatchForm,
    applyWatchToPortfolioForm,
    saveWatchItem,
    deleteWatchItem,
    savePortfolioPosition,
    deletePortfolioPosition,
    savePaperPosition,
    deletePaperPosition,
    savePaperTrade,
    deletePaperTrade,
    saveAiPick,
    deleteAiPick,
    saveAiTrackRecord,
    deleteAiTrackRecord,
  } = useWorkspaceActions({
    watchForm,
    setWatchForm,
    portfolioForm,
    setPortfolioForm,
    paperPositionForm,
    setPaperPositionForm,
    paperTradeForm,
    setPaperTradeForm,
    aiPickForm,
    setAiPickForm,
    aiTrackRecordForm,
    setAiTrackRecordForm,
    setActiveTab,
    setTabErrors,
    setIsSavingWatch,
    setIsSavingPortfolio,
    setIsSavingPaperPosition,
    setIsSavingPaperTrade,
    setIsSavingAiPick,
    setIsSavingAiTrackRecord,
    refreshSummary: fetchSummary,
    refreshStocks: fetchStocksTabData,
    refreshPortfolio: fetchPortfolioTabData,
    refreshPaper: fetchPaperTabData,
    refreshAi: fetchAiTabData,
  })

  const activeTabError = tabErrors[activeTab]
  const activeTabLoading = tabLoading[activeTab]

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Market Intelligence</p>
          <h1>SignalDesk</h1>
          <p className="hero-summary">
            한국주식과 미국주식을 나눠 보고, 수급, 공포지수, 뉴스, 포트폴리오, AI 추천, 모의투자까지 한 제품 안에서 관리하는 투자 대시보드.
          </p>
        </div>
        <div className="hero-panel">
          <span className="label">Market Status</span>
          <strong>{overview?.marketStatus ?? 'LOADING'}</strong>
          <p>{overview?.summary ?? '시장 요약을 불러오는 중이야.'}</p>
          <div className="session-status-grid">
            {overview.marketSessions.map((session) => (
              <article key={session.market} className="session-status-card">
                <div>
                  <span className="label">{session.label}</span>
                  <strong>{session.status}</strong>
                </div>
                <span className={`mini-badge ${session.isOpen ? 'user' : 'base'}`}>{session.phase}</span>
                <small>{session.localTime} · {session.note}</small>
              </article>
            ))}
          </div>
          <div className="hero-badges">
            <SourceBadge label="KRX 실데이터" tone="live" />
            <SourceBadge label="CBOE VIX" tone="live" />
            <SourceBadge label="탭별 분리 로드" tone="mixed" />
          </div>
          <small>generated at {overview?.generatedAt ?? '-'}</small>
          <small>{buildFreshnessLabel(overview?.generatedAt)}</small>
        </div>
      </section>

      {tabErrors.summary ? <section className="error-card">{tabErrors.summary}</section> : null}
      {activeTabError ? <section className="error-card">{activeTabError}</section> : null}
      {activeTabLoading && !loadedTabs[activeTab] ? <section className="panel"><small>데이터를 불러오는 중...</small></section> : null}

      <section className="tab-bar">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-chip${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="grid cards">
        {overview?.marketSummary.map((card) => (
          <article key={card.label} className="panel metric-card">
            <span className="label">{card.label}</span>
            <strong>{card.score.toFixed(0)}</strong>
            <p>{card.state}</p>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className="grid cards coverage-cards">
        <article className="panel metric-card">
          <span className="label">KR Coverage</span>
          <strong>LIVE</strong>
          <small>KRX 지수 · 차트 · 수급</small>
        </article>
        <article className="panel metric-card">
          <span className="label">US Coverage</span>
          <strong>LIVE / MIXED</strong>
          <small>FRED 지수 · CBOE VIX live · 미국 개별 종목은 혼합</small>
        </article>
        <article className="panel metric-card">
          <span className="label">News Feed</span>
          <strong>LIVE</strong>
          <small>Google News RSS 기반</small>
        </article>
        <article className="panel metric-card">
          <span className="label">User Sync</span>
          <strong>{workspaceCounts.watchlistCount + workspaceCounts.portfolioCount + workspaceCounts.paperPositionCount + workspaceCounts.aiPickCount}건</strong>
          <small>관심 {userWatchCount} · 포폴 {userPortfolioCount} · 모의 {workspaceCounts.paperPositionCount} · AI {workspaceCounts.aiPickCount}</small>
        </article>
      </section>

      {activeTab === 'market' ? (
        <MarketTab
          activeMarketTab={activeMarketTab}
          setActiveMarketTab={setActiveMarketTab}
          activeMarketPrimaryTab={activeMarketPrimaryTab}
          setActiveMarketPrimaryTab={setActiveMarketPrimaryTab}
          marketSection={marketSection}
          alternativeSignals={overview.alternativeSignals}
          marketNewsDigest={marketNewsDigest}
          newsClusters={newsClusters}
          visibleNewsClusters={visibleNewsClusters}
          expandedNewsClusters={expandedNewsClusters}
          onToggleNewsCluster={toggleNewsCluster}
          showAllNewsGroups={showAllNewsGroups}
          setShowAllNewsGroups={setShowAllNewsGroups}
        />
      ) : null}

      {activeTab === 'stocks' ? (
        <StocksTab
          stockSearch={stockSearch}
          setStockSearch={setStockSearch}
          stockMarketFilter={stockMarketFilter}
          setStockMarketFilter={setStockMarketFilter}
          isSearchingStocks={isSearchingStocks}
          isSearchMode={stockSearch.trim().length >= 2}
          filteredMovers={filteredMovers}
          onSelectStock={setSelectedStockKey}
          onApplyMoverToWatchForm={applyMoverToWatchForm}
          koreaMarketTickers={overview.koreaMarket.leadingStocks.map((stock) => stock.ticker)}
          selectedStockDetail={selectedStockDetail}
          watchForm={watchForm}
          setWatchForm={setWatchForm}
          isSavingWatch={isSavingWatch}
          onSaveWatchItem={saveWatchItem}
          filteredWatchlist={filteredWatchlist}
          onApplyWatchToPortfolioForm={applyWatchToPortfolioForm}
          onDeleteWatchItem={deleteWatchItem}
        />
      ) : null}

      {activeTab === 'portfolio' ? (
        <PortfolioTab
          portfolio={overview.portfolio}
          userPortfolioCount={userPortfolioCount}
          portfolioForm={portfolioForm}
          setPortfolioForm={setPortfolioForm}
          isSavingPortfolio={isSavingPortfolio}
          onSavePortfolioPosition={savePortfolioPosition}
          onDeletePortfolioPosition={deletePortfolioPosition}
          briefing={overview.briefing}
        />
      ) : null}

      {activeTab === 'ai' ? (
        <AiTab
          aiRecommendations={overview.aiRecommendations}
          aiPickNewsLinks={aiPickNewsLinks}
          aiPickForm={aiPickForm}
          setAiPickForm={setAiPickForm}
          aiTrackRecordForm={aiTrackRecordForm}
          setAiTrackRecordForm={setAiTrackRecordForm}
          isSavingAiPick={isSavingAiPick}
          isSavingAiTrackRecord={isSavingAiTrackRecord}
          onSaveAiPick={saveAiPick}
          onDeleteAiPick={deleteAiPick}
          onSaveAiTrackRecord={saveAiTrackRecord}
          onDeleteAiTrackRecord={deleteAiTrackRecord}
        />
      ) : null}

      {activeTab === 'paper' ? (
        <PaperTab
          paperTrading={overview.paperTrading}
          paperPositionForm={paperPositionForm}
          setPaperPositionForm={setPaperPositionForm}
          paperTradeForm={paperTradeForm}
          setPaperTradeForm={setPaperTradeForm}
          isSavingPaperPosition={isSavingPaperPosition}
          isSavingPaperTrade={isSavingPaperTrade}
          onSavePaperPosition={savePaperPosition}
          onDeletePaperPosition={deletePaperPosition}
          onSavePaperTrade={savePaperTrade}
          onDeletePaperTrade={deletePaperTrade}
        />
      ) : null}

      <SourceMapPanel sourceNotes={overview.sourceNotes} />
    </main>
  )
}
