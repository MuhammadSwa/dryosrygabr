import type { StudySettings, StudyStreak, VideoProgress } from "./types";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDefaultSettings(): StudySettings {
  return {
    id: "main",
    pomodoroLength: 25,
    breakLength: 5,
    autoResumeEnabled: true,
    keyboardShortcutsEnabled: true,
    defaultPlaybackSpeed: 1,
    totalWatchTime: 0,
  };
}

export function getDefaultStreak(): StudyStreak {
  return {
    id: "main",
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: "",
    studyDates: [],
  };
}

export function getDefaultVideoProgress(videoId: string): VideoProgress {
  return {
    videoId,
    completed: false,
    lastWatched: new Date().toISOString(),
    watchedPercentage: 0,
    rating: 0,
  };
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} ساعة ${minutes > 0 ? `و ${minutes} دقيقة` : ""}`;
  }
  return `${minutes} دقيقة`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;

  return date.toLocaleDateString("ar-EG", {
    month: "short",
    day: "numeric",
  });
}
