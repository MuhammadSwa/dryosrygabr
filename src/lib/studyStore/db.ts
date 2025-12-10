import Dexie, { type Table } from "dexie";
import type {
  Note,
  Bookmark,
  VideoProgress,
  FavoriteVideo,
  WatchLaterItem,
  StudySession,
  StudyStreak,
  StudySettings,
} from "./types";

// Check if we're in the browser
export const isBrowser = typeof window !== "undefined";

export class StudyDatabase extends Dexie {
  notes!: Table<Note, string>;
  bookmarks!: Table<Bookmark, string>;
  videoProgress!: Table<VideoProgress, string>;
  favorites!: Table<FavoriteVideo, string>;
  watchLater!: Table<WatchLaterItem, string>;
  sessions!: Table<StudySession, string>;
  streak!: Table<StudyStreak, string>;
  settings!: Table<StudySettings, string>;

  constructor() {
    super("StudyDatabase");
    
    this.version(1).stores({
      // Notes table with indexes for fast queries
      notes: "id, videoId, createdAt, importance, *tags",
      // Bookmarks table
      bookmarks: "id, videoId, createdAt",
      // Video progress - videoId is primary key
      videoProgress: "videoId, completed, lastWatched, watchedPercentage",
      // Favorites - videoId is primary key
      favorites: "videoId, addedAt",
      // Watch later queue
      watchLater: "videoId, addedAt, priority",
      // Study sessions
      sessions: "id, videoId, startTime, endTime",
      // Streak data (singleton)
      streak: "id",
      // Settings (singleton)
      settings: "id",
    });
  }
}

// Create database instance (only in browser)
let db: StudyDatabase | null = null;

export function getDb(): StudyDatabase {
  if (!isBrowser) {
    throw new Error("Database can only be accessed in the browser");
  }
  if (!db) {
    db = new StudyDatabase();
    // Initialize with default values if needed
    db.on("populate", () => {
      db?.settings.add({
        id: "main",
        pomodoroLength: 25,
        breakLength: 5,
        autoResumeEnabled: true,
        keyboardShortcutsEnabled: true,
        defaultPlaybackSpeed: 1,
        totalWatchTime: 0,
      });
      db?.streak.add({
        id: "main",
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: "",
        studyDates: [],
      });
    });
  }
  return db;
}
