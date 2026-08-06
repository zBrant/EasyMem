# Cache & Memory Simulator

An interactive, visual simulator for anyone who wants to **learn computer
architecture** concepts — cache memory, address decomposition, mapping schemes,
and replacement policies.

Configure a cache and a memory, feed in an access sequence, and watch each access
resolve step by step with a full animation of hits, misses, and evictions. Rather
than just reading about how the memory hierarchy behaves, you get to see it happen.

## What it does

- **Visualizes the memory hierarchy** (main memory ↔ cache) with animated data
  movement on every access.
- **Decomposes addresses into bits** — tag / index / offset — with each field
  highlighted in a different color, so students see *why* a block maps to a
  specific line.
- **Simulates all three mapping schemes**: direct-mapped, fully associative, and
  set-associative.
- **Pluggable replacement policies**: LRU, FIFO, LFU, Random, and Optimal
  (Belady's algorithm).
- **Byte-addressable** memory model (realistic, x86/ARM-like), with configurable
  word size and address space.
- **Step-by-step playback** — play, pause, step forward, step backward, and scrub
  through the timeline of accesses at adjustable speed.
- **Live statistics** — hit/miss counters, hit-rate over time, and a per-access log.
- **Ready-made teaching scenarios** — thrashing, Belady's anomaly, spatial/temporal
  locality, and the effect of associativity.

## Project architecture

The codebase enforces a strict separation between the **simulation engine**
(pure, framework-agnostic, fully testable) and the **UI** (React), connected by an
immutable **timeline** of state snapshots.

```
simulator/
├── src/
│   ├── engine/                  # Pure simulation logic — ZERO React dependencies
│   │   ├── types.ts             #   Config, Step, Line, PolicyMetadata interfaces
│   │   ├── config.ts            #   Config validation + derived values (numLines, bits...)
│   │   ├── address.ts           #   Address decomposition (tag / index / offset)
│   │   ├── cache.ts             #   Cache lookup logic per mapping type
│   │   ├── simulator.ts         #   run(config, sequence) → Step[]  (the timeline builder)
│   │   ├── sequences.ts         #   Access-sequence generators (random, sequential, loop...)
│   │   ├── scenarios.ts         #   Predefined teaching scenarios
│   │   └── policies/            #   Strategy pattern — one module per policy
│   │       ├── lru.ts
│   │       ├── fifo.ts
│   │       ├── lfu.ts
│   │       ├── random.ts
│   │       ├── optimal.ts
│   │       └── index.ts         #   Policy registry: Record<Policy, ReplacementPolicy>
│   │
│   ├── store/                   # Zustand state (config, timeline, currentStep, isPlaying)
│   │   └── useSimulator.ts
│   │
│   ├── components/              # React UI
│   │   ├── ConfigPanel/         #   Configuration forms with validation
│   │   ├── AddressView/         #   Address in binary, tag/index/offset highlighted
│   │   ├── MemoryView/          #   Main memory / pages grid
│   │   ├── CacheView/           #   Sets × lines, tags, valid/dirty bits
│   │   ├── Controls/            #   Play / pause / step / speed / scrub
│   │   ├── StatsPanel/          #   Hit/miss counters + rate graph
│   │   └── AccessLog/           #   Scrollable log of each access and its outcome
│   │
│   ├── utils/                   # Shared helpers (isPowerOfTwo, log2, toBinary...)
│   │
│   └── test/
│       └── engine/              # Unit tests for the simulation engine (Vitest)
│
├── public/                      # Static assets
├── AGENTS.md                    # Conventions for AI agents working on this repo
└── .opencode/                   # opencode configuration
    └── skills/
        └── code-review/         # Project-specific code-review skill
```

### Architectural principles

1. **Engine purity** — `src/engine/` must never import React or any UI code. It is
   plain TypeScript that runs equally in the browser and in Node, which keeps it
   fast and trivial to unit-test.
2. **Immutable timeline** — the engine returns an array of snapshots (`Step[]`),
   one per access. The UI plays the timeline back by index, which makes
   step-forward, step-backward, scrubbing, and replay trivial.
3. **Strategy pattern for policies** — every replacement policy implements the same
   `ReplacementPolicy` interface, so adding a new one is a single new file plus a
   registry entry.
4. **Diff-based animation** — since each step is a full state snapshot, the UI
   compares consecutive steps and animates only the lines that changed.

## Dependencies

> The dependency list will be finalized when the project is bootstrapped. The
> intended stack is:

| Dependency   | Purpose                                  |
| ------------ | ---------------------------------------- |
| React        | UI component model                       |
| TypeScript   | Type safety across engine and UI         |
| Vite         | Dev server and build tooling             |
| Zustand      | Lightweight state management             |
| Tailwind CSS | Base styling (foundation for shadcn/ui)  |
| shadcn/ui    | Accessible UI components (Radix + Tailwind) |
| Framer Motion| Animations for cache/memory transitions  |
| Vitest       | Unit testing (primarily for the engine)  |

## Installation

> _To be added._

## Usage

> _To be added._
