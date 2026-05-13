/**
 * utility script to create an account for testing purposes
 * will be modified to allow for a user to create their own password
 */

import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve(__dirname, '../../res/macktime.db'));

async function createAccount(company: string, pass: string) {
    const hash = await bcrypt.hash(pass, 10);
    const stmt = db.prepare('INSERT INTO accounts (company_name, password_hash) VALUES (?, ?)');
    stmt.run(company, hash);
    console.log(`Account created for ${company}`);
}

createAccount("PFv Performance", "test");