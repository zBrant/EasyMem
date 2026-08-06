# Atividade 11 — UI: decomposição do endereço em bits

**Objetivo:** mostrar o endereço atual em binário com tag/index/offset coloridos.
**Depende de:** 08, 03.

## Escopo
- `src/components/AddressView/`

## O que faz
- Exibe o endereço do passo atual em decimal, hex e binário.
- Sobre o binário, faixas coloridas: `tag` / `index` / `offset`.
- Legenda explicando cada campo e seu papel no mapeamento.
- Atualiza a cada `currentStep`.

## Pronto quando
- As faixas refletem exatamente os `offsetBits`/`indexBits`/`tagBits` da config.
- Caso totalmente associativo: faixa de index ausente (indexBits = 0).
