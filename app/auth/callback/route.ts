import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') // Check for redirect destination
  const type = requestUrl.searchParams.get('type') // Check for auth type (recovery, etc.)
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login with error
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    // Check if this is a password reset flow
    if (type === 'recovery' || next === '/reset-password') {
      return NextResponse.redirect(`${origin}/reset-password`)
    }
  }

  // Default: redirect to homepage after sign in
  return NextResponse.redirect(`${origin}/`)
}

