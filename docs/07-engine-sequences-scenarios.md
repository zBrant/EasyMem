# Atividade 07 — Engine: geradores de sequência e cenários didáticos

**Objetivo:** fornecer sequências de acesso prontas (geradores e presets).
**Depende de:** 02.
**Desbloqueia:** UI (entry de sequência) e Store.

## Escopo
- `src/engine/sequences.ts` — geradores: `random`, `sequential`, `loop`, `strided`, parse de string de endereços.
- `src/engine/scenarios.ts` — presets: thrashing, Belady's anomaly, localidade espacial, localidade temporal, efeito da associatividade.
- `src/test/engine/sequences.test.ts`

## O que faz
- Geradores aceitam parâmetros (tamanho, semente, passo) e retornam `number[]` de endereços.
- `random` é determinístico com seed.
- Cenários são `(config base, sequência)` prontos para carregar com um clique na UI.
- Parser de string: `"0x10, 32, 0b1010"` → `[16, 32, 10]` (hex/dec/bin).

## Testes
- Cada gerador retorna o tamanho esperado e é determinístico (seed fixa).
- Parser aceita hex/dec/bin e rejeita inválidos.
- Cenários têm as propriedades esperadas (ex.: thrashing gera só misses em mapeamento direto).

## Pronto quando
- Geradores e cenários cobertos por testes.
- Pronto para ser consumido pelo ConfigPanel/Store.
