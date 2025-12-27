const { Pool } = require('pg');
require('dotenv').config();

// Use the single DATABASE_URL string provided by Render
// If DATABASE_URL is missing, it falls back to your local individual variables
const isProduction = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 🛡️ Required for Render/Cloud Postgres connections
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database successfully!');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};