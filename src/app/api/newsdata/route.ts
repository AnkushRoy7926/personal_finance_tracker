// src/app/api/newsdata/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('category') || 'technology'; // your “category”
    const page = searchParams.get('page') || undefined;    // NewsData’s cursor token

    const API_KEY = process.env.NEWSDATA_API;
    if (!API_KEY) throw new Error('Missing NEWSDATA_API env var');

    // 🔄 SWITCH TO “latest” for free-tier 48‑hr headlines
    const url = new URL('https://newsdata.io/api/1/latest');
    url.searchParams.set('apikey', API_KEY);
    url.searchParams.set('q', q);
    url.searchParams.set('country', 'in');
    url.searchParams.set('language', 'en');
    if (page) url.searchParams.set('page', page);

    const apiRes = await fetch(url.toString());
    const body = await apiRes.text();

    if (!apiRes.ok) {
      console.error('🗞️ NewsData latest error', apiRes.status, body);
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }

    const data = JSON.parse(body);
    // data.results: array of articles
    // data.nextPage: token for the next page
    const articles = (data.results || []).map((r: any) => ({
      title: r.title,
      description: r.description,
      url: r.link,
      urlToImage: r.image_url,
    }));

    return NextResponse.json({
      totalResults: data.totalResults ?? articles.length,
      nextPage: data.nextPage ?? null,
      articles,
    });
  } catch (e: any) {
    console.error('🔥 /api/newsdata error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
