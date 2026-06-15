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

🤖 CARE ASSISTANT
Ask about any plant and get instant answers from Sprouto's structured care data.

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

🤖 ASISTEN PERAWATAN
Tanya apa saja tentang tanaman dan dapatkan jawaban instan dari data perawatan Sprouto.

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

Sprouto is local-first. Your answers depend on whether the **AI assistant** is enabled in the shipped build (`AI_PROXY_URL` set).

**If shipped with AI OFF (default `AI_PROXY_URL = ''`):**
- Does your app collect or share any of the required user data types? → **No.**
  (Favorites, garden, journal notes/photos, name, settings all stay on-device; Play counts only data sent off the device.)
- Is all data encrypted in transit? → Yes (the app only makes HTTPS requests).
- Do you provide a way to delete data? → Yes — uninstalling or clearing app data removes everything (all local).

**If you ENABLE the AI assistant:**
- Data collected/shared: **App info & performance → "Other user-generated content"** — the text question the user types is **shared** with a third-party AI provider (DeepSeek) to generate a response.
  - Collected: optional · Shared: yes · Purpose: **App functionality** (not ads/analytics).
- Photos: still **not** collected/shared (journal photos never leave the device).
- Encrypted in transit: Yes. Deletion: as above.

> Tip: launching with AI off keeps the data-safety form a clean "no data collected", which is the simplest review path. Turn AI on in a later update once you've deployed the worker.

## Content rating questionnaire
Answer "No" to violence, sexual content, profanity, drugs, gambling, user-to-user communication. Result: **Everyone**. The app has no ads SDK and no in-app social features.
