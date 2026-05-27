"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Network,
  Lightbulb,
  Building2,
  Settings,
  Zap,
} from "lucide-react";
import { portcos } from "@/lib/data";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/?tab=graph", label: "Portfolio Graph", icon: Network },
  { href: "/?tab=insights", label: "Insights", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
        <div className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/15 text-emerald-400">
          <Zap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">
            Synergy Engine
          </div>
          <div className="text-[11px] text-slate-400">
            Portfolio Intelligence
          </div>
        </div>
      </div>

      <div className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href.split("?")[0];
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-5 mt-2 text-[11px] uppercase tracking-wider text-slate-500">
        Portfolio
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-dark px-3 py-2 space-y-1">
        {portcos.map((p) => {
          const href = `/portco/${p.id}`;
          const active = pathname === href;
          return (
            <Link
              key={p.id}
              href={href}
              className={cn(
                "flex items-start gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <Building2 className="h-4 w-4 mt-0.5 text-slate-400" />
              <div className="min-w-0">
                <div className="truncate font-medium">{p.name}</div>
                <div className="text-[11px] text-slate-500 truncate">
                  {p.sector}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-800">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <div className="mt-3 flex items-center gap-3 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            T
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-xs font-medium text-white truncate">
              Tanisha
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Fund III · Partner
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
