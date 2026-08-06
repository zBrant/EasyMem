import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  useSimulator,
  DEFAULT_CONFIG,
  DEFAULT_SEQUENCE,
} from "@/store/useSimulator"

function reset() {
  useSimulator.getState().pause()
  useSimulator.getState().setConfig(DEFAULT_CONFIG)
  useSimulator.getState().setSequence(DEFAULT_SEQUENCE)
}

describe("useSimulator", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    reset()
  })

  afterEach(() => {
    useSimulator.getState().pause()
    vi.useRealTimers()
  })

  it("starts with a generated timeline and a valid derived config", () => {
    const { steps, derived, errors } = useSimulator.getState()
    expect(errors).toEqual([])
    expect(steps.length).toBeGreaterThan(0)
    expect(derived?.numLines).toBe(4)
  })

  it("navigates forward, backward (clamped), and via seek", () => {
    const { steps } = useSimulator.getState()
    const last = steps.length - 1

    useSimulator.getState().stepForward()
    expect(useSimulator.getState().currentStep).toBe(1)

    useSimulator.getState().seek(last)
    expect(useSimulator.getState().currentStep).toBe(last)

    useSimulator.getState().stepForward()
    expect(useSimulator.getState().currentStep).toBe(last)

    useSimulator.getState().stepBackward()
    useSimulator.getState().stepBackward()
    expect(useSimulator.getState().currentStep).toBe(last - 2)

    useSimulator.getState().seek(-5)
    expect(useSimulator.getState().currentStep).toBe(0)
  })

  it("regenerates the timeline and resets to step 0 when config changes", () => {
    useSimulator.getState().seek(3)
    useSimulator.getState().setConfig({ policy: "fifo" })
    const { steps, currentStep } = useSimulator.getState()
    expect(currentStep).toBe(0)
    expect(steps.length).toBe(DEFAULT_SEQUENCE.length)
  })

  it("clears the timeline and records errors for an invalid config", () => {
    useSimulator.getState().setConfig({
      cache: { totalSize: 200, lineSize: 16, associativity: 2 },
    })
    const { steps, errors, derived } = useSimulator.getState()
    expect(errors.length).toBeGreaterThan(0)
    expect(steps).toEqual([])
    expect(derived).toBeNull()
  })

  it("plays through the timeline and pauses at the end", () => {
    const { steps, speed } = useSimulator.getState()
    useSimulator.getState().setSpeed(100)
    useSimulator.getState().play()
    expect(useSimulator.getState().isPlaying).toBe(true)

    vi.advanceTimersByTime(speed * (steps.length + 5))

    expect(useSimulator.getState().currentStep).toBe(steps.length - 1)
    expect(useSimulator.getState().isPlaying).toBe(false)
  })
})
