import { ConfigPanel } from "@/components/ConfigPanel/ConfigPanel"
import { MemoryView } from "@/components/MemoryView/MemoryView"
import { AddressView } from "@/components/AddressView/AddressView"
import { CacheView } from "@/components/CacheView/CacheView"
import { Controls } from "@/components/Controls/Controls"
import { StatsPanel } from "@/components/StatsPanel/StatsPanel"
import { AccessLog } from "@/components/AccessLog/AccessLog"

export default function App() {
  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      <header className="shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Cache &amp; Memory Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualize cache mapping, replacement policies, and hits/misses step by
          step.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)_360px] lg:p-6">
        <ConfigPanel />

        <div className="min-h-0 space-y-4 overflow-y-auto lg:pr-1">
          <div className="grid gap-4 md:grid-cols-2">
            <MemoryView />
            <AddressView />
          </div>
          <CacheView />
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <StatsPanel />
          <AccessLog />
          <Controls />
        </div>
      </div>
    </div>
  )
}
