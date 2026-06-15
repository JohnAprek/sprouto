// Sprouto AI proxy — Cloudflare Worker.
// Keeps the DeepSeek API key server-side (Cloudflare secret DEEPSEEK_API_KEY).
// The client never sees the key; it only calls THIS worker's URL.
//
// Deploy:  cd workers && wrangler secret put DEEPSEEK_API_KEY && wrangler deploy
// (see workers/README.md)

const ALLOWED_ORIGINS = [
  'https://johnaprek.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
];

const SYSTEM_PROMPT =
  "You are Sprouto, a friendly plant-care assistant. Answer ONLY using the " +
  "plant data provided in the context. Be concise and practical (a few short " +
  "sentences). If the context does not cover the question, say you don't have " +
  "that detail rather than inventing it. For pet-safety or health questions add " +
  "a brief reminder that this is general guidance, not professional advice. " +
  "Reply in the language requested (en = English, id = Indonesian).";

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers });
    }
    if (!env.DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), {
        status: 500, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const question = String(body.question || '').slice(0, 800);
    const context = String(body.context || '').slice(0, 4000);
    const lang = body.lang === 'id' ? 'id' : 'en';
    if (!question) {
      return new Response(JSON.stringify({ error: 'Missing question' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Answer in: ${lang}\n\nPlant data context:\n${context || '(no specific plant matched)'}\n\nQuestion: ${question}` },
    ];

    let dsResp;
    try {
      dsResp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.3,
          max_tokens: 500,
          stream: false,
        }),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
        status: 502, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    if (!dsResp.ok) {
      const detail = await dsResp.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'DeepSeek error', status: dsResp.status, detail: detail.slice(0, 300) }), {
        status: 502, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const data = await dsResp.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || '';
    return new Response(JSON.stringify({ answer }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
