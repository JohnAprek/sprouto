# NOTIF-001 — Reminder architecture spike

## The problem (why this is the make-or-break decision)

Sprouto's retention loop is **care reminders**. Today they are best-effort only:
`new Notification()` is fired from a daily check that runs **when the app is opened**
(`Sprouto.jsx`). That is a circular loop — the user is only reminded if they already
opened the app, which is exactly the moment they don't need reminding.

A habit app needs notifications that fire **on schedule, in the background, without the
app open**. On the web that is hard, and on GitHub Pages (static, no backend) it is not
achievable reliably.

## Options

| Option | Fires in background? | Reliability | Needs backend | Needs native | Verdict |
|---|---|---|---|---|---|
| Check-on-open (current) | ❌ | none | no | no | placeholder only |
| Service Worker + `Notification Triggers` (`showTrigger`) | partial | experimental, Chromium-only, **deprecated/uncertain** | no | no | ❌ don't rely on it |
| Periodic Background Sync | partial | install-gated, throttled, no iOS | no | no | weak |
| **Web Push (FCM) + Service Worker** | ✅ | strong (Android), limited iOS | **yes** (push server + scheduler) | no | good once a backend exists |
| **Capacitor + `@capacitor/local-notifications`** | ✅ | **strong, on-device, offline** | **no** | yes (native shell) | ✅ **best fit for launch** |

## Recommendation

**Package the Android app with Capacitor instead of a bare TWA, and use
`@capacitor/local-notifications` for reminders.**

Rationale:
- The reminder schedule is **fully deterministic** (start date + interval per plant), so it
  can be computed on-device and scheduled locally — **no server, no push cost, works offline**.
  This matches a static, backend-less app perfectly.
- A bare **TWA cannot schedule local notifications** (it is just a fullscreen Chrome tab); it
  would force the Web Push + FCM + backend path purely to get reminders.
- Capacitor still loads the same web build (the deployed PWA or a bundled copy), so the entire
  React app is reused — only the notification layer goes native.

Keep the current **TWA setup (`ANDROID.md`) as the fallback** if you later add a backend and
prefer Web Push, or want the absolute thinnest wrapper. But for a reminder-first launch,
Capacitor is the lower-risk path to a loop that actually works.

## Concrete next steps (when you greenlight the pivot)

1. `npm i @capacitor/core @capacitor/cli @capacitor/local-notifications @capacitor/android`
2. `npx cap init Sprouto io.github.johnaprek.sprouto --web-dir=dist`
3. Add a small bridge: when a plant is added/edited in **My Garden**, compute the next N care
   dates and call `LocalNotifications.schedule(...)`; cancel on removal. Keep the web
   `Notification` path as a no-op fallback when the native plugin is absent.
4. `npm run build && npx cap sync android && npx cap open android` → build the signed AAB.
5. Notification permission is requested via the plugin on first "enable reminders" tap
   (the UI already has that toggle in **Kebunku / My Garden**).

## Interim (no pivot yet)

Leave the current best-effort web notification as-is. Do **not** invest in
`Notification Triggers` / Periodic Sync — they are unreliable and partly deprecated. The honest
status is: **reliable reminders ship with the Capacitor (or Web Push) milestone, not before.**
This should be sequenced as part of `NOTIF-001` in the M2 retention milestone.
