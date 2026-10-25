// One-time cleanup: prefix https:// on saved websites that have no scheme.
// Usage: node scripts/normalize_websites.js          (dry run)
//        node scripts/normalize_websites.js --apply  (write changes)
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in .env.local');
    process.exit(1);
  }
  const apply = process.argv.includes('--apply');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { rows } = await pool.query(
      `SELECT id, website FROM services
       WHERE website IS NOT NULL AND btrim(website) <> '' AND website !~* '^\\s*https?://'
       ORDER BY id`
    );
    for (const r of rows) {
      console.log(`${r.id}: ${JSON.stringify(r.website)} -> https://${r.website.trim()}`);
    }
    console.log(`${rows.length} row(s) ${apply ? 'updating' : 'would change (dry run)'}`);

    if (apply && rows.length) {
      const res = await pool.query(
        `UPDATE services SET website = 'https://' || btrim(website)
         WHERE website IS NOT NULL AND btrim(website) <> '' AND website !~* '^\\s*https?://'`
      );
      console.log(`Updated ${res.rowCount} row(s).`);
    }
  } catch (err) {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
