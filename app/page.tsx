import {
  Building2,
  DollarSign,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InsightsList } from "@/components/InsightsList";
import { FUND_NAME, FUND_VINTAGE, stats } from "@/lib/data";

const PortfolioGraph = dynamic(
  () => import("@/components/PortfolioGraph").then((m) => m.PortfolioGraph),
  { ssr: false, loading: () => <GraphSkeleton /> }
);

function GraphSkeleton() {
  return (
    <div className="h-[620px] w-full rounded-xl border border-slate-200 bg-white grid place-items-center text-sm text-slate-400">
      Loading portfolio graph…
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="px-5 sm:px-8 py-6 lg:py-8 max-w-[1600px] mx-auto">
      <Header />
      <StatsRow />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
        <section className="lg:col-span-3">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Portfolio relationship graph
              </h2>
              <p className="text-xs text-slate-500">
                Shared customers, suppliers, and intra-portfolio commerce
              </p>
            </div>
            <Badge variant="muted">5 companies · 6 connections</Badge>
          </div>
          <PortfolioGraph />
        </section>

        <aside className="lg:col-span-2 lg:h-[660px]">
          <InsightsList />
        </aside>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {FUND_VINTAGE}
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {FUND_NAME} — {FUND_VINTAGE}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-surfaced risks and opportunities across your portfolio companies.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="opportunity" className="text-[11px]">
          ● Live
        </Badge>
        <span className="text-xs text-slate-500">
          Updated 12 min ago
        </span>
      </div>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Stat
        icon={<Building2 className="h-4 w-4" />}
        label="Companies"
        value={`${stats.companies}`}
        sub="Active portcos"
        tone="slate"
      />
      <Stat
        icon={<DollarSign className="h-4 w-4" />}
        label="Combined EBITDA"
        value={`$${stats.combinedEbitdaM}M`}
        sub="LTM, portfolio total"
        tone="slate"
      />
      <Stat
        icon={<Lightbulb className="h-4 w-4" />}
        label="Active insights"
        value={`${stats.activeInsights}`}
        sub="Across risks & opportunities"
        tone="amber"
      />
      <Stat
        icon={<TrendingUp className="h-4 w-4" />}
        label="Net identified value"
        value={`$${stats.netIdentifiedValueM}M`}
        sub="Risks netted vs. upside"
        tone="emerald"
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "slate" | "emerald" | "amber" | "red";
}) {
  const toneMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div
          className={`grid h-7 w-7 place-items-center rounded-md ${toneMap[tone]}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>
    </Card>
  );
}
