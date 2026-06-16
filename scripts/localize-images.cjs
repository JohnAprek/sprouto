// One-off: download every plant photo from its (Wikimedia) imageUrl, re-encode
// to a small local JPEG under public/plants/<id>.jpg, and rewrite imageUrl in
// both data files to the local path. Removes the hotlink dependency.
//   node scripts/localize-images.cjs
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

const UA = 'SproutoApp/1.0 (https://johnaprek.github.io/sprouto/; plant care app)';
const OUT = 'public/plants';
fs.mkdirSync(OUT, { recursive: true });

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (r) => {
      if (r.statusCode !== 200) { r.resume(); return resolve(null); }
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const en = JSON.parse(fs.readFileSync('src/data/plants.en.json', 'utf8'));
  const ok = {}; let done = 0, fail = 0;
  for (const p of en) {
    if (!p.imageUrl || !p.imageUrl.startsWith('http')) continue;
    const url = p.imageUrl.split('?')[0];
    const buf = await get(url);
    if (buf) {
      try {
        await sharp(buf).resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 72 }).toFile(`${OUT}/${p.id}.jpg`);
        ok[p.id] = `plants/${p.id}.jpg`; done++;
      } catch { fail++; }
    } else { fail++; }
    await sleep(300);
  }
  // rewrite both data files
  for (const path of ['src/data/plants.en.json', 'src/data/plants.json']) {
    const arr = JSON.parse(fs.readFileSync(path, 'utf8'));
    arr.forEach((p) => { if (ok[p.id]) p.imageUrl = ok[p.id]; else if (p.imageUrl && p.imageUrl.startsWith('http')) p.imageUrl = ''; });
    fs.writeFileSync(path, JSON.stringify(arr, null, 2) + '\n', 'utf8');
  }
  console.log(`localized ${done} images, ${fail} failed.`);
})();
