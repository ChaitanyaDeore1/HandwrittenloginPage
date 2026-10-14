// Sample data for the app. All names are made up; coordinates are rough areas of Pune.
// Test point for the 10 km filter: lat 18.5204, lng 73.8567 (central Pune).
// The last two entries are far away on purpose: they must NOT show up in that test.

const item = (name, price, category) => ({ name, price, category });

module.exports = [
  {
    name: 'Spice Hub', cuisine: 'North Indian', lat: 18.5308, lng: 73.8475,
    menu: [
      item('Paneer Butter Masala', 220, 'Main'),
      item('Dal Tadka', 160, 'Main'),
      item('Butter Naan', 40, 'Breads'),
      item('Jeera Rice', 120, 'Rice'),
      item('Sweet Lassi', 70, 'Drinks'),
    ],
  },
  {
    name: 'Biryani Point', cuisine: 'Biryani', lat: 18.5679, lng: 73.9143,
    menu: [
      item('Chicken Biryani', 260, 'Main'),
      item('Veg Biryani', 190, 'Main'),
      item('Mutton Biryani', 340, 'Main'),
      item('Raita', 40, 'Sides'),
      item('Gulab Jamun', 60, 'Dessert'),
    ],
  },
  {
    name: 'Dosa Corner', cuisine: 'South Indian', lat: 18.5167, lng: 73.8412,
    menu: [
      item('Masala Dosa', 110, 'Dosa'),
      item('Mysore Masala Dosa', 130, 'Dosa'),
      item('Idli Sambar (3 pcs)', 70, 'Breakfast'),
      item('Medu Vada (2 pcs)', 70, 'Breakfast'),
      item('Filter Coffee', 45, 'Drinks'),
    ],
  },
  {
    name: 'Kothrud Kitchen', cuisine: 'Maharashtrian', lat: 18.5074, lng: 73.8077,
    menu: [
      item('Zunka Bhakri', 140, 'Main'),
      item('Varan Bhat', 110, 'Main'),
      item('Batata Vada (2 pcs)', 40, 'Snacks'),
      item('Sabudana Khichdi', 80, 'Snacks'),
      item('Solkadhi', 50, 'Drinks'),
    ],
  },
  {
    name: 'Baner Bites', cuisine: 'Fast Food', lat: 18.5590, lng: 73.7868,
    menu: [
      item('Veg Sandwich', 80, 'Snacks'),
      item('Cheese Grilled Sandwich', 110, 'Snacks'),
      item('French Fries', 90, 'Sides'),
      item('Veg Puff', 35, 'Snacks'),
      item('Cold Coffee', 100, 'Drinks'),
    ],
  },
  {
    name: 'Camp Cafe', cuisine: 'Cafe', lat: 18.5155, lng: 73.8786,
    menu: [
      item('Bun Maska', 50, 'Bakery'),
      item('Chai', 25, 'Drinks'),
      item('Egg Bhurji Pav', 100, 'Breakfast'),
      item('Cappuccino', 120, 'Drinks'),
      item('Brownie', 90, 'Dessert'),
    ],
  },
  {
    name: 'Wok Express', cuisine: 'Chinese', lat: 18.5362, lng: 73.8940,
    menu: [
      item('Veg Hakka Noodles', 150, 'Noodles'),
      item('Chicken Fried Rice', 190, 'Rice'),
      item('Veg Manchurian', 160, 'Starters'),
      item('Chilli Paneer', 200, 'Starters'),
      item('Hot and Sour Soup', 100, 'Soups'),
    ],
  },
  {
    name: 'Tandoor Tales', cuisine: 'Tandoor', lat: 18.5463, lng: 73.9033,
    menu: [
      item('Paneer Tikka', 240, 'Starters'),
      item('Chicken Tikka', 270, 'Starters'),
      item('Tandoori Roti', 20, 'Breads'),
      item('Butter Chicken', 310, 'Main'),
      item('Masala Chaas', 40, 'Drinks'),
    ],
  },
  {
    name: 'Pav Bhaji House', cuisine: 'Street Food', lat: 18.5018, lng: 73.8636,
    menu: [
      item('Pav Bhaji', 130, 'Main'),
      item('Cheese Pav Bhaji', 170, 'Main'),
      item('Extra Pav (2 pcs)', 20, 'Sides'),
      item('Masala Pav', 90, 'Snacks'),
      item('Thums Up 300ml', 30, 'Drinks'),
    ],
  },
  {
    name: 'Misal Junction', cuisine: 'Maharashtrian', lat: 18.5089, lng: 73.9259,
    menu: [
      item('Kolhapuri Misal', 120, 'Main'),
      item('Puneri Misal', 110, 'Main'),
      item('Extra Pav (2 pcs)', 20, 'Sides'),
      item('Kanda Bhaji', 60, 'Snacks'),
      item('Buttermilk', 30, 'Drinks'),
    ],
  },
  {
    name: 'Pizza Oven', cuisine: 'Pizza', lat: 18.5580, lng: 73.8075,
    menu: [
      item('Margherita Pizza', 220, 'Pizza'),
      item('Farmhouse Pizza', 320, 'Pizza'),
      item('Garlic Bread', 120, 'Sides'),
      item('Pasta Arrabbiata', 210, 'Pasta'),
      item('Choco Lava Cake', 90, 'Dessert'),
    ],
  },
  {
    name: 'Burger Barn', cuisine: 'Burgers', lat: 18.4896, lng: 73.8206,
    menu: [
      item('Aloo Tikki Burger', 90, 'Burgers'),
      item('Cheese Burger', 140, 'Burgers'),
      item('Chicken Burger', 170, 'Burgers'),
      item('Peri Peri Fries', 110, 'Sides'),
      item('Oreo Shake', 130, 'Drinks'),
    ],
  },
  {
    name: 'Thali Ghar', cuisine: 'Thali', lat: 18.5120, lng: 73.8330,
    menu: [
      item('Veg Thali', 180, 'Thali'),
      item('Special Thali', 240, 'Thali'),
      item('Puran Poli', 60, 'Dessert'),
      item('Shrikhand', 70, 'Dessert'),
      item('Aamras', 80, 'Dessert'),
    ],
  },
  {
    name: 'Kathi Roll Co.', cuisine: 'Rolls', lat: 18.5285, lng: 73.8744,
    menu: [
      item('Paneer Kathi Roll', 140, 'Rolls'),
      item('Egg Roll', 110, 'Rolls'),
      item('Chicken Kathi Roll', 160, 'Rolls'),
      item('Mutton Seekh Roll', 200, 'Rolls'),
      item('Lemon Soda', 40, 'Drinks'),
    ],
  },
  {
    name: 'Sweet Tooth Mithai', cuisine: 'Sweets', lat: 18.5204, lng: 73.8567,
    menu: [
      item('Kaju Katli (250 g)', 280, 'Sweets'),
      item('Jalebi (250 g)', 90, 'Sweets'),
      item('Rasgulla (4 pcs)', 100, 'Sweets'),
      item('Samosa (2 pcs)', 40, 'Snacks'),
      item('Kachori (2 pcs)', 40, 'Snacks'),
    ],
  },
  {
    name: 'Healthy Bowl', cuisine: 'Healthy', lat: 18.5530, lng: 73.8250,
    menu: [
      item('Quinoa Salad Bowl', 240, 'Bowls'),
      item('Paneer Protein Bowl', 280, 'Bowls'),
      item('Sprouts Chaat', 120, 'Snacks'),
      item('Fruit Bowl', 130, 'Snacks'),
      item('Green Smoothie', 150, 'Drinks'),
    ],
  },
  {
    name: 'Idli Express', cuisine: 'South Indian', lat: 18.5330, lng: 73.8700,
    menu: [
      item('Idli (4 pcs)', 80, 'Breakfast'),
      item('Ghee Podi Idli', 110, 'Breakfast'),
      item('Uttapam', 110, 'Breakfast'),
      item('Curd Rice', 90, 'Rice'),
      item('Filter Coffee', 45, 'Drinks'),
    ],
  },
  {
    name: 'Chaat Gali', cuisine: 'Street Food', lat: 18.5130, lng: 73.8520,
    menu: [
      item('Pani Puri (6 pcs)', 50, 'Chaat'),
      item('Bhel Puri', 60, 'Chaat'),
      item('Sev Puri', 70, 'Chaat'),
      item('Dahi Puri', 80, 'Chaat'),
      item('Ragda Pattice', 90, 'Chaat'),
    ],
  },
  {
    name: 'Kebab Station', cuisine: 'Mughlai', lat: 18.5520, lng: 73.8780,
    menu: [
      item('Chicken Seekh Kebab', 230, 'Starters'),
      item('Mutton Galouti', 290, 'Starters'),
      item('Chicken Korma', 280, 'Main'),
      item('Rumali Roti', 30, 'Breads'),
      item('Phirni', 80, 'Dessert'),
    ],
  },
  {
    name: 'Coffee and Cake', cuisine: 'Cafe', lat: 18.5390, lng: 73.8830,
    menu: [
      item('Cold Brew', 150, 'Drinks'),
      item('Latte', 140, 'Drinks'),
      item('Blueberry Cheesecake', 180, 'Dessert'),
      item('Chocolate Truffle Slice', 160, 'Dessert'),
      item('Cheese Croissant', 120, 'Bakery'),
    ],
  },
  {
    name: 'Fresh Basket', cuisine: 'Grocery', lat: 18.5180, lng: 73.8500,
    menu: [
      item('Milk 1 L', 62, 'Grocery'),
      item('Bread (400 g)', 45, 'Grocery'),
      item('Eggs (12 pcs)', 96, 'Grocery'),
      item('Tomatoes 1 kg', 40, 'Grocery'),
      item('Onions 1 kg', 35, 'Grocery'),
    ],
  },
  {
    name: 'Daily Needs Mart', cuisine: 'Grocery', lat: 18.5300, lng: 73.8350,
    menu: [
      item('Basmati Rice 1 kg', 110, 'Grocery'),
      item('Atta 5 kg', 260, 'Grocery'),
      item('Toor Dal 1 kg', 150, 'Grocery'),
      item('Cooking Oil 1 L', 160, 'Grocery'),
      item('Tea Powder 250 g', 130, 'Grocery'),
    ],
  },

  // ---- far away on purpose: used to test that the 10 km filter works ----
  {
    name: 'Hill View Dhaba', cuisine: 'Dhaba', lat: 18.7481, lng: 73.4072,   // Lonavala side
    menu: [
      item('Dal Fry', 150, 'Main'),
      item('Tandoori Roti', 20, 'Breads'),
      item('Chicken Handi', 320, 'Main'),
    ],
  },
  {
    name: 'Godavari Food Court', cuisine: 'Maharashtrian', lat: 19.9975, lng: 73.7898,   // Nashik side
    menu: [
      item('Sabudana Vada', 60, 'Snacks'),
      item('Nashik Misal', 120, 'Main'),
      item('Thalipeeth', 90, 'Main'),
    ],
  },
];