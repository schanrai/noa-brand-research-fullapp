'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  const supabase = createClient()

  useEffect(() => {
    // Try to get cached user first for instant display
    const cachedUser = typeof window !== 'undefined' 
      ? localStorage.getItem('user-cache') 
      : null
    
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser)
        setUser(parsedUser)
        setLoading(false) // Show content immediately
      } catch (e) {
        // Invalid cache, continue to fetch
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-cache')
        }
      }
    }

    // Get fresh session in background
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        // Cache user for next visit
        if (currentUser && typeof window !== 'undefined') {
          localStorage.setItem('user-cache', JSON.stringify(currentUser))
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('user-cache')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      
      // Update cache
      if (newUser && typeof window !== 'undefined') {
        localStorage.setItem('user-cache', JSON.stringify(newUser))
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('user-cache')
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
    const { error } = await supabase.auth.signOut()
    
    // Clear cache on sign out
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-cache')
    }
    
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

