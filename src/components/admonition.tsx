"use client"

import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Info as InfoIcon, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle, 
  Zap 
} from 'lucide-react'

interface AdmonitionProps {
  type: 'note' | 'tip' | 'warning' | 'info' | 'caution' | 'danger'
  title?: string
  children: React.ReactNode
}

const admonitionConfig = {
  note: {
    icon: InfoIcon,
    emoji: '💡',
    className: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-800 dark:text-blue-300'
  },
  tip: {
    icon: CheckCircle,
    emoji: '✅',
    className: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
    iconClass: 'text-green-600 dark:text-green-400',
    titleClass: 'text-green-800 dark:text-green-300'
  },
  warning: {
    icon: AlertTriangle,
    emoji: '⚠️',
    className: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800',
    iconClass: 'text-yellow-600 dark:text-yellow-400',
    titleClass: 'text-yellow-800 dark:text-yellow-300'
  },
  info: {
    icon: InfoIcon,
    emoji: 'ℹ️',
    className: 'border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-800',
    iconClass: 'text-cyan-600 dark:text-cyan-400',
    titleClass: 'text-cyan-800 dark:text-cyan-300'
  },
  caution: {
    icon: AlertCircle,
    emoji: '🚨',
    className: 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800',
    iconClass: 'text-orange-600 dark:text-orange-400',
    titleClass: 'text-orange-800 dark:text-orange-300'
  },
  danger: {
    icon: Zap,
    emoji: '⚡',
    className: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-800 dark:text-red-300'
  }
}

const Admonition: React.FC<AdmonitionProps> = ({ type, title, children }) => {
  const config = admonitionConfig[type]
  const Icon = config.icon

  const defaultTitles = {
    note: 'Ghi chú',
    tip: 'Mẹo hay',
    warning: 'Cảnh báo',
    info: 'Thông tin',
    caution: 'Lưu ý',
    danger: 'Nguy hiểm'
  }

  const displayTitle = title || defaultTitles[type]

  return (
    <div className={`my-6 border-l-4 rounded-lg p-4 ${config.className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${config.iconClass}`} />
        <h4 className={`font-semibold text-lg ${config.titleClass} m-0`}>
          {displayTitle}
        </h4>
      </div>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="admonition-content space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Admonition

// Export individual components for easier usage
export const Note: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="note" {...props} />

export const Tip: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="tip" {...props} />

export const Warning: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="warning" {...props} />

export const InfoAdmonition: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="info" {...props} />

export const Caution: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="caution" {...props} />

export const Danger: React.FC<Omit<AdmonitionProps, 'type'>> = (props) => 
  <Admonition type="danger" {...props} />
