const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'openseo.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    results TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seed TEXT NOT NULL,
    keyword TEXT NOT NULL,
    volume INTEGER,
    difficulty INTEGER,
    cpc REAL,
    competition TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS backlinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ranks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL,
    domain TEXT NOT NULL,
    rank INTEGER,
    change INTEGER,
    history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
