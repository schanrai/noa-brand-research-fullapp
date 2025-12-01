import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

// Update the Inter font configuration to include all the weights we need
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Scova - The Prospect-Brief Engine for Teams Who Pitch for a Living",
  description: "Turn content overload into a cited, comparable prospect brief—so your team can qualify accounts, prioritize outreach, and align fast.",
  openGraph: {
    title: "Scova - The Prospect-Brief Engine for Teams Who Pitch for a Living",
    description: "Turn content overload into a cited, comparable prospect brief—so your team can qualify accounts, prioritize outreach, and align fast.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.scova.io", // Update with your actual domain
    siteName: "Scova",
    images: [
      {
        url: "/public/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scova - The Prospect-Brief Engine for Teams Who Pitch for a Living",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {  
    card: "summary_large_image",
    title: "Scova - The Prospect-Brief Engine for Teams Who Pitch for a Living",
    description: "Turn content overload into a cited, comparable prospect brief—so your team can qualify accounts, prioritize outreach, and align fast.",
    images: ["/public/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
