'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWarehouseMovements, useWarehouseOverview, useWarehouseProducts } from '@/services/admin/admin-warehouse';

export default function AdminWarehouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const overview = useWarehouseOverview(id);
  const products = useWarehouseProducts(id, { limit: 10 });
  const movements = useWarehouseMovements(id, { limit: 10 });

  if (overview.isLoading)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">Loading…</div>;
  if (overview.error)
    return (
      <div className="py-16 text-center text-ui-error text-sm">
        {overview.error instanceof Error ? overview.error.message : 'Failed to load'}
      </div>
    );

  const o = overview.data ?? {};

  return (
    <div>
      <Link href="/admin/warehouse" className="text-xs text-brand-gray hover:text-brand-black uppercase tracking-wider">
        ← Back
      </Link>
      <h1 className="text-xl font-bold uppercase tracking-widest mt-2 mb-6">Warehouse Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(o).slice(0, 8).map(([k, v]) => (
          <div key={k} className="border border-brand-border p-5">
            <p className="text-2xs uppercase tracking-wider text-brand-gray">{k}</p>
            <p className="text-xl font-bold mt-2 truncate">{String(v ?? '-')}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Products</h2>
      <div className="overflow-x-auto border border-brand-border mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">SKU</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody>
            {(products.data?.data ?? []).map((p) => (
              <tr key={p.id} className="border-b border-brand-border last:border-b-0">
                <td className="px-4 py-3">{p.name ?? '-'}</td>
                <td className="px-4 py-3">{p.sku ?? '-'}</td>
                <td className="px-4 py-3">{p.stock ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Movements</h2>
      <div className="overflow-x-auto border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">SKU</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Qty</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {(movements.data?.data ?? []).map((m) => (
              <tr key={m.id} className="border-b border-brand-border last:border-b-0">
                <td className="px-4 py-3">{m.sku ?? '-'}</td>
                <td className="px-4 py-3">{m.type ?? '-'}</td>
                <td className="px-4 py-3">{m.quantity ?? 0}</td>
                <td className="px-4 py-3">{m.createdAt ? new Date(m.createdAt).toLocaleDateString('id-ID') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
