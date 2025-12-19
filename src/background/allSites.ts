import browser from "webextension-polyfill";
import { loadSettings } from "@/shared/settings";

const ALL_SITES_SCRIPT_ID = "all-sites";
const ALL_SITES_ORIGINS = ["http://*/*", "https://*/*"] as const;

export const DEFAULT_SITE_MATCHES: readonly string[] = [
  "https://www.linkedin.com/*",
  "https://www.glassdoor.com/*",
  "https://www.indeed.com/*",
  "https://apply.workable.com/*",
  "https://*.workable.com/*",
] as const;

/**
 * Ensure all-sites content script is registered if and only if:
 * - settings.allSitesEnabled === true
 * - optional host permissions are granted
 *
 * @returns Promise resolving when the registration is reconciled.
 */
export async function reconcileAllSites(): Promise<void> {
  const settings = await loadSettings();

  if (settings.allSitesEnabled !== true) {
    await safeUnregisterAllSites();
    return;
  }

  const granted = await browser.permissions.contains({ origins: [...ALL_SITES_ORIGINS] });
  if (granted !== true) {
    await safeUnregisterAllSites();
    return;
  }

  const registered = await browser.scripting.getRegisteredContentScripts();
  const already = registered.some((s) => s.id === ALL_SITES_SCRIPT_ID);
  if (already === true) {
    return;
  }

  // Avoid double-injecting on default supported sites by excluding those matches.
  await browser.scripting.registerContentScripts([
    {
      id: ALL_SITES_SCRIPT_ID,
      matches: [...ALL_SITES_ORIGINS],
      excludeMatches: [...DEFAULT_SITE_MATCHES],
      js: ["scripts/content.js"],
      runAt: "document_idle",
    },
  ]);
}

/**
 * Best-effort unregister; ignore "not registered" errors.
 *
 * @returns Promise resolving after attempting to unregister.
 */
export async function safeUnregisterAllSites(): Promise<void> {
  try {
    await browser.scripting.unregisterContentScripts({ ids: [ALL_SITES_SCRIPT_ID] });
  } catch {
    // Intentionally ignored.
  }
}
