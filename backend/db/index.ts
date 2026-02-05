import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

// Create SQLite database
const sqlite = new Database('./db/app.db');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });
