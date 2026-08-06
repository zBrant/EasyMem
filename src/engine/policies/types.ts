import type { CacheLine, ReplacementPolicyName } from "@/engine/types"

export interface PolicyContext {
  setIndex: number
  numSets: number
  currentIndex: number
  futureBlocks: number[]
}

export interface ReplacementPolicy {
  readonly name: ReplacementPolicyName
  onHit(line: CacheLine): void
  onLoad(line: CacheLine): void
  selectVictim(set: CacheLine[], context: PolicyContext): number
}
