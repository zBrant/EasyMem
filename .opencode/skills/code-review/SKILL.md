---
name: code-review
description: Use when reviewing code, reviewing a diff, doing a code review, reviewing a pull request, or when the user asks to "review", "check", or "audit" changes. Enforces this project's architecture rules (engine purity, immutable timeline, strategy pattern), coding conventions, and testing requirements before a change is accepted.
---

# Code review

Review code changes for this repository against its architecture rules and
conventions. The rules below are mandatory — `AGENTS.md` is the source of truth
and this skill is its enforcement checklist.

## Workflow

1. Identify the scope of changes. If a git repo is present, run
   `git diff` (unstaged), `git diff --staged`, and `git log -p -1` to see what
   changed. Otherwise ask the user which files to review.
2. Apply every checklist below. Report findings grouped by severity.
3. Do NOT edit code during a review unless the user explicitly asks. Reviewing is
   read-only by default.
4. End with a clear verdict: **Approve**, **Request changes**, or **Block**.

## Checklist — architecture rules (highest priority)

- **Engine purity.** Nothing under `src/engine/` imports `react`, `react-dom`,
  JSX, Zustand, any `src/components/*`, or any DOM API. Any such import is a
  **Block**.
- **Immutability.** The timeline is built from immutable `Step` snapshots. No
  code mutates a previous step's cache state — changes must clone first.
  Mutating a prior snapshot is a **Block**.
- **Strategy pattern.** Replacement policies are not selected with `switch`/`if`
  on policy name inside the simulator. They go through the shared
  `ReplacementPolicy` interface and are registered in
  `src/engine/policies/index.ts`. Branching on policy name in engine code is a
  **Request changes**.
- **Simulation/animation separation.** Engine code contains no playback state
  (`currentStep`, `isPlaying`, timing). Such fields belong only in the store/UI.
  Leaking them into the engine is a **Request changes**.
- **Config validation.** Validation lives in `src/engine/config.ts`. The UI calls
  those validators; it does not re-implement them. Duplicated validation logic is
  a **Request changes**.
- **Determinism.** The Random policy must accept an injectable seed/RNG; engine
  code must not call `Math.random()` / `Date.now()` in a way that breaks
  determinism. A non-deterministic engine path is a **Request changes**.

## Checklist — coding conventions

- **No `any`.** Prefer `unknown` + narrowing. Each `any` is a **Request changes**.
- **No comments** unless the user explicitly asked for them. Stray comments are a
  **Request changes** (note: JSDoc on non-obvious exported engine functions is allowed).
- **Naming**: `camelCase` variables/functions, `PascalCase` types/components,
  `SCREAMING_SNAKE_CASE` true constants. Violations are **Request changes**.
- **Functional style** in the engine (pure functions; no classes unless clearly
  justified). Unjustified classes are **nit**.
- **Style consistency** with neighboring files. Inconsistent patterns are **nit**.

## Checklist — testing

- Any change under `src/engine/` MUST be covered by Vitest tests under
  `src/test/engine/`. Engine code with no new tests is a **Request changes**.
- Tests must cover at least: address decomposition, each mapping type touched by
  the change, each replacement policy touched, hit/miss classification, and
  config validation.

## Severity levels

- **Block** — breaks a core architecture rule or correctness. Must be fixed
  before merge.
- **Request changes** — violates conventions or lacks required tests.
- **Nit** — minor style/clarity suggestions; optional.

## Output format

```
VERDICT: Approve | Request changes | Block

## Block
- path/to/file.ts:12 — what's wrong and why.

## Request changes
- path/to/file.ts:40 — what's wrong and the suggested fix.

## Nits
- path/to/file.ts:5 — minor note.

## What's good
- brief note on solid decisions (only if genuine).
```

Keep the review focused on the diff. Do not propose unrelated refactors.
