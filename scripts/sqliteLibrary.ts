import { massReadingsType, readingType } from "../constants/EusebiusTypes";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

let db: any = null;

const dbName = "eusebius.db";
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  // Check if database already exists in the document directory
  const fileInfo = await FileSystem.getInfoAsync(dbPath);

  if (!fileInfo.exists) {
    // If the database file is not in document directory, copy it from the asset folder
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(
      Asset.fromModule(require("../assets/eusebius.db")).uri,
      dbPath
    );
  }

  return await SQLite.openDatabaseAsync(dbName);
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
