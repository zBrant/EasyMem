import type { ReplacementPolicy } from "./types"

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRandomPolicy(seed = 1): ReplacementPolicy {
  const rng = mulberry32(seed)
  return {
    name: "random",
    onHit() {},
    onLoad() {},
    selectVictim(set) {
      return Math.floor(rng() * set.length)
    },
  }
}
