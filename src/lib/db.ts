import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export default pool;

export type Service = {
  id: number;
  title: string;
  organization: string;
  description: string;
  categories: string[];
  phone?: string;
  email?: string;
  website?: string;
  created_at: Date;
};

export async function getServices(search?: string, category?: string): Promise<Service[]> {
  if (!process.env.DATABASE_URL) {
    const mockData: Service[] = [
      {
        id: 1,
        title: "Free Home Repair Services",
        organization: "Community Fix-It Corp",
        description: "We provide free minor home repairs for seniors and low-income families, focusing on safety and accessibility improvements.",
        categories: ["Home Repairs"],
        phone: "555-0123",
        email: "help@fixit.org",
        website: "https://fixit.org",
        created_at: new Date()
      },
      {
        id: 2,
        title: "Hoarding Cleanup Assistance",
        organization: "Safe Space Solutions",
        description: "Professional and compassionate hoarding cleanout services. We help reclaim your living space with non-judgmental support.",
        categories: ["Hoarding Cleanout", "Decluttering"],
        phone: "555-0199",
        website: "https://safespace.com",
        created_at: new Date(Date.now() - 86400000)
      },
      {
        id: 3,
        title: "Accessibility Ramp Installation",
        organization: "Access For All",
        description: "Volunteer-led installation of wheelchair ramps for residential homes. Materials provided at no cost for qualifying residents.",
        categories: ["Accessibility Improvements"],
        email: "contact@accessforall.org",
        created_at: new Date(Date.now() - 172800000)
      }
    ];

    return mockData.filter(service => {
      const matchesSearch = !search || 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.organization.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !category || service.categories.includes(category);

      return matchesSearch && matchesCategory;
    });
  }

  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM services WHERE 1=1';
    const params: string[] = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR organization ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category) {
      // Check if the category exists in the categories array
      query += ` AND $${paramCount} = ANY(categories)`;
      params.push(category);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

