import { toBinary } from "@/utils/bits"
import type { AddressDecomposition, DerivedConfig } from "@/engine/types"

export function decompose(
  address: number,
  derived: DerivedConfig,
): AddressDecomposition {
  const offsetBase = 2 ** derived.offsetBits
  const indexBase = 2 ** derived.indexBits

  const offset = address % offsetBase
  const rest = Math.floor(address / offsetBase)
  const index = rest % indexBase
  const tag = Math.floor(rest / indexBase)
  const binary = toBinary(
    address,
    derived.offsetBits + derived.indexBits + derived.tagBits,
  )

  return { address, tag, index, offset, binary }
}

export interface BinaryFields {
  tag: string
  index: string
  offset: string
}

export function binaryFields(
  decomposition: AddressDecomposition,
  derived: DerivedConfig,
): BinaryFields {
  const tagEnd = derived.tagBits
  const indexEnd = tagEnd + derived.indexBits
  const offsetEnd = indexEnd + derived.offsetBits

  return {
    tag: decomposition.binary.slice(0, tagEnd),
    index: decomposition.binary.slice(tagEnd, indexEnd),
    offset: decomposition.binary.slice(indexEnd, offsetEnd),
  }
}
