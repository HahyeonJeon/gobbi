# Bun Skill Gotchas

Bun-specific mistakes already made in this repo or explicitly warned about by project comments and official Bun docs. Read before writing subprocess, SQLite, or e2e-test code in `packages/cli/`.

---

### `Bun.spawn` stdio streams need narrowing before `new Response(...)`
---
priority: medium
tech-stack: typescript, bun
enforcement: advisory
---

**Priority:** Medium

**What happened:** An executor implementing a CLI subcommand that read subprocess output wrote `await new Response(child.stdout).text()` expecting `child.stdout` to be a `ReadableStream<Uint8Array>`. `tsc --noEmit` rejected with `TS2345: Argument of type 'ReadableStream<Uint8Array> | number | undefined' is not assignable to parameter of type 'BodyInit'`. Bun's `Subprocess.stdout` / `.stderr` are discriminated unions — a `ReadableStream` when stdio is `"pipe"`, a numeric file descriptor when stdio was `"inherit"` / `"ignore"` / a raw fd, and `undefined` when the stdio slot was omitted. TypeScript cannot narrow from the `stdio` array you passed at runtime.

**User feedback:** Self-caught by a feature-pass executor during typecheck on 2026-04-21; no user correction required. The project-level gotcha at `.claude/project/gobbi/gotchas/code-edits.md` records the incident in detail — this entry is the shorter skill-level abstract for when an agent is working inside the `_bun` context and needs the rule at the point of use.

**Correct approach:** Before passing `child.stdout` or `child.stderr` to any stream-consuming API, narrow the type — check for `undefined` and non-`ReadableStream` values first, bail or throw on the numeric/undefined arms, and only pass the narrowed `ReadableStream<Uint8Array>` to `new Response(...)`. The canonical implementation is `drainToBuffer` at `packages/cli/src/workflow/verification-scheduler.ts:68-76` — it returns `Buffer.alloc(0)` on the numeric/undefined cases and drains via `new Response(stream).arrayBuffer()` on the `ReadableStream` case. Reuse it when the shape matches; otherwise write a small local narrower (~6 lines) following the same guard pattern.

Never cast with `as ReadableStream<Uint8Array>` — that silently accepts the numeric and undefined cases at runtime and fails later with a confusing error. Bun's docs describe typed subprocess variants (`PipedSubprocess`, `ReadableSubprocess`) that would give narrower static types, but this codebase does not use them; the narrowing helper is the adopted pattern.

---

### `fast-check` v4 dropped `fc.hexaString` and other v3 shorthands
---
priority: low
tech-stack: bun, fast-check, bun:test
enforcement: advisory
---

**Priority:** Low

**What happened:** Research docs and examples targeting fast-check v3 frequently reference `fc.hexaString({ minLength: 64, maxLength: 64 })` for generating 64-char sha256 digests. This repo pins `fast-check ^4.6.0` at `packages/cli/package.json:64`, and v4 removed that shorthand along with several others. An executor writing round-trip property tests hit the missing import and had to substitute by hand.

**User feedback:** Self-caught by the E.7 executor during property-test authoring on 2026-04-18; no user correction required. The project-level gotcha at `.claude/project/gobbi/gotchas/test-tooling.md` owns the detailed write-up — this entry exists so agents loading `_bun` in a test-authoring context hit the warning before importing from `fast-check`.

**Correct approach:** In fast-check v4+, build hex strings by composition: pick one character at a time from the fixed hex alphabet (`fc.constantFrom` over the sixteen hex chars), bound the draw to the desired length via an array generator with `minLength` and `maxLength` equal, and join the array to a string in a final `map` step. Semantically this produces the same bytes v3's `hexaString` did — the generation chain is different, the output distribution is not. The `.claude/project/gobbi/gotchas/test-tooling.md` entry documents the first v3→v4 transition in this repo and is the reference site for the replacement pattern; any existing property test using `fast-check` in `packages/cli/src/` has already been rewritten against v4, so grep the test tree for a nearby call site before writing a new hex generator from scratch.

The `stripUndefined` wrapper pattern documented at `.claude/project/gobbi/gotchas/test-tooling.md` covers the related `fc.option` + `exactOptionalPropertyTypes` interaction — read both gotchas before authoring new property tests.

Whenever a research doc or external example imports a `fast-check` helper, reconcile against the installed major version at import time — v3 → v4 dropped several shorthands, not only `hexaString`. A quick check is `grep -n '"fast-check"' packages/cli/package.json` — the pin is the source of truth.

---

### Worktree `packages/cli/dist/` is gitignored — `bun run build` before running the bin shim live
---
priority: low
tech-stack: bun, build, worktree
enforcement: advisory
---

**Priority:** Low

**What happened:** An executor implementing a new CLI flag tried to verify behaviour live by running `./packages/cli/bin/gobbi.js <flag>` from a freshly-created worktree. The shim at `packages/cli/bin/gobbi.js:3` imports `run` from `../dist/cli.js`, and the `dist/` directory is gitignored. Fresh worktrees start without it, so the first invocation failed with a Bun loader "cannot find module" error. A single `bun run build` in the worktree produced the output and subsequent invocations worked.

**User feedback:** Self-caught by a feature-pass executor during verification on 2026-04-21; flagged in the executor's report as a brief-omission to future task authors. Full incident is at `.claude/project/gobbi/gotchas/test-tooling.md`.

**Correct approach:** When a task asks an executor to exercise the CLI shim live from a freshly-created worktree, pick one:

- Include `bun run build` as an explicit pre-run step in the brief. The build script is at `packages/cli/package.json:19`; `prebuild` at `packages/cli/package.json:18` chains `gen:predicates` automatically.
- Run the CLI from source via `bun run packages/cli/src/cli.ts <args>` — no build required, startup is comparable.
- Verify via unit or e2e tests only. `bun test` runs TypeScript source directly and never needs `dist/`.

The `dist/` directory is gitignored per `.gitignore`, so every fresh worktree starts without it. Tests work from source; the `bin/gobbi.js` shim does not.

The build command itself is `bun build ./src/cli.ts --outdir ./dist --target bun --external playwright --external sharp` (`packages/cli/package.json:19`) — the `prebuild` hook chains `gen:predicates` so the generated `predicates.generated.ts` is current before bundling. If `gen:predicates` has not run in the worktree yet, `bun run build` takes care of it automatically; calling `bun build` directly skips the hook and can produce a stale dist.

---

### `Bun.write` has no append mode — use `node:fs.appendFileSync` / `appendFile`
---
priority: medium
tech-stack: bun, node:fs
enforcement: advisory
---

**Priority:** Medium

**What happened:** Agents reasoning from a "Bun is strictly better than node:fs" framing reach for `Bun.write(path, data)` to append to `events.jsonl` or a similar log file. `Bun.write` always truncates-and-writes — there is no append flag, and `Bun.file(path).writer()` is a replace-writer, not an append-writer. The first time this pattern appeared in `workflow/state.ts`, it was caught during review and replaced with `appendFileSync` from `node:fs`. The file carries an explicit comment documenting the choice so the next reader does not flip it back.

**User feedback:** Design-time catch during v0.5.0 event-store authoring; documented inline at `packages/cli/src/workflow/state.ts:506`. Bun's own docs list this as an intentional API limitation.

**Correct approach:** Use `appendFileSync(filePath, data, 'utf8')` from `node:fs` for synchronous append, or `appendFile` from `node:fs/promises` for async contexts. The canonical synchronous pattern is `appendJsonl` at `packages/cli/src/workflow/state.ts:508`; it creates the directory if missing via `mkdirSync(dir, { recursive: true })` before appending, which is a shape worth mirroring when you add a new append sink.

For atomic writes where you want crash-safety (temp file + rename), also stay with `node:fs` — the atomic-write pattern in the same module uses `writeFileSync` on a temp path followed by `renameSync` onto the final path. `Bun.write` is only appropriate when full-replacement of the file is the intended semantics; it is fine for one-shot `JSON.stringify` dumps to a settings file, but wrong for every incremental-log or append-to-existing use case.

---

### `Bun.$` env leaks across tests — blank `CLAUDE_SESSION_ID` / `CLAUDE_TRANSCRIPT_PATH` explicitly per test
---
priority: medium
tech-stack: bun, bun:test, testing
enforcement: advisory
---

**Priority:** Medium

**What happened:** An e2e test using `$\`bun run ${CLI_PATH} workflow init --session-id ${sessionId}\`` inherits the parent process's environment by default, including any `CLAUDE_SESSION_ID` and `CLAUDE_TRANSCRIPT_PATH` set by Claude Code itself. When the parent is an agent-driven run, the child CLI's hook commands pick up the parent's session id and collide with the test's `--session-id` flag — tests that pass in isolation fail when run under Claude Code, and vice versa.

**User feedback:** Caught during e2e-test authoring and encoded in the test files. Canonical scrub pattern at `packages/cli/src/__tests__/e2e/workflow-cycle.test.ts:68-75`; mirrored at `packages/cli/src/__tests__/e2e/migration-chain.test.ts:85-90`.

**Correct approach:** Build a `childEnv` object that spreads `process.env` and explicitly blanks `CLAUDE_SESSION_ID: ''` and `CLAUDE_TRANSCRIPT_PATH: ''`, then chain `.env(childEnv)` on every `$\`...\`` invocation inside the test. Do not assume the parent env is safe — every e2e that spawns the CLI must scrub. Keeping the rest of `process.env` via spread is important: `PATH` must remain so the child can find `bun`, and unrelated environment (locale, temp dir) does not create test divergence.

The `CLAUDE_TRANSCRIPT_PATH` blanking is defensive today (current commands do not read it) but prevents a future class of env leak if any command starts resolving it implicitly. Read the comments at `workflow-cycle.test.ts:20-27` and `71-74` before authoring a new e2e test — the header comment is explicit about why both variables must be blanked.

The same rule applies to any future production subprocess site that should be isolated from the parent's Claude Code env — construct an explicit env, do not rely on `process.env` inheritance.

---

### `db.transaction()` SAVEPOINT nesting — inner calls are not independent `BEGIN` blocks
---
priority: medium
tech-stack: bun, bun:sqlite
enforcement: advisory
---

**Priority:** Medium

**What happened:** When a `db.transaction()` callable is invoked from inside another transaction, bun:sqlite automatically promotes the inner call to a `SAVEPOINT` / `RELEASE` pair rather than issuing an independent `BEGIN` / `COMMIT`. Code migrating from `better-sqlite3` or `sqlite3` with async wrappers may assume that an inner transaction rollback is independent of the outer one — it is not. A rollback inside the inner block rolls back to the SAVEPOINT boundary, which is subtly different from rolling back an independent transaction. In this repo, the `init` command composes two append-and-update-state calls inside a single outer `store.transaction()` precisely because the SAVEPOINT behavior gives the pair atomic rollback semantics — but relying on independent isolation inside nested calls would silently misbehave.

**User feedback:** Documented proactively in the code comment at `packages/cli/src/commands/workflow/init.ts:209` ("bun:sqlite promotes nested calls automatically") so future authors reading the `store.transaction(() => { ... })` composition understand the isolation contract. No observed runtime bug yet — this is a preventive record sourced from the project comment and bun:sqlite's documented behavior.

**Correct approach:** Treat nested `db.transaction()` calls as SAVEPOINT / RELEASE, not nested BEGIN / COMMIT. When you need independent failure isolation for an inner block, either refactor so the inner operation runs after the outer transaction completes, or issue explicit `SAVEPOINT name` / `ROLLBACK TO name` SQL against the raw `db.run()` so the save-point boundary is named and visible.

The repo's event store composition is the canonical "intentional SAVEPOINT" pattern — read `packages/cli/src/commands/workflow/init.ts:206-220` for the shape and the comment immediately above the `store.transaction` call for the rationale. Note also that `db.transaction(fn).immediate()` at the outer boundary acquires the write lock upfront (see `lib/config-store.ts:321` for another use site) — inner SAVEPOINTs inherit that lock, so there is no risk of a deadlock promotion inside the nesting. If the inner operation is logically independent and you are tempted to wrap it in a second `.immediate()` call, that is the signal to refactor: the inner work belongs outside the outer transaction entirely.
