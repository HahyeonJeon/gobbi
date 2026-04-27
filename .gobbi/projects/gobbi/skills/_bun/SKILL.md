---
name: _bun
description: Use when writing or reviewing Bun runtime code in gobbi-cli — Bun.spawn, Bun.$, bun:sqlite, bun:test, module-relative paths, and the build/run script surface. Also load when narrowing Bun API return types.
allowed-tools: Read, Grep, Glob, Bash
---

# Bun

Use when writing or reviewing Bun runtime code in `packages/cli/` — subprocess spawning (`Bun.spawn`, `Bun.$`), SQLite access (`bun:sqlite`), tests (`bun:test`), module-relative path resolution, or the `package.json` build/run surface. Do not load for TypeScript type-system design or compiler configuration — those belong to `_typescript`.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Bun-specific mistakes already captured in this repo |

---

## Core Principles

> **Bun is a hermetic runtime, not a faster Node. gobbi-cli is a Bun program that imports from `node:*` with intent, not a Node program that happens to boot on Bun.**

`packages/cli/package.json:10` pins `"engines": { "bun": ">=1.2.0" }`. The shim at `packages/cli/bin/gobbi.js:1` is `#!/usr/bin/env bun`. Tests run under `bun test`; the build targets `--target bun` (`packages/cli/package.json:19`). There is no Node fallback. Every `node:*` import is a deliberate choice — not the default. The right mental model is: the toolchain is the stdlib, and reaching for `node:*` always has a reason attached.

> **Prefer Bun-native APIs when strictly better; cross into `node:*` only with a reason.**

`Bun.CryptoHasher` wins over `node:crypto` for single-digest workloads because it stays at zero install cost (`specs/assembly.ts:634`, `specs/sections.ts:96`, `workflow/verification-scheduler.ts:124`). `bun:sqlite` wins over `better-sqlite3` for the same reason (`workflow/store.ts:9`). `Bun.spawn` wins over `child_process.spawn` because it exposes typed stdio streams (`workflow/verification-scheduler.ts:148`). But `Bun.write` has no append mode — `lib/prompt-evolution.ts:137` (`appendJsonlSync`) documents why `node:fs.appendFileSync` remains the honest answer for append workloads. When staying with `node:*`, leave a comment so the next reader does not flip it.

> **Every Bun API that hands back a union type is a narrowing obligation.**

The most common source of TS2345 in this codebase is `Bun.spawn(...).stdout` / `.stderr`, typed `ReadableStream<Uint8Array> | number | undefined`. The numeric arm fires when stdio was `"inherit"` / `"ignore"` / a file descriptor; the undefined arm fires when the stdio slot was omitted. Read the `drainToBuffer` helper at `workflow/verification-scheduler.ts:68` — that is the canonical narrowing for this repo. Never cast past the union with `as ReadableStream<...>`; that silently accepts the numeric and undefined cases at runtime.

> **`bun:test` is the test runtime. There is no vitest, no jest.**

Every `*.test.ts` file imports from `bun:test` — `describe`, `test`, `it`, `expect`, `mock`, `beforeEach`, `afterEach`. There is one test API, one mock API, one snapshot path. Tests are invoked via `bun test` (`packages/cli/package.json:22`); no build step required. When research docs discuss `jest.mock` or `vi.spyOn`, translate them to `bun:test`'s `mock()` with `spyOn` semantics.

> **Scripts are TypeScript. No transpile step, no loader config.**

`bun run scripts/gen-predicate-names.ts` is the entire invocation (`packages/cli/package.json:17`). There is no `ts-node`, no `tsx`, no intermediate `dist/` step. The shebang `#!/usr/bin/env bun` at `scripts/gen-predicate-names.ts:1` makes the `.ts` file directly executable. The runtime and the loader are the same artifact.

---

## When to Use Bun vs `node:*`

This is a decision guide, not a cheat sheet — one line per surface on which call to make and why. Read the cited code for the pattern; do not duplicate it here.

- **Single-file reads of JSON/text/bytes** — `Bun.file(path).text()` / `.json()` / `.bytes()`. Lazy, composable with `new Response()`, zero dependency.
- **Append-mode writes** — `appendFileSync` from `node:fs`. `Bun.write` always truncates-and-writes; `lib/prompt-evolution.ts:137` (`appendJsonlSync`) is the canonical reference for this choice.
- **Atomic writes (temp + rename)** — `writeFileSync` + `renameSync` from `node:fs`. `Bun.write` is not atomic in the rename sense.
- **SHA-256 / other hashing** — `new Bun.CryptoHasher('sha256')` over `node:crypto.createHash`. Keeps dependency surface at zero against the `engines.bun` floor.
- **Subprocess spawn (production)** — `Bun.spawn({ cmd, cwd, stdio, env, detached })`. `child_process` is a polyfill; always prefer `Bun.spawn`.
- **Shell composition in tests** — `Bun.$` tagged template. E2E only — see §Subprocess: `Bun.$`.
- **Stdin streaming** — keep `node:process.stdin` event streams. The TTY-aware "return null when piped input is absent" behavior stays cleaner with the Node streams API than `Bun.stdin`.
- **Env** — `process.env`. `Bun.env` is an alias; prefer the `node:*` name for consistency — do not introduce a mixed pattern.
- **Module-relative paths (tests)** — `import.meta.dir`. One-hop, unambiguous. See `__tests__/e2e/workflow-cycle.test.ts:42`.
- **Module-relative paths (production)** — `dirname(fileURLToPath(import.meta.url))`. Survives whatever bundler settings the future brings. See `cli.ts:267`, `scripts/gen-predicate-names.ts:57`.

The rule: pick per surface, match the surrounding file's existing convention, and write a comment if the choice is non-obvious.

---

## Subprocess: `Bun.spawn`

The repo's canonical subprocess pattern is `SyncScheduler` at `workflow/verification-scheduler.ts:125`. Read it before writing new spawn code. Four invariants hold across every spawn site:

**Stdio narrowing is the caller's job.** `subprocess.stdout` / `subprocess.stderr` are union-typed. Reuse `drainToBuffer` at `workflow/verification-scheduler.ts:68` when the shape matches — it guards on `!stream || typeof stream === 'number'` before passing to `new Response(stream).arrayBuffer()`. Otherwise write a small local narrower that bails or throws on the numeric/undefined arms. See the skill-level gotcha on stdio narrowing below.

**`detached: true` is how process-group kill works.** Linux does not propagate SIGTERM from a parent-shell to its descendants automatically — `bun test` workers and `bunx tsc` subprocesses orphan without process-group semantics. Spawn detached (`workflow/verification-scheduler.ts:148-154`), then kill with negative PID (`process.kill(-pid, sig)` via the `killGroup` helper at `workflow/verification-scheduler.ts:117-123`). Wrap in try/catch for `ESRCH`; the race between our decision to kill and natural exit is benign.

**Signal handling uses `subprocess.signalCode`, not the `128 + signal` numeric encoding.** The symbolic `signalCode` ("SIGTERM", "SIGKILL", or null) is unambiguous; the numeric encoding collides in edge cases. The `normalizeExitCode` function at `workflow/verification-scheduler.ts:92-106` shows the complete mapping.

**Drain stdout/stderr concurrently with `.exited`.** Bun's internal stream buffers stall the child when nothing reads them. The `Promise.all([drainToBuffer(child.stdout), drainToBuffer(child.stderr), child.exited])` pattern at `workflow/verification-scheduler.ts:195-199` is the canonical drain. Any code that awaits `.exited` first and reads stdout after is a latent hang.

Future subprocess code in gobbi should reuse `SyncScheduler` or mirror its ladder — do not reinvent the pattern.

---

## Subprocess: `Bun.$` Shell

`Bun.$` is a tagged template literal imported from `'bun'`. In this codebase it is used only in e2e tests to drive the compiled CLI as a real subprocess. Canonical usage: `workflow-cycle.test.ts:82-85` with the chain `$\`...\`.cwd(dir).env(map).quiet()`.

Two constraints make this a test-only idiom here:

- **Environment isolation is mandatory.** When the parent test process runs inside Claude Code, variables like `CLAUDE_SESSION_ID` and `CLAUDE_TRANSCRIPT_PATH` leak into the child and collide with the test's `--session-id` flag. The canonical scrub builds an explicit `childEnv` that blanks those variables before `.env(childEnv)` — see `workflow-cycle.test.ts:68-75` and the mirrored pattern at `__tests__/e2e/migration-chain.test.ts:85-90`.
- **Production code uses `Bun.spawn` with explicit `cmd` arrays.** `Bun.$` composes through shell interpretation, which creates injection risk when any argument could carry user input. Tests know their inputs; production code does not. No production path in this repo uses `Bun.$`.

---

## SQLite: `bun:sqlite`

`bun:sqlite` is a synchronous API. All methods return directly; no Promise wrappers, no async boundaries. This is a feature, not a limitation — the CLI is a short-lived process and synchronous composition with `db.transaction()` is the simplest possible transactional model.

The repo's canonical bootstrap is the `EventStore` constructor at `workflow/store.ts:499-503`. Five invariants, all cited:

**Open with `{ strict: true }`.** `new Database(path, { strict: true })` enables `$named` parameters with `Record`-shaped bindings and turns type-coercion errors into thrown exceptions rather than silent mis-writes. See `workflow/store.ts:499` for the canonical open call. Do not mix `strict` modes across a session.

**Four PRAGMAs after open.** `journal_mode = WAL`, `synchronous = NORMAL`, `foreign_keys = ON`, `busy_timeout = 5000`. Set at open time, always — see `workflow/store.ts:500-503`. WAL + busy_timeout eliminates the lost-update class the legacy `settings.json` read-modify-write suffered from. `foreign_keys = ON` enforces referential integrity at the SQLite layer.

**`db.query(sql)` caches the compiled statement; cache the return value yourself too.** Bun caches by SQL string on the database instance, so repeated `db.query(...)` calls return the same `Statement`. For dynamic SQL where the cache would fill with one-offs, use a `Map`. Run `rg "db.query\|Map.*Statement" packages/cli/src/workflow/store.ts` for current caching patterns in the repo.

**Transactions use `.immediate()` for write-first blocks.** `db.transaction(() => {...}).immediate()` acquires the write lock upfront and prevents deadlock under concurrent writers. Use `.immediate()` whenever the first operation inside the transaction is a write.

**Cleanup via `Symbol.dispose` and the `using` keyword.** `EventStore` implements `[Symbol.dispose]()` — run `rg "Symbol.dispose" packages/cli/src/workflow/store.ts` to find the implementation. `close()` runs a best-effort `PRAGMA wal_checkpoint(TRUNCATE)` inside a try/catch so in-memory databases (which do not support checkpointing) do not throw.

Nested `db.transaction()` calls behave as SAVEPOINTs, not nested `BEGIN` blocks — see the comment at `commands/workflow/init.ts:209` and the skill-level gotcha below.

The `db.query<Row, [Bindings]>` two-parameter generic is a TypeScript-only concern — see `_typescript` for the shape and the silent-`any` trap if the tuple is wrong.

---

## Testing: `bun:test`

One runner, one API. Import surface: `describe`, `test`, `it`, `expect`, `mock`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll` — all from `'bun:test'`. Never `@jest/globals`, never `vitest`. Tests live in `__tests__/` subdirectories next to the source, with snapshots in `__snapshots__/` folders auto-managed by Bun.

**Mocking.** `mock(() => {})` from `bun:test` creates a mock function; assignment to `console.warn` / `console.error` inside `beforeEach` is the established pattern for capturing log output. Read the test files around the module you are modifying — the codebase is the reference for mock style.

**Async tests.** `bun:test` supports `async` test functions natively. Real-subprocess e2e tests set an explicit `timeout` (e.g. `{ timeout: 60_000 }` on `workflow-cycle.test.ts`) because cold `bun run` startup plus command work can legitimately take tens of seconds.

**`bun test` vs `bun run build`.** `bun test` runs TypeScript source directly via Bun's built-in transpiler — no build step required. The `bin/gobbi.js` shim imports from `../dist/cli.js` and requires `bun run build` first. Never assume `dist/` exists in a fresh worktree (see the gotcha below).

**`fast-check` is v4 in this repo.** `devDependencies` pin `fast-check ^4.6.0` at `packages/cli/package.json:64`. v3 shorthands like `fc.hexaString` do not exist — see the gotcha below for the v4 idiom.

---

## Module Resolution

Three near-synonymous primitives, each with a narrow role. Consistency inside a file matters more than the cross-file choice — do not mix styles in the same module.

- **`import.meta.main`** — truthy when the module is the entry point. One production use in the repo: the self-invoke guard at `cli.ts:303`. Use when a module is both importable and runnable.
- **`import.meta.dir`** — Bun-native string path to this file's directory. Use in test files where brevity matters (`__tests__/e2e/workflow-cycle.test.ts:42`, `__tests__/e2e/migration-chain.test.ts:43`).
- **`import.meta.url`** — the ESM-standard `file://` URL. Round-trip via `fileURLToPath(import.meta.url)` for production code (`cli.ts:267`, `scripts/gen-predicate-names.ts:51,57`). Prefer this form for anything that compiles to `dist/` — the URL semantics survive bundling.

---

## File I/O

Single-rule summary: **`Bun.file` for reads, `node:fs` for writes that need append or atomic-rename.** The split is explicit, not an aesthetic choice.

Reads use `Bun.file(path).text()` / `.json()` / `.bytes()` when a single-shot async load suffices. Append workloads go through `appendFileSync` from `node:fs` — see `appendJsonlSync` at `lib/prompt-evolution.ts:137` for the canonical append-mode helper and the inline comment explaining why `Bun.write` cannot substitute. Atomic writes use the temp-file-plus-rename pattern; do not reach for `Bun.write` here either.

---

## Build and Scripts

The build contract is `packages/cli/package.json:19`: `bun build ./src/cli.ts --outdir ./dist --target bun --external playwright --external sharp`. Three invariants:

**`--target bun` is non-negotiable.** It is what preserves `bun:sqlite` and `Bun.*` as runtime imports rather than bundling a browser shim. Removing it breaks the dist silently — the build succeeds, the runtime crashes on first `import { Database } from 'bun:sqlite'`.

**Optional peers go in `--external` AND `peerDependenciesMeta`.** `sharp` and `playwright` are optional peers declared at `packages/cli/package.json:27-37`. External-at-build-time keeps `bun build` from failing when the peer is absent; `optional: true` in `peerDependenciesMeta` keeps `bun install` from warning. Any new optional native peer must match this pattern.

**`bin/gobbi.js` is a shim over `dist/cli.js`.** The shim at `packages/cli/bin/gobbi.js:3` imports `run` from `../dist/cli.js`. Fresh worktrees do not have `dist/` (it is gitignored), so `bun run build` must run before the shim is invoked live. See the gotcha on worktree `dist/` below.

**Lifecycle hooks run codegen first.** `prebuild` and `pretypecheck` both chain `bun run gen:predicates` (`packages/cli/package.json:18,20`) so the generated `workflow/predicates.generated.ts` is current before either operation. No manual sequencing required.

Scripts themselves are `.ts` files invoked via `bun run scripts/<name>.ts`. They resolve their own module directory via `fileURLToPath(import.meta.url)` and read/write through `node:fs`. The shebang at `scripts/gen-predicate-names.ts:1` makes the file directly executable when chmodded; `bun run <file>` works without a shebang.

---

## Boundary with `_typescript`

Clean cut along the import-graph:

**`_bun` owns runtime and toolchain.** Anything that answers "how do I call this in Bun": spawn semantics, SQLite pragmas, test-runner API surface (`describe`/`test`/`mock`), build command, script invocation, module-identity helpers. When a spawn-return-type error fires, `_bun` provides the narrowing reference (`drainToBuffer`); `_typescript` provides the narrowing technique (discriminated unions).

**`_typescript` owns the type system.** `tsconfig.json` semantics (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), discriminated-union authoring, type-guard style, narrowing idioms, `satisfies`, compile-time discipline inside tests.

**Contested seams, decided:**

- `bun:test` runtime API (imports from `'bun:test'`) → `_bun`.
- Typing test fixtures (`exactOptionalPropertyTypes` interacting with property generators, `mock<T>()` inference) → `_typescript`.
- `fast-check` version drift → `_bun/gotchas.md` (co-located with the test-runner context where agents encounter it).
- `*/`-inside-docblock (TS lexer bug) → `_typescript/gotchas.md` — the bug fires under `tsc` on any target.

---

## Constraints

Bright-line don'ts. Every one of these corresponds to an observed or documented failure in this repo.

- Do NOT cast past `Bun.spawn`'s stdio union with `as ReadableStream<...>`. Narrow or throw.
- Do NOT use `Bun.write` for append. Use `appendFileSync` from `node:fs`.
- Do NOT use `Bun.$` in production code. E2E tests only; production paths use `Bun.spawn` with explicit `cmd` arrays.
- Do NOT add a third-party test runner or mock library. `bun:test` is the runtime — no vitest, no jest, no `@jest/globals`.
- Do NOT introduce `Bun.serve`, `Bun.password`, or `Bun.FFI`. The CLI is short-lived; none of these belong in its surface.
- Do NOT assume `packages/cli/dist/` exists in a fresh worktree. Build before invoking the `bin/gobbi.js` shim live.
- Do NOT remove `--target bun` from the build command. It preserves `bun:*` runtime imports.
- Do NOT `await` a `bun:sqlite` call. The API is synchronous; `await` on a non-thenable is a no-op that confuses readers.
- Do NOT rely on nested `db.transaction()` callables for independent rollback isolation. Bun promotes them to SAVEPOINTs — see the gotcha below.
