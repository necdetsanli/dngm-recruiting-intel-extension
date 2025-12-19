import type { JSX } from "react";
import browser from "webextension-polyfill";

/**
 * Minimal popup. SRP: only navigation to Options.
 *
 * @returns JSX element.
 */
export function App(): JSX.Element {
  return (
    <div style={{ padding: 12, width: 280, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>DNGM Recruiting Intel</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
        Configure optional all-sites mode and API base URL in Options.
      </div>
      <button
        type="button"
        onClick={() => {
          void browser.runtime.openOptionsPage();
        }}
      >
        Open Options
      </button>
    </div>
  );
}
