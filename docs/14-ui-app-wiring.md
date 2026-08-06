# Atividade 14 — UI: layout e amarração final

**Objetivo:** montar o App, posicionar os componentes e dar o acabamento.
**Depende de:** 09, 10, 11, 12, 13.

## Escopo
- `src/App.tsx` (layout final)
- Ajustes de responsividade, espaçamento e tema (Tailwind).

## O que faz
- Layout coerente: ConfigPanel lateral, área central com MemoryView/CacheView/AddressView, Controls embaixo, StatsPanel e AccessLog laterais/inferiores.
- Estado inicial com um cenário default carregado (atividade 07).
- Garante que tudo reage a `currentStep` de forma sincronizada.

## Pronto quando
- App utilizável ponta a ponta: configurar → rodar → animar → inspecionar.
- `npm run build` passa; sem erros de typecheck/lint.
- UX validada manualmente em resoluções comuns.
