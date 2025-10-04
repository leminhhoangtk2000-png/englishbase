'use client';

import React from 'react';

interface YouTubeEmbedProps {
  src: string;
  title?: string;
}

export function YouTubeEmbed({ src, title = 'YouTube video' }: YouTubeEmbedProps) {
  return (
    <div className="flex justify-center my-8">
      <div className="w-full max-w-4xl">
        <div className="relative aspect-video overflow-hidden rounded-[20px] shadow-xl bg-black">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 0, borderRadius: '20px' }}
          />
        </div>
      </div>
    </div>
  );
}
