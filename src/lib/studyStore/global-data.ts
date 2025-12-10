import { getDb, isBrowser } from "./db";
import { getDefaultStreak, getDefaultSettings } from "./utils";
import type { GlobalStudyData } from "./types";

export async function loadGlobalDataAsync(): Promise<GlobalStudyData> {
  if (!isBrowser) {
    return {
      favorites: [],
      watchLater: [],
      sessions: [],
      streak: getDefaultStreak(),
      settings: getDefaultSettings(),
      totalWatchTime: 0,
    };
  }

  try {
    const database = getDb();
    const [favorites, watchLater, sessions, streak, settings] = await Promise.all([
      database.favorites.toArray(),
      database.watchLater.toArray(),
      database.sessions.toArray(),
      database.streak.get("main"),
      database.settings.get("main"),
    ]);

    return {
      favorites: favorites || [],
      watchLater: watchLater || [],
      sessions: sessions || [],
      streak: streak || getDefaultStreak(),
      settings: settings || getDefaultSettings(),
      totalWatchTime: settings?.totalWatchTime || 0,
    };
  } catch (e) {
    console.error("Error loading global data:", e);
    return {
      favorites: [],
      watchLater: [],
      sessions: [],
      streak: getDefaultStreak(),
      settings: getDefaultSettings(),
      totalWatchTime: 0,
    };
  }
}
