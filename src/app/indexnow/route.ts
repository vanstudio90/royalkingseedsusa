import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = 'b9f4c2a1e7d34f6890ab12cd56ef78gh';

// GET: serve the key verification file
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain' },
  });
}

// POST: submit URLs to IndexNow (Bing, Yandex, Seznam, Naver)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET || 'default-secret'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { urls } = await request.json();
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls array required' }, { status: 400 });
  }

  const payload = {
    host: 'royalkingseeds.us',
    key: INDEXNOW_KEY,
    keyLocation: 'https://royalkingseeds.us/indexnow',
    urlList: urls,
  };

  const results = await Promise.allSettled([
    fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  ]);

  return NextResponse.json({
    submitted: urls.length,
    engines: results.map((r, i) => ({
      engine: ['indexnow.org', 'bing.com', 'yandex.com'][i],
      status: r.status === 'fulfilled' ? r.value.status : 'error',
    })),
  });
}
