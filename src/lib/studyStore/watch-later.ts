import { getDb, isBrowser } from "./db";
import type { WatchLaterItem } from "./types";

export async function addToWatchLaterAsync(
  video: { id: string; title: string; thumbnail: string },
  priority: "low" | "medium" | "high" = "medium"
): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const existing = await database.watchLater.get(video.id);
    
    if (!existing) {
      await database.watchLater.put({
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        addedAt: new Date().toISOString(),
        priority,
      });
    }
  } catch (e) {
    console.error("Error adding to watch later:", e);
  }
}

export async function removeFromWatchLaterAsync(videoId: string): Promise<void> {
  if (!isBrowser) return;
  
  try {
    await getDb().watchLater.delete(videoId);
  } catch (e) {
    console.error("Error removing from watch later:", e);
  }
}

export async function isInWatchLaterAsync(videoId: string): Promise<boolean> {
  if (!isBrowser) return false;
  
  try {
    const item = await getDb().watchLater.get(videoId);
    return !!item;
  } catch {
    return false;
  }
}

export async function getWatchLaterAsync(): Promise<WatchLaterItem[]> {
  if (!isBrowser) return [];
  
  try {
    const items = await getDb().watchLater.toArray();
    // Sort by priority (high > medium > low) then by addedAt
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return items.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    });
  } catch {
    return [];
  }
}
