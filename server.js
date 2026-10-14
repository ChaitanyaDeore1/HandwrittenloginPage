const express = require('express');
const db = require('./db.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const otpLimiter=rateLimit({
    windowsMs:10*1000,
    limit:3,
    message:{
        error: 'Too many OTP requests . Try again in a minute',
    },
   standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.get('/debug-file', (req, res) => {
  res.json({
    directory: __dirname,
    filePath: path.join(__dirname, 'public', 'index.html'),
    exists: require('fs').existsSync(
      path.join(__dirname, 'public', 'index.html')
    )
  });
});
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

app.post('/send-otp',otpLimiter,(req, res) => {
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

  // 1. get what we stored for this phone
  const row = db.prepare('SELECT * FROM otps WHERE phone = ?').get(phone);

  // 2. nothing stored, expired, or too many tries -> reject
  if (!row || row.expires_at < Date.now() || row.attempts >= 5) {
    return res.status(400).json({ error: 'OTP expired or too many attempts' });
  }

  // 3. compare typed otp with stored hash
  if (sha(String(otp)) !== row.otp_hash) {
    db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE phone = ?').run(phone);
    return res.status(400).json({ error: 'Wrong OTP' });
  }

  // 4. correct: use up the otp
  db.prepare('DELETE FROM otps WHERE phone = ?').run(phone);

  // 5. create the user if new, then fetch the user
  db.prepare('INSERT OR IGNORE INTO users (phone) VALUES (?)').run(phone);
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

  // 6. give a token that lasts 30 days
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token });
});

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

app.get('/me', auth, (req, res) => {
  res.json(req.user);
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});