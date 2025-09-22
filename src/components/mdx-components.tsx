import React from 'react'
import { CodeBlock } from '@/components/markdown/code-block'
import { Tabs, TabItem } from '@/components/markdown/tabs'
import Admonition, { Note, Tip, Warning, InfoAdmonition, Caution, Danger } from '@/components/admonition'

export const MDXComponents = {
  // Enhanced code blocks
  pre: ({ children, ...props }: any) => {
    // Extract code element from pre
    const codeElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && child.type === 'code'
    )
    
    if (codeElement) {
      const { className, children: code, ...codeProps } = codeElement.props
      return (
        <CodeBlock 
          className={className}
          {...codeProps}
          {...props}
        >
          {code}
        </CodeBlock>
      )
    }
    
    return <pre {...props}>{children}</pre>
  },
  
  code: ({ className, children, ...props }: any) => {
    const isInlineCode = !className
    
    if (isInlineCode) {
      return <code className="inline-code" {...props}>{children}</code>
    }
    
    // This will be handled by the pre component above
    return <code className={className} {...props}>{children}</code>
  },
  
  // Tabs components
  Tabs,
  TabItem,
  
  // Admonitions - Full Docusaurus-style components
  Admonition,
  Note,
  Tip,
  Warning,
  Info: InfoAdmonition,
  Caution,
  Danger,
  
  // Enhanced headings with anchor links
  h1: ({ children, id, ...props }: any) => (
    <h1 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h1>
  ),
  
  h2: ({ children, id, ...props }: any) => (
    <h2 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h2>
  ),
  
  h3: ({ children, id, ...props }: any) => (
    <h3 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h3>
  ),
  
  h4: ({ children, id, ...props }: any) => (
    <h4 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h4>
  ),
  
  h5: ({ children, id, ...props }: any) => (
    <h5 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h5>
  ),
  
  h6: ({ children, id, ...props }: any) => (
    <h6 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link" aria-label="Link to this section">
        {children}
      </a>
    </h6>
  ),
  
  // Enhanced tables
  table: ({ children, ...props }: any) => (
    <div className="table-container overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
        {children}
      </table>
    </div>
  ),
  
  // Math display
  math: ({ children, ...props }: any) => (
    <div className="math-display" {...props}>
      {children}
    </div>
  ),
  
  inlineMath: ({ children, ...props }: any) => (
    <span className="math-inline" {...props}>
      {children}
    </span>
  ),
}

export default MDXComponents
