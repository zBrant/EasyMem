# Atividade 10 — UI: visualizações de memória e cache (animação por diff)

**Objetivo:** o coração visual — memória ↔ cache com animação a cada acesso.
**Depende de:** 08, 06 (timeline).

## Escopo
- `src/components/MemoryView/`
- `src/components/CacheView/`

## O que faz
- **MemoryView:** grid da memória/páginas; destaca o bloco acessado.
- **CacheView:** mostra conjuntos × linhas com `tag`, bit `valid`, bit `dirty`.
- Animação baseada em diff: compara `steps[i-1]` com `steps[i]` e anima só o que mudou (Framer Motion `layout` / `AnimatePresence`).
- Código de cores por resultado do acesso (definido no passo atual):
  - hit (verde), compulsory (azul), conflict (laranja), capacity (vermelho), evicção (amarelo).
- Setas indicando movimento bloco → cache (load) e cache → memória (evicção suja, quando aplicável).

## Pronto quando
- Toda mudança de `currentStep` atualiza as views com animação fluida.
- Nada re-simula — tudo lê do snapshot `steps[currentStep]`.
- Performance ok para centenas de linhas sem travar.
