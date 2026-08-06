import { Panel } from "@/components/Panel"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { cn } from "@/utils/cn"

export function StatsPanel() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const step = steps[currentStep]

  if (!step) {
    return (
      <Panel label="Stats">
        <EmptyState message="No statistics yet" />
      </Panel>
    )
  }

  const s = step.stats
  const ratePct = Math.round(s.rate * 100)

  return (
    <Panel label="Stats" bodyClassName="p-3">
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-3xl font-semibold leading-none tabular-nums">
              {ratePct}
              <span className="text-base text-muted-foreground">%</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              hit rate
            </p>
          </div>
          <div className="text-right font-mono text-[11px] tabular-nums">
            <p>
              <span className="text-emerald-400">{s.hits}</span>
              <span className="text-muted-foreground"> hit</span>
            </p>
            <p>
              <span className="text-rose-400">{s.misses}</span>
              <span className="text-muted-foreground"> miss</span>
            </p>
            <p className="text-muted-foreground/70">{s.accesses} access</p>
          </div>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: `${ratePct}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-1 font-mono text-[11px] tabular-nums">
          <Stat label="comp" value={s.compulsory} className="text-sky-400" />
          <Stat label="conf" value={s.conflict} className="text-amber-400" />
          <Stat label="cap" value={s.capacity} className="text-rose-400" />
        </div>
      </div>
    </Panel>
  )
}

function Stat({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className: string
}) {
  return (
    <div className="rounded-sm border border-border/60 bg-background/30 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("text-base font-semibold", className)}>{value}</p>
    </div>
  )
}
