'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button, Input } from '@/components/ui';
import { exportOrders, useOrders } from '@/services/admin/admin-orders';
import type { Order, OrderStatus } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');

const statuses: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const limit = 10;
  const { data, isLoading, error } = useOrders({ page, limit, search: search || undefined, status: status || undefined });

  async function handleExport() {
    try {
      await exportOrders({ search: search || undefined, status: status || undefined });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Orders</h1>
        <Button size="sm" variant="secondary" onClick={handleExport} type="button">
          Export XLSX
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
          { header: 'Customer', render: (o) => o.customerName ?? '-' },
          { header: 'Status', render: (o) => o.status },
          { header: 'Total', render: (o) => `Rp ${nf.format(o.total ?? 0)}` },
          { header: 'Date', render: (o) => (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') },
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
            <Input placeholder="Search order…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
            <select
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value as OrderStatus | ''); }}
              className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
            >
              <option value="">All status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        }
      />
    </div>
  );
}
