import { type ComponentType, useEffect, useState } from 'react'

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

type ChartPeriodSnapshot = {
  key: string
  label: string
  points: ChartPoint[]
  stats: ChartStats
}

type IndexMetric = {
  label: string
  value: number
  changeRate: number
  periods: ChartPeriodSnapshot[]
}

function formatNumber(value: number) {
  return value.toLocaleString('ko-KR')
}

function formatSignedRate(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function IndexChartCard({ item }: { item: IndexMetric }) {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(item.periods[0]?.key ?? '1D')
  const [ChartComponent, setChartComponent] = useState<null | ComponentType<{ option: unknown; notMerge?: boolean; lazyUpdate?: boolean; className?: string }>>(null)
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

export default function MarketIndexCharts({ indices }: { indices: IndexMetric[] }) {
  return (
    <div className="index-grid">
      {indices.map((item) => (
        <IndexChartCard key={item.label} item={item} />
      ))}
    </div>
  )
}
