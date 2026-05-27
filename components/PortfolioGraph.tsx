"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  type Edge as RFEdge,
  type Node as RFNode,
  type NodeProps,
} from "reactflow";
import { Building2 } from "lucide-react";
import { edges as portfolioEdges, portcos } from "@/lib/data";
import type { RelationshipKind } from "@/lib/types";

const EDGE_COLOR: Record<RelationshipKind, string> = {
  "shared-customer": "#3b82f6", // blue-500
  "shared-supplier": "#f97316", // orange-500
  "intra-portfolio": "#10b981", // emerald-500
};

const SECTOR_RING: Record<string, string> = {
  Healthcare: "ring-rose-100 bg-rose-50 text-rose-700",
  Technology: "ring-sky-100 bg-sky-50 text-sky-700",
  "Business Services": "ring-amber-100 bg-amber-50 text-amber-700",
};

interface PortcoNodeData {
  name: string;
  description: string;
  sector: string;
  ebitda: number;
  onClick: () => void;
}

function PortcoNode({ data }: NodeProps<PortcoNodeData>) {
  return (
    <div
      className="group relative w-[210px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer"
      onClick={data.onClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "transparent", border: "none", opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "transparent", border: "none", opacity: 0 }}
      />
      <div className="flex items-start gap-2">
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${
            SECTOR_RING[data.sector] ??
            "ring-slate-100 bg-slate-50 text-slate-700"
          }`}
        >
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight text-slate-900 truncate">
            {data.name}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {data.description}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>{data.sector}</span>
        <span className="font-medium text-slate-700">
          ${data.ebitda}M EBITDA
        </span>
      </div>
    </div>
  );
}

const LAYOUT: Record<string, { x: number; y: number }> = {
  "meridian-health": { x: 60, y: 60 },
  "precision-ortho": { x: 60, y: 340 },
  cloudpivot: { x: 780, y: 60 },
  nexuspay: { x: 780, y: 340 },
  apex: { x: 420, y: 540 },
};

const KIND_SHORT: Record<RelationshipKind, string> = {
  "shared-customer": "Shared customers",
  "shared-supplier": "Shared suppliers",
  "intra-portfolio": "Intra-portfolio",
};

const nodeTypes = { portco: PortcoNode };

export function PortfolioGraph() {
  const router = useRouter();

  const handlePortcoClick = useCallback(
    (id: string) => {
      router.push(`/portco/${id}`);
    },
    [router]
  );

  const nodes: RFNode[] = useMemo(
    () =>
      portcos.map((p) => ({
        id: p.id,
        type: "portco",
        position: LAYOUT[p.id] ?? { x: 0, y: 0 },
        data: {
          name: p.name,
          description: p.description,
          sector: p.sector,
          ebitda: p.ebitda,
          onClick: () => handlePortcoClick(p.id),
        } satisfies PortcoNodeData,
      })),
    [handlePortcoClick]
  );

  const edges: RFEdge[] = useMemo(
    () =>
      portfolioEdges.map((e, i) => {
        const color = EDGE_COLOR[e.kind];
        const sameEndpoints = portfolioEdges.filter(
          (other) =>
            (other.source === e.source && other.target === e.target) ||
            (other.source === e.target && other.target === e.source)
        );
        const parallelIndex = sameEndpoints.findIndex((x) => x.id === e.id);
        const curvature =
          sameEndpoints.length > 1 ? (parallelIndex === 0 ? 0.35 : -0.35) : 0.25;
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: "default",
          animated: e.kind === "intra-portfolio",
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: { stroke: color, strokeWidth: 2 },
          label: KIND_SHORT[e.kind],
          labelStyle: { fill: color, fontWeight: 600 },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
          labelBgPadding: [6, 4] as [number, number],
          labelBgBorderRadius: 6,
          data: { fullLabel: e.label },
          pathOptions: { curvature, offset: 0 + i * 0 },
        } as RFEdge;
      }),
    []
  );

  return (
    <div className="relative h-[620px] w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!shadow-sm !border !border-slate-200 !bg-white"
        />
      </ReactFlow>

      <div className="pointer-events-none absolute left-4 bottom-4 flex flex-wrap gap-2">
        <Legend color="#3b82f6" label="Shared customers" />
        <Legend color="#f97316" label="Shared suppliers" />
        <Legend color="#10b981" label="Intra-portfolio" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </div>
  );
}
