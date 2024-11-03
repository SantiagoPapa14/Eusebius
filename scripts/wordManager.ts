import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
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
    from: asset.localUri ? asset.localUri : asset.uri,
    to: FileSystem.documentDirectory + "SQLite/eusebius.db",
  });
  return await SQLite.openDatabaseAsync("eusebius.db");
}

export const addWord = async (word: string) => {
  const db = await openDatabase();
  await db.runAsync(`INSERT INTO words (word) VALUES (?)`, [word]);
  await db.closeAsync();
};

export const getWords = async () => {
  const db = await openDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM words");
  await db.closeAsync();
  return allRows;
};
