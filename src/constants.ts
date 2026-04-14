import type {
  AiPickForm,
  AiTrackRecordForm,
  MainTab,
  MarketOverview,
  PaperPositionForm,
  PaperTradeForm,
  PortfolioForm,
  WatchForm,
} from './types'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const mainTabs: Array<{ key: MainTab; label: string }> = [
  { key: 'market', label: '시장' },
  { key: 'stocks', label: '종목' },
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'ai', label: 'AI 추천' },
  { key: 'paper', label: '모의투자' },
]

export const emptyWatchForm: WatchForm = {
  market: 'KR',
  ticker: '',
  name: '',
  price: '',
  changeRate: '0',
  sector: '',
  stance: '',
  note: '',
}

export const emptyOverview: MarketOverview = {
  generatedAt: '',
  marketStatus: '',
  summary: '',
  marketSummary: [],
  alternativeSignals: [],
  marketSessions: [],
  koreaMarket: { market: 'KR', title: '한국 시장', indices: [], sentiment: [], investorFlows: [], leadingStocks: [] },
  usMarket: { market: 'US', title: '미국 시장', indices: [], sentiment: [], investorFlows: [], leadingStocks: [] },
  news: [],
  watchlist: [],
  portfolio: {
    totalCost: 0,
    totalValue: 0,
    totalProfit: 0,
    totalProfitRate: 0,
    positions: [],
  },
  aiRecommendations: {
    generatedDate: '',
    summary: '',
    picks: [],
    trackRecords: [],
    executionLogs: [],
  },
  paperTrading: {
    cash: 0,
    evaluation: 0,
    totalReturnRate: 0,
    openPositions: [],
    recentTrades: [],
  },
  briefing: {
    headline: '',
    preMarket: [],
    afterMarket: [],
  },
  sourceNotes: [],
}

export const emptyPortfolioForm: PortfolioForm = {
  market: 'KR',
  ticker: '',
  name: '',
  buyPrice: '',
  currentPrice: '',
  quantity: '1',
}

export const emptyPaperPositionForm: PaperPositionForm = {
  market: 'KR',
  ticker: '',
  name: '',
  averagePrice: '',
  currentPrice: '',
  quantity: '1',
}

export const emptyPaperTradeForm: PaperTradeForm = {
  tradeDate: new Date().toISOString().slice(0, 10),
  side: 'BUY',
  market: 'KR',
  ticker: '',
  name: '',
  price: '',
  quantity: '1',
}

export const emptyAiPickForm: AiPickForm = {
  market: 'KR',
  ticker: '',
  name: '',
  basis: '',
  confidence: '60',
  note: '',
  expectedReturnRate: '3.0',
}

export const emptyAiTrackRecordForm: AiTrackRecordForm = {
  recommendedDate: new Date().toISOString().slice(0, 10),
  market: 'KR',
  ticker: '',
  name: '',
  entryPrice: '',
  latestPrice: '',
}
