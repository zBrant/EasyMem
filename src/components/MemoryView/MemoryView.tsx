import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/EmptyState"
import { useSimulator } from "@/store/useSimulator"

export function MemoryView() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const derived = useSimulator((s) => s.derived)
  const step = steps[currentStep]

  if (!step || !derived) {
    return <EmptyState message="Fix the configuration to view memory." />
  }

  const lineSize = 2 ** derived.offsetBits
  const block = Math.floor(step.access.address / lineSize)
  const start = block * lineSize
  const end = start + lineSize - 1
  const address = step.access.address

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Memory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 font-mono text-sm">
          <span>
            <span className="text-muted-foreground">addr </span>
            {address}
          </span>
          <span>
            <span className="text-muted-foreground">hex </span>0x
            {address.toString(16)}
          </span>
        </div>

        <motion.div
          key={block}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-md border border-sky-500/50 bg-sky-500/10 p-3"
        >
          <p className="text-xs font-medium text-sky-700">
            Block {block} · bytes {start}–{end}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Loaded into cache {step.result === "hit" ? "(already present)" : ""}
          </p>
        </motion.div>

        {step.evicted && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700">
            Evicted block returned to memory
            {step.evicted.dirty ? " (dirty write-back)" : ""}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          {derived.numBlocks} blocks × {lineSize} B = {derived.memorySize} B
          address space
        </p>
      </CardContent>
    </Card>
  )
}
