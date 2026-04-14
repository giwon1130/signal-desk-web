import { useEffect, useState } from 'react'
import { API_BASE_URL, emptyOverview } from '../constants'
import type {
  AiRecommendationsResponse,
  ApiResponse,
  MainTab,
  MarketOverview,
  MarketSectionsResponse,
  MarketSummaryResponse,
  NewsFeedResponse,
  PaperTradingResponse,
  PortfolioResponse,
  WatchlistResponse,
  WorkspaceCounts,
} from '../types'

type UseMarketDataResult = {
  overview: MarketOverview
  setOverview: React.Dispatch<React.SetStateAction<MarketOverview>>
  workspaceCounts: WorkspaceCounts
  setWorkspaceCounts: React.Dispatch<React.SetStateAction<WorkspaceCounts>>
  loadedTabs: Record<MainTab, boolean>
  setLoadedTabs: React.Dispatch<React.SetStateAction<Record<MainTab, boolean>>>
  tabErrors: Record<'summary' | MainTab, string>
  setTabErrors: React.Dispatch<React.SetStateAction<Record<'summary' | MainTab, string>>>
  tabLoading: Record<'summary' | MainTab, boolean>
  fetchSummary: () => Promise<void>
  fetchMarketTabData: () => Promise<void>
  fetchStocksTabData: () => Promise<void>
  fetchPortfolioTabData: () => Promise<void>
  fetchAiTabData: () => Promise<void>
  fetchPaperTabData: () => Promise<void>
}

export function useMarketData(): UseMarketDataResult {
  const [overview, setOverview] = useState<MarketOverview>(emptyOverview)
  const [workspaceCounts, setWorkspaceCounts] = useState<WorkspaceCounts>({
    watchlistCount: 0,
    portfolioCount: 0,
    paperPositionCount: 0,
    aiPickCount: 0,
  })
  const [loadedTabs, setLoadedTabs] = useState<Record<MainTab, boolean>>({
    market: false,
    stocks: false,
    portfolio: false,
    ai: false,
    paper: false,
  })
  const [tabErrors, setTabErrors] = useState<Record<'summary' | MainTab, string>>({
    summary: '',
    market: '',
    stocks: '',
    portfolio: '',
    ai: '',
    paper: '',
  })
  const [tabLoading, setTabLoading] = useState<Record<'summary' | MainTab, boolean>>({
    summary: false,
    market: false,
    stocks: false,
    portfolio: false,
    ai: false,
    paper: false,
  })

  const fetchSummary = async () => {
    setTabLoading((prev) => ({ ...prev, summary: true }))
    try {
      setTabErrors((prev) => ({ ...prev, summary: '' }))
      const response = await fetch(`${API_BASE_URL}/api/v1/market/summary`)
      if (!response.ok) throw new Error('fetch')

      const result = (await response.json()) as ApiResponse<MarketSummaryResponse>
      setOverview((prev) => ({
        ...prev,
        generatedAt: result.data.generatedAt,
        marketStatus: result.data.marketStatus,
        summary: result.data.summary,
        marketSummary: result.data.marketSummary,
        alternativeSignals: result.data.alternativeSignals,
        watchAlerts: result.data.watchAlerts,
        marketSessions: result.data.marketSessions,
        briefing: result.data.briefing,
        sourceNotes: result.data.sourceNotes,
      }))
      setWorkspaceCounts(result.data.workspaceCounts)
    } catch {
      setTabErrors((prev) => ({ ...prev, summary: '홈 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, summary: false }))
    }
  }

  const fetchMarketTabData = async () => {
    setTabLoading((prev) => ({ ...prev, market: true }))
    try {
      setTabErrors((prev) => ({ ...prev, market: '' }))
      const [sectionsResponse, newsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/market/sections`),
        fetch(`${API_BASE_URL}/api/v1/market/news`),
      ])
      if (!sectionsResponse.ok || !newsResponse.ok) throw new Error('fetch-market')

      const sectionsResult = (await sectionsResponse.json()) as ApiResponse<MarketSectionsResponse>
      const newsResult = (await newsResponse.json()) as ApiResponse<NewsFeedResponse>
      setOverview((prev) => ({
        ...prev,
        koreaMarket: sectionsResult.data.koreaMarket,
        usMarket: sectionsResult.data.usMarket,
        news: newsResult.data.news,
      }))
      setLoadedTabs((prev) => ({ ...prev, market: true }))
    } catch {
      setTabErrors((prev) => ({ ...prev, market: '시장 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, market: false }))
    }
  }

  const fetchStocksTabData = async () => {
    setTabLoading((prev) => ({ ...prev, stocks: true }))
    try {
      setTabErrors((prev) => ({ ...prev, stocks: '' }))
      const response = await fetch(`${API_BASE_URL}/api/v1/market/watchlist`)
      if (!response.ok) throw new Error('fetch-watchlist')
      const result = (await response.json()) as ApiResponse<WatchlistResponse>
      setOverview((prev) => ({ ...prev, watchlist: result.data.watchlist }))
      setLoadedTabs((prev) => ({ ...prev, stocks: true }))
    } catch {
      setTabErrors((prev) => ({ ...prev, stocks: '종목 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, stocks: false }))
    }
  }

  const fetchPortfolioTabData = async () => {
    setTabLoading((prev) => ({ ...prev, portfolio: true }))
    try {
      setTabErrors((prev) => ({ ...prev, portfolio: '' }))
      const response = await fetch(`${API_BASE_URL}/api/v1/market/portfolio`)
      if (!response.ok) throw new Error('fetch-portfolio')
      const result = (await response.json()) as ApiResponse<PortfolioResponse>
      setOverview((prev) => ({ ...prev, portfolio: result.data.portfolio }))
      setLoadedTabs((prev) => ({ ...prev, portfolio: true }))
    } catch {
      setTabErrors((prev) => ({ ...prev, portfolio: '포트폴리오 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, portfolio: false }))
    }
  }

  const fetchAiTabData = async () => {
    setTabLoading((prev) => ({ ...prev, ai: true }))
    try {
      setTabErrors((prev) => ({ ...prev, ai: '' }))
      const response = await fetch(`${API_BASE_URL}/api/v1/market/ai-recommendations`)
      if (!response.ok) throw new Error('fetch-ai')
      const result = (await response.json()) as ApiResponse<AiRecommendationsResponse>
      setOverview((prev) => ({ ...prev, aiRecommendations: result.data.aiRecommendations }))
      setLoadedTabs((prev) => ({ ...prev, ai: true }))
    } catch {
      setTabErrors((prev) => ({ ...prev, ai: 'AI 추천 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, ai: false }))
    }
  }

  const fetchPaperTabData = async () => {
    setTabLoading((prev) => ({ ...prev, paper: true }))
    try {
      setTabErrors((prev) => ({ ...prev, paper: '' }))
      const response = await fetch(`${API_BASE_URL}/api/v1/market/paper-trading`)
      if (!response.ok) throw new Error('fetch-paper')
      const result = (await response.json()) as ApiResponse<PaperTradingResponse>
      setOverview((prev) => ({ ...prev, paperTrading: result.data.paperTrading }))
      setLoadedTabs((prev) => ({ ...prev, paper: true }))
    } catch {
      setTabErrors((prev) => ({ ...prev, paper: '모의투자 데이터를 불러오지 못했습니다.' }))
    } finally {
      setTabLoading((prev) => ({ ...prev, paper: false }))
    }
  }

  useEffect(() => {
    void fetchSummary()
    void fetchMarketTabData()
  }, [])

  return {
    overview,
    setOverview,
    workspaceCounts,
    setWorkspaceCounts,
    loadedTabs,
    setLoadedTabs,
    tabErrors,
    setTabErrors,
    tabLoading,
    fetchSummary,
    fetchMarketTabData,
    fetchStocksTabData,
    fetchPortfolioTabData,
    fetchAiTabData,
    fetchPaperTabData,
  }
}
