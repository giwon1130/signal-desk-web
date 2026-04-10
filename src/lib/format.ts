export function formatNumber(value: number) {
  return value.toLocaleString('ko-KR')
}

export function formatSignedRate(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function getSentimentIcon(score: number) {
  if (score >= 70) return '🟢'
  if (score >= 45) return '🟡'
  return '🔴'
}

export function buildFreshnessLabel(generatedAt?: string) {
  if (!generatedAt) return '-'
  const generated = new Date(generatedAt)
  const diffMinutes = Math.max(0, Math.round((Date.now() - generated.getTime()) / 60000))
  if (diffMinutes <= 1) return '방금 갱신'
  if (diffMinutes < 60) return `${diffMinutes}분 전 갱신`
  const hours = Math.floor(diffMinutes / 60)
  return `${hours}시간 전 갱신`
}
