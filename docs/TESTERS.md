# Sprouto — 12-Tester Closed Testing Kit

New personal Play accounts must run a **closed test with ≥12 testers for ≥14 days**
before applying for production. This file has everything you need to recruit them.

> Replace `[OPT-IN LINK]` everywhere with the real opt-in URL once it exists
> (see "How to set it up" at the bottom).

---

## 1. Friends & family (WhatsApp / DM — Indonesian)

```
Halo! 🌱 Aku baru bikin aplikasi Android namanya *Sprouto* — buat merawat tanaman:
panduan 200+ tanaman, pengingat siram & pupuk, identifikasi tanaman dari foto, dan
asisten AI tanaman.

Aku butuh bantuanmu jadi *tester* selama 14 hari biar app-nya bisa rilis di Play Store.
Gampang & gratis, cuma 5 menit setup:

1. Buka link ini di HP Android: [OPT-IN LINK]
2. Klik "Become a tester" / "Jadi penguji"
3. Install Sprouto dari Play Store
4. Buka sesekali aja selama 2 minggu (gak harus tiap hari)

Aman, gratis, gak ada iklan. Makasih banyak ya! 🙏
```

## 2. Friends & family (English)

```
Hey! 🌱 I just built an Android app called *Sprouto* — a plant-care companion
(200+ plant guides, watering reminders, photo plant ID, and an AI assistant).

I need 12 testers for 14 days so I can launch it on Google Play. Takes 5 min:

1. Open this on an Android phone: [OPT-IN LINK]
2. Tap "Become a tester"
3. Install Sprouto from the Play Store
4. Just open it now and then over the next 2 weeks

Free, no ads, totally safe. Thank you so much! 🙏
```

## 3. Tester-exchange groups (reciprocal "I test yours, you test mine")

Post this in groups like Telegram "Google Play Testers", Reddit r/AndroidTesters,
r/googleplaytesting, or similar:

```
🌱 Sprouto — Plant Care & Identification  (Android · closed test · 14 days)

Need 12 testers for a 14-day closed test. Reciprocal — drop your link and I'll
test yours back (I2I), guaranteed full 14 days.

• Opt-in: [OPT-IN LINK]
• Then install from Play Store and keep it on for 14 days (open occasionally).

Comment "done + your link" and I'll join yours right away. Thanks! 🙏
```

---

## 4. Step-by-step instructions to send each tester

```
Cara jadi tester Sprouto (5 menit):

1. Pakai HP Android, login Google yang sama dengan email yang kamu kasih ke aku.
2. Buka link: [OPT-IN LINK]
3. Tap "Become a tester" (Jadi penguji) → tunggu "You're a tester".
4. Tap "Download it on Google Play" → install seperti app biasa.
5. PENTING: jangan uninstall selama 14 hari. Buka 1-2x seminggu aja cukup.

Catatan: kalau di Play Store tertulis app tidak tersedia, tunggu 5-30 menit
setelah jadi tester (perlu waktu sinkron), lalu coba lagi.
```

---

## How to set it up in Play Console (do this after the app is created)

1. Play Console → your app → **Testing → Closed testing** → **Create track**
   (or use the default "Closed testing" track).
2. Upload the `app-release-bundle.aab` to this track and roll out.
3. **Testers tab** → create an **email list** and paste your 12 testers' Gmail
   addresses (each tester must opt in with the SAME Google account).
   - Easiest for ≥12 people: make a **Google Group** and add the email list, then
     add the group as testers.
4. Copy the **"Copy link" / opt-in URL** shown on the Testers tab → that's your
   `[OPT-IN LINK]`.
5. Share the messages above. Track starts the 14-day clock once testers are active.

> Aim for 14-15 real testers (a couple always drop out). They must stay opted-in
> for the full 14 days, then you can apply for production access.
