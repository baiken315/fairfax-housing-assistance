import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const { title, organization, description, categories, phone, email, website } = body;

    // Validation similar to POST
    if (!title || !organization || !description || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!phone && !email && !website) {
      return NextResponse.json(
        { error: 'At least one contact method is required' },
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
        `UPDATE services 
         SET title = $1, 
             organization = $2, 
             description = $3, 
             categories = $4, 
             phone = $5, 
             email = $6, 
             website = $7
         WHERE id = $8
         RETURNING *`,
        [title, organization, description, categories, phone, email, website, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!process.env.DATABASE_URL) {
       return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM services WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: 'Service deleted successfully' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
