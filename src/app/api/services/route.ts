import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServices } from '@/lib/db';
import { throttleWrites } from '@/lib/rateLimit';
import { readJsonBody, validateService } from '@/lib/validation';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const limited = throttleWrites(request);
    if (limited) return limited;

    const validated = validateService(await readJsonBody(request));
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    const { title, organization, description, categories, phone, email, website } = validated.data;

    if (!process.env.DATABASE_URL) {
       return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO services (title, organization, description, categories, phone, email, website) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, organization, description, categories, phone, email, website]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}


