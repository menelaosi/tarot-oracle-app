import { Pool, type PoolClient } from 'pg';

// DATABASE_URL (hosted Postgres) wins; otherwise fall back to local PG* vars,
// defaulting the user to the OS user so a bare local setup works with no config.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    });

/** Roll back a transaction and always return the client to the pool. */
export async function rollback(client: PoolClient) {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}
