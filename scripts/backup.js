const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function backup() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in .env.local');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const columns = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'services'
       ORDER BY ordinal_position`
    );
    const rows = await pool.query('SELECT * FROM services ORDER BY id');

    const dir = path.join(__dirname, '..', 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const file = path.join(dir, `services-${stamp}.json`);

    fs.writeFileSync(
      file,
      JSON.stringify(
        { exported_at: new Date().toISOString(), table: 'services', columns: columns.rows, rows: rows.rows },
        null,
        2
      )
    );
    console.log(`Backed up ${rows.rows.length} rows to ${file}`);
  } catch (err) {
    console.error('Backup failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

backup();
