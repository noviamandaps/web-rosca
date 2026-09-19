'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useOrder, useUpdateOrderStatus, useUpdateOrderTracking } from '@/services/admin/admin-orders';
import type { OrderStatus } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');
const statuses: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateOrderTracking();
  const [tracking, setTracking] = useState('');

  if (isLoading)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">Loading…</div>;
  if (error || !order)
    return (
      <div className="py-16 text-center text-ui-error text-sm">
        {error instanceof Error ? error.message : 'Order not found'}
      </div>
    );

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
        ← Back
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">{order.orderNumber ?? order.id}</h1>
        <select
          value={order.status}
          onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
          className="border border-brand-border px-4 py-2 text-sm bg-white focus:border-brand-black focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Items</h2>
          <div className="overflow-x-auto border border-brand-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-gray">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Qty</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody>
                {(order.items ?? []).map((it) => (
                  <tr key={it.id} className="border-b border-brand-border last:border-b-0">
                    <td className="px-4 py-3">
                      {it.productName ?? '-'}
                      {it.engraveText ? <span className="block text-2xs text-brand-gray">Engrave: {it.engraveText}</span> : null}
                    </td>
                    <td className="px-4 py-3">{it.quantity}</td>
                    <td className="px-4 py-3">Rp {nf.format(it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-brand-border p-5 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Info</h2>
            <p>Customer: {order.customerName ?? '-'}</p>
            <p>Email: {order.customerEmail ?? '-'}</p>
            <p>Payment: {order.paymentMethod ?? '-'}</p>
            <p>Courier: {order.courierCode ?? '-'} {order.courierService ?? ''}</p>
            <p>Tracking: {order.trackingNumber ?? '-'}</p>
            <p className="mt-2 font-bold">Total: Rp {nf.format(order.total ?? 0)}</p>
          </div>
          <div className="border border-brand-border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Tracking</h2>
            <Input
              placeholder="Tracking number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
            <Button
              size="sm"
              type="button"
              className="mt-3"
              onClick={() => tracking && updateTracking.mutate({ id: order.id, trackingNumber: tracking })}
            >
              {updateTracking.isPending ? 'Saving…' : 'Save Tracking'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
