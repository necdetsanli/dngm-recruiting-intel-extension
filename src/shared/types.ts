export type CompanySource = "linkedin" | "glassdoor" | "indeed" | "workable" | "domain";

export type CompanyContext = {
  source: CompanySource;
  key: string;
};

export type IntelResult =
  | {
      status: "ok";
      riskScore: number | null;
      confidence: "low" | "medium" | "high";
      reportCountTotal: number;
      reportCount90d: number;
    }
  | { status: "insufficient_data" }
  | { status: "error"; message: string };

export type Settings = {
  apiBaseUrl: string;
  allSitesEnabled: boolean;
};
