// user-service/db.js
const { Pool } = require('pg');
const path = require('path');

// Load .env from the backend root directory (up 2 levels from db/)
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Support both connection string (production) and individual params (development)
const connectionString = process.env.DATABASE_URL;

let pool;

if (connectionString) {
  console.log('🔗 Attempting to connect to Supabase using DATABASE_URL...');
  console.log('🔗 Connection string starts with:', connectionString.substring(0, 50) + '...');
  
  pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // 10 second timeout
  });
} else {
  console.log('🏠 Using local PostgreSQL connection (DATABASE_URL not set)...');
  pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'disasteraiddb',
    password: process.env.PGPASSWORD || 'xxxx',
    port: process.env.PGPORT || 5432,
  });
}

pool.on('connect', () => {
  console.log('✅ Successfully connected to PostgreSQL database!');
  // Log which database we're connected to
  pool.query('SELECT current_database(), inet_server_addr(), inet_server_port()', (err, res) => {
    if (!err && res.rows[0]) {
      console.log('📊 Database Name:', res.rows[0].current_database);
      console.log('🌐 Server Address:', res.rows[0].inet_server_addr || 'localhost');
      console.log('🔌 Server Port:', res.rows[0].inet_server_port);
    }
  });
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
  console.error('Full error:', err);
});

module.exports = pool;