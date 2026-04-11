/**
 * Functional tests against the live Crossroads Sober Living website.
 *
 * BASE_URL defaults to https://crossroads-soberliving.com
 * Supabase smoke tests run only when NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
 */

const BASE_URL = process.env.BASE_URL ?? 'https://crossroads-soberliving.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function get(path: string): Promise<Response> {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': 'crossroads-functional-tests/1.0' },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'crossroads-functional-tests/1.0',
    },
    body: JSON.stringify(body),
  });
}

async function getText(path: string): Promise<string> {
  const res = await get(path);
  return res.text();
}

// ---------------------------------------------------------------------------
// Public page availability
// ---------------------------------------------------------------------------

describe('Public pages return 200', () => {
  const publicPages = ['/', '/about', '/program', '/contact', '/contract'];

  for (const page of publicPages) {
    test(`GET ${page} → 200`, async () => {
      const res = await get(page);
      expect(res.status).toBe(200);
    });
  }
});

// ---------------------------------------------------------------------------
// Home page content
// ---------------------------------------------------------------------------

describe('Home page content', () => {
  let html: string;

  beforeAll(async () => {
    html = await getText('/');
  });

  test('contains "Crossroads Sober Living"', () => {
    expect(html).toMatch(/Crossroads Sober Living/i);
  });

  test('contains recovery language', () => {
    expect(html).toMatch(/recover(y|ing)|sober(ness|iety)?|sobriety/i);
  });

  test('contains Minnesota 507 phone area code', () => {
    expect(html).toMatch(/507/);
  });

  test('contains joe@crossroads-soberliving.com email', () => {
    expect(html).toMatch(/joe@crossroads-soberliving\.com/i);
  });

  test('has nav link to /about', () => {
    expect(html).toMatch(/href=["']\/about["']/i);
  });

  test('has nav link to /program', () => {
    expect(html).toMatch(/href=["']\/program["']/i);
  });

  test('has nav link to /contact', () => {
    expect(html).toMatch(/href=["']\/contact["']/i);
  });

  test('has nav link to /contract', () => {
    expect(html).toMatch(/href=["']\/contract["']/i);
  });
});

// ---------------------------------------------------------------------------
// Program page content
// ---------------------------------------------------------------------------

describe('Program page content', () => {
  let html: string;

  beforeAll(async () => {
    html = await getText('/program');
  });

  test('mentions employment', () => {
    expect(html).toMatch(/employ(ment|ed|er)/i);
  });

  test('mentions MAT / medication-assisted treatment', () => {
    expect(html).toMatch(/MAT|medication.assisted|medication assisted/i);
  });

  test('mentions community', () => {
    expect(html).toMatch(/communit(y|ies)/i);
  });

  test('mentions housing', () => {
    expect(html).toMatch(/hous(ing|e|es)/i);
  });
});

// ---------------------------------------------------------------------------
// Contact page content
// ---------------------------------------------------------------------------

describe('Contact page content', () => {
  let html: string;

  beforeAll(async () => {
    html = await getText('/contact');
  });

  test('has form or input elements', () => {
    expect(html).toMatch(/<form|<input|<textarea/i);
  });
});

// ---------------------------------------------------------------------------
// Contract page content
// ---------------------------------------------------------------------------

describe('Contract page content', () => {
  let html: string;

  beforeAll(async () => {
    html = await getText('/contract');
  });

  test('contains rules or guidelines language', () => {
    expect(html).toMatch(/rule(s)?|guideline(s)?|agreement/i);
  });

  test('contains zero tolerance / no alcohol / substance language', () => {
    expect(html).toMatch(/zero.tolerance|no alcohol|substance|drug.free/i);
  });
});

// ---------------------------------------------------------------------------
// 404 handling
// ---------------------------------------------------------------------------

describe('404 for unknown routes', () => {
  test('GET /definitely-not-a-real-page-xyz → 404', async () => {
    const res = await get('/definitely-not-a-real-page-xyz');
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// API: /api/contact
// ---------------------------------------------------------------------------

describe('POST /api/contact', () => {
  test('empty body → 400 or 422 or 405', async () => {
    const res = await post('/api/contact', {});
    expect([400, 422, 405]).toContain(res.status);
  });

  test('valid body → 200 or 201 or 429 (rate limited)', async () => {
    const res = await post('/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '5071234567',
      message: 'Functional test message — please ignore.',
    });
    expect([200, 201, 429]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// API: /api/scheduled-balance (auth-protected)
// ---------------------------------------------------------------------------

describe('GET /api/scheduled-balance (no auth)', () => {
  test('returns 401, 403, or 404', async () => {
    const res = await get('/api/scheduled-balance');
    expect([401, 403, 404]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Admin route protection
// ---------------------------------------------------------------------------

describe('GET /admin (no auth)', () => {
  test('redirects or returns 401/403', async () => {
    const res = await get('/admin');
    // redirect (3xx) or auth error
    expect(res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

describe('Performance', () => {
  test('home page loads in < 3 seconds', async () => {
    const start = Date.now();
    await get('/');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('home page HTML < 500 KB', async () => {
    const html = await getText('/');
    const bytes = Buffer.byteLength(html, 'utf8');
    expect(bytes).toBeLessThan(500 * 1024);
  });
});

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

describe('SEO', () => {
  let html: string;

  beforeAll(async () => {
    html = await getText('/');
  });

  test('has <title> tag', () => {
    expect(html).toMatch(/<title[\s>]/i);
  });

  test('title contains "Crossroads"', () => {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
    expect(match).not.toBeNull();
    expect(match![1]).toMatch(/Crossroads/i);
  });

  test('has meta description', () => {
    expect(html).toMatch(/<meta[^>]+name=["']description["'][^>]*content=/i);
  });

  test('has viewport meta tag', () => {
    expect(html).toMatch(/<meta[^>]+name=["']viewport["']/i);
  });
});

// ---------------------------------------------------------------------------
// Supabase smoke tests (only when credentials are available)
// ---------------------------------------------------------------------------

const supabaseDescribe = HAS_SUPABASE ? describe : describe.skip;

supabaseDescribe('Supabase table smoke tests', () => {
  const tables = ['houses', 'residents', 'ledger_entries', 'ledger_import_staging'];
  const views = ['v_resident_balances', 'v_last_payment', 'v_overdue_residents'];

  const supabaseGet = async (resource: string): Promise<Response> => {
    return fetch(`${SUPABASE_URL}/rest/v1/${resource}?limit=1`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY!}`,
        'Content-Type': 'application/json',
      },
    });
  };

  for (const table of tables) {
    test(`table "${table}" → 200`, async () => {
      const res = await supabaseGet(table);
      expect(res.status).toBe(200);
    });
  }

  for (const view of views) {
    test(`view "${view}" → 200`, async () => {
      const res = await supabaseGet(view);
      expect(res.status).toBe(200);
    });
  }
});
