import { getDb, isBrowser } from "./db";
import type { FavoriteVideo } from "./types";

export async function addToFavoritesAsync(video: { id: string; title: string; thumbnail: string }): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const existing = await database.favorites.get(video.id);
    
    if (!existing) {
      await database.favorites.put({
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        addedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error("Error adding to favorites:", e);
  }
}

export async function removeFromFavoritesAsync(videoId: string): Promise<void> {
  if (!isBrowser) return;
  
  try {
    await getDb().favorites.delete(videoId);
  } catch (e) {
    console.error("Error removing from favorites:", e);
  }
}

export async function isFavoriteAsync(videoId: string): Promise<boolean> {
  if (!isBrowser) return false;
  
  try {
    const fav = await getDb().favorites.get(videoId);
    return !!fav;
  } catch {
    return false;
  }
}

export async function getFavoritesAsync(): Promise<FavoriteVideo[]> {
  if (!isBrowser) return [];
  
  try {
    return await getDb().favorites.orderBy("addedAt").reverse().toArray();
  } catch {
    return [];
  }
}
