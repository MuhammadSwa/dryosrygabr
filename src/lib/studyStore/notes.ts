import { getDb, isBrowser } from "./db";
import type { Note, Bookmark } from "./types";

export async function searchNotesAsync(query: string): Promise<Note[]> {
  if (!isBrowser || !query.trim()) return [];
  
  try {
    const allNotes = await getDb().notes.toArray();
    const lowerQuery = query.toLowerCase();
    
    return allNotes.filter(note =>
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch {
    return [];
  }
}

export async function getAllNotesAsync(): Promise<Note[]> {
  if (!isBrowser) return [];
  
  try {
    return await getDb().notes.orderBy("createdAt").reverse().toArray();
  } catch {
    return [];
  }
}

export async function getAllBookmarksAsync(): Promise<Bookmark[]> {
  if (!isBrowser) return [];
  
  try {
    return await getDb().bookmarks.orderBy("createdAt").reverse().toArray();
  } catch {
    return [];
  }
}

export async function getNotesByVideoIdAsync(videoId: string): Promise<Note[]> {
  if (!isBrowser) return [];
  
  try {
    return await getDb().notes.where("videoId").equals(videoId).toArray();
  } catch {
    return [];
  }
}

export async function getBookmarksByVideoIdAsync(videoId: string): Promise<Bookmark[]> {
  if (!isBrowser) return [];
  
  try {
    return await getDb().bookmarks.where("videoId").equals(videoId).toArray();
  } catch {
    return [];
  }
}
