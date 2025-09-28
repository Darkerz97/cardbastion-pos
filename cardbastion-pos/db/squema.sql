-- products: reflejará tu tabla products en Laravel
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,       -- usar el mismo id que el servidor si fue sincronizado
  sku TEXT UNIQUE,
  name TEXT,
  price REAL,
  stock INTEGER,
  updated_at TEXT
);

-- customers: opcional
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT
);

-- sales: cabecera de venta
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER,            -- id remoto si ya fue sincronizada
  total REAL,
  customer_id INTEGER,
  status TEXT DEFAULT 'pending',-- 'pending' | 'synced'
  created_at TEXT DEFAULT (datetime('now')),
  synced_at TEXT
);

-- sale_items: filas de la venta
CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER,
  product_id INTEGER,
  sku TEXT,
  name TEXT,
  quantity INTEGER,
  unit_price REAL,
  subtotal REAL,
  FOREIGN KEY(sale_id) REFERENCES sales(id)
);

-- sync_log opcional
CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
