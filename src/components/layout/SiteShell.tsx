'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin panel has its own layout
  if (pathname.startsWith('/futu')) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-[132px] lg:pt-[88px]">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
