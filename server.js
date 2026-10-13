const express = require('express');
const db = require('./db.js');

const app = express();
app.use(express.json());

const MAX_KM = 10;

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

app.get('/', (req, res) => {
  res.send('server is running');
});

app.get('/restaurants', (req, res) => {
  const restaurants = db.prepare('SELECT * FROM restaurants').all();
  res.json(restaurants);
});

// must stay ABOVE '/restaurants/:id/menu'
app.get('/restaurants/nearby', (req, res) => {
  // 1. read lat, lng and convert to numbers
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  // 2. bad input -> 400
  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'lat and lng are required numbers' });
  }

  // 3-6. get all, add distance, keep within 10 km, nearest first
  const nearby = db.prepare('SELECT * FROM restaurants').all()
    .map((r) => ({ ...r, distance_km: +distanceKm(lat, lng, r.lat, r.lng).toFixed(2) }))
    .filter((r) => r.distance_km <= MAX_KM)
    .sort((a, b) => a.distance_km - b.distance_km);

  // 7. send
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

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});