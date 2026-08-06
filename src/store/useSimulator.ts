import { create } from "zustand"
import { derive, validate } from "@/engine/config"
import { toAccesses } from "@/engine/sequences"
import { run } from "@/engine/simulator"
import type {
  DerivedConfig,
  SimulatorConfig,
  Step,
} from "@/engine/types"

export const DEFAULT_CONFIG: SimulatorConfig = {
  memory: { addressBits: 8, wordSize: 1 },
  cache: { totalSize: 64, lineSize: 16, associativity: 2 },
  policy: "lru",
}

export const DEFAULT_SEQUENCE = [0, 16, 32, 48, 0, 16, 32, 48, 0, 16, 32, 48]

const DEFAULT_SPEED = 700

export interface SimulatorStore {
  config: SimulatorConfig
  sequence: number[]
  steps: Step[]
  currentStep: number
  isPlaying: boolean
  speed: number
  errors: string[]
  derived: DerivedConfig | null

  setConfig: (patch: Partial<SimulatorConfig>) => void
  setSequence: (addresses: number[]) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  stepForward: () => void
  stepBackward: () => void
  seek: (index: number) => void
  setSpeed: (ms: number) => void
}

let playTimer: ReturnType<typeof setInterval> | null = null

function clearTimer() {
  if (playTimer !== null) {
    clearInterval(playTimer)
    playTimer = null
  }
}

function buildSteps(config: SimulatorConfig, sequence: number[]): Step[] {
  const errors = validate(config)
  if (errors.length > 0) return []
  return run(config, toAccesses(sequence))
}

export const useSimulator = create<SimulatorStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  sequence: DEFAULT_SEQUENCE,
  steps: buildSteps(DEFAULT_CONFIG, DEFAULT_SEQUENCE),
  currentStep: 0,
  isPlaying: false,
  speed: DEFAULT_SPEED,
  errors: [],
  derived: derive(DEFAULT_CONFIG),

  setConfig: (patch) => {
    clearTimer()
    const config = { ...get().config, ...patch }
    const errors = validate(config)
    const steps = errors.length === 0 ? run(config, toAccesses(get().sequence)) : []
    set({
      config,
      errors,
      steps,
      derived: errors.length === 0 ? derive(config) : null,
      currentStep: 0,
      isPlaying: false,
    })
  },

  setSequence: (addresses) => {
    clearTimer()
    const { config, errors } = get()
    const steps =
      errors.length === 0 ? run(config, toAccesses(addresses)) : []
    set({
      sequence: addresses,
      steps,
      currentStep: 0,
      isPlaying: false,
    })
  },

  play: () => {
    const { steps, currentStep, isPlaying } = get()
    if (isPlaying || steps.length === 0) return
    const start = currentStep >= steps.length - 1 ? 0 : currentStep
    set({ currentStep: start, isPlaying: true })
    playTimer = setInterval(() => {
      const { currentStep: cs, steps: st } = get()
      if (cs >= st.length - 1) {
        get().pause()
        return
      }
      set({ currentStep: cs + 1 })
    }, get().speed)
  },

  pause: () => {
    clearTimer()
    set({ isPlaying: false })
  },

  togglePlay: () => {
    if (get().isPlaying) get().pause()
    else get().play()
  },

  stepForward: () =>
    set((s) => ({
      currentStep:
        s.steps.length === 0
          ? 0
          : Math.min(s.currentStep + 1, s.steps.length - 1),
    })),

  stepBackward: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  seek: (index) =>
    set((s) => ({
      currentStep: Math.max(0, Math.min(index, s.steps.length - 1)),
    })),

  setSpeed: (ms) => {
    set({ speed: ms })
    if (get().isPlaying) {
      clearTimer()
      playTimer = setInterval(() => {
        const { currentStep: cs, steps: st } = get()
        if (cs >= st.length - 1) {
          get().pause()
          return
        }
        set({ currentStep: cs + 1 })
      }, ms)
    }
  },
}))
