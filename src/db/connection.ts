import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../res/macktime.db');

const db = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
});

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;