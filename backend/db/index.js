const { Pool } = require('pg');
require('dotenv').config(); // To load DATABASE_URL from .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: SSL configuration if your PostgreSQL server requires it
  // ssl: {
  //   rejectUnauthorized: false // Only for development/testing if using self-signed certificates
  // }
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Exporting the pool itself if needed for transactions etc.
};
