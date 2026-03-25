-- Royal King Seeds US - Complete Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  categories TEXT[] DEFAULT '{}',
  strain_type TEXT DEFAULT 'hybrid',
  thc_content TEXT DEFAULT '',
  indica_percent INTEGER DEFAULT 50,
  sativa_percent INTEGER DEFAULT 50,
  effects TEXT[] DEFAULT '{}',
  flavors TEXT[] DEFAULT '{}',
  best_use TEXT DEFAULT '',
  price DECIMAL(10,2) DEFAULT 0,
  sale_price DECIMAL(10,2),
  seed_options JSONB DEFAULT '[]',
  feminized BOOLEAN DEFAULT true,
  autoflower BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 100,
  low_stock_threshold INTEGER DEFAULT 10,
  sku TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  gallery_images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  flowering_time TEXT DEFAULT '',
  plant_height TEXT DEFAULT '',
  indoor_yield TEXT DEFAULT '',
  outdoor_yield TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  weight DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_slug TEXT,
  description TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB DEFAULT '{}',
  billing_address JSONB DEFAULT '{}',
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT DEFAULT '',
  province TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT DEFAULT '',
  tracking_number TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  shipping_address JSONB DEFAULT '{}',
  billing_address JSONB DEFAULT '{}',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  used_count INTEGER DEFAULT 0,
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'category', 'product')),
  applies_to_ids TEXT[] DEFAULT '{}',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_slug TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table (for static pages and blog posts)
CREATE TABLE IF NOT EXISTS pages (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  page_type TEXT DEFAULT 'page' CHECK (page_type IN ('page', 'blog')),
  category TEXT DEFAULT '',
  author TEXT DEFAULT 'Royal King Seeds',
  featured_image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_slug TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT '',
  entity_name TEXT DEFAULT '',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abandoned carts
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_name TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  recovery_email_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read published products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read published pages" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (active = true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public manage wishlists" ON wishlists FOR ALL USING (true) WITH CHECK (true);

-- Service role full access policies
CREATE POLICY "Service full access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access pages" ON pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access activity_log" ON activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access abandoned_carts" ON abandoned_carts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access admin_roles" ON admin_roles FOR ALL USING (true) WITH CHECK (true);

-- Updated_at triggers
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER abandoned_carts_updated_at BEFORE UPDATE ON abandoned_carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Auth upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Auth update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "Auth delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'products');

-- Default settings for US site
INSERT INTO settings (key, value) VALUES
  ('store', '{"name": "Royal King Seeds", "tagline": "Premium Cannabis Seeds", "email": "contact@royalkingseeds.com", "phone": "", "currency": "USD", "logo_url": ""}'),
  ('shipping', '{"free_threshold": 150, "flat_rate": 9.99, "express_rate": 19.99, "zones": ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]}'),
  ('announcement', '{"enabled": false, "text": "Free shipping on orders over $100!", "link": "/shop", "bg_color": "#275C53"}'),
  ('social', '{"instagram": "https://instagram.com/..", "facebook": "https://facebook.com/..", "twitter": "https://x.com/..", "youtube": "https://youtube.com/.."}'),
  ('seo', '{"default_title_suffix": " | Royal King Seeds", "homepage_title": "Royal King Seeds - Premium Cannabis Seeds", "homepage_description": "Shop premium cannabis seeds..."}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
