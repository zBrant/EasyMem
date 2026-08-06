import { decompose } from "@/engine/address"
import { cloneCache, createEmptyCache, lookup } from "@/engine/cache"
import { derive } from "@/engine/config"
import { createPolicy } from "@/engine/policies"
import type {
  Access,
  AccessResult,
  Eviction,
  SimulatorConfig,
  Step,
} from "@/engine/types"

export function run(config: SimulatorConfig, accesses: Access[]): Step[] {
  const derived = derive(config)
  const lineSize = 2 ** derived.offsetBits
  const policy = createPolicy(config.policy)
  const blockAddresses = accesses.map((a) => Math.floor(a.address / lineSize))

  let cache = createEmptyCache(derived)
  let totalValid = 0
  const seenBlocks = new Set<number>()
  const stats = {
    accesses: 0,
    hits: 0,
    misses: 0,
    compulsory: 0,
    capacity: 0,
    conflict: 0,
    rate: 0,
  }
  const steps: Step[] = []

  accesses.forEach((access, index) => {
    cache = cloneCache(cache)
    const decomposition = decompose(access.address, derived)
    const blockAddress = blockAddresses[index]
    const { hit, setIndex, lineIndex: hitLine, freeLineIndex } = lookup(cache, decomposition)
    const set = cache[setIndex]

    let result: AccessResult
    let lineIndex: number
    let evicted: Eviction | undefined

    if (hit) {
      result = "hit"
      lineIndex = hitLine as number
      stats.hits++
      const line = set[lineIndex]
      if (access.op === "write") line.dirty = true
      policy.onHit(line)
    } else {
      stats.misses++
      if (!seenBlocks.has(blockAddress)) {
        result = "compulsory"
        stats.compulsory++
      } else if (totalValid < derived.numLines) {
        result = "conflict"
        stats.conflict++
      } else {
        result = "capacity"
        stats.capacity++
      }

      let placement: number
      if (freeLineIndex !== null) {
        placement = freeLineIndex
        totalValid++
      } else {
        placement = policy.selectVictim(set, {
          setIndex,
          numSets: derived.numSets,
          currentIndex: index,
          futureBlocks: blockAddresses.slice(index + 1),
        })
        const victim = set[placement]
        evicted = { tag: victim.tag, dirty: victim.dirty }
      }

      lineIndex = placement
      const line = set[placement]
      line.valid = true
      line.tag = decomposition.tag
      line.dirty = access.op === "write"
      policy.onLoad(line)
    }

    seenBlocks.add(blockAddress)
    stats.accesses = index + 1
    stats.rate = stats.accesses > 0 ? stats.hits / stats.accesses : 0

    steps.push({
      index,
      access,
      decomposition,
      result,
      setIndex,
      lineIndex,
      evicted,
      cacheAfter: cache,
      stats: { ...stats },
    })
  })

  return steps
}
