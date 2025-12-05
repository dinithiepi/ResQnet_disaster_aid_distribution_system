// user-service/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'postgres.railway.internal',
  database: process.env.PGDATABASE || 'railway',
  password: process.env.PGPASSWORD || 'ipkonCFWFmnviyjFyMJbkNmKjHJIfmZw',
  port: process.env.PGPORT || 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

module.exports = pool;