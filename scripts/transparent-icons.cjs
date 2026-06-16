// Make the custom 3D icons truly transparent: the source PNGs (menntah/*) have an
// opaque near-white background baked in. We flood-fill from the borders, turning
// edge-connected light pixels transparent — this strips the white bg + soft shadow
// while preserving the icon's own white parts (pot, robot body) which are interior
// and not connected to the border. Then resize to 160px into public/icons-3d/.
//   node scripts/transparent-icons.cjs
const fs = require('fs');
const sharp = require('sharp');

const SRC = 'menntah';
const OUT = 'public/icons-3d';
const MAP = {
  robot: 'airoboticon.png',
  camera: 'iconplanntsearch.png',
  book: 'catalogue.png',
  fire: 'hoticon.png',
  calendar: 'calenndar.png',
  droplet: 'droplet.png',
  garden: 'garden.png',
  heart: 'heart.png',
};

// a pixel counts as "background" (light + low saturation) → floodable
function isBg(d, i) {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  return mn >= 200 && (mx - mn) <= 28;          // near-white / light grey shadow
}

async function makeTransparent(srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const idx = (x, y) => (y * w + x) * c;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    seen[p] = 1;
    if (isBg(data, p * c)) stack.push(p);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    data[p * c + 3] = 0;                          // make transparent
    const x = p % w, y = (p / w) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  // soften the 1px boundary: any still-opaque light pixel touching a transparent one → partial alpha
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x, i = p * c;
    if (data[i + 3] === 0 || !isBg(data, i)) continue;
    if (data[(p - 1) * c + 3] === 0 || data[(p + 1) * c + 3] === 0 || data[(p - w) * c + 3] === 0 || data[(p + w) * c + 3] === 0)
      data[i + 3] = 90;
  }
  return sharp(data, { raw: { width: w, height: h, channels: c } }).png().toBuffer();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [key, file] of Object.entries(MAP)) {
    const src = `${SRC}/${file}`;
    if (!fs.existsSync(src)) { console.log('MISSING', file); continue; }
    const cut = await makeTransparent(src);
    await sharp(cut).trim().resize(160, 160, { fit: 'inside' }).png({ compressionLevel: 9 }).toFile(`${OUT}/${key}.png`);
    console.log('ok ', key);
  }
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
