-- Create Database
CREATE DATABASE IF NOT EXISTS gadgetims;
USE gadgetims;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  unit_price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  reorder_level INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Daily Sales Table
CREATE TABLE IF NOT EXISTS daily_sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sale_date DATE NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale Items Table (Items within each daily sale)
CREATE TABLE IF NOT EXISTS sale_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sale_id INT NOT NULL,
  product_id INT,
  model_name VARCHAR(255),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES daily_sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  purchase_date DATE NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Purchase Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Products
INSERT INTO products (name, sku, category, unit_price, stock, reorder_level) VALUES
('Wireless Headphones', 'WH-001', 'Audio', 149.99, 45, 10),
('USB-C Cable', 'USB-001', 'Cables', 9.99, 120, 50),
('Laptop Stand', 'LS-001', 'Accessories', 89.99, 30, 5),
('Mechanical Keyboard', 'MK-001', 'Input Devices', 129.99, 25, 8),
('USB Hub', 'HUB-001', 'Adapters', 49.99, 3, 20),
('HDMI Cable', 'HDMI-001', 'Cables', 15.99, 5, 30),
('Phone Case', 'PC-001', 'Accessories', 19.99, 8, 20),
('Screen Protector', 'SP-001', 'Accessories', 9.99, 10, 25),
('Power Bank', 'PB-001', 'Electronics', 39.99, 15, 10),
('Monitor Stand', 'MS-001', 'Accessories', 79.99, 12, 5);

-- Insert Sample Customers
INSERT INTO customers (name, email, phone, city) VALUES
('John Smith', 'john@example.com', '555-0101', 'New York'),
('Jane Doe', 'jane@example.com', '555-0102', 'Los Angeles'),
('Bob Johnson', 'bob@example.com', '555-0103', 'Chicago');

-- Insert Sample Suppliers
INSERT INTO suppliers (name, email, phone, city) VALUES
('Tech Supplies Co', 'supply@techco.com', '555-1001', 'Houston'),
('Global Electronics', 'sales@globelec.com', '555-1002', 'Dallas'),
('Premium Gadgets Ltd', 'info@premiumgadgets.com', '555-1003', 'Miami');
