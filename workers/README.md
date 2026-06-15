# Sprouto AI proxy (DeepSeek)

The app is a static site, so it cannot hold a secret API key safely. This tiny
Cloudflare Worker sits in between: the app calls the **worker**, and the worker
adds your **DeepSeek** key (stored as an encrypted Cloudflare secret) before
calling DeepSeek.

```
Sprouto app  →  this Worker (holds the key)  →  api.deepseek.com
```

## Where does the API key go? 🔑

**Into Cloudflare as a secret — never into this repo, the app, chat, or a commit.**

```bash
cd workers
npm i -g wrangler          # or use: npx wrangler ...
wrangler login             # opens browser, log in to your Cloudflare account
wrangler secret put DEEPSEEK_API_KEY
#   → it prompts "Enter a secret value:" — paste your DeepSeek key here.
#     It is stored encrypted in YOUR Cloudflare account.
wrangler deploy
```

After `deploy`, Wrangler prints your worker URL, e.g.
`https://sprouto-ai.<your-subdomain>.workers.dev`.

## Connect the app to the worker

1. Open `src/Sprouto.jsx`, find `AI_PROXY_URL` (near the top) and set it to your
   worker URL:
   ```js
   const AI_PROXY_URL = 'https://sprouto-ai.<your-subdomain>.workers.dev';
   ```
2. If your site is served from a different origin than the defaults, add it to
   `ALLOWED_ORIGINS` in `ai-proxy.js` and re-run `wrangler deploy`.
3. Commit + push. The Care Assistant screen then shows an **"✨ Ask Sprouto AI"**
   button that uses DeepSeek, grounded in the matched plant's data.

When `AI_PROXY_URL` is empty (the default), the app falls back to instant
deterministic answers from the local plant data — no AI, no cost.

## Get a DeepSeek key
platform.deepseek.com → API keys. The proxy uses the `deepseek-chat` model and
the OpenAI-compatible `/chat/completions` endpoint.

## Notes
- `ALLOWED_ORIGINS` restricts who can call your worker (so others can't burn your
  DeepSeek credits). Keep it to your real origins.
- The worker caps request size and tokens; adjust in `ai-proxy.js` if needed.
