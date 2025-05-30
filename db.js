import Database from 'better-sqlite3';

const db = new Database('ganhos.sqlite');

db.prepare(`
  CREATE TABLE IF NOT EXISTS ganhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL UNIQUE,
    valor REAL NOT NULL
  )
`).run();

export default db;
