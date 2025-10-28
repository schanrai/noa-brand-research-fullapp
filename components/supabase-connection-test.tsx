'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Test component to verify Supabase client connection
 * This should be temporarily added to a page for testing
 */
export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        
        // Test if client initializes
        console.log('✅ Supabase client created successfully')
        console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Anon key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
        
        // Try to get session (will be null if not logged in, but shouldn't error)
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        console.log('✅ Supabase auth session check successful')
        console.log('Current session:', data.session ? 'Logged in' : 'Not logged in')
        
        setStatus('connected')
      } catch (err) {
        console.error('❌ Supabase connection error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      padding: '16px', 
      background: status === 'connected' ? '#10b981' : status === 'error' ? '#ef4444' : '#f59e0b',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999
    }}>
      {status === 'checking' && '🔄 Testing Supabase connection...'}
      {status === 'connected' && '✅ Supabase connected! Check console for details.'}
      {status === 'error' && `❌ Connection error: ${error}`}
    </div>
  )
}

