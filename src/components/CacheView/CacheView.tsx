import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"
import { resultStyle, type ResultStyle } from "@/utils/colors"
import { cn } from "@/utils/cn"
import type { CacheLine } from "@/engine/types"

export function CacheView() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const derived = useSimulator((s) => s.derived)
  const step = steps[currentStep]

  if (!step || !derived) {
    return <EmptyState message="Fix the configuration to view the cache." />
  }

  const style = resultStyle(step.result)

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Cache</span>
          <Badge className={cn("border", style.badge)}>{style.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {step.cacheAfter.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
              {derived.numSets > 1 ? `Set ${setIndex}` : "Set"}
            </span>
            <div className="flex flex-1 gap-1.5">
              {set.map((line, lineIndex) => {
                const active =
                  setIndex === step.setIndex && lineIndex === step.lineIndex
                return (
                  <LineCell
                    key={lineIndex}
                    line={line}
                    highlight={active ? style : null}
                  />
                )
              })}
            </div>
          </div>
        ))}
        {step.evicted && (
          <p className="pt-1 text-xs text-muted-foreground">
            Evicted tag {step.evicted.tag}
            {step.evicted.dirty ? " (dirty — written back to memory)" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function LineCell({
  line,
  highlight,
}: {
  line: CacheLine
  highlight: ResultStyle | null
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex h-16 flex-1 flex-col items-center justify-center rounded-md border p-1 text-center transition-colors",
        highlight ? highlight.highlight : "border-border bg-card",
        !line.valid && "opacity-40",
      )}
    >
      {line.valid ? (
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={line.tag}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-sm font-semibold"
            >
              {line.tag}
            </motion.span>
          </AnimatePresence>
          <span className="text-[10px] uppercase text-muted-foreground">
            tag
          </span>
          {line.dirty && (
            <span className="text-[10px] font-medium text-amber-600">
              dirty
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
    </motion.div>
  )
}
