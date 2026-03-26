// storage/sqlitedb.js
// Exp 05 — Introduction to SQLite storage
// Uses expo-sqlite for structured local data

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("calloryx.db");

// Create meetings table if it doesn't exist
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      duration TEXT
    );
  `);
};

// Insert a new meeting record
export const insertMeeting = (title, status, duration) => {
  db.runSync(
    "INSERT INTO meetings (title, status, duration) VALUES (?, ?, ?);",
    [title, status, duration],
  );
};

// Fetch all meetings from the table
export const getAllMeetings = () => {
  const rows = db.getAllSync("SELECT * FROM meetings;");
  return rows;
};

// Delete a meeting by id
export const deleteMeeting = (id) => {
  db.runSync("DELETE FROM meetings WHERE id = ?;", [id]);
};
