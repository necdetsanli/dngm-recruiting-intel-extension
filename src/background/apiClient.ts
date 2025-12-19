import type { CompanyContext, IntelResult } from "@/shared/types";
import { loadSettings } from "@/shared/settings";

/**
 * Fetch aggregate intel from the DNMG API.
 *
 * Security:
 * - Only aggregate data is requested.
 * - No page content is sent, only (source, key).
 *
 * @param context - Company context.
 * @returns IntelResult.
 */
export async function fetchIntel(context: CompanyContext): Promise<IntelResult> {
  const settings = await loadSettings();

  const url = new URL("/api/public/company-intel", settings.apiBaseUrl);
  url.searchParams.set("source", context.source);
  url.searchParams.set("key", context.key);

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 4000);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: ac.signal,
    });

    if (res.ok !== true) {
      return { status: "error", message: `API error (HTTP ${res.status})` };
    }

    const json: unknown = await res.json();
    if (typeof json !== "object" || json === null) {
      return { status: "error", message: "Invalid API response." };
    }

    // Minimal, defensive parsing (avoid unsafe property access).
    const rec = json as Record<string, unknown>;
    if (rec["status"] === "insufficient_data") {
      return { status: "insufficient_data" };
    }

    const signals = rec["signals"];
    if (typeof signals !== "object" || signals === null) {
      return { status: "error", message: "Invalid API response." };
    }

    const s = signals as Record<string, unknown>;
    const total = s["reportCountTotal"];
    const d90 = s["reportCount90d"];
    const confidence = s["confidence"];
    const risk = s["riskScore"];

    if (typeof total !== "number" || typeof d90 !== "number") {
      return { status: "error", message: "Invalid API response." };
    }
    if (confidence !== "low" && confidence !== "medium" && confidence !== "high") {
      return { status: "error", message: "Invalid API response." };
    }

    const riskScore = typeof risk === "number" ? risk : null;

    return {
      status: "ok",
      riskScore,
      confidence,
      reportCountTotal: total,
      reportCount90d: d90,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { status: "error", message };
  } finally {
    clearTimeout(timeout);
  }
}
