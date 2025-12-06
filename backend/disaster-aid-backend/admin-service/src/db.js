const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

const pool = connectionString
  ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new Pool({
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      database: process.env.PGDATABASE || process.env.DB_NAME || 'disasteraiddb',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'password',
      port: process.env.PGPORT || process.env.DB_PORT || 5432,
    });

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database (admin-service)');
});

module.exports = pool;
