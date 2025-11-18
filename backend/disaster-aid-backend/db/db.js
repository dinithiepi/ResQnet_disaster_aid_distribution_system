// user-service/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'disasteraiddb',
  password: process.env.PGPASSWORD || 'xxxx',
  port: process.env.PGPORT || 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

module.exports = pool;