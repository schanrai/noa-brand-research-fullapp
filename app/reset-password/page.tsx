'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle } from 'lucide-react'
import LoginNavigation from '@/components/login-navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Early validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <LoginNavigation />
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <CardTitle>Password Updated!</CardTitle>
              </div>
              <CardDescription>
                Your password has been changed successfully. Redirecting to sign in...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LoginNavigation />

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight normal-case">
              Set New Password
            </h1>
            <p className="mt-2 text-muted-foreground">
              Choose a strong password for your account
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Password</CardTitle>
              <CardDescription>
                Must be at least 6 characters long
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label htmlFor="password" className="text-sm font-medium">
                    New Password
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
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div 
                    role="alert"
                    aria-live="polite"
                    className="rounded-md bg-red-50 border border-red-300 px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 font-semibold text-sm leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-black/90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

