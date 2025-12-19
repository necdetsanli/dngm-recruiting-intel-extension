import browser from "webextension-polyfill";
import { TtlCache } from "./cache";
import { fetchIntel } from "./apiClient";
import { reconcileAllSites } from "./allSites";
import {
  isGetIntelRequest,
  isOpenOptionsRequest,
  isSetAllSitesEnabledRequest,
} from "@/shared/messages";
import type { BackgroundResponse } from "@/shared/messages";

const cache = new TtlCache<BackgroundResponse>();
const TTL_MS = 10 * 60 * 1000;

/**
 * @param source - Company source.
 * @param key - Company key.
 * @returns Cache key.
 */
function makeCacheKey(source: string, key: string): string {
  return `${source}:${key}`;
}

browser.runtime.onInstalled.addListener(() => {
  void reconcileAllSites();
});

browser.runtime.onStartup.addListener(() => {
  void reconcileAllSites();
});

browser.runtime.onMessage.addListener(
  (msg: unknown): Promise<BackgroundResponse> | BackgroundResponse => {
    if (isOpenOptionsRequest(msg)) {
      void browser.runtime.openOptionsPage();
      return { type: "OK" };
    }

    if (isSetAllSitesEnabledRequest(msg)) {
      const job = (async () => {
        await reconcileAllSites();
        return { type: "OK" } satisfies BackgroundResponse;
      })();
      return job;
    }

    if (isGetIntelRequest(msg)) {
      const key = makeCacheKey(msg.context.source, msg.context.key);
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }

      const job = (async () => {
        const result = await fetchIntel(msg.context);
        const resp: BackgroundResponse = { type: "GET_INTEL_RESULT", result };
        cache.set(key, resp, TTL_MS);
        return resp;
      })();

      return job;
    }

    return { type: "GET_INTEL_RESULT", result: { status: "error", message: "Invalid request" } };
  },
);
