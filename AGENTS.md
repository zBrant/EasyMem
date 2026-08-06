# AGENTS.md

Guidelines for AI agents (and humans) working in this repository.
Read this before making changes.

## Project overview

**Cache & Memory Simulator** — an interactive visual tool for teaching computer
architecture (cache memory, address decomposition, mapping schemes, replacement
policies). UI in **English**. Simulation is **byte-addressable**.

See `README.md` for the full feature list and folder map.

## Tech stack

React + TypeScript, Vite, Zustand, Tailwind CSS, shadcn/ui (Radix + Tailwind), Framer Motion, Vitest.

## UI conventions (shadcn/ui)

- shadcn/ui components live under `src/components/ui/` and are **owned by the
  project** (added via the CLI, then editable). Treat them as project code, not
  a black-box dependency.
- The `cn()` helper lives in `src/utils/cn.ts` (clsx + tailwind-merge) — use it
  to compose class names, never string-concat Tailwind classes.
- Prefer composing existing shadcn primitives over hand-rolling controls.
  Custom visualizations (cache/memory grids) are plain React + Tailwind.
- Keep the project's engine/UI boundary: UI components may import from
  `src/engine` types, never the reverse.

## Architecture rules (non-negotiable)

1. **`src/engine/` is pure.** It must NEVER import React, JSX, Zustand, or any UI
   or DOM API. It is plain, framework-agnostic TypeScript. If you find yourself
   adding such an import to a file under `src/engine/`, stop — you are in the
   wrong place.
2. **Immutability for the timeline.** Each access produces a new immutable
   `Step` snapshot. Never mutate a previous step's cache state; always clone.
   This is what enables step-backward and scrubbing.
3. **Strategy pattern for replacement policies.** Every policy lives in its own
   file under `src/engine/policies/` and implements the shared
   `ReplacementPolicy` interface. Register new policies in
   `src/engine/policies/index.ts`. Do not branch on policy name inside the
   simulator — call through the interface.
4. **Decouple simulation from animation.** The engine must not know about
   animation, timing, or playback. It produces the full timeline; the UI/store
   handles playback. Do not add "currentStep" or "isPlaying" to engine code.
5. **Config validation belongs in the engine** (`src/engine/config.ts`), so the
   same rules guard every entry point. The UI calls the same validators and only
   renders the resulting error messages.

## Coding conventions

- **TypeScript everywhere.** No `any`. Prefer `unknown` + narrowing when a type
  is genuinely dynamic. Enable strict mode.
- **NO comments** unless explicitly requested by the user. Write self-documenting
  code with clear names instead. JSDoc on exported engine functions is the only
  exception and only when the signature is non-obvious.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for types/interfaces/components,
  `SCREAMING_SNAKE_CASE` for true constants.
- **Functional style** in the engine (pure functions, no classes unless a class
  is genuinely the best fit). UI components are functional React components.
- Match the style of neighboring files. When in doubt, look at an existing file
  in the same folder before inventing a new pattern.

## Engine purity checklist (before touching `src/engine/`)

- [ ] Does it import anything from `react`, `react-dom`, or `src/components`? → must not.
- [ ] Does it read from the Zustand store? → must not.
- [ ] Does it call `Date.now()`, `Math.random()` directly in a way that breaks
      determinism? (Random policy should accept an injectable seed/RNG.)
- [ ] Does it mutate an argument that came from a previous step? → clone first.

## Testing

- The engine is the most critical, bug-prone part. **Every change to
  `src/engine/` MUST be accompanied by or covered by Vitest tests** under
  `src/test/engine/`.
- Cover at minimum: address decomposition, each mapping type, each replacement
  policy, hit/miss classification, and config validation.
- Run tests after every engine change.

## Commands

```
npm run dev        # start Vite dev server
npm run build      # tsc --noEmit && vite build (typecheck + production build)
npm run preview    # preview the production build
npm run lint       # lint (ESLint flat config)
npm run typecheck  # tsc --noEmit
npm test           # vitest run --passWithNoTests
npm run test:watch # vitest in watch mode
```

If `lint` or `typecheck` scripts exist, **always run them after code changes.**
If they are missing, ask the user for the correct command and add it here.

To add more shadcn/ui components: `npx shadcn@latest add <component>`.

## Git & commits

- Only commit when the user explicitly asks.
- Inspect `git status`, `git diff`, and recent `git log` first; stage only
  intended files. Never commit secrets.
- Write concise commit messages matching the repo's existing style.

## Don'ts

- Do not create documentation files (`.md`) unless explicitly requested.
- Do not add emojis to files unless the user asks for them.
- Do not add comments (see Coding conventions).
- Do not "improve" unrelated code while making a focused change — keep diffs tight.
