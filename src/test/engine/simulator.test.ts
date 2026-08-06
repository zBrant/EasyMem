import { describe, it, expect } from "vitest"
import { run } from "@/engine/simulator"
import type { Access, SimulatorConfig } from "@/engine/types"

function access(address: number, op: "read" | "write" = "read"): Access {
  return { address, op }
}

function config(overrides: Partial<SimulatorConfig> = {}): SimulatorConfig {
  return {
    memory: { addressBits: 8, wordSize: 1 },
    cache: { totalSize: 64, lineSize: 16, associativity: 1 },
    policy: "lru",
    ...overrides,
  }
}

describe("run", () => {
  it("returns no steps for an empty access sequence", () => {
    expect(run(config(), [])).toEqual([])
  })

  it("classifies the first reference to a block as compulsory and repeats as hits", () => {
    const steps = run(config(), [access(0), access(0), access(16), access(0)])
    expect(steps.map((s) => s.result)).toEqual([
      "compulsory",
      "hit",
      "compulsory",
      "hit",
    ])
    const last = steps[steps.length - 1]
    expect(last.stats).toMatchObject({ accesses: 4, hits: 2, misses: 2, compulsory: 2 })
    expect(last.stats.rate).toBeCloseTo(0.5)
  })

  it("reports conflict misses when a set is full but the cache has room", () => {
    const cfg = config({ cache: { totalSize: 64, lineSize: 16, associativity: 1 } })
    const steps = run(cfg, [access(0), access(64), access(0)])
    expect(steps.map((s) => s.result)).toEqual([
      "compulsory",
      "compulsory",
      "conflict",
    ])
  })

  it("reports capacity misses when a fully associative cache is saturated", () => {
    const cfg = config({
      cache: { totalSize: 32, lineSize: 16, associativity: 2 },
    })
    const steps = run(cfg, [access(0), access(16), access(32), access(0)])
    expect(steps.map((s) => s.result)).toEqual([
      "compulsory",
      "compulsory",
      "compulsory",
      "capacity",
    ])
  })

  it("keeps each step's snapshot independent (immutability)", () => {
    const cfg = config({ cache: { totalSize: 64, lineSize: 16, associativity: 1 } })
    const steps = run(cfg, [access(0), access(64)])
    expect(steps[0].cacheAfter[0][0].tag).toBe(0)
    expect(steps[1].cacheAfter[0][0].tag).toBe(1)
    expect(steps[0].cacheAfter[0][0].tag).toBe(0)
  })

  it("evicts different victims under different policies", () => {
    const cfg = (policy: SimulatorConfig["policy"]) =>
      config({
        cache: { totalSize: 32, lineSize: 16, associativity: 2 },
        policy,
      })
    const sequence = [access(0), access(16), access(32), access(0)]

    const lruStep = run(cfg("lru"), sequence)[2]
    const optimalStep = run(cfg("optimal"), sequence)[2]

    expect(lruStep.evicted?.tag).toBe(0)
    expect(optimalStep.evicted?.tag).toBe(1)
  })

  it("lets Optimal turn a later access into a hit where LRU misses", () => {
    const cfg = (policy: SimulatorConfig["policy"]) =>
      config({
        cache: { totalSize: 32, lineSize: 16, associativity: 2 },
        policy,
      })
    const sequence = [access(0), access(16), access(32), access(0)]

    expect(run(cfg("lru"), sequence)[3].result).toBe("capacity")
    expect(run(cfg("optimal"), sequence)[3].result).toBe("hit")
  })

  it("marks a line dirty on a write hit and reports it on eviction", () => {
    const cfg = config({ cache: { totalSize: 16, lineSize: 16, associativity: 1 } })
    const steps = run(cfg, [access(0, "write"), access(16)])
    expect(steps[0].cacheAfter[0][0].dirty).toBe(true)
    expect(steps[1].evicted).toEqual({ tag: 0, dirty: true })
  })
})
