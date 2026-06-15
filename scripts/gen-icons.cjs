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

  console.log('Icons regenerated into public/.');
})().catch((e) => { console.error(e); process.exit(1); });
