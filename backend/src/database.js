const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../cms.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT DEFAULT '{}',
    html TEXT DEFAULT '',
    css TEXT DEFAULT '',
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Migrate existing pages table to add columns if they don't exist
const pageColumns = db.prepare('PRAGMA table_info(pages)').all().map(c => c.name);
if (!pageColumns.includes('html')) db.exec("ALTER TABLE pages ADD COLUMN html TEXT DEFAULT ''");
if (!pageColumns.includes('css')) db.exec("ALTER TABLE pages ADD COLUMN css TEXT DEFAULT ''");
if (!pageColumns.includes('meta_title')) db.exec("ALTER TABLE pages ADD COLUMN meta_title TEXT DEFAULT ''");
if (!pageColumns.includes('meta_description')) db.exec("ALTER TABLE pages ADD COLUMN meta_description TEXT DEFAULT ''");

module.exports = db;
