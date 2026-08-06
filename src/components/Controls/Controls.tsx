import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <Card className="shrink-0">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={empty}
            onClick={() => seek(0)}
            aria-label="Restart"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={empty || currentStep === 0}
            onClick={stepBackward}
            aria-label="Step backward"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            disabled={empty}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={empty || currentStep >= last}
            onClick={stepForward}
            aria-label="Step forward"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={empty}
            onClick={() => seek(last)}
            aria-label="Jump to end"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <span className="ml-auto font-mono text-sm text-muted-foreground">
            {empty ? 0 : currentStep + 1} / {steps.length}
          </span>
        </div>

        <Slider
          value={[empty ? 0 : currentStep]}
          max={Math.max(0, last)}
          step={1}
          disabled={empty}
          onValueChange={(value) => seek(value[0])}
        />

        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-muted-foreground">
            Delay {speed} ms
          </span>
          <Slider
            value={[speed]}
            min={100}
            max={1500}
            step={100}
            onValueChange={(value) => setSpeed(value[0])}
          />
        </div>
      </CardContent>
    </Card>
  )
}
