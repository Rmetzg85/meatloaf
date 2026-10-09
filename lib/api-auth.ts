import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

/** Supabase client acting as the signed-in user (RLS applies), from an `Authorization: Bearer <jwt>` header. */
export async function userFromRequest(req: Request): Promise<{ user: User; db: SupabaseClient } | null> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) return null
  return { user: data.user, db }
}
