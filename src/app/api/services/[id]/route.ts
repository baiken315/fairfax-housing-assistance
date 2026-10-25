import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { throttleWrites } from '@/lib/rateLimit';
import { parseId, readJsonBody, validateService } from '@/lib/validation';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const limited = throttleWrites(request);
    if (limited) return limited;

    const id = parseId((await params).id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid service id' }, { status: 400 });
    }

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
    const limited = throttleWrites(request);
    if (limited) return limited;

    const id = parseId((await params).id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid service id' }, { status: 400 });
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
