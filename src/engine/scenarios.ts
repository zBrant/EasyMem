import type { SimulatorConfig } from "@/engine/types"

export interface Scenario {
  id: string
  name: string
  description: string
  config: SimulatorConfig
  sequence: number[]
}

const baseMemory = { addressBits: 8, wordSize: 1 }

export const SCENARIOS: Scenario[] = [
  {
    id: "thrashing",
    name: "Thrashing (direct-mapped)",
    description:
      "Two blocks fight over a single direct-mapped line, evicting each other on every access after the first two.",
    config: {
      memory: baseMemory,
      cache: { totalSize: 16, lineSize: 16, associativity: 1 },
      policy: "lru",
    },
    sequence: [0, 16, 0, 16, 0, 16, 0, 16],
  },
  {
    id: "spatial-locality",
    name: "Spatial locality",
    description:
      "A sequential byte scan. Once a block is loaded, the remaining bytes in that block hit, showing the benefit of larger blocks.",
    config: {
      memory: baseMemory,
      cache: { totalSize: 256, lineSize: 16, associativity: 2 },
      policy: "lru",
    },
    sequence: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ],
  },
  {
    id: "temporal-locality",
    name: "Temporal locality",
    description:
      "A small working set is reused in a loop. After the compulsory warm-up misses, every access hits.",
    config: {
      memory: baseMemory,
      cache: { totalSize: 64, lineSize: 16, associativity: 2 },
      policy: "lru",
    },
    sequence: [
      0, 16, 32, 48, 0, 16, 32, 48, 0, 16, 32, 48, 0, 16, 32, 48, 0, 16, 32, 48,
    ],
  },
  {
    id: "associativity-effect",
    name: "Associativity effect",
    description:
      "Blocks mapping to the same set thrash under direct-mapped (associativity 1). Re-run with associativity 2 and the conflicts disappear.",
    config: {
      memory: baseMemory,
      cache: { totalSize: 32, lineSize: 16, associativity: 1 },
      policy: "lru",
    },
    sequence: [0, 32, 0, 32, 0, 32, 0, 32],
  },
  {
    id: "belady-anomaly",
    name: "Belady's anomaly (FIFO)",
    description:
      "The classic reference string. Under FIFO, a larger cache can yield fewer hits — compare a 2-line vs 4-line fully-associative cache (totalSize 32 vs 64).",
    config: {
      memory: baseMemory,
      cache: { totalSize: 32, lineSize: 16, associativity: 2 },
      policy: "fifo",
    },
    sequence: [0, 16, 32, 48, 0, 16, 64, 0, 16, 32, 48, 64],
  },
]

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id)
}
