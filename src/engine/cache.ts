import type {
  AddressDecomposition,
  CacheLine,
  CacheState,
  DerivedConfig,
} from "@/engine/types"

export function createEmptyCache(derived: DerivedConfig): CacheState {
  const sets: CacheLine[][] = []
  for (let s = 0; s < derived.numSets; s++) {
    const set: CacheLine[] = []
    for (let l = 0; l < derived.setSize; l++) {
      set.push({ valid: false, tag: 0, dirty: false, metadata: {} })
    }
    sets.push(set)
  }
  return sets
}

export function cloneCache(cache: CacheState): CacheState {
  return cache.map((set) =>
    set.map((line) => ({
      valid: line.valid,
      tag: line.tag,
      dirty: line.dirty,
      metadata: { ...line.metadata },
    })),
  )
}

export interface LookupResult {
  hit: boolean
  setIndex: number
  lineIndex: number | null
  freeLineIndex: number | null
}

export function lookup(
  cache: CacheState,
  decomposition: AddressDecomposition,
): LookupResult {
  const setIndex = decomposition.index
  const set = cache[setIndex]
  const tag = decomposition.tag

  let lineIndex: number | null = null
  let freeLineIndex: number | null = null

  for (let i = 0; i < set.length; i++) {
    const line = set[i]
    if (lineIndex === null && line.valid && line.tag === tag) {
      lineIndex = i
    }
    if (freeLineIndex === null && !line.valid) {
      freeLineIndex = i
    }
    if (lineIndex !== null && freeLineIndex !== null) break
  }

  return {
    hit: lineIndex !== null,
    setIndex,
    lineIndex,
    freeLineIndex,
  }
}
