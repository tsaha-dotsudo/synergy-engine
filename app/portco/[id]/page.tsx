import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Cpu,
  Package,
  Users,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InsightCard } from "@/components/InsightCard";
import { insights, portcoById, portcos } from "@/lib/data";

export function generateStaticParams() {
  return portcos.map((p) => ({ id: p.id }));
}

export default function PortcoPage({ params }: { params: { id: string } }) {
  const portco = portcoById(params.id);
  if (!portco) notFound();

  const relatedInsights = insights.filter((i) =>
    i.portcoIds.includes(portco.id)
  );

  // Sibling portcos with shared customers or suppliers
  const others = portcos.filter((p) => p.id !== portco.id);
  const overlaps = others
    .map((o) => {
      const customers = portco.customers.filter((c) =>
        o.customers.includes(c)
      );
      const suppliers = portco.suppliers.filter((s) =>
        o.suppliers.includes(s)
      );
      return { portco: o, customers, suppliers };
    })
    .filter((x) => x.customers.length || x.suppliers.length);

  return (
    <div className="px-5 sm:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="muted">{portco.sector}</Badge>
              <span className="text-xs text-slate-500">
                {portco.description}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">
              {portco.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              {portco.thesis}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="EBITDA (LTM)" value={`$${portco.ebitda}M`} />
        <Stat
          label="Employees"
          value={portco.employees.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
        />
        <Stat
          label="Acquired"
          value={`${portco.acquired}`}
          icon={<Calendar className="h-4 w-4" />}
        />
        <Stat
          label="Active insights"
          value={`${relatedInsights.length}`}
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users2 className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold">Top customers</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {portco.customers.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold">Key suppliers</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {portco.suppliers.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold">Technology stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {portco.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Portfolio overlaps</h2>
              <span className="text-xs text-slate-500">
                Shared customers and suppliers across other portcos
              </span>
            </div>
            <div className="space-y-3">
              {overlaps.length === 0 && (
                <div className="text-sm text-slate-500">
                  No direct overlaps detected.
                </div>
              )}
              {overlaps.map((o) => (
                <Link
                  key={o.portco.id}
                  href={`/portco/${o.portco.id}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {o.portco.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {o.portco.sector} · {o.portco.description}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                    {o.customers.map((c) => (
                      <span
                        key={`c-${c}`}
                        className="rounded-full bg-sky-50 text-sky-700 px-2 py-0.5 text-[10px] font-medium"
                      >
                        Customer: {c}
                      </span>
                    ))}
                    {o.suppliers.map((s) => (
                      <span
                        key={`s-${s}`}
                        className="rounded-full bg-orange-50 text-orange-700 px-2 py-0.5 text-[10px] font-medium"
                      >
                        Supplier: {s}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Related insights</h2>
            <Badge variant="muted">{relatedInsights.length}</Badge>
          </div>
          <div className="space-y-3">
            {relatedInsights.map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
            {relatedInsights.length === 0 && (
              <div className="text-sm text-slate-500">No insights yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="mt-1.5 text-xl font-semibold text-slate-900 tracking-tight">
        {value}
      </div>
    </Card>
  );
}
