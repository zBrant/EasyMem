import { describe, it, expect } from "vitest"
import { SCENARIOS, getScenario } from "@/engine/scenarios"
import { validate } from "@/engine/config"
import { run } from "@/engine/simulator"
import { toAccesses } from "@/engine/sequences"

function lastStats(scenario: (typeof SCENARIOS)[number]) {
  const steps = run(scenario.config, toAccesses(scenario.sequence))
  return steps[steps.length - 1].stats
}

describe("scenarios", () => {
  it("exposes a unique id for each scenario", () => {
    const ids = SCENARIOS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("every scenario has a valid config and a non-empty sequence", () => {
    for (const scenario of SCENARIOS) {
      expect(validate(scenario.config)).toEqual([])
      expect(scenario.sequence.length).toBeGreaterThan(0)
    }
  })

  it("retrieves a scenario by id and returns undefined when missing", () => {
    expect(getScenario("thrashing")?.id).toBe("thrashing")
    expect(getScenario("nope")).toBeUndefined()
  })

  it("thrashing produces zero hits under direct mapping", () => {
    const stats = lastStats(getScenario("thrashing")!)
    expect(stats.hits).toBe(0)
    expect(stats.misses).toBe(8)
  })

  it("spatial locality yields one compulsory miss per block then hits", () => {
    const stats = lastStats(getScenario("spatial-locality")!)
    expect(stats.compulsory).toBe(2)
    expect(stats.hits).toBe(30)
  })

  it("temporal locality warms up then hits on every reuse", () => {
    const stats = lastStats(getScenario("temporal-locality")!)
    expect(stats.compulsory).toBe(4)
    expect(stats.rate).toBeGreaterThanOrEqual(0.8)
  })
})
