// Local care reminders for the native (Capacitor) build.
// On the web this is a deliberate no-op — the PWA keeps its best-effort
// Notification path; reliable scheduled reminders ship in the native app.
import { Capacitor } from '@capacitor/core';

const DAY = 86400000;

// Next occurrence (>= today) of a recurring task that started on `startDate`
// and repeats every `interval` days.
function nextDate(startDate, interval, from) {
  if (!interval || interval <= 0) return null;
  const start = new Date(startDate); start.setHours(8, 0, 0, 0);
  const today = new Date(from); today.setHours(0, 0, 0, 0);
  const elapsed = Math.floor((today - start) / DAY);
  const stepsAhead = elapsed <= 0 ? 0 : Math.ceil(elapsed / interval);
  const d = new Date(start.getTime() + stepsAhead * interval * DAY);
  d.setHours(8, 0, 0, 0);
  return d;
}

// Build a stable small integer id from a string (Capacitor needs numeric ids).
function hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 2000000000;
}

/**
 * Reschedule all care reminders for the user's garden.
 * @param {Array<{id:string,startDate:string}>} garden
 * @param {Array} plants  localized plant dataset
 * @param {object} L      localized strings (for notification copy)
 */
export async function syncPlantReminders(garden, plants, L) {
  if (!Capacitor.isNativePlatform()) return; // web: no-op
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    // Clear previously scheduled Sprouto reminders.
    const pending = await LocalNotifications.getPending();
    if (pending.notifications?.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) });
    }

    const now = Date.now();
    const notifications = [];
    for (const { id, startDate } of garden) {
      const plant = plants.find(p => p.id === id);
      if (!plant) continue;
      const tasks = [
        { type: 'water', interval: plant.schedules.watering, body: L.notif_water(plant.name) },
        { type: 'fertilize', interval: plant.schedules.fertilizer, body: L.notif_fertilize(plant.name) },
      ];
      for (const t of tasks) {
        const at = nextDate(startDate, t.interval, now);
        if (!at) continue;
        notifications.push({
          id: hashId(id + t.type),
          title: 'Sprouto 🌱',
          body: t.body,
          schedule: { at, every: 'day', count: 1, allowWhileIdle: true },
        });
      }
    }
    if (notifications.length) await LocalNotifications.schedule({ notifications });
  } catch (e) {
    // Plugin unavailable (e.g. web) — ignore.
  }
}
