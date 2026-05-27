"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/types";
import { portcoById } from "@/lib/data";

interface Props {
  insight: Insight;
  className?: string;
}

const severityStyle: Record<
  Insight["severity"],
  { dot: string; label: string }
> = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low: { dot: "bg-emerald-500", label: "Low" },
};

export function InsightCard({ insight, className }: Props) {
  const isRisk = insight.kind === "risk";
  const Icon = isRisk ? AlertTriangle : TrendingUp;
  const sev = severityStyle[insight.severity];

  return (
    <Link href={`/insight/${insight.id}`} className="block group">
      <Card
        className={cn(
          "p-4 hover:shadow-md transition border-l-4",
          isRisk ? "border-l-red-500" : "border-l-emerald-500",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                isRisk
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={isRisk ? "risk" : "opportunity"}>
                  {isRisk ? "Risk" : "Opportunity"}
                </Badge>
                <Badge variant="muted" className="font-normal">
                  {insight.tag}
                </Badge>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
                  {sev.label} severity
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-900 leading-snug group-hover:text-slate-700">
                {insight.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {insight.narrative}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className={cn(
                "text-sm font-semibold",
                isRisk ? "text-red-600" : "text-emerald-600"
              )}
            >
              {insight.impactLabel}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              Est. impact
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-slate-400" />
            <span className="text-[11px] text-slate-500">Affects:</span>
            {insight.portcoIds.slice(0, 3).map((id) => {
              const p = portcoById(id);
              if (!p) return null;
              return (
                <span
                  key={id}
                  className="text-[11px] font-medium text-slate-700"
                >
                  {p.name}
                  {id !==
                  insight.portcoIds[Math.min(insight.portcoIds.length - 1, 2)]
                    ? ","
                    : ""}
                </span>
              );
            })}
            {insight.portcoIds.length > 3 && (
              <span className="text-[11px] text-slate-500">
                +{insight.portcoIds.length - 3} more
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 group-hover:text-slate-900">
            Open <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
