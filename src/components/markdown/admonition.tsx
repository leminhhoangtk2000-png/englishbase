import React, { ReactNode } from 'react'

interface AdmonitionProps {
  type?: 'note' | 'tip' | 'important' | 'warning' | 'caution' | 'danger'
  title?: string
  icon?: string | ReactNode
  children: ReactNode
}

export function Admonition({ 
  type = 'note', 
  title, 
  icon, 
  children 
}: AdmonitionProps) {
  const defaultTitles = {
    note: 'Ghi chú',
    tip: 'Mẹo',
    important: 'Quan trọng',
    warning: 'Cảnh báo',
    caution: 'Thận trọng',
    danger: 'Nguy hiểm'
  }

  const defaultIcons = {
    note: 'ℹ️',
    tip: '💡',
    important: '❗',
    warning: '⚠️',
    caution: '⚠️', 
    danger: '🚨'
  }

  const displayTitle = title || defaultTitles[type]
  const displayIcon = icon || defaultIcons[type]

  return (
    <div className={`admonition admonition-${type}`}>
      <div className="admonition-title">
        <span className="admonition-icon">{displayIcon}</span>
        {displayTitle}
      </div>
      <div className="admonition-content">
        {children}
      </div>
    </div>
  )
}
