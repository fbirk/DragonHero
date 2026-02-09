import { openDB, type IDBPDatabase } from 'idb';

export interface SaveData {
  version: number;
  highestLevelCompleted: string | null;
  totalPlayTime: number;
  lastSaved: string;
}

const DB_NAME = 'dragonhero-saves';
const STORE_NAME = 'saves';
const SAVE_KEY = 'currentSave';
const CURRENT_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveGame(data: Omit<SaveData, 'version' | 'lastSaved'>): Promise<void> {
  const db = await getDB();
  const saveData: SaveData = {
    version: CURRENT_VERSION,
    highestLevelCompleted: data.highestLevelCompleted,
    totalPlayTime: data.totalPlayTime,
    lastSaved: new Date().toISOString(),
  };
  await db.put(STORE_NAME, saveData, SAVE_KEY);
}

export async function loadGame(): Promise<SaveData | null> {
  const db = await getDB();
  const data = await db.get(STORE_NAME, SAVE_KEY);
  if (!data) return null;

  const save = data as SaveData;
  if (typeof save.version !== 'number' || save.version > CURRENT_VERSION) {
    return null;
  }
  return save;
}

export async function deleteSave(): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, SAVE_KEY);
}

export function exportSave(data: SaveData): string {
  return JSON.stringify(data, null, 2);
}

export function importSave(json: string): SaveData | null {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed.version !== 'number') return null;
    if (parsed.version > CURRENT_VERSION) return null;
    return parsed as SaveData;
  } catch {
    return null;
  }
}

export function createDefaultSave(): SaveData {
  return {
    version: CURRENT_VERSION,
    highestLevelCompleted: null,
    totalPlayTime: 0,
    lastSaved: new Date().toISOString(),
  };
}
