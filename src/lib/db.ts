import { openDB } from "idb";

const DB_NAME = "resumeDB";
const STORE_NAME = "resumes";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function saveResume(text: string) {
  const db = await initDB();
  await db.add(STORE_NAME, {
    text,
    createdAt: new Date().toISOString(),
  });
}

export async function getResumes() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}
