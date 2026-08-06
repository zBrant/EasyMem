import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { binaryFields } from "@/engine/address"
import { cn } from "@/utils/cn"

const BANDS = {
  tag: "bg-violet-500/15 text-violet-700 border-violet-500/40",
  index: "bg-sky-500/15 text-sky-700 border-sky-500/40",
  offset: "bg-emerald-500/15 text-emerald-700 border-emerald-500/40",
} as const

export function AddressView() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const derived = useSimulator((s) => s.derived)
  const step = steps[currentStep]

  if (!step || !derived) {
    return <EmptyState message="No address to display." />
  }

  const fields = binaryFields(step.decomposition, derived)
  const address = step.access.address

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Address decomposition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 font-mono text-sm">
          <span>
            <span className="text-muted-foreground">dec </span>
            {address}
          </span>
          <span>
            <span className="text-muted-foreground">hex </span>0x
            {address.toString(16)}
          </span>
        </div>

        <div className="flex overflow-x-auto rounded-md border font-mono text-sm">
          {derived.tagBits > 0 && (
            <Band label="tag" value={fields.tag} bits={derived.tagBits} className={BANDS.tag} />
          )}
          {derived.indexBits > 0 && (
            <Band label="index" value={fields.index} bits={derived.indexBits} className={BANDS.index} />
          )}
          <Band label="offset" value={fields.offset} bits={derived.offsetBits} className={BANDS.offset} />
        </div>

        <p className="break-all font-mono text-xs text-muted-foreground">
          {step.decomposition.binary}
        </p>
      </CardContent>
    </Card>
  )
}

function Band({
  label,
  value,
  bits,
  className,
}: {
  label: string
  value: string
  bits: number
  className: string
}) {
  return (
    <div className={cn("flex flex-col items-center px-2 py-1", className)}>
      <span className="text-[10px] uppercase tracking-wide opacity-70">
        {label} · {bits}b
      </span>
      <span className="tracking-wider">{value || "—"}</span>
    </div>
  )
}
