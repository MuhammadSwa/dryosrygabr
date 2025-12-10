import { getDb, isBrowser } from "./db";

export async function getRecentlyWatchedAsync(limit: number = 10): Promise<{ videoId: string; lastWatched: string; percentage: number }[]> {
  if (!isBrowser) return [];
  
  try {
    const progress = await getDb().videoProgress
      .filter(p => p.watchedPercentage > 0)
      .toArray();
    
    return progress
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
      .slice(0, limit)
      .map(p => ({
        videoId: p.videoId,
        lastWatched: p.lastWatched,
        percentage: p.watchedPercentage,
      }));
  } catch {
    return [];
  }
}
