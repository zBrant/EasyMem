import { describe, it, expect } from "vitest"
import { createPolicy } from "@/engine/policies"
import type { PolicyContext, ReplacementPolicy } from "@/engine/policies"
import { createFifoPolicy } from "@/engine/policies/fifo"
import { createLfuPolicy } from "@/engine/policies/lfu"
import { createLruPolicy } from "@/engine/policies/lru"
import { createOptimalPolicy } from "@/engine/policies/optimal"
import { createRandomPolicy } from "@/engine/policies/random"
import type { CacheLine, PolicyMetadata } from "@/engine/types"

function line(tag: number, metadata: PolicyMetadata = {}): CacheLine {
  return { valid: true, tag, dirty: false, metadata }
}

const baseContext: PolicyContext = {
  setIndex: 0,
  numSets: 4,
  currentIndex: 0,
  futureBlocks: [],
}

describe("LRU", () => {
  it("evicts the least recently used line", () => {
    const policy = createLruPolicy()
    const a = line(1)
    const b = line(2)
    const set = [a, b]
    policy.onLoad(a)
    policy.onLoad(b)
    policy.onHit(a)

    expect(policy.selectVictim(set, baseContext)).toBe(1)
  })
})

describe("FIFO", () => {
  it("evicts the first inserted line, ignoring hits", () => {
    const policy = createFifoPolicy()
    const a = line(1)
    const b = line(2)
    const set = [a, b]
    policy.onLoad(a)
    policy.onLoad(b)
    policy.onHit(a)

    expect(policy.selectVictim(set, baseContext)).toBe(0)
  })
})

describe("LFU", () => {
  it("evicts the least frequently used line", () => {
    const policy = createLfuPolicy()
    const a = line(1)
    const b = line(2)
    const set = [a, b]
    policy.onLoad(a)
    policy.onLoad(b)
    policy.onHit(a)
    policy.onHit(a)

    expect(policy.selectVictim(set, baseContext)).toBe(1)
  })

  it("breaks frequency ties by insertion order (FIFO)", () => {
    const policy = createLfuPolicy()
    const a = line(1)
    const b = line(2)
    const set = [a, b]
    policy.onLoad(a)
    policy.onLoad(b)

    expect(policy.selectVictim(set, baseContext)).toBe(0)
  })
})

describe("Random", () => {
  it("returns an index within the set", () => {
    const policy = createRandomPolicy(42)
    const set = [line(1), line(2), line(3)]
    const idx = policy.selectVictim(set, baseContext)
    expect(idx).toBeGreaterThanOrEqual(0)
    expect(idx).toBeLessThan(set.length)
  })

  it("is deterministic for a fixed seed", () => {
    const p1 = createRandomPolicy(99)
    const p2 = createRandomPolicy(99)
    const set = [line(1), line(2), line(3), line(4)]
    const seq1 = [
      p1.selectVictim(set, baseContext),
      p1.selectVictim(set, baseContext),
      p1.selectVictim(set, baseContext),
    ]
    const seq2 = [
      p2.selectVictim(set, baseContext),
      p2.selectVictim(set, baseContext),
      p2.selectVictim(set, baseContext),
    ]
    expect(seq1).toEqual(seq2)
  })
})

describe("Optimal", () => {
  it("evicts the line reused farthest in the future", () => {
    const policy = createOptimalPolicy()
    const set = [line(2), line(5)]
    const context: PolicyContext = {
      ...baseContext,
      setIndex: 1,
      futureBlocks: [9, 9, 21],
    }
    expect(policy.selectVictim(set, context)).toBe(1)
  })

  it("prefers evicting a block that is never referenced again", () => {
    const policy = createOptimalPolicy()
    const set = [line(2), line(5)]
    const context: PolicyContext = {
      ...baseContext,
      setIndex: 1,
      futureBlocks: [9],
    }
    expect(policy.selectVictim(set, context)).toBe(1)
  })
})

describe("createPolicy registry", () => {
  const names = ["lru", "fifo", "lfu", "random", "optimal"] as const

  it.each(names)("creates the policy matching the name %s", (name) => {
    const policy: ReplacementPolicy = createPolicy(name)
    expect(policy.name).toBe(name)
  })

  it("throws on an unknown policy name", () => {
    expect(() => createPolicy("nonsense" as never)).toThrow()
  })
})
