import type { CompanyContext } from "@/shared/types";
import { detectLinkedIn } from "./linkedin";
import { detectGlassdoor } from "./glassdoor";
import { detectIndeed } from "./indeed";
import { detectWorkable } from "./workable";
import { detectDomain } from "./domain";

/**
 * @param url - Current page URL.
 * @returns Best-effort company context (never throws).
 */
export function detectCompanyContext(url: URL): CompanyContext {
  const li = detectLinkedIn(url);
  if (li !== null) {
    return li;
  }

  const gd = detectGlassdoor(url);
  if (gd !== null) {
    return gd;
  }

  const id = detectIndeed(url);
  if (id !== null) {
    return id;
  }

  const wk = detectWorkable(url);
  if (wk !== null) {
    return wk;
  }

  return detectDomain(url);
}
