"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, User, LogOut, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isReportOnlyMode } from "@/lib/feature-flags"
import { useAuth } from "@/components/auth-provider"

interface TopNavigationProps {
  onTabChange?: (stage: string, value: string) => void
}

export default function TopNavigation({ onTabChange }: TopNavigationProps) {
  const [activeTab, setActiveTab] = useState("brand-research")
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "brand-research") {
      // Reset to initial co-pilot interface when brand research tab is clicked
      onTabChange?.("reset-to-initial", "")
    } else {
      onTabChange?.(value, "")
    }
  }

  const handleLogoClick = () => {
    // Reload the app by refreshing the page
    window.location.reload()
  }

  const handleSignOut = async () => {
    // Optimistically clear local state and navigate immediately
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-cache')
    }
    
    // Navigate immediately for instant feedback
    router.push('/login')
    
    // Sign out in background (don't wait)
    signOut().catch(error => {
      console.error('Sign out error:', error)
      // Error is non-critical since we've already navigated away
    })
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-24 py-4">
      <div className="flex-shrink-0">
        <div
          onClick={handleLogoClick}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="/Scova_Logo_Crop.png"
            alt="Scova"
            className="h-32 w-auto"
          />
        </div>
      </div>

      {!isReportOnlyMode() && (
        <div className="flex-grow flex justify-center">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="bg-edge h-12">
              <TabsTrigger
                value="brand-research"
                className="text-heading text-sm px-6 py-3 h-10 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Brand Research
              </TabsTrigger>
              <TabsTrigger
                value="discovery-agent"
                className="text-heading text-sm px-6 py-3 h-10 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Discovery Agent
              </TabsTrigger>
              <TabsTrigger
                value="local-signals"
                className="text-heading text-sm px-6 py-3 h-10 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Local Signals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex items-center gap-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover-scale h-10 w-10"
          onClick={() => window.location.href = 'mailto:help@scova.io?subject=Support Request'}
          title="Contact Support"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Contact Support</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover-scale h-10 w-10">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200 w-56">
            <DropdownMenuLabel className="text-heading text-xs">
              My Account
              {user?.email && (
                <div className="text-xs font-normal text-muted-foreground mt-1 truncate">
                  {user.email}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-body cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-body cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="default"
          className="hover-scale flex items-center gap-2 px-4 py-2 h-10 border-gray-200"
          onClick={() => router.push('/settings')}
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">Settings</span>
        </Button>
      </div>
    </header>
  )
}
