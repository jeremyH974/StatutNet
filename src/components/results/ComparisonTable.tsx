'use client';

import type { StatusResult, StatusType } from '@/engine/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { StatusCard } from './StatusCard';

interface ComparisonTableProps {
  statuses: StatusResult[];
  bestStatus: StatusType;
}

export function ComparisonTable({ statuses, bestStatus }: ComparisonTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statuses.map((s) => (
        <StatusCard key={s.status} result={s} isBest={s.status === bestStatus} />
      ))}
    </div>
  );
}
