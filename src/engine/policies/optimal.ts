import type { CacheLine } from "@/engine/types"
import type { PolicyContext, ReplacementPolicy } from "./types"

export function createOptimalPolicy(): ReplacementPolicy {
  return {
    name: "optimal",
    onHit() {},
    onLoad() {},
    selectVictim(set, context) {
      let victim = 0
      let victimDistance = nextUseDistance(set[0], context)
      for (let i = 1; i < set.length; i++) {
        const distance = nextUseDistance(set[i], context)
        if (distance > victimDistance) {
          victim = i
          victimDistance = distance
        }
      }
      return victim
    },
  }
}

function nextUseDistance(line: CacheLine, context: PolicyContext): number {
  const blockAddress = line.tag * context.numSets + context.setIndex
  for (let i = 0; i < context.futureBlocks.length; i++) {
    if (context.futureBlocks[i] === blockAddress) return i
  }
  return Infinity
}
