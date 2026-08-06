import { mulberry32 } from "@/utils/random"
import type { ReplacementPolicy } from "./types"

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
