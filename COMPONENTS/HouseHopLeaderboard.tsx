'use client'

// House Hop leaderboard: public top 10 by nickname only, plus your own rank.
// Scores are saved only through the submit_house_hop_score RPC (server checks).

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Row = { rank: number; nickname: string; best_score: number; is_me: boolean }
type Me = { rank: number; nickname: string; best_score: number; players: number }

export default function HouseHopLeaderboard({ refreshKey, accent }: { refreshKey: number; accent: string }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [editing, setEditing] = useState(false)
  const [nick, setNick] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [top, mine] = await Promise.all([supabase.rpc('get_house_hop_leaderboard'), supabase.rpc('get_my_house_hop_rank')])
    if (!top.error) setRows((top.data as Row[]) ?? [])
    if (!mine.error) setMe(((mine.data as Me[]) ?? [])[0] ?? null)
  }, [])

  useEffect(() => {
    let live = true
    Promise.resolve().then(() => { if (live) load() })
    return () => {
      live = false
    }
  }, [load, refreshKey])

  const saveNick = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const { error } = await supabase.rpc('set_house_hop_nickname', { p_name: nick })
    if (error) return setMsg(error.message.includes('taken') ? 'That nickname is taken.' : 'Use 3-16 letters or numbers, family friendly.')
    setEditing(false)
    load()
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-4" aria-labelledby="hh-top">
      <h3 id="hh-top" className="font-bold text-gray-900 mb-2">🏆 Top Hoppers</h3>
      {rows === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500">No scores yet. Be the first!</p>
      ) : (
        <ol className="text-sm divide-y divide-gray-100">
          {rows.map((r, i) => (
            <li key={i} className={`flex justify-between py-1.5 px-2 rounded ${r.is_me ? 'bg-gray-50 font-semibold' : ''}`}>
              <span className="text-gray-800">
                <span className="inline-block w-7 text-gray-500">#{r.rank}</span>
                {r.nickname}
                {r.is_me && ' (you)'}
              </span>
              <span style={{ color: accent }} className="font-bold">{r.best_score}</span>
            </li>
          ))}
        </ol>
      )}
      {me ? (
        <div className="mt-3 text-sm text-gray-700">
          You are <b>#{me.rank}</b> of {me.players} as <b>{me.nickname}</b> (best {me.best_score}).{' '}
          {!editing && (
            <button type="button" className="underline" style={{ color: accent }} onClick={() => { setNick(me.nickname); setEditing(true) }}>
              Change nickname
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-500">Finish a run to join the board. You get a nickname like “Doodle #1234” and can change it.</p>
      )}
      {editing && (
        <form onSubmit={saveNick} className="mt-2 flex gap-2">
          <label htmlFor="hh-nick" className="sr-only">Nickname</label>
          <input id="hh-nick" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={16} minLength={3}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
          <button type="submit" className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: accent }}>Save</button>
          <button type="button" className="px-2 text-sm text-gray-500" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
      {msg && <p className="text-xs text-red-600 mt-1" role="alert">{msg}</p>}
      <p className="text-xs text-gray-400 mt-2">Only nicknames and scores are shown. Never your name or email.</p>
    </div>
  )
}
