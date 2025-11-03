'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

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

