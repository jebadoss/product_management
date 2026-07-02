-- PostgreSQL Database Schema for Product Management System (3NF Normalized)

-- Drop existing tables in correct order if they exist
DROP TABLE IF EXISTS assignment_products CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS damages CASCADE;
DROP TABLE IF EXISTS repairs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS history CASCADE;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    dept VARCHAR(100),
    role VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    blood VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Active',
    join_date DATE,
    resign_date DATE,
    address TEXT,
    updated_at BIGINT NOT NULL
);

-- 3. Products Table (Kept original structure referencing category name string)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    cat VARCHAR(100) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE RESTRICT,
    purchase_date DATE,
    qty INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Available',
    updated_at BIGINT NOT NULL
);

-- 4. Assignments Table (3NF - Removed redundant employee_name and dept columns)
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    assigned_date DATE NOT NULL,
    return_date VARCHAR(100), -- Storing custom local formatted string as in existing code
    units INT DEFAULT 1,
    updated_at BIGINT NOT NULL
);

-- 5. Assignment Products Junction Table
CREATE TABLE IF NOT EXISTS assignment_products (
    assignment_id INT REFERENCES assignments(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, product_id)
);

-- 6. Damages Table (3NF - Removed redundant product_code and product_name columns)
CREATE TABLE IF NOT EXISTS damages (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    "by" VARCHAR(100) NOT NULL,
    notes TEXT,
    updated_at BIGINT NOT NULL
);

-- 7. Repairs Table (3NF - Removed redundant product_code and product_name columns)
CREATE TABLE IF NOT EXISTS repairs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    center VARCHAR(150),
    contact VARCHAR(20),
    taken_by VARCHAR(100),
    date_sent DATE NOT NULL,
    expected_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    completed_date TIMESTAMP,
    notes TEXT,
    updated_at BIGINT NOT NULL
);

-- 8. History Table (Audit log - remains snapshot)
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    action VARCHAR(50) NOT NULL,
    employee VARCHAR(100) DEFAULT '—',
    date TIMESTAMP,
    return_date TIMESTAMP,
    notes TEXT,
    updated_at BIGINT NOT NULL
);
