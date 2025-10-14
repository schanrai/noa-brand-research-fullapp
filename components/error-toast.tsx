"use client"

import { AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'

interface ErrorToastProps {
  message: string
  onDismiss: () => void
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-300 rounded-lg shadow-lg px-6 py-4 flex items-center gap-4">
      <AlertCircle className="text-red-600 w-6 h-6" />
      <span className="text-red-800 font-semibold text-base">{message}</span>
      <Button variant="ghost" size="sm" onClick={onDismiss} className="ml-4 text-red-700 hover:text-red-900">
        ×
      </Button>
    </div>
  )
}
