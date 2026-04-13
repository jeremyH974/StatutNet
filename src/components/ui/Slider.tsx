'use client';

import { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  leftLabel,
  rightLabel,
}: SliderProps) {
  const id = useId();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-sm font-semibold text-primary">{value}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer
                   accent-primary"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
