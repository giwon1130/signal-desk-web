import type { MarketNews, NewsClassification, NewsCluster, NewsImpactLevel, NewsSignalDirection } from '../types'

export function getDirectionLabel(direction: NewsSignalDirection) {
  switch (direction) {
    case 'positive':
      return '호재 우위'
    case 'negative':
      return '악재 우위'
    default:
      return '중립'
  }
}

export function classifyNews(title: string, impact: string): NewsClassification {
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

export function getImpactLevelLabel(level: NewsImpactLevel) {
  switch (level) {
    case 'high':
      return '영향도 높음'
    case 'medium':
      return '영향도 보통'
    default:
      return '영향도 낮음'
  }
}

export function buildNewsClusterKey(title: string, sector: string) {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\\s]/g, ' ')
    .split(/\\s+/)
    .filter((token) => token.length >= 2)
    .slice(0, 4)
    .join('-')

  return `${sector}:${normalized || 'general'}`
}

export function summarizeCluster(cluster: Array<MarketNews & { classification: NewsClassification }>) {
  const first = cluster[0]
  if (!first) return '주요 이슈'
  if (cluster.length === 1) return first.title
  return `${first.classification.sector} 이슈 ${cluster.length}건`
}

export function buildMarketNewsDigest(clusters: NewsCluster[]) {
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
