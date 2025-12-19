import type { CompanyContext } from "@/shared/types";

/**
 * @param url - Current page URL.
 * @returns Domain-based company context.
 */
export function detectDomain(url: URL): CompanyContext {
  const host = url.hostname.startsWith("www.") ? url.hostname.slice(4) : url.hostname;
  return { source: "domain", key: host };
}
