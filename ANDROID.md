# Packaging Sprouto for the Play Store (Android / TWA)

Sprouto is an installable PWA, so the Android app is a **Trusted Web Activity (TWA)**:
a thin native wrapper that opens the deployed PWA full‑screen (no browser bar).

- **PWA URL:** https://johnaprek.github.io/sprouto/
- **Web manifest:** https://johnaprek.github.io/sprouto/manifest.webmanifest ✅ TWA‑ready
  (name, `start_url`, `standalone`, 192/512 + maskable icons)
- **Suggested package id:** `io.github.johnaprek.sprouto` (change in [docs/twa-manifest.json](docs/twa-manifest.json) if you prefer your own)

> **Recommended path:** for reliable care reminders, use **Capacitor** (already set up — see
> [docs/NOTIFICATIONS.md](docs/NOTIFICATIONS.md)). The TWA path below remains valid but a bare TWA
> cannot schedule local notifications.

There are two ways to produce the **.aab** (Android App Bundle) you upload to Google Play.
Pick ONE.

---

## Path A — PWABuilder (easiest, no local Android toolchain) ⭐

This machine has no JDK/Android SDK, so this is the fastest route.

1. Go to **https://www.pwabuilder.com** and enter `https://johnaprek.github.io/sprouto/`.
2. Click **Package for stores → Android (Google Play)**.
3. Settings to use:
   - Package ID: `io.github.johnaprek.sprouto`
   - App name: `Sprouto`, Launcher name: `Sprouto`
   - Theme color `#166534`, background `#ffffff`
   - Signing key: **"Create new"** (PWABuilder generates an upload keystore — **download and keep `signing.keystore` + the password safe; losing it means you can't update the app**).
4. Download the zip. It contains:
   - `app-release-bundle.aab` → upload to Play Console
   - `assetlinks.json` → **copy its contents into** [public/.well-known/assetlinks.json](public/.well-known/assetlinks.json), then commit + push (redeploys). This removes the URL bar in the installed app.

---

## Path B — Bubblewrap CLI (local build, full control)

Requires installing a toolchain first.

```bash
# 1. Install JDK 17 (e.g. Temurin) and make sure `java -version` works.
#    Windows: winget install EclipseAdoptium.Temurin.17.JDK

# 2. Install the CLI
npm i -g @bubblewrap/cli

# 3. First run downloads the Android SDK + build tools (accept the licenses)
bubblewrap doctor

# 4. Initialise the project from the live manifest
#    (docs/twa-manifest.json in this repo is a ready reference for the answers)
bubblewrap init --manifest https://johnaprek.github.io/sprouto/manifest.webmanifest

# 5. Build — this creates the upload keystore (you choose the passwords) and the bundle
bubblewrap build
#   -> app-release-bundle.aab  +  app-release-signed.apk
```

After `build`, Bubblewrap prints the SHA‑256 of your signing key and writes an
`assetlinks.json`. Put that fingerprint into [public/.well-known/assetlinks.json](public/.well-known/assetlinks.json)
(replace the empty `sha256_cert_fingerprints` array), commit + push.

> If you use **Google Play App Signing** (recommended), also add the SHA‑256 that
> Play Console shows under *Setup → App signing* to the same `sha256_cert_fingerprints`
> array, otherwise the URL bar will appear after Play re‑signs the app.

---

## Digital Asset Links (do not skip)

The file [public/.well-known/assetlinks.json](public/.well-known/assetlinks.json) is already
hosted at `https://johnaprek.github.io/sprouto/.well-known/assetlinks.json`. It ships with an
**empty** `sha256_cert_fingerprints` array — fill it with your signing key's SHA‑256 (and Play's,
if using Play App Signing) and redeploy. Until then the app works but shows the browser address bar.

## Play Console checklist
- App icon (use `branding/mark.png`, 512×512) and feature graphic (1024×500)
- Screenshots (phone), short + full description, privacy policy URL
- Content rating questionnaire, data‑safety form
- Upload `app-release-bundle.aab`, roll out to internal testing first
