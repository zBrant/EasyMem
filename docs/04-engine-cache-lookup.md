# Atividade 04 — Engine: lookup na cache e classificação de miss

**Objetivo:** dado um endereço, determinar hit/miss e o conjunto/linha alvo.
**Depende de:** 02, 03.
**Desbloqueia:** 06.

## Escopo
- `src/engine/cache.ts` — `lookup(cache, decomposition, derived): { hit: boolean; setIndex; lineIndex? }`
- Lógica de seleção de conjunto por tipo de mapeamento (direto / associativo / set-associative).
- `src/test/engine/cache.test.ts`

## O que faz
- Identifica o conjunto correto pelo `index`.
- Procura a `tag` no conjunto:
  - **Hit:** linha `valid && tag === buscada`.
  - **Miss:** não encontrada (ou linha vazia → candidato a compulsory).
- Não decide substituição (isso é tarefa da política, atividade 05).
- Não classifica compulsório/capacidade/conflito aqui — essa classificação final sai no `simulator` (atividade 06), mas este módulo fornece os dados (há linha livre? houve conflito?).

## Testes
- Hit em mapeamento direto.
- Miss (vazio) e miss (tag diferente presente).
- Totalmente associativo: tag pode estar em qualquer linha do conjunto único.
- Set-associative: busca só no conjunto correto.

## Pronto quando
- Lookup cobre os 3 mapeamentos.
- Função pura, sem efeitos colaterais.
