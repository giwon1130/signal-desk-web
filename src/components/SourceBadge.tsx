export function SourceBadge({
  label,
  tone,
}: {
  label: string
  tone: 'live' | 'mixed' | 'mock'
}) {
  return <span className={`status-badge ${tone}`}>{label}</span>
}
