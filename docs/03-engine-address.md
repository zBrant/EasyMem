# Atividade 03 — Engine: decomposição de endereço

**Objetivo:** traduzir um endereço em `tag / index / offset` e em binário.
**Depende de:** 02.
**Desbloqueia:** 04, 06, e a UI do AddressView.

## Escopo
- `src/engine/address.ts` — `decompose(address, derived): { tag, index, offset, binary }`
- `src/test/engine/address.test.ts`

## O que faz
- Dado um endereço e a config derivada, retorna:
  - `offset` = bits menos significativos (tamanho = `offsetBits`)
  - `index` = próximos bits (tamanho = `indexBits`)
  - `tag` = bits restantes
  - `binary` = string com o endereço completo em bits
- Considera o caso totalmente associativo (`indexBits === 0`).
- Função pura e determinística.

## Testes
- Endereços conhecidos → valores de tag/index/offset esperados (direto).
- Config totalmente associativa (sem index).
- Config set-associative.
- Verificar as máscaras de bit com `addressBits` diferentes (8, 16).

## Pronto quando
- `decompose` coberta por testes para os 3 mapeamentos.
- Sem mutação de entrada.
