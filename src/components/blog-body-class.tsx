"use client";

import React from 'react';

// Client component to add body class for blog pages
export function BlogBodyClass() {
  React.useEffect(() => {
    document.body.classList.add('blog-body');
    return () => {
      document.body.classList.remove('blog-body');
    };
  }, []);
  return null;
}
