# Atividade 13 — UI: estatísticas e log de acessos

**Objetivo:** mostrar métricas em tempo real e o histórico de acessos.
**Depende de:** 08, 06.

## Escopo
- `src/components/StatsPanel/`
- `src/components/AccessLog/`

## O que faz
- **StatsPanel:** contadores de hits/misses, taxa de hit, e gráfico da taxa ao longo dos acessos.
- **AccessLog:** lista rolável, um item por acesso, com endereço, resultado (hit/miss + tipo), bloco evictado.
- Log destaca o passo atual e permite clicar num item para fazer `seek()` até ele.

## Pronto quando
- Estatísticas refletem o snapshot até `currentStep` (não a timeline inteira, salvo toggle).
- Clicar num item do log navega até aquele passo.
