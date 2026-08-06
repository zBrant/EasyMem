import type { CacheLine } from "@/engine/types"
import type { ReplacementPolicy } from "./types"

export function createLfuPolicy(): ReplacementPolicy {
  let counter = 0
  return {
    name: "lfu",
    onHit(line: CacheLine) {
      const freq = (line.metadata.freq ?? 0) + 1
      line.metadata = { ...line.metadata, freq }
    },
    onLoad(line: CacheLine) {
      line.metadata = { freq: 1, insertOrder: ++counter }
    },
    selectVictim(set) {
      let victim = 0
      for (let i = 1; i < set.length; i++) {
        const cur = set[i].metadata
        const best = set[victim].metadata
        const curFreq = cur.freq ?? Infinity
        const bestFreq = best.freq ?? Infinity
        const curOrder = cur.insertOrder ?? Infinity
        const bestOrder = best.insertOrder ?? Infinity
        if (curFreq < bestFreq || (curFreq === bestFreq && curOrder < bestOrder)) {
          victim = i
        }
      }
      return victim
    },
  }
}
