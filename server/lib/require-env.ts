/**
 * Reads a required environment variable, throwing immediately if it's unset.
 * Call at module scope (not inside a request handler) so a missing var fails
 * loudly at process boot, not on the first request that happens to need it.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
