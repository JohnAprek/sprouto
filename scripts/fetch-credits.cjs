// One-off: rebuild photo attribution for the self-hosted plant images.
// The localize step overwrote the original Wikimedia/Unsplash imageUrl with a
// local path, so we recover the original URLs from git history, then query the
// Wikimedia Commons API for each file's author + license, and write a credits
// manifest to src/data/photo-credits.json (consumed by the in-app Credits page).
//
//   node scripts/fetch-credits.cjs
//
// Re-runnable: reads _orig_plants.json (produced by:
//   git show 8067a0c^:src/data/plants.en.json > _orig_plants.json )
const https = require('https');
const fs = require('fs');

const UA = 'SproutoApp/1.0 (https://johnaprek.github.io/sprouto/; plant care app)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJSON(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (r) => {
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { resolve(null); } });
    }).on('error', () => resolve(null));
  });
}

// Pull the Commons file title out of an upload.wikimedia.org URL.
function commonsTitle(url) {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  const ti = parts.indexOf('thumb');
  // thumb URL: .../thumb/H/HH/<File>/NNNpx-<File>  → file is at ti+3
  // direct URL: .../H/HH/<File>                     → file is last segment
  const seg = ti >= 0 ? parts[ti + 3] : parts[parts.length - 1];
  return decodeURIComponent(seg);
}

const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

(async () => {
  const plants = JSON.parse(fs.readFileSync('_orig_plants.json', 'utf8'));
  const nameById = Object.fromEntries(plants.map((p) => [p.id, p.name]));

  // Split sources
  const wiki = [], other = [];
  for (const p of plants) {
    if (!p.imageUrl || !p.imageUrl.startsWith('http')) continue;
    const host = new URL(p.imageUrl).host;
    if (host === 'upload.wikimedia.org') wiki.push({ id: p.id, title: commonsTitle(p.imageUrl) });
    else other.push({ id: p.id, host, url: p.imageUrl });
  }

  const credits = {}; // id -> { plant, author, license, licenseUrl, source }

  // Query Commons in batches of 40 titles.
  const byTitle = {};
  for (let i = 0; i < wiki.length; i += 40) {
    const batch = wiki.slice(i, i + 40);
    const titles = batch.map((b) => 'File:' + b.title).map(encodeURIComponent).join('|');
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${titles}`;
    const data = await getJSON(api);
    const pages = data && data.query && data.query.pages ? data.query.pages : {};
    // Map normalized titles back
    const norm = {};
    (data && data.query && data.query.normalized || []).forEach((n) => { norm[n.to] = n.from; });
    for (const k of Object.keys(pages)) {
      const pg = pages[k];
      const ii = pg.imageinfo && pg.imageinfo[0];
      const em = (ii && ii.extmetadata) || {};
      const title = (pg.title || '').replace(/^File:/, '');
      byTitle[title.replace(/ /g, '_')] = {
        author: stripTags(em.Artist && em.Artist.value) || 'Unknown',
        license: stripTags(em.LicenseShortName && em.LicenseShortName.value) || '',
        licenseUrl: (em.LicenseUrl && em.LicenseUrl.value) || '',
        source: (ii && ii.descriptionshorturl) || (ii && ii.descriptionurl) ||
                ('https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(title)),
      };
    }
    process.stdout.write(`commons ${Math.min(i + 40, wiki.length)}/${wiki.length}\r`);
    await sleep(400);
  }
  console.log('');

  for (const w of wiki) {
    const m = byTitle[w.title] || byTitle[w.title.replace(/ /g, '_')];
    credits[w.id] = {
      plant: nameById[w.id],
      author: (m && m.author) || 'Unknown',
      license: (m && m.license) || 'see source',
      licenseUrl: (m && m.licenseUrl) || '',
      source: (m && m.source) || ('https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(w.title)),
    };
  }
  for (const o of other) {
    credits[o.id] = {
      plant: nameById[o.id],
      author: o.host.includes('unsplash') ? 'Unsplash' : o.host,
      license: o.host.includes('unsplash') ? 'Unsplash License' : '',
      licenseUrl: o.host.includes('unsplash') ? 'https://unsplash.com/license' : '',
      source: o.url.split('?')[0],
    };
  }

  fs.writeFileSync('src/data/photo-credits.json', JSON.stringify(credits, null, 2) + '\n', 'utf8');
  const unknown = Object.values(credits).filter((c) => c.author === 'Unknown').length;
  console.log(`wrote ${Object.keys(credits).length} credits (${unknown} unknown author) → src/data/photo-credits.json`);
})();
