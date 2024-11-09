import { massReadingsType, readingType } from "../constants/EusebiusTypes";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

let db: any = null;

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync("eusebius.db");
}

export const fetchVerses = async (
  reading: readingType,
  language: string
): Promise<Array<string>> => {
  if (!db) {
    db = await openDatabase();
  }
  const allRows = await db.getAllAsync(
    `SELECT * FROM ${language}Bible WHERE book = ? AND chapter = ? AND verse BETWEEN ? AND ?`,
    [reading.book, reading.chapter, reading.verses.start, reading.verses.end]
  );
  return allRows as Array<string>;
};

export const populateReadings = async (readingsData: massReadingsType) => {
  return await Promise.all(
    Object.entries(readingsData).map(async ([key, value]) => {
      if (value) {
        value.latinContent = await fetchVerses(value, "Latin");
        value.englishContent = await fetchVerses(value, "English");
      }
      return [key, value];
    })
  );
};

export const addWord = async (
  word: string,
  definition: string
): Promise<boolean> => {
  if (!db) {
    db = await openDatabase();
  }
  try {
    await db.runAsync(`INSERT INTO Word (word, definition) VALUES (?, ?)`, [
      word,
      definition,
    ]);
    return true;
  } catch (e) {
    return false;
  }
};

export const getWords = async () => {
  if (!db) {
    db = await openDatabase();
  }
  const allRows = await db.getAllAsync("SELECT * FROM Word");
  return allRows;
};
