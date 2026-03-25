// Product data layer for Royal King Seeds US
// Uses local product engine with CA-sourced data and US-unique descriptions
// Replaces the WooCommerce API approach

export {
  getProducts,
  getAllProducts,
  getProductBySlug,
  getProductBySlugAny,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductCount,
} from './product-engine';
