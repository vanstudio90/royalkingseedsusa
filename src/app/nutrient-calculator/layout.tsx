import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cannabis Nutrient Calculator — Feeding Schedule for Soil, Coco & Hydro',
  description: 'Free cannabis nutrient calculator with EC and PPM targets by growth stage. Get a feeding plan for soil, coco coir, or hydro setups. Stage-based guidance for seedling through harvest.',
  alternates: { canonical: 'https://royalkingseeds.us/nutrient-calculator' },
  openGraph: {
    title: 'Cannabis Nutrient Calculator — Feeding Schedule by Stage & Medium',
    description: 'Calculate EC, PPM, and feeding frequency for your cannabis grow. Covers soil, coco, and hydro across all growth stages.',
    url: 'https://royalkingseeds.us/nutrient-calculator',
  },
};

export default function NutrientCalcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
