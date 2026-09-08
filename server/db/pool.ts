import { Pool, type PoolClient } from 'pg';

// DATABASE_URL (hosted Postgres) wins; otherwise fall back to local PG* vars,
// defaulting the user to the OS user so a bare local setup works with no config.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    });

/**
 * Runs `work` inside a transaction on a dedicated client: BEGIN, then COMMIT on
 * success or ROLLBACK on throw, and always releases the client back to the pool.
 */
export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    // Don't let a failed rollback mask the original error.
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
