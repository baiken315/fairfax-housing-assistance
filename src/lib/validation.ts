export const CATEGORIES = [
  "Home Repairs",
  "Hoarding Cleanout",
  "Hazmat Cleaning",
  "Decluttering",
  "Accessibility Improvements",
  "Financial Aid",
  "Food & Supplies",
  "Legal Aid",
  "Medical Support",
  "Other"
];

export const LIMITS = {
  title: 100,
  organization: 100,
  description: 180,
  phone: 30,
  email: 254,
  website: 300,
};

export const MAX_BODY_BYTES = 20_000;

export type ServiceInput = {
  title: string;
  organization: string;
  description: string;
  categories: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
};

type Result = { ok: true; data: ServiceInput } | { ok: false; error: string };

// Returns trimmed string, null if empty/missing, or undefined if not a string.
function optionalString(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return undefined;
  return value.trim() || null;
}

function requiredString(value: unknown, field: keyof typeof LIMITS): string | { error: string } {
  if (typeof value !== 'string' || !value.trim()) {
    return { error: `${field} is required` };
  }
  const trimmed = value.trim();
  if (trimmed.length > LIMITS[field]) {
    return { error: `${field} must be ${LIMITS[field]} characters or fewer` };
  }
  return trimmed;
}

export function validateService(body: unknown): Result {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body' };
  }
  const input = body as Record<string, unknown>;

  const title = requiredString(input.title, 'title');
  if (typeof title !== 'string') return { ok: false, error: title.error };
  const organization = requiredString(input.organization, 'organization');
  if (typeof organization !== 'string') return { ok: false, error: organization.error };
  const description = requiredString(input.description, 'description');
  if (typeof description !== 'string') return { ok: false, error: description.error };

  const { categories } = input;
  if (
    !Array.isArray(categories) ||
    categories.length === 0 ||
    categories.length > CATEGORIES.length ||
    !categories.every((c) => typeof c === 'string' && CATEGORIES.includes(c))
  ) {
    return { ok: false, error: 'categories must be a non-empty list of valid categories' };
  }
  const uniqueCategories = [...new Set(categories as string[])];

  const phone = optionalString(input.phone);
  const email = optionalString(input.email);
  let website = optionalString(input.website);
  if (phone === undefined || email === undefined || website === undefined) {
    return { ok: false, error: 'phone, email, and website must be text' };
  }

  if (phone) {
    if (phone.length > LIMITS.phone || !/^[0-9+().\-–—\sxXext,#]+$/.test(phone) || !/\d{7}/.test(phone.replace(/\D/g, ''))) {
      return { ok: false, error: 'phone is not a valid phone number' };
    }
  }

  if (email) {
    if (email.length > LIMITS.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      return { ok: false, error: 'email is not a valid email address' };
    }
  }

  if (website) {
    if (website.length > LIMITS.website || /\s/.test(website)) {
      return { ok: false, error: `website must be a URL of ${LIMITS.website} characters or fewer` };
    }
    // Allow scheme-less input (e.g. "www.example.org"); reject any non-http(s) scheme.
    if (!/^https?:\/\//i.test(website)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(website) && !/^[^/]*:\d+(\/|$)/.test(website)) {
        return { ok: false, error: 'website must start with http:// or https://' };
      }
      website = `https://${website}`;
    }
    try {
      const url = new URL(website);
      if (!url.hostname.includes('.')) throw new Error('no TLD');
    } catch {
      return { ok: false, error: 'website is not a valid URL' };
    }
  }

  if (!phone && !email && !website) {
    return { ok: false, error: 'At least one contact method (phone, email, or website) is required' };
  }

  return {
    ok: true,
    data: { title, organization, description, categories: uniqueCategories, phone, email, website },
  };
}

// Parses a JSON body, rejecting oversized or malformed payloads (returns undefined).
export async function readJsonBody(request: Request): Promise<unknown | undefined> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return undefined;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

// Services are keyed by SERIAL (int4).
export function parseId(raw: string): number | null {
  if (!/^\d{1,9}$/.test(raw)) return null;
  const id = Number(raw);
  return id > 0 ? id : null;
}
