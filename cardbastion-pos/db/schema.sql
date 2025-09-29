CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT,
  price REAL,
  stock INTEGER,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY,
  total REAL,
  customer_id INTEGER,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  server_id INTEGER
);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY,
  sale_id INTEGER,
  product_id INTEGER,
  sku TEXT,
  name TEXT,
  quantity INTEGER,
  unit_price REAL,
  subtotal REAL
);
