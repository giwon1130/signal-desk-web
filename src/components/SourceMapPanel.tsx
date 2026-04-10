import type { SourceNote } from '../types'

export function SourceMapPanel({ sourceNotes }: { sourceNotes: SourceNote[] }) {
  return (
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
        {sourceNotes.map((source) => (
          <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="source-item">
            <strong>{source.label}</strong>
            <span>{source.source}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
