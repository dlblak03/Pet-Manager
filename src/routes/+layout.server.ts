import type { LayoutServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession()
  return {
    session,
    cookies: cookies.getAll(),
    supabaseUrl: env.PRIVATE_SUPABASE_URL,
    supabaseKey: env.PRIVATE_SUPABASE_PUBLISHABLE_KEY
  }
}