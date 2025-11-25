const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function seed() {
  // 1. Check for Database URL
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in .env.local');
    process.exit(1);
  }

  // 2. Read JSON Data
  const dataPath = path.join(__dirname, 'services_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: Could not find data file at ${dataPath}`);
    process.exit(1);
  }

  let services = [];
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    services = JSON.parse(rawData);
  } catch (err) {
    console.error('Error parsing JSON file:', err);
    process.exit(1);
  }

  console.log(`Found ${services.length} services to seed.`);

  // 3. Connect to Database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let insertedCount = 0;
    
    for (const service of services) {
      // Validation: minimal check
      if (!service.title || !service.organization || !service.categories) {
        console.warn(`Skipping service "${service.title || 'Unknown'}": Missing required fields.`);
        continue;
      }

      // Insert query
      // Note: categories is passed as a text[] array.
      // We check if contact info exists, defaulting to null if not.
      const query = `
        INSERT INTO services (
          title, 
          organization, 
          description, 
          categories, 
          phone, 
          email, 
          website,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id
      `;

      const values = [
        service.title,
        service.organization,
        service.description || '',
        service.categories,
        service.phone || null,
        service.email || null,
        service.website || null
      ];

      await client.query(query, values);
      insertedCount++;
    }

    await client.query('COMMIT');
    console.log(`Success! seeded ${insertedCount} services.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed. Rolled back changes.');
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
