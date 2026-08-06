import { mulberry32 } from "@/utils/random"
import type { Access, AccessOperation } from "@/engine/types"

export function sequential(count: number, start = 0, step = 1): number[] {
  const result: number[] = []
  for (let i = 0; i < count; i++) result.push(start + i * step)
  return result
}

export function loop(count: number, pattern: number[]): number[] {
  if (pattern.length === 0) return []
  const result: number[] = []
  for (let i = 0; i < count; i++) result.push(pattern[i % pattern.length])
  return result
}

export function strided(
  count: number,
  start: number,
  stride: number,
  modulus: number,
): number[] {
  const result: number[] = []
  for (let i = 0; i < count; i++) result.push((start + i * stride) % modulus)
  return result
}

export function random(count: number, maxAddress: number, seed = 1): number[] {
  if (maxAddress < 1) {
    throw new RangeError(`maxAddress must be at least 1, received ${maxAddress}`)
  }
  const rng = mulberry32(seed)
  const result: number[] = []
  for (let i = 0; i < count; i++) result.push(Math.floor(rng() * maxAddress))
  return result
}

export function parseSequence(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(parseAddress)
}

function parseAddress(token: string): number {
  if (/^0x[0-9a-fA-F]+$/.test(token)) return parseInt(token, 16)
  if (/^0b[01]+$/.test(token)) return parseInt(token.slice(2), 2)
  if (/^[0-9]+$/.test(token)) return parseInt(token, 10)
  throw new Error(`Invalid address: "${token}"`)
}

export function toAccesses(
  addresses: number[],
  op: AccessOperation = "read",
): Access[] {
  return addresses.map((address) => ({ address, op }))
}
