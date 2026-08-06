import { describe, it, expect } from "vitest"
import {
  sequential,
  loop,
  strided,
  random,
  parseSequence,
  toAccesses,
} from "@/engine/sequences"

describe("sequential", () => {
  it("counts up from start by step", () => {
    expect(sequential(5)).toEqual([0, 1, 2, 3, 4])
    expect(sequential(3, 10, 2)).toEqual([10, 12, 14])
  })
})

describe("loop", () => {
  it("repeats the pattern to fill the count", () => {
    expect(loop(5, [7, 8])).toEqual([7, 8, 7, 8, 7])
  })

  it("returns an empty array for an empty pattern", () => {
    expect(loop(3, [])).toEqual([])
  })
})

describe("strided", () => {
  it("steps by stride and wraps around the modulus", () => {
    expect(strided(4, 0, 5, 16)).toEqual([0, 5, 10, 15])
    expect(strided(3, 14, 4, 16)).toEqual([14, 2, 6])
  })
})

describe("random", () => {
  it("produces in-range addresses with the requested count", () => {
    const seq = random(50, 16, 42)
    expect(seq).toHaveLength(50)
    for (const a of seq) {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThan(16)
    }
  })

  it("is deterministic for a fixed seed", () => {
    expect(random(10, 256, 7)).toEqual(random(10, 256, 7))
  })

  it("throws for a non-positive max address", () => {
    expect(() => random(5, 0)).toThrow(RangeError)
  })
})

describe("parseSequence", () => {
  it("parses hex, decimal, and binary tokens with mixed separators", () => {
    expect(parseSequence("0x10, 32 0b1010;5")).toEqual([16, 32, 10, 5])
  })

  it("returns an empty array for blank input", () => {
    expect(parseSequence("")).toEqual([])
    expect(parseSequence("   ")).toEqual([])
  })

  it("throws on an invalid token", () => {
    expect(() => parseSequence("0x10, abc")).toThrow()
  })
})

describe("toAccesses", () => {
  it("maps addresses to read accesses by default", () => {
    expect(toAccesses([1, 2])).toEqual([
      { address: 1, op: "read" },
      { address: 2, op: "read" },
    ])
  })

  it("honors the operation argument", () => {
    expect(toAccesses([1], "write")).toEqual([{ address: 1, op: "write" }])
  })
})
