# Atividade 09 — UI: painel de configuração

**Objetivo:** formulário para definir memória, cache, política e mapeamento.
**Depende de:** 08.
**Desbloqueia:** fluxo completo (sem config não há simulação).

## Escopo
- `src/components/ConfigPanel/`

## O que faz
- Campos (byte-addressable):
  - Memória: `addressBits`, `wordSize`.
  - Cache: `totalSize`, `lineSize`, `associativity`.
  - Política de substituição (select).
  - (Opcional/fase 2) Política de escrita.
- Validação integrada: mostra erros vindos de `engine/config.ts` (não reimplementa regras).
- Derivados exibidos em tempo real: nº de linhas, nº de conjuntos, bits de offset/index/tag.
- Entry de sequência: escolha entre gerador, cenário pronto ou lista manual (parser da atividade 07).

## Pronto quando
- Config inválida bloqueia a simulação e mostra mensagens claras em inglês.
- Valores derivados recalculam ao digitar.
- Mudanças aplicadas regeneram a timeline via store.
