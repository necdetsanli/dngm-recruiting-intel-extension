import type { CompanyContext } from "@/shared/types";

/**
 * Best-effort Glassdoor employer id extraction.
 *
 * @param url - Current page URL.
 * @returns Glassdoor company context or null.
 */
export function detectGlassdoor(url: URL): CompanyContext | null {
  if (url.hostname !== "www.glassdoor.com") {
    return null;
  }

  const match = url.pathname.match(/EI(?:_IE)?(\d+)/);
  const id = match?.[1];
  if (typeof id !== "string" || id.length === 0) {
    return null;
  }

  return { source: "glassdoor", key: id };
}
