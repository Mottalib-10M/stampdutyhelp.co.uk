/** Shared result card for the tools of the taxes after the purchase (CGT, IHT, dividends, rental). */
import type { ReactNode } from 'react';
export function ResultCard({ label, value, sub, rows, note }: { label: string; value: string; sub?: ReactNode; rows: Array<[string, string]>; note?: ReactNode }) {
  return (
    <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
      <dl className="mt-3 grid gap-1 text-sm">
        {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-navy-100 py-1"><dt className="text-navy-700">{k}</dt><dd className="tabular-nums text-right font-semibold text-navy-900">{v}</dd></div>)}
      </dl>
      {note && <p className="mt-3 text-xs text-navy-600">{note}</p>}
    </div>
  );
}
export const Shell = ({ children }: { children: ReactNode }) => <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>{children}</div>;
export const Form = ({ children }: { children: ReactNode }) => <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{children}</form>;
