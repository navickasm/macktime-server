import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const db = new Database(path.resolve(__dirname, '../../res/macktime.db'));

export const runMigrations = () => {
    const migrationsPath = path.resolve(__dirname, '../../res/migrations');

    const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();

    console.log(`Found ${migrationFiles.length} migrations...`);

    const executeMigrations = db.transaction(() => {
        for (const file of migrationFiles) {
            const filePath = path.join(migrationsPath, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                db.exec(sql);
                console.log(`Successfully ran: ${file}`);
            } catch (err) {
                console.error(`Error in migration ${file}:`, err);
                throw err;
            }
        }
    });

    try {
        executeMigrations();
        console.log("All migrations completed successfully.");
    } catch (err) {
        console.error("Migration failed. No changes were applied.");
    }
};

runMigrations();