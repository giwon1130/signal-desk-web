import { API_BASE_URL, emptyAiPickForm, emptyAiTrackRecordForm, emptyPaperPositionForm, emptyPaperTradeForm, emptyPortfolioForm, emptyWatchForm } from '../constants'
import type {
  AiPickForm,
  AiTrackRecordForm,
  PaperPositionForm,
  PaperTradeForm,
  PortfolioForm,
  WatchForm,
} from '../types'

type Params = {
  watchForm: WatchForm
  setWatchForm: React.Dispatch<React.SetStateAction<WatchForm>>
  portfolioForm: PortfolioForm
  setPortfolioForm: React.Dispatch<React.SetStateAction<PortfolioForm>>
  paperPositionForm: PaperPositionForm
  setPaperPositionForm: React.Dispatch<React.SetStateAction<PaperPositionForm>>
  paperTradeForm: PaperTradeForm
  setPaperTradeForm: React.Dispatch<React.SetStateAction<PaperTradeForm>>
  aiPickForm: AiPickForm
  setAiPickForm: React.Dispatch<React.SetStateAction<AiPickForm>>
  aiTrackRecordForm: AiTrackRecordForm
  setAiTrackRecordForm: React.Dispatch<React.SetStateAction<AiTrackRecordForm>>
  setActiveTab: React.Dispatch<React.SetStateAction<'market' | 'stocks' | 'portfolio' | 'ai' | 'paper'>>
  setTabErrors: React.Dispatch<React.SetStateAction<Record<'summary' | 'market' | 'stocks' | 'portfolio' | 'ai' | 'paper', string>>>
  setIsSavingWatch: React.Dispatch<React.SetStateAction<boolean>>
  setIsSavingPortfolio: React.Dispatch<React.SetStateAction<boolean>>
  setIsSavingPaperPosition: React.Dispatch<React.SetStateAction<boolean>>
  setIsSavingPaperTrade: React.Dispatch<React.SetStateAction<boolean>>
  setIsSavingAiPick: React.Dispatch<React.SetStateAction<boolean>>
  setIsSavingAiTrackRecord: React.Dispatch<React.SetStateAction<boolean>>
  refreshSummary: () => Promise<void>
  refreshStocks: () => Promise<void>
  refreshPortfolio: () => Promise<void>
  refreshPaper: () => Promise<void>
  refreshAi: () => Promise<void>
}

export function useWorkspaceActions({
  watchForm,
  setWatchForm,
  portfolioForm,
  setPortfolioForm,
  paperPositionForm,
  setPaperPositionForm,
  paperTradeForm,
  setPaperTradeForm,
  aiPickForm,
  setAiPickForm,
  aiTrackRecordForm,
  setAiTrackRecordForm,
  setActiveTab,
  setTabErrors,
  setIsSavingWatch,
  setIsSavingPortfolio,
  setIsSavingPaperPosition,
  setIsSavingPaperTrade,
  setIsSavingAiPick,
  setIsSavingAiTrackRecord,
  refreshSummary,
  refreshStocks,
  refreshPortfolio,
  refreshPaper,
  refreshAi,
}: Params) {
  const applyMoverToWatchForm = (item: { ticker: string; name: string; price: number; changeRate: number; sector: string; stance: string }, market: 'KR' | 'US') => {
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

  const applyWatchToPortfolioForm = (item: { market: string; ticker: string; name: string; price: number }) => {
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
      setTabErrors((prev) => ({ ...prev, stocks: '관심종목 입력값을 확인해.' }))
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
      if (!response.ok) throw new Error('save-watch')
      setWatchForm(emptyWatchForm)
      await Promise.all([refreshStocks(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, stocks: '관심종목 저장에 실패했습니다.' }))
    } finally {
      setIsSavingWatch(false)
    }
  }

  const deleteWatchItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/watchlist/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-watch')
      await Promise.all([refreshStocks(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, stocks: '관심종목 삭제에 실패했습니다.' }))
    }
  }

  const savePortfolioPosition = async () => {
    if (!portfolioForm.ticker || !portfolioForm.name || !portfolioForm.buyPrice || !portfolioForm.currentPrice || !portfolioForm.quantity) {
      setTabErrors((prev) => ({ ...prev, portfolio: '포트폴리오 입력값을 확인해.' }))
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
      if (!response.ok) throw new Error('save-portfolio')
      setPortfolioForm(emptyPortfolioForm)
      await Promise.all([refreshPortfolio(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, portfolio: '포트폴리오 저장에 실패했습니다.' }))
    } finally {
      setIsSavingPortfolio(false)
    }
  }

  const deletePortfolioPosition = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/portfolio/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-portfolio')
      await Promise.all([refreshPortfolio(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, portfolio: '포트폴리오 삭제에 실패했습니다.' }))
    }
  }

  const savePaperPosition = async () => {
    if (!paperPositionForm.ticker || !paperPositionForm.name || !paperPositionForm.averagePrice || !paperPositionForm.currentPrice || !paperPositionForm.quantity) {
      setTabErrors((prev) => ({ ...prev, paper: '모의 보유종목 입력값을 확인해.' }))
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
      await Promise.all([refreshPaper(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, paper: '모의 보유종목 저장에 실패했습니다.' }))
    } finally {
      setIsSavingPaperPosition(false)
    }
  }

  const deletePaperPosition = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/positions/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-paper-position')
      await Promise.all([refreshPaper(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, paper: '모의 보유종목 삭제에 실패했습니다.' }))
    }
  }

  const savePaperTrade = async () => {
    if (!paperTradeForm.tradeDate || !paperTradeForm.ticker || !paperTradeForm.name || !paperTradeForm.price || !paperTradeForm.quantity) {
      setTabErrors((prev) => ({ ...prev, paper: '모의 거래 입력값을 확인해.' }))
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
      await Promise.all([refreshPaper(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, paper: '모의 거래 저장에 실패했습니다.' }))
    } finally {
      setIsSavingPaperTrade(false)
    }
  }

  const deletePaperTrade = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/paper/trades/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-paper-trade')
      await Promise.all([refreshPaper(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, paper: '모의 거래 삭제에 실패했습니다.' }))
    }
  }

  const saveAiPick = async () => {
    if (!aiPickForm.ticker || !aiPickForm.name || !aiPickForm.basis || !aiPickForm.note) {
      setTabErrors((prev) => ({ ...prev, ai: 'AI 추천 입력값을 확인해.' }))
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
      await Promise.all([refreshAi(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, ai: 'AI 추천 저장에 실패했습니다.' }))
    } finally {
      setIsSavingAiPick(false)
    }
  }

  const deleteAiPick = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/picks/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-ai-pick')
      await Promise.all([refreshAi(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, ai: 'AI 추천 삭제에 실패했습니다.' }))
    }
  }

  const saveAiTrackRecord = async () => {
    if (!aiTrackRecordForm.recommendedDate || !aiTrackRecordForm.ticker || !aiTrackRecordForm.name || !aiTrackRecordForm.entryPrice || !aiTrackRecordForm.latestPrice) {
      setTabErrors((prev) => ({ ...prev, ai: '추천 성과 입력값을 확인해.' }))
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
      await Promise.all([refreshAi(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, ai: '추천 성과 저장에 실패했습니다.' }))
    } finally {
      setIsSavingAiTrackRecord(false)
    }
  }

  const deleteAiTrackRecord = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/workspace/ai/track-records/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete-ai-track-record')
      await Promise.all([refreshAi(), refreshSummary()])
    } catch {
      setTabErrors((prev) => ({ ...prev, ai: '추천 성과 삭제에 실패했습니다.' }))
    }
  }

  return {
    applyMoverToWatchForm,
    applyWatchToPortfolioForm,
    saveWatchItem,
    deleteWatchItem,
    savePortfolioPosition,
    deletePortfolioPosition,
    savePaperPosition,
    deletePaperPosition,
    savePaperTrade,
    deletePaperTrade,
    saveAiPick,
    deleteAiPick,
    saveAiTrackRecord,
    deleteAiTrackRecord,
  }
}
