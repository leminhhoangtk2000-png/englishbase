'use client';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CodeBlock({ value, className }: { value: string; className?: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <pre
        className={cn(
          'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-secondary/50 p-4 font-code pr-12',
          className
        )}
      >
        <code>{value}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-4 h-8 w-8"
        onClick={onCopy}
      >
        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  );
}
