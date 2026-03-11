import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const rand = Math.random().toString(36).slice(2,10)
const email = `test+${rand}@example.com`
const password = 'Test1234!'
const full_name = 'Automated Test'
const user_type = 'future homeowner'

console.log('Attempting signup with', email)

;(async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, user_type },
      },
    })

    if (error) {
      console.error('signUp error:', error)
      process.exit(1)
    }

    console.log('signUp response:', JSON.stringify(data, null, 2))

    const userId = data?.user?.id
    if (userId) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: userId, full_name, user_type, email })

      if (upsertError) {
        console.error('profiles upsert error:', upsertError)
        process.exit(1)
      }
      console.log('Profile upserted for user id', userId)
    } else {
      console.log('No user id returned (email confirmation likely required).')
    }

    console.log('DONE')
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
})()
