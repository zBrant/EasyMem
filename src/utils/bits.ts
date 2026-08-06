export function isPowerOfTwo(n: number): boolean {
  return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0
}

export function log2Int(n: number): number {
  if (!isPowerOfTwo(n)) {
    throw new RangeError(`log2Int expects a positive power of 2, received ${n}`)
  }
  return 31 - Math.clz32(n)
}

export function mask(bits: number): number {
  if (bits < 0) {
    throw new RangeError(`mask expects a non-negative integer, received ${bits}`)
  }
  return 2 ** bits - 1
}

export function toBinary(value: number, bits: number): string {
  if (bits < 0) {
    throw new RangeError(`toBinary expects a non-negative bit count, received ${bits}`)
  }
  return value.toString(2).padStart(bits, "0")
}
