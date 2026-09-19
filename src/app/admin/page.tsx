'use client';

import { useQuery } from '@tanstack/react-query';
import { getSummary, getRevenue, getTopProducts, getUsersStat, getTraffic } from '@/services/admin/admin-dashboard';

const nf = new Intl.NumberFormat('id-ID');
const fmtRp = (n?: number) => (n === undefined ? '-' : `Rp ${nf.format(n)}`);

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-brand-border p-5">
      <p className="text-2xs uppercase tracking-wider text-brand-gray">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: summary } = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: () => getSummary() });
  const { data: revenue } = useQuery({ queryKey: ['dashboard', 'revenue'], queryFn: () => getRevenue() });
  const { data: users } = useQuery({ queryKey: ['dashboard', 'users'], queryFn: () => getUsersStat() });
  const { data: traffic } = useQuery({ queryKey: ['dashboard', 'traffic'], queryFn: () => getTraffic() });
  const { data: top } = useQuery({ queryKey: ['dashboard', 'top-products'], queryFn: () => getTopProducts() });

  const cards: { label: string; value: string }[] = [
    { label: 'Total Revenue', value: fmtRp(summary?.totalRevenue) },
    { label: 'Total Orders', value: String(summary?.totalOrders ?? '-') },
    { label: 'Customers', value: String(summary?.totalCustomers ?? '-') },
    { label: 'Products', value: String(summary?.totalProducts ?? '-') },
  ];

  const last = <T,>(a?: T[]) => (a?.length ? a[a.length - 1] : undefined);

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label} {...c} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Revenue (latest)</h2>
          <p className="text-3xl font-bold">{fmtRp(last(revenue)?.revenue)}</p>
        </div>
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Traffic (latest)</h2>
          <p className="text-3xl font-bold">{nf.format(last(traffic)?.visits ?? 0)}</p>
          <p className="text-2xs text-brand-gray mt-2">
            New users (latest): {nf.format(last(users)?.newUsers ?? 0)}
          </p>
        </div>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Top Products</h2>
      <div className="overflow-x-auto border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Sold</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {(top ?? []).map((p, i) => (
              <tr key={p.productId ?? i} className="border-b border-brand-border last:border-b-0">
                <td className="px-4 py-3">{p.name ?? '-'}</td>
                <td className="px-4 py-3">{p.sold ?? 0}</td>
                <td className="px-4 py-3">{fmtRp(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
