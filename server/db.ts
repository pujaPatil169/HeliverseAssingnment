import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import pg from 'pg';

// Load environment variables from .env file
config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Create a proper pg.Pool for session store
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the postgres client for Drizzle
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

console.log('PostgreSQL database connection initialized');

export { db, pgPool as pool };
