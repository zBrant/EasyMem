# Atividade 05 — Engine: políticas de substituição

**Objetivo:** implementar todas as políticas via strategy pattern.
**Depende de:** 02.
**Desbloqueia:** 06.

## Escopo
- `src/engine/policies/types.ts` — interface `ReplacementPolicy`
- `src/engine/policies/lru.ts`
- `src/engine/policies/fifo.ts`
- `src/engine/policies/lfu.ts`
- `src/engine/policies/random.ts` (com RNG injetável p/ determinismo)
- `src/engine/policies/optimal.ts` (precisa da sequência futura)
- `src/engine/policies/index.ts` — registro: `Record<Policy, ReplacementPolicy>`
- `src/test/engine/policies.test.ts` (um suite por política)

## Interface
```ts
interface ReplacementPolicy {
  name: Policy
  initMeta(): PolicyMetadata
  onHit(line): void
  onLoad(line): void
  selectVictim(set, context?): number
}
```

## O que faz
- **LRU:** `lastUsed` (tick); vítima = menor `lastUsed`.
- **FIFO:** `insertOrder`; vítima = menor `insertOrder`.
- **LFU:** `freq`; vítima = menor `freq` (desempate por FIFO).
- **Random:** `selectVictim` usa RNG injetável (seed) — determinístico para testes.
- **Optimal:** escolhe a linha cujo bloco aparece mais longe no futuro (ou nunca mais); recebe a sequência futura via contexto.

## Testes
- Cada política: hit atualiza metadados, load inicializa metadados, `selectVictim` retorna o esperado em cenários controlados.
- Random com seed fixa → resultado reproduzível.
- Optimal com sequência conhecida → vítima correta.

## Pronto quando
- Todas as 5 políticas registadas em `index.ts`.
- Nenhum `switch`/`if` sobre nome de política fora do registro.
- Engine pura e determinística (Random com seed).
