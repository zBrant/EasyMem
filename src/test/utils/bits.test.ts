import { describe, it, expect } from "vitest"
import { isPowerOfTwo, log2Int, mask, toBinary } from "@/utils/bits"

describe("isPowerOfTwo", () => {
  it("returns true for powers of two", () => {
    for (const n of [1, 2, 4, 8, 16, 32, 1024, 65536]) {
      expect(isPowerOfTwo(n)).toBe(true)
    }
  })

  it("returns false for non-powers of two", () => {
    for (const n of [0, 3, 5, 6, 7, 9, 15, 17, 1000]) {
      expect(isPowerOfTwo(n)).toBe(false)
    }
  })

  it("returns false for non-positive and non-integer values", () => {
    for (const n of [-1, -4, 0, 0.5, 2.5, NaN, Infinity]) {
      expect(isPowerOfTwo(n)).toBe(false)
    }
  })
})

describe("log2Int", () => {
  it("returns the exponent for powers of two", () => {
    expect(log2Int(1)).toBe(0)
    expect(log2Int(2)).toBe(1)
    expect(log2Int(4)).toBe(2)
    expect(log2Int(8)).toBe(3)
    expect(log2Int(1024)).toBe(10)
    expect(log2Int(65536)).toBe(16)
  })

  it("throws for non-powers of two", () => {
    for (const n of [0, 3, 6, 7, -2, 0.5]) {
      expect(() => log2Int(n)).toThrow(RangeError)
    }
  })
})

describe("mask", () => {
  it("returns the lower N bits set", () => {
    expect(mask(0)).toBe(0)
    expect(mask(1)).toBe(1)
    expect(mask(3)).toBe(7)
    expect(mask(8)).toBe(255)
    expect(mask(10)).toBe(1023)
  })

  it("throws for negative bit counts", () => {
    expect(() => mask(-1)).toThrow(RangeError)
  })
})

describe("toBinary", () => {
  it("pads the binary representation to the given width", () => {
    expect(toBinary(5, 3)).toBe("101")
    expect(toBinary(5, 8)).toBe("00000101")
    expect(toBinary(0, 4)).toBe("0000")
    expect(toBinary(255, 8)).toBe("11111111")
  })

  it("does not truncate when the value needs more bits", () => {
    expect(toBinary(256, 4)).toBe("100000000")
  })

  it("throws for negative bit counts", () => {
    expect(() => toBinary(0, -1)).toThrow(RangeError)
  })
})
