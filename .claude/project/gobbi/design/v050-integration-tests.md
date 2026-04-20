# v0.5.0 Integration Tests — Design

> Status: design — drafted 2026-04-20

Design document for the v0.5.0 integration test system. Read this before planning or implementing the `tests/integration/` workspace. It covers the test architecture, the hybrid harness model, the scenario catalog, and CI integration — everything a planner needs to decompose the work into execution tasks. It does not cover implementation of individual scenarios; that belongs in the planning step.

This document synthesises the two PI ideation inputs at `.claude/project/gobbi/note/2026-04-20-integration-test-ideation/innovative.md` and `.claude/project/gobbi/note/2026-04-20-integration-test-ideation/best.md`. All architectural decisions in §4 are locked by user approval (2026-04-20) and must not be re-litigated in the planning step.

---

## 1. The Gap We're Closing

> **The closed feedback loop v0.5.0 produces is the exact surface the current test suite does not exercise.**

V0.5.0 deliberately moved orchestration logic out of skill prose and into a closed CLI ↔ hooks ↔ event store loop (see `v050-overview.md §"The Philosophy"`). That loop has four distinct boundaries:

- **Boundary 1 — Claude Code → hook script.** Claude Code serialises a hook event to stdin JSON. The hook script is `gobbi workflow <cmd>`.
- **Boundary 2 — Hook script → CLI business logic.** The CLI parses stdin, resolves the session, executes its command.
- **Boundary 3 — CLI → SQLite event store.** `appendEventAndUpdateState` writes the row and updates `state.json`.
- **Boundary 4 — Event store → next prompt.** `gobbi workflow next` reads state and emits the step prompt.

Every design guarantee in `v050-overview.md`, `v050-hooks.md`, and `v050-state-machine.md` rests on all four boundaries agreeing. The 1205-test suite at `phase/v050-phase-2` covers boundaries 2–4 in combination via unit and CLI-subprocess tests. The CLI-subprocess e2e at `packages/cli/src/__tests__/e2e/workflow-cycle.test.ts` chains boundaries 2–4 but replaces boundary 1 with bare `Bun.$` subprocess calls that skip hook dispatch entirely. **Boundary 1 is the untested surface.**

Issue #102 sits exactly at boundary 1. `createDelegationSpawn` is invoked from four test files (`workflow/__tests__/fixtures.ts`, `workflow/events/__tests__/events.test.ts`, `commands/workflow/__tests__/capture-subagent.test.ts`, plus unit tests that import the factory) but no production code path emits it. `gobbi workflow guard` observes Task tool calls but does not write `delegation.spawn`; `gobbi workflow capture-subagent` writes only `delegation.complete` and `delegation.fail`. The reducer receives a complete event with no preceding spawn, so `state.activeSubagents` never holds a live entry and `parent_seq` is unlinked. Every unit test passed because every unit test fed `createDelegationSpawn` by hand. The CLI-subprocess e2e test passed because it calls `gobbi workflow transition` directly, bypassing boundary 1. Nothing exercises the path `hooks.json → Claude Code harness → PreToolUse(Task) → gobbi workflow guard → delegation.spawn event written`. #102 is the canary for a class of bugs whose fingerprint is "CLI would have done X if hook payload Y had arrived, but Y was never wired." (Source: innovative-stance ideation §2; best-stance ideation §2.)

Three industry-standard concerns compound the gap. First, **API-contract drift**: the Claude Code hook stdin schema evolves across releases — field names, payload shapes, `permissionDecision` semantics — and a deterministic harness that freezes payloads at v2.4 will silently miss schema changes shipped in v2.6. The `permissionDecision` exit-code-2-vs-JSON-output gotcha already documented in `v050-hooks.md:36` and the plugin-config-path gotcha in `phase2-planning.md:19` are both examples of this drift class — they manifested as silent production failures, not test failures. Second, **deterministic vs live tiering**: a single test tier cannot serve both fast-feedback on every PR and live-parity cross-checking for Anthropic-side drift simultaneously — the two tiers need different harnesses exercising the same scenarios. Third, **event-sourced assertion style**: for event-sourced systems like the gobbi event store, asserting on event-type sequence is more robust to additive schema changes than asserting on derived state, but prompt-compilation output requires snapshot assertions because listing every expected token in code is unmaintainable. Both assertion styles are needed for different failure modes. The architecture in §3 addresses all three concerns. (Source: best-stance ideation §2.)

The four user-locked failure modes map directly to the four boundary regions above: F1 (boundary 1 — hook wiring), F2 (boundary 4 — prompt compilation), F3 (boundaries 2–3 — state-machine transitions via the CLI), and F4 (boundary 1 + 3 combined — the full spawn → complete lifecycle crossing both the hook wire and the event store linkage). Each failure mode has at least one scenario in the catalog (§6).

---

## 2. The Two Tiers

> **Deterministic mode is the contract guard. Live mode is the parity cross-check. Both exercise the same scenario files via different harnesses.**

The system operates at two tiers, distinguished by the harness driving the real `gobbi workflow` CLI.

The **deterministic tier** is the default. It runs on every PR, costs $0 per run, and never calls the Anthropic API. A custom `HooksHarness` (~200 LOC) emits the exact Claude Code hook stdin payloads documented in the hooks reference, pipes them into real `gobbi workflow` CLI subprocesses via `Bun.spawn`, and asserts on the real SQLite event store and `state.json` the CLI wrote. From the CLI's perspective there is no difference between a payload arriving from Claude Code and a payload arriving from the harness — the wire format is identical. This tier is not "testing with a fake." It is testing the CLI's side of the boundary-1 contract using the documented wire format as the test driver. The CLI has no way to know the difference.

The **live tier** is opt-in. It is gated by `GOBBI_INTEGRATION_LIVE=1` and triggered only via manual `workflow_dispatch` on GitHub Actions. In this mode, the same scenario files are driven by an `AgentSdkHarness` that wraps `@anthropic-ai/claude-agent-sdk`'s `query()` function with `permissionMode: "bypassPermissions"`, wiring SDK hook callbacks to real `gobbi workflow` CLI subprocesses. The live tier runs a real Claude Code agent loop — model calls included — and exercises the SDK's own hook dispatch machinery. This means SDK-internal changes (payload field additions, ordering changes, schema version bumps) surface as test failures before they reach production. The live tier is advisory; live failures do not block PR merges, but they signal Anthropic-side drift that needs harness updating.

Both tiers share the same scenario files under `tests/integration/scenarios/`. Neither tier requires changes to any production code in `packages/cli/src/commands/` or `packages/cli/src/workflow/`. The production CLI is the system under test in both cases.

The tier selection mechanism is simple: each scenario file imports `getHarness()` from `harness/index.ts`, which reads `process.env.GOBBI_INTEGRATION_LIVE` and returns either a `HooksHarness` instance (default) or an `AgentSdkHarness` instance (live). Scenarios do not branch on the env var themselves — they receive a harness instance via the fixture and call `harness.emit(payload)` identically in both tiers. The polymorphism is entirely in the harness implementations. This is the design invariant that keeps scenario files readable: they describe the hook sequence and assertions, not the execution environment.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│               gobbi v0.5.0 Integration Test System                       │
└─────────────────────────────────────────────────────────────────────────┘

  tests/integration/scenarios/              (one .test.ts per scenario)
  ├── F1-hook-cli-wiring/
  ├── F2-prompt-compilation/
  ├── F3-state-machine/
  └── F4-subagent-lifecycle/
         │                                          │
         ▼ GOBBI_INTEGRATION_LIVE unset             ▼ GOBBI_INTEGRATION_LIVE=1
  ┌──────────────────────────┐        ┌──────────────────────────────────┐
  │      HooksHarness        │        │       AgentSdkHarness             │
  │  - emits hook stdin JSON │        │  - query() + options.hooks: {...} │
  │    per Hooks reference   │        │  - permissionMode: bypassPerms    │
  │  - Bun.spawn gobbi CLI   │        │  - hooks bridge to gobbi CLI      │
  │  - collects stdout       │        │  - ANTHROPIC_API_KEY required     │
  └────────────┬─────────────┘        └──────────────┬────────────────────┘
               │                                     │
               │     identical contract surface      │
               ▼                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │         real `gobbi workflow` CLI subprocesses (Bun.spawn)              │
  │         — unmodified production binary, cwd = per-test tmpRoot —        │
  └───────────────────────────────────────┬────────────────────────────────┘
                                          │ writes events
                                          ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │    tmpRoot/.gobbi/sessions/{id}/gobbi.db  +  state.json                 │
  │    (real bun:sqlite WAL, per-test isolated via mkdtempSync)             │
  └───────────────────────────────────────┬────────────────────────────────┘
                                          │ assertions read (read-only)
                                          ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                        assertions/                                       │
  │  - eventStore: event-type sequence, parent_seq linkage, state fields    │
  │  - prompts:    bun:test snapshots of gobbi workflow next stdout          │
  │  - replay:     reducer-replay determinism check (§5.2)                   │
  │  - drift:      hooks.json-drift meta-scenario (§5.1)                    │
  └────────────────────────────────────────────────────────────────────────┘
```

The workspace root is `tests/integration/`, a new Bun workspace member declared in the root `package.json`'s `workspaces` array as `"tests/*"`. It depends on `@gobbitools/cli` for the CLI binary path and declares `@anthropic-ai/claude-agent-sdk` as a peer-optional dep for the live tier (see Appendix A). No file in `packages/cli/src/` is modified as part of creating this workspace, with the exception of two time-control touch points described in §4.3: the `GOBBI_TEST_NOW_MS` check in `engine.ts::appendEventAndUpdateState` and the corresponding check in `stop.ts::runStopWithOptions`.

The diagram above represents the **steady-state runtime flow** for a single scenario event in the deterministic tier. Each call to `harness.emit(payload)` triggers one full right-to-left traversal: harness builds stdin JSON → spawns CLI subprocess → CLI writes event + updates state.json → subprocess exits → harness reads assertions → test proceeds to the next event. The `assertions/` layer only runs after all events in the tape have been emitted; it never observes partial state mid-tape. The reducer-replay check (§5.2) runs in teardown, after the test's primary assertions have already passed or failed.

**Proposed modules under `tests/integration/` — purpose and approximate LOC:**

| Path | Purpose | ~LOC |
|---|---|---|
| `harness/hooks-harness.ts` | Builds stdin JSON per the Hooks reference schema field names (`session_id`, `tool_name`, `tool_input`, `tool_use_id`, `agent_id`, `hook_event_name`). Spawns `gobbi workflow <cmd>` via `Bun.spawn({ stdin: 'pipe', stdout: 'pipe', cwd: tmpRoot, env })`. Pipes JSON to stdin, closes, collects stdout, asserts exit code 0. Default-tier driver. | ~200 |
| `harness/agent-sdk-harness.ts` | Wraps `@anthropic-ai/claude-agent-sdk`'s `query()`. Maps the SDK's `options.hooks` callbacks to `gobbi workflow` subprocess calls, threading each hook payload as stdin. Live-tier driver. Loaded only when `GOBBI_INTEGRATION_LIVE=1` is set; never imported by the deterministic path. | ~300 |
| `harness/payloads.ts` | Typed builders for every Claude Code hook payload — `SessionStart`, `PreToolUse`, `PostToolUse`, `SubagentStop`, `Stop`. This is the single canonical module for payload shapes. Guards against the shared-type divergence pattern documented in `phase2-planning.md §"Parallel waves defining shared types silently diverge"` — all other harness files import payload types from here, never redeclare. | ~150 |
| `harness/clock.ts` | Reads `GOBBI_TEST_NOW_MS` env var for per-subprocess clock override. Exposes `clockEnv(epochMs)` that returns `{ GOBBI_TEST_NOW_MS: String(epochMs) }` for inclusion in the `Bun.spawn` env. Wraps the `effectiveTs` seam PR E.10 introduced in `packages/cli/src/workflow/engine.ts`. | ~30 |
| `assertions/event-store.ts` | Read-only assertion facade over a session's `gobbi.db`. Exposes `hasEventOfType(type, matchData?)`, `toMatchEventSequence([...types])`, `state()`, and `replayState()`. Imports `ReadStore` from the `@gobbitools/cli` export surface — the `ReadStore` split shipped in PR #97 (issue #103) means `gobbi.db` reads do not require the write-side store. (This import requires `packages/cli/package.json` to add an `exports` field and a `src/index.ts` re-export module — implementation-phase work scoped to PC-2 and PC-3.) | ~120 |
| `assertions/prompts.ts` | Invokes `gobbi workflow next` as a subprocess, captures stdout, and calls `expect(stdout).toMatchSnapshot(snapshotName)`. Snapshot files committed to `tests/integration/fixtures/snapshots/`. | ~40 |
| `assertions/replay.ts` | Implements the reducer-replay determinism check (§5.2). Reads `gobbi.db` event log, replays through `reduce(state, event, ts)` imported from `packages/cli/src/workflow/reducer.ts`, asserts deep equality with the `state.json` on disk. (The `reduce` and `deriveState` imports require the `exports` field addition to `packages/cli/package.json` — see PC-2 and PC-3.) | ~80 |
| `fixtures/temp-session.ts` | `mkdtempSync(tmpdir(), 'gobbi-int-')` lifecycle. Creates the `.gobbi/` root, runs `gobbi workflow init` (which seeds `seq=1,2` per `phase2-planning.md §"gobbi workflow init pre-seeds events at seq=1,2"` — direct fixture writes must use `seq ≥ 100`), returns a `SessionContext`, registers `afterEach` cleanup via `rmSync(tmpRoot, { recursive: true, force: true })`. | ~60 |
| `fixtures/transcripts/` | Pre-baked subagent transcript JSONL files for F4 scenarios: one parseable, one unparseable, one empty (simulating missing). | static |
| `fixtures/snapshots/` | Committed `bun:test` snapshot files for F2 prompt-compilation scenarios. These are the "expected output" reference for prompt regressions. | static |

---

## 4. The Eight Dimensions

### 4.1 Transport

**Pick: no-transport as the default; hook-protocol emulation replaces the model entirely.**

For the deterministic tier, no Anthropic calls are made. The `HooksHarness` is not a client — it is a driver. It plays the role Claude Code plays against the CLI: it constructs hook events from documented field names, writes them to the CLI's stdin, and reads the CLI's stdout response. Think LSP protocol tests: the test client sends JSON-RPC frames that look like what a real editor sends, but no editor is running. The CLI sees real stdin, real SQLite, real filesystem, real timestamps (modulo §4.3 clock control). Nothing between the test and the production CLI is mocked.

For the live tier, `@anthropic-ai/claude-agent-sdk`'s `query()` function drives a real agent loop. The `AgentSdkHarness` hooks into the SDK's `options.hooks` callbacks — documented in the Agent SDK Hooks reference as the intended extension point — bridging each hook event to the real `gobbi workflow` CLI subprocess. `permissionMode: "bypassPermissions"` prevents Claude Code from surfacing tool-call approvals to a human; the gobbi CLI's own guard command handles workflow-level guard logic, so double-gating is unnecessary and would interfere with scenario scripting.

VCR-style record/replay against the Anthropic API was considered and rejected. The hot surface is the Claude Code hook wire, not the model output wire. A recorded cassette of model responses tests prompt→completion, not hook→CLI — it cannot catch a missing `delegation.spawn` emitter. Re-recording is needed on every Claude Code minor release because the stream-json schema evolves, and recording requires real API spend at record time. (Source: innovative-stance ideation §4.1; best-stance ideation §4.1.)

Mocking at the `@anthropic-ai/sdk` `baseURL` level was also rejected. Claude Code owns the `@anthropic-ai/sdk` call internally; `packages/cli` does not import `@anthropic-ai/sdk` at all. A stub HTTP server at `baseURL` cannot intercept anything the CLI can observe. Using the SDK's intended extension points (`options.hooks`, `permissionMode`) is the right tier for live testing — that is what Anthropic ships and what they keep stable across releases.

**Open question (planning-step verification):** Does `@anthropic-ai/claude-agent-sdk`'s `query()` exhibit identical hook-firing semantics to the `claude` CLI subprocess that gobbi users actually run in production? The SDK docs describe "the same agent loop" but do not explicitly guarantee hook dispatch ordering or SubagentStop payload shape parity. The first scenario landed must include a parity smoke test: run the same Given-When against both `query()` and `claude --bare -p` subprocess and assert identical event-store output. If structural divergence is found, the live tier adds a subprocess fallback path for affected scenarios. (Source: innovative-stance ideation §4.1 OQ; best-stance ideation §4.2 OQ.)

### 4.2 Harness Invocation

**Pick: hybrid — HooksHarness (~200 LOC) for the deterministic tier, AgentSdkHarness for the live tier.**

The `HooksHarness` is the innovative-stance ideation's core insight (see `note/2026-04-20-integration-test-ideation/innovative.md §4.2`): once the hook protocol is treated as a contract, the harness that speaks it is cheap — ~200 LOC of Bun code — and the real Claude Code harness becomes one of several drivers against the same contract surface.

For each scenario event the `HooksHarness` builds the stdin JSON per the hooks reference exact field schema; spawns the CLI subprocess via `Bun.spawn`; pipes JSON to stdin; closes the pipe; collects stdout; asserts exit code 0; moves to the next payload in the scenario tape. The CLI sees the payload as if Claude Code sent it. The test verifies the CLI's response and the event store state. No Claude Code binary, no model calls, no internet.

The `AgentSdkHarness` is the live-tier driver. It wraps `import { query } from '@anthropic-ai/claude-agent-sdk'`. The SDK's `options.hooks` callbacks fire for each hook event (PreToolUse, PostToolUse, SubagentStop, Stop); the harness translates each callback into a real `Bun.spawn` call to the appropriate `gobbi workflow` command, piping the SDK-provided hook payload as stdin. The SDK runs a real agent loop with real Anthropic model calls. The live tier is not a cheaper harness — it is a richer one. Its value is precisely that it rides the SDK's evolution and fires hooks the same way Claude Code users' sessions do.

Running the real `claude --bare -p` subprocess as the live driver was considered and rejected as primary. Per-invocation startup cost (~1–2 s per cold start) compounds across a 10-scenario suite into 20+ s of overhead. More critically, hook injection via subprocess mode requires writing settings to `~/.claude/settings.json`, contaminating the developer's global Claude Code state — a side effect that would make the test suite dangerous to run on developer machines. The SDK's programmatic hook injection (`options.hooks`) is the clean alternative. (Source: innovative-stance ideation §4.2 rejected alternatives; best-stance ideation §4.2.)

Building a full fake Claude Code harness was considered and rejected. Anthropic ships at least one hook schema change per minor release (recent additions to `system/init`'s `plugin_errors` field, the `Agent` tool name change from `Task`, `agent_id` semantics changes for subagent recursion). Owning a fake means tracking every one. The `HooksHarness` is not a fake — it emits the documented wire format against the real CLI. The `AgentSdkHarness` absorbs SDK evolution for free.

**Open question (planning-step verification):** `canUseTool` vs PreToolUse ordering. The Agent SDK docs describe the tool-call lifecycle as `PreToolUse Hook → Deny Rules → Allow Rules → Ask Rules → Permission Mode Check → canUseTool → PostToolUse`. If this ordering holds, scenarios asserting "guard event recorded before tool blocked" are correct: the hook fires first, `gobbi workflow guard` writes the event, then `canUseTool` can deny. If the ordering is reversed or implementation-dependent, scenarios that combine guard denial with `canUseTool` need restructuring. Verify against the SDK source before locking the `AgentSdkHarness` hook-bridge API. (Source: best-stance ideation §4.1 OQ.)

### 4.3 Time and Env Freezing

**Pick: thread a clock source through `effectiveTs` and read it from `GOBBI_TEST_NOW_MS`.**

PR E.10 introduced `reduce(state, event, ts?)` with the third param plumbed from `engine.ts::appendEventAndUpdateState` (local const `effectiveTs`, line ~138). The full rationale is in `phase2-planning.md §"reduce(state, event) has no event.ts"`. Clock control requires modifying two production touch points — both must consult `GOBBI_TEST_NOW_MS` from the environment, either via the env var directly or via a shared helper:

1. **`engine.ts::appendEventAndUpdateState` (local const `effectiveTs`, line ~138)** — one line added reads `process.env.GOBBI_TEST_NOW_MS` first, falling back to `row.ts` or `Date.now()`. This controls the timestamp written for every event appended via `appendEventAndUpdateState`.
2. **`stop.ts::runStopWithOptions` (line ~204)** — `const now = overrides.now === undefined ? new Date() : overrides.now()` is an in-process override that does not reach the `GOBBI_TEST_NOW_MS` env var when `stop` runs as a CLI subprocess. The same env-var check must be added here to control the heartbeat timestamp and timeout-detection clock in the Stop hook path.

Without both touch points, any scenario that exercises timeout detection or heartbeat emission via the Stop hook will be non-deterministic in the subprocess harness. PC-7 (below) names `stop.ts` as a required edit site alongside `engine.ts`.

`GOBBI_TEST_NOW_MS` is a new env var (not yet present in either file as of 2026-04-20) that must be added during the integration workspace setup phase. It carries the clock value as epoch milliseconds; the CLI converts it via `new Date(Number(process.env.GOBBI_TEST_NOW_MS)).toISOString()` to match the ISO string format the event store and reducer expect. Epoch milliseconds were chosen over an ISO string (the innovative-stance input proposed `GOBBI_TEST_CLOCK` as an ISO string) because: (a) numeric arithmetic is simpler on the CLI side — no parse step needed for elapsed-time comparisons; (b) the round-trip with `Date.now()` is clean — no formatting ambiguity. The CLI converts to ISO when emitting events.

Scenarios set `GOBBI_TEST_NOW_MS=<epoch_ms>` in the `cliEnv` object passed to `Bun.spawn`. The `harness/clock.ts` module wraps this injection point and exposes `clockEnv(epochMs)` for use in scenario tapes. The harness can increment the value between events for multi-turn scenarios that need to simulate elapsed time (the timeout-detection scenarios in particular need the clock advanced past `state.stepStartedAt + configuredTimeoutMs`).

`bun:test` fake timers were considered and rejected: Bun's test runner does not expose `useFakeTimers` primitives (confirmed against the Bun test docs), and even if it did, the CLI runs in a subprocess where in-process fake timers cannot reach. Monkey-patching `Date.now()` at CLI module-load time was rejected: fragile, requires a test-only module hook, and creates a divergence risk between the production `Date.now()` call sites and the reducer's `event.ts` access. Third-party fake-timer libraries were rejected: a new dep for a one-line env-var check violates the architectural constraint of zero new production deps.

The env-var bridge pattern is the standard for testing event-sourced systems against subprocess CLIs. Greg Young's event-sourced testing guidance (cited in the innovative-stance input §4.3) explicitly recommends injectable clock as a test dependency with an env-var bridge for subprocess isolation. The `GOBBI_TEST_*` env-var namespace established by `GOBBI_INTEGRATION_LIVE` makes `GOBBI_TEST_NOW_MS` a consistent extension.

**Open question (planning-step decision):** Should `GOBBI_TEST_NOW_MS` represent a static frozen clock (the same epoch value for every `Date.now()` call within one CLI subprocess invocation) or a per-call seed? A frozen clock is simpler; a tick-based model — frozen until the test calls `harness.clock.tick(ms)` — is what sinon and jest fake-timers use and makes timeout scenarios more explicit. The innovative-stance ideation §4.3 flags this; the planner should decide and document the chosen semantics in `harness/clock.ts` comments.

### 4.4 Event Store Assertions

**Pick: hybrid — invariant assertions (event-type sequence + `parent_seq` linkage + state field set) for F1/F3/F4; `bun:test` snapshots for F2 compiled-prompt outputs.**

The assertion model follows EventStoreDB's testing guidance: for event-sourced systems, verify that the correct events were emitted and that a given stream leads to a specific outcome. Exact-sequence matching (every event in order, no extras) is too brittle: the codebase already uses an `>= 7` event-count check in `workflow-cycle.test.ts` rather than an exact count, precisely because additive bookkeeping events accumulate. Scenario assertions must be structural — presence, linkage, invariants — not total. (Source: innovative-stance ideation §4.4; best-stance ideation §4.4.)

| Failure mode | Primary assertion | Example |
|---|---|---|
| F1 hook↔CLI wiring | Event-type presence + `parent_seq` linkage | `store.hasEventOfType('delegation.spawn', { agentType: 'executor' })` |
| F2 prompt compilation | `bun:test` snapshot of `gobbi workflow next` stdout | `expect(await nextPrompt(ctx)).toMatchSnapshot('execution-step.snap')` |
| F3 state machine | State-field assertion | `expect(state.currentStep).toBe('plan')`, `expect(state.feedbackRound).toBe(2)` |
| F4 subagent lifecycle | Combined: event sequence + `parent_seq` + `state.activeSubagents` | `expect(completeRow.parent_seq).toBe(spawnRow.seq)`, `expect(state.activeSubagents).toHaveLength(0)` |

For F2 snapshots — full compiled prompt vs redacted fingerprint (section headers, token counts, block IDs): start with full snapshots. Full snapshots catch every silent compilation change and are already the discipline `packages/cli/src/specs/__tests__/` enforces. Migrate to fingerprints only if PR snapshot diff volume becomes a review burden; that migration has not been needed in the existing suite.

When F2 scenarios run for the first time on a clean checkout with no committed snapshots, `bun:test` writes the initial snapshots on first run rather than failing. This is the expected `bun:test` snapshot behavior: run once to generate, then commit the generated `.snap` files, then subsequent runs diff against them. The CI workflow for the first landing of the F2 scenarios should therefore follow a two-step process: run the tests once locally (or in a dedicated "snapshot generation" CI job), commit the generated snapshots, then merge the PR. The planner should include this bootstrapping step in the F2 task plan explicitly, because omitting it leaves the CI job green on first run but without actually asserting on anything — the snapshots need to be committed to be meaningful assertions.

The **reducer-replay check** (§5.2) is a cross-cutting assertion applied to every scenario regardless of failure mode. Before teardown, each test replays `gobbi.db` through the live reducer and asserts deep equality with `state.json`. This catches a class of bug that event-type assertions miss: the CLI wrote a `state.json` the reducer would not produce. It is cheap (`bun:sqlite` is in-memory-grade fast for the event volumes scenarios produce) and structurally sound because the reducer is a pure function. (Borrowed from innovative-stance ideation §4.4; inspired by Temporal replay testing.)

**Open question (planning-step decision):** For the `assertions/event-store.ts` DSL — use `bun:test`'s native `expect` or a thin chained-builder wrapper? Native `expect` is simpler to implement; a chained builder (`expectEvents(ctx).ofType('delegation.spawn').first().toMatch({...})`) is more readable in scenario code. The best-stance ideation §4.4 argues for a thin wrapper that delegates to `expect` matchers under the hood. Recommend the thin wrapper: scenarios are documentation as well as tests, and readability matters.

### 4.5 Scenario Fixture Structure

**Pick: one `.test.ts` per scenario, organized by failure mode — `tests/integration/scenarios/F<N>-<class>/`.**

The four user-locked failure modes are the test taxonomy. Organizing scenarios under them makes coverage gaps visible at a glance: an empty `F2/` subdirectory means no prompt-compilation coverage exists. The `F<N>` prefix makes failure-class filtering trivial in CI: `bun test tests/integration/scenarios/F1-*/` runs only hook-wiring scenarios. This is borrowed from the best-stance ideation §4.5 and matches the `F<N>` naming convention in the user-locked decisions.

One test per file, serial within the file. This maps naturally to Bun's per-file-process parallelism model: each scenario gets its own process, its own tempdir, and its own event store. Cross-test state leakage is structurally impossible. `describe.each` handles parameterized variants within one file (F1.2 exercises three SubagentStop cases within a single `describe.each`, keeping the three-case coverage in one file without cross-contamination risk).

Per-user-journey organization was considered and rejected: gobbi's workflow journey is nearly identical across scenarios; deviation occurs at the failure-mode level, not the journey level. Per-hook-event organization was rejected: hook events are the mechanism, not the failure class. A subagent-lifecycle test (F4) spans PreToolUse, SubagentStop, and possibly Stop — organizing by hook would split one coherent lifecycle invariant across three files. Per-state-transition organization was rejected: the state machine has ~20 transitions and many share scenarios; per-transition produces redundant scaffolding. (Source: innovative-stance ideation §4.5 rejected alternatives; best-stance ideation §4.5.)

**Open question (planning-step decision):** The innovative-stance ideation §4.5 recommends TypeScript scenario tapes over YAML descriptors for typecheck safety and IDE navigation, with a recording helper that serializes a live session tape to JSON for later re-import. The best-stance ideation also argues for TypeScript. Recommend TypeScript: the existing codebase is TypeScript throughout and `bun:test` gets full type coverage. The planner should define the `ScenarioConfig` type in `harness/hooks-harness.ts` and use it as the template shape for all scenario files.

### 4.6 Co-location

**Pick: new top-level `tests/integration/` workspace at the monorepo root — not under `packages/cli/src/__tests__/`.**

Integration scenarios cross-cut the CLI package (`packages/cli/`), the plugin's hook wiring (`plugins/gobbi/hooks/hooks.json`), the event store, and session state (`.gobbi/`) simultaneously. A test that asserts on cross-cutting wiring — the `hooks.json`-drift meta-scenario (§5.1) reads `plugins/gobbi/hooks/hooks.json` — does not belong to any single package. It belongs in a workspace that is a peer of all packages, not a child of one.

The `tests/integration/package.json` workspace declares: `@gobbitools/cli` as a dependency (for the CLI binary path); `@anthropic-ai/claude-agent-sdk` as a peer-optional dep (for the live tier, see Appendix A); `bun-types` and `fast-check` as dev deps (already present in `packages/cli/package.json`, no new version pinning needed). The root `package.json` adds `"tests/*"` to its `workspaces` array. The workspace name follows the org prefix convention: `@gobbitools/integration-tests`.

Placing the suite under `packages/cli/src/__tests__/integration/` was considered and rejected. The cleanest reason: `packages/cli/package.json` has a deliberately minimal dep tree — one production dep (`ajv`), two dev deps (`bun-types`, `fast-check`). Installing `@anthropic-ai/claude-agent-sdk` in `packages/cli` to support tests that cross-cut `plugins/gobbi/` would pollute the CLI package's install footprint and conflate a test-only concern with the published package. The `tests/integration/` workspace has its own `package.json` and does not affect what consumers of `@gobbitools/cli` install. (Source: best-stance ideation §4.6.)

Industry precedent for top-level integration workspaces: Bun's own monorepo uses a top-level `test/` directory for cross-package tests; Prisma uses `packages/integration-tests/`; Next.js uses `test/integration/` at the repo root. The common thread is that integration tests spanning multiple packages belong outside any one package's `src/` tree.

**Open question (planning-step verification):** Is `tests/integration/` discoverable by `bun test` run from the repo root, or does Bun's workspace test discovery require explicit `bun test --cwd tests/integration`? Per the Bun test docs, the runner walks workspaces by default, but the GHA command in the workflow sketch (§7) uses the explicit path `bun test tests/integration/scenarios` to be unambiguous. The planner should verify the discovery behavior before locking the GHA command.

### 4.7 CI Budget

**Pick: two-job GHA workflow — deterministic on every PR ($0 model spend, ≤ 90 s), live on manual `workflow_dispatch` only. No nightly cron.**

The `.github/workflows/` directory does not currently exist in this repository (`ls .github/workflows/` returned `DIRECTORY_NOT_FOUND`). This is a greenfield addition. The deterministic job runs on every `pull_request` targeting `main` or `phase/**` branches; it is a required merge gate. The live job runs only when manually triggered via `workflow_dispatch`; it is advisory and is never a merge gate.

Budget math for the deterministic tier (no API calls, no `claude` binary): ~10 scenarios × ~3 events/scenario × ~150 ms per Bun CLI subprocess spawn = ~4.5 s of raw CLI subprocess time. Bun's per-file parallel execution means the wall time is dominated by the slowest scenario file, estimated 15–25 s on a cold GHA `ubuntu-latest` runner including checkout and `bun install`. Total ceiling with suite growth to ~30 scenarios: under 90 s. Zero API token cost.

For the live tier, cost is API tokens. With `permissionMode: "bypassPermissions"` and real Anthropic model calls, rough estimate: ~10 scenarios × ~3 turns × ~2K tokens per turn = ~60K tokens per manual run. At Sonnet pricing (~$3/MTok input, ~$15/MTok output blended), one live run costs approximately $0.20–$0.40. At manual-dispatch cadence (weekly or on-demand), projected monthly spend is single-digit dollars — consistent with the "pennies per run" budget lock.

Nightly cron was considered and rejected per the user lock. API-contract drift moves on Anthropic's release cycle, not on every commit. Manual dispatch is the right trigger: the maintainer triggers a live run when suspecting SDK upgrade effects or when preparing a release. A nightly cron adds a standing budget and an alerting burden without proportional coverage benefit. Running the live tier on every PR was also rejected: at 20+ PRs/day with 3 retries each, token costs become meaningful within a week. (Source: innovative-stance ideation §4.7 rejected alternatives; user lock.)

**Open question (planning-step verification):** Does the project's existing CI (if any) run `bun test` already? `ls .github/workflows/` returned empty, suggesting no GHA workflows exist. If a separate CI system is active, coordinate the integration workflow with it. The planner should check whether a unit test GHA workflow should be added simultaneously or whether integration is the first GHA workflow in the repository.

### 4.8 Isolation

**Pick: per-test `mkdtempSync` for the entire `.gobbi/` root; serial within a file; parallel across files.**

Each scenario runs in its own `mkdtempSync(tmpdir(), 'gobbi-int-')` directory. The tempdir is the project root for that test: `gobbi workflow init` creates `.gobbi/sessions/{id}/gobbi.db` inside it, the CLI subprocess's `cwd` option points at it, and teardown is `rmSync(tmpRoot, { recursive: true, force: true })` in `afterEach`. This is the same pattern `packages/cli/src/__tests__/e2e/workflow-cycle.test.ts` uses, validated across all Phase 2 PRs.

Per `phase2-planning.md §"gobbi workflow init pre-seeds events at seq=1,2"`, the `fixtures/temp-session.ts` lifecycle MUST always run `gobbi workflow init` before any scenario injects hook payloads. This seeds `seq=1,2` (the `workflow.start` and initial `workflow.eval.decide` events). Any direct writes to `gobbi.db` from fixture code must use `seq ≥ 100` to avoid primary-key collision with init's pre-seeded rows.

SQLite WAL mode raises no parallel-concurrency concern in this regime. Each test has a private DB file — WAL contention matters only when multiple processes hit the same file, which never happens here. Within a single test, the CLI subprocess writes and the test process reads via `assertions/event-store.ts` using the `ReadStore` split from PR #103. WAL handles one writer + one reader correctly.

One tempdir shared across the whole suite was rejected: shared `.gobbi/project-config.json` is not session-scoped; a scenario that writes project config would pollute peers, and debugging the interaction between two scenarios in a shared tempdir is substantially harder than debugging one scenario in isolation. In-memory SQLite (`:memory:`) was rejected: the gobbi CLI hardcodes the on-disk path `.gobbi/sessions/{id}/gobbi.db`; testing against `:memory:` would require a CLI flag that contaminates production code with a test concern. Docker-in-Docker per scenario was rejected: overkill. (Source: innovative-stance ideation §4.8 rejected alternatives; best-stance ideation §4.8.)

There is one Windows-specific WAL gotcha (Bun issue #25964 — WAL lock release on close): closing the DB does not release the lock until the process exits, which can block `rmSync` cleanup. CI runs on Ubuntu where this is moot. Document as a note in `fixtures/temp-session.ts` for local Windows developers.

---

## 5. Cross-Cutting Mechanisms

### 5.1 hooks.json-Drift Assertion (Meta-Scenario)

> **The test system must verify its own assumptions about the hook-wire contract it exercises.**

The `HooksHarness` emits payloads for specific hook events. If a hook event the harness emits has no matching entry in `plugins/gobbi/hooks/hooks.json`, the CLI never receives that payload in production — the harness is testing a path that is unwired at the real deployment boundary. Conversely, if `hooks.json` declares a hook entry for an event the harness never exercises, that entry is invisible to the integration suite.

The drift assertion is a meta-scenario — a test that runs once per suite and verifies the harness and `hooks.json` agree on the full hook event inventory. The scenario loads `plugins/gobbi/hooks/hooks.json`, iterates every hook event name that `harness/payloads.ts` can build (the typed builders are the definitive list of events the harness knows about), and asserts each has a matching `hooks.json` entry with a non-empty `command` field. It also iterates the reverse: every `hooks.json` entry must have a corresponding payload builder in `harness/payloads.ts`.

The drift assertion catches a specific, narrow bug class: registration drift between the hook event names the harness knows about (the `harness/payloads.ts` typed builders) and the hook event names declared in `hooks.json`. It does NOT catch event-emission bugs such as #102 — when `delegation.spawn` was missing, `PreToolUse` was registered on both sides (`harness/payloads.ts` has a `PreToolUse` builder; `hooks.json` has a `PreToolUse` entry). The drift assertion would PASS with #102 present because the registration inventory was correct; the emitter-wiring was not. The test that catches the #102 bug class is F1.1 (`spawn-emitter.test.ts`), which asserts that a `delegation.spawn` event actually appears in the event store after the harness emits a `PreToolUse(Task)` payload. The drift assertion and F1.1 are complementary guards catching different failure classes: the drift assertion catches "hook registered in hooks.json but harness cannot build its payload" and vice versa; F1.1 catches "hook fires correctly but the command does not write the expected downstream event." (Source: innovative-stance ideation §4.2, the hooks.json cross-check innovation.)

The drift assertion lives in `tests/integration/scenarios/F1-hook-cli-wiring/hooks-json-drift.test.ts` (labeled F1.0-meta in §6). It is a structural test — it verifies that the inventory of hook events the harness knows about and the inventory `plugins/gobbi/hooks/hooks.json` declares are in sync. It does not verify that individual event payloads are correct (that is the job of the per-scenario assertions). It fires once per suite run before any session-level scenario executes.

**Open question (planning-step verification):** Hook-matcher regex semantics in `hooks.json`. The `matcher` field accepts a regex-over-tool-name per the hooks reference. If the harness parses `matcher` differently from real Claude Code's hook dispatch engine (anchoring behavior, case sensitivity, Unicode mode), the drift assertion may pass for entries that real Claude Code would not fire for a given tool name. Document the expected matcher semantics in `harness/payloads.ts` with an explicit reference to the hooks reference documentation, and include one parity smoke test in the live tier that exercises a matcher-filtered event end-to-end to confirm the harness's interpretation is correct.

### 5.2 Reducer-Replay Determinism Check

> **If the CLI and the reducer disagree on what an event sequence means, one of them is wrong — and this check finds that disagreement before it reaches production.**

Borrowed from the innovative-stance ideation §4.4, inspired by Temporal's replay testing model (referenced as [Replay Testing To Avoid Non-Determinism in Temporal Workflows](https://www.bitovi.com/blog/replay-testing-to-avoid-non-determinism-in-temporal-workflows) in the innovative-stance input). The reducer is a pure function: `reduce(state, event, ts)` must produce identical output for identical input regardless of when or how many times it is called. The `state.json` the CLI writes is a materialized projection of the `gobbi.db` event log. They must agree — any divergence is a correctness bug.

Before teardown in every scenario, `assertions/replay.ts` performs four steps:

1. Opens the session's `gobbi.db` read-only via `ReadStore`.
2. Reads the event log in `seq` order.
3. Instantiates a fresh `WorkflowState` and replays the events through the live `reduce(state, event, ts)` function imported directly from `@gobbitools/cli`'s exported surface.
4. Reads the `state.json` the CLI wrote at the end of the scenario and asserts deep equality with the replayed state.

Two distinct bugs produce divergence: (a) the reducer is non-deterministic — same event sequence, different state on replay (Temporal's "determinism violation," typically caused by non-pure state in the reducer like `Date.now()` calls or global counters); (b) the CLI wrote a `state.json` snapshot the reducer would not produce from the same events (typically caused by a direct mutation of `state.json` that bypassed `appendEventAndUpdateState`).

The check is cheap. `bun:sqlite` is in-memory-grade fast for the event volumes scenarios produce (tens of events per scenario at most). The replay adds ~5–10 ms to each test's teardown — negligible against the ~150 ms per CLI subprocess spawn cost. The check catches a class of bug that event-type assertions miss: a scenario whose primary assertion passes (the right events were written) but whose reducer-replay fails (the state derived from those events does not match the state the CLI materialized) reveals an inconsistency in the materialization path.

This check requires importing `reduce` and `deriveState` from `packages/cli` directly into the `tests/integration/` workspace via the `@gobbitools/cli` package export. If these internals are not currently exported in `packages/cli/src/index.ts`, the planner must add them as explicit exports. This is not a production behavior change — it is a visibility change that exposes reducer internals for test use.

The deep-equality assertion should exclude ephemeral fields that the CLI writes to `state.json` for operational purposes but that the reducer does not produce: heartbeat timestamps, last-write times, and similar audit fields. The `assertions/replay.ts` module must implement a `stripEphemeral(state)` normalizer that drops these fields before comparison. The planner should enumerate the full set of ephemeral vs semantic state fields by reading `packages/cli/src/workflow/state.ts` at planning time and classifying each field as "reducer-owned" (asserted in replay) or "lifecycle-owned" (excluded from replay).

---

### 5.3 Fixture Sequencing and Session Lifecycle

> **Every scenario starts from `gobbi workflow init`, not from direct database writes.**

The `fixtures/temp-session.ts` module establishes the lifecycle contract for all scenarios. It creates a fresh tempdir, writes a minimal `.gobbi/` root structure, runs `gobbi workflow init` to populate the first two events (`workflow.start` at `seq=1`, `workflow.eval.decide` at `seq=2`), and returns a `SessionContext` containing `{ tmpRoot, sessionId, cliEnv }`. The `afterEach` callback registers cleanup via `rmSync(tmpRoot, { recursive: true, force: true })`.

This sequencing is mandatory per `phase2-planning.md §"gobbi workflow init pre-seeds events at seq=1,2"`. Scenarios that attempt to seed events at `seq=1` or `seq=2` will hit `SQLITE_CONSTRAINT_PRIMARYKEY` failures. All fixture event writes must use `seq ≥ 100` as the offset. The harness enforces this constraint by exposing `seqOffset` in `SessionContext` and documenting the `seq=100` floor in `fixtures/temp-session.ts`.

Scenarios that need to begin at a specific workflow step — say, `execution` for the F4 subagent lifecycle scenarios — must advance the state machine by seeding the requisite step-exit events before injecting hook payloads. They do this via direct `store.append` calls with `seq ≥ 100`, not via `gobbi workflow transition` invocations (which would require full stdin payloads). The `assertions/event-store.ts` module exposes a `seedStateAt(ctx, step)` helper that appends the minimal event sequence to reach the target step. The planner should define this helper's event sequence at planning time by reading the state machine transitions in `v050-state-machine.md` and `packages/cli/src/workflow/reducer.ts`.

For scenarios that need `state.json` to reflect the seeded events before the first hook payload arrives, the `fixtures/temp-session.ts` lifecycle calls `gobbi workflow status` (or a lightweight `gobbi workflow rebuild-state` if that command exists by planning time) to force materialization. If no such command exists at planning time, the planner should add a `fixtures/seed-state.ts` helper that calls `deriveState` on the seeded event log and writes `state.json` directly. This avoids a round-trip through the CLI for what is purely a fixture setup concern.

---

### 5.4 Planner Preconditions

Before writing execution tasks for the integration suite, the planner must verify six preconditions. These are planning-time reads, not implementation tasks, but failing to verify them produces briefs that direct executors to wrong locations or wrong API shapes — the class of briefing defect documented in `delegation-discipline.md §"Briefing references non-existent production code path"`.

**PC-1: Issue #102 emitter fix must land before F1.1 can pass green.** The F1.1 scenario (`spawn-emitter.test.ts`) will fail on a red assertion until the `delegation.spawn` emitter is wired in the production code path (the fix for issue #102). The planner must decide whether to sequence the integration suite implementation after the #102 fix or to implement F1.1 first as a "currently-failing" regression guard and the #102 fix second. Either sequencing is valid; the plan must state which is chosen and adjust task ordering accordingly.

> **What the #102 fix consists of:** A new CLI command `packages/cli/src/commands/workflow/capture-spawn.ts` (`gobbi workflow capture-spawn`) that reads a PreToolUse stdin payload, extracts `tool_use_id` and subagent metadata, and writes a `delegation.spawn` event to the event store. This command is wired by a new `PreToolUse` matcher entry in `plugins/gobbi/hooks/hooks.json` and in `.claude/settings.json` that triggers when `tool_name === 'Task'` (or `'Agent'`). The existing blanket `PreToolUse` entry routes to `gobbi workflow guard` for permission decisions; the new matcher entry routes the same task-tool event to `gobbi workflow capture-spawn` for spawn emission — two separate hook entries, each with its own responsibility. **Rejected alternative:** extending `guard.ts` to also emit `delegation.spawn` for task-tool PreToolUse payloads. Rejected because `guard.ts` is the latency-critical hotpath — it runs synchronously before Claude Code proceeds with the tool call. Adding spawn-emission logic to guard conflates permission enforcement (low latency required) with event recording (can be async). The separate `capture-spawn` command keeps guard narrow and its performance budget unaffected.

**PC-2: `reduce` and `deriveState` must be exported from `@gobbitools/cli`.** The reducer-replay check (§5.2) imports these functions from the `@gobbitools/cli` package export. Verify that `packages/cli/src/index.ts` (or the equivalent entry point declared in `packages/cli/package.json`'s `exports` field) exports both. If not, the plan must include a task to add the exports before the replay assertion can be implemented.

**PC-3: `ReadStore` export surface must support the assertions/ facade.** The `assertions/event-store.ts` module imports `ReadStore` from `@gobbitools/cli`. PR #103 introduced the `ReadStore` split (issue #97) but the planner must verify the exact exported path: read `packages/cli/src/lib/` or the `exports` map in `packages/cli/package.json` to confirm the import path before writing the briefing for the assertion module.

**PC-4: Bun workspace test discovery behavior.** Per §4.6 open question, verify whether `bun test` from the repo root discovers `tests/integration/` automatically or requires explicit `--cwd tests/integration`. Read the root `package.json`'s `workspaces` array and consult the Bun test documentation. The GHA workflow command in §7 uses an explicit path; if root-level discovery works, the local dev command (`bun test`) should also be explicit to match CI behavior.

**PC-5: `gobbi workflow init` event count.** Per `phase2-planning.md §"gobbi workflow init pre-seeds events at seq=1,2"`, init seeds exactly 2 events at `seq=1,2`. Verify this count has not changed since that gotcha was recorded by reading `packages/cli/src/commands/workflow/init.ts`. If init now seeds a different number of events, the `seq ≥ 100` fixture offset floor remains safe (the gotcha recommends ≥ 100 as a conservative buffer), but the briefing for `fixtures/temp-session.ts` should document the actual init event count.

**PC-6: Clock env-var injection point in `engine.ts`.** The `GOBBI_TEST_NOW_MS` env-var check must be added to the local const `effectiveTs` inside `appendEventAndUpdateState` in `packages/cli/src/workflow/engine.ts` (line ~138). Verify the current shape of that local variable by reading the file; if `effectiveTs` was refactored since PR E.10 landed, the briefing must reference the updated location.

**PC-7: Clock env-var injection point in `stop.ts`.** The same `GOBBI_TEST_NOW_MS` env-var check must be added to `packages/cli/src/commands/workflow/stop.ts` at the `const now = ...` line (~204) inside `runStopWithOptions`. The existing `overrides.now` path is an in-process injection (unit-test only); the env-var path is required for subprocess-mode clock control that integration scenarios need for timeout-detection assertions. Both `engine.ts` and `stop.ts` are required edit sites — the integration workspace setup plan must include both as implementation tasks.

---

## 6. Scenario Catalog

Ten scenarios covering all four failure modes, plus one meta-scenario (F1.0-meta) that does not exercise a session but verifies the harness-to-hooks-json contract. F1.1 is named explicitly as the #102 regression guard. Each scenario entry lists its failure-mode tags, the Given-When-Then structure, and the expected wall time for the deterministic tier. Scenarios that share a parameterized structure (`describe.each`) are counted as one scenario file.

The wall-time estimates assume Bun's per-file subprocess model: one Bun process per scenario file, serial events within a file, parallel across files. A cold GHA runner adds ~10–15 s of overhead (checkout + `bun install`) on top of the raw scenario execution time.

The scenarios are ordered from fastest to most complex. F1.0-meta runs first (filesystem-only, < 100 ms), then the F1 hook-wiring scenarios (< 500 ms each), then F4 subagent lifecycle (< 1 s), then F3 state-machine (< 2 s), and finally F2 prompt-compilation (< 3 s due to multiple subprocess invocations). This ordering means a fast-failing hook-wiring regression is visible within the first seconds of a CI run, before slower prompt-compilation scenarios complete.

**F1.0-meta — `hooks-json-drift.test.ts`** (F1 hook-wire contract meta-scenario)
Not a session-level scenario. Loads `plugins/gobbi/hooks/hooks.json` from `plugins/gobbi/hooks/hooks.json` (confirmed path via `phase2-planning.md §"Plugin config lives at plugins/gobbi/.claude-plugin/plugin.json"` — the hooks file is at a different path from the plugin manifest; verify the exact path at planning time), iterates every hook event name in `harness/payloads.ts`, asserts bidirectional coverage. Runs once per suite without initializing a temp session. This scenario has no `SessionContext` dependency — it uses only the filesystem.
Expected wall time: < 100 ms.

**F1.1 — `spawn-emitter.test.ts`** (F1 hook↔CLI wiring + F4 subagent lifecycle)
_The #102 regression guard._
- Given: session initialized at `currentStep === 'execution'`, no delegation events seeded.
- When: harness emits `PreToolUse` payload with `tool_name: 'Task'`, `tool_input.subagent_type: 'executor'`, bridged to `gobbi workflow guard`.
- Then: event store contains exactly one `delegation.spawn` event; `data.agentType === 'executor'`; `idempotencyKind === 'tool-call'`; `toolCallId` matches the payload's `tool_use_id`; `state.activeSubagents` contains one entry with the spawn's `subagentId`. If the capture-spawn emitter (issue #102 fix) is absent from the production code path, this scenario fails with "expected delegation.spawn event, found none."
Expected wall time: < 500 ms.

**F1.2 — `capture-subagent-three-cases.test.ts`** (F1 hook↔CLI wiring)
_Validates the three failure-handling cases in `v050-hooks.md §SubagentStop`._
Three sub-tests via `describe.each`:
- Case A: `agent_transcript_path` points at a valid parseable JSONL transcript → `delegation.complete` written; artifact file created at `plan/`.
- Case B: `agent_transcript_path` points at an unparseable file → `delegation.fail` written; marker artifact created; `data.transcriptPath` populated.
- Case C: `agent_transcript_path` points at a non-existent file → `delegation.fail` written; `data.reason` includes "transcript not found."
Expected wall time: < 1 s per case.

**F1.3 — `claude-write-guard.test.ts`** (F1 hook↔CLI wiring + F3 state-machine)
_Write to `.claude/` during an active session must be denied — enforces the directory split from `v050-overview.md §"The Directory Split"`._
- Given: session initialized at any active step.
- When: harness emits `PreToolUse` payload with `tool_name: 'Write'`, `tool_input.file_path` targeting any path under `.claude/`.
- Then: CLI stdout contains `permissionDecision: "deny"`; `guard.violation` event appended; `state.violations` non-empty.
Expected wall time: < 500 ms.

**F2.1 — `step-prompts.test.ts`** (F2 prompt-compilation)
_Catches spec drift across the five steps. Any change to a step spec or compiled prompt surface surfaced immediately as a snapshot diff._
- Parameterized via `describe.each` over `['ideation', 'plan', 'execution', 'execution_eval', 'memorization']`.
- Given: session seeded at the target step.
- When: `gobbi workflow next` is invoked.
- Then: stdout matches the committed snapshot at `fixtures/snapshots/<step>-prompt.snap`.
Expected wall time: < 3 s total.

**F2.2 — `error-pathway-prompts.test.ts`** (F2 prompt-compilation)
_Catches resume-prompt drift across the four error pathways documented in `v050-cli.md §gobbi workflow next`._
- Parameterized via `describe.each` over `['crash', 'timeout', 'feedbackCap', 'invalidTransition']` — these are the canonical `ErrorPathwayKind` values from `packages/cli/src/specs/errors.ts:61–66`. The prose names "crash pathway," "timeout pathway," "feedback-cap pathway," and "invalid-transition pathway" map to these identifiers respectively.
- Given: event sequence and error state seeded for the pathway (clock advanced past timeout for the `timeout` case via `GOBBI_TEST_NOW_MS`).
- When: `gobbi workflow resume` is invoked.
- Then: stdout matches committed snapshot at `fixtures/snapshots/<pathway>-resume.snap`.
Expected wall time: < 3 s total.

**F3.1 — `eval-revise-loop.test.ts`** (F3 state-machine)
_Catches reducer regressions in the feedback-loop branch — the most error-prone transition path per the state machine in `v050-state-machine.md`._
- Given: session at `execution_eval` with `feedbackRound: 1`.
- When: a `decision.eval.verdict` event with `verdict: 'revise'`, `loopTarget: 'plan'` is appended directly to the event store via `store.append` at `seq ≥ 100` (the §5.3/PC-5 direct-append contract). This is not a `gobbi workflow transition` CLI invocation — §5.3 explicitly forbids using `gobbi workflow transition` for fixture state setup because it requires full stdin payloads. In the deterministic test tier, the transition event is seeded as a direct store append; in the live tier, a real evaluation subagent arrives at the verdict organically and the event is written by the SDK harness.
- Then: `state.currentStep === 'plan'`; `state.feedbackRound === 2`; transition event recorded in event store; reducer-replay check passes.
Expected wall time: < 1 s.

**F3.2 — `feedback-cap-error.test.ts`** (F3 state-machine)
_Catches the feedbackRound overflow path — the reducer must transition to `error` not loop on the Nth revise._
- Given: session in `execution_eval` with `feedbackRound === maxFeedbackRounds`.
- When: transition event arrives with `verdict: 'revise'`.
- Then: `state.currentStep === 'error'`; `state.error.pathway === 'feedbackCap'`; no further `execution` or `plan` event follows.
Expected wall time: < 1 s.

**F4.1 — `spawn-complete-link.test.ts`** (F4 subagent lifecycle)
_Catches `parent_seq` linkage regressions; closes the #102 loop end-to-end._
- Given: session at `execution`.
- When: harness emits `PreToolUse(Task)` → `delegation.spawn` written → harness emits `SubagentStop` with `agent_transcript_path` pointing at a valid fixture transcript.
- Then: `delegation.complete.parent_seq === delegation.spawn.seq`; `claudeCodeVersion` propagated through to the spawn row (issue #92 follow-up); `state.activeSubagents` is empty after capture; reducer-replay check passes.
Expected wall time: < 1 s.

**F4.2 — `spawn-fail-link.test.ts`** (F4 subagent lifecycle)
_Catches `parent_seq` linkage on the failure path — confirms that the fail event links correctly even when the transcript is unparseable._
- Given: session at `execution` with one prior `delegation.spawn` event seeded.
- When: harness emits `SubagentStop` with an unparseable transcript.
- Then: `delegation.fail.parent_seq === delegation.spawn.seq`; `state.activeSubagents` empty after capture; reducer-replay check passes.
Expected wall time: < 1 s.

**Coverage matrix:**

| Scenario | F1 hook↔CLI | F2 prompt | F3 state-machine | F4 subagent lifecycle |
|---|:---:|:---:|:---:|:---:|
| F1.0-meta hooks-json-drift | x | | | |
| F1.1 spawn-emitter | x | | | x |
| F1.2 capture-subagent-three-cases | x | | | |
| F1.3 claude-write-guard | x | | x | |
| F2.1 step-prompts | | x | | |
| F2.2 error-pathway-prompts | | x | | |
| F3.1 eval-revise-loop | | | x | |
| F3.2 feedback-cap-error | | | x | |
| F4.1 spawn-complete-link | x | | | x |
| F4.2 spawn-fail-link | x | | | x |

---

## 7. CI Integration

The `.github/workflows/` directory does not currently exist in this repository — confirmed by filesystem check. This is a greenfield addition. Two jobs: `deterministic` on every PR (required gate); `live` on manual `workflow_dispatch` only (advisory).

```yaml
# .github/workflows/integration.yml
name: Integration Tests
on:
  pull_request:
    branches: [main, 'phase/**']
    paths:
      - 'packages/cli/**'
      - 'plugins/gobbi/**'
      - 'tests/integration/**'
  workflow_dispatch:
    inputs:
      reason:
        description: 'Reason for manual live run (SDK upgrade, parity check, pre-release)'
        required: false
        type: string

jobs:
  deterministic:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.x
      - run: bun install --frozen-lockfile
      - run: bun test tests/integration/scenarios
        env:
          GOBBI_INTEGRATION_LIVE: '0'

  live:
    if: github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.x
      - run: bun install --frozen-lockfile
      - run: bun add @anthropic-ai/claude-agent-sdk --cwd tests/integration
      - run: bun test tests/integration/scenarios
        env:
          GOBBI_INTEGRATION_LIVE: '1'
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

The `paths` filter on the `pull_request` trigger skips integration CI for docs-only PRs (for example, `.claude/` design doc updates like this one). This saves GHA runner minutes and is standard practice per the GitHub Actions paths filter documentation.

The `live` job's `bun add @anthropic-ai/claude-agent-sdk --cwd tests/integration` step installs the peer-optional dep before running scenarios. This is intentional: the workspace declares the dep as peer-optional, so `bun install` does not pull it automatically. The explicit `bun add` step in the live job makes the dependency visible in CI logs without polluting the default install. If the dep is already installed (for example, in a pre-warmed CI cache), `bun add` is idempotent.

The two-job structure is preferable to a matrix strategy even though both jobs share most setup steps. A matrix would couple the `deterministic` required-status check to the `live` optional check — if both are matrix variants of the same job, GitHub Actions makes it harder to require only one variant for merge protection. Separate jobs make the required-status configuration trivial: mark `deterministic` as required, leave `live` as advisory.

**Cost projection:** Deterministic job: $0 model spend; GHA `ubuntu-latest` runner minutes only (~3 min per PR at the initial 10-scenario catalog size). Live job: ~$0.30–$0.60 per manual invocation at current Sonnet pricing for a 10-scenario catalog. At weekly manual cadence, projected monthly spend is under $10 — well within the "pennies per run" budget lock. If the scenario catalog grows to 30 scenarios, reframe the monthly cost for user approval at that time.

---

## 8. Open Questions

Three open questions flagged by both PI inputs. Each is a potential load-bearing assumption in the harness API. All three must be verified in the planning step before harness implementation begins.

**OQ-1: SDK ↔ `claude --bare -p` subprocess parity.**
Does `@anthropic-ai/claude-agent-sdk`'s `query()` exhibit identical hook-firing semantics to the `claude` CLI subprocess that gobbi users actually run in production? The Agent SDK docs describe "the same agent loop" but do not explicitly guarantee hook dispatch ordering, settings.json resolution path, or SubagentStop payload shape parity across `query()` vs subprocess invocation modes. If the SDK fires hooks in a different order or with different field shapes than the subprocess mode, the live tier becomes a poor proxy for the real deployment environment — it might pass when production fails or vice versa. The first scenario landed must include a parity smoke test that runs the same Given-When against both `query()` and `claude --bare -p` subprocess and asserts identical event-store output. If structural divergence is found, the live tier adds a subprocess fallback path for scenarios where parity cannot be established. (Source: innovative-stance ideation §4.1 OQ; best-stance ideation §4.2 OQ.)

**OQ-2: `canUseTool` vs PreToolUse hook ordering.**
The Agent SDK docs describe the tool-call lifecycle as `PreToolUse Hook → Deny Rules → Allow Rules → Ask Rules → Permission Mode Check → canUseTool Callback → PostToolUse Hook`. If this ordering holds, F1 and F4 scenarios in the live tier can rely on PreToolUse firing before `canUseTool` — meaning `gobbi workflow guard` always writes the guard event before `canUseTool` can deny the tool call. The test can assert "guard event recorded before tool was blocked." If the ordering is reversed or implementation-dependent, scenarios that combine guard denial with `canUseTool` need to restructure which layer is asserting what. Verify against the Agent SDK source code (not documentation alone) before locking the `AgentSdkHarness` hook-bridge API design. (Source: best-stance ideation §4.1 OQ.)

**OQ-3: Hook-matcher regex semantics in `hooks.json`.**
The `matcher` field in `plugins/gobbi/hooks/hooks.json` entries accepts a regex-over-tool-name per the hooks reference. Both the `HooksHarness` and the drift assertion (§5.1) parse these matchers when deciding which entries apply to a given tool name. If the harness interprets matcher regex differently from Claude Code's hook dispatch engine — anchoring behavior (`^Task$` vs `Task`), case sensitivity, Unicode mode — the drift assertion may pass for entries that real Claude Code would not fire for a given tool name, producing false confidence in coverage. Document the expected matcher semantics with an explicit reference to the hooks documentation in `harness/payloads.ts` comments. Include one parity smoke test in the live tier that exercises a matcher-filtered PreToolUse event end-to-end to confirm the harness's interpretation matches Claude Code's. (Source: innovative-stance ideation §4.2 OQ; innovative-stance ideation §6.)

---

## 9. Success Criteria

Measurable targets for the delivered integration test system. All apply to the deterministic tier unless otherwise noted.

1. **Catches the #102 regression in ≤ 2 s default-suite wall time.** Specifically: F1.1 `spawn-emitter.test.ts` fails with a clear "expected delegation.spawn event in store, found none" assertion when the capture-spawn emitter is removed from the production code path. The scenario is self-contained — two hook invocations and one event-store query — with no model-call overhead.

2. **Full deterministic suite runs in ≤ 90 s total on GHA `ubuntu-latest`.** Measured by the `deterministic` GHA job's elapsed time. With 10 scenarios × ~3 events × ~150 ms per CLI subprocess, raw execution is ~5–10 s; Bun's per-file parallel execution brings wall time well under the 90-second ceiling.

3. **$0 per PR run in default mode.** The `deterministic` job requires no `ANTHROPIC_API_KEY` secret. `GOBBI_INTEGRATION_LIVE=0` must gate zero `query()` calls to the Anthropic API.

4. **All four failure modes have ≥ 1 scenario each.** `tests/integration/scenarios/F1-hook-cli-wiring/`, `F2-prompt-compilation/`, `F3-state-machine/`, and `F4-subagent-lifecycle/` each contain at least one `.test.ts` file — confirmed by the scenario catalog in §6.

5. **Zero new production dependencies in `packages/cli/package.json`.** The `dependencies` block in `packages/cli/package.json` must be unchanged after the integration workspace is added. `@anthropic-ai/claude-agent-sdk` lands only in `tests/integration/package.json`. Verified by `diff packages/cli/package.json` before and after.

6. **Reducer-replay check passes for all green scenarios.** The `assertions/replay.ts` teardown step runs for every scenario. A scenario can pass its primary assertion and still fail the replay check — that is an independent correctness bug. Zero replay divergences on the initial 10-scenario set.

7. **`hooks.json`-drift meta-scenario passes on a clean harness.** The F1.0-meta `hooks-json-drift.test.ts` scenario passes with the initial harness implementation. Any future addition of a hook entry to `plugins/gobbi/hooks/hooks.json` without a corresponding `harness/payloads.ts` builder causes this scenario to fail, surfacing the registration gap immediately.

8. **Live-tier per-run cost ≤ $1 for the full 10-scenario catalog.** Verified by Anthropic billing after the first successful manual `workflow_dispatch` run. If the cost exceeds $1, investigate which scenarios are driving token overhead and either reduce turn depth or gate those scenarios behind a separate `workflow_dispatch` input.

9. **Parity smoke test (OQ-1) passes for at least one scenario exercised in both tiers.** The first scenario landed in the live tier must run the same Given-When against both `query()` and `claude --bare -p` subprocess and produce identical event-store output. This is the verification gate for the entire live-tier architecture — if parity fails, the live tier's value as a "real deployment proxy" is unconfirmed and the architecture needs revision before more live scenarios are added.

10. **`hooks.json`-drift meta-scenario (F1.0-meta) proves its own usefulness on first run.** After the initial implementation, intentionally remove one `hooks.json` entry and confirm that `hooks-json-drift.test.ts` fails with a clear "entry missing for hook event: <name>" message. Then re-add the entry and confirm the test passes. This "break-fix verification" — running the scenario against a known-bad state — is the standard for confirming that a safety-net test is actually load-bearing and not a false-green. Record as a required step in the plan's verification checklist.

---

## 10. Phase-3 Backlog

Four deferred innovations from the PI inputs — recorded here for future planning, not designed in this round.

**fast-check property-generated scenarios** layer model-run property tests on top of the hand-authored catalog. `fc.commands` drives the state machine: at each step, fast-check picks a legal next hook event given the current `state.json`, applies it through the `HooksHarness`, and checks invariants after each step. Fast-check shrinks to a minimal failing trace on violation. `fast-check ^4.6.0` is already installed in `packages/cli/package.json`; the same dep can be added to `tests/integration/package.json` at zero new version pinning cost. The innovative-stance ideation §8.2 establishes medium-high feasibility with Erlang QuickCheck `statem` as precedent. Ship hand-authored scenarios first; layer property generation second.

**Public hook-wire contract documentation appendix** documents the hook-wire contract gobbi implements (payload → CLI behavior) so any orchestrator — Cursor, a custom agent, a future assistant — can drive gobbi by implementing the same wire. The `HooksHarness` is the machine-readable conformance test for this contract; a human-readable appendix makes it consumable. The innovative-stance ideation §8.4 frames this as the most architecturally-consequential extension: it reframes gobbi's external boundary from "Claude Code plugin" to "reference implementation of a generic hook-wire protocol." Compatible with the current architecture at zero code change cost — only documentation and a deliberate design commitment.

**Scenario-as-gobbi-plugin packaging** ships `gobbi integration-test --scenarios <glob>` as a first-class CLI command so downstream gobbi users can regression-test their own plugin installs against the scenario library. The scenario library becomes the machine-readable definition of "gobbi works." The innovative-stance ideation §8.1 establishes medium feasibility; the harness is already pure TypeScript with no Bun-specific runtime surface, making packaging as a subcommand straightforward. The cost is docs and a stable scenario-file schema — both needed for internal use regardless.

**gobbi-on-gobbi self-test dogfooding** drives the integration suite as a gobbi workflow where the execution step is "run the integration suite" and the resulting event log is the test output. The innovative-stance ideation §8.3 notes the conceptual appeal (if gobbi's orchestration is sound, it should be able to orchestrate its own regression test) but flags meta-reasoning overhead: did the test fail because the scenario failed or because the test scenario's orchestrator failed? Defer until the scenario library stabilises and the failure modes are well-understood.

---

## Appendix A — Dependency Impact

**Current state of `packages/cli/package.json`** (verified 2026-04-20 at `/playinganalytics/git/gobbi/.claude/worktrees/docs/107-v050-integration-tests/packages/cli/package.json`):

| Category | Package | Version |
|---|---|---|
| Production (`dependencies`) | `ajv` | `^8.18.0` |
| Peer-optional | `playwright` | `>=1.40.0` |
| Peer-optional | `sharp` | `>=0.33.0` |
| Dev (`devDependencies`) | `bun-types` | `^1.3.12` |
| Dev (`devDependencies`) | `fast-check` | `^4.6.0` |

**Proposed additions for `tests/integration/package.json`** (new file — not `packages/cli/package.json`):

```json
{
  "peerDependencies": {
    "@anthropic-ai/claude-agent-sdk": ">=1.0.0"
  },
  "peerDependenciesMeta": {
    "@anthropic-ai/claude-agent-sdk": {
      "optional": true
    }
  }
}
```

This matches the `playwright` / `sharp` pattern already established in `packages/cli/package.json`. Default `bun install` from the repo root does not pull `@anthropic-ai/claude-agent-sdk`. The live-tier CI job installs it explicitly via `bun add @anthropic-ai/claude-agent-sdk --cwd tests/integration` before running; the deterministic CI job never installs it.

**Proposed `tests/integration/package.json` (full dep tree for planning reference):**

The new workspace `package.json` declares: `name: "@gobbitools/integration-tests"`; `version: "0.5.0"` (follows the monorepo version); `private: true` (not published to npm); `dependencies: { "@gobbitools/cli": "workspace:*" }` (local workspace reference resolving to `packages/cli`); `devDependencies: { "bun-types": "^1.3.12", "fast-check": "^4.6.0" }` (re-declarations at the same versions as `packages/cli/package.json` — no new pinning overhead); `peerDependencies` and `peerDependenciesMeta` as shown above for `@anthropic-ai/claude-agent-sdk`. The `scripts.test` entry should be `"bun test"` scoped to the workspace root.

**Impact summary:**

- Zero new entries in `packages/cli/package.json`'s `dependencies` block. The architectural discipline from `phase2-planning.md §"Always verify new library recommendations against current package.json"` is satisfied.
- One new peer-optional entry in `tests/integration/package.json` for the live tier. Default `bun install` does not pull it.
- `fast-check ^4.6.0` is already present as a dev dep in `packages/cli/package.json`. It can be re-declared in `tests/integration/package.json` at the same version for the Phase 3 property-test layer (§10) with no new version pinning overhead.
- The `@gobbitools/cli` dep in `tests/integration/package.json` is a local workspace reference, not a new registry dep. It resolves to `packages/cli` within the monorepo and is included in `bun install` automatically.
- The root `package.json`'s `workspaces` array requires one addition: `"tests/*"`. The planner must verify the current `workspaces` array content in the root `package.json` before writing this into an execution task, to avoid duplicating an entry that already exists or using incorrect glob syntax.

---

## Appendix B — Wire-Contract Hooks Exercised

Each row maps a Claude Code hook event class to the scenarios that exercise it and the `gobbi workflow` command handling it. Coverage is drawn from the scenario catalog in §6. The "exercised by" column cites the full scenario ID so the planner can cross-reference with the scenario catalog and verify that each wired hook command has at least one test.

The `hooks.json` entry format maps each hook event to a CLI command and an optional matcher. The `HooksHarness` consults `harness/payloads.ts` for the payload schema and `hooks.json` for the command routing. The drift meta-scenario (F1.0-meta) verifies these two sources agree. If they disagree at runtime, the CLI receives a hook it does not know how to route — that is the bug class this appendix helps prevent.

The `gobbi workflow guard` command is the most heavily exercised: it handles PreToolUse for the Task tool (spawning subagents), PreToolUse for Write/Edit tools (`.claude/` protection), and PreToolUse for all other tools (execution precondition checks). Each PreToolUse variant hits a different code path in `guard.ts` and requires a separate scenario to achieve meaningful coverage of the guard's branching logic. The scenario catalog currently provides three PreToolUse coverage points (F1.1, F1.2, F1.3); a fourth for the execution-precondition guard (denying an executor spawn when no plan exists) is a Phase 3 addition.

| Hook event class | Scenarios exercising it | `gobbi workflow` command |
|---|---|---|
| `SessionStart` | All scenarios (precondition via `gobbi workflow init` in `fixtures/temp-session.ts`) | `gobbi workflow init` |
| `PreToolUse` (Task / Agent tool) | F1.1 spawn-emitter, F4.1 spawn-complete-link, F4.2 spawn-fail-link | `gobbi workflow guard` + spawn emitter (issue #102 fix) |
| `PreToolUse` (Write to `.claude/`) | F1.3 claude-write-guard | `gobbi workflow guard` |
| `PostToolUse` (ExitPlanMode) | Not in initial catalog — add as F1.4 `capture-plan.test.ts` in Phase 3 when the F2 scope expands | `gobbi workflow capture-plan` |
| `SubagentStop` | F1.2 capture-subagent-three-cases, F4.1 spawn-complete-link, F4.2 spawn-fail-link | `gobbi workflow capture-subagent` |
| `Stop` | F3.2 feedback-cap-error (timeout pathway via clock control); add explicit heartbeat scenario in Phase 3 | `gobbi workflow stop` |

**Not exercised in this initial catalog (deferred to Phase 3):** `UserPromptSubmit`, `Notification`, `PreCompact`, `SessionEnd`, `TeammateIdle`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `PostToolUse` (ExitPlanMode). All are listed in the Agent SDK hooks reference. The initial catalog prioritizes the four user-locked failure modes; these event classes become Phase 3 additions once the core four are stable.

The `PostToolUse` ExitPlanMode gap is worth noting specifically: `gobbi workflow capture-plan` is wired in `hooks.json` but has no scenario in this catalog. It falls under F1 (hook wiring) as a secondary omission. The planner should decide whether to add `F1.4 capture-plan.test.ts` to the initial catalog or defer it to Phase 3. The scenario would be two events: `SessionStart` + `PostToolUse(ExitPlanMode)` with a plan body in `tool_input`, asserting an `artifact.write` event and a plan file at `.gobbi/sessions/{id}/plan/plan.md`. The implementation cost is low (reuses the `HooksHarness` and `assertions/event-store.ts` patterns). Recommend adding it to the initial catalog to achieve full F1 coverage of the currently-wired hook commands.

---

## Navigate Deeper From Here

This document is the design entry point for the v0.5.0 integration test system. From here, the planning step produces execution tasks; from execution tasks, the implementation produces the workspace files.

| Document | Covers |
|---|---|
| `v050-overview.md` | The closed feedback loop this test system exercises; the directory split; why hooks are the enforcement layer |
| `v050-hooks.md` | PreToolUse guard mechanics, SubagentStop capture, Stop hook behavior — the exact CLI command behavior each scenario exercises |
| `v050-state-machine.md` | The transition table the F3 scenarios assert against; the predicate registry the guard scenarios invoke |
| `v050-prompts.md` | The prompt compilation logic the F2 snapshot scenarios assert against |
| `v050-session.md` | The SQLite event store schema, `state.json` field definitions, and `ReadStore` / write-store split |
| `v050-cli.md` | The `gobbi workflow *` command surface — the exact subcommands the harness invokes |
| `.claude/project/gobbi/note/2026-04-20-integration-test-ideation/innovative.md` | Full innovative-stance PI input — rejected alternatives and "what if" innovations; read if a locked decision is challenged at planning time |
| `.claude/project/gobbi/note/2026-04-20-integration-test-ideation/best.md` | Full best-practice-stance PI input — EventStoreDB testing patterns, SDK harness justification, Playwright/Prisma layout precedents |
| `.claude/project/gobbi/gotchas/phase2-planning.md` | Phase 2 planning gotchas — `seq=1,2` init constraint, `reduce(state, event, ts?)` signature, parallel executor file staging; all directly relevant to integration harness implementation |
| `.claude/project/gobbi/gotchas/test-tooling.md` | Test tooling gotchas — fast-check v4 API changes (`fc.hexaString` removed, `fc.option` + `exactOptionalPropertyTypes` trap); relevant when adding the Phase 3 property-test layer |
