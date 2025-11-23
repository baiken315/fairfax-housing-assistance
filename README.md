# Fairfax Housing Helper

A simple, responsive, and elegant front end for viewing and submitting housing assistance services, styled to match the Fairfax County Services Finder.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon DB recommended)
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   - Create a Postgres database (e.g., on Neon).
   - Run the SQL commands in `schema.sql` to create the `services` table.

3. **Configure Environment:**
   - Create a `.env.local` file in the root directory.
   - Add your database connection string:
     ```env
     DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features
- **View Services**: Publicly accessible list of housing services.
- **Submit Service**: Form to submit new services.
- **Dark Mode**: Fully responsive dark mode support using `next-themes`.
- **Mock Data**: If `DATABASE_URL` is not set, the app falls back to mock data for viewing services (submission requires DB).

## Styling
Follows the Fairfax County Services Finder visual identity:
- Primary Blue: `#1a73e8`
- Dark Mode Background: `#0b2540`
- Font: Inter
