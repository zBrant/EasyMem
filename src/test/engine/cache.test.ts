import { describe, it, expect } from "vitest"
import { createEmptyCache, lookup } from "@/engine/cache"
import { derive } from "@/engine/config"
import type {
  CacheLine,
  CacheState,
  SimulatorConfig,
} from "@/engine/types"

function derivedFor(overrides: Partial<SimulatorConfig> = {}): ReturnType<typeof derive> {
  return derive({
    memory: { addressBits: 16, wordSize: 4 },
    cache: { totalSize: 256, lineSize: 32, associativity: 2 },
    policy: "lru",
    ...overrides,
  })
}

function makeLine(tag: number, valid = true): CacheLine {
  return { valid, tag, dirty: false, metadata: {} }
}

function decompose(tag: number, index: number) {
  return { address: 0, tag, index, offset: 0, binary: "" }
}

describe("createEmptyCache", () => {
  it("builds a cache with the right number of sets and lines, all invalid", () => {
    const derived = derivedFor()
    const cache = createEmptyCache(derived)
    expect(cache).toHaveLength(derived.numSets)
    for (const set of cache) {
      expect(set).toHaveLength(derived.setSize)
      for (const line of set) {
        expect(line.valid).toBe(false)
      }
    }
  })
})

describe("lookup", () => {
  it("reports a hit when the tag is present in the selected set", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 1 },
    })
    const cache: CacheState = createEmptyCache(derived)
    cache[5] = [makeLine(1)]

    const result = lookup(cache, decompose(1, 5))
    expect(result.hit).toBe(true)
    expect(result.setIndex).toBe(5)
    expect(result.lineIndex).toBe(0)
  })

  it("reports a miss and the first free line on an empty set", () => {
    const derived = derivedFor()
    const cache = createEmptyCache(derived)
    const result = lookup(cache, decompose(9, 1))
    expect(result.hit).toBe(false)
    expect(result.lineIndex).toBeNull()
    expect(result.freeLineIndex).toBe(0)
  })

  it("reports a miss with no free line when the set is full of other tags", () => {
    const derived = derivedFor()
    const cache: CacheState = createEmptyCache(derived)
    cache[1] = [makeLine(7), makeLine(8)]

    const result = lookup(cache, decompose(9, 1))
    expect(result.hit).toBe(false)
    expect(result.freeLineIndex).toBeNull()
  })

  it("finds the tag in any line within a fully associative cache", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 8 },
    })
    const cache: CacheState = createEmptyCache(derived)
    cache[0][3] = makeLine(13)

    const result = lookup(cache, decompose(13, 0))
    expect(result.hit).toBe(true)
    expect(result.lineIndex).toBe(3)
  })

  it("only searches the selected set, ignoring the same tag in another set", () => {
    const derived = derivedFor()
    const cache: CacheState = createEmptyCache(derived)
    cache[0][0] = makeLine(5)

    const result = lookup(cache, decompose(5, 1))
    expect(result.hit).toBe(false)
    expect(result.setIndex).toBe(1)
  })
})
