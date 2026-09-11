// Loads environment variables before any other module reads process.env.
// Must stay the first import in the entrypoint (index.ts).
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
