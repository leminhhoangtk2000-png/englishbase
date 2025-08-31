'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FacebookCommentsProps {
  url: string;
  numPosts?: number;
  width?: string;
}

export function FacebookComments({ url, numPosts = 5, width = "100%" }: FacebookCommentsProps) {
  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (typeof window !== 'undefined' && !window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890',
          xfbml: true,
          version: 'v18.0'
        });
      };
    } else if (window.FB && window.FB.XFBML) {
      // Re-parse XFBML if Facebook SDK is already loaded
      window.FB.XFBML.parse();
    }
  }, [url]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          💬 Bình luận
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="fb-comments" 
          data-href={url}
          data-width={width}
          data-numposts={numPosts}
          data-colorscheme="light"
        ></div>
        
        {/* Fallback for when Facebook comments don't load */}
        <noscript>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">
              Bật JavaScript để xem bình luận Facebook
            </p>
          </div>
        </noscript>
      </CardContent>
    </Card>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}
