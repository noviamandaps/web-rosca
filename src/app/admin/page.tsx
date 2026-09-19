'use client';

import { useCustomerInsights, useRevenue, useSlowProducts, useSummary, useTopProducts, useUsersStat } from '@/services/admin/admin-dashboard';
import type { TopProductItem } from '@/lib/api-types';

const nf = new Intl.NumberFormat('id-ID');
const fmtRp = (n?: number | null) => (n === undefined || n === null ? '-' : `Rp ${nf.format(n)}`);
const pct = (n?: number) => (n === undefined || n === null ? '-' : `${n > 0 ? '+' : ''}${n.toFixed(1)}%`);

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-brand-border p-5">
      <p className="text-2xs uppercase tracking-wider text-brand-gray">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {sub && <p className="text-2xs text-brand-gray mt-1">{sub}</p>}
    </div>
  );
}

function ProductTable({ title, items }: { title: string; items: TopProductItem[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">{title}</h2>
      <div className="overflow-x-auto border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Variant</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Sold</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p.variantId ?? `${p.product?.productId}-${i}`} className="border-b border-brand-border last:border-b-0">
                <td className="px-4 py-3">{p.product?.productName ?? '-'}</td>
                <td className="px-4 py-3 text-brand-gray">{p.variantLabel ?? '-'}</td>
                <td className="px-4 py-3">{p.totalSold ?? 0}</td>
                <td className="px-4 py-3">{fmtRp(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: s } = useSummary();
  const { data: revenue } = useRevenue({ months: 12 });
  const { data: users } = useUsersStat({ months: 12 });
  const { data: insights } = useCustomerInsights({ months: 12 });
  const { data: top } = useTopProducts({ limit: 10, months: 12 });
  const { data: slow } = useSlowProducts({ limit: 10, months: 12 });

  const lastRevenue = revenue?.monthly?.length ? revenue.monthly[revenue.monthly.length - 1] : undefined;
  const lastUsers = users?.monthly?.length ? users.monthly[users.monthly.length - 1] : undefined;
  const lastInsight = insights?.monthly?.length ? insights.monthly[insights.monthly.length - 1] : undefined;

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card label="Revenue" value={fmtRp(s?.revenue.total)} sub={`${pct(s?.revenue.growthRate)} MoM`} />
        <Card label="Net Sales" value={fmtRp(s?.netSales.total)} sub={`Fees ${fmtRp(s?.netSales.serviceFees)}`} />
        <Card label="GMV" value={fmtRp(s?.gmv.total)} />
        <Card label="Orders" value={nf.format(s?.orders.total ?? 0)} sub={`Today ${nf.format(s?.orders.today ?? 0)}`} />
        <Card label="Users" value={nf.format(s?.users.total ?? 0)} sub={`Active ${nf.format(s?.users.active ?? 0)}`} />
        <Card label="Low Stock" value={nf.format(s?.products.lowStock ?? 0)} sub={`Out ${nf.format(s?.products.outOfStock ?? 0)}`} />
      </div>

      <div className="grid lg:grid-cols-4 gap-8 mb-8">
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Revenue (latest month)</h2>
          <p className="text-2xl font-bold">{fmtRp(lastRevenue?.revenue)}</p>
          <p className="text-2xs text-brand-gray mt-2">AOV {fmtRp(revenue?.avgOrderValue)}</p>
        </div>
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">New Users (latest)</h2>
          <p className="text-2xl font-bold">{nf.format(lastUsers?.count ?? 0)}</p>
          <p className="text-2xs text-brand-gray mt-2">This month {nf.format(users?.newUsersThisMonth ?? 0)}</p>
        </div>
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Customers (latest)</h2>
          <p className="text-2xl font-bold">{nf.format(lastInsight?.newCustomers ?? 0)}</p>
          <p className="text-2xs text-brand-gray mt-2">Returning {nf.format(lastInsight?.returningCustomers ?? 0)}</p>
        </div>
        <div className="border border-brand-border p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Abandoned Carts</h2>
          <p className="text-2xl font-bold">{nf.format(s?.abandonedCarts.total ?? 0)}</p>
          <p className="text-2xs text-brand-gray mt-2">Rate {pct(s?.abandonedCarts.rate)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <ProductTable title="Top Products" items={top?.products ?? []} />
        <ProductTable title="Slow Products" items={slow?.products ?? []} />
      </div>
    </div>
  );
}
