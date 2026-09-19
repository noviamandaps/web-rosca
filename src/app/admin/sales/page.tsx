'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input, Modal } from '@/components/ui';
import { useAutoSale, useRemoveVariantSale, useSaleVariants, useSales, useSetVariantSale, type SaleInput } from '@/services/admin/admin-sales';
import type { SaleEntry } from '@/lib/api-types';

export default function AdminSalesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isSale, setIsSale] = useState('');
  const [editing, setEditing] = useState<SaleEntry | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useSaleVariants({
    page,
    limit,
    search: search || undefined,
    isSale: isSale === '' ? undefined : isSale === 'yes',
  });
  const { data: sales } = useSales();
  const setSale = useSetVariantSale();
  const removeSale = useRemoveVariantSale();
  const auto = useAutoSale();
  const [form, setForm] = useState<SaleInput>({});

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      await setSale.mutateAsync({ variantId: editing.id, ...form });
      setEditing(null);
      setForm({});
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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

      {sales && sales.data.length > 0 && (
        <p className="text-xs text-brand-gray mb-4">
          {sales.data.length} produk dalam flash sale
        </p>
      )}

      <AdminTable<SaleEntry>
        columns={[
          { header: 'Variant', render: (v) => v.variantLabel ?? v.sku ?? v.variantId ?? v.id },
          { header: 'Product', render: (v) => v.productName ?? '-' },
          { header: 'Price', render: (v) => (v.price ? `Rp ${v.price.toLocaleString('id-ID')}` : '-') },
          { header: 'Sale Price', render: (v) => (v.salePrice ? `Rp ${v.salePrice.toLocaleString('id-ID')}` : '-') },
          { header: 'Start', render: (v) => v.saleStartDate ?? '-' },
          { header: 'End', render: (v) => v.saleEndDate ?? '-' },
          { header: 'On Sale', render: (v) => (v.isSale ? 'Yes' : 'No') },
          {
            header: '',
            render: (v) => (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-xs uppercase tracking-wider hover:underline"
                  onClick={() => {
                    setEditing(v);
                    setForm({
                      salePrice: v.salePrice,
                      discountPercent: v.discountPercent,
                      saleStartDate: v.saleStartDate,
                      saleEndDate: v.saleEndDate,
                    });
                  }}
                >
                  Edit
                </button>
                {v.isSale && (
                  <button
                    type="button"
                    className="text-xs text-ui-error uppercase tracking-wider"
                    onClick={() => removeSale.mutate(v.variantId ?? v.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
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
          </>
        }
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Sale — ${editing?.variantLabel ?? ''}`}>
        <form onSubmit={save} className="flex flex-col gap-4">
          <Input
            label="Sale Price (Rp)"
            type="number"
            value={String(form.salePrice ?? '')}
            onChange={(e) => setForm((f) => ({ ...f, salePrice: Number(e.target.value) || undefined }))}
          />
          <Input
            label="Discount %"
            type="number"
            value={String(form.discountPercent ?? '')}
            onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) || undefined }))}
          />
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
          <Button type="submit">{setSale.isPending ? 'Saving…' : 'Save'}</Button>
        </form>
      </Modal>
    </div>
  );
}
