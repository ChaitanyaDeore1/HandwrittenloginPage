const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('food.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    lat REAL,
    lng REAL
  );
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT,
    price INTEGER
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE
  );
  CREATE TABLE IF NOT EXISTS otps (
    phone TEXT PRIMARY KEY,
    otp_hash TEXT,
    expires_at INTEGER,
    attempts INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    restaurant_id INTEGER,
    total INTEGER,
    status TEXT DEFAULT 'placed'
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    menu_item_id INTEGER,
    qty INTEGER,
    price_at_order INTEGER
  );
`);

const count = db.prepare('SELECT COUNT(*) AS c FROM restaurants').get().c;

if (count === 0) {
  const r1 = db.prepare('INSERT INTO restaurants (name, lat, lng) VALUES (?, ?, ?)')
    .run('Spice Hub', 18.5308, 73.8475).lastInsertRowid;

  db.prepare('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)')
    .run(r1, 'Paneer Butter Masala', 220);
  db.prepare('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)')
    .run(r1, 'Butter Naan', 40);
}

module.exports = db;