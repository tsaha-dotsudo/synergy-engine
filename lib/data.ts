import type { ChatResponse, Edge, Insight, PortCo } from "./types";

export const FUND_NAME = "Meridian Capital Partners";
export const FUND_VINTAGE = "Fund III";

export const portcos: PortCo[] = [
  {
    id: "meridian-health",
    name: "Meridian Health Partners",
    sector: "Healthcare",
    description: "Dental Service Organization (DSO)",
    thesis:
      "Roll-up of independent dental practices across the Southeast with shared back-office.",
    ebitda: 42,
    employees: 1200,
    acquired: 2022,
    customers: ["Aetna", "Cigna", "Delta Dental", "MetLife", "UnitedHealth"],
    suppliers: ["Henry Schein", "Patterson Dental", "Salesforce", "AWS"],
    tech: ["Salesforce", "Epic", "AWS", "Microsoft 365"],
  },
  {
    id: "precision-ortho",
    name: "Precision Orthopedics Group",
    sector: "Healthcare",
    description: "Orthopedic surgery centers",
    thesis:
      "Multi-state platform of ambulatory orthopedic surgery centers with payer contracting leverage.",
    ebitda: 38,
    employees: 850,
    acquired: 2023,
    customers: ["UnitedHealth", "Aetna", "BCBS", "Cigna", "Humana"],
    suppliers: ["Stryker", "Henry Schein", "Salesforce", "AWS"],
    tech: ["Salesforce", "Epic", "AWS", "Workday"],
  },
  {
    id: "cloudpivot",
    name: "CloudPivot Software",
    sector: "Technology",
    description: "B2B SaaS — supply chain analytics",
    thesis:
      "Vertical SaaS analytics platform for retail and logistics with high NRR and 70%+ gross margin.",
    ebitda: 28,
    employees: 320,
    acquired: 2021,
    customers: ["Walmart", "Target", "Costco", "Home Depot", "FedEx"],
    suppliers: ["AWS", "Snowflake", "Datadog", "Slack"],
    tech: ["AWS", "Snowflake", "React", "Python"],
  },
  {
    id: "nexuspay",
    name: "NexusPay",
    sector: "Technology",
    description: "Embedded B2B payments",
    thesis:
      "API-first payments infrastructure embedded into vertical SaaS and marketplace platforms.",
    ebitda: 19,
    employees: 180,
    acquired: 2023,
    customers: ["Shopify", "Target", "Walmart", "FedEx", "Uber"],
    suppliers: ["AWS", "Stripe partner", "Datadog", "Snowflake"],
    tech: ["AWS", "Node.js", "PostgreSQL", "Snowflake"],
  },
  {
    id: "apex",
    name: "Apex Business Solutions",
    sector: "Business Services",
    description: "Outsourced F&A and back-office",
    thesis:
      "Tech-enabled finance & accounting outsourcing for mid-market with intra-portfolio anchor clients.",
    ebitda: 31,
    employees: 2400,
    acquired: 2022,
    customers: [
      "CloudPivot Software",
      "NexusPay",
      "Mid-market enterprises",
    ],
    suppliers: ["NetSuite", "Workday", "Microsoft", "Salesforce"],
    tech: ["NetSuite", "Workday", "Salesforce", "Microsoft 365"],
  },
];

export const portcoById = (id: string): PortCo | undefined =>
  portcos.find((p) => p.id === id);

/**
 * Edges between portcos. Color is decided in PortfolioGraph by `kind`:
 *  - shared-customer = blue
 *  - shared-supplier = orange
 *  - intra-portfolio = emerald
 */
export const edges: Edge[] = [
  {
    id: "e-mh-po-customers",
    source: "meridian-health",
    target: "precision-ortho",
    kind: "shared-customer",
    label: "Shared payers: UnitedHealth, Aetna, Cigna",
  },
  {
    id: "e-mh-po-suppliers",
    source: "meridian-health",
    target: "precision-ortho",
    kind: "shared-supplier",
    label: "Shared supplier: Henry Schein",
  },
  {
    id: "e-cp-np-customers",
    source: "cloudpivot",
    target: "nexuspay",
    kind: "shared-customer",
    label: "Shared customers: Walmart, Target, FedEx",
  },
  {
    id: "e-apex-cp",
    source: "apex",
    target: "cloudpivot",
    kind: "intra-portfolio",
    label: "Apex provides F&A to CloudPivot",
  },
  {
    id: "e-apex-np",
    source: "apex",
    target: "nexuspay",
    kind: "intra-portfolio",
    label: "Apex provides F&A to NexusPay",
  },
  {
    id: "e-cp-np-suppliers",
    source: "cloudpivot",
    target: "nexuspay",
    kind: "shared-supplier",
    label: "Shared infra: AWS, Snowflake, Datadog",
  },
];

export const insights: Insight[] = [
  {
    id: "payer-concentration",
    kind: "risk",
    severity: "high",
    impactM: -18,
    impactLabel: "-$18M exposure",
    tag: "Customer concentration",
    title: "Healthcare payer concentration risk",
    narrative:
      "UnitedHealth, Aetna, and Cigna are top-5 customers for BOTH Meridian Health and Precision Orthopedics. Combined exposure is 34% of healthcare segment revenue. A reimbursement policy change from any of these three payers would simultaneously hit two portfolio companies, compressing margin in the same quarter rather than diversifying the blow across the fund.",
    actions: [
      { step: 1, text: "Diversify payer mix at both portcos." },
      {
        step: 2,
        text: "Consider hedging via an out-of-network acquisition.",
      },
      {
        step: 3,
        text: "Coordinate contract renegotiation across both companies to leverage combined volume.",
      },
    ],
    portcoIds: ["meridian-health", "precision-ortho"],
  },
  {
    id: "nexuspay-crosssell",
    kind: "opportunity",
    severity: "high",
    impactM: 4.2,
    impactLabel: "+$4.2M ARR",
    tag: "Cross-sell",
    title: "Untapped cross-sell into NexusPay customer base",
    narrative:
      "CloudPivot's supply chain analytics is a natural fit for Walmart, Target, and FedEx — three customers NexusPay already serves through embedded payments. Warm intros from NexusPay account teams could compress CloudPivot's sales cycle by an estimated 60% on these accounts, accelerating ARR without expanding sales headcount.",
    actions: [
      {
        step: 1,
        text: "Joint account planning between NexusPay and CloudPivot sales heads.",
      },
      { step: 2, text: "Build a bundled payments + analytics offering." },
      { step: 3, text: "Pilot with one customer — Target recommended." },
    ],
    portcoIds: ["cloudpivot", "nexuspay"],
  },
  {
    id: "vendor-consolidation",
    kind: "opportunity",
    severity: "medium",
    impactM: 3.1,
    impactLabel: "+$3.1M / yr savings",
    tag: "Procurement",
    title: "Portfolio-wide cloud and SaaS consolidation",
    narrative:
      "4 of 5 portcos use AWS, 3 use Salesforce, and 3 use Snowflake. Combined annual spend across the three vendors exceeds $14M. A coordinated enterprise agreement negotiated at the fund level typically yields 22% savings versus standalone contracts, with no operational disruption to the portfolio companies.",
    actions: [
      { step: 1, text: "Designate a fund-level vendor relationship lead." },
      {
        step: 2,
        text: "Begin AWS enterprise discount negotiation in Q1.",
      },
      {
        step: 3,
        text: "Roll Salesforce and Snowflake into the framework once AWS closes.",
      },
    ],
    portcoIds: [
      "meridian-health",
      "precision-ortho",
      "cloudpivot",
      "nexuspay",
      "apex",
    ],
  },
  {
    id: "apex-fna",
    kind: "opportunity",
    severity: "medium",
    impactM: 2.4,
    impactLabel: "+$2.4M intra-portfolio",
    tag: "Intra-portfolio commerce",
    title: "Intra-portfolio F&A migration",
    narrative:
      "Apex Business Solutions already provides F&A to CloudPivot and NexusPay. Meridian Health and Precision Orthopedics still use boutique CPAs at a meaningful premium. Migrating both healthcare portcos to Apex generates intra-portfolio revenue, reduces G&A at the healthcare companies, and gives Apex more recurring scale.",
    actions: [
      {
        step: 1,
        text: "Pilot Apex F&A at Precision Orthopedics in Q1.",
      },
      { step: 2, text: "Expand to Meridian Health in Q2." },
    ],
    portcoIds: ["apex", "meridian-health", "precision-ortho"],
  },
  {
    id: "henry-schein-spof",
    kind: "risk",
    severity: "medium",
    impactM: -6,
    impactLabel: "-$6M exposure",
    tag: "Supplier concentration",
    title: "Healthcare supplier single-point-of-failure",
    narrative:
      "Both healthcare portcos use Henry Schein as a top-3 supplier. A disruption or unilateral pricing change from Henry Schein would hit 67% of healthcare portfolio operations at once — a correlated risk that current supplier diligence does not surface at the individual portco level.",
    actions: [
      {
        step: 1,
        text: "Onboard Patterson Dental as a secondary supplier at both portcos.",
      },
      {
        step: 2,
        text: "Negotiate portfolio-level pricing with Henry Schein.",
      },
    ],
    portcoIds: ["meridian-health", "precision-ortho"],
  },
];

export const insightById = (id: string): Insight | undefined =>
  insights.find((i) => i.id === id);

const severityRank: Record<Insight["severity"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const sortedInsights = (): Insight[] =>
  [...insights].sort((a, b) => {
    const s = severityRank[a.severity] - severityRank[b.severity];
    if (s !== 0) return s;
    return Math.abs(b.impactM) - Math.abs(a.impactM);
  });

// ----- Stats -----
export const stats = {
  companies: portcos.length,
  combinedEbitdaM: portcos.reduce((s, p) => s + p.ebitda, 0), // 158
  activeInsights: 23,
  netIdentifiedValueM: 32,
};

// ----- Chat -----
export const SUGGESTED_QUESTIONS: string[] = [
  "Which portco has the highest concentration risk?",
  "Where are the biggest cross-sell opportunities?",
  "How much can we save with portfolio-wide procurement?",
  "Which customers create shared exposure?",
];

export const CHAT_FALLBACK =
  "Based on portfolio analysis, see the insight cards on the dashboard for the most relevant findings. You can also click any portco to explore its specific connections.";

export const chatResponses: ChatResponse[] = [
  {
    prompt: SUGGESTED_QUESTIONS[0],
    answer:
      "Meridian Health Partners and Precision Orthopedics Group together carry the largest concentration risk in the fund. UnitedHealth, Aetna, and Cigna are top-5 customers at both companies, which translates to roughly 34% of healthcare segment revenue tied to just three payers. A single reimbursement policy change would compress margin at two portcos in the same quarter — see the 'Healthcare payer concentration risk' insight for recommended mitigations.",
  },
  {
    prompt: SUGGESTED_QUESTIONS[1],
    answer:
      "The strongest cross-sell sits between CloudPivot Software and NexusPay. NexusPay already has live relationships with Walmart, Target, and FedEx — all three are ideal CloudPivot customers. Warm intros through NexusPay account teams can compress CloudPivot's sales cycle by ~60% on these accounts, with an estimated +$4.2M ARR uplift. The 'Untapped cross-sell into NexusPay customer base' insight outlines a Target-led pilot.",
  },
  {
    prompt: SUGGESTED_QUESTIONS[2],
    answer:
      "Roughly $3.1M per year. Four of five portcos run on AWS, three use Salesforce, and three use Snowflake, with combined annual spend above $14M. A coordinated enterprise agreement at the fund level typically returns 22% savings versus standalone contracts. The 'Portfolio-wide cloud and SaaS consolidation' insight recommends starting with AWS in Q1 and rolling Salesforce and Snowflake in afterwards.",
  },
  {
    prompt: SUGGESTED_QUESTIONS[3],
    answer:
      "Three customer overlaps drive most shared exposure across the portfolio. (1) UnitedHealth, Aetna, and Cigna sit at the top of both Meridian Health and Precision Orthopedics — the largest correlated risk in the fund. (2) Walmart, Target, and FedEx are shared between CloudPivot and NexusPay — a risk on paper, but the basis of a strong cross-sell motion. (3) Henry Schein is a top supplier at both healthcare portcos, creating a -$6M single-point-of-failure on the cost side.",
  },
];

export const answerFor = (q: string): string => {
  const normalized = q.trim().toLowerCase();
  const match = chatResponses.find(
    (r) => r.prompt.trim().toLowerCase() === normalized
  );
  return match ? match.answer : CHAT_FALLBACK;
};
