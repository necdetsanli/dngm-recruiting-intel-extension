/**
 * Normalize and validate an API base URL.
 *
 * Security:
 * - Only http/https.
 * - No credentials.
 * - Strips path/query/hash, keeps origin.
 *
 * @param input - User-provided base URL.
 * @returns Normalized origin string.
 * @throws Error if invalid.
 */
export function normalizeApiBaseUrl(input: string): string {
  const trimmed = input.trim();
  const parsed = new URL(trimmed);

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("API base URL must be http(s).");
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    throw new Error("API base URL must not include credentials.");
  }

  return parsed.origin;
}
