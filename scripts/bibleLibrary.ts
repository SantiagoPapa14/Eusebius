import { readingType } from "./EusebiusTypes";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

async function openDatabase(
  pathToDatabaseFile: string
): Promise<SQLite.WebSQLDatabase> {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite"
    );
  }
  const asset = await Asset.fromModule(
    require("../assets/eusebius.db")
  ).downloadAsync();

  await FileSystem.copyAsync({
    from: asset.localUri,
    to: FileSystem.documentDirectory + "SQLite/eusebius.db",
  });
  return await SQLite.openDatabaseAsync("eusebius.db");
}

export const fetchVerses = async (reading: readingType, language: string) => {
  const db = await openDatabase("eusebius.db");
  const allRows = await db.getAllAsync(
    `SELECT * FROM ${language}Bible WHERE book = ? AND chapter = ? AND verse BETWEEN ? AND ?`,
    [reading.book, reading.chapter, reading.verses.start, reading.verses.end]
  );
  return allRows;
};
