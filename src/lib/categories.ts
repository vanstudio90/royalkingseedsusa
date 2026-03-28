export interface Category {
  name: string;
  slug: string;
  parent?: string;
  count?: number;
}

export const categories: Category[] = [
  { name: 'Shop All Cannabis Seeds', slug: 'shop-all-cannabis-seeds' },
  { name: 'Classic Cannabis Seeds', slug: 'classic-cannabis-seeds' },
  { name: 'Energizing Cannabis Seeds', slug: 'energizing-cannabis-seeds' },
  { name: 'Euphoric Seeds', slug: 'euphoric-seeds' },
  { name: 'Exotic Cannabis Seeds', slug: 'exotic-cannabis-seeds' },
  { name: 'High THC Seeds', slug: 'high-tch-seeds' },
  { name: 'Purple Genetics Seeds', slug: 'purple-genetics-seeds' },
  { name: 'Fast Flowering Seeds', slug: 'fast-flowering-seeds' },
  { name: 'Best Seller Seeds', slug: 'best-seller', parent: 'shop-all-cannabis-seeds' },
  { name: 'Best Strains For Anxiety', slug: 'best-strains-for-anxiety', parent: 'shop-all-cannabis-seeds' },
  { name: 'Best Strains For High Yield', slug: 'best-strains-for-high-yield', parent: 'shop-all-cannabis-seeds' },
  { name: 'Best Strains For Indoor Growing', slug: 'best-strains-for-indoor-growing', parent: 'shop-all-cannabis-seeds' },
  { name: 'Best Strains For Outdoor Growing', slug: 'best-strains-for-outdoor-growing', parent: 'shop-all-cannabis-seeds' },
  { name: 'BOGO Seeds', slug: 'bogo-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'Cannabis Seeds On Sale', slug: 'cannabis-seeds-on-sale', parent: 'shop-all-cannabis-seeds' },
  { name: 'Fruity Cannabis Seeds', slug: 'fruity-cannabis-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'Kush Seeds', slug: 'kush-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'USA Premium Cannabis Seeds', slug: 'usa-premium-cannabis-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: "Grower's Choice Collection", slug: 'growers-choice-seeds-collection', parent: 'usa-premium-cannabis-seeds' },
  { name: 'Autoflowering Seeds', slug: 'autoflowering-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'Auto Flowering Hybrids', slug: 'auto-flowering-hybrids', parent: 'autoflowering-seeds' },
  { name: 'Auto-Flowering Indicas', slug: 'auto-flowering-indicas', parent: 'autoflowering-seeds' },
  { name: 'Auto-Flowering Sativas', slug: 'auto-flowering-sativas', parent: 'autoflowering-seeds' },
  { name: 'Feminized Seeds', slug: 'feminized-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'Feminized Hybrids', slug: 'feminized-hybrids', parent: 'feminized-seeds' },
  { name: 'Feminized Indicas', slug: 'feminized-indicas', parent: 'feminized-seeds' },
  { name: 'Feminized Sativas', slug: 'feminized-sativas', parent: 'feminized-seeds' },
  { name: 'Mix Packs', slug: 'mix-packs', parent: 'shop-all-cannabis-seeds' },
  { name: 'CBD Strains', slug: 'cbd-strains', parent: 'shop-all-cannabis-seeds' },
  { name: 'Hybrid Strains', slug: 'hybrid', parent: 'shop-all-cannabis-seeds' },
  { name: 'Indica Strains', slug: 'indica-seeds', parent: 'shop-all-cannabis-seeds' },
  { name: 'Ruderalis', slug: 'ruderalis', parent: 'shop-all-cannabis-seeds' },
  { name: 'Photoperiod Seeds', slug: 'photoperiod', parent: 'shop-all-cannabis-seeds' },
  { name: 'Sativa Strains', slug: 'sativa-seeds', parent: 'shop-all-cannabis-seeds' },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getChildCategories(parentSlug: string): Category[] {
  return categories.filter((c) => c.parent === parentSlug);
}

export function getTopLevelCategories(): Category[] {
  return categories.filter((c) => !c.parent);
}
