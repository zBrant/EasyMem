import { cn } from "@/utils/cn"

export function EmptyState({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-24 items-center justify-center p-6 text-center text-xs uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {message}
    </div>
  )
}
