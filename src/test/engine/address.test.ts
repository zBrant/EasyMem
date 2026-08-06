import { describe, it, expect } from "vitest"
import { decompose, binaryFields } from "@/engine/address"
import { derive } from "@/engine/config"
import type { SimulatorConfig } from "@/engine/types"

function derivedFor(overrides: Partial<SimulatorConfig> = {}): ReturnType<typeof derive> {
  return derive({
    memory: { addressBits: 16, wordSize: 4 },
    cache: { totalSize: 256, lineSize: 32, associativity: 2 },
    policy: "lru",
    ...overrides,
  })
}

describe("decompose", () => {
  it("splits an address into tag/index/offset for a direct-mapped cache", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 1 },
    })
    const d = decompose(419, derived)
    expect(d.tag).toBe(1)
    expect(d.index).toBe(5)
    expect(d.offset).toBe(3)
    expect(d.binary).toBe("0000000110100011")
  })

  it("uses index 0 and a wide tag for a fully associative cache", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 8 },
    })
    const d = decompose(419, derived)
    expect(d.index).toBe(0)
    expect(d.tag).toBe(13)
    expect(d.offset).toBe(3)
  })

  it("splits correctly for a set-associative cache", () => {
    const derived = derivedFor()
    const d = decompose(419, derived)
    expect(d.tag).toBe(3)
    expect(d.index).toBe(1)
    expect(d.offset).toBe(3)
  })

  it("produces a binary string as wide as the address space", () => {
    const derived = derivedFor()
    const d = decompose(419, derived)
    expect(d.binary).toHaveLength(16)
  })

  it("decomposes address 0 correctly", () => {
    const derived = derivedFor()
    const d = decompose(0, derived)
    expect(d.tag).toBe(0)
    expect(d.index).toBe(0)
    expect(d.offset).toBe(0)
    expect(d.binary).toBe("0000000000000000")
  })
})

describe("binaryFields", () => {
  it("partitions the binary string into tag, index, and offset", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 1 },
    })
    const d = decompose(419, derived)
    const fields = binaryFields(d, derived)
    expect(fields.tag).toBe("00000001")
    expect(fields.index).toBe("101")
    expect(fields.offset).toBe("00011")
    expect(fields.tag + fields.index + fields.offset).toBe(d.binary)
  })

  it("has no index field when fully associative", () => {
    const derived = derivedFor({
      cache: { totalSize: 256, lineSize: 32, associativity: 8 },
    })
    const d = decompose(419, derived)
    const fields = binaryFields(d, derived)
    expect(fields.index).toBe("")
    expect(fields.tag).toHaveLength(derived.tagBits)
  })
})
