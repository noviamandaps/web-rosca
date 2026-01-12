'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show header/footer on admin and affiliate pages
  const isAdminOrAffiliate = pathname?.startsWith('/admin') || pathname?.startsWith('/affiliate');

  if (isAdminOrAffiliate) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
