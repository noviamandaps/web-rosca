'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@/components/ui';
import { exportDashboard, exportPerformance, getAnalytics, getVariantDetail, type AnalyticsPath, type CompareWith, type PeriodPreset } from '@/services/admin/admin-dashboard';

// ponytail: response analytics dirender generik (Record) — ketat jika perlu per-section khusus
const sections: { path: AnalyticsPath | string; label: string }[] = [
  { path: 'customer-insights', label: 'Customer Insights' },
  { path: 'conversion', label: 'Conversion' },
  { path: 'slow-products', label: 'Slow Products' },
  { path: 'order-operations', label: 'Order Operations' },
  { path: 'abandoned-carts', label: 'Abandoned Carts' },
  { path: 'analytics/coupons', label: 'Coupons' },
  { path: 'analytics/categories', label: 'Categories' },
  { path: 'analytics/cart-recovery', label: 'Cart Recovery' },
  { path: 'analytics/payments', label: 'Payments' },
  { path: 'analytics/geographic', label: 'Geographic' },
  { path: 'analytics/demographics', label: 'Demographics' },
  { path: 'products/performance', label: 'Product Performance' },
  { path: 'variants/performance', label: 'Variant Performance' },
];

const presets: (PeriodPreset | '')[] = [
  '', 'today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month',
  'this_year', 'last_year', 'last_7_days', 'last_30_days', 'last_90_days',
];
const compares: (CompareWith | '')[] = ['', 'last_month', 'last_year', 'previous_period'];

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '-';
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 80);
  return String(v);
}

export default function AdminAnalyticsPage() {
  const [preset, setPreset] = useState<PeriodPreset | ''>('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [compareWith, setCompareWith] = useState<CompareWith | ''>('');
  const [variantId, setVariantId] = useState('');

  // period meng-override startDate/endDate (readme §Konvensi)
  const params: Record<string, string> = {};
  if (preset) params.period = preset;
  else {
    if (start) params.startDate = start;
    if (end) params.endDate = end;
  }
  if (compareWith) params.compareWith = compareWith;

  async function download(path: string) {
    try {
      const key = path.split('/').pop() ?? path;
      if (key === 'sales' || key === 'users' || key === 'inventory' || key === 'customers' || key === 'dashboard') {
        await exportDashboard(key, params);
      } else {
        await exportPerformance({ ...params, level: path === 'products/performance' ? 'product' : undefined });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-4">Analytics</h1>
      <div className="flex flex-wrap items-end gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Period</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as PeriodPreset | '')}
            className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
          >
            {presets.map((p) => (
              <option key={p} value={p}>
                {p || 'Custom range'}
              </option>
            ))}
          </select>
        </div>
        {preset === '' && (
          <>
            <Input label="Start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input label="End" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Compare With</label>
          <select
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value as CompareWith | '')}
            className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
          >
            {compares.map((c) => (
              <option key={c} value={c}>
                {c || '—'}
              </option>
            ))}
          </select>
        </div>
        <Input label="Variant ID" value={variantId} onChange={(e) => setVariantId(e.target.value)} placeholder="drill-down…" />
        <Button
          size="sm"
          variant="secondary"
          type="button"
          onClick={() =>
            exportPerformance({ ...params, format: 'xlsx' }).catch((e) => alert(e instanceof Error ? e.message : 'Export failed'))
          }
        >
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
        {variantId && (
          <section className="border border-brand-border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Variant Detail — {variantId}</h2>
            <VariantDetail variantId={variantId} params={params} />
          </section>
        )}
      </div>
    </div>
  );
}

function useAnalyticsQuery(path: string, params: Record<string, string>) {
  return useQuery({
    queryKey: ['analytics', path, params],
    queryFn: () =>
      getAnalytics(path as AnalyticsPath, {
        startDate: params.startDate,
        endDate: params.endDate,
        period: params.period,
        compareWith: (params.compareWith as CompareWith) || undefined,
      }),
  });
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

function VariantDetail({ variantId, params }: { variantId: string; params: Record<string, string> }) {
  const q = useQuery({
    queryKey: ['analytics', 'variant-detail', variantId, params],
    queryFn: () => getVariantDetail(variantId, { startDate: params.startDate, endDate: params.endDate }),
    enabled: !!variantId,
  });
  if (q.isLoading) return <p className="text-xs text-brand-gray">Loading…</p>;
  if (q.error) return <p className="text-2xs text-ui-error">{q.error instanceof Error ? q.error.message : 'Failed'}</p>;
  const data = q.data ?? {};
  return (
    <div className="flex flex-col gap-2 text-sm">
      {Object.entries(data)
        .slice(0, 8)
        .map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-brand-border pb-1">
            <span className="text-brand-gray capitalize">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            <span className="font-medium text-right">{fmt(v)}</span>
          </div>
        ))}
    </div>
  );
}
