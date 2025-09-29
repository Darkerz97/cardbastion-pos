const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

console.log('✅ Iniciando Electron...');

const dbPath = path.join(app.getPath('userData'), 'cardbastion.sqlite');
let db = null;

function initDatabase() {
  console.log('📍 Ruta DB:', dbPath);

  const needInit = !fs.existsSync(dbPath);
  db = new Database(dbPath);
  if (needInit) {
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    db.exec(schema);
    console.log('✅ Base de datos creada');
  } else {
    console.log('📦 Base de datos existente cargada');
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setTimeout(() => {
    win.loadURL('http://localhost:5173');
  }, 500);
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

ipcMain.handle('db:findProductBySku', (event, sku) => {
  console.log('🔍 SKU buscado:', sku);

  const cleanSku = sku.trim().toLowerCase();
console.log('🔍 SKU buscado limpio:', JSON.stringify(cleanSku));

const stmt = db.prepare('SELECT * FROM products WHERE lower(trim(sku)) = ? LIMIT 1');
const product = stmt.get(cleanSku);

  console.log('📦 Resultado:', product);

  return product;
});
  ipcMain.handle('db:createSale', (event, { items, total, customer }) => {
    try {
      const insertSale = db.prepare('INSERT INTO sales (total, customer_id, status) VALUES (?, ?, ?)');
      const saleInfo = insertSale.run(total, customer?.id ?? null, 'pending');
      const saleId = saleInfo.lastInsertRowid;

      const insertItem = db.prepare(
        'INSERT INTO sale_items (sale_id, product_id, sku, name, quantity, unit_price, subtotal) VALUES (?,?,?,?,?,?,?)'
      );
      const trans = db.transaction((rows) => {
        for (const it of rows) {
          insertItem.run(saleId, it.product_id || null, it.sku, it.name, it.quantity, it.unit_price, it.subtotal);
          if (it.product_id) {
            db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(it.quantity, it.product_id);
          }
        }
      });

      trans(items);
      return { ok: true, saleId };
    } catch (err) {
      console.error('❌ Error al crear la venta:', err);
      return { ok: false, error: err.message };
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});
