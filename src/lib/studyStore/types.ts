export interface Note {
  id: string;
  videoId: string;
  timestamp: string;
  content: string;
  createdAt: string;
  tags?: string[];
  importance?: "high" | "medium" | "low" | "none";
}

export interface Bookmark {
  id: string;
  videoId: string;
  timestamp: string;
  label: string;
  createdAt: string;
}

export interface VideoProgress {
  videoId: string;
  completed: boolean;
  lastWatched: string;
  watchedPercentage: number;
  rating: number;
  lastPosition?: number; // in seconds
}

export interface VideoStudyData {
  notes: Note[];
  bookmarks: Bookmark[];
  progress: VideoProgress;
}

export interface FavoriteVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  addedAt: string;
}

export interface WatchLaterItem {
  videoId: string;
  title: string;
  thumbnail: string;
  addedAt: string;
  priority: "low" | "medium" | "high";
}

export interface StudySession {
  id: string;
  videoId: string;
  videoTitle: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  notes: string;
  focusMode: boolean;
}

export interface StudyStreak {
  id: string; // Always "main" - singleton record
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[]; // ISO date strings (YYYY-MM-DD)
}

export interface StudySettings {
  id: string; // Always "main" - singleton record
  pomodoroLength: number; // in minutes
  breakLength: number; // in minutes
  autoResumeEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  defaultPlaybackSpeed: number;
  totalWatchTime: number; // in seconds
}

export interface GlobalStats {
  totalVideosWatched: number;
  totalVideosCompleted: number;
  totalNotes: number;
  totalBookmarks: number;
  totalWatchTime: number; // seconds
  totalStudySessions: number;
  averageRating: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCount: number;
  watchLaterCount: number;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  notes: Note[];
  bookmarks: Bookmark[];
  videoProgress: VideoProgress[];
  favorites: FavoriteVideo[];
  watchLater: WatchLaterItem[];
  sessions: StudySession[];
  streak: StudyStreak | null;
  settings: StudySettings | null;
}

export interface GlobalStudyData {
  favorites: FavoriteVideo[];
  watchLater: WatchLaterItem[];
  sessions: StudySession[];
  streak: StudyStreak;
  settings: StudySettings;
  totalWatchTime: number;
}
