# Atividade 12 — UI: controles de playback

**Objetivo:** play / pause / step forward / step backward / velocidade / scrub.
**Depende de:** 08.

## Escopo
- `src/components/Controls/`

## O que faz
- Botões: play/pause, ⏮ início, ⏭ fim, step forward, step backward.
- Slider de scrubbing sobre a timeline.
- Controle de velocidade (ms por passo).
- Indicador de progresso (passo i de N).
- Desabilita step forward no fim e step backward no início.

## Pronto quando
- Playback respeita velocidade e limites.
- Scrub atualiza `currentStep` instantaneamente.
