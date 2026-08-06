import type { ReplacementPolicyName } from "@/engine/types"
import { createFifoPolicy } from "./fifo"
import { createLfuPolicy } from "./lfu"
import { createLruPolicy } from "./lru"
import { createOptimalPolicy } from "./optimal"
import { createRandomPolicy } from "./random"
import type { ReplacementPolicy } from "./types"

export interface PolicyCreateOptions {
  seed?: number
}

export function createPolicy(
  name: ReplacementPolicyName,
  options: PolicyCreateOptions = {},
): ReplacementPolicy {
  switch (name) {
    case "lru":
      return createLruPolicy()
    case "fifo":
      return createFifoPolicy()
    case "lfu":
      return createLfuPolicy()
    case "random":
      return createRandomPolicy(options.seed)
    case "optimal":
      return createOptimalPolicy()
    default: {
      const exhaustive: never = name
      throw new Error(`Unknown replacement policy: ${exhaustive}`)
    }
  }
}

export type { PolicyContext, ReplacementPolicy } from "./types"
