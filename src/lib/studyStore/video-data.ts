import { getDb, isBrowser } from "./db";
import { getDefaultVideoProgress } from "./utils";
import type { VideoStudyData } from "./types";

export async function loadVideoStudyDataAsync(videoId: string): Promise<VideoStudyData> {
  if (!isBrowser) {
    return {
      notes: [],
      bookmarks: [],
      progress: getDefaultVideoProgress(videoId),
    };
  }

  try {
    const database = getDb();
    const [notes, bookmarks, progress] = await Promise.all([
      database.notes.where("videoId").equals(videoId).toArray(),
      database.bookmarks.where("videoId").equals(videoId).toArray(),
      database.videoProgress.get(videoId),
    ]);

    return {
      notes: notes || [],
      bookmarks: bookmarks || [],
      progress: progress || getDefaultVideoProgress(videoId),
    };
  } catch (e) {
    console.error("Error loading video study data:", e);
    return {
      notes: [],
      bookmarks: [],
      progress: getDefaultVideoProgress(videoId),
    };
  }
}

export async function saveVideoStudyDataAsync(videoId: string, data: VideoStudyData): Promise<void> {
  if (!isBrowser) return;

  try {
    const database = getDb();
    
    await database.transaction("rw", [database.notes, database.bookmarks, database.videoProgress], async () => {
      // Clear existing notes and bookmarks for this video
      await database.notes.where("videoId").equals(videoId).delete();
      await database.bookmarks.where("videoId").equals(videoId).delete();
      
      // Add new notes with videoId
      if (data.notes.length > 0) {
        const notesWithVideoId = data.notes.map(n => ({ ...n, videoId }));
        await database.notes.bulkPut(notesWithVideoId);
      }
      
      // Add new bookmarks with videoId
      if (data.bookmarks.length > 0) {
        const bookmarksWithVideoId = data.bookmarks.map(b => ({ ...b, videoId }));
        await database.bookmarks.bulkPut(bookmarksWithVideoId);
      }
      
      // Update progress
      await database.videoProgress.put({ ...data.progress, videoId });
    });
  } catch (e) {
    console.error("Error saving video study data:", e);
  }
}

export async function getVideoPositionAsync(videoId: string): Promise<number> {
  if (!isBrowser) return 0;
  
  try {
    const progress = await getDb().videoProgress.get(videoId);
    return progress?.lastPosition || 0;
  } catch {
    return 0;
  }
}

export async function saveVideoPositionAsync(videoId: string, position: number): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const existing = await database.videoProgress.get(videoId);
    
    await database.videoProgress.put({
      ...(existing || getDefaultVideoProgress(videoId)),
      videoId,
      lastPosition: position,
      lastWatched: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error saving video position:", e);
  }
}
