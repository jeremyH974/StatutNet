'use client';

import { useId } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  helpText?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
  helpText,
}: NumberInputProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     transition-all text-right pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-xs text-muted mt-1">{helpText}</p>}
    </div>
  );
}
