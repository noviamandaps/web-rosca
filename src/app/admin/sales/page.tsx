'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input, Modal } from '@/components/ui';
import {
  useAutoSale,
  useRemoveVariantSale,
  useSaleVariantsOverview,
  useSalesStatistics,
  useSetVariantSale,
  type SaleInput,
  type SaleStatus,
} from '@/services/admin/admin-sales';
import type { SaleVariantOverviewRow } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');
const statuses: SaleStatus[] = ['all', 'active', 'expired', 'upcoming'];

export default function AdminSalesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isSale, setIsSale] = useState('');
  const [status, setStatus] = useState<SaleStatus | ''>('');
  const [editing, setEditing] = useState<SaleVariantOverviewRow | null>(null);
  const [form, setForm] = useState<SaleInput>({});
  const limit = 20;

  const { data, isLoading, error } = useSaleVariantsOverview({
    page,
    limit,
    search: search || undefined,
    status: status || undefined,
    isSale: isSale === '' ? undefined : isSale === 'yes',
  });
  const { data: stats } = useSalesStatistics();
  const setSale = useSetVariantSale();
  const removeSale = useRemoveVariantSale();
  const auto = useAutoSale();

  const openEdit = (v: SaleVariantOverviewRow) => {
    setEditing(v);
    setForm({
      salePrice: v.pricing?.salePrice ?? undefined,
      discountPercent: v.pricing?.discountPercent ?? undefined,
      saleStartDate: v.sale?.saleStartDate ?? undefined,
      saleEndDate: v.sale?.saleEndDate ?? undefined,
      salePurchaseLimit: v.sale?.salePurchaseLimit ?? undefined,
      salePurchaseLimitPerUser: v.sale?.salePurchaseLimitPerUser ?? undefined,
    });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      await setSale.mutateAsync({ variantId: editing.id, ...form });
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Sales</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" type="button" onClick={() => auto.mutate('auto-start')}>
            Auto Start
          </Button>
          <Button size="sm" variant="secondary" type="button" onClick={() => auto.mutate('auto-expire')}>
            Auto Expire
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="border border-brand-border p-4">
            <p className="text-2xs uppercase tracking-wider text-brand-gray">Total Sale Products</p>
            <p className="text-xl font-bold mt-1">{stats.totalSaleProducts ?? 0}</p>
          </div>
          <div className="border border-brand-border p-4">
            <p className="text-2xs uppercase tracking-wider text-brand-gray">Active</p>
            <p className="text-xl font-bold mt-1">{stats.activeSales ?? 0}</p>
          </div>
          <div className="border border-brand-border p-4">
            <p className="text-2xs uppercase tracking-wider text-brand-gray">Upcoming</p>
            <p className="text-xl font-bold mt-1">{stats.upcomingSales ?? 0}</p>
          </div>
          <div className="border border-brand-border p-4">
            <p className="text-2xs uppercase tracking-wider text-brand-gray">Expired</p>
            <p className="text-xl font-bold mt-1">{stats.expiredSales ?? 0}</p>
          </div>
        </div>
      )}

      {data?.summary && (
        <p className="text-xs text-brand-gray mb-4">
          Page: on sale {data.summary.onSaleCount ?? 0} · sold {nf.format(data.summary.totalSold ?? 0)} ·{' '}
          {fmtRpShort(data.summary.totalRevenue)} revenue · return rate{' '}
          {((data.summary.averageReturnRate ?? 0) * 100).toFixed(1)}%
          {data.comparison?.summary && (
            <>
              {' '}
              (prev: {nf.format(data.comparison.summary.totalSold ?? 0)} sold, {fmtRpShort(data.comparison.summary.totalRevenue)})
            </>
          )}
        </p>
      )}

      <AdminTable<SaleVariantOverviewRow>
        columns={[
          {
            header: 'Variant',
            render: (v) => {
              const label = [v.variant?.sku, v.variant?.colorName, v.variant?.sizeLabel].filter(Boolean).join(' · ');
              return (
                <div>
                  <p className="font-medium">{label || v.id}</p>
                  <p className="text-2xs text-brand-gray">{v.product?.name ?? '-'}</p>
                </div>
              );
            },
          },
          {
            header: 'Price',
            render: (v) => (
              <div>
                <span className={v.pricing?.salePrice ? 'line-through text-brand-gray' : ''}>
                  Rp {nf.format(v.pricing?.effectivePrice ?? 0)}
                </span>
                {v.pricing?.salePrice && (
                  <span className="block text-2xs">Sale: Rp {nf.format(v.pricing.salePrice)}</span>
                )}
              </div>
            ),
          },
          { header: 'Status', render: (v) => v.sale?.saleStatus ?? '-' },
          {
            header: 'Period',
            render: (v) =>
              v.sale?.saleStartDate || v.sale?.saleEndDate
                ? `${v.sale.saleStartDate ?? '?'} → ${v.sale.saleEndDate ?? '?'}`
                : '-',
          },
          { header: 'Sold', render: (v) => nf.format(v.metrics?.soldQuantity ?? 0) },
          { header: 'Revenue', render: (v) => fmtRpShort(v.metrics?.revenue) },
          { header: 'Return', render: (v) => `${((v.metrics?.returnRate ?? 0) * 100).toFixed(1)}%` },
          {
            header: 'Quota',
            render: (v) =>
              v.sale?.salePurchaseLimit
                ? `${v.sale.salePurchaseCount ?? 0}/${v.sale.salePurchaseLimit}${v.sale.saleQuotaRemaining != null ? ` (left ${v.sale.saleQuotaRemaining})` : ''}`
                : '-',
          },
          {
            header: '',
            render: (v) => (
              <div className="flex gap-3 text-xs uppercase tracking-wider">
                <button type="button" className="hover:underline" onClick={() => openEdit(v)}>
                  Edit
                </button>
                {v.sale?.isSale && (
                  <button
                    type="button"
                    className="text-ui-error"
                    onClick={() => removeSale.mutate(v.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={data?.variants}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.pagination.total ?? 0}
        limit={limit}
        onPage={setPage}
        toolbar={
          <>
            <Input
              placeholder="Search variant…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <select
              value={isSale}
              onChange={(e) => {
                setPage(1);
                setIsSale(e.target.value);
              }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="yes">On sale</option>
              <option value="no">Not on sale</option>
            </select>
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as SaleStatus | '');
              }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              <option value="">Semua status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        }
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Sale — ${editing?.product?.name ?? ''}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!editing) return;
            setSale.mutate(
              { variantId: editing.id, ...form },
              { onSuccess: () => setEditing(null), onError: (err) => alert(err.message) }
            );
          }}
          className="flex flex-col gap-4"
        >
          <NumberField label="Sale Price (Rp)" value={form.salePrice} onChange={(v) => setForm((f) => ({ ...f, salePrice: v }))} />
          <NumberField label="Discount %" value={form.discountPercent} onChange={(v) => setForm((f) => ({ ...f, discountPercent: v }))} />
          <Input
            label="Start Date"
            type="date"
            value={form.saleStartDate ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, saleStartDate: e.target.value || undefined }))}
          />
          <Input
            label="End Date"
            type="date"
            value={form.saleEndDate ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, saleEndDate: e.target.value || undefined }))}
          />
          <NumberField label="Purchase Limit (global)" value={form.salePurchaseLimit} onChange={(v) => setForm((f) => ({ ...f, salePurchaseLimit: v }))} />
          <NumberField label="Purchase Limit / User" value={form.salePurchaseLimitPerUser} onChange={(v) => setForm((f) => ({ ...f, salePurchaseLimitPerUser: v }))} />
          <Button type="submit">{setSale.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value?: number; onChange: (v: number | undefined) => void }) {
  return (
    <Input
      label={label}
      type="number"
      value={value === undefined || value === null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    />
  );
}

function fmtRpShort(n?: number) {
  return n === undefined || n === null ? '-' : `Rp ${nf.format(n)}`;
}
