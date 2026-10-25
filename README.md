# Fairfax Housing Helper

A simple front end for viewing and submitting housing assistance services tailored for the Northern Virginia and Fairfax County Areas.

This is an independent community project. It is not affiliated with or endorsed by Fairfax County.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon DB recommended)
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env.local` file in the root directory (it is gitignored; never commit it).
   - Add your database connection string:
     ```env
     DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
     ```

3. **Set up the database:**
   - Create a Postgres database (e.g., on Neon).
   - Create the `services` table:
     ```bash
     npm run db:migrate
     ```
     This applies [schema.sql](schema.sql). It is idempotent (`CREATE TABLE IF NOT EXISTS`) and never drops or modifies existing data.
   - Optional: load starter data from `scripts/services_data.json` with `node scripts/seed_services.js`.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features
- **Browse & Search**: Publicly accessible list of housing services with text search and category filtering.
- **Grid / List Views**: Toggle between card grid and compact list.
- **Submit, Edit & Delete**: Anyone can add a service, and edit or delete one from its detail view (community moderated).
- **Print View**: Print-optimized layout of the current results.
- **Dark Mode**: Fully responsive dark mode support using `next-themes`.
- **Mock Data**: If `DATABASE_URL` is not set, the app falls back to mock data for viewing services (submission requires DB).

## Data Safety & Abuse Limits
- There is **no authentication**. Edits and deletes are open by design, so the limits below exist to cap damage.
- **Throttling**: write requests (POST/PATCH/DELETE) are limited to 10 per 10 minutes per IP and 100 per hour site-wide. The counters are in memory per server instance, so on serverless hosts this is best-effort.
- **Validation** (see [src/lib/validation.ts](src/lib/validation.ts)): length limits on all fields, categories restricted to the known list, phone/email format checks, and websites restricted to `http(s)` (a missing scheme is filled in as `https://`).
- **Backups**: `node scripts/backup.js` exports the `services` table to `backups/services-YYYY-MM-DD.json` (gitignored).

## Scripts
| Script | Purpose |
| --- | --- |
| `npm run db:migrate` | Create the `services` table if missing (non-destructive) |
| `scripts/seed_services.js` | Insert starter services from `services_data.json` |
| `scripts/backup.js` | Export the table to a local JSON file |
| `scripts/migrate_to_arrays.js` | Legacy: convert an old single `category` column to the `categories` array (not needed for new databases) |
| `scripts/normalize_websites.js` | One-time cleanup: add `https://` to saved websites missing a scheme (dry run unless `--apply`) |

## Styling
Uses a custom blue palette:
- Primary Blue: `#1a73e8`
- Dark Mode Background: `#0b2540`
- Font: Inter
