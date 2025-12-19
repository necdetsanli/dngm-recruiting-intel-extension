import browser from "webextension-polyfill";
import { detectCompanyContext } from "./detectors";
import { renderBadge } from "./badge";
import { subscribeToUrlChanges } from "./spaNavigation";
import type { BackgroundResponse } from "@/shared/messages";
import type { CompanyContext } from "@/shared/types";

/**
 * @param ctx - Company context.
 * @returns Promise resolving to intel result response.
 */
async function requestIntel(ctx: CompanyContext): Promise<BackgroundResponse> {
  const resp = (await browser.runtime.sendMessage({
    type: "GET_INTEL",
    context: ctx,
  })) as BackgroundResponse;
  return resp;
}

/**
 * Refresh badge state based on current URL.
 *
 * @param href - Current href.
 * @returns Promise.
 */
async function refresh(href: string): Promise<void> {
  const url = new URL(href);
  const ctx = detectCompanyContext(url);

  renderBadge({ status: "loading", ctx });

  const resp = await requestIntel(ctx);
  if (resp.type !== "GET_INTEL_RESULT") {
    renderBadge({
      status: "ready",
      ctx,
      result: { status: "error", message: "Unexpected response" },
    });
    return;
  }

  renderBadge({ status: "ready", ctx, result: resp.result });
}

/**
 * Entry point for content script.
 *
 * Security:
 * - Does not read page content.
 * - Uses only URL-derived company identifiers.
 */
function main(): void {
  void refresh(window.location.href);

  subscribeToUrlChanges((href) => {
    void refresh(href);
  });
}

main();
