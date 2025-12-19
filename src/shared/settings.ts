import browser from "webextension-polyfill";
import type { Settings } from "./types";
import { normalizeApiBaseUrl } from "./safeUrl";

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS: Settings = {
  apiBaseUrl: "https://donotghost.me",
  allSitesEnabled: false,
};

/**
 * @param value - Unknown input.
 * @returns True if value is a settings-like record.
 */
function isSettingsLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * @returns Resolved, validated settings.
 */
export async function loadSettings(): Promise<Settings> {
  const result = await browser.storage.local.get(SETTINGS_KEY);
  const raw = result[SETTINGS_KEY];

  if (isSettingsLike(raw) !== true) {
    return DEFAULT_SETTINGS;
  }

  const apiBaseRaw = raw["apiBaseUrl"];
  const allSitesRaw = raw["allSitesEnabled"];

  const apiBaseUrl =
    typeof apiBaseRaw === "string" ? normalizeApiBaseUrl(apiBaseRaw) : DEFAULT_SETTINGS.apiBaseUrl;

  const allSitesEnabled =
    typeof allSitesRaw === "boolean" ? allSitesRaw : DEFAULT_SETTINGS.allSitesEnabled;

  return { apiBaseUrl, allSitesEnabled };
}

/**
 * @param next - Partial update.
 * @returns Persisted settings.
 */
export async function saveSettings(next: Partial<Settings>): Promise<Settings> {
  const current = await loadSettings();
  const merged: Settings = { ...current, ...next };
  await browser.storage.local.set({ [SETTINGS_KEY]: merged });
  return merged;
}
