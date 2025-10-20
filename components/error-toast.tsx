"use client"

import { AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'

interface ErrorToastProps {
  message: string
  onDismiss: () => void
  showRetry?: boolean
  onRetry?: () => void
}

export default function ErrorToast({ message, onDismiss, showRetry = false, onRetry }: ErrorToastProps) {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-300 rounded-lg shadow-lg px-6 py-4 max-w-md">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-red-600 w-6 h-6 mt-0.5" />
        <div className="flex-1">
          <div className="text-red-800 font-semibold text-base mb-3">
            {message}
          </div>
          
          <div className="flex gap-2">
            {showRetry && onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Try Again
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="text-red-700 hover:text-red-900"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
