'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-provider'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function EmailSignInForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { signInWithEmail, signUpWithEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (mode === 'signin') {
      const { error: signInError } = await signInWithEmail(email, password)
      if (signInError) {
        setError(signInError.message)
        setLoading(false)
      }
      // If successful, user will be redirected automatically
    } else {
      const { error: signUpError } = await signUpWithEmail(email, password)
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
      } else {
        setSuccess('Check your email to confirm your account!')
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Email field */}
        <div className="space-y-3">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* 16px spacing between Email and Password */}
        <div className="h-4" />

        {/* Password field */}
        <div className="space-y-3">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
        </div>

        {/* 8px spacing after password input */}
        <div className="h-2" />

        {/* Forgot password link - right aligned */}
        {mode === 'signin' && (
          <div className="text-right">
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              style={{ fontSize: '14px' }}
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* Error/Success messages */}
        {error && (
          <div 
            role="alert"
            aria-live="polite"
            className="mt-3 rounded-md bg-red-50 border border-red-300 px-4 py-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 font-semibold text-sm leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div 
            role="status"
            aria-live="polite"
            className="mt-3 rounded-md bg-green-50 border border-green-300 px-4 py-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 font-semibold text-sm leading-relaxed">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* 20px spacing before Primary button */}
        <div className="h-5" />

        {/* Primary Sign in button */}
        <Button
          type="submit"
          disabled={loading}
          variant="default"
          size="lg"
          className="w-full bg-black text-white hover:bg-black/90"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            mode === 'signin' ? 'Sign in' : 'Sign up'
          )}
        </Button>
      </form>

      {/* 16px spacing before account toggle */}
      <div className="h-4" />

      {/* Account toggle link */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setSuccess(null)
          }}
          className="text-sm text-muted-foreground transition-colors"
        >
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <span className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
                Sign in
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

