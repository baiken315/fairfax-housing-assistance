import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServices } from '@/lib/db';

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
    const body = await request.json();
    const { title, organization, description, categories, phone, email, website } = body;

    if (!title || !organization || !description || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, organization, description, categories (must be non-empty array)' },
        { status: 400 }
      );
    }

    if (!phone && !email && !website) {
      return NextResponse.json(
        { error: 'At least one contact method (phone, email, or website) is required' },
        { status: 400 }
      );
    }

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


