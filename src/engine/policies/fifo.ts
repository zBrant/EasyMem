import type { CacheLine } from "@/engine/types"
import type { ReplacementPolicy } from "./types"

export function createFifoPolicy(): ReplacementPolicy {
  let counter = 0
  return {
    name: "fifo",
    onHit() {},
    onLoad(line: CacheLine) {
      line.metadata = { insertOrder: ++counter }
    },
    selectVictim(set) {
      let victim = 0
      for (let i = 1; i < set.length; i++) {
        if (
          (set[i].metadata.insertOrder ?? Infinity) <
          (set[victim].metadata.insertOrder ?? Infinity)
        ) {
          victim = i
        }
      }
      return victim
    },
  }
}
