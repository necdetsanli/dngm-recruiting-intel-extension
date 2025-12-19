import type { CompanyContext } from "@/shared/types";

/**
 * @param url - Current page URL.
 * @returns Indeed company context or null.
 */
export function detectIndeed(url: URL): CompanyContext | null {
  if (url.hostname !== "www.indeed.com") {
    return null;
  }

  const parts = url.pathname.split("/").filter((p) => p.length > 0);
  if (parts[0] !== "cmp") {
    return null;
  }

  const key = parts[1];
  if (typeof key !== "string" || key.length === 0) {
    return null;
  }

  return { source: "indeed", key };
}
