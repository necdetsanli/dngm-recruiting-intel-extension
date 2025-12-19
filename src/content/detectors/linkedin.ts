import type { CompanyContext } from "@/shared/types";

/**
 * @param url - Current page URL.
 * @returns LinkedIn company context or null.
 */
export function detectLinkedIn(url: URL): CompanyContext | null {
  if (url.hostname !== "www.linkedin.com") {
    return null;
  }

  const parts = url.pathname.split("/").filter((p) => p.length > 0);
  const idx = parts.indexOf("company");
  if (idx < 0) {
    return null;
  }

  const slug = parts[idx + 1];
  if (typeof slug !== "string" || slug.length === 0) {
    return null;
  }

  return { source: "linkedin", key: slug };
}
