const { Pool } = require('pg');
require('dotenv').config();

// 🚀 Production-Grade Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

pool.on('connect', () => {
  console.log('✅ Connected to Cloud PostgreSQL successfully!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};