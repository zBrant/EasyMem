import { motion } from "framer-motion"
import { Panel } from "@/components/Panel"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"

export function MemoryView() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const derived = useSimulator((s) => s.derived)
  const step = steps[currentStep]

  if (!step || !derived) {
    return (
      <Panel label="Memory">
        <EmptyState message="Fix the configuration to view memory" />
      </Panel>
    )
  }

  const lineSize = 2 ** derived.offsetBits
  const block = Math.floor(step.access.address / lineSize)
  const start = block * lineSize
  const end = start + lineSize - 1
  const address = step.access.address

  return (
    <Panel label="Memory" bodyClassName="p-3">
      <div className="space-y-2.5">
        <div className="flex items-baseline gap-3 font-mono">
          <span className="text-2xl font-semibold tracking-tight">
            0x{address.toString(16)}
          </span>
          <span className="text-xs text-muted-foreground">dec {address}</span>
        </div>

        <motion.div
          key={block}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-sm border-l-2 border-sky-400 bg-sky-500/5 px-2.5 py-1.5"
        >
          <p className="font-mono text-[11px] text-sky-300">
            BLOCK {block} · bytes {start}–{end}
          </p>
        </motion.div>

        {step.evicted && (
          <p className="font-mono text-[11px] text-amber-400/80">
            ↩ evicted block returned to memory
            {step.evicted.dirty ? " (write-back)" : ""}
          </p>
        )}

        <p className="font-mono text-[10px] text-muted-foreground/70">
          {derived.numBlocks} blocks × {lineSize}B = {derived.memorySize}B space
        </p>
      </div>
    </Panel>
  )
}
