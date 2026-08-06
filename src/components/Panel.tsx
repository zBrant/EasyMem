import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface PanelProps {
  label?: string
  action?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

export function Panel({
  label,
  action,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-sm border border-border bg-card/70",
        className,
      )}
    >
      {label && (
        <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-3 py-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
          {action}
        </div>
      )}
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  )
}
