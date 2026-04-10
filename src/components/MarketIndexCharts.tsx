import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts'

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

function toChartTime(index: number): UTCTimestamp {
  return (index + 1) as UTCTimestamp
}

function buildAxisLabels(points: ChartPoint[]) {
  const labels = new Map<number, string>()
  points.forEach((point, index) => {
    labels.set(index + 1, point.label)
  })
  return labels
}

function IndexChartCanvas({ period }: { period: ChartPeriodSnapshot }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const ma5SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ma20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ma60SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  const axisLabels = useMemo(() => buildAxisLabels(period.points), [period.points])
  const candleData = useMemo(
    () => period.points.map((point, index) => ({
      time: toChartTime(index),
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    })),
    [period.points],
  )
  const volumeData = useMemo(
    () =>
      period.points.map((point, index) => ({
        time: toChartTime(index),
        value: point.volume,
        color: point.close >= point.open ? 'rgba(220, 38, 38, 0.50)' : 'rgba(37, 99, 235, 0.50)',
      })),
    [period.points],
  )
  const ma5Data = useMemo(
    () =>
      computeMovingAverage(period.points, 5).flatMap((value, index) =>
        value == null ? [] : [{ time: toChartTime(index), value }],
      ),
    [period.points],
  )
  const ma20Data = useMemo(
    () =>
      computeMovingAverage(period.points, 20).flatMap((value, index) =>
        value == null ? [] : [{ time: toChartTime(index), value }],
      ),
    [period.points],
  )
  const ma60Data = useMemo(
    () =>
      computeMovingAverage(period.points, 60).flatMap((value, index) =>
        value == null ? [] : [{ time: toChartTime(index), value }],
      ),
    [period.points],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || chartRef.current) return

    const chart = createChart(container, {
      autoSize: true,
      height: 220,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.10)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(15, 23, 42, 0.28)',
          width: 1,
          style: 0,
          labelBackgroundColor: '#0f172a',
        },
        horzLine: {
          color: 'rgba(15, 23, 42, 0.18)',
          labelBackgroundColor: '#0f172a',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.16)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.16)',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) => axisLabels.get(Number(time)) ?? '',
      },
      localization: {
        priceFormatter: (price: number) => formatNumber(Math.round(price)),
      },
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#dc2626',
      downColor: '#2563eb',
      wickUpColor: '#dc2626',
      wickDownColor: '#2563eb',
      borderVisible: false,
      priceLineVisible: false,
      lastValueVisible: true,
    })
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      lastValueVisible: false,
      priceLineVisible: false,
    })
    const ma5Series = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    const ma20Series = chart.addSeries(LineSeries, {
      color: '#6366f1',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    const ma60Series = chart.addSeries(LineSeries, {
      color: '#10b981',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.78,
        bottom: 0,
      },
    })
    chart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0.08,
        bottom: 0.26,
      },
    })

    chartRef.current = chart
    candleSeriesRef.current = candleSeries
    volumeSeriesRef.current = volumeSeries
    ma5SeriesRef.current = ma5Series
    ma20SeriesRef.current = ma20Series
    ma60SeriesRef.current = ma60Series

    return () => {
      chart.remove()
      chartRef.current = null
      candleSeriesRef.current = null
      volumeSeriesRef.current = null
      ma5SeriesRef.current = null
      ma20SeriesRef.current = null
      ma60SeriesRef.current = null
    }
  }, [axisLabels])

  useEffect(() => {
    candleSeriesRef.current?.setData(candleData)
    volumeSeriesRef.current?.setData(volumeData)
    ma5SeriesRef.current?.setData(ma5Data)
    ma20SeriesRef.current?.setData(ma20Data)
    ma60SeriesRef.current?.setData(ma60Data)
    chartRef.current?.timeScale().fitContent()
  }, [candleData, volumeData, ma5Data, ma20Data, ma60Data])

  return <div ref={containerRef} className="tv-chart-container" />
}

function IndexChartCard({ item }: { item: IndexMetric }) {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(item.periods[0]?.key ?? '1D')
  const activePeriod = item.periods.find((period) => period.key === activePeriodKey) ?? item.periods[0]

  if (!activePeriod) {
    return (
      <article className="index-card">
        <span className="label">{item.label}</span>
        <strong>{formatNumber(item.value)}</strong>
        <p className={item.changeRate >= 0 ? 'up' : 'down'}>{formatSignedRate(item.changeRate)}</p>
      </article>
    )
  }

  const startLabel = activePeriod.points[0]?.label ?? '-'
  const midLabel = activePeriod.points[Math.floor((activePeriod.points.length - 1) / 2)]?.label ?? '-'
  const endLabel = activePeriod.points[activePeriod.points.length - 1]?.label ?? '-'

  return (
    <article className="index-card index-card-rich">
      <div className="index-card-header">
        <div>
          <span className="label">{item.label}</span>
          <strong>{formatNumber(Math.round(activePeriod.stats.latest * 100) / 100)}</strong>
          <p className={activePeriod.stats.changeRate >= 0 ? 'up' : 'down'}>
            {formatSignedRate(activePeriod.stats.changeRate)} · {activePeriod.stats.changeRate >= 0 ? '상승 우위' : '하락 우위'}
          </p>
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

      <IndexChartCanvas period={activePeriod} />

      <div className="chart-legend">
        <span className="legend-chip amber">MA5</span>
        <span className="legend-chip indigo">MA20</span>
        <span className="legend-chip emerald">MA60</span>
        <span className="legend-chip muted">Volume</span>
      </div>

      <div className="chart-axis">
        <span>{startLabel}</span>
        <span>{midLabel}</span>
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
          <span className="label">등락률</span>
          <strong>{formatSignedRate(activePeriod.stats.changeRate)}</strong>
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
