import { type ComponentType, useEffect, useState } from 'react'

type ChartPoint = {
  label: string
  value: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type ChartStats = {
  latest: number
  high: number
  low: number
  changeRate: number
  range: number
  averageVolume: number
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

function computeMovingAverage(points: ChartPoint[], period: number) {
  return points.map((_, index) => {
    if (index + 1 < period) return null
    const window = points.slice(index + 1 - period, index + 1)
    const sum = window.reduce((acc, item) => acc + item.close, 0)
    return Number((sum / period).toFixed(2))
  })
}

function IndexChartCard({ item }: { item: IndexMetric }) {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(item.periods[0]?.key ?? '1D')
  const [ChartComponent, setChartComponent] = useState<null | ComponentType<{ option: unknown; notMerge?: boolean; lazyUpdate?: boolean; className?: string }>>(null)
  const activePeriod = item.periods.find((period) => period.key === activePeriodKey) ?? item.periods[0]

  useEffect(() => {
    let mounted = true
    Promise.all([
      import('echarts-for-react/lib/core'),
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
    ]).then(([reactCoreModule, echartsCoreModule, chartsModule, componentsModule, renderersModule]) => {
      const { default: ReactEChartsCore } = reactCoreModule
      const { echarts } = echartsCoreModule
      const { CandlestickChart, BarChart, LineChart } = chartsModule
      const { GridComponent, TooltipComponent, AxisPointerComponent } = componentsModule
      const { CanvasRenderer } = renderersModule

      echarts.use([
        CandlestickChart,
        BarChart,
        LineChart,
        GridComponent,
        TooltipComponent,
        AxisPointerComponent,
        CanvasRenderer,
      ])

      if (mounted) {
        setChartComponent(() => ((props) => <ReactEChartsCore echarts={echarts} {...props} />) as ComponentType<{
          option: unknown
          notMerge?: boolean
          lazyUpdate?: boolean
          className?: string
        }>)
      }
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
  const xLabels = activePeriod.points.map((point) => point.label)
  const candleSeries = activePeriod.points.map((point) => [point.open, point.close, point.low, point.high])
  const volumes = activePeriod.points.map((point) => point.volume)
  const ma5 = computeMovingAverage(activePeriod.points, 5)
  const ma20 = computeMovingAverage(activePeriod.points, 20)
  const ma60 = computeMovingAverage(activePeriod.points, 60)
  const volumeMax = Math.max(...volumes, 1)

  const chartOption = {
    animation: true,
    xAxis: [
      {
        type: 'category',
        data: xLabels,
        boundaryGap: true,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.28)' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          hideOverlap: true,
        },
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: xLabels,
        boundaryGap: true,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
        axisTick: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
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
      {
        type: 'value',
        gridIndex: 1,
        min: 0,
        max: Math.ceil(volumeMax * 1.08),
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 10,
          formatter: (value: number) => `${Math.round(value / 1000)}k`,
        },
      },
    ],
    grid: [
      {
        left: 18,
        right: 16,
        top: 20,
        height: '56%',
        containLabel: true,
      },
      {
        left: 18,
        right: 16,
        top: '80%',
        height: '14%',
        containLabel: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      borderWidth: 0,
      textStyle: { color: '#f8fafc' },
      formatter: (params: unknown) => {
        const safeParams = Array.isArray(params) ? params : []
        const candle = safeParams.find((entry) => (entry as { seriesName?: string }).seriesName === 'Candle') as { data?: number[]; axisValue?: string } | undefined
        const volume = safeParams.find((entry) => (entry as { seriesName?: string }).seriesName === 'Volume') as { data?: number } | undefined
        if (!candle) return ''
        const [open, close, low, high] = candle.data ?? [0, 0, 0, 0]
        return [
          candle.axisValue ?? '',
          `${item.label} O ${formatNumber(Math.round(open))} / H ${formatNumber(Math.round(high))}`,
          `L ${formatNumber(Math.round(low))} / C ${formatNumber(Math.round(close))}`,
          `거래량 ${formatNumber(Math.round(Number(volume?.data ?? 0)))}`,
        ].join('<br/>')
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: [0, 1] }],
    },
    series: [
      {
        name: 'Candle',
        type: 'candlestick',
        data: candleSeries,
        itemStyle: {
          color: '#dc2626',
          color0: '#2563eb',
          borderColor: '#dc2626',
          borderColor0: '#2563eb',
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: ma5,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 1.6, color: '#f59e0b' },
      },
      {
        name: 'MA20',
        type: 'line',
        data: ma20,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 1.6, color: '#6366f1' },
      },
      {
        name: 'MA60',
        type: 'line',
        data: ma60,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 1.6, color: '#10b981' },
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: activePeriod.points.map((point) => ({
          value: point.volume,
          itemStyle: {
            color: point.close >= point.open ? 'rgba(220, 38, 38, 0.56)' : 'rgba(37, 99, 235, 0.56)',
          },
        })),
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
          <p className={activePeriod.stats.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(activePeriod.stats.changeRate)} · {seriesColor === '#dc2626' ? '상승 우위' : '하락 우위'}</p>
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
        <div>
          <span className="label">평균 거래량</span>
          <strong>{formatNumber(activePeriod.stats.averageVolume)}</strong>
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
