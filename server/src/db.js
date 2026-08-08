const path = require('path')
const fs = require('fs')
const { DatabaseSync } = require('node:sqlite')
require('dotenv').config()

const envDbPath = process.env.DB_PATH || './data/qrcode.sqlite'
const dbPath = path.isAbsolute(envDbPath)
  ? envDbPath
  : path.resolve(__dirname, '..', envDbPath)
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const db = new DatabaseSync(dbPath)

db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS qrcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    design TEXT,
    short_id TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS scan_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    qrcode_id INTEGER NOT NULL,
    scanned_at TEXT NOT NULL DEFAULT (datetime('now')),
    ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    FOREIGN KEY (qrcode_id) REFERENCES qrcodes(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_qrcodes_user ON qrcodes(user_id);
  CREATE INDEX IF NOT EXISTS idx_qrcodes_short ON qrcodes(short_id);
  CREATE INDEX IF NOT EXISTS idx_scans_qrcode ON scan_logs(qrcode_id);
`)

module.exports = db
