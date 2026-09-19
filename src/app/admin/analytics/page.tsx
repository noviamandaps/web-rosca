'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { exportDashboard, exportPerformance, getAnalytics } from '@/services/admin/admin-dashboard';

// ponytail: halaman analytics generik — section statis terdaftar, response dirender apa adanya
const sections = [
  { path: 'customer-insights', label: 'Customer Insights' },
  { path: 'conversion', label: 'Conversion' },
  { path: 'slow-products', label: 'Slow Products' },
  { path: 'order-operations', label: 'Order Operations' },
  { path: 'abandoned-carts', label: 'Abandoned Carts' },
  { path: 'analytics/demographics', label: 'Demographics' },
  { path: 'analytics/payments', label: 'Payments' },
  { path: 'analytics/geographic', label: 'Geographic' },
  { path: 'analytics/coupons', label: 'Coupons Usage' },
  { path: 'analytics/categories', label: 'Categories' },
  { path: 'analytics/cart-recovery', label: 'Cart Recovery' },
] as const;

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '-';
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 80);
  return String(v);
}

export default function AdminAnalyticsPage() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const params: Record<string, string> = {};
  if (start) params.startDate = start;
  if (end) params.endDate = end;

  async function download(path: string) {
    try {
      await exportDashboard(path.split('/').pop() ?? path, params);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-4">Analytics</h1>
      <div className="flex flex-wrap items-end gap-3 mb-8">
        <Input label="Start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <Input label="End" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        <Button size="sm" variant="secondary" type="button" onClick={() => exportPerformance({ ...params }).catch((e) => alert(e instanceof Error ? e.message : 'Export failed'))}>
          Export Performance
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {sections.map((s) => (
          <section key={s.path} className="border border-brand-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider">{s.label}</h2>
              <button type="button" onClick={() => download(s.path)} className="text-2xs uppercase tracking-wider text-brand-gray hover:text-brand-black">
                Export
              </button>
            </div>
            <AnalyticsSection path={s.path} params={params} />
          </section>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSection({ path, params }: { path: string; params: Record<string, string> }) {
  const q = useAnalyticsQuery(path, params);
  if (q.isLoading) return <p className="text-xs text-brand-gray">Loading…</p>;
  if (q.error) return <p className="text-2xs text-ui-error">{q.error instanceof Error ? q.error.message : 'Failed'}</p>;
  const data = q.data ?? {};
  return (
    <div className="flex flex-col gap-2 text-sm">
      {Object.entries(data)
        .slice(0, 6)
        .map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-brand-border pb-1">
            <span className="text-brand-gray capitalize">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            <span className="font-medium text-right">{fmt(v)}</span>
          </div>
        ))}
    </div>
  );
}

function useAnalyticsQuery(path: string, params: Record<string, string>) {
  return useQuery({
    queryKey: ['analytics', path, params],
    queryFn: () => getAnalytics(path, params),
  });
}
