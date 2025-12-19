import type { CompanyContext } from "@/shared/types";

/**
 * @param url - Current page URL.
 * @returns Workable company context or null.
 */
export function detectWorkable(url: URL): CompanyContext | null {
  if (url.hostname === "apply.workable.com") {
    const parts = url.pathname.split("/").filter((p) => p.length > 0);
    const key = parts[0];
    if (typeof key !== "string" || key.length === 0) {
      return null;
    }
    return { source: "workable", key };
  }

  if (url.hostname.endsWith(".workable.com")) {
    const sub = url.hostname.replace(".workable.com", "");
    if (sub.length === 0 || sub === "www") {
      return null;
    }
    return { source: "workable", key: sub };
  }

  return null;
}
