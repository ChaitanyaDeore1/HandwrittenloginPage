const express = require('express');
const db = require('./db.js');

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{

    res.send('server is running');

});

app.get('/restaurants',(req,res)=>{
    const restaurants = db.prepare('SELECT * FROM restaurants').all();
    res.json(restaurants);
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});