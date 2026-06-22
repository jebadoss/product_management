-- PMS Pro (Product Management System) - PostgreSQL Schema
-- This schema is designed to match the frontend data model in app.js.
-- Run: psql -f postgres-schema.sql

BEGIN;

-- 1) Employees
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  dept VARCHAR(100),
  role VARCHAR(100),
  email VARCHAR(200),
  phone VARCHAR(30),
  blood VARCHAR(5),
  status VARCHAR(10) NOT NULL CHECK (status IN ('Active','Inactive')),
  join_date DATE,
  resign_date DATE,
  address TEXT
);

-- 2) Categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- 3) Products
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  brand VARCHAR(100),
  serial VARCHAR(100),
  purchase_date DATE,
  qty INTEGER NOT NULL DEFAULT 1 CHECK (qty >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Available','Assigned','Damaged','Repair'))
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- 4) Assignments (denormalized fields kept to align with frontend UI)
CREATE TABLE IF NOT EXISTS assignments (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  employee_id BIGINT NOT NULL REFERENCES employees(id) ON UPDATE CASCADE ON DELETE RESTRICT,

  -- denormalized for UI/history
  product_code VARCHAR(30) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  employee_name VARCHAR(200) NOT NULL,
  employee_dept VARCHAR(100) ,

  assigned_date DATE NOT NULL,
  return_date DATE
);

CREATE INDEX IF NOT EXISTS idx_assignments_employee_id ON assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_assignments_product_id ON assignments(product_id);

-- Optional: Ensure consistency with current product status logic.
-- (Not enforced here because it requires triggers / application logic.)

-- 5) Damage Reports (one row per report)
CREATE TABLE IF NOT EXISTS damages (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,

  -- denormalized for UI
  product_code VARCHAR(30) NOT NULL,
  product_name VARCHAR(200) NOT NULL,

  date_reported DATE NOT NULL,
  reported_by VARCHAR(200) NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_damages_product_id ON damages(product_id);
CREATE INDEX IF NOT EXISTS idx_damages_date_reported ON damages(date_reported);

-- 6) Repair Tracking (multiple records allowed)
CREATE TABLE IF NOT EXISTS repairs (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,

  -- denormalized for UI
  product_code VARCHAR(30) NOT NULL,
  product_name VARCHAR(200) NOT NULL,

  center VARCHAR(200),
  contact VARCHAR(50),
  taken_by VARCHAR(200),

  date_sent DATE,
  expected_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pending','In Progress','Completed')),

  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_repairs_product_id ON repairs(product_id);
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);

-- 7) Product History (event log)
-- Aligning with frontend: fields include productCode, productName, action, employee, date, returnDate, notes
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,

  -- optional links (normalized) + denormalized columns for UI
  product_id BIGINT REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
  employee_id BIGINT REFERENCES employees(id) ON UPDATE CASCADE ON DELETE SET NULL,

  product_code VARCHAR(30),
  product_name VARCHAR(200),

  action VARCHAR(30) NOT NULL,
  employee VARCHAR(200),

  event_date DATE NOT NULL,
  return_date DATE,
  notes TEXT
);

-- action values used in frontend app.js:
-- Added, Assigned, Returned, Damaged, Repair, Repaired
ALTER TABLE history
  ADD CONSTRAINT history_action_check
  CHECK (action IN ('Added','Assigned','Returned','Damaged','Repair','Repaired'));

CREATE INDEX IF NOT EXISTS idx_history_product_code ON history(product_code);
CREATE INDEX IF NOT EXISTS idx_history_event_date ON history(event_date);

-- 8) Triggers are intentionally NOT included.
-- Your backend (or app) should keep denormalized fields consistent.

COMMIT;

-- ===================== Seed (optional) =====================
-- Not included by default. Frontend can start empty or via backend seeding.

