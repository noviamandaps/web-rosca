'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { useReturnStatistics, useReturns } from '@/services/admin/admin-returns';
import type { ReturnItem, ReturnStatus } from '@/lib/api-types';

const statuses: ReturnStatus[] = ['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CLOSED'];

export default function AdminReturnsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReturnStatus | ''>('');
  const limit = 10;
  const { data, isLoading, error } = useReturns({ page, limit, returnStatus: status || undefined });
  const { data: stats } = useReturnStatistics();

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-2">Returns</h1>
      {stats && (
        <p className="text-xs text-brand-gray mb-4">
          {Object.entries(stats)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · ')}
        </p>
      )}
      <AdminTable<ReturnItem>
        columns={[
          {
            header: 'Return',
            render: (r) => (
              <Link href={`/admin/returns/${r.id}`} className="font-medium hover:underline">
                {r.id}
              </Link>
            ),
          },
          { header: 'Order', render: (r) => r.orderId ?? '-' },
          { header: 'Status', render: (r) => r.returnStatus },
          { header: 'Condition', render: (r) => r.condition ?? '-' },
          { header: 'Reason', render: (r) => r.reason ?? r.customerNotes ?? '-' },
          { header: 'Refund', render: (r) => (r.refundAmount ? `Rp ${r.refundAmount.toLocaleString('id-ID')}` : '-') },
        ]}
        rows={data?.data}
        loading={isLoading}
        error={error}
        page={page}
        total={data?.total ?? 0}
        limit={limit}
        onPage={setPage}
        toolbar={
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as ReturnStatus | '');
            }}
            className="border border-brand-border px-4 py-3 text-sm bg-white focus:border-brand-black focus:outline-none"
          >
            <option value="">All status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />
    </div>
  );
}
