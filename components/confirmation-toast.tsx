"use client"

import { CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'

interface SuccessBannerProps {
  message: string
  onDismiss: () => void
}

export default function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-300 rounded-lg shadow-lg px-6 py-4 flex items-center gap-4">
      <CheckCircle className="text-green-600 w-6 h-6" />
      <span className="text-green-800 font-semibold text-base">{message}</span>
      <Button variant="ghost" size="sm" onClick={onDismiss} className="ml-4 text-green-700 hover:text-green-900">
        ×
      </Button>
    </div>
  )
}
