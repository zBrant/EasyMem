import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Panel } from "@/components/Panel"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSimulator } from "@/store/useSimulator"

export function Controls() {
  const steps = useSimulator((s) => s.steps)
  const currentStep = useSimulator((s) => s.currentStep)
  const isPlaying = useSimulator((s) => s.isPlaying)
  const speed = useSimulator((s) => s.speed)
  const togglePlay = useSimulator((s) => s.togglePlay)
  const stepForward = useSimulator((s) => s.stepForward)
  const stepBackward = useSimulator((s) => s.stepBackward)
  const seek = useSimulator((s) => s.seek)
  const setSpeed = useSimulator((s) => s.setSpeed)

  const last = steps.length - 1
  const empty = steps.length === 0
  const pad = (n: number) => String(n).padStart(3, "0")

  return (
    <Panel label="Playback" bodyClassName="p-3">
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-sm"
            disabled={empty}
            onClick={() => seek(0)}
            aria-label="Restart"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-sm"
            disabled={empty || currentStep === 0}
            onClick={stepBackward}
            aria-label="Step backward"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            className="h-7 w-7 rounded-sm"
            disabled={empty}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-sm"
            disabled={empty || currentStep >= last}
            onClick={stepForward}
            aria-label="Step forward"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-sm"
            disabled={empty}
            onClick={() => seek(last)}
            aria-label="Jump to end"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
          <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
            {pad(empty ? 0 : currentStep + 1)}/{pad(steps.length)}
          </span>
        </div>

        <Slider
          value={[empty ? 0 : currentStep]}
          max={Math.max(0, last)}
          step={1}
          disabled={empty}
          onValueChange={(value) => seek(value[0])}
        />

        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            delay {speed}ms
          </span>
          <Slider
            value={[speed]}
            min={100}
            max={1500}
            step={100}
            onValueChange={(value) => setSpeed(value[0])}
          />
        </div>
      </div>
    </Panel>
  )
}
