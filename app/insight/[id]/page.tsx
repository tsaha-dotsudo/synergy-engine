import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { insightById, insights, portcoById } from "@/lib/data";

export function generateStaticParams() {
  return insights.map((i) => ({ id: i.id }));
}

export default function InsightPage({ params }: { params: { id: string } }) {
  const insight = insightById(params.id);
  if (!insight) notFound();

  const isRisk = insight.kind === "risk";
  const Icon = isRisk ? AlertTriangle : TrendingUp;
  const portcos = insight.portcoIds
    .map((id) => portcoById(id))
    .filter((p): p is NonNullable<ReturnType<typeof portcoById>> =>
      Boolean(p)
    );

  return (
    <div className="px-5 sm:px-8 py-6 lg:py-8 max-w-[1100px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-12 w-12 place-items-center rounded-xl ${
              isRisk
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isRisk ? "risk" : "opportunity"}>
                {isRisk ? "Risk" : "Opportunity"}
              </Badge>
              <Badge variant="muted">{insight.tag}</Badge>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    insight.severity === "high"
                      ? "bg-red-500"
                      : insight.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                />
                {insight.severity} severity
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 tracking-tight max-w-3xl">
              {insight.title}
            </h1>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div
            className={`text-xl font-semibold ${
              isRisk ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {insight.impactLabel}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
            Estimated impact
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Narrative
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-800">
              {insight.narrative}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Recommended actions
            </h2>
            <ol className="space-y-3">
              {insight.actions.map((a) => (
                <li
                  key={a.step}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-white text-[11px] font-semibold">
                    {a.step}
                  </div>
                  <div className="text-sm text-slate-800 leading-relaxed">
                    {a.text}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Coordinated execution recommended across affected portcos.
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Affected companies
            </h2>
            <div className="space-y-2">
              {portcos.map((p) => (
                <Link
                  key={p.id}
                  href={`/portco/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-slate-700">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {p.sector} · ${p.ebitda}M EBITDA
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Impact summary
            </h2>
            <dl className="space-y-2 text-sm">
              <Row label="Kind" value={isRisk ? "Risk" : "Opportunity"} />
              <Row label="Severity" value={insight.severity} />
              <Row label="Affected portcos" value={`${portcos.length}`} />
              <Row label="Estimated impact" value={insight.impactLabel} />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500 capitalize">{label}</dt>
      <dd className="font-medium text-slate-900 capitalize">{value}</dd>
    </div>
  );
}
