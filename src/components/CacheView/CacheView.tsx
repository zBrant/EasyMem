import { motion, AnimatePresence } from "framer-motion"
import { Panel } from "@/components/Panel"
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
    return (
      <Panel label="Cache" className="min-h-32">
        <EmptyState message="Fix the configuration to view the cache" />
      </Panel>
    )
  }

  const style = resultStyle(step.result)

  return (
    <Panel
      label="Cache"
      className="min-h-32"
      bodyClassName="overflow-auto p-3"
      action={
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide">
          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
          <span className={style.text}>{style.label}</span>
        </span>
      }
    >
      <div className="space-y-1.5">
        {step.cacheAfter.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center gap-2">
            <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {derived.numSets > 1 ? `S${setIndex}` : "SET"}
            </span>
            <div className="flex flex-1 gap-1">
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
      </div>

      {step.evicted && (
        <p className="mt-2 border-t border-border/60 pt-2 font-mono text-[11px] text-muted-foreground">
          evicted tag {step.evicted.tag}
          {step.evicted.dirty ? " · dirty write-back" : ""}
        </p>
      )}
    </Panel>
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
        "flex h-14 flex-1 flex-col items-center justify-center rounded-sm border px-1",
        highlight
          ? highlight.cell
          : line.valid
            ? "border-border bg-background/50"
            : "border-dashed border-border/40 bg-transparent",
      )}
    >
      {line.valid ? (
        <div className="flex flex-col items-center leading-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={line.tag}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16 }}
              className="font-mono text-sm font-semibold"
            >
              {line.tag}
            </motion.span>
          </AnimatePresence>
          <span className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
            tag
          </span>
          {line.dirty && (
            <span className="mt-0.5 h-1 w-1 rounded-full bg-amber-400" />
          )}
        </div>
      ) : (
        <span className="font-mono text-xs text-muted-foreground/50">·</span>
      )}
    </motion.div>
  )
}
