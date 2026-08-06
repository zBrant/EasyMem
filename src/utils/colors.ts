import type { AccessResult } from "@/engine/types"

export interface ResultStyle {
  label: string
  badge: string
  highlight: string
  text: string
}

const STYLES: Record<AccessResult, ResultStyle> = {
  hit: {
    label: "Hit",
    badge: "bg-emerald-500/15 text-emerald-700 border-emerald-500/40",
    highlight: "bg-emerald-500/20 border-emerald-500",
    text: "text-emerald-700",
  },
  compulsory: {
    label: "Compulsory",
    badge: "bg-sky-500/15 text-sky-700 border-sky-500/40",
    highlight: "bg-sky-500/20 border-sky-500",
    text: "text-sky-700",
  },
  conflict: {
    label: "Conflict",
    badge: "bg-amber-500/15 text-amber-700 border-amber-500/40",
    highlight: "bg-amber-500/20 border-amber-500",
    text: "text-amber-700",
  },
  capacity: {
    label: "Capacity",
    badge: "bg-rose-500/15 text-rose-700 border-rose-500/40",
    highlight: "bg-rose-500/20 border-rose-500",
    text: "text-rose-700",
  },
}

export function resultStyle(result: AccessResult): ResultStyle {
  return STYLES[result]
}
