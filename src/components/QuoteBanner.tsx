import { useEffect, useState } from 'react'
import { INVESTING_QUOTES } from '../utils/investingQuotes'

const CYCLE_MS = 7000
const FADE_MS = 400

export function QuoteBanner() {
  const [index, setIndex] = useState(() => {
    const today = new Date().toISOString().slice(0, 10)
    const seed = today.replace(/-/g, '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return seed % INVESTING_QUOTES.length
  })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % INVESTING_QUOTES.length)
        setVisible(true)
      }, FADE_MS)
    }, CYCLE_MS)
    return () => clearInterval(timer)
  }, [])

  const quote = INVESTING_QUOTES[index]

  return (
    <div className="quote-banner" style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}>
      <span className="label">오늘의 투자 명언</span>
      <p className="quote-banner-text">"{quote.text}"</p>
      <span className="quote-banner-author">— {quote.author}</span>
    </div>
  )
}
