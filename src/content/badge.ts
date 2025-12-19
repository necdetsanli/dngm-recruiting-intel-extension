import type { CompanyContext, IntelResult } from "@/shared/types";

const ROOT_ID = "dngm-recruiting-intel-root";

type BadgeState =
  | { status: "loading"; ctx: CompanyContext }
  | { status: "ready"; ctx: CompanyContext; result: IntelResult };

/**
 * @returns Shadow root host element.
 */
function ensureHost(): { host: HTMLDivElement; shadow: ShadowRoot } {
  const existing = document.getElementById(ROOT_ID);
  if (existing instanceof HTMLDivElement) {
    const shadow = existing.shadowRoot ?? existing.attachShadow({ mode: "open" });
    return { host: existing, shadow };
  }

  const host = document.createElement("div");
  host.id = ROOT_ID;
  host.style.position = "fixed";
  host.style.right = "16px";
  host.style.bottom = "16px";
  host.style.zIndex = "2147483647";
  host.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

  const shadow = host.attachShadow({ mode: "open" });
  document.documentElement.appendChild(host);

  return { host, shadow };
}

/**
 * @param shadow - Shadow root.
 * @returns void
 */
function clear(shadow: ShadowRoot): void {
  while (shadow.firstChild !== null) {
    shadow.removeChild(shadow.firstChild);
  }
}

/**
 * @param state - Badge state.
 * @returns void
 */
export function renderBadge(state: BadgeState): void {
  const { shadow } = ensureHost();
  clear(shadow);

  const style = document.createElement("style");
  style.textContent = `
    .card{background:#0d1117;color:#c9d1d9;border:1px solid #30363d;border-radius:12px;padding:10px 12px;min-width:240px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
    .title{font-weight:700;font-size:13px;margin:0 0 6px 0}
    .row{font-size:12px;line-height:1.35;margin:0}
    .muted{opacity:.8}
  `;
  shadow.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = "Recruiting Intel";
  card.appendChild(title);

  const row = document.createElement("p");
  row.className = "row muted";

  if (state.status === "loading") {
    row.textContent = `Loading (${state.ctx.source})…`;
  } else {
    const r = state.result;
    if (r.status === "ok") {
      const score = r.riskScore === null ? "n/a" : String(r.riskScore);
      row.textContent = `Risk: ${score} • Confidence: ${r.confidence} • 90d: ${r.reportCount90d}`;
    } else if (r.status === "insufficient_data") {
      row.textContent = "Insufficient data (k-anonymity).";
    } else {
      row.textContent = `Error: ${r.message}`;
    }
  }

  card.appendChild(row);
  shadow.appendChild(card);
}
