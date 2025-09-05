import React, { useState, ReactNode } from 'react'

interface TabsProps {
  children: ReactNode
  defaultValue?: string
  className?: string
  groupId?: string
  queryString?: string | boolean
}

interface TabItemProps {
  children: ReactNode
  value: string
  label: string
  default?: boolean
  attributes?: Record<string, any>
}

export function Tabs({ 
  children, 
  defaultValue, 
  className = '', 
  groupId,
  queryString 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Priority: URL query -> localStorage -> defaultValue -> first tab
    if (typeof window !== 'undefined') {
      const queryParam = typeof queryString === 'string' ? queryString : groupId
      if (queryParam) {
        const urlParams = new URLSearchParams(window.location.search)
        const urlValue = urlParams.get(queryParam)
        if (urlValue) return urlValue
      }
      
      if (groupId) {
        const savedValue = localStorage.getItem(`docusaurus.tab.${groupId}`)
        if (savedValue) return savedValue
      }
    }
    
    return defaultValue || ''
  })

  const tabItems = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabItemProps> =>
      React.isValidElement(child) && child.type === TabItem
  )

  // Set default to first tab if no activeTab is set
  const finalActiveTab = activeTab || tabItems[0]?.props.value || ''

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Save to localStorage for groupId
    if (groupId && typeof window !== 'undefined') {
      localStorage.setItem(`docusaurus.tab.${groupId}`, value)
      
      // Sync with other tab groups with same groupId
      window.dispatchEvent(new CustomEvent('docusaurus-tab-change', {
        detail: { groupId, value }
      }))
    }
    
    // Update URL query string
    if (queryString && typeof window !== 'undefined') {
      const queryParam = typeof queryString === 'string' ? queryString : groupId
      if (queryParam) {
        const url = new URL(window.location.href)
        url.searchParams.set(queryParam, value)
        window.history.replaceState({}, '', url.toString())
      }
    }
  }

  // Listen for tab sync events
  React.useEffect(() => {
    if (!groupId) return
    
    const handleTabSync = (event: Event) => {
      const customEvent = event as CustomEvent<{ groupId: string; value: string }>
      if (customEvent.detail.groupId === groupId) {
        // Check if this value exists in current tab group
        const hasValue = tabItems.some(item => item.props.value === customEvent.detail.value)
        if (hasValue) {
          setActiveTab(customEvent.detail.value)
        }
      }
    }
    
    window.addEventListener('docusaurus-tab-change', handleTabSync)
    return () => window.removeEventListener('docusaurus-tab-change', handleTabSync)
  }, [groupId, tabItems])

  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-0" aria-label="Tabs">
          {tabItems.map((item) => {
            const isActive = item.props.value === finalActiveTab
            const attributes = item.props.attributes || {}
            
            return (
              <button
                key={item.props.value}
                onClick={() => handleTabChange(item.props.value)}
                className={`
                  px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                  ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                  ${attributes.className || ''}
                `}
                aria-selected={isActive}
                data-value={item.props.value}
                role="tab"
                {...attributes}
              >
                {item.props.label}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="tabs-content mt-4">
        {tabItems.map((item) => (
          <div
            key={item.props.value}
            className={`tab-panel ${item.props.value === finalActiveTab ? 'block' : 'hidden'}`}
            role="tabpanel"
          >
            {item.props.children}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TabItem({ children, value, label, default: defaultProp, attributes }: TabItemProps) {
  // This component is only used as a child of Tabs, the actual rendering is handled by Tabs
  return <>{children}</>
}
