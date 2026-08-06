import { Panel } from "@/components/Panel"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { binaryFields } from "@/engine/address"
import { cn } from "@/utils/cn"

const GROUPS = {
  tag: { label: "TAG", border: "border-violet-400", text: "text-violet-300" },
  index: { label: "INDEX", border: "border-cyan-400", text: "text-cyan-300" },
  offset: { label: "OFFSET", border: "border-emerald-400", text: "text-emerald-300" },
} as const

type GroupKey = keyof typeof GROUPS

export function AddressView() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const derived = useSimulator((s) => s.derived)
  const step = steps[currentStep]

  if (!step || !derived) {
    return (
      <Panel label="Address">
        <EmptyState message="No address to display" />
      </Panel>
    )
  }

  const fields = binaryFields(step.decomposition, derived)

  const groups: { key: GroupKey; bits: string; count: number }[] = []
  if (derived.tagBits > 0)
    groups.push({ key: "tag", bits: fields.tag, count: derived.tagBits })
  if (derived.indexBits > 0)
    groups.push({ key: "index", bits: fields.index, count: derived.indexBits })
  groups.push({ key: "offset", bits: fields.offset, count: derived.offsetBits })

  return (
    <Panel label="Address" bodyClassName="p-3">
      <div className="space-y-2.5">
        <div className="flex items-baseline gap-3 font-mono">
          <span className="text-xs text-muted-foreground">
            0x{step.access.address.toString(16)}
          </span>
          <span className="text-xs text-muted-foreground/70">
            {step.decomposition.binary.length}b
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {groups.map((group) => {
            const g = GROUPS[group.key]
            return (
              <div key={group.key} className="flex flex-col gap-1">
                <div className="flex">
                  {group.bits.split("").map((bit, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex h-7 w-5 items-center justify-center border-b-2 font-mono text-xs",
                        g.border,
                        bit === "1" ? "text-foreground" : "text-muted-foreground/50",
                      )}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-wide",
                    g.text,
                  )}
                >
                  {g.label} {group.count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
