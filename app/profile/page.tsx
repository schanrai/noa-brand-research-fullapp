'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar } from 'lucide-react'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('[Profile] Component mounted')
    console.log('[Profile] Loading state:', loading)
    console.log('[Profile] User:', user ? { id: user.id, email: user.email } : null)
  }, [])

  useEffect(() => {
    console.log('[Profile] State changed - loading:', loading, 'user:', user ? 'exists' : 'null')
  }, [loading, user])

  // Skeleton UI while loading (middleware already protects this route)
  if (loading || !user) {
    console.log('[Profile] Rendering skeleton - loading:', loading, 'user:', user ? 'exists' : 'null')
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-12 px-4 animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-9 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-64 bg-gray-200 rounded" />
          </div>

          {/* Profile Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Skeleton */}
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gray-200 w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
              </div>
              {/* User ID Skeleton */}
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gray-200 w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
              </div>
              {/* Date Skeleton */}
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gray-200 w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
              </div>
              {/* Auth Method Skeleton */}
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gray-200 w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Card Skeleton */}
          <Card className="mt-6">
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  console.log('[Profile] Rendering main content')
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight normal-case">
            Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account information
          </p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal details and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-2">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {user.id}
                </p>
              </div>
            </div>

            {/* Account Created */}
            {user.created_at && (
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Authentication Method */}
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-2">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Authentication Method</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Email/Password'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings Placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>
              More profile customization options coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Profile customization features such as avatar upload, display name, 
              and notification preferences will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

