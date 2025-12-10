import { getDb, isBrowser } from "./db";
import type { GlobalStats } from "./types";

export async function calculateGlobalStatsAsync(): Promise<GlobalStats> {
  if (!isBrowser) {
    return {
      totalVideosWatched: 0,
      totalVideosCompleted: 0,
      totalNotes: 0,
      totalBookmarks: 0,
      totalWatchTime: 0,
      totalStudySessions: 0,
      averageRating: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteCount: 0,
      watchLaterCount: 0,
    };
  }

  try {
    const database = getDb();
    
    const [
      allProgress,
      notesCount,
      bookmarksCount,
      sessionsCount,
      favoritesCount,
      watchLaterCount,
      streak,
      settings,
    ] = await Promise.all([
      database.videoProgress.toArray(),
      database.notes.count(),
      database.bookmarks.count(),
      database.sessions.count(),
      database.favorites.count(),
      database.watchLater.count(),
      database.streak.get("main"),
      database.settings.get("main"),
    ]);

    const watchedVideos = allProgress.filter(p => p.watchedPercentage > 0);
    const completedVideos = allProgress.filter(p => p.completed);
    const ratedVideos = allProgress.filter(p => p.rating > 0);
    const totalRating = ratedVideos.reduce((sum, p) => sum + p.rating, 0);

    return {
      totalVideosWatched: watchedVideos.length,
      totalVideosCompleted: completedVideos.length,
      totalNotes: notesCount,
      totalBookmarks: bookmarksCount,
      totalWatchTime: settings?.totalWatchTime || 0,
      totalStudySessions: sessionsCount,
      averageRating: ratedVideos.length > 0 ? Math.round((totalRating / ratedVideos.length) * 10) / 10 : 0,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      favoriteCount: favoritesCount,
      watchLaterCount: watchLaterCount,
    };
  } catch (e) {
    console.error("Error calculating stats:", e);
    return {
      totalVideosWatched: 0,
      totalVideosCompleted: 0,
      totalNotes: 0,
      totalBookmarks: 0,
      totalWatchTime: 0,
      totalStudySessions: 0,
      averageRating: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteCount: 0,
      watchLaterCount: 0,
    };
  }
}
