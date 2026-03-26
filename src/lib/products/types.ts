export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  categories: string[];
  strainType: StrainType;
  thcContent: string;
  indicaPercent: number;
  sativaPercent: number;
  effects: string[];
  bestUse: string[];
  seedOptions: any[];
  price: number;
  feminized: boolean;
  autoflower: boolean;
  inStock: boolean;
  sku: string;
  imageUrl: string;
  metaTitle?: string;
  metaDescription?: string;
  floweringTime?: string;
  plantHeight?: string;
  indoorYield?: string;
  outdoorYield?: string;
  difficulty?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: { label: string; price: number; sku?: string };
}

export interface ProductFilters {
  strainType?: StrainType[];
  effects?: string[];
  autoflower?: boolean;
  feminized?: boolean;
  priceMax?: number;
  query?: string;
  category?: string;
}
