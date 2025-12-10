import { getDb, isBrowser } from "./db";
import { getTodayDate } from "./utils";
import type { ExportData } from "./types";

export async function exportAllDataAsync(): Promise<ExportData> {
  if (!isBrowser) {
    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      notes: [],
      bookmarks: [],
      videoProgress: [],
      favorites: [],
      watchLater: [],
      sessions: [],
      streak: null,
      settings: null,
    };
  }

  try {
    const database = getDb();
    
    const [notes, bookmarks, videoProgress, favorites, watchLater, sessions, streak, settings] = await Promise.all([
      database.notes.toArray(),
      database.bookmarks.toArray(),
      database.videoProgress.toArray(),
      database.favorites.toArray(),
      database.watchLater.toArray(),
      database.sessions.toArray(),
      database.streak.get("main"),
      database.settings.get("main"),
    ]);

    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      notes,
      bookmarks,
      videoProgress,
      favorites,
      watchLater,
      sessions,
      streak: streak || null,
      settings: settings || null,
    };
  } catch (e) {
    console.error("Error exporting data:", e);
    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      notes: [],
      bookmarks: [],
      videoProgress: [],
      favorites: [],
      watchLater: [],
      sessions: [],
      streak: null,
      settings: null,
    };
  }
}

export async function importAllDataAsync(data: ExportData, merge: boolean = false): Promise<boolean> {
  if (!isBrowser) return false;

  try {
    const database = getDb();

    await database.transaction("rw", [
      database.notes,
      database.bookmarks,
      database.videoProgress,
      database.favorites,
      database.watchLater,
      database.sessions,
      database.streak,
      database.settings,
    ], async () => {
      if (!merge) {
        // Clear all data if not merging
        await Promise.all([
          database.notes.clear(),
          database.bookmarks.clear(),
          database.videoProgress.clear(),
          database.favorites.clear(),
          database.watchLater.clear(),
          database.sessions.clear(),
          database.streak.clear(),
          database.settings.clear(),
        ]);
      }

      // Import data
      if (data.notes?.length) await database.notes.bulkPut(data.notes);
      if (data.bookmarks?.length) await database.bookmarks.bulkPut(data.bookmarks);
      if (data.videoProgress?.length) await database.videoProgress.bulkPut(data.videoProgress);
      if (data.favorites?.length) await database.favorites.bulkPut(data.favorites);
      if (data.watchLater?.length) await database.watchLater.bulkPut(data.watchLater);
      if (data.sessions?.length) await database.sessions.bulkPut(data.sessions);
      if (data.streak) await database.streak.put(data.streak);
      if (data.settings) await database.settings.put(data.settings);
    });

    return true;
  } catch (e) {
    console.error("Error importing data:", e);
    return false;
  }
}

export async function downloadExportFileAsync(): Promise<void> {
  if (!isBrowser) return;

  const data = await exportAllDataAsync();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `study-data-${getTodayDate()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function clearAllDataAsync(): Promise<void> {
  if (!isBrowser) return;

  try {
    const database = getDb();
    await Promise.all([
      database.notes.clear(),
      database.bookmarks.clear(),
      database.videoProgress.clear(),
      database.favorites.clear(),
      database.watchLater.clear(),
      database.sessions.clear(),
      database.streak.clear(),
      database.settings.clear(),
    ]);
  } catch (e) {
    console.error("Error clearing data:", e);
  }
}
