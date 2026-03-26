-- ============================================================
-- Migration: Order Protection — orders can NEVER be permanently lost
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. Update orders status CHECK to include 'trashed' and 'archived'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded', 'trashed', 'archived', 'manual_payment'));

-- 2. Create orders_archive table — permanent record, never deleted
CREATE TABLE IF NOT EXISTS orders_archive (
  id BIGSERIAL PRIMARY KEY,
  original_id BIGINT NOT NULL,
  order_number TEXT NOT NULL,
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
  status TEXT DEFAULT '',
  payment_status TEXT DEFAULT '',
  payment_method TEXT DEFAULT '',
  tracking_number TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status_history JSONB DEFAULT '[]'::jsonb,
  original_created_at TIMESTAMPTZ,
  original_updated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_reason TEXT DEFAULT 'empty_trash'
);

-- 3. Enable RLS and allow service role access
ALTER TABLE orders_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service full access orders_archive"
  ON orders_archive FOR ALL USING (true) WITH CHECK (true);

-- 4. Safety net trigger: if ANY delete happens on orders, copy to archive first
CREATE OR REPLACE FUNCTION archive_order_before_delete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO orders_archive (
    original_id, order_number, customer_email, customer_name,
    shipping_address, billing_address, items, subtotal, shipping_cost,
    tax, total, discount, coupon_code, province, status, payment_status,
    payment_method, tracking_number, notes, status_history,
    original_created_at, original_updated_at, archived_reason
  ) VALUES (
    OLD.id, OLD.order_number, OLD.customer_email, OLD.customer_name,
    OLD.shipping_address, OLD.billing_address, OLD.items, OLD.subtotal, OLD.shipping_cost,
    OLD.tax, OLD.total, OLD.discount, OLD.coupon_code, OLD.province, OLD.status, OLD.payment_status,
    OLD.payment_method, OLD.tracking_number, OLD.notes, OLD.status_history,
    OLD.created_at, OLD.updated_at, 'db_delete_trigger'
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_archive_before_delete ON orders;
CREATE TRIGGER orders_archive_before_delete
  BEFORE DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION archive_order_before_delete();

-- 5. Audit trail: log customer deletions so we know if/when it happens
CREATE OR REPLACE FUNCTION log_customer_delete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (user_email, action, entity_type, entity_id, entity_name, details)
  VALUES (
    OLD.email,
    'customer_deleted',
    'customer',
    OLD.id::text,
    OLD.name,
    jsonb_build_object(
      'email', OLD.email,
      'total_orders', OLD.total_orders,
      'total_spent', OLD.total_spent,
      'deleted_at', NOW()
    )
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS customers_log_before_delete ON customers;
CREATE TRIGGER customers_log_before_delete
  BEFORE DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION log_customer_delete();

-- 6. Add index for fast archive lookups
CREATE INDEX IF NOT EXISTS idx_orders_archive_order_number ON orders_archive(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_archive_customer_email ON orders_archive(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_archive_archived_at ON orders_archive(archived_at);
