export type Sector = "Healthcare" | "Technology" | "Business Services";

export interface PortCo {
  id: string;
  name: string;
  sector: Sector;
  description: string;
  ebitda: number; // in millions
  employees: number;
  acquired: number;
  customers: string[];
  suppliers: string[];
  tech: string[];
  /** short blurb used in cards / detail header */
  thesis: string;
}

export type InsightKind = "risk" | "opportunity";
export type Severity = "high" | "medium" | "low";

export interface InsightAction {
  step: number;
  text: string;
}

export interface Insight {
  id: string;
  kind: InsightKind;
  severity: Severity;
  /** signed dollar impact in millions (negative = risk exposure) */
  impactM: number;
  /** human-readable label for the impact, e.g. "+$4.2M ARR" */
  impactLabel: string;
  title: string;
  narrative: string;
  actions: InsightAction[];
  portcoIds: string[];
  /** category tag shown as small label on the card */
  tag: string;
}

export type RelationshipKind =
  | "shared-customer"
  | "shared-supplier"
  | "intra-portfolio";

export interface Edge {
  id: string;
  source: string;
  target: string;
  kind: RelationshipKind;
  label: string;
}

export interface ChatResponse {
  prompt: string;
  answer: string;
}
