import { describe, it, expect } from "vitest"
import { derive, validate } from "@/engine/config"
import type { SimulatorConfig } from "@/engine/types"

function baseConfig(overrides: Partial<SimulatorConfig> = {}): SimulatorConfig {
  return {
    memory: { addressBits: 16, wordSize: 4 },
    cache: { totalSize: 256, lineSize: 32, associativity: 2 },
    policy: "lru",
    ...overrides,
  }
}

describe("derive", () => {
  it("derives values for a set-associative cache", () => {
    const derived = derive(baseConfig())
    expect(derived.numLines).toBe(8)
    expect(derived.numSets).toBe(4)
    expect(derived.setSize).toBe(2)
    expect(derived.offsetBits).toBe(5)
    expect(derived.indexBits).toBe(2)
    expect(derived.tagBits).toBe(9)
    expect(derived.mapping).toBe("set-associative")
    expect(derived.memorySize).toBe(65536)
    expect(derived.numBlocks).toBe(2048)
  })

  it("classifies associativity 1 as direct-mapped", () => {
    const derived = derive(
      baseConfig({ cache: { totalSize: 256, lineSize: 32, associativity: 1 } }),
    )
    expect(derived.mapping).toBe("direct")
    expect(derived.numSets).toBe(8)
    expect(derived.indexBits).toBe(3)
    expect(derived.tagBits).toBe(8)
  })

  it("classifies associativity equal to numLines as fully associative", () => {
    const derived = derive(
      baseConfig({ cache: { totalSize: 256, lineSize: 32, associativity: 8 } }),
    )
    expect(derived.mapping).toBe("associative")
    expect(derived.numSets).toBe(1)
    expect(derived.indexBits).toBe(0)
    expect(derived.tagBits).toBe(11)
  })
})

describe("validate", () => {
  it("returns no errors for a valid config", () => {
    expect(validate(baseConfig())).toEqual([])
  })

  it("rejects a non-power-of-two total size", () => {
    const errors = validate(
      baseConfig({ cache: { totalSize: 200, lineSize: 32, associativity: 1 } }),
    )
    expect(errors.some((e) => e.includes("total size must be a power of 2"))).toBe(
      true,
    )
  })

  it("rejects a non-power-of-two line size", () => {
    const errors = validate(
      baseConfig({ cache: { totalSize: 256, lineSize: 24, associativity: 1 } }),
    )
    expect(errors.some((e) => e.includes("line size must be a power of 2"))).toBe(
      true,
    )
  })

  it("rejects a line size larger than the total size", () => {
    const errors = validate(
      baseConfig({ cache: { totalSize: 32, lineSize: 64, associativity: 1 } }),
    )
    expect(errors.some((e) => e.includes("cannot exceed"))).toBe(true)
  })

  it("rejects associativity greater than the number of lines", () => {
    const errors = validate(
      baseConfig({ cache: { totalSize: 64, lineSize: 32, associativity: 8 } }),
    )
    expect(errors.some((e) => e.includes("cannot exceed"))).toBe(true)
  })

  it("rejects a word size that does not divide the line size", () => {
    const errors = validate(
      baseConfig({ memory: { addressBits: 16, wordSize: 64 } }),
    )
    expect(errors.some((e) => e.includes("multiple of the word size"))).toBe(
      true,
    )
  })

  it("rejects an address space with no bits left for the tag", () => {
    const errors = validate(
      baseConfig({
        memory: { addressBits: 6, wordSize: 4 },
        cache: { totalSize: 256, lineSize: 32, associativity: 2 },
      }),
    )
    expect(errors.some((e) => e.includes("tag"))).toBe(true)
  })

  it("rejects address spaces above the maximum", () => {
    const errors = validate(
      baseConfig({ memory: { addressBits: 64, wordSize: 4 } }),
    )
    expect(errors.some((e) => e.includes("at most"))).toBe(true)
  })
})
