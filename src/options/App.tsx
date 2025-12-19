import { useEffect, useMemo, useState } from "react";
import browser from "webextension-polyfill";
import { loadSettings, saveSettings } from "@/shared/settings";
import { normalizeApiBaseUrl } from "@/shared/safeUrl";
import type { JSX } from "react";

const ALL_SITES_ORIGINS = ["http://*/*", "https://*/*"] as const;

/**
 * Options page.
 * SRP: Settings UI + permissions toggle.
 */
export function App(): JSX.Element {
  const origins = useMemo(() => [...ALL_SITES_ORIGINS], []);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>("https://www.donotghostme.com");
  const [allSitesEnabled, setAllSitesEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    void (async () => {
      const s = await loadSettings();
      setApiBaseUrl(s.apiBaseUrl);
      setAllSitesEnabled(s.allSitesEnabled);
    })();
  }, []);

  /**
   * @returns Promise.
   */
  async function onSaveApiBaseUrl(): Promise<void> {
    try {
      const normalized = normalizeApiBaseUrl(apiBaseUrl);
      await saveSettings({ apiBaseUrl: normalized });
      setApiBaseUrl(normalized);
      setStatus("Saved API base URL.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid URL";
      setStatus(msg);
    }
  }

  /**
   * @param next - Toggle state.
   * @returns Promise.
   */
  async function onToggleAllSites(next: boolean): Promise<void> {
    if (next === true) {
      const granted = await browser.permissions.request({ origins });
      if (granted !== true) {
        setStatus("Permission denied.");
        setAllSitesEnabled(false);
        await saveSettings({ allSitesEnabled: false });
        return;
      }

      setAllSitesEnabled(true);
      await saveSettings({ allSitesEnabled: true });
      await browser.runtime.sendMessage({ type: "SET_ALL_SITES_ENABLED" });
      setStatus("All-sites mode enabled.");
      return;
    }

    setAllSitesEnabled(false);
    await saveSettings({ allSitesEnabled: false });
    await browser.runtime.sendMessage({ type: "SET_ALL_SITES_ENABLED" });

    try {
      await browser.permissions.remove({ origins });
    } catch {
      // Ignore remove failures (e.g., already removed).
    }

    setStatus("All-sites mode disabled.");
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ marginTop: 0 }}>Recruiting Intel Options</h2>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>DNMG API Base URL</div>
        <input
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          placeholder="https://www.donotghostme.com"
        />
        <div style={{ marginTop: 8 }}>
          <button type="button" onClick={() => void onSaveApiBaseUrl()}>
            Save
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={allSitesEnabled}
            onChange={(e) => void onToggleAllSites(e.target.checked)}
          />
          Enable on all sites (optional permission)
        </label>
      </div>

      <div style={{ fontSize: 12, opacity: 0.8 }}>{status}</div>
    </div>
  );
}
