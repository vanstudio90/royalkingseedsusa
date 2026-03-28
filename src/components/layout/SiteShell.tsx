'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { AiChat } from '@/components/chat/AiChat';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin panel has its own layout
  if (pathname.startsWith('/futu')) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-[132px] lg:pt-[88px] pb-[72px] lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <AiChat />
    </>
  );
}
