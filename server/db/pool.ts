import { Pool, type PoolClient } from 'pg';

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    });

export async function rollback(client: PoolClient) {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}
