// Regenerate app icons + social card from the master brand assets.
// Source (not deployed): branding/mark.png (icon mark), branding/logo-full.png (lockup).
// Output: public/*  ->  run with `node scripts/gen-icons.cjs`
const sharp = require('sharp');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// The master art uses a near-black background; recolor it to white.
async function clean(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    if (data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40) {
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; if (channels === 4) data[i + 3] = 255;
    }
  }
  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

(async () => {
  const mark = await clean('branding/mark.png');
  const full = await clean('branding/logo-full.png');
  const fit = (buf, size) => sharp(buf).resize(size, size, { fit: 'contain', background: WHITE }).flatten({ background: WHITE }).png();

  await fit(mark, 192).toFile('public/pwa-192x192.png');
  await fit(mark, 512).toFile('public/pwa-512x512.png');
  await fit(mark, 180).toFile('public/apple-touch-icon.png');
  await fit(mark, 32).toFile('public/favicon-32x32.png');
  await fit(mark, 16).toFile('public/favicon-16x16.png');

  // Maskable: mark inside the 80% safe zone on a full white square.
  const inner = await fit(mark, Math.round(512 * 0.78)).toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: WHITE } })
    .composite([{ input: inner, gravity: 'center' }]).flatten({ background: WHITE }).png()
    .toFile('public/pwa-512x512-maskable.png');

  // Social card 1200x630: full lockup centered on white.
  const lockup = await fit(full, Math.round(630 * 0.82)).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: WHITE } })
    .composite([{ input: lockup, gravity: 'center' }]).flatten({ background: WHITE }).png()
    .toFile('public/og-image.png');

  // Play Store feature graphic (1024x500): brand gradient + icon + text.
  const FW = 1024, FH = 500;
  const fg = `<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#166534"/><stop offset="1" stop-color="#0f3d24"/>
  </linearGradient></defs>
  <rect width="${FW}" height="${FH}" fill="url(#g)"/>
  <text x="470" y="205" font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="96" font-weight="bold" fill="#ffffff">Sprouto</text>
  <text x="474" y="262" font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="30" fill="#bbf7d0">Grow, Care &amp; Manage Your Plants</text>
  <text x="474" y="332" font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="27" font-weight="bold" fill="#86efac">200+ plants · reminders · pet-safe · guides</text>
  <text x="474" y="372" font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="27" font-weight="bold" fill="#86efac">hydroponics · journal · EN &amp; ID</text>
</svg>`;
  const fgBase = await sharp(Buffer.from(fg)).png().toBuffer();
  const fgIcon = await sharp('public/pwa-512x512.png').resize(360, 360).png().toBuffer();
  await sharp(fgBase).composite([{ input: fgIcon, top: 70, left: 70 }]).png().toFile('public/feature-graphic.png');

  console.log('Icons + feature graphic regenerated into public/.');
})().catch((e) => { console.error(e); process.exit(1); });
