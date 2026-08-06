import { useEffect, useRef } from "react"
import { Panel } from "@/components/Panel"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { resultStyle } from "@/utils/colors"
import { cn } from "@/utils/cn"

export function AccessLog() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const seek = useSimulator((s) => s.seek)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const active = activeRef.current
    if (!container || !active) return
    const c = container.getBoundingClientRect()
    const a = active.getBoundingClientRect()
    if (a.top < c.top) {
      container.scrollTop -= c.top - a.top + 8
    } else if (a.bottom > c.bottom) {
      container.scrollTop += a.bottom - c.bottom + 8
    }
  }, [currentStep])

  return (
    <Panel
      label="Log"
      className="flex-1"
      bodyClassName="overflow-y-auto p-0 max-h-[44vh] lg:max-h-none"
    >
      {steps.length === 0 ? (
        <EmptyState message="No accesses yet" />
      ) : (
        <div ref={containerRef} className="h-full overflow-y-auto">
          {steps.map((step, index) => {
            const style = resultStyle(step.result)
            const active = index === currentStep
            return (
              <button
                key={index}
                ref={active ? activeRef : null}
                onClick={() => seek(index)}
                className={cn(
                  "flex w-full items-center gap-2 border-l-2 px-3 py-1.5 text-left font-mono text-[11px] transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted/50",
                )}
              >
                <span className="w-7 shrink-0 tabular-nums text-muted-foreground/60">
                  {String(index + 1).padStart(3, "0")}
                </span>
                <span className="w-12 shrink-0 tabular-nums">
                  0x{step.access.address.toString(16)}
                </span>
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
                <span
                  className={cn(
                    "ml-auto text-[9px] uppercase tracking-wide",
                    style.text,
                  )}
                >
                  {style.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </Panel>
  )
}
