'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import type { SidebarConfig } from '@/components/layout/Sidebar';
import { getMyPaths } from '@/services/admin/admin-auth';

const menu: SidebarConfig['items'] = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/orders', label: 'Orders', icon: '▤' },
  { href: '/admin/products', label: 'Products', icon: '▣' },
  { href: '/admin/products/coupon', label: 'Coupons', icon: '⌘' },
  { href: '/admin/products/bundling', label: 'Bundling', icon: '⧉' },
  { href: '/admin/sales', label: 'Sales', icon: '◆' },
  { href: '/admin/returns', label: 'Returns', icon: '↩' },
  { href: '/admin/warehouse', label: 'Warehouse', icon: '▦' },
  { href: '/admin/inventory', label: 'Inventory', icon: '▥' },
  { href: '/admin/shipping', label: 'Shipping', icon: '➔' },
  { href: '/admin/analytics', label: 'Analytics', icon: '◔' },
  { href: '/admin/survey', label: 'Survey', icon: '✎' },
  { href: '/admin/management/admins', label: 'Admins', icon: '☑' },
  { href: '/admin/settings/users', label: 'Users', icon: '☰' },
  { href: '/admin/settings/master', label: 'Master Data', icon: '≋' },
  { href: '/admin/settings/home', label: 'Home CMS', icon: '⌗' },
  { href: '/admin/settings/benefits', label: 'Benefits', icon: '✦' },
  { href: '/admin/settings/about', label: 'About CMS', icon: '⌧' },
  { href: '/admin/settings/notifications', label: 'Notifikasi', icon: '♪' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [ready, setReady] = useState(false);
  const [paths, setPaths] = useState<string[] | null>(null);

  useEffect(() => {
    if (isLogin) return;
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    getMyPaths()
      .then(setPaths)
      .catch(() => setPaths(null))
      .finally(() => setReady(true));
  }, [isLogin, pathname, router]);

  // ponytail: my-paths kosong/gagal → tampilkan semua menu
  const allowed = paths?.length
    ? menu.filter((m) => paths.some((p) => m.href === p || m.href.startsWith(`${p}/`)))
    : menu;
  const config: SidebarConfig = { title: 'ROSCA Admin', logo: 'ROSCA', items: allowed };

  if (isLogin) return <>{children}</>;
  if (!ready)
    return (
      <div className="flex items-center justify-center h-screen bg-brand-white">
        <div className="text-brand-gray uppercase tracking-widest text-xs">Loading…</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-white pl-16 md:pl-64">
      <Sidebar config={config} />
      <main className="p-6 md:p-8">{children}</main>
    </div>
  );
}
