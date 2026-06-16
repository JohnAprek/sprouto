# Sprouto — Play Store listing kit

Everything you paste into Google Play Console. Fill the two `<...>` placeholders
(your contact email in `public/privacy.html`, and your real screenshots).

- **Privacy policy URL:** https://johnaprek.github.io/sprouto/privacy.html
- **Suggested category:** House & Home (alt: Lifestyle)
- **Tags:** plant care, gardening, houseplants, plant identification, hydroponics
- **Content rating:** Everyone (no objectionable content — see §Data safety / rating)

---

## App title (≤ 30 chars)
```
Sprouto: Plant Care & Guide
```

## Short description (≤ 80 chars)

**EN**
```
Care for 200+ plants — reminders, guides, pet-safety & a plant journal.
```
**ID**
```
Rawat 200+ tanaman — pengingat, panduan, keamanan hewan & jurnal.
```

## Full description (≤ 4000 chars)

**EN**
```
Sprouto is your simple, friendly companion for growing and caring for plants — at home, on the balcony, or in the garden. Built for beginners and improving plant parents alike.

🌿 200+ PLANT ENCYCLOPEDIA
Search a growing library of houseplants, vegetables, fruits, herbs, medicinal and aromatic plants. Each profile has clear care cards — watering, light, soil, fertilizer, difficulty — with real photos, not walls of text.

⏰ MY GARDEN & CARE REMINDERS
Add the plants you actually own, set a start date, and Sprouto builds a care calendar so you never forget to water, fertilize, or prune again.

📔 PLANT JOURNAL
Track each plant's progress with dated notes and photos. Watch your plants grow over time.

📅 GROW FROM SCRATCH
Step-by-step, 6-phase growing guides take you from day 0 to harvest with a checklist you can tick off.

🐾 PET SAFETY
Every plant is labeled toxic, pet-safe, or use-caution for cats and dogs — and you can filter the catalog to show only pet-safe plants.

💧 TOOLS & GUIDES
A hydroponic nutrient calculator (AB Mix / EC / pH), plus in-depth guides on soil, potting media, fertilizer, drainage, hydroponics, and home greenhouses.

🤖 AI CARE ASSISTANT
Ask anything about plant care — watering, light, pests, pet-safety — and get instant, friendly answers powered by AI, grounded in Sprouto's plant data.

📷 IDENTIFY PLANTS WITH YOUR CAMERA
Not sure what a plant is? Snap or upload a photo and Sprouto identifies it for you.

✨ MADE FOR YOU
• English & Indonesian
• Dark mode
• Privacy-first: works offline, no account needed, your data stays on your device

Grow with confidence. Download Sprouto and give your plants the care they deserve.
```

**ID**
```
Sprouto adalah teman sederhana dan ramah untuk menanam dan merawat tanaman — di rumah, balkon, atau kebun. Dibuat untuk pemula maupun pecinta tanaman yang ingin makin jago.

🌿 ENSIKLOPEDIA 200+ TANAMAN
Telusuri koleksi tanaman hias, sayur, buah, herbal, obat, dan aromaterapi yang terus bertambah. Tiap profil punya kartu perawatan jelas — penyiraman, cahaya, media, pupuk, tingkat kesulitan — dengan foto asli, bukan tulisan panjang.

⏰ KEBUNKU & PENGINGAT PERAWATAN
Tambahkan tanaman yang kamu miliki, atur tanggal mulai, dan Sprouto menyusun kalender perawatan agar kamu tak lupa menyiram, memupuk, atau memangkas.

📔 JURNAL TANAMAN
Catat perkembangan tiap tanaman dengan catatan bertanggal dan foto. Lihat tanamanmu tumbuh dari waktu ke waktu.

📅 MENANAM DARI NOL
Panduan menanam 6 fase langkah demi langkah, dari hari ke-0 sampai panen, lengkap dengan checklist.

🐾 KEAMANAN HEWAN
Setiap tanaman diberi label beracun, aman, atau perlu kehati-hatian bagi kucing dan anjing — dan kamu bisa memfilter katalog hanya untuk tanaman yang aman bagi hewan.

💧 ALAT & PANDUAN
Kalkulator nutrisi hidroponik (AB Mix / EC / pH), plus panduan mendalam soal tanah, media tanam, pupuk, drainase, hidroponik, dan greenhouse rumahan.

🤖 ASISTEN PERAWATAN AI
Tanya apa saja soal perawatan tanaman — penyiraman, cahaya, hama, keamanan hewan — dan dapatkan jawaban instan yang ramah, didukung AI dan berdasarkan data tanaman Sprouto.

📷 IDENTIFIKASI TANAMAN DENGAN KAMERA
Tidak yakin tanaman apa? Foto atau unggah gambar, Sprouto akan mengenalinya untukmu.

✨ DIBUAT UNTUKMU
• Bahasa Inggris & Indonesia
• Mode gelap
• Mengutamakan privasi: bekerja offline, tanpa akun, datamu tetap di perangkatmu

Berkebun dengan percaya diri. Unduh Sprouto dan beri tanamanmu perawatan terbaik.
```

---

## Graphics checklist
- **App icon (512×512):** use `public/pwa-512x512.png` ✅ (already generated)
- **Feature graphic (1024×500):** `public/feature-graphic.png` ✅ (generated in this repo)
- **Phone screenshots (min 2, 1080×1920-ish):** capture from the live app — recommended screens: Home dashboard, Encyclopedia/catalog, a Plant detail (e.g. Monstera) showing care cards + Pet Safety, My Garden schedule, Care Assistant.

---

## Data safety form (answers)

This build ships with **both the AI assistant and camera identification enabled** (the Cloudflare
worker is live). Sprouto is otherwise local-first: favorites, garden, journal notes/photos, name,
settings and streak all stay on the device. **Two features send data off-device only when the user
chooses to use them:**

**Declare these data types as Shared (not Collected/stored):**
- **App activity → Other user-generated content** — the text typed into the AI Care Assistant is
  **shared** with our AI provider (DeepSeek) to generate an answer.
  Collected: No · Shared: Yes · Purpose: **App functionality** · Optional (user-initiated).
- **Photos and videos → Photos** — when the user taps "Identify a plant", the chosen/taken photo is
  **shared** with our identification provider (Pl@ntNet) to recognize the plant.
  Collected: No · Shared: Yes · Purpose: **App functionality** · Optional (user-initiated).

**Everything else:** not collected, not shared. Journal photos the user saves never leave the device.

- Is all data encrypted in transit? → **Yes** (HTTPS only).
- Do you provide a way to request data deletion? → **Yes** — nothing is stored on our servers;
  clearing app data or uninstalling removes all local data.
- Any data used for ads or analytics? → **No** (no ads SDK, no analytics, no trackers).

> These answers match the Privacy Policy (privacy.html), which discloses the DeepSeek and Pl@ntNet
> sharing. Keep the two consistent — Play cross-checks them.

## Content rating questionnaire
Answer "No" to violence, sexual content, profanity, drugs, gambling, user-to-user communication. Result: **Everyone**. The app has no ads SDK and no in-app social features.
