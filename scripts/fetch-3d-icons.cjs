// One-off: download the 3D glossy icons used on the Home screen from Microsoft
// Fluent Emoji (MIT-licensed), optimize to 128px PNG, store under public/icons-3d/.
//   node scripts/fetch-3d-icons.cjs
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

const OUT = 'public/icons-3d';
fs.mkdirSync(OUT, { recursive: true });

// key -> Fluent Emoji folder name (file is the lowercased, underscored name + _3d.png)
const ICONS = {
  heart: 'Red heart',
  garden: 'Potted plant',
  book: 'Green book',
  fire: 'Fire',
  robot: 'Robot',
  camera: 'Camera',
  droplet: 'Droplet',
  calendar: 'Calendar',
  bulb: 'Light bulb',
};

const CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) { r.resume(); return resolve(get(r.headers.location)); }
      if (r.statusCode !== 200) { r.resume(); return resolve(null); }
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}

(async () => {
  let ok = 0, fail = [];
  for (const [key, folder] of Object.entries(ICONS)) {
    const file = folder.toLowerCase().replace(/ /g, '_') + '_3d.png';
    const url = `${CDN}/${encodeURIComponent(folder)}/3D/${file}`;
    const buf = await get(url);
    if (buf) {
      await sharp(buf).resize(128, 128, { fit: 'inside' }).png({ quality: 90 }).toFile(`${OUT}/${key}.png`);
      ok++;
      console.log(`ok  ${key.padEnd(12)} <- ${folder}`);
    } else {
      fail.push(`${key} (${folder})`);
      console.log(`FAIL ${key.padEnd(12)} <- ${folder}  ${url}`);
    }
  }
  console.log(`\n${ok}/${Object.keys(ICONS).length} downloaded.` + (fail.length ? ' Failed: ' + fail.join(', ') : ''));
})();
