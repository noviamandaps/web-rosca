'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useOrder, useSyncKomerce, useUpdateOrderStatus, useUpdateOrderTracking } from '@/services/admin/admin-orders';
import type { OrderStatus } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');
const statuses: OrderStatus[] = [
  'PENDING', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'READY_TO_SHIP',
  'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED',
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id);
  const updateOrderStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateOrderTracking();
  const sync = useSyncKomerce();
  const [courierCode, setCourierCode] = useState('');
  const [courierService, setCourierService] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

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
        <h1 className="text-xl font-bold uppercase tracking-widest">
          {order.orderNumber ?? order.id}
          <span className="ml-3 text-sm font-normal text-brand-gray">{order.statusLabel ?? order.status}</span>
        </h1>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" type="button" onClick={() => sync.mutate(order.id)}>
            {sync.isPending ? 'Syncing…' : 'Sync Komerce'}
          </Button>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
            className="border border-brand-border px-4 py-2 text-sm bg-white focus:border-brand-black focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(order.items ?? []).map((it) => (
                  <tr key={it.id} className="border-b border-brand-border last:border-b-0">
                    <td className="px-4 py-3">
                      {it.productName ?? '-'}
                      {it.variantInfo ? <span className="block text-2xs text-brand-gray">{it.variantInfo}</span> : null}
                      {it.engraveText ? <span className="block text-2xs text-brand-gray">Engrave: {it.engraveText}</span> : null}
                    </td>
                    <td className="px-4 py-3">{it.quantity}</td>
                    <td className="px-4 py-3">Rp {nf.format(it.unitPrice ?? 0)}</td>
                    <td className="px-4 py-3">Rp {nf.format(it.subtotal ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-brand-border p-5 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Info</h2>
            <p>Customer: {order.user?.name ?? '-'}</p>
            <p>Email: {order.user?.email ?? '-'}</p>
            <p>Membership: {order.user?.membershipLevel ?? '-'}</p>
            <p>Warehouse: {order.warehouse?.name ?? '-'}</p>
            <p>Payment: {order.payment?.paymentMethod ?? order.payment?.status ?? '-'}</p>
            <p>Courier: {[order.courierCode, order.courierService].filter(Boolean).join(' ') || '-'}</p>
            <p>Tracking: {order.trackingNumber ?? '-'}</p>
            <p className="mt-2">Subtotal: Rp {nf.format(order.subtotal ?? 0)}</p>
            <p>Shipping: Rp {nf.format(order.shippingCost ?? 0)}</p>
            <p>Discount: Rp {nf.format(order.discountAmount ?? 0)}</p>
            <p className="font-bold">Total: Rp {nf.format(order.totalAmount ?? 0)}</p>
          </div>
          <div className="border border-brand-border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Tracking</h2>
            <div className="flex flex-col gap-3">
              <Input placeholder="Courier code" value={courierCode} onChange={(e) => setCourierCode(e.target.value)} />
              <Input placeholder="Courier service" value={courierService} onChange={(e) => setCourierService(e.target.value)} />
              <Input placeholder="Tracking number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
              <Button
                size="sm"
                type="button"
                onClick={() =>
                  updateTracking.mutate({
                    id: order.id,
                    courierCode: courierCode || undefined,
                    courierService: courierService || undefined,
                    trackingNumber: trackingNumber || undefined,
                  })
                }
              >
                {updateTracking.isPending ? 'Saving…' : 'Save Tracking'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
