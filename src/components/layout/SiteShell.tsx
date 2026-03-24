'use client';

import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[132px] lg:pt-[88px]">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
