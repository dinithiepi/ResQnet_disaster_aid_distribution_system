const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config();

const dbDir = path.resolve(__dirname, '..', 'db');

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

const getClient = () => {
  if (connectionString) {
    return new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  // build from individual env vars
  return new Client({
    user: process.env.PGUSER || process.env.DB_USER,
    host: process.env.PGHOST || process.env.DB_HOST,
    database: process.env.PGDATABASE || process.env.DB_NAME,
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
    port: process.env.PGPORT || process.env.DB_PORT,
  });
};

async function runMigrations() {
  if (!fs.existsSync(dbDir)) {
    console.error('DB directory not found:', dbDir);
    process.exit(1);
  }

  const files = fs.readdirSync(dbDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No SQL files to run in', dbDir);
    return;
  }

  const client = getClient();
  await client.connect();
  console.log('Connected to DB for migrations');

  try {
    for (const file of files) {
      const p = path.join(dbDir, file);
      console.log('Applying', file);
      const sql = fs.readFileSync(p, 'utf8');
      if (!sql.trim()) continue;
      await client.query(sql);
      console.log('Applied', file);
    }
    console.log('All migrations applied');
  } catch (err) {
    console.error('Migration error:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runMigrations().catch(err => {
  console.error('Unhandled error running migrations', err);
  process.exit(1);
});
