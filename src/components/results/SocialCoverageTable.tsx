'use client';

import { COVERAGE_COMPARISON } from '@/engine/social-coverage';

const levelColors: Record<string, string> = {
  'Couverture de base': 'text-accent-dark',
  'Limitées': 'text-accent-dark',
  'Limitée': 'text-accent-dark',
  'Très limitée': 'text-danger',
  'Non éligible': 'text-muted',
  'Non': 'text-muted',
  'Complètes': 'text-success',
  'Complète': 'text-success',
  'Régime général': 'text-success',
};

function getCellColor(value: string): string {
  for (const [key, color] of Object.entries(levelColors)) {
    if (value.startsWith(key)) return color;
  }
  return 'text-foreground';
}

export function SocialCoverageTable() {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 text-muted font-medium">Protection</th>
            <th className="text-left py-2 px-2 text-muted font-medium">Micro</th>
            <th className="text-left py-2 px-2 text-muted font-medium">EURL</th>
            <th className="text-left py-2 px-2 text-muted font-medium">SASU</th>
          </tr>
        </thead>
        <tbody>
          {COVERAGE_COMPARISON.map((row) => (
            <tr key={row.categorie} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">
                {row.categorie}
              </td>
              <td className={`py-2.5 px-2 ${getCellColor(row.micro)}`}>{row.micro}</td>
              <td className={`py-2.5 px-2 ${getCellColor(row.eurl)}`}>{row.eurl}</td>
              <td className={`py-2.5 px-2 ${getCellColor(row.sasu)}`}>{row.sasu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
