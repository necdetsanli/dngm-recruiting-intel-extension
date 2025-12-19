import type { CompanyContext, IntelResult } from "./types";

export type GetIntelRequest = {
  type: "GET_INTEL";
  context: CompanyContext;
};

export type GetIntelResponse = {
  type: "GET_INTEL_RESULT";
  result: IntelResult;
};

export type SetAllSitesEnabledRequest = {
  type: "SET_ALL_SITES_ENABLED";
};

export type OpenOptionsRequest = {
  type: "OPEN_OPTIONS";
};

export type BackgroundRequest = GetIntelRequest | SetAllSitesEnabledRequest | OpenOptionsRequest;
export type BackgroundResponse = GetIntelResponse | { type: "OK" };

/**
 * @param value - Unknown input.
 * @returns True if value is a plain object record.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * @param value - Unknown input.
 * @returns True if value is a valid CompanyContext-like object.
 */
function isCompanyContext(value: unknown): value is CompanyContext {
  if (isRecord(value) !== true) {
    return false;
  }
  const source = value["source"];
  const key = value["key"];
  if (typeof source !== "string") {
    return false;
  }
  if (typeof key !== "string") {
    return false;
  }

  const allowed: readonly string[] = ["linkedin", "glassdoor", "indeed", "workable", "domain"];
  return allowed.includes(source) && key.length > 0;
}

/**
 * @param msg - Unknown input.
 * @returns True if msg is a GET_INTEL request.
 */
export function isGetIntelRequest(msg: unknown): msg is GetIntelRequest {
  if (isRecord(msg) !== true) {
    return false;
  }
  if (msg["type"] !== "GET_INTEL") {
    return false;
  }
  return isCompanyContext(msg["context"]);
}

/**
 * @param msg - Unknown input.
 * @returns True if msg is a SET_ALL_SITES_ENABLED request.
 */
export function isSetAllSitesEnabledRequest(msg: unknown): msg is SetAllSitesEnabledRequest {
  if (isRecord(msg) !== true) {
    return false;
  }
  return msg["type"] === "SET_ALL_SITES_ENABLED";
}

/**
 * @param msg - Unknown input.
 * @returns True if msg is an OPEN_OPTIONS request.
 */
export function isOpenOptionsRequest(msg: unknown): msg is OpenOptionsRequest {
  if (isRecord(msg) !== true) {
    return false;
  }
  return msg["type"] === "OPEN_OPTIONS";
}
