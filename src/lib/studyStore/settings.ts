import { getDb, isBrowser } from "./db";
import { getDefaultSettings } from "./utils";
import type { StudySettings } from "./types";

export async function getSettingsAsync(): Promise<StudySettings> {
  if (!isBrowser) return getDefaultSettings();
  
  try {
    const settings = await getDb().settings.get("main");
    return settings || getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export async function updateSettingsAsync(newSettings: Partial<StudySettings>): Promise<void> {
  if (!isBrowser) return;
  
  try {
    const database = getDb();
    const existing = (await database.settings.get("main")) || getDefaultSettings();
    await database.settings.put({ ...existing, ...newSettings, id: "main" });
  } catch (e) {
    console.error("Error updating settings:", e);
  }
}
