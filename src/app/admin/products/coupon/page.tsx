'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { uploadSingle } from '@/services/admin/admin-products';
import { useCoupons, useDeleteCoupon, useSaveCoupon, useToggleCoupon } from '@/services/admin/admin-coupons';
import type { Coupon } from '@/lib/api-types';

const empty: Partial<Coupon> = { code: '', discountType: 'PERCENT', isActive: true };

export default function AdminCouponPage() {
  const { data: coupons, isLoading } = useCoupons();
  const save = useSaveCoupon();
  const toggle = useToggleCoupon();
  const del = useDeleteCoupon();

  const [editing, setEditing] = useState<Partial<Coupon> | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [f, setF] = useState<Partial<Coupon>>(empty);

  const set = (k: keyof Coupon, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError('');
    try {
      let imageUrl = editing.imageUrl;
      if (image) {
        const res = await uploadSingle(image);
        imageUrl = res.url ?? res.data?.url;
      }
      await save.mutateAsync({
        id: editing.id,
        data: {
          ...f,
          imageUrl,
          discountValue: f.discountValue ? Number(f.discountValue) : undefined,
          minOrderAmount: f.minOrderAmount ? Number(f.minOrderAmount) : undefined,
          maxDiscountAmount: f.maxDiscountAmount ? Number(f.maxDiscountAmount) : undefined,
          usageLimit: f.usageLimit ? Number(f.usageLimit) : undefined,
          perUserLimit: f.perUserLimit ? Number(f.perUserLimit) : undefined,
          claimLimit: f.claimLimit ? Number(f.claimLimit) : undefined,
        },
      });
      setEditing(null);
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const list = coupons ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Coupons</h1>
        <Button size="sm" type="button" onClick={() => { setEditing({}); setF(empty); setImage(null); }}>
          + Add
        </Button>
      </div>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      <div className="overflow-x-auto border border-brand-border mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Code</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Discount</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Active</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-brand-border last:border-b-0">
                <td className="px-4 py-3 font-medium">{c.code}</td>
                <td className="px-4 py-3">{c.name ?? '-'}</td>
                <td className="px-4 py-3">
                  {c.discountType} {c.discountValue ?? ''}
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggle.mutate(c.id)} className={c.isActive ? 'text-brand-black' : 'text-brand-gray'}>
                    {c.isActive ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-wider">
                  <span className="flex gap-3">
                    <button type="button" onClick={() => { setEditing(c); setF(c); setImage(null); }} className="hover:underline">
                      Edit
                    </button>
                    <button type="button" onClick={() => del.mutate(c.id)} className="text-ui-error">
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Coupon' : 'New Coupon'}>
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <Input label="Code" value={f.code ?? ''} onChange={(e) => set('code', e.target.value)} required />
          <Input label="Name" value={f.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">Discount Type</label>
            <select
              value={f.discountType ?? 'PERCENT'}
              onChange={(e) => set('discountType', e.target.value)}
              className="w-full border border-brand-border px-4 py-3 text-sm mt-1 bg-white focus:border-brand-black focus:outline-none"
            >
              {['PERCENT', 'FIXED', 'FREE_SHIPPING'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input label="Discount Value" type="number" value={String(f.discountValue ?? '')} onChange={(e) => set('discountValue', e.target.value)} />
          <Input label="Min Order (Rp)" type="number" value={String(f.minOrderAmount ?? '')} onChange={(e) => set('minOrderAmount', e.target.value)} />
          <Input label="Max Discount (Rp)" type="number" value={String(f.maxDiscountAmount ?? '')} onChange={(e) => set('maxDiscountAmount', e.target.value)} />
          <Input label="Usage Limit" type="number" value={String(f.usageLimit ?? '')} onChange={(e) => set('usageLimit', e.target.value)} />
          <Input label="Per User Limit" type="number" value={String(f.perUserLimit ?? '')} onChange={(e) => set('perUserLimit', e.target.value)} />
          <Input label="Start Date" type="date" value={f.startDate ?? ''} onChange={(e) => set('startDate', e.target.value)} />
          <Input label="End Date" type="date" value={f.endDate ?? ''} onChange={(e) => set('endDate', e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.isForNewUser} onChange={(e) => set('isForNewUser', e.target.checked)} /> For new user
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.isCombinable} onChange={(e) => set('isCombinable', e.target.checked)} /> Combinable
          </label>
          <div className="col-span-2">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="text-sm" />
          </div>
          {error && <span className="col-span-2 text-2xs text-ui-error">{error}</span>}
          <div className="col-span-2">
            <Button type="submit">{save.isPending ? 'Saving…' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
