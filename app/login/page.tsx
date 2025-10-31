'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { GoogleSignInButton } from '@/components/auth/google-signin-button'
import { EmailSignInForm } from '@/components/auth/email-signin-form'
import { useAuth } from '@/components/auth-provider'
import LoginNavigation from '@/components/login-navigation'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Don't render login form if user is already logged in (will redirect)
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LoginNavigation />

      {/* Login Content */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight normal-case">
              Get started with Scova
            </h1>
            <p className="mt-2 text-muted-foreground">
              Brand research and discovery platform
            </p>
          </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google OAuth */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <EmailSignInForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  </div>
  )
}

