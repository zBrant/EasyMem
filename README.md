# Cache & Memory Simulator

An interactive, visual simulator for anyone who wants to **learn computer
architecture** concepts — cache memory, address decomposition, mapping schemes,
and replacement policies.

Configure a cache and a memory, feed in an access sequence, and watch each access
resolve step by step with a full animation of hits, misses, and evictions. Rather
than just reading about how the memory hierarchy behaves, you get to see it happen.

![EasyMem — the cache & memory simulator running a set-associative, 2-way, LRU
configuration](docs/images/ezmem.png)

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
│   │   ├── AccessLog/           #   Scrollable log of each access and its outcome
│   │   └── ui/                  #   shadcn/ui primitives (button, select, slider...)
│   │
│   ├── utils/                   # Shared helpers (isPowerOfTwo, log2, toBinary...)
│   │
│   └── test/                    # Unit tests (Vitest)
│       ├── engine/              #   address, cache, config, policies, simulator...
│       ├── store/               #   Store transitions
│       └── utils/               #   Bit helpers
│
├── docs/images/                 # Screenshots used by this README
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

## Installation

Requires **Node.js 18+** and npm.

```bash
git clone https://github.com/zBrant/EasyMem.git
cd EasyMem
npm install
npm run dev
```

The dev server prints a local URL — by default <http://localhost:5173>.

### Scripts

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload          |
| `npm run build`     | Typecheck, then build for production into `dist/`  |
| `npm run preview`   | Serve the production build locally                 |
| `npm test`          | Run the unit test suite once (Vitest)              |
| `npm run test:watch`| Run the tests in watch mode                        |
| `npm run typecheck` | Typecheck only (`tsc --noEmit`)                    |
| `npm run lint`      | Lint the codebase with ESLint                      |

## Usage

Everything happens on a single screen: configure on the left, watch in the
middle, measure on the right.

### 1. Configure the machine

In the **CONFIG** panel you set:

- **Address bits** (1–32) — how large the address space is. 8 bits → 256 B of
  addressable memory.
- **Word size**, **cache size**, and **line size**, in bytes (powers of two).
- **Associativity** — `1` gives you a direct-mapped cache, a value equal to the
  number of lines gives you a fully associative one, and anything in between is
  set-associative. The panel shows the resulting geometry as you type
  (`4 lines · 2 sets · 2-way`) along with the `tag / index / offset` bit split.
- **Replacement policy** — LRU, FIFO, LFU, Random, or Optimal (Belady).

Invalid combinations are rejected with an explanation instead of silently
producing a broken cache.

### 2. Feed it an access sequence

Type the addresses into the **SEQUENCE** box, separated by commas, spaces, or
semicolons. Three notations are accepted and can be mixed freely:

```
0, 16, 32, 48        # decimal
0x0, 0x10, 0x20      # hexadecimal
0b0, 0b10000         # binary
```

Or skip the typing and click a **scenario** — each one loads a configuration and
a sequence chosen to make one specific behavior unmistakable:

| Scenario                    | What it demonstrates                                     |
| --------------------------- | -------------------------------------------------------- |
| Thrashing (direct-mapped)   | Addresses colliding on one line, evicting each other forever |
| Spatial locality            | Why a longer cache line pays off on sequential access     |
| Temporal locality           | Why re-reading a small working set is nearly free         |
| Associativity effect        | The same sequence, rescued by adding ways                 |
| Belady's anomaly (FIFO)     | A *bigger* cache producing *more* misses under FIFO       |

### 3. Play it back

The **PLAYBACK** bar drives the timeline: restart, step backward, play/pause,
step forward, and jump to the end. Drag the scrubber to land on any access
directly, and use the delay slider to slow the animation down for a walkthrough
or speed it up for a long run.

Because the engine produces a full state snapshot per access, stepping backward
is exact — not a re-simulation — so you can move back and forth over the same
eviction as many times as you need.

### 4. Read what happened

While the timeline plays, three views stay in sync with the current access:

- **ADDRESS** — the address in binary, with tag, index, and offset each
  highlighted in their own color, and the decoded values printed underneath. This
  is where you see *why* an address maps to the line it does.
- **MEMORY** — which block the address falls into and the byte range it covers.
- **CACHE** — sets and lines with their tags and valid/dirty bits, flashing on
  hit, miss, and eviction.

And two panels accumulate results:

- **STATS** — hit rate, hit/miss/access counters, and a breakdown of misses by
  cause: compulsory, conflict, and capacity.
- **LOG** — one row per access with its address and outcome, so you can scan the
  whole run at a glance or click back to any point in it.

## Dependencies

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

## License

This project is licensed under the [MIT License](LICENSE) — © 2026 Eduardo Brant.
