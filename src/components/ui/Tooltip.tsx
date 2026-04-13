'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <button
        type="button"
        className="ml-1 w-4 h-4 rounded-full bg-border text-muted text-xs flex items-center justify-center
                   hover:bg-primary hover:text-white transition-colors"
        tabIndex={0}
        aria-label={content}
      >
        ?
      </button>
      {show && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs
                     bg-foreground text-background rounded-lg shadow-lg max-w-xs whitespace-normal
                     z-50 pointer-events-none"
          role="tooltip"
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}
