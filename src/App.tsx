import { Cpu } from "lucide-react"
import { ConfigPanel } from "@/components/ConfigPanel/ConfigPanel"
import { MemoryView } from "@/components/MemoryView/MemoryView"
import { AddressView } from "@/components/AddressView/AddressView"
import { CacheView } from "@/components/CacheView/CacheView"
import { Controls } from "@/components/Controls/Controls"
import { StatsPanel } from "@/components/StatsPanel/StatsPanel"
import { AccessLog } from "@/components/AccessLog/AccessLog"
import { useSimulator } from "@/store/useSimulator"

export default function App() {
  const derived = useSimulator((s) => s.derived)
  const policy = useSimulator((s) => s.config.policy)
  const errors = useSimulator((s) => s.errors)

  const readout = derived
    ? `${derived.mapping} · ${derived.numLines} lines · ${derived.setSize}-way · ${policy}`
    : "invalid config"

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold tracking-[0.2em]">EASYMEM</span>
          <span className="ml-2 hidden text-[11px] text-muted-foreground sm:inline">
            // cache &amp; memory simulator
          </span>
        </div>
        <div
          className={`hidden font-mono text-[11px] tracking-wide md:block ${
            errors.length ? "text-rose-400" : "text-muted-foreground"
          }`}
        >
          {readout.toUpperCase()}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[320px_minmax(0,1fr)_340px] lg:p-4">
        <ConfigPanel />

        <div className="min-h-0 space-y-3 overflow-y-auto lg:pr-1">
          <div className="grid gap-3 md:grid-cols-2">
            <MemoryView />
            <AddressView />
          </div>
          <CacheView />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <StatsPanel />
          <AccessLog />
          <Controls />
        </div>
      </div>
    </div>
  )
}
