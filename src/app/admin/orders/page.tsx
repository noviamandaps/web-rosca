'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input } from '@/components/ui';
import { exportOrders, useOrders } from '@/services/admin/admin-orders';
import type { Order, OrderStatus } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');

const statuses: (OrderStatus | 'completed' | 'processing' | 'cancelled' | 'awaiting' | 'returned' | 'all')[] = [
  'all', 'PENDING', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'READY_TO_SHIP', 'DELIVERED',
  'COMPLETED', 'CANCELLED', 'REFUNDED', 'RETURNED',
];
const paymentStatuses = ['', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'] as const;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<(typeof paymentStatuses)[number]>('');
  const limit = 10;
  const { data, isLoading, error } = useOrders({
    page,
    limit,
    search: search || undefined,
    status: (status && status !== 'all' ? status : undefined) as OrderStatus | undefined,
    paymentStatus: paymentStatus || undefined,
  });

  async function handleExport() {
    try {
      await exportOrders({ search: search || undefined, status: (status || undefined) as OrderStatus | undefined });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Orders</h1>
        <Button size="sm" variant="secondary" onClick={handleExport} type="button">
          Export
        </Button>
      </div>
      <AdminTable<Order>
        columns={[
          {
            header: 'Order',
            render: (o) => (
              <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                {o.orderNumber ?? o.id}
              </Link>
            ),
          },
          { header: 'Customer', render: (o) => o.user?.name ?? '-' },
          { header: 'Status', render: (o) => o.statusLabel ?? o.status },
          { header: 'Total', render: (o) => `Rp ${nf.format(o.totalAmount ?? 0)}` },
          { header: 'Courier', render: (o) => [o.courierCode, o.courierService].filter(Boolean).join(' ') || '-' },
          { header: 'Date', render: (o) => (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') },
        ]}
        rows={data?.orders}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.pagination.total ?? 0}
        limit={limit}
        onPage={setPage}
        toolbar={
          <>
            <Input placeholder="Search order…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
            <select
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value); }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => { setPage(1); setPaymentStatus(e.target.value as (typeof paymentStatuses)[number]); }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>
                  {s || 'All payment'}
                </option>
              ))}
            </select>
          </>
        }
      />
    </div>
  );
}
