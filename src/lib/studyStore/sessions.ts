import { getDb, isBrowser } from "./db";
import { generateId, getTodayDate, getDefaultStreak, getDefaultSettings } from "./utils";
import type { StudySession } from "./types";

export async function updateStudyStreakAsync(): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const today = getTodayDate();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    let streak = await database.streak.get("main");
    if (!streak) {
      streak = getDefaultStreak();
    }
    
    if (streak.lastStudyDate === today) {
      // Already studied today
      return;
    }
    
    if (!streak.studyDates.includes(today)) {
      streak.studyDates.push(today);
    }
    
    if (streak.lastStudyDate === yesterday) {
      // Consecutive day
      streak.currentStreak++;
    } else if (streak.lastStudyDate !== today) {
      // Streak broken
      streak.currentStreak = 1;
    }
    
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    
    streak.lastStudyDate = today;
    await database.streak.put(streak);
  } catch (e) {
    console.error("Error updating streak:", e);
  }
}

export async function startStudySessionAsync(videoId: string, videoTitle: string, focusMode: boolean = false): Promise<string> {
  if (!isBrowser) return "";
  
  try {
    const sessionId = generateId();
    
    await getDb().sessions.put({
      id: sessionId,
      videoId,
      videoTitle,
      startTime: new Date().toISOString(),
      duration: 0,
      notes: "",
      focusMode,
    });
    
    // Update streak
    await updateStudyStreakAsync();
    
    return sessionId;
  } catch (e) {
    console.error("Error starting session:", e);
    return "";
  }
}

export async function endStudySessionAsync(sessionId: string, notes: string = ""): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const session = await database.sessions.get(sessionId);
    
    if (session && !session.endTime) {
      session.endTime = new Date().toISOString();
      session.duration = Math.floor(
        (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000
      );
      session.notes = notes;
      
      await database.sessions.put(session);
      
      // Update total watch time
      const settings = (await database.settings.get("main")) || getDefaultSettings();
      settings.totalWatchTime += session.duration;
      await database.settings.put(settings);
    }
  } catch (e) {
    console.error("Error ending session:", e);
  }
}

export async function getRecentSessionsAsync(limit: number = 10): Promise<StudySession[]> {
  if (!isBrowser) return [];
  
  try {
    const sessions = await getDb().sessions
      .orderBy("startTime")
      .reverse()
      .filter(s => !!s.endTime)
      .limit(limit)
      .toArray();
    return sessions;
  } catch {
    return [];
  }
}
