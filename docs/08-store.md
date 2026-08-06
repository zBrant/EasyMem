# Atividade 08 — Store (Zustand)

**Objetivo:** centralizar estado de simulação e playback.
**Depende de:** 06, 07.
**Desbloqueia:** toda a UI.

## Escopo
- `src/store/useSimulator.ts`

## Estado
- `config: SimulatorConfig`
- `sequence: number[]`
- `steps: Step[]` (timeline gerada por `run`)
- `currentStep: number`
- `isPlaying: boolean`
- `speed: number`
- Erros de validação da config.

## Ações
- `setConfig(partial)` — revalida e regera a timeline.
- `setSequence(...)`
- `regenerate()` — chama `run(config, sequence)` e reseta `currentStep`.
- `play()`, `pause()`, `togglePlay()`
- `stepForward()`, `stepBackward()`, `seek(index)`
- `setSpeed(ms)`

## O que faz
- Mantém a timeline sincronizada com config/sequência.
- Playback: um loop/timer avança `currentStep` quando `isPlaying`.
- Step backward funcionando (graças à timeline imutável).
- Estado derivado via seletores: `currentSnapshot = steps[currentStep]`.

## Pronto quando
- Mudar config regera a timeline corretamente.
- Play/pause/step/seek funcionam e respeitam limites (0..len-1).
- Seletores otimizados para não re-renderizar a UI inteira a cada tick.
