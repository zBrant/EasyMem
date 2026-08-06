export type ReplacementPolicyName = "lru" | "fifo" | "lfu" | "random" | "optimal"

export type AccessOperation = "read" | "write"

export type MappingType = "direct" | "associative" | "set-associative"

export type MissType = "compulsory" | "capacity" | "conflict"

export type AccessResult = "hit" | MissType

export interface MemoryConfig {
  addressBits: number
  wordSize: number
}

export interface CacheConfig {
  totalSize: number
  lineSize: number
  associativity: number
}

export interface SimulatorConfig {
  memory: MemoryConfig
  cache: CacheConfig
  policy: ReplacementPolicyName
}

export interface DerivedConfig {
  numLines: number
  numSets: number
  setSize: number
  offsetBits: number
  indexBits: number
  tagBits: number
  mapping: MappingType
  memorySize: number
  numBlocks: number
}

export interface PolicyMetadata {
  lastUsed?: number
  insertOrder?: number
  freq?: number
}

export interface CacheLine {
  valid: boolean
  tag: number
  dirty: boolean
  metadata: PolicyMetadata
}

export type CacheState = CacheLine[][]

export interface AddressDecomposition {
  address: number
  tag: number
  index: number
  offset: number
  binary: string
}

export interface Access {
  address: number
  op: AccessOperation
}

export interface Eviction {
  tag: number
  dirty: boolean
}

export interface Stats {
  accesses: number
  hits: number
  misses: number
  compulsory: number
  capacity: number
  conflict: number
  rate: number
}

export interface Step {
  index: number
  access: Access
  decomposition: AddressDecomposition
  result: AccessResult
  setIndex: number
  lineIndex: number
  evicted?: Eviction
  cacheAfter: CacheState
  stats: Stats
}
