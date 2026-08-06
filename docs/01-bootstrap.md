# Atividade 01 — Bootstrap do projeto e tooling

**Objetivo:** deixar o projeto rodando (`dev`, `build`, `lint`, `typecheck`, `test`).
**Depende de:** nada (ponto de partida).
**Desbloqueia:** todas as demais atividades.

## Escopo
- `package.json` (scripts: `dev`, `build`, `lint`, `typecheck`, `test`)
- `vite.config.ts`, `tsconfig.json` (strict mode) com **path aliases** (`@/*` → `src/*`)
- `tailwind.config.js` + `postcss.config.js` + `index.css` (com as CSS vars do shadcn)
- `components.json` (config do shadcn/ui)
- `src/utils/cn.ts` (helper `cn()` = clsx + tailwind-merge)
- `vitest.config.ts`
- `.eslintrc` / eslint flat config
- `index.html`, `src/main.tsx`, `src/App.tsx` (placeholder)
- `src/test/` setup (ex.: `setup.ts` se usar jsdom)
- Instalar componentes-base do shadcn via CLI: `button`, `input`, `card`, `slider`, `select`, `tabs` (usados nas próximas atividades)

## O que faz
- Sobe Vite + React + TypeScript em strict.
- Tailwind configurado e importado (fundação do shadcn/ui).
- shadcn/ui inicializado: `components.json`, `cn()` em `src/utils/cn.ts`, componentes em `src/components/ui/`, tema base (CSS vars).
- Path aliases `@/*` funcionando em TS e Vite.
- Vitest configurado (ambiente `node` para a engine).
- Scripts definidos: `npm run dev/build/lint/typecheck/test`.
- App renderiza um placeholder usando um componente shadcn (ex.: `Card`) confirmando que tudo compila.

## Pronto quando
- `npm run dev` sobe sem erro e o `<Card>` do shadcn renderiza estilizado.
- `npx shadcn@latest add <component>` funciona (CLI configurado).
- `npm run typecheck` e `npm run lint` passam.
- `npm test` roda (mesmo sem testes ainda).
- Atualizar a seção de comandos do `AGENTS.md` com os scripts reais.
