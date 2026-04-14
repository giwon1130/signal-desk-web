export type SummaryMetric = {
  label: string
  score: number
  state: string
  note: string
}

export type AlternativeSignal = {
  label: string
  score: number
  state: string
  note: string
  source: string
  url: string
  experimental: boolean
}

export type IndexMetric = {
  label: string
  value: number
  changeRate: number
  periods: ChartPeriodSnapshot[]
}

export type ChartPeriodSnapshot = {
  key: string
  label: string
  points: ChartPoint[]
  stats: ChartStats
}

export type ChartPoint = {
  label: string
  value: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type ChartStats = {
  latest: number
  high: number
  low: number
  changeRate: number
  range: number
  averageVolume: number
}

export type SentimentMetric = {
  label: string
  state: string
  score: number
  note: string
}

export type InvestorFlow = {
  investor: string
  amountBillionWon: number
  note: string
  positive: boolean
}

export type TickerSnapshot = {
  ticker: string
  name: string
  sector: string
  price: number
  changeRate: number
  stance: string
}

export type MarketSection = {
  market: string
  title: string
  indices: IndexMetric[]
  sentiment: SentimentMetric[]
  investorFlows: InvestorFlow[]
  leadingStocks: TickerSnapshot[]
}

export type MarketNews = {
  market: string
  title: string
  source: string
  url: string
  impact: string
}

export type WatchItem = {
  id: string
  market: string
  ticker: string
  name: string
  price: number
  changeRate: number
  sector: string
  stance: string
  note: string
  source: string
}

export type HoldingPosition = {
  id: string
  market: string
  ticker: string
  name: string
  buyPrice: number
  currentPrice: number
  quantity: number
  profitAmount: number
  evaluationAmount: number
  profitRate: number
  source: string
}

export type PortfolioSummary = {
  totalCost: number
  totalValue: number
  totalProfit: number
  totalProfitRate: number
  positions: HoldingPosition[]
}

export type RecommendationPick = {
  id: string
  market: string
  ticker: string
  name: string
  basis: string
  confidence: number
  note: string
  expectedReturnRate: number
  source: string
}

export type RecommendationTrackRecord = {
  id: string
  recommendedDate: string
  market: string
  ticker: string
  name: string
  entryPrice: number
  latestPrice: number
  realizedReturnRate: number
  success: boolean
  source: string
}

export type RecommendationExecutionLog = {
  date: string
  market: string
  ticker: string
  name: string
  stage: string
  status: string
  rationale: string
  confidence: number | null
  expectedReturnRate: number | null
  realizedReturnRate: number | null
  source: string
}

export type AIRecommendationSection = {
  generatedDate: string
  summary: string
  picks: RecommendationPick[]
  trackRecords: RecommendationTrackRecord[]
  executionLogs: RecommendationExecutionLog[]
}

export type PaperPosition = {
  id: string
  market: string
  ticker: string
  name: string
  averagePrice: number
  currentPrice: number
  quantity: number
  returnRate: number
  source: string
}

export type PaperTrade = {
  id: string
  tradeDate: string
  side: string
  market: string
  ticker: string
  name: string
  price: number
  quantity: number
  source: string
}

export type PaperTradingSummary = {
  cash: number
  evaluation: number
  totalReturnRate: number
  openPositions: PaperPosition[]
  recentTrades: PaperTrade[]
}

export type DailyBriefing = {
  headline: string
  preMarket: string[]
  afterMarket: string[]
}

export type SourceNote = {
  label: string
  source: string
  url: string
}

export type MarketSessionStatus = {
  market: string
  label: string
  phase: string
  status: string
  isOpen: boolean
  localTime: string
  note: string
}

export type MarketOverview = {
  generatedAt: string
  marketStatus: string
  summary: string
  marketSummary: SummaryMetric[]
  alternativeSignals: AlternativeSignal[]
  marketSessions: MarketSessionStatus[]
  koreaMarket: MarketSection
  usMarket: MarketSection
  news: MarketNews[]
  watchlist: WatchItem[]
  portfolio: PortfolioSummary
  aiRecommendations: AIRecommendationSection
  paperTrading: PaperTradingSummary
  briefing: DailyBriefing
  sourceNotes: SourceNote[]
}

export type WorkspaceCounts = {
  watchlistCount: number
  portfolioCount: number
  paperPositionCount: number
  aiPickCount: number
}

export type MarketSummaryResponse = {
  generatedAt: string
  marketStatus: string
  summary: string
  marketSummary: SummaryMetric[]
  alternativeSignals: AlternativeSignal[]
  marketSessions: MarketSessionStatus[]
  briefing: DailyBriefing
  sourceNotes: SourceNote[]
  workspaceCounts: WorkspaceCounts
}

export type MarketSectionsResponse = {
  generatedAt: string
  koreaMarket: MarketSection
  usMarket: MarketSection
}

export type NewsFeedResponse = {
  generatedAt: string
  news: MarketNews[]
}

export type WatchlistResponse = {
  generatedAt: string
  watchlist: WatchItem[]
}

export type PortfolioResponse = {
  generatedAt: string
  portfolio: PortfolioSummary
}

export type AiRecommendationsResponse = {
  generatedAt: string
  aiRecommendations: AIRecommendationSection
}

export type PaperTradingResponse = {
  generatedAt: string
  paperTrading: PaperTradingSummary
}

export type ApiResponse<T> = {
  success: boolean
  data: T
}

export type StockSearchResult = {
  ticker: string
  name: string
  market: string
  sector: string
  price: number
  changeRate: number
  stance: string
}

export type StockMarketFilter = 'ALL' | 'KR' | 'US'

export type MainTab = 'market' | 'stocks' | 'portfolio' | 'ai' | 'paper'
export type MarketTab = 'KR' | 'US'
export type MarketPrimaryTab = 'chart' | 'flow'

export type WatchForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  price: string
  changeRate: string
  sector: string
  stance: string
  note: string
}

export type PortfolioForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  buyPrice: string
  currentPrice: string
  quantity: string
}

export type PaperPositionForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  averagePrice: string
  currentPrice: string
  quantity: string
}

export type PaperTradeForm = {
  tradeDate: string
  side: 'BUY' | 'SELL'
  market: 'KR' | 'US'
  ticker: string
  name: string
  price: string
  quantity: string
}

export type AiPickForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  basis: string
  confidence: string
  note: string
  expectedReturnRate: string
}

export type AiTrackRecordForm = {
  recommendedDate: string
  market: 'KR' | 'US'
  ticker: string
  name: string
  entryPrice: string
  latestPrice: string
}

export type NewsSignalDirection = 'positive' | 'neutral' | 'negative'
export type NewsImpactLevel = 'high' | 'medium' | 'low'

export type NewsClassification = {
  icon: string
  label: string
  direction: NewsSignalDirection
  impactLevel: NewsImpactLevel
  sector: string
  confidence: number
  marketImpactScore: number
}

export type NewsCluster = {
  clusterKey: string
  summary: string
  sector: string
  marketImpactScore: number
  direction: NewsSignalDirection
  items: Array<MarketNews & { classification: NewsClassification }>
}

export type AiPickNewsLink = {
  pickKey: string
  ticker: string
  name: string
  market: string
  relatedClusters: NewsCluster[]
}

export type StockDetailSnapshot = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  sector: string
  price: number
  changeRate: number
  stance: string
  watchItem?: WatchItem
  portfolioPosition?: HoldingPosition
  aiPick?: RecommendationPick
  relatedNews: MarketNews[]
}
