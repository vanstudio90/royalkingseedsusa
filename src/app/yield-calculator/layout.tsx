import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cannabis Yield Calculator — Estimate Your Indoor & Outdoor Harvest',
  description: 'Free cannabis yield calculator for indoor and outdoor growers. Estimate your harvest per square foot, get plant count recommendations, and discover the best high-yield strains for your setup.',
  alternates: { canonical: 'https://royalkingseeds.us/yield-calculator' },
  openGraph: {
    title: 'Cannabis Yield Calculator — Estimate Your Harvest',
    description: 'Estimate your cannabis harvest and find the best strains for your grow space. Free tool for indoor and outdoor growers.',
    url: 'https://royalkingseeds.us/yield-calculator',
  },
};

export default function YieldCalcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
