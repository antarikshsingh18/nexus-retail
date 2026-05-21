const { Pool } = require('pg');
require('dotenv').config();

// The Pool manages a cache of database connections so we don't drop connections on heavy traffic
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for secure cloud database connections
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};