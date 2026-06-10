import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to clean HTML while preserving safe tags
 * 
 * @param html - The HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  html: string,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowScripts?: boolean;
  }
): string {
  const config: any = {
    // Allow common HTML tags
    ALLOWED_TAGS: options?.allowedTags || [
      'div', 'span', 'p', 'br', 'strong', 'em', 'u', 's', 'i', 'b',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'code', 'pre',
      'hr',
      'button', 'input', 'label', 'form',
      'svg', 'path', // For icons
    ],
    
    // Allow common attributes
    ALLOWED_ATTR: options?.allowedAttributes || {
      '*': ['class', 'id', 'style', 'data-*'],
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      'button': ['type', 'disabled'],
      'input': ['type', 'value', 'placeholder', 'disabled', 'readonly'],
      'svg': ['viewBox', 'fill', 'stroke', 'width', 'height'],
      'path': ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
    },
    
    // Keep safe HTML5 data attributes
    ALLOW_DATA_ATTR: true,
    
    // Keep SVG namespace
    ADD_TAGS: ['svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon', 'polyline'],
    
    // Forbid scripts unless explicitly allowed
    FORBID_TAGS: options?.allowScripts ? [] : ['script', 'style', 'iframe', 'object', 'embed'],
    
    // Keep HTML structure
    KEEP_CONTENT: true,
    
    // Return safe HTML
    RETURN_TRUSTED_TYPE: false,
  };

  try {
    return DOMPurify.sanitize(html, config) as unknown as string;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Return empty string if sanitization fails to be safe
    return '';
  }
}

/**
 * Sanitize user-generated content with stricter rules
 * Removes most HTML tags, only keeping basic formatting
 */
export function sanitizeUserContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'code'],
    allowedAttributes: {
      'a': ['href', 'rel'],
    },
    allowScripts: false,
  });
}

/**
 * Sanitize HTML for display in MDX/Markdown content
 * More permissive for trusted content but still safe
 */
export function sanitizeMdxContent(html: string): string {
  return sanitizeHtml(html, {
    allowScripts: false, // Never allow scripts
  });
}

