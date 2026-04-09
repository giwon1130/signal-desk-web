import { useEffect, useMemo, useState } from 'react'

type SummaryMetric = {
  label: string
  score: number
  state: string
  note: string
}

type IndexMetric = {
  label: string
  value: number
  changeRate: number
  periods: ChartPeriodSnapshot[]
}

type ChartPeriodSnapshot = {
  key: string
  label: string
  points: ChartPoint[]
  stats: ChartStats
}

type ChartPoint = {
  label: string
  value: number
}

type ChartStats = {
  latest: number
  high: number
  low: number
  changeRate: number
  range: number
}

type SentimentMetric = {
  label: string
  state: string
  score: number
  note: string
}

type InvestorFlow = {
  investor: string
  amountBillionWon: number
  note: string
  positive: boolean
}

type TickerSnapshot = {
  ticker: string
  name: string
  sector: string
  price: number
  changeRate: number
  stance: string
}

type MarketSection = {
  market: string
  title: string
  indices: IndexMetric[]
  sentiment: SentimentMetric[]
  investorFlows: InvestorFlow[]
  leadingStocks: TickerSnapshot[]
}

type MarketNews = {
  market: string
  title: string
  source: string
  url: string
  impact: string
}

type WatchItem = {
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

type HoldingPosition = {
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

type PortfolioSummary = {
  totalCost: number
  totalValue: number
  totalProfit: number
  totalProfitRate: number
  positions: HoldingPosition[]
}

type RecommendationPick = {
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

type RecommendationTrackRecord = {
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

type AIRecommendationSection = {
  generatedDate: string
  summary: string
  picks: RecommendationPick[]
  trackRecords: RecommendationTrackRecord[]
}

type PaperPosition = {
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

type PaperTrade = {
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

type PaperTradingSummary = {
  cash: number
  evaluation: number
  totalReturnRate: number
  openPositions: PaperPosition[]
  recentTrades: PaperTrade[]
}

type DailyBriefing = {
  headline: string
  preMarket: string[]
  afterMarket: string[]
}

type SourceNote = {
  label: string
  source: string
  url: string
}

type MarketOverview = {
  generatedAt: string
  marketStatus: string
  summary: string
  marketSummary: SummaryMetric[]
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

type WorkspaceCounts = {
  watchlistCount: number
  portfolioCount: number
  paperPositionCount: number
  aiPickCount: number
}

type MarketSummaryResponse = {
  generatedAt: string
  marketStatus: string
  summary: string
  marketSummary: SummaryMetric[]
  briefing: DailyBriefing
  sourceNotes: SourceNote[]
  workspaceCounts: WorkspaceCounts
}

type MarketSectionsResponse = {
  generatedAt: string
  koreaMarket: MarketSection
  usMarket: MarketSection
}

type NewsFeedResponse = {
  generatedAt: string
  news: MarketNews[]
}

type WatchlistResponse = {
  generatedAt: string
  watchlist: WatchItem[]
}

type PortfolioResponse = {
  generatedAt: string
  portfolio: PortfolioSummary
}

type AiRecommendationsResponse = {
  generatedAt: string
  aiRecommendations: AIRecommendationSection
}

type PaperTradingResponse = {
  generatedAt: string
  paperTrading: PaperTradingSummary
}

type ApiResponse<T> = {
  success: boolean
  data: T
}

type MainTab = 'market' | 'stocks' | 'portfolio' | 'ai' | 'paper'
type MarketTab = 'KR' | 'US'
type MarketPrimaryTab = 'chart' | 'flow'

type WatchForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  price: string
  changeRate: string
  sector: string
  stance: string
  note: string
}

type PortfolioForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  buyPrice: string
  currentPrice: string
  quantity: string
}

type PaperPositionForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  averagePrice: string
  currentPrice: string
  quantity: string
}

type PaperTradeForm = {
  tradeDate: string
  side: 'BUY' | 'SELL'
  market: 'KR' | 'US'
  ticker: string
  name: string
  price: string
  quantity: string
}

type AiPickForm = {
  market: 'KR' | 'US'
  ticker: string
  name: string
  basis: string
  confidence: string
  note: string
  expectedReturnRate: string
}

type AiTrackRecordForm = {
  recommendedDate: string
  market: 'KR' | 'US'
  ticker: string
  name: string
  entryPrice: string
  latestPrice: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const mainTabs: Array<{ key: MainTab; label: string }> = [
  { key: 'market', label: '시장' },
  { key: 'stocks', label: '종목' },
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'ai', label: 'AI 추천' },
  { key: 'paper', label: '모의투자' },
]

const emptyWatchForm: WatchForm = {
  market: 'KR',
  ticker: '',
  name: '',
  price: '',
  changeRate: '0',
  sector: '',
  stance: '',
  note: '',
}

const emptyOverview: MarketOverview = {
  generatedAt: '',
  marketStatus: '',
  summary: '',
  marketSummary: [],
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

const emptyPortfolioForm: PortfolioForm = {
  market: 'KR',
  ticker: '',
  name: '',
  buyPrice: '',
  currentPrice: '',
  quantity: '1',
}

const emptyPaperPositionForm: PaperPositionForm = {
  market: 'KR',
  ticker: '',
  name: '',
  averagePrice: '',
  currentPrice: '',
  quantity: '1',
}

const emptyPaperTradeForm: PaperTradeForm = {
  tradeDate: new Date().toISOString().slice(0, 10),
  side: 'BUY',
  market: 'KR',
  ticker: '',
  name: '',
  price: '',
  quantity: '1',
}

const emptyAiPickForm: AiPickForm = {
  market: 'KR',
  ticker: '',
  name: '',
  basis: '',
  confidence: '60',
  note: '',
  expectedReturnRate: '3.0',
}

const emptyAiTrackRecordForm: AiTrackRecordForm = {
  recommendedDate: new Date().toISOString().slice(0, 10),
  market: 'KR',
  ticker: '',
  name: '',
  entryPrice: '',
  latestPrice: '',
}

function formatNumber(value: number) {
  return value.toLocaleString('ko-KR')
}

function formatSignedRate(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function getSentimentIcon(score: number) {
  if (score >= 70) return '🟢'
  if (score >= 45) return '🟡'
  return '🔴'
}

type NewsSignalDirection = 'positive' | 'neutral' | 'negative'
type NewsImpactLevel = 'high' | 'medium' | 'low'

type NewsClassification = {
  icon: string
  label: string
  direction: NewsSignalDirection
  impactLevel: NewsImpactLevel
  sector: string
  confidence: number
  marketImpactScore: number
}

type NewsCluster = {
  clusterKey: string
  summary: string
  sector: string
  marketImpactScore: number
  direction: NewsSignalDirection
  items: Array<MarketNews & { classification: NewsClassification }>
}

type AiPickNewsLink = {
  pickKey: string
  ticker: string
  name: string
  market: string
  relatedClusters: NewsCluster[]
}

function getDirectionLabel(direction: NewsSignalDirection) {
  switch (direction) {
    case 'positive':
      return '호재 우위'
    case 'negative':
      return '악재 우위'
    default:
      return '중립'
  }
}

function classifyNews(title: string, impact: string): NewsClassification {
  const text = `${title} ${impact}`.toLowerCase()

  const positiveKeywords = ['급등', '상승', '강세', '호재', '기대', '개선', '반등', '성장', '확대', '유입', '최고', 'surge', 'gain', 'beat', 'rally', 'growth']
  const negativeKeywords = ['급락', '하락', '약세', '악재', '우려', '경고', '둔화', '축소', '매도', '리스크', '침체', '쇼크', 'fall', 'drop', 'fear', 'warning', 'cut']
  const highImpactKeywords = ['급등', '급락', '쇼크', '최고', '최저', 'surge', 'crash', 'shock', 'record']
  const mediumImpactKeywords = ['상승', '하락', '강세', '약세', '우려', '개선', '둔화', '반등', 'expands', 'warning']

  const positiveScore = positiveKeywords.filter((keyword) => text.includes(keyword)).length
  const negativeScore = negativeKeywords.filter((keyword) => text.includes(keyword)).length
  const highImpactScore = highImpactKeywords.filter((keyword) => text.includes(keyword)).length
  const mediumImpactScore = mediumImpactKeywords.filter((keyword) => text.includes(keyword)).length

  const sector = (() => {
    if (['반도체', 'ai', 'nvidia', '엔비디아', '하이닉스', '삼성전자'].some((keyword) => text.includes(keyword))) return '반도체/AI'
    if (['금리', '연준', 'fomc', '인플레이션', 'cpi', '달러', '환율'].some((keyword) => text.includes(keyword))) return '금리/거시'
    if (['자동차', 'tesla', '현대차', '전기차'].some((keyword) => text.includes(keyword))) return '자동차/모빌리티'
    if (['바이오', '제약', '헬스케어'].some((keyword) => text.includes(keyword))) return '바이오/헬스케어'
    if (['oil', '유가', '원자재', '에너지', '가스'].some((keyword) => text.includes(keyword))) return '에너지/원자재'
    if (['플랫폼', 'cloud', '클라우드', '메타', '애플', 'microsoft', 'amazon'].some((keyword) => text.includes(keyword))) return '플랫폼/빅테크'
    return '시장 전반'
  })()

  const impactLevel: NewsImpactLevel = highImpactScore > 0
    ? 'high'
    : mediumImpactScore > 0 || positiveScore > 0 || negativeScore > 0
      ? 'medium'
      : 'low'

  const confidence = Math.abs(positiveScore - negativeScore) >= 2
    ? 82
    : positiveScore !== negativeScore
      ? 71
      : impactLevel === 'high'
        ? 64
        : 56

  if (positiveScore > negativeScore) {
    return {
      icon: '🟢',
      label: '호재 우위',
      direction: 'positive',
      impactLevel,
      sector,
      confidence,
      marketImpactScore: Math.min(95, 52 + (positiveScore * 12) + (impactLevel === 'high' ? 16 : impactLevel === 'medium' ? 8 : 3)),
    }
  }

  if (negativeScore > positiveScore) {
    return {
      icon: '🔴',
      label: '악재 우위',
      direction: 'negative',
      impactLevel,
      sector,
      confidence,
      marketImpactScore: Math.min(95, 52 + (negativeScore * 12) + (impactLevel === 'high' ? 16 : impactLevel === 'medium' ? 8 : 3)),
    }
  }

  return {
    icon: '🟡',
    label: '중립',
    direction: 'neutral',
    impactLevel,
    sector,
    confidence,
    marketImpactScore: impactLevel === 'high' ? 68 : impactLevel === 'medium' ? 56 : 44,
  }
}

function getImpactLevelLabel(level: NewsImpactLevel) {
  switch (level) {
    case 'high':
      return '영향도 높음'
    case 'medium':
      return '영향도 보통'
    default:
      return '영향도 낮음'
  }
}

function buildNewsClusterKey(title: string, sector: string) {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2)
    .slice(0, 4)
    .join('-')

  return `${sector}:${normalized || 'general'}`
}

function summarizeCluster(cluster: Array<MarketNews & { classification: NewsClassification }>) {
  const first = cluster[0]
  if (!first) return '주요 이슈'
  if (cluster.length === 1) return first.title
  return `${first.classification.sector} 이슈 ${cluster.length}건`
}

function buildMarketNewsDigest(clusters: NewsCluster[]) {
  if (clusters.length === 0) {
    return '현재 분류 가능한 뉴스가 아직 충분하지 않아.'
  }

  const topCluster = clusters[0]
  const positiveCount = clusters.filter((cluster) => cluster.direction === 'positive').length
  const negativeCount = clusters.filter((cluster) => cluster.direction === 'negative').length
  const topNegative = clusters.find((cluster) => cluster.direction === 'negative')
  const bias = positiveCount > negativeCount ? '호재 우위' : negativeCount > positiveCount ? '악재 우위' : '중립 혼조'
  if (topNegative) {
    return `${topCluster.sector} 이슈가 현재 가장 강하고, 전체 뉴스 흐름은 ${bias}다. 최상위 호재/중립 묶음은 ${topCluster.marketImpactScore}점, 가장 강한 악재 묶음은 ${topNegative.sector} ${topNegative.marketImpactScore}점이다.`
  }
  return `${topCluster.sector} 이슈가 가장 강하고, 전체 뉴스 흐름은 ${bias}다. 현재 최상위 묶음 영향도는 ${topCluster.marketImpactScore}점이다.`
}

function IndexChartCard({ item }: { item: IndexMetric }) {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(item.periods[0]?.key ?? '1D')
  const [ChartComponent, setChartComponent] = useState<null | React.ComponentType<{ option: unknown; notMerge?: boolean; lazyUpdate?: boolean; className?: string }>>(null)
  const activePeriod = item.periods.find((period) => period.key === activePeriodKey) ?? item.periods[0]

  useEffect(() => {
    let mounted = true
    import('echarts-for-react').then((module) => {
      if (mounted) setChartComponent(() => module.default)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!activePeriod) {
    return (
      <article className="index-card">
        <span className="label">{item.label}</span>
        <strong>{formatNumber(item.value)}</strong>
        <p className={item.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(item.changeRate)}</p>
      </article>
    )
  }

  const isUp = activePeriod.stats.changeRate >= 0
  const seriesColor = isUp ? '#dc2626' : '#2563eb'
  const areaColor = isUp ? 'rgba(220, 38, 38, 0.18)' : 'rgba(37, 99, 235, 0.18)'

  const chartOption = {
    animation: true,
    grid: {
      left: 18,
      right: 16,
      top: 24,
      bottom: 26,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      borderWidth: 0,
      textStyle: { color: '#f8fafc' },
      formatter: (params: unknown) => {
        const safeParams = Array.isArray(params) ? params : []
        const first = safeParams[0] as { axisValue?: string; value?: number } | undefined
        if (!first) return ''
        return `${first.axisValue}<br/>${item.label}: ${formatNumber(Number(first.value ?? 0))}`
      },
    },
    xAxis: {
      type: 'category',
      data: activePeriod.points.map((point) => point.label),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.28)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
      axisLabel: {
        color: '#64748b',
        formatter: (value: number) => formatNumber(Math.round(value)),
      },
    },
    series: [
      {
        name: item.label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { width: 3, color: seriesColor },
        areaStyle: { color: areaColor },
        itemStyle: { color: seriesColor },
        data: activePeriod.points.map((point) => point.value),
      },
    ],
  }

  const startLabel = activePeriod.points[0]?.label ?? '-'
  const endLabel = activePeriod.points[activePeriod.points.length - 1]?.label ?? '-'

  return (
    <article className="index-card index-card-rich">
      <div className="index-card-header">
        <div>
          <span className="label">{item.label}</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.latest * 100) / 100)}</strong>
          <p className={activePeriod.stats.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(activePeriod.stats.changeRate)}</p>
        </div>
        <div className="index-period-tabs">
          {item.periods.map((period) => (
            <button
              key={period.key}
              type="button"
              className={`period-chip${activePeriod.key === period.key ? ' active' : ''}`}
              onClick={() => setActivePeriodKey(period.key)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      {ChartComponent ? (
        <ChartComponent option={chartOption} notMerge lazyUpdate className="tv-chart-container" />
      ) : (
        <div className="tv-chart-container chart-loading">차트 로딩 중...</div>
      )}

      <div className="chart-axis">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>

      <div className="chart-stats-grid">
        <div>
          <span className="label">현재</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.latest * 100) / 100)}</strong>
        </div>
        <div>
          <span className="label">고가</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.high * 100) / 100)}</strong>
        </div>
        <div>
          <span className="label">저가</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.low * 100) / 100)}</strong>
        </div>
        <div>
          <span className="label">변동폭</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.range * 100) / 100)}</strong>
        </div>
      </div>
    </article>
  )
}

function SourceBadge({
  label,
  tone,
}: {
  label: string
  tone: 'live' | 'mixed' | 'mock'
}) {
  return <span className={`status-badge ${tone}`}>{label}</span>
}

function buildFreshnessLabel(generatedAt?: string) {
  if (!generatedAt) return '-'
  const generated = new Date(generatedAt)
  const diffMinutes = Math.max(0, Math.round((Date.now() - generated.getTime()) / 60000))
  if (diffMinutes <= 1) return '방금 갱신'
  if (diffMinutes < 60) return `${diffMinutes}분 전 갱신`
  const hours = Math.floor(diffMinutes / 60)
  return `${hours}시간 전 갱신`
}

export default function App() {
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
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<MainTab>('market')
  const [activeMarketTab, setActiveMarketTab] = useState<MarketTab>('KR')
  const [activeMarketPrimaryTab, setActiveMarketPrimaryTab] = useState<MarketPrimaryTab>('chart')
  const [stockSearch, setStockSearch] = useState('')
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

  const fetchSummary = async () => {
    try {
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/v1/market/summary`)
      if (!response.ok) {
        throw new Error('fetch')
      }

      const result = (await response.json()) as ApiResponse<MarketSummaryResponse>
      setOverview((prev) => ({
        ...prev,
        generatedAt: result.data.generatedAt,
        marketStatus: result.data.marketStatus,
        summary: result.data.summary,
        marketSummary: result.data.marketSummary,
        briefing: result.data.briefing,
        sourceNotes: result.data.sourceNotes,
      }))
      setWorkspaceCounts(result.data.workspaceCounts)
    } catch {
      setError('시장 데이터를 불러오지 못했습니다.')
    }
  }

  const fetchMarketTabData = async () => {
    try {
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
      setError('시장 데이터를 불러오지 못했습니다.')
    }
  }

  const fetchStocksTabData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/market/watchlist`)
      if (!response.ok) throw new Error('fetch-watchlist')
      const result = (await response.json()) as ApiResponse<WatchlistResponse>
      setOverview((prev) => ({ ...prev, watchlist: result.data.watchlist }))
      setLoadedTabs((prev) => ({ ...prev, stocks: true }))
    } catch {
      setError('종목 데이터를 불러오지 못했습니다.')
    }
  }

  const fetchPortfolioTabData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/market/portfolio`)
      if (!response.ok) throw new Error('fetch-portfolio')
      const result = (await response.json()) as ApiResponse<PortfolioResponse>
      setOverview((prev) => ({ ...prev, portfolio: result.data.portfolio }))
      setLoadedTabs((prev) => ({ ...prev, portfolio: true }))
    } catch {
      setError('포트폴리오 데이터를 불러오지 못했습니다.')
    }
  }

  const fetchAiTabData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/market/ai-recommendations`)
      if (!response.ok) throw new Error('fetch-ai')
      const result = (await response.json()) as ApiResponse<AiRecommendationsResponse>
      setOverview((prev) => ({ ...prev, aiRecommendations: result.data.aiRecommendations }))
      setLoadedTabs((prev) => ({ ...prev, ai: true }))
    } catch {
      setError('AI 추천 데이터를 불러오지 못했습니다.')
    }
  }

  const fetchPaperTabData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/market/paper-trading`)
      if (!response.ok) throw new Error('fetch-paper')
      const result = (await response.json()) as ApiResponse<PaperTradingResponse>
      setOverview((prev) => ({ ...prev, paperTrading: result.data.paperTrading }))
      setLoadedTabs((prev) => ({ ...prev, paper: true }))
    } catch {
      setError('모의투자 데이터를 불러오지 못했습니다.')
    }
  }

  useEffect(() => {
    void fetchSummary()
    void fetchMarketTabData()
  }, [])

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

  const marketSection = useMemo(
    () => (activeMarketTab === 'KR' ? overview.koreaMarket : overview.usMarket),
    [activeMarketTab, overview],
  )

  const filteredMovers = useMemo(() => {
    const items = [...overview.koreaMarket.leadingStocks, ...overview.usMarket.leadingStocks]
    const keyword = stockSearch.trim().toLowerCase()
    if (!keyword) return items
    return items.filter((item) =>
      `${item.ticker} ${item.name} ${item.sector}`.toLowerCase().includes(keyword),
    )
  }, [overview, stockSearch])

  const filteredWatchlist = useMemo(() => {
    const keyword = stockSearch.trim().toLowerCase()
    const items = overview.watchlist
    if (!keyword) return items
    return items.filter((item) =>
      `${item.market} ${item.ticker} ${item.name} ${item.sector}`.toLowerCase().includes(keyword),
    )
  }, [overview, stockSearch])

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

  const toggleNewsCluster = (clusterKey: string) => {
    setExpandedNewsClusters((prev) =>
      prev.includes(clusterKey)
        ? prev.filter((key) => key !== clusterKey)
        : [...prev, clusterKey],
    )
  }

  const applyMoverToWatchForm = (item: TickerSnapshot, market: 'KR' | 'US') => {
    setWatchForm({
      market,
      ticker: item.ticker,
      name: item.name,
      price: String(item.price),
      changeRate: String(item.changeRate),
      sector: item.sector,
      stance: item.stance,
      note: `${market === 'KR' ? '국내' : '미국'} 대표 흐름에서 직접 추가`,
    })
    setActiveTab('stocks')
  }

  const applyWatchToPortfolioForm = (item: WatchItem) => {
    setPortfolioForm({
      market: item.market as 'KR' | 'US',
      ticker: item.ticker,
      name: item.name,
      buyPrice: String(item.price),
      currentPrice: String(item.price),
      quantity: '1',
    })
    setActiveTab('portfolio')
  }

  const saveWatchItem = async () => {
    if (!watchForm.ticker || !watchForm.name || !watchForm.sector || !watchForm.stance || !watchForm.note) {
      setError('관심종목 입력값을 확인해.')
      return
    }

    setIsSavingWatch(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: watchForm.market,
          ticker: watchForm.ticker.trim().toUpperCase(),
          name: watchForm.name.trim(),
          price: Number(watchForm.price || 0),
          changeRate: Number(watchForm.changeRate || 0),
          sector: watchForm.sector.trim(),
          stance: watchForm.stance.trim(),
          note: watchForm.note.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('save-watch')
      }

      setWatchForm(emptyWatchForm)
      await Promise.all([fetchStocksTabData(), fetchSummary()])
    } catch {
      setError('관심종목 저장에 실패했습니다.')
    } finally {
      setIsSavingWatch(false)
    }
  }

  const deleteWatchItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/watchlist/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('delete-watch')
      }
      await Promise.all([fetchStocksTabData(), fetchSummary()])
    } catch {
      setError('관심종목 삭제에 실패했습니다.')
    }
  }

  const savePortfolioPosition = async () => {
    if (!portfolioForm.ticker || !portfolioForm.name || !portfolioForm.buyPrice || !portfolioForm.currentPrice || !portfolioForm.quantity) {
      setError('포트폴리오 입력값을 확인해.')
      return
    }

    setIsSavingPortfolio(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: portfolioForm.market,
          ticker: portfolioForm.ticker.trim().toUpperCase(),
          name: portfolioForm.name.trim(),
          buyPrice: Number(portfolioForm.buyPrice),
          currentPrice: Number(portfolioForm.currentPrice),
          quantity: Number(portfolioForm.quantity),
        }),
      })

      if (!response.ok) {
        throw new Error('save-portfolio')
      }

      setPortfolioForm(emptyPortfolioForm)
      await Promise.all([fetchPortfolioTabData(), fetchSummary()])
    } catch {
      setError('포트폴리오 저장에 실패했습니다.')
    } finally {
      setIsSavingPortfolio(false)
    }
  }

  const deletePortfolioPosition = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/portfolio/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('delete-portfolio')
      }
      await Promise.all([fetchPortfolioTabData(), fetchSummary()])
    } catch {
      setError('포트폴리오 삭제에 실패했습니다.')
    }
  }

  const savePaperPosition = async () => {
    if (!paperPositionForm.ticker || !paperPositionForm.name || !paperPositionForm.averagePrice || !paperPositionForm.currentPrice || !paperPositionForm.quantity) {
      setError('모의 보유종목 입력값을 확인해.')
      return
    }

    setIsSavingPaperPosition(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: paperPositionForm.market,
          ticker: paperPositionForm.ticker.trim().toUpperCase(),
          name: paperPositionForm.name.trim(),
          averagePrice: Number(paperPositionForm.averagePrice),
          currentPrice: Number(paperPositionForm.currentPrice),
          quantity: Number(paperPositionForm.quantity),
        }),
      })
      if (!response.ok) throw new Error('save-paper-position')
      setPaperPositionForm(emptyPaperPositionForm)
      await Promise.all([fetchPaperTabData(), fetchSummary()])
    } catch {
      setError('모의 보유종목 저장에 실패했습니다.')
    } finally {
      setIsSavingPaperPosition(false)
    }
  }

  const deletePaperPosition = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/positions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('delete-paper-position')
      await Promise.all([fetchPaperTabData(), fetchSummary()])
    } catch {
      setError('모의 보유종목 삭제에 실패했습니다.')
    }
  }

  const savePaperTrade = async () => {
    if (!paperTradeForm.tradeDate || !paperTradeForm.ticker || !paperTradeForm.name || !paperTradeForm.price || !paperTradeForm.quantity) {
      setError('모의 거래 입력값을 확인해.')
      return
    }

    setIsSavingPaperTrade(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeDate: paperTradeForm.tradeDate,
          side: paperTradeForm.side,
          market: paperTradeForm.market,
          ticker: paperTradeForm.ticker.trim().toUpperCase(),
          name: paperTradeForm.name.trim(),
          price: Number(paperTradeForm.price),
          quantity: Number(paperTradeForm.quantity),
        }),
      })
      if (!response.ok) throw new Error('save-paper-trade')
      setPaperTradeForm({
        ...emptyPaperTradeForm,
        tradeDate: new Date().toISOString().slice(0, 10),
      })
      await Promise.all([fetchPaperTabData(), fetchSummary()])
    } catch {
      setError('모의 거래 저장에 실패했습니다.')
    } finally {
      setIsSavingPaperTrade(false)
    }
  }

  const deletePaperTrade = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/trades/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('delete-paper-trade')
      await Promise.all([fetchPaperTabData(), fetchSummary()])
    } catch {
      setError('모의 거래 삭제에 실패했습니다.')
    }
  }

  const saveAiPick = async () => {
    if (!aiPickForm.ticker || !aiPickForm.name || !aiPickForm.basis || !aiPickForm.note) {
      setError('AI 추천 입력값을 확인해.')
      return
    }

    setIsSavingAiPick(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/picks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: aiPickForm.market,
          ticker: aiPickForm.ticker.trim().toUpperCase(),
          name: aiPickForm.name.trim(),
          basis: aiPickForm.basis.trim(),
          confidence: Number(aiPickForm.confidence),
          note: aiPickForm.note.trim(),
          expectedReturnRate: Number(aiPickForm.expectedReturnRate),
        }),
      })
      if (!response.ok) throw new Error('save-ai-pick')
      setAiPickForm(emptyAiPickForm)
      await Promise.all([fetchAiTabData(), fetchSummary()])
    } catch {
      setError('AI 추천 저장에 실패했습니다.')
    } finally {
      setIsSavingAiPick(false)
    }
  }

  const deleteAiPick = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/picks/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-ai-pick')
      await Promise.all([fetchAiTabData(), fetchSummary()])
    } catch {
      setError('AI 추천 삭제에 실패했습니다.')
    }
  }

  const saveAiTrackRecord = async () => {
    if (!aiTrackRecordForm.recommendedDate || !aiTrackRecordForm.ticker || !aiTrackRecordForm.name || !aiTrackRecordForm.entryPrice || !aiTrackRecordForm.latestPrice) {
      setError('추천 성과 입력값을 확인해.')
      return
    }

    setIsSavingAiTrackRecord(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/track-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendedDate: aiTrackRecordForm.recommendedDate,
          market: aiTrackRecordForm.market,
          ticker: aiTrackRecordForm.ticker.trim().toUpperCase(),
          name: aiTrackRecordForm.name.trim(),
          entryPrice: Number(aiTrackRecordForm.entryPrice),
          latestPrice: Number(aiTrackRecordForm.latestPrice),
        }),
      })
      if (!response.ok) throw new Error('save-ai-track-record')
      setAiTrackRecordForm({
        ...emptyAiTrackRecordForm,
        recommendedDate: new Date().toISOString().slice(0, 10),
      })
      await Promise.all([fetchAiTabData(), fetchSummary()])
    } catch {
      setError('추천 성과 저장에 실패했습니다.')
    } finally {
      setIsSavingAiTrackRecord(false)
    }
  }

  const deleteAiTrackRecord = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/track-records/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-ai-track-record')
      await Promise.all([fetchAiTabData(), fetchSummary()])
    } catch {
      setError('추천 성과 삭제에 실패했습니다.')
    }
  }

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
          <div className="hero-badges">
            <SourceBadge label="KRX 실데이터" tone="live" />
            <SourceBadge label="CBOE VIX" tone="live" />
            <SourceBadge label="탭별 분리 로드" tone="mixed" />
          </div>
          <small>generated at {overview?.generatedAt ?? '-'}</small>
          <small>{buildFreshnessLabel(overview?.generatedAt)}</small>
        </div>
      </section>

      {error ? <section className="error-card">{error}</section> : null}

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
                <div className="index-grid">
                  {marketSection?.indices.map((item) => (
                    <IndexChartCard key={item.label} item={item} />
                  ))}
                </div>
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
                            onClick={() => toggleNewsCluster(cluster.clusterKey)}
                          >
                            {expanded ? `접기` : `기사 ${cluster.items.length - 1}개 더보기`}
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
      ) : null}

      {activeTab === 'stocks' ? (
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
                placeholder="종목명, 티커, 섹터 검색"
              />
              <span className="stock-result-count">{filteredMovers.length}개</span>
            </div>
            <div className="watchlist">
              {filteredMovers.map((item) => {
                const market = overview?.koreaMarket.leadingStocks.some((stock) => stock.ticker === item.ticker) ? 'KR' : 'US'
                return (
                  <article key={`${item.ticker}-${item.name}`} className="watch-item">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.ticker} · {item.sector}</span>
                    </div>
                    <div className="watch-metrics">
                      <strong>{formatNumber(item.price)}</strong>
                      <span className={item.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(item.changeRate)}</span>
                    </div>
                    <p>{item.stance}</p>
                    <div className="inline-actions">
                      <button type="button" className="action-button" onClick={() => applyMoverToWatchForm(item, market)}>
                        관심 추가
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
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
                <button type="button" className="primary-button" disabled={isSavingWatch} onClick={() => void saveWatchItem()}>
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
                    <button type="button" className="action-button" onClick={() => applyWatchToPortfolioForm(item)}>
                      보유 편입
                    </button>
                    {item.source === 'USER' && item.id ? (
                      <button type="button" className="ghost-button danger" onClick={() => void deleteWatchItem(item.id)}>
                        삭제
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'portfolio' ? (
        <>
          <section className="grid cards">
            <article className="panel metric-card">
              <span className="label">Total Cost</span>
              <strong>{formatNumber(overview?.portfolio.totalCost ?? 0)}</strong>
              <small>총 매입금액</small>
            </article>
            <article className="panel metric-card">
              <span className="label">Evaluation</span>
              <strong>{formatNumber(overview?.portfolio.totalValue ?? 0)}</strong>
              <small>평가금액</small>
            </article>
            <article className="panel metric-card">
              <span className="label">Profit</span>
              <strong>{formatNumber(overview?.portfolio.totalProfit ?? 0)}</strong>
              <p className={(overview?.portfolio.totalProfitRate ?? 0) >= 0 ? 'up' : 'down'}>
                {formatSignedRate(overview?.portfolio.totalProfitRate ?? 0)}
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
                {overview?.portfolio.positions.map((position) => (
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
                        <button type="button" className="ghost-button danger" onClick={() => void deletePortfolioPosition(position.id)}>
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
                  <button type="button" className="primary-button" disabled={isSavingPortfolio} onClick={() => void savePortfolioPosition()}>
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
              <p className="headline">{overview?.briefing.headline}</p>
              <div className="split-list">
                <div>
                  <span className="label">Pre Market</span>
                  <ul className="brief-list">
                    {overview?.briefing.preMarket.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="label">After Market</span>
                  <ul className="brief-list">
                    {overview?.briefing.afterMarket.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          </section>
        </>
      ) : null}

      {activeTab === 'ai' ? (
        <section className="grid content stocks-layout">
          <article className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">AI Picks</p>
                <h2>오늘 사면 좋을 종목</h2>
              </div>
              <SourceBadge label="MIXED" tone="mixed" />
              <span className="tag">{overview?.aiRecommendations.generatedDate}</span>
            </div>
            <p className="headline">{overview?.aiRecommendations.summary}</p>
            <div className="watchlist">
              {overview?.aiRecommendations.picks.map((pick) => {
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
                        <button type="button" className="ghost-button danger" onClick={() => void deleteAiPick(pick.id)}>
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
                <button type="button" className="primary-button" disabled={isSavingAiPick} onClick={() => void saveAiPick()}>
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
                <button type="button" className="primary-button" disabled={isSavingAiTrackRecord} onClick={() => void saveAiTrackRecord()}>
                  {isSavingAiTrackRecord ? '저장 중...' : '추천 성과 저장'}
                </button>
              </div>
            </div>
            <div className="watchlist">
              {overview?.aiRecommendations.trackRecords.map((record) => (
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
                      <button type="button" className="ghost-button danger" onClick={() => void deleteAiTrackRecord(record.id)}>
                        삭제
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'paper' ? (
        <>
          <section className="grid cards">
            <article className="panel metric-card">
              <span className="label">Cash</span>
              <strong>{formatNumber(overview?.paperTrading.cash ?? 0)}</strong>
              <small>모의 투자 현금</small>
            </article>
            <article className="panel metric-card">
              <span className="label">Evaluation</span>
              <strong>{formatNumber(overview?.paperTrading.evaluation ?? 0)}</strong>
              <small>평가 자산</small>
            </article>
            <article className="panel metric-card">
              <span className="label">Return</span>
              <strong>{formatSignedRate(overview?.paperTrading.totalReturnRate ?? 0)}</strong>
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
                {overview?.paperTrading.openPositions.map((position) => (
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
                        <button type="button" className="ghost-button danger" onClick={() => void deletePaperPosition(position.id)}>
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
                  <button type="button" className="primary-button" disabled={isSavingPaperPosition} onClick={() => void savePaperPosition()}>
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
                  <button type="button" className="primary-button" disabled={isSavingPaperTrade} onClick={() => void savePaperTrade()}>
                    {isSavingPaperTrade ? '저장 중...' : '거래 로그 저장'}
                  </button>
                </div>
              </div>
              <div className="watchlist">
                {overview?.paperTrading.recentTrades.map((trade) => (
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
                        <button type="button" className="ghost-button danger" onClick={() => void deletePaperTrade(trade.id)}>
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
      ) : null}

      <section className="panel source-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Source Map</p>
            <h2>데이터 소스 구조</h2>
          </div>
        </div>
        <p className="source-summary">
          지금은 한국 지수/수급/차트, 미국 지수(FRED), VIX, 뉴스가 실데이터고, 미국 개별 종목/AI 추천/모의투자는 단계적으로 교체 중이야. 관심종목/포트폴리오는 이제 사용자 저장 구조까지 붙었다.
        </p>
        <div className="source-list">
          {overview?.sourceNotes.map((source) => (
            <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="source-item">
              <strong>{source.label}</strong>
              <span>{source.source}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
