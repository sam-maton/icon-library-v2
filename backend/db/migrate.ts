import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

// Create SQLite database
const sqlite = new Database('./db/app.db');

// Create Drizzle instance
const db = drizzle(sqlite, { schema });

// Run migrations
console.log('Running migrations...');
migrate(db, { migrationsFolder: './db/migrations' });
console.log('Migrations complete!');

sqlite.close();
