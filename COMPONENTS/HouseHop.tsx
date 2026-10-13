'use client'

// House Hop: a tiny Doodle-Jump-style game inside the free credit game.
// The doodle auto-bounces from roof to roof; steer with tilt (phones),
// arrow keys / A-D (desktop), or the on-screen buttons (fallback).
// Landing on a new house shows a general credit tip. The only thing saved is
// your best score + nickname on the public leaderboard (via a checked RPC).

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ThemeKey } from './theme'
import { supabase } from '@/lib/supabase'
import HouseHopLeaderboard from './HouseHopLeaderboard'

const W = 360
const H = 540
const GRAVITY = 0.32
const BOUNCE = -10.2
const MAX_VX = 5.2

const TIPS = [
  'Pay every bill on time. Payment history is the biggest part of most scores.',
  'Keep card balances under 30% of your limits. Lower is even better.',
  "Don't close your oldest card. Account age helps your score.",
  'Check your reports free at annualcreditreport.com.',
  'Found a mistake on your report? Dispute it with the credit bureau.',
  'Avoid opening new credit right before applying for a mortgage.',
  'Set up autopay for at least the minimum so you never miss a due date.',
  'Paying down balances before the statement date can lower reported use.',
  'Only apply for credit you need. Each hard inquiry can dip your score a little.',
  'Ask about rent reporting. Some services add on-time rent to your file.',
]

type House = { x: number; y: number; w: number; color: string; roof: string; counted: boolean }
type Mode = 'idle' | 'playing' | 'paused' | 'over'

const PALETTE: Record<ThemeKey, { sky: [string, string]; houses: string[]; roofs: string[]; accent: string }> = {
  meatloaf: {
    sky: ['#DBEAFE', '#EDE9FE'],
    houses: ['#FFFFFF', '#E0E7FF', '#F5F3FF', '#DBEAFE'],
    roofs: ['#2563EB', '#4F46E5', '#7C3AED', '#9333EA'],
    accent: '#2563EB',
  },
  mimosa: {
    sky: ['#FCE7F3', '#FFF7E6'],
    houses: ['#FFFFFF', '#FFF1F2', '#FDF2F8', '#FFF7E6'],
    roofs: ['#EC4899', '#F472B6', '#FB7185', '#E8C27A'],
    accent: '#EC4899',
  },
}

function drawDoodle(ctx: CanvasRenderingContext2D, x: number, y: number, face: number, theme: ThemeKey) {
  // x,y = center bottom. Original doodle art: fluffy goldendoodle.
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(face, 1)
  const fur = '#E3B778'
  const furDark = '#C8955A'
  const puff = (cx: number, cy: number, r: number, c = fur) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // legs
  puff(-7, -4, 5, furDark)
  puff(7, -4, 5, furDark)
  // body / outfit
  if (theme === 'meatloaf') {
    // bathrobe
    const g = ctx.createLinearGradient(-14, -30, 14, -4)
    g.addColorStop(0, '#2563EB')
    g.addColorStop(1, '#9333EA')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.roundRect(-13, -32, 26, 28, 9)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-6, -32)
    ctx.lineTo(2, -16)
    ctx.lineTo(8, -32)
    ctx.stroke()
    ctx.fillStyle = '#F5F3FF'
    ctx.fillRect(-13, -15, 26, 3) // belt
  } else {
    puff(0, -18, 13)
    puff(-6, -14, 8)
    puff(6, -14, 8)
    ctx.fillStyle = '#FB7185'
    ctx.beginPath()
    ctx.roundRect(-13, -28, 26, 5, 3) // pink scarf
    ctx.fill()
  }
  // drink in front paw
  if (theme === 'meatloaf') {
    ctx.fillStyle = '#F59E0B'
    ctx.fillRect(13, -30, 8, 13)
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(17, -30, 4.5, Math.PI, 0)
    ctx.fill()
    ctx.strokeStyle = '#B45309'
    ctx.lineWidth = 1.5
    ctx.strokeRect(13, -30, 8, 13)
  } else {
    ctx.fillStyle = '#F7E7CE'
    ctx.beginPath()
    ctx.moveTo(12, -31)
    ctx.lineTo(22, -31)
    ctx.lineTo(20.5, -17)
    ctx.lineTo(13.5, -17)
    ctx.fill()
    ctx.fillStyle = '#EC4899'
    ctx.fillRect(12, -33, 10, 3) // lid
    ctx.fillStyle = '#7C4A2D'
    ctx.fillRect(13.5, -26, 7, 4) // sleeve
  }
  puff(15, -22, 4.5) // paw
  // head
  puff(0, -44, 13)
  puff(-9, -51, 7)
  puff(0, -55, 7)
  puff(9, -51, 7)
  puff(-13, -40, 6, furDark) // ears
  puff(13, -40, 6, furDark)
  ctx.fillStyle = '#FFF7ED'
  ctx.beginPath()
  ctx.ellipse(3, -39, 7, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3F2A1D'
  ctx.beginPath()
  ctx.arc(5, -41, 2.6, 0, Math.PI * 2) // nose
  ctx.fill()
  if (theme === 'mimosa') {
    // sunglasses
    ctx.fillStyle = '#111827'
    ctx.beginPath()
    ctx.roundRect(-10, -50, 9, 6, 2)
    ctx.roundRect(1, -50, 9, 6, 2)
    ctx.fill()
    ctx.fillRect(-1, -48, 2, 1.5)
    ctx.fillStyle = '#F9A8D4'
    ctx.fillRect(-8, -49, 3, 1.5)
    ctx.fillRect(3, -49, 3, 1.5)
  } else {
    ctx.fillStyle = '#3F2A1D'
    ctx.beginPath()
    ctx.arc(-4, -47, 1.8, 0, Math.PI * 2)
    ctx.arc(5, -47, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.strokeStyle = '#3F2A1D'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(3, -37, 3, 0.2, Math.PI - 0.2) // smile
  ctx.stroke()
  ctx.restore()
}

function drawHouse(ctx: CanvasRenderingContext2D, h: House) {
  const bodyH = 26
  ctx.fillStyle = h.color
  ctx.strokeStyle = 'rgba(17,24,39,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.rect(h.x + 4, h.y, h.w - 8, bodyH)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = h.roof
  ctx.beginPath()
  ctx.moveTo(h.x - 2, h.y + 2)
  ctx.lineTo(h.x + h.w / 2, h.y - 16)
  ctx.lineTo(h.x + h.w + 2, h.y + 2)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(17,24,39,0.55)'
  ctx.fillRect(h.x + h.w / 2 - 4, h.y + bodyH - 13, 8, 13) // door
  ctx.fillStyle = '#FDE68A'
  ctx.fillRect(h.x + 9, h.y + 7, 7, 7)
  ctx.fillRect(h.x + h.w - 16, h.y + 7, 7, 7)
}

export default function HouseHop({ theme }: { theme: ThemeKey }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [tip, setTip] = useState<string | null>(null)
  const [boardKey, setBoardKey] = useState(0)
  const runStart = useRef(0)
  const [motion, setMotion] = useState<'unknown' | 'on' | 'denied' | 'none'>('unknown')
  const modeRef = useRef<Mode>('idle')
  const keys = useRef({ left: false, right: false })
  const touch = useRef(0) // -1, 0, 1 from buttons
  const tilt = useRef({ raw: 0, base: null as number | null, smooth: 0 })
  const state = useRef({
    x: W / 2, y: H - 60, vx: 0, vy: BOUNCE, face: 1, camY: 0, houses: [] as House[], tipIdx: 0, score: 0,
  })

  const pal = PALETTE[theme]

  const makeHouse = useCallback(
    (y: number): House => {
      const w = 56 + Math.random() * 18
      const i = Math.floor(Math.random() * pal.houses.length)
      return { x: Math.random() * (W - w), y, w, color: pal.houses[i], roof: pal.roofs[i], counted: false }
    },
    [pal],
  )

  const resetWorld = useCallback(() => {
    const houses: House[] = [{ x: W / 2 - 40, y: H - 40, w: 80, color: pal.houses[0], roof: pal.roofs[0], counted: true }]
    let y = H - 40
    while (y > -H) {
      y -= 62 + Math.random() * 22
      houses.push(makeHouse(y))
    }
    state.current = { x: W / 2, y: H - 40, vx: 0, vy: BOUNCE, face: 1, camY: 0, houses, tipIdx: Math.floor(Math.random() * TIPS.length), score: 0 }
    tilt.current.base = null
    tilt.current.smooth = 0
  }, [makeHouse, pal])

  const reset = useCallback(() => {
    resetWorld()
    setScore(0)
    setTip(null)
  }, [resetWorld])

  const setM = (m: Mode) => {
    modeRef.current = m
    setMode(m)
  }

  // Tilt input (gamma = left/right tilt in degrees). Calibrated to the tilt at start.
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return
      let g = e.gamma
      const angle = (screen.orientation?.angle ?? 0) as number
      if (angle === 90 && e.beta != null) g = e.beta
      else if ((angle === 270 || angle === -90) && e.beta != null) g = -e.beta
      tilt.current.raw = g
      if (tilt.current.base === null) tilt.current.base = g
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.current.left = true
      else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.current.right = true
      else return
      if (modeRef.current === 'playing') e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.current.left = false
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.current.right = false
    }
    const vis = () => {
      if (document.hidden && modeRef.current === 'playing') setM('paused')
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    document.addEventListener('visibilitychange', vis)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    let raf = 0
    let last = performance.now()

    const step = (dt: number) => {
      const s = state.current
      let dir = 0
      if (keys.current.left) dir -= 1
      if (keys.current.right) dir += 1
      if (touch.current) dir = touch.current
      let target = dir * MAX_VX
      if (!dir && tilt.current.base !== null) {
        const t = tilt.current
        const d = Math.max(-25, Math.min(25, t.raw - (t.base ?? 0)))
        t.smooth += (d - t.smooth) * 0.2 * dt
        const dz = Math.abs(t.smooth) < 1.5 ? 0 : t.smooth
        target = (dz / 18) * MAX_VX * 1.3
      }
      s.vx += (target - s.vx) * 0.2 * dt
      if (Math.abs(s.vx) > 0.3) s.face = s.vx > 0 ? 1 : -1
      s.x += s.vx * dt
      if (s.x < -12) s.x = W + 12 // wrap
      if (s.x > W + 12) s.x = -12
      const prevY = s.y
      s.vy += GRAVITY * dt
      s.y += s.vy * dt
      if (s.vy > 0) {
        for (const h of s.houses) {
          const roofY = h.y - 2
          if (prevY <= roofY && s.y >= roofY && s.x > h.x - 4 && s.x < h.x + h.w + 4) {
            s.y = roofY
            s.vy = BOUNCE
            if (!h.counted) {
              h.counted = true
              s.score += 1
              setScore(s.score)
              if (s.score % 3 === 1) {
                setTip(TIPS[s.tipIdx % TIPS.length])
                s.tipIdx++
              }
            }
            break
          }
        }
      }
      // camera follows upward
      const screenY = s.y - s.camY
      if (screenY < H * 0.4) s.camY = s.y - H * 0.4
      // recycle houses
      let topY = Math.min(...s.houses.map((h) => h.y))
      s.houses = s.houses.filter((h) => h.y - s.camY < H + 40)
      while (topY > s.camY - 120) {
        topY -= 62 + Math.random() * 26 + Math.min(s.score, 40) * 0.6
        s.houses.push(makeHouse(topY))
      }
      if (s.y - s.camY > H + 60) {
        setBest((b) => Math.max(b, s.score))
        setM('over')
        const finalScore = s.score
        const ms = Math.round(performance.now() - runStart.current)
        if (finalScore > 0)
          supabase.rpc('submit_house_hop_score', { p_score: finalScore, p_duration_ms: ms }).then(({ error }) => {
            if (!error) setBoardKey((k) => k + 1)
          })
      }
    }

    const draw = () => {
      const s = state.current
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, pal.sky[0])
      g.addColorStop(1, pal.sky[1])
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      for (let i = 0; i < 4; i++) {
        const cy = ((i * 160 - s.camY * 0.3) % (H + 80) + H + 80) % (H + 80) - 40
        ctx.beginPath()
        ctx.ellipse(40 + i * 90, cy, 30, 10, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.save()
      ctx.translate(0, -s.camY)
      for (const h of s.houses) drawHouse(ctx, h)
      drawDoodle(ctx, s.x, s.y, s.face, theme)
      ctx.restore()
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / (1000 / 60), 3)
      last = now
      if (modeRef.current === 'playing') step(dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [makeHouse, pal, theme])

  useEffect(() => {
    resetWorld()
  }, [resetWorld])

  const enableMotion = async () => {
    const DOE = typeof window !== 'undefined' ? (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }) : undefined
    if (!DOE) return setMotion('none')
    if (typeof DOE.requestPermission === 'function') {
      try {
        const r = await DOE.requestPermission()
        setMotion(r === 'granted' ? 'on' : 'denied')
      } catch {
        setMotion('denied')
      }
    } else {
      setMotion(window.matchMedia('(pointer: coarse)').matches ? 'on' : 'none')
    }
  }

  const start = async () => {
    if (motion === 'unknown') await enableMotion() // must run inside the tap for iOS
    reset()
    runStart.current = performance.now()
    setM('playing')
    canvasRef.current?.focus()
  }

  const hold = (d: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      touch.current = d
    },
    onPointerUp: () => (touch.current = 0),
    onPointerLeave: () => (touch.current = 0),
    onPointerCancel: () => (touch.current = 0),
  })

  const btn = theme === 'mimosa' ? 'from-pink-500 to-rose-400' : 'from-blue-600 to-purple-600'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8" id="house-hop">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900">🏠 House Hop</h2>
        <p className="text-sm text-gray-600" aria-live="polite">
          Houses: <b>{score}</b> · Best: <b>{best}</b>
        </p>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Bounce from roof to roof and pick up credit tips. Phone: tilt to steer. Computer: ← → or A / D. Esc or P pauses.
      </p>
      <div className="relative mx-auto" style={{ maxWidth: W }}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={`House Hop game. ${score} houses so far.`}
          className="w-full rounded-xl border border-gray-200 touch-none select-none outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
          style={{ aspectRatio: `${W} / ${H}` }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') setM(modeRef.current === 'playing' ? 'paused' : modeRef.current === 'paused' ? 'playing' : modeRef.current)
            if ((e.key === ' ' || e.key === 'Enter') && modeRef.current !== 'playing') {
              e.preventDefault()
              if (modeRef.current === 'paused') setM('playing')
              else start()
            }
          }}
        />
        {tip && mode === 'playing' && (
          <div className="absolute top-2 left-2 right-2 bg-white/95 rounded-lg shadow p-2 text-xs text-gray-800" role="status">
            💡 {tip}
          </div>
        )}
        {mode !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 rounded-xl p-4 text-center">
            {mode === 'over' && <p className="text-xl font-bold text-gray-900">You hopped {score} houses!</p>}
            {mode === 'over' && tip && <p className="text-sm text-gray-700">💡 {tip}</p>}
            {mode === 'paused' && <p className="text-xl font-bold text-gray-900">Paused</p>}
            <button
              type="button"
              onClick={() => (mode === 'paused' ? setM('playing') : start())}
              className={`bg-gradient-to-r ${btn} text-white font-bold px-6 py-3 rounded-full shadow-lg`}
            >
              {mode === 'paused' ? 'Resume' : mode === 'over' ? 'Play again' : 'Tap to play'}
            </button>
            {mode === 'idle' && <p className="text-xs text-gray-600">On a phone, allow motion so you can tilt to steer.</p>}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <button type="button" aria-label="Move left" {...hold(-1)} className="w-16 h-12 rounded-xl bg-gray-100 text-2xl touch-none select-none">◀</button>
        <button
          type="button"
          onClick={() => setM(mode === 'playing' ? 'paused' : 'playing')}
          disabled={mode === 'idle' || mode === 'over'}
          className="px-4 h-12 rounded-xl bg-gray-100 font-semibold disabled:opacity-40"
        >
          {mode === 'playing' ? 'Pause' : 'Resume'}
        </button>
        <button type="button" onClick={start} className="px-4 h-12 rounded-xl bg-gray-100 font-semibold">Restart</button>
        <button type="button" aria-label="Move right" {...hold(1)} className="w-16 h-12 rounded-xl bg-gray-100 text-2xl touch-none select-none">▶</button>
      </div>
      {motion === 'on' && mode === 'playing' && (
        <p className="text-center mt-2">
          <button type="button" className="text-xs underline text-gray-500" onClick={() => (tilt.current.base = tilt.current.raw)}>Re-center tilt</button>
        </p>
      )}
      {motion === 'denied' && (
        <p className="text-xs text-gray-500 text-center mt-2">Motion is off, so use the ◀ ▶ buttons. To tilt on iPhone, reload the page and tap Allow when asked.</p>
      )}
      <p className="text-xs text-gray-500 text-center mt-3">
        General education only, not financial advice. Only your best score and nickname are saved.
      </p>
      <HouseHopLeaderboard refreshKey={boardKey} accent={pal.accent} />
    </div>
  )
}
