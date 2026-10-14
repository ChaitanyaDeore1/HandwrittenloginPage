const { DatabaseSync } = require('node:sqlite');
const seedData = require('./seed-data.js');

const db = new DatabaseSync('food.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cuisine TEXT,
    lat REAL,
    lng REAL,
    is_open INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT,
    price INTEGER,
    category TEXT
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

// Fill the sample data only when the restaurants table is empty
const count = db.prepare('SELECT COUNT(*) AS c FROM restaurants').get().c;

if (count === 0) {
  const addRestaurant = db.prepare(
    'INSERT INTO restaurants (name, cuisine, lat, lng) VALUES (?, ?, ?, ?)'
  );
  const addItem = db.prepare(
    'INSERT INTO menu_items (restaurant_id, name, price, category) VALUES (?, ?, ?, ?)'
  );

  for (const r of seedData) {
    // the id the database gave this restaurant links its menu items to it
    const restaurantId = addRestaurant.run(r.name, r.cuisine, r.lat, r.lng).lastInsertRowid;
    for (const m of r.menu) {
      addItem.run(restaurantId, m.name, m.price, m.category);
    }
  }
}

module.exports = db;