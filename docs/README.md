# Documentação — atividades do projeto

Plano de implementação quebrado em 14 atividades, ordenadas por dependência.
Cada arquivo descreve objetivo, escopo (arquivos), requisitos, testes (quando aplicável) e critérios de "pronto".

> Estas são **especificações**, ainda não implementadas. Aprovar antes de codar.

## Fundação
- [01 — Bootstrap do projeto e tooling](01-bootstrap.md)
- [02 — Engine: tipos, config e utilitários de bits](02-engine-types-config.md)

## Engine (núcleo puro, testável)
- [03 — Engine: decomposição de endereço](03-engine-address.md)
- [04 — Engine: lookup na cache e classificação de miss](04-engine-cache-lookup.md)
- [05 — Engine: políticas de substituição](05-engine-policies.md)
- [06 — Engine: simulador (construtor da timeline)](06-engine-simulator.md)
- [07 — Engine: geradores de sequência e cenários](07-engine-sequences-scenarios.md)

## Estado
- [08 — Store (Zustand)](08-store.md)

## UI
- [09 — Painel de configuração](09-ui-config-panel.md)
- [10 — Visualizações de memória e cache (animação por diff)](10-ui-memory-cache-views.md)
- [11 — Decomposição do endereço em bits](11-ui-address-view.md)
- [12 — Controles de playback](12-ui-controls.md)
- [13 — Estatísticas e log de acessos](13-ui-stats-log.md)
- [14 — Layout e amarração final](14-ui-app-wiring.md)

## Ordem sugerida
01 → 02 → (03, 04, 05) → 06 → (07, 08) → 09 → (10, 11) → (12, 13) → 14
