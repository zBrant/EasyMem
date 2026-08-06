import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
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
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Address bits">
            <Input
              type="number"
              min={1}
              max={32}
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
          <Field label="Word size (bytes)">
            <Select
              value={String(config.memory.wordSize)}
              onValueChange={(v) =>
                setConfig({
                  memory: { ...config.memory, wordSize: Number(v) },
                })
              }
            >
              <SelectTrigger>
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

        <Separator />

        <div className="grid grid-cols-3 gap-3">
          <Field label="Cache size (B)">
            <Select
              value={String(config.cache.totalSize)}
              onValueChange={(v) =>
                setConfig({
                  cache: { ...config.cache, totalSize: Number(v) },
                })
              }
            >
              <SelectTrigger>
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
          <Field label="Line size (B)">
            <Select
              value={String(config.cache.lineSize)}
              onValueChange={(v) =>
                setConfig({
                  cache: { ...config.cache, lineSize: Number(v) },
                })
              }
            >
              <SelectTrigger>
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
          <Field label="Associativity">
            <Select
              value={String(config.cache.associativity)}
              onValueChange={(v) =>
                setConfig({
                  cache: { ...config.cache, associativity: Number(v) },
                })
              }
            >
              <SelectTrigger>
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

        <Field label="Replacement policy">
          <Select
            value={config.policy}
            onValueChange={(v) =>
              setConfig({ policy: v as ReplacementPolicyName })
            }
          >
            <SelectTrigger>
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
          <div className="rounded-md bg-muted/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Derived
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">{derived.mapping}</Badge>
              <Badge variant="secondary">{derived.numLines} lines</Badge>
              <Badge variant="secondary">{derived.numSets} sets</Badge>
              <Badge variant="secondary">{derived.setSize}-way</Badge>
              <Badge variant="secondary">tag {derived.tagBits}b</Badge>
              <Badge variant="secondary">index {derived.indexBits}b</Badge>
              <Badge variant="secondary">offset {derived.offsetBits}b</Badge>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-1 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-700">
            {errors.map((e) => (
              <p key={e}>• {e}</p>
            ))}
          </div>
        )}

        <Separator />

        <Field label="Access sequence (dec / 0x hex / 0b binary)">
          <Textarea
            className="font-mono text-xs"
            rows={3}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="0, 16, 0x20, 0b1010"
          />
        </Field>
        {parseError && (
          <p className="text-xs text-rose-600">{parseError}</p>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Scenarios</p>
          <div className="flex flex-wrap gap-1.5">
            {SCENARIOS.map((s) => (
              <Button
                key={s.id}
                variant="outline"
                size="sm"
                onClick={() => loadScenario(s.id)}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
