# Prompts as Data

Feature description for gobbi's step-spec model. Read this to understand why workflow prompts are structured data rather than authored text, what that makes possible, and how Wave C.1 ships the schema lock + JSON Patch tooling that lets operators evolve prompts without losing history.

---

> **The prompt for every workflow step is a spec file, not a template someone wrote. It is structured, validated, generated — and evolvable through an audit-only patch flow.**

In v0.4.x, orchestration is driven by skills the orchestrator reads and interprets. The prompt content is prose — instructions an LLM reads and follows as best it can. Changing the workflow means changing the prose and hoping the interpretation tracks.

V0.5.0 moves workflow prompts to data. Each step is defined by a `spec.json` file in the CLI's spec library. The spec declares the step's metadata, valid exit transitions with predicate references, delegation topology (which agents, which stances, which artifacts they write), token budget allocation, and the static instructional blocks. The CLI reads the spec and generates the prompt programmatically; all dynamic data — session state, inlined artifacts, skill materials — is added by the CLI's compilation logic. The spec describes what the step does; the CLI decides what data to supply. When a step becomes active, the CLI reads the spec, assembles the prompt following the section ordering described in `token-budget-and-cache.md`, and hands it off at the moment of need per `just-in-time-prompt-injection.md`.

This separation produces several concrete properties. Guards and static analysis tools can validate structured delegation data without parsing prose. The SubagentStop hook knows the expected artifacts from the spec's delegation config without inspecting the conversation. Every spec is validated against a JSON Schema; the schema and the TypeScript `StepSpec` interface are bound together by an `ajv::JSONSchemaType<StepSpec>` annotation so divergence fails `tsc --noEmit` before any runtime test loads. A glob-validation CI gate (Wave C.1.1) rejects every `spec.json` in the source tree that does not satisfy the locked schema.

The predicate registry is the key mechanism: transition conditions and guard conditions in specs are predicate names (strings in JSON), not inline logic. The CLI resolves predicate names to registered implementations. Adding a new workflow condition means adding an implementation to the registry and referencing its name — not modifying an expression parser or writing custom operator logic.

---

## 1. The schema lock (Wave C.1.1)

The drift safety net stack:

| Layer | Where | What it catches |
|---|---|---|
| Compile-time | `_schema/v1.ts:249` `JSONSchemaType<StepSpec>` annotation | A field added to `types.ts::StepSpec` without a matching entry in `StepSpecSchema` (or vice versa) — fails `tsc --noEmit`. |
| JSON-mirror byte-equality | `specs/__tests__/schema.test.ts:399-406` | A hand-edit to `_schema/v1.json` that drifts from `JSON.stringify(StepSpecSchema, null, 2)`. |
| **Glob-validation (NEW Wave C.1.1)** | `specs/__tests__/all-specs.test.ts` | Every on-disk `<step>/spec.json` validates against the schema at runtime, with `$schema` pinned to `STEP_SPEC_SCHEMA_ID`. Closed-set assertion guarantees the discovered step directories match `{ideation, planning, execution, evaluation, memorization, handoff}`. |
| Custom keyword | `_schema/v1.ts::tokenBudgetSumEqualsOne` | The runtime-only invariant that token-budget proportions sum to 1.0 (± 1e-6). |

The locked `$id` is `https://gobbi.dev/schemas/step-spec/v1.json`. Every spec carries the `$schema` field pointing at that URI; the glob test asserts the field equals the locked constant. A future schema-v2 wave bumps both the `$id` and the field's expected value; until then the schema is frozen — any change to its field shape, `additionalProperties: false`, `required` arrays, or `nullable` annotations routes to a future wave, not C.1.

---

## 2. The CQRS partition extended to prompts (Wave C.1.2 + C.1.3 + C.1.4)

V0.5.0 already locks CQRS for events: `state.db::events` is truth, `gobbi.db::memories` is the projection. Wave C.1 applies the same split to prompts:

```text
                 ┌──────────────────────────────────────────────────────┐
                 │  state.db::events (TRUTH)                            │
                 │  one `prompt.patch.applied` row per applied patch    │
                 │  Wave C.1.3 — audit-only event, bypasses reducer     │
                 └──────────┬─────────────────────────┬─────────────────┘
                            │ projection write        │ JSONL append
                            ▼                         ▼
        ┌────────────────────────────┐   ┌────────────────────────────────┐
        │ state.db::prompt_patches   │   │ .gobbi/projects/<n>/prompt-    │
        │ (READ PROJECTION)          │   │ evolution/<prompt-id>.jsonl    │
        │ Wave C.1.2 — schema v7     │   │ (REPLAY-FOLDABLE LOG)          │
        │ queryable history          │   │ Wave C.1.4 — genesis-line      │
        └────────────────────────────┘   │ chain, foldable to spec.json   │
                                         └─────────────────┬──────────────┘
                                                           │ fold
                                                           ▼
                                  ┌──────────────────────────────────────┐
                                  │ packages/cli/src/specs/<step>/       │
                                  │ spec.json (MATERIALIZED SNAPSHOT)    │
                                  │ derivable from the JSONL chain;      │
                                  │ replay-equivalence CI gate locks     │
                                  │ contentHash(folded) ≡ on-disk hash   │
                                  └──────────────────────────────────────┘
```

### 2.1 The `prompt_patches` table (Wave C.1.2)

Schema v7, additive. One row per applied RFC 6902 patch:

| Column | Purpose |
|---|---|
| `seq INTEGER PRIMARY KEY AUTOINCREMENT` | Local row ordering (mirrors `events.seq`). |
| `session_id`, `project_id` | Workspace partition keys (mirror v6 sibling tables). |
| `prompt_id` (CHECK closed enum) | One of `{ideation, planning, execution, evaluation, memorization, handoff}` — locked to the user-locked prompt-id set. |
| `parent_seq` (FK to self) | Chain causality (NULL = genesis row). |
| `event_seq` (UNIQUE FK to `events(seq)`) | 1:1 row-event pairing. |
| `patch_id` | `sha256(canonicalize(patch_json))` — content address. Reused as the `'content'` IdempotencyKind's `contentId`. |
| `patch_json` | RFC 6902 ops array (JSON-encoded; includes any synthesized test op). |
| `pre_hash`, `post_hash` | `sha256(canonicalize(spec.json))` before / after. |
| `applied_at` | UNIX-ms wall clock. |
| `applied_by` (CHECK = `'operator'`) | Patch flow is operator-only. Future widening (agent-proposed patches) requires v8. |

Two unique indices: `idx_prompt_patches_event` on `event_seq` (1:1), and `idx_prompt_patches_content` on `(prompt_id, patch_id)` — the cross-session content-dedup safety net.

`ensureSchemaV7` runs inside `EventStore.initSchema` after `ensureSchemaV6` and is idempotent. The maintenance command `gobbi maintenance migrate-state-db` runs both for operators who want a deterministic migration step.

### 2.2 The `prompt.patch.applied` audit-only event (Wave C.1.3)

Mirror of `step.advancement.observed` from Wave A.1.3. The event commits via `store.append()` directly — the reducer never sees it. The runtime fence at `reducer.ts:691` returns `ok(state)` for any `isPromptPatchAppliedEvent` to defend against serialise/deserialise replay paths that erase the type-level `Event ∪ AuditOnlyEvent` discriminator.

The data shape carries audit hints — `promptId`, `patchId`, `parentPatchId`, `preHash`, `postHash`, `opCount`, `schemaId`, `appliedBy` — but **not** the full RFC 6902 ops array. The ops live in the JSONL log line and the `prompt_patches.patch_json` column. The event records the *fact*; the projection holds the *content*.

A new `'content'` `IdempotencyKind` variant (synthesis lock 9) lands with this event. Formula: `${type}:${contentId}`. The `contentId` is the `patchId`. `sessionId` is intentionally **absent** from the formula, so the same patch content authored from two different sessions dedupes at the events table via the existing `ON CONFLICT(idempotency_key) DO NOTHING` gate. Cross-session content dedup, belt-and-braces with the `UNIQUE (prompt_id, patch_id)` projection index.

Closed-enumeration count: 24 wire-level event types (22 reducer-typed + 2 audit-only).

### 2.3 The JSONL evolution log (Wave C.1.4)

Path: `<repoRoot>/.gobbi/projects/<project>/prompt-evolution/<prompt-id>.jsonl`. One file per prompt-id, six files total (one per step in the closed prompt-id set). Whitelisted by the existing `!.gobbi/projects/` rule in `.gitignore` — git-tracked.

The first line of every file is the **genesis entry** (synthesis innovative addition #2): a synthetic `add op` at root path `''` whose `value` is the entire baseline `spec.json`. This makes the JSONL self-contained — any reader can fold the chain from line 1 and reproduce the on-disk `spec.json` byte-exactly. Without genesis, the JSONL is a delta-only log requiring the on-disk spec as external input.

Per-line schema (synthesis §7):

```json
{
  "v": 1,
  "ts": "<ISO-8601>",
  "promptId": "ideation",
  "patchId": "sha256:<hex>",
  "parentPatchId": "sha256:<hex>" | null,
  "preHash": "sha256:<hex>",
  "postHash": "sha256:<hex>",
  "ops": [{"op":"test","path":"/version","value":1}, ...],
  "validationStatus": "passed",
  "appliedBy": "operator",
  "eventSeq": 12345,
  "schemaId": "https://gobbi.dev/schemas/step-spec/v1.json"
}
```

Field-name convention: lowerCamelCase in JSONL (TS convention), snake_case in SQLite (SQL convention). Mapping at the writer/reader boundary, mirroring `EvalDecideData.plan ↔ state.evalConfig.planning`.

**Canonicalization rule (synthesis Architecture F-7 fix):** `JSON.stringify(value, null, 2)` — insertion-order, 2-space indent. Matches the existing schema-mirror byte-equality test at `specs/__tests__/schema.test.ts:399-406`. A sorted-key variant would split the hash space; insertion-order is well-defined for `spec.json` files (the author's chosen key order is part of the file's byte identity), and `fast-json-patch::applyPatch` preserves key insertion order. The canonicalization is round-trip stable.

The `lib/canonical-json.ts::canonicalize` helper is the single source of truth — `lib/prompt-evolution.ts::contentHash` returns `sha256:<hex>` over `canonicalize(value)` bytes, and every hash in the system (event payload, projection columns, JSONL line fields) hashes the same way.

---

## 3. Operator commands (Waves C.1.5 + C.1.6 + C.1.7)

The `gobbi prompt` top-level dispatcher mirrors `gobbi maintenance` exactly (registry-based, dynamic-imported subhandlers). Three subcommands:

### 3.1 `gobbi prompt render <prompt-id> --format=...` (Wave C.1.5)

Three formats:

- `--format=markdown` (default) — flat readable doc walking `StepBlocks` in source order. No session.state, no dynamic.context. Suitable for `gobbi prompt render <step> --format=markdown | less` reviews.
- `--format=composed` — calls `assembly.compile()` directly, NOT a re-implementation. Output is byte-identical to what the runtime orchestrator produces for the same `CompileInput`. Includes the `staticPrefixHash` header line so operators can verify cache stability against `gobbi workflow status --cost`.
- `--format=diff <baseline-patch-id>` — folds the JSONL chain twice (truncated to baseline, full to head), renders both as markdown, and shells out to `git --no-pager diff --no-index`. Zero new diff dependencies. `--allow-empty-diff` exits 0 on a genesis-only chain; default refuses with a clear message.

### 3.2 `gobbi prompt patch <prompt-id> --patch <file>` (Wave C.1.6)

The operator-only mutation surface. Single new production dependency: `fast-json-patch@3.1.1`.

Validation pipeline (synthesis §9.2 fail-fast ladder):

1. Parse JSON, reject non-array roots (RFC 6902 §3 requires top-level array).
2. RFC 6902 shape check via `fast-json-patch::validate`.
3. **Test-op merge logic** (synthesis §9.2 step 3, Overall F-7):
   - No `test` op anywhere → synthesize `{op:'test',path:'/version',value:1}` at index 0; warn on stderr.
   - Operator-authored `test` op already at index 0 testing `/version` → keep as-is.
   - Operator-authored `test` op(s) elsewhere or testing other paths → prepend the synth `/version` test; preserve operator's tests in their original positions.
4. Resolve baseline. `--baseline <hash>` enforces the operator's claimed baseline. No `--baseline`: refuse if on-disk `pre_hash` ≠ last patch row's `post_hash` — the operator-hand-edit / crash-mid-write detector. Operators override with `--baseline <hash>`.
5. Simulate via `fast-json-patch::applyPatch` on a deep clone.
6. Schema-validate the candidate via `validateStepSpec` (includes the `blockRef → blocks.delegation` cross-ref check).
7. Compile-test the candidate via `assembly.compile()` (catches future content-lint regressions).
8. Compute `post_hash` and `patch_id`.
9. `--dry-run` / `--validate-only` → print summary, exit 0.
10. **Commit phase** (atomic):

    ```text
    SQL transaction (BEGIN IMMEDIATE — single bun:sqlite handle):
      store.append(prompt.patch.applied event) → returns event_seq
      INSERT INTO prompt_patches (event_seq, ...)
    COMMIT

    Filesystem (after SQL commit):
      appendFileSync(<jsonl>, <line> + '\n')
      writeFileSync(<spec.json>.tmp, canonicalize(<new spec>) + '\n')
      renameSync(<spec.json>.tmp, <spec.json>)
    ```

    The SQL transaction lives on the `EventStore` as
    `appendWithProjection(input, projection)` (Wave C.1.6 R1 /
    Architecture F-1 fix). Both writes share one connection — a
    SIGKILL between them rolls both back rather than leaving an
    orphan event row. The projection callback receives the same
    underlying `Database` handle so it cannot accidentally open a
    second connection that would defeat the atomicity guarantee.

`--allow-no-parent` opts the operator into bootstrapping a fresh chain by synthesizing a genesis line from the on-disk pre-patch spec.

`SQLITE_BUSY` is caught and re-raised with `"another \`gobbi prompt\` invocation holds the write lock; retry"` (Planning routed-resolution).

Cross-session content dedup: re-running the same patch from a second session hits the events idempotency key, surfaces a `"patch already applied (originating session: <sid>)"` message, and exits 0 without writing a duplicate row.

### 3.3 `gobbi prompt rebuild <prompt-id>` (Wave C.1.7)

Recovery command. Folds the JSONL chain via `lib/prompt-evolution.ts::foldChain`, validates the rebuilt spec via `validateStepSpec`, and writes the result via temp+rename. Pure recovery — does NOT mutate `prompt_patches` or `events`. The SQLite tables are the truth; this command makes the on-disk `spec.json` reflect them.

Two recovery cases:
1. Crash-mid-write — SQL committed, JSONL appended, but SIGKILL fired before the spec.json write.
2. Operator hand-edit — someone edited spec.json directly. Detected by the same `pre_hash != last patch row's post_hash` check in `gobbi prompt patch`.

Refuses to write if the chain produces a schema-invalid spec (a corrupted intermediate patch); emits a diagnostic naming the offending patchId.

---

## 4. The replay-equivalence CI gate

The strongest invariant of the prompts-as-data system: `contentHash(foldChain(<jsonl>)) === contentHash(<on-disk spec.json>)` for every chain that exists.

The CI test at `specs/__tests__/replay-equivalence.test.ts` enforces this for every prompt-id whose JSONL chain exists. When the chain is missing (a fresh repo, no patches applied), the test passes vacuously — the on-disk spec.json IS the baseline.

Drift detection makes both failure modes visible:
- JSONL corruption (a row's declared `postHash` disagrees with the computed one) — `foldChain` throws with the line number.
- spec.json hand-edit (the on-disk file diverges from the chain) — the test fails with both hashes printed.

---

## 5. What's NOT in scope for Wave C.1

Deferred items (synthesis §11):

- Multi-spec atomic patch sets (cross-step renames). Operator handles via N independent patches today.
- Content-addressable schema id (`v1#sha256-<digest>`). Useful when v1 → v2 migration arrives.
- Typed-DSL author-time layer (TS function → RFC 6902). Ergonomic but orthogonal to correctness.
- Bundled `dist/` semantics — patches apply to repo source; rebuild to pick up in installed CLI.
- `gobbi prompt verify` consistency checker — detects orphan JSONL entries, hash mismatches.
- `gobbi prompt log <prompt-id>` history view — `(prompt_id, seq)` index makes this trivial later.
- RFC 6902 round-trip property test — recommended hardening; not yet required.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | How step specs drive state transitions in the six-step workflow. |
| `token-budget-and-cache.md` | How spec-driven compilation preserves cache-prefix stability. |
| `just-in-time-prompt-injection.md` | How compiled prompts reach the orchestrator at the moment of need. |
| `cli-as-runtime-api.md` | The CLI surface that reads specs and compiles them. |
| `orchestration/README.md` | The L0-L3 layering, state.db / gobbi.db partition, JIT framing. |
