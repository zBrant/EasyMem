import { useEffect, useState } from "react"
import { Panel } from "@/components/Panel"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSimulator } from "@/store/useSimulator"
import { parseSequence } from "@/engine/sequences"
import { SCENARIOS } from "@/engine/scenarios"
import type { ReplacementPolicyName } from "@/engine/types"

const POWERS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192]
const TOTAL_SIZES = POWERS.filter((p) => p >= 16 && p <= 4096)
const POLICIES: ReplacementPolicyName[] = ["lru", "fifo", "lfu", "random", "optimal"]

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
      {children}
    </p>
  )
}

export function ConfigPanel() {
  const config = useSimulator((s) => s.config)
  const derived = useSimulator((s) => s.derived)
  const errors = useSimulator((s) => s.errors)
  const sequence = useSimulator((s) => s.sequence)
  const setConfig = useSimulator((s) => s.setConfig)
  const setSequence = useSimulator((s) => s.setSequence)

  const [text, setText] = useState(sequence.join(", "))
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setText(sequence.join(", "))
  }, [sequence])

  function handleTextChange(value: string) {
    setText(value)
    try {
      setSequence(parseSequence(value))
      setParseError(null)
    } catch (err) {
      setParseError((err as Error).message)
    }
  }

  function loadScenario(id: string) {
    const scenario = SCENARIOS.find((s) => s.id === id)
    if (!scenario) return
    setConfig({ ...scenario.config })
    setSequence([...scenario.sequence])
  }

  const lineSizes = POWERS.filter((p) => p >= 4 && p <= config.cache.totalSize)
  const numLines = config.cache.totalSize / config.cache.lineSize
  const associativities = POWERS.filter((p) => p <= numLines)
  const wordSizes = POWERS.filter((p) => p <= config.cache.lineSize)

  return (
    <Panel
      label="Config"
      className="h-full"
      bodyClassName="overflow-y-auto p-3"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <SectionLabel>Memory</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Addr bits">
              <Input
                type="number"
                min={1}
                max={32}
                className="h-8 font-mono text-xs"
                value={config.memory.addressBits}
                onChange={(e) =>
                  setConfig({
                    memory: {
                      ...config.memory,
                      addressBits: Number(e.target.value),
                    },
                  })
                }
              />
            </Field>
            <Field label="Word (B)">
              <Select
                value={String(config.memory.wordSize)}
                onValueChange={(v) =>
                  setConfig({
                    memory: { ...config.memory, wordSize: Number(v) },
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wordSizes.map((w) => (
                    <SelectItem key={w} value={String(w)}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <div className="space-y-2">
          <SectionLabel>Cache</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Size (B)">
              <Select
                value={String(config.cache.totalSize)}
                onValueChange={(v) =>
                  setConfig({
                    cache: { ...config.cache, totalSize: Number(v) },
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOTAL_SIZES.map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Line (B)">
              <Select
                value={String(config.cache.lineSize)}
                onValueChange={(v) =>
                  setConfig({
                    cache: { ...config.cache, lineSize: Number(v) },
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lineSizes.map((l) => (
                    <SelectItem key={l} value={String(l)}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Assoc">
              <Select
                value={String(config.cache.associativity)}
                onValueChange={(v) =>
                  setConfig({
                    cache: { ...config.cache, associativity: Number(v) },
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {associativities.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <Field label="Policy">
          <Select
            value={config.policy}
            onValueChange={(v) => setConfig({ policy: v as ReplacementPolicyName })}
          >
            <SelectTrigger className="h-8 text-xs uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POLICIES.map((p) => (
                <SelectItem key={p} value={p} className="uppercase">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {derived && (
          <div className="rounded-sm border border-border/60 bg-background/40 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <span className="text-foreground">{derived.mapping}</span>
            <br />
            {derived.numLines} lines · {derived.numSets} sets · {derived.setSize}-way
            <br />
            tag {derived.tagBits}b · idx {derived.indexBits}b · off{" "}
            {derived.offsetBits}b
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-0.5 rounded-sm border border-rose-500/40 bg-rose-500/5 px-2.5 py-2 text-[11px] leading-relaxed text-rose-400">
            {errors.map((e) => (
              <p key={e}>· {e}</p>
            ))}
          </div>
        )}

        <Field label="Sequence  ·  dec / 0x / 0b">
          <Textarea
            className="font-mono text-xs"
            rows={3}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="0, 16, 0x20, 0b1010"
          />
        </Field>
        {parseError && <p className="text-[11px] text-rose-400">{parseError}</p>}

        <div className="space-y-1.5">
          <SectionLabel>Scenarios</SectionLabel>
          <div className="flex flex-wrap gap-1">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => loadScenario(s.id)}
                className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
