// Import the SQLite library we installed
const Database = require("better-sqlite3");
const path = require("path");

// Open (or create) a file called database.sqlite
// path.join makes sure the path works on all operating systems
const db = new Database(path.join(__dirname, "..", "database.sqlite"));

// WAL mode = better performance. Always add this for SQLite.
db.pragma("journal_mode = WAL");

// Create the users table if it doesn't exist yet

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Database ready!");

module.exports = db;
