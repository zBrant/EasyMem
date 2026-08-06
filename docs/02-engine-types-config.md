# Atividade 02 — Engine: tipos, config e utilitários de bits

**Objetivo:** definir o modelo de dados (types), a validação de config e os helpers de bits.
**Depende de:** 01.
**Desbloqueia:** 03, 04, 05, 06.

## Escopo
- `src/engine/types.ts` — interfaces: `SimulatorConfig`, `DerivedConfig`, `CacheLine`, `PolicyMetadata`, `Step`, `AccessResult`, etc.
- `src/engine/config.ts` — `derive(config)` (numLines, numSets, offsetBits, indexBits, tagBits) e `validate(config)` retornando lista de erros.
- `src/utils/bits.ts` — `isPowerOfTwo`, `log2`, `toBinary`, `mask`.
- `src/test/engine/config.test.ts`

## O que faz
- Tipagem de toda a engine em um único lugar (`types.ts`).
- `derive()` calcula os valores derivados da configuração.
- `validate()` aplica as regras:
  - `totalSize`, `lineSize`, `associativity` são potências de 2
  - `totalSize % lineSize === 0`
  - `numLines % associativity === 0`
  - `tagBits >= 1`
- Helpers de bits reutilizáveis por engine e UI.

## Testes
- `derive()` com configs variadas (direto / associativo / set-associative).
- `validate()` cobre cada regra (caso válido + cada caso inválido).
- Helpers: `isPowerOfTwo`, `log2`, `toBinary` com bordas (0, 1, potências e não potências).

## Pronto quando
- Engine 100% pura (zero import de React).
- `npm test` passa para `config`.
- `npm run typecheck` limpo.
