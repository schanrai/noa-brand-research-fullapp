'use client'

import { useAuth } from '@/components/auth-provider'

/**
 * Test component to verify AuthProvider is working
 * This should be temporarily added to a page for testing
 */
export function AuthProviderTest() {
  const { user, loading } = useAuth()

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '80px', 
      right: '20px', 
      padding: '16px', 
      background: '#8b5cf6',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      minWidth: '250px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        🔐 Auth Provider Status
      </div>
      <div style={{ fontSize: '12px' }}>
        {loading ? (
          '⏳ Loading auth state...'
        ) : (
          <>
            <div>State: {user ? '✅ User available' : '⚪ No user (expected)'}</div>
            {user && <div style={{ marginTop: '4px', opacity: 0.8 }}>Email: {user.email}</div>}
          </>
        )}
      </div>
      <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.7 }}>
        Check console for auth logs
      </div>
    </div>
  )
}

