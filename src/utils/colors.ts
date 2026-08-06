import type { AccessResult } from "@/engine/types"

export interface ResultStyle {
  label: string
  dot: string
  text: string
  cell: string
}

const STYLES: Record<AccessResult, ResultStyle> = {
  hit: {
    label: "HIT",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    cell: "bg-emerald-500/10 border-emerald-500/60",
  },
  compulsory: {
    label: "COMPULSORY",
    dot: "bg-sky-400",
    text: "text-sky-400",
    cell: "bg-sky-500/10 border-sky-500/60",
  },
  conflict: {
    label: "CONFLICT",
    dot: "bg-amber-400",
    text: "text-amber-400",
    cell: "bg-amber-500/10 border-amber-500/60",
  },
  capacity: {
    label: "CAPACITY",
    dot: "bg-rose-400",
    text: "text-rose-400",
    cell: "bg-rose-500/10 border-rose-500/60",
  },
}

export function resultStyle(result: AccessResult): ResultStyle {
  return STYLES[result]
}
