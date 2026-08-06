import { isPowerOfTwo, log2Int } from "@/utils/bits"
import type {
  DerivedConfig,
  MappingType,
  SimulatorConfig,
} from "@/engine/types"

const MAX_ADDRESS_BITS = 32

export function derive(config: SimulatorConfig): DerivedConfig {
  const { cache, memory } = config
  const numLines = cache.totalSize / cache.lineSize
  const setSize = cache.associativity
  const numSets = numLines / setSize
  const offsetBits = log2Int(cache.lineSize)
  const indexBits = log2Int(numSets)
  const tagBits = memory.addressBits - offsetBits - indexBits
  const memorySize = 2 ** memory.addressBits
  const numBlocks = memorySize / cache.lineSize
  const mapping = resolveMapping(setSize, numLines)

  return {
    numLines,
    numSets,
    setSize,
    offsetBits,
    indexBits,
    tagBits,
    mapping,
    memorySize,
    numBlocks,
  }
}

function resolveMapping(setSize: number, numLines: number): MappingType {
  if (setSize === 1) return "direct"
  if (setSize === numLines) return "associative"
  return "set-associative"
}

export function validate(config: SimulatorConfig): string[] {
  const errors: string[] = []
  const { cache, memory } = config
  const { totalSize, lineSize, associativity } = cache
  const { addressBits, wordSize } = memory

  if (!Number.isInteger(addressBits) || addressBits < 1) {
    errors.push("Address space must be a positive integer number of bits.")
  }
  if (addressBits > MAX_ADDRESS_BITS) {
    errors.push(`Address space must be at most ${MAX_ADDRESS_BITS} bits.`)
  }
  if (!isPowerOfTwo(wordSize)) {
    errors.push("Word size must be a power of 2 (in bytes).")
  }
  if (!isPowerOfTwo(totalSize)) {
    errors.push("Cache total size must be a power of 2.")
  }
  if (!isPowerOfTwo(lineSize)) {
    errors.push("Cache line size must be a power of 2.")
  }
  if (!isPowerOfTwo(associativity) || associativity < 1) {
    errors.push("Associativity must be a power of 2 (1 for direct-mapped).")
  }

  const dimsOk =
    isPowerOfTwo(totalSize) &&
    isPowerOfTwo(lineSize) &&
    isPowerOfTwo(associativity) &&
    associativity >= 1
  if (!dimsOk) return errors

  if (lineSize > totalSize) {
    errors.push("Cache line size cannot exceed the total cache size.")
    return errors
  }

  const numLines = totalSize / lineSize
  if (associativity > numLines) {
    errors.push("Associativity cannot exceed the number of cache lines.")
  }

  if (isPowerOfTwo(wordSize) && lineSize % wordSize !== 0) {
    errors.push("Cache line size must be a multiple of the word size.")
  }

  const derived = safeDerive(config)
  if (derived && derived.tagBits < 1) {
    errors.push(
      "Address space is too small: no bits remain for the tag. Increase addressBits or reduce the cache size.",
    )
  }

  return errors
}

function safeDerive(config: SimulatorConfig): DerivedConfig | null {
  try {
    return derive(config)
  } catch {
    return null
  }
}
