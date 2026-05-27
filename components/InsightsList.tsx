"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { sortedInsights } from "@/lib/data";
import { cn } from "@/lib/utils";

type FilterKind = "all" | "risk" | "opportunity";

export function InsightsList() {
  const [kind, setKind] = useState<FilterKind>("all");

  const all = sortedInsights();
  const filtered = kind === "all" ? all : all.filter((i) => i.kind === kind);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Portfolio insights
          </h2>
          <p className="text-xs text-slate-500">
            Ranked by severity and estimated impact
          </p>
        </div>
        <div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 text-xs">
          {(["all", "risk", "opportunity"] as FilterKind[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn(
                "px-2.5 py-1 rounded capitalize transition",
                kind === k
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-10 flex flex-col items-center gap-2">
            <Filter className="h-4 w-4" />
            No insights match this filter.
          </div>
        ) : (
          filtered.map((i) => <InsightCard key={i.id} insight={i} />)
        )}
      </div>
    </div>
  );
}
