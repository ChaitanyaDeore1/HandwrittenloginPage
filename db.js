const express = require('express');
const db = require('./db.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const MAX_KM = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Haversine: distance in km between two lat/lng points
function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// checks the token before a protected route runs
function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Please login' });
  }
}

app.get('/', (req, res) => {
  res.send('server is running');
});

app.get('/restaurants', (req, res) => {
  const restaurants = db.prepare('SELECT * FROM restaurants').all();
  res.json(restaurants);
});

// must stay ABOVE '/restaurants/:id/menu'
app.get('/restaurants/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'lat and lng are required numbers' });
  }

  const nearby = db.prepare('SELECT * FROM restaurants').all()
    .map((r) => ({ ...r, distance_km: +distanceKm(lat, lng, r.lat, r.lng).toFixed(2) }))
    .filter((r) => r.distance_km <= MAX_KM)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json(nearby);
});

app.get('/restaurants/:id/menu', (req, res) => {
  const id = req.params.id;

  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const items = db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ?').all(id);
  res.json(items);
});

app.post('/send-otp', (req, res) => {
  const phone = req.body.phone;

  if (!/^\d{10}$/.test(phone || '')) {
    return res.status(400).json({ error: 'Enter a 10 digit phone number' });
  }

  const otp = String(crypto.randomInt(100000, 1000000)); // 6 digits
  const expires_at = Date.now() + 5 * 60 * 1000;         // 5 minutes

  db.prepare('INSERT OR REPLACE INTO otps (phone, otp_hash, expires_at, attempts) VALUES (?, ?, ?, 0)')
    .run(phone, sha(otp), expires_at);

  console.log(`OTP for ${phone}: ${otp}`); // real SMS goes here later
  res.json({ message: 'OTP sent' });
});

app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  const row = db.prepare('SELECT * FROM otps WHERE phone = ?').get(phone);

  if (!row || row.expires_at < Date.now() || row.attempts >= 5) {
    return res.status(400).json({ error: 'OTP expired or too many attempts' });
  }

  if (sha(String(otp)) !== row.otp_hash) {
    db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE phone = ?').run(phone);
    return res.status(400).json({ error: 'Wrong OTP' });
  }

  db.prepare('DELETE FROM otps WHERE phone = ?').run(phone);

  db.prepare('INSERT OR IGNORE INTO users (phone) VALUES (?)').run(phone);
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token });
});

app.get('/me', auth, (req, res) => {
  res.json(req.user);
});

app.post('/orders', auth, (req, res) => {
  const { restaurant_id, items } = req.body;

  // 1. basic input check
  if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'restaurant_id and items are required' });
  }

  // 2. check every item, and calculate the total from DB prices
  let total = 0;
  const lines = [];
  for (const item of items) {
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'qty must be a whole number, at least 1' });
    }

    const menuItem = db
      .prepare('SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ?')
      .get(item.menu_item_id, restaurant_id);
    if (!menuItem) {
      return res.status(400).json({ error: `Item ${item.menu_item_id} not found in this restaurant` });
    }

    total += menuItem.price * qty;
    lines.push({ menu_item_id: menuItem.id, qty, price: menuItem.price });
  }

  // 3. everything is valid, now save the order
  const orderId = db
    .prepare('INSERT INTO orders (user_id, restaurant_id, total) VALUES (?, ?, ?)')
    .run(req.user.id, restaurant_id, total).lastInsertRowid;

  // 4. save each line
  for (const line of lines) {
    db.prepare('INSERT INTO order_items (order_id, menu_item_id, qty, price_at_order) VALUES (?, ?, ?, ?)')
      .run(orderId, line.menu_item_id, line.qty, line.price);
  }

  // 5. reply
  res.status(201).json({ order_id: orderId, total });
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});