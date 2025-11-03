'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings as SettingsIcon, Bell, Shield, CreditCard } from 'lucide-react'

export default function SettingsPage() {
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
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account preferences and app settings
          </p>
        </div>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your research and activity
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="research-updates">Research Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new brand research is available
                </p>
              </div>
              <Switch id="research-updates" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground mb-2">
                {user.app_metadata?.provider === 'google' 
                  ? 'You signed in with Google OAuth. Password management is handled by Google.'
                  : 'Update your password to keep your account secure.'}
              </p>
              {user.app_metadata?.provider !== 'google' && (
                <Button variant="outline" size="sm" disabled>
                  Change Password (Coming Soon)
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Enable (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing & Subscription */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Billing & Subscription</CardTitle>
            </div>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Current Plan</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Free Tier (Metered billing coming soon)
                </p>
              </div>
              <div>
                <Label>Usage</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Usage tracking and metered billing will be available in a future update.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Upgrade Plan (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm" disabled>
                Delete Account (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

