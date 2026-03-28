import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cannabis Strain Comparison Tool — Compare Strains Side by Side',
  description: 'Compare 2-4 cannabis strains side by side by yield, THC, flowering time, grow difficulty, and suitability. Find the best strain for your setup with our free comparison tool.',
  alternates: { canonical: 'https://royalkingseeds.us/compare-strains' },
  openGraph: {
    title: 'Cannabis Strain Comparison Tool — Compare Side by Side',
    description: 'Compare cannabis strains by yield, THC, difficulty, and more. Choose the right seeds for your grow.',
    url: 'https://royalkingseeds.us/compare-strains',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
