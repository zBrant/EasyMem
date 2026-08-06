import type { CacheLine } from "@/engine/types"
import type { ReplacementPolicy } from "./types"

export function createLruPolicy(): ReplacementPolicy {
  let clock = 0
  return {
    name: "lru",
    onHit(line: CacheLine) {
      line.metadata = { lastUsed: ++clock }
    },
    onLoad(line: CacheLine) {
      line.metadata = { lastUsed: ++clock }
    },
    selectVictim(set) {
      let victim = 0
      for (let i = 1; i < set.length; i++) {
        if (
          (set[i].metadata.lastUsed ?? -Infinity) <
          (set[victim].metadata.lastUsed ?? -Infinity)
        ) {
          victim = i
        }
      }
      return victim
    },
  }
}
