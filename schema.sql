-- Safe to run repeatedly: creates the table only if it does not exist and
-- never drops or alters existing data.
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
