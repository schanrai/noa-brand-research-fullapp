'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthError } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Memoize the supabase client to prevent effect re-runs
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    console.log('[AuthProvider] Initializing auth')
    
    // Try to get cached user first for instant display
    const cachedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user-cache') 
      : null
    
    console.log('[AuthProvider] Cached user:', cachedUser ? 'exists' : 'none')
    
    let hasCachedUser = false
    
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser)
        console.log('[AuthProvider] Setting cached user:', parsedUser.email)
        setUser(parsedUser)
        setLoading(false) // Show content immediately
        hasCachedUser = true
      } catch (e) {
        console.error('[AuthProvider] Error parsing cached user:', e)
        // Invalid cache, continue to fetch
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-cache')
        }
      }
    }

    // Get fresh session in background (non-blocking if we have cache)
    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Fetching fresh session...')
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        console.log('[AuthProvider] Session user:', currentUser ? currentUser.email : 'none')
        
        // Only update if user changed or we didn't have cache
        setUser(prevUser => {
          // If we have cached user and new user matches, don't trigger re-render
          if (hasCachedUser && prevUser?.id === currentUser?.id) {
            return prevUser
          }
          return currentUser
        })
        
        // Cache user for next visit
        if (currentUser && typeof window !== 'undefined') {
          localStorage.setItem('user-cache', JSON.stringify(currentUser))
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('user-cache')
        }
      } catch (error) {
        console.error('[AuthProvider] Auth initialization error:', error)
      } finally {
        // Only set loading to false if we didn't have cache
        if (!hasCachedUser) {
          console.log('[AuthProvider] Setting loading to false')
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthProvider] Auth state changed:', event, session?.user?.email || 'no user')
      const newUser = session?.user ?? null
      setUser(newUser)
      
      // Update cache
      if (newUser && typeof window !== 'undefined') {
        localStorage.setItem('user-cache', JSON.stringify(newUser))
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('user-cache')
        // Clear recently viewed companies when user logs out
        sessionStorage.removeItem('recently-viewed-companies')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    // Clear cache immediately
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-cache')
      // Clear recently viewed companies from sessionStorage
      sessionStorage.removeItem('recently-viewed-companies')
    }
    
    // Sign out (don't block UI)
    const { error } = await supabase.auth.signOut()
    
    return { error }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

