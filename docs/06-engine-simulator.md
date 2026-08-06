# Atividade 06 — Engine: simulador (construtor da timeline)

**Objetivo:** orquestrar tudo e gerar a timeline imutável `Step[]`.
**Depende de:** 02, 03, 04, 05.
**Desbloqueia:** 07, 08, e toda a UI.

## Escopo
- `src/engine/simulator.ts` — `run(config, sequence): Step[]`
- `src/test/engine/simulator.test.ts` (testes de integração)

## O que faz
- Para cada acesso da sequência:
  1. Decompõe o endereço (atividade 03).
  2. Faz lookup (atividade 04).
  3. Em miss: escolhe vítima via política (atividade 05) se não houver linha livre.
  4. Clona o estado da cache, aplica a carga/evicção (imutável).
  5. Atualiza metadados da política (`onHit`/`onLoad`).
  6. Classifica o resultado: `hit | compulsory | capacity | conflict`.
  7. Acumula estatísticas.
  8. Produz um `Step` imutável com o estado completo pós-acesso.
- A saída é um array onde `steps[i].cacheAfter` é independente de `steps[i-1]`.

## Classificação de miss
- **Compulsory:** primeira carga de um bloco que nunca esteve na cache (linha livre usada sem evicção).
- **Conflict:** haveria espaço em outro conjunto, mas este conjunto está cheio (mapeamento direto/set-associative).
- **Capacity:** cache totalmente cheia (sem conflito de mapeamento).

## Testes (integração)
- Sequência simples → hit/miss esperados e contadores corretos.
- Mesma sequência, políticas diferentes → vítimas diferentes.
- Verificar imutabilidade: `steps[i-1].cacheAfter` não muta ao gerar `steps[i]`.
- Cenário que gera cada um dos 3 tipos de miss.

## Pronto quando
- `run` retorna timeline coerente com a teoria de cache.
- Imutabilidade verificada por teste.
- Engine completa e testada — momento de "congelar" a engine antes da UI.
