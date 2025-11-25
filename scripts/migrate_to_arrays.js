const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in .env.local');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Checking current schema...');
    // Check if categories column already exists
    const checkRes = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='services' AND column_name='categories'
    `);

    if (checkRes.rows.length > 0) {
      console.log('Column "categories" already exists. Skipping migration.');
    } else {
      console.log('Migrating "category" text column to "categories" text[]...');
      
      await client.query('BEGIN');

      // 1. Add new column
      await client.query('ALTER TABLE services ADD COLUMN categories TEXT[]');
      
      // 2. Migrate data: turn single category string into single-item array
      await client.query('UPDATE services SET categories = ARRAY[category]');
      
      // 3. Make it not null (optional, but good practice if every service needs a tag)
      await client.query('ALTER TABLE services ALTER COLUMN categories SET NOT NULL');

      // 4. Drop old column
      await client.query('ALTER TABLE services DROP COLUMN category');

      await client.query('COMMIT');
      console.log('Migration successful: "category" converted to "categories" array.');
    }

    client.release();
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
