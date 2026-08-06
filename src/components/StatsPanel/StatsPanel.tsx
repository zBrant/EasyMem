import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { cn } from "@/utils/cn"

export function StatsPanel() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const step = steps[currentStep]

  if (!step) {
    return <EmptyState message="No statistics yet." />
  }

  const s = step.stats
  const ratePct = Math.round(s.rate * 100)

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{ratePct}%</p>
            <p className="text-xs text-muted-foreground">hit rate</p>
          </div>
          <div className="text-right font-mono text-sm text-muted-foreground">
            <p>
              <span className="text-emerald-600">{s.hits}</span> hits /{" "}
              <span className="text-rose-600">{s.misses}</span> misses
            </p>
            <p>{s.accesses} accesses</p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${ratePct}%` }}
          />
        </div>

        <div className="space-y-1.5 text-sm">
          <Row label="Compulsory" value={s.compulsory} className="text-sky-600" />
          <Row label="Conflict" value={s.conflict} className="text-amber-600" />
          <Row label="Capacity" value={s.capacity} className="text-rose-600" />
        </div>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-mono font-medium", className)}>{value}</span>
    </div>
  )
}
