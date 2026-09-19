'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useCancelOrder, useCompleteOrder, useOrders } from '@/services/user/orders';

const nf = new Intl.NumberFormat('id-ID');
const statuses = ['', 'all', 'PENDING', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'READY_TO_SHIP', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED'] as const;

function token() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export default function UserOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const limit = 10;
  const { data, isLoading, error } = useOrders({
    page,
    limit,
    search: search || undefined,
    status: (status || undefined) as 'PENDING',
  });
  const cancel = useCancelOrder();
  const complete = useCompleteOrder();

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-8">MY ORDERS</h1>

        {!token() ? (
          <div className="text-center">
            <p className="text-brand-gray mb-8">Please login to see your orders.</p>
            <Button href="/login">LOGIN</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <Input
                placeholder="Search order…"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="px-4 py-3 border border-brand-border text-sm bg-white focus:border-brand-black focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s || 'Semua'}
                  </option>
                ))}
              </select>
            </div>

            {isLoading && <p className="text-xs text-brand-gray">Loading orders…</p>}
            {error && (
              <p className="text-sm text-ui-error">
                {error instanceof Error ? error.message : 'Failed to load orders'}
              </p>
            )}

            {data?.orders.length ? (
              <div className="flex flex-col gap-4">
                {data.orders.map((o) => (
                  <div key={o.id} className="border border-brand-border p-4 md:p-6 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-40">
                      <Link href={`/catalog`} className="text-sm font-bold hover:underline">
                        {o.orderNumber ?? o.id}
                      </Link>
                      <p className="text-2xs text-brand-gray">
                        {o.statusLabel ?? o.status} · {o.itemCount ?? (o.items?.length ?? 0)} item(s) ·{' '}
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                    <span className="text-sm font-medium">Rp {nf.format(o.totalAmount ?? 0)}</span>
                    <div className="flex gap-3 text-xs uppercase tracking-wider">
                      {(o.status === 'PAID' || o.status === 'PROCESSING') && (
                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt('Cancel reason (required):');
                            if (reason) cancel.mutate({ orderNumber: o.orderNumber ?? o.id, reason });
                          }}
                          className="text-ui-error"
                        >
                          Cancel
                        </button>
                      )}
                      {(o.status === 'DELIVERED' || o.status === 'SHIPPED') && (
                        <button type="button" onClick={() => complete.mutate(o.orderNumber ?? o.id)} className="hover:underline">
                          Confirm received
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && <p className="text-xs text-brand-gray">No orders yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
