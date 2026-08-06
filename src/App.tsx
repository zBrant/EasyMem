import { ConfigPanel } from "@/components/ConfigPanel/ConfigPanel"
import { MemoryView } from "@/components/MemoryView/MemoryView"
import { AddressView } from "@/components/AddressView/AddressView"
import { CacheView } from "@/components/CacheView/CacheView"
import { Controls } from "@/components/Controls/Controls"
import { StatsPanel } from "@/components/StatsPanel/StatsPanel"
import { AccessLog } from "@/components/AccessLog/AccessLog"

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Cache &amp; Memory Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualize cache mapping, replacement policies, and hits/misses step by
          step.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)_340px]">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <ConfigPanel />
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <MemoryView />
            <AddressView />
          </div>
          <CacheView />
          <Controls />
        </div>

        <div className="space-y-4">
          <StatsPanel />
          <AccessLog />
        </div>
      </div>
    </div>
  )
}
