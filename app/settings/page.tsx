'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch' // Commented out - will be used when Notifications section is enabled
import { Settings as SettingsIcon, Shield, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Skeleton UI while loading (middleware already protects this route)
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-12 px-4 animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-9 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-80 bg-gray-200 rounded" />
          </div>

          {/* Settings Cards Skeleton - 3 sections (Notifications hidden) */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className={i > 1 ? 'mt-6' : ''}>
              <CardHeader>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-64 bg-gray-200 rounded" />
                  </div>
                  <div className="h-6 w-11 bg-gray-200 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-36 bg-gray-200 rounded" />
                    <div className="h-3 w-56 bg-gray-200 rounded" />
                  </div>
                  <div className="h-6 w-11 bg-gray-200 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
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

        {/* Notifications - Hidden until functionality is ready for release
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
        */}

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

