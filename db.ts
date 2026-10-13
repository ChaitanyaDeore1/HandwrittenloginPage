const {DatabaseSync}=require('node:sqlite');
const db=new DatabaseSync('fooddb');

db.exec(`
CREATE TABLE IF NOT EXISTS restaurants (
