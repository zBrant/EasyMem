import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  if (steps.length === 0) {
    return <EmptyState message="No accesses yet." />
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>Access log</CardTitle>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className="max-h-[50vh] overflow-auto p-0 lg:max-h-none lg:min-h-0 lg:flex-1"
      >
        <ul className="divide-y">
          {steps.map((step, index) => {
            const style = resultStyle(step.result)
            const active = index === currentStep
            return (
              <li key={index}>
                <button
                  ref={active ? activeRef : null}
                  onClick={() => seek(index)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted/50",
                    active && "bg-muted",
                  )}
                >
                  <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="w-16 shrink-0 font-mono">
                    0x{step.access.address.toString(16)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("ml-auto", style.badge)}
                  >
                    {style.label}
                  </Badge>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
