# Each `ensureSchemaVN` function must stamp the literal version N

When implementing a schema-version migration (`ensureSchemaV5`, `ensureSchemaV6`, `ensureSchemaV7`, etc.), the `INSERT OR REPLACE INTO schema_meta VALUES ('state_db', N, ?)` statement must use the LITERAL integer for that version, not `CURRENT_SCHEMA_VERSION`. Otherwise older ensures advertise newer versions whenever the constant is bumped.

---

priority: medium
tech-stack: bun-sqlite, gobbi-cli
enforcement: advisory
---

**Priority:** Medium

**What happened:** Wave C.1's first executor pass (session `320426b9-2fa2-46c1-8f0b-c83fdef97795`, 2026-04-26) bumped `CURRENT_SCHEMA_VERSION` from 6 to 7 in `migrations.ts:114` for the new `prompt_patches` table. The existing `ensureSchemaV6` function was using `CURRENT_SCHEMA_VERSION` in its `schema_meta` stamp, which now advertised v7 even though `ensureSchemaV6` only created v6 tables. After `ensureSchemaV6` ran on a fresh DB, `schema_meta.schema_version === 7` while only v5+v6 tables existed. The next call to `ensureSchemaV7` would IF-NOT-EXISTS-skip and stamp again at v7 — coincidentally correct, but only because the chain runs sequentially. If any future code path calls `ensureSchemaV6` independently (e.g., a downgrade test, a fixture builder), the schema_meta would lie about what the DB contains.

The executor caught this during integration: tightened `ensureSchemaV6` to stamp the literal `6`, with `ensureSchemaV7` overwriting to `7` inside the same wired chain in `EventStore.initSchema`. Updated one existing test to expect 6 instead of `CURRENT_SCHEMA_VERSION`.

**Why it happens:** Reaching for the constant (`CURRENT_SCHEMA_VERSION`) feels like the right "single source of truth." For the `migrate-state-db` command's overall chain, the constant IS correct — the chain ends at the current version. But for individual `ensureSchemaVN` functions, each one's contract is "this function makes the DB at-least-v{N}." Stamping the constant breaks that contract whenever the constant is bumped.

**User feedback:** Self-caught during execution by the C.1 executor. No wave-evaluator finding — the executor reported it as a "surprise" in the post-pass report.

**Correct approach:**

1. **Each `ensureSchemaVN(db, now?)` function stamps the literal `N`** in its `INSERT OR REPLACE INTO schema_meta` statement. Not `CURRENT_SCHEMA_VERSION`, not a parameter — the literal integer.

2. **Tests that assert the post-`ensureSchemaVN` state** check for the literal `N`, not `CURRENT_SCHEMA_VERSION`. This catches cross-pass drift when the constant moves.

3. **The `migrate-state-db` command's chain** still uses `CURRENT_SCHEMA_VERSION` to decide which ensures to call — that's its job. But it relies on each ensure stamping its own literal version; the post-chain `schema_meta` will be the highest literal stamped, which equals `CURRENT_SCHEMA_VERSION` by construction.

4. **Mental model**: `ensureSchemaVN` is a forward-step migration. Its stamp says "I made the DB v{N}." A later `ensureSchemaV{N+1}` says "I made the DB v{N+1}." The chain composes; no individual step lies.

**Reference implementation:** `packages/cli/src/workflow/migrations.ts::ensureSchemaV6`, `ensureSchemaV7` — each stamps its literal version. Test at `migrations.test.ts` (look for `schema_meta.schema_version` assertions).

**Refs:** Wave C.1 executor surprise note (commit `072f68b`); pattern documented at `migrations.ts:558-569` ("partial v7 = recovery problem" rationale for atomic transactions).
