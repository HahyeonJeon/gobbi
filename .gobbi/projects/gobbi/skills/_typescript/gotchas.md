# Gotcha: _typescript

TypeScript-flag interactions, JSDoc parser traps, event-store seeding shapes, codegen lifecycle, `bun:sqlite` generic contracts, and empty-object typing misconceptions. Load alongside `_typescript/SKILL.md` before writing or reviewing any `packages/cli/src/**/*.ts` file.

---

### `fc.option(arb, { nil: undefined })` produces `T | undefined` that `exactOptionalPropertyTypes` rejects

---
priority: medium
tech-stack: typescript, fast-check
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR E.7 executor (2026-04-18) generated partial `ProjectConfigInput` values for the `loadProjectConfig` default-completeness property using `fc.option(arb, { nil: undefined })`. `fc.option(x, { nil: undefined })` produces `T | undefined` by design. Under `exactOptionalPropertyTypes: true`, interfaces with optional fields declared `field?: T` (no explicit `| undefined`) reject values where the field is present and set to `undefined` — the TS contract requires the key to be absent, not the value to be `undefined`. Type-narrowing + the typed cast into `ProjectConfigInput` failed until the generated values had `undefined` keys stripped.

**User feedback:** Self-caught by the E.7 executor during property-test authoring; recorded in `.claude/project/gobbi/gotchas/test-tooling.md`.

**Correct approach:** Wrap every `fc.option` generator with a recursive `stripUndefined` map step before the value reaches the subject under test. The helper walks the generated record and removes keys whose values are `undefined` — the resulting object preserves the "field absent" coverage `fc.option` was originally chosen to produce, but no key is ever explicitly set to `undefined`, so EOPT accepts the cast into the target interface. The canonical implementation and a working call site are in `packages/cli/src/specs/__tests__/properties.test.ts` — read the `stripUndefined` function body at `:625-639` and the application point at `:685` where the stripped value is cast into `ProjectConfigInput`. Copy from that file when authoring new property tests rather than reconstructing the wrap from the briefing's prose.

The same trap appears with manual spreads: the conditional-spread idiom that writes the key unconditionally emits a present-`undefined` value and is rejected by EOPT for the same reason. Build the target object by spreading the base first and then assigning the optional field only when the value is defined, or by inline-conditional-spreading a `{ field: value }` fragment versus an empty object. The rule generalises to any arbitrary feeding an interface with `field?: T` optionals.

When the interface *deliberately* admits `undefined` — e.g., `AppendInputBase` at `packages/cli/src/workflow/store.ts:40-47` declares fields typed `string | null | undefined` explicitly — the `stripUndefined` wrap is not needed; the explicit `| undefined` makes EOPT accept the present-but-undefined case. Decide which contract the interface expresses before writing the generator. Absent key, present-`undefined`, and present-value are three distinct states; the interface signals which are legal.

---

### Literal `*/` inside a JSDoc body terminates the block early

---
priority: medium
tech-stack: typescript, docblock
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR C Wave 6 executor (C.5 `gobbi workflow guard` command) embedded a file path containing the literal sequence `*/` inside a JSDoc block. TypeScript interpreted the first `*/` as the end of the docblock and started parsing the remainder as code, producing a cascade of `TS1127` (invalid character) and `TS1443` (unterminated block comment) errors pointing at lines far from the true cause. The error messages did not name the offending `*/` sequence, so the root cause was non-obvious and required manual grep of the preceding docblock.

**User feedback:** Surfaced in the Wave 6 execution report; flagged by the overall-perspective PR C evaluator as an unrecorded gotcha. Captured in `.claude/project/gobbi/gotchas/code-edits.md`.

**Correct approach:** Never write a literal `*/` inside the body of a JSDoc / block comment (`/** ... */` or `/* ... */`). Substitutes when the sequence is unavoidable:

- Split the characters with a zero-width escape: `*\/` (TypeScript accepts the backslash; the rendered doc reads as `*/`).
- Rephrase the prose — cite the reference descriptively without quoting the exact path containing `*/` (e.g. `research.md §Wave 6` instead of the glob-style path).
- Move the literal into a regular `//` line comment, which has no terminator semantics.
- If it must appear inside a code sample in the docblock, escape the slash the same way (`*\/`).

When `TS1127` / `TS1443` fires on a line that looks syntactically fine, `rg -n '\*/' <file>` for every occurrence inside the preceding JSDoc body — the first one inside a docblock is the culprit. The failure mode is always "error reported far from cause"; the diagnostic is always "scan the preceding docblock."

This matters disproportionately in the gobbi codebase because the project convention is dense JSDoc — every exported symbol carries a multi-paragraph docblock, every module has a top-of-file block explaining scope and cross-references. The density means any author writing a docblock is at risk of including a path, URL, or code sample that contains `*/`. The pattern to internalise: when referencing a path or glob in a docblock, prefer descriptive citation (e.g., `specs/__tests__/properties.test.ts §stripUndefined`) over embedding a raw `*/`-containing literal. See the `_claude` writing rules on path formatting and `@see` cross-references — the convention makes the trap avoidable in practice.

---

### `store.append` takes `AppendInput`, not `(event, { kind })` positional args

---
priority: medium
tech-stack: typescript, bun-sqlite, event-store
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR D.4 executor, seeding events for `compileResumePrompt` snapshot fixtures, initially wrote `store.append(createResume({...}), { kind: 'system' })` — mirroring the briefing's prose description of "idempotency kind `system`". The actual `EventStore.append` signature is `(input: AppendInput): EventRow | null` where `AppendInput` is a full discriminated union of `AppendInputToolCall | AppendInputSystem | AppendInputCounter` (see `packages/cli/src/workflow/store.ts:51-87`). The two-argument form does not exist on the public surface. Typecheck caught the mismatch, but the executor had to re-read `store.ts` + the `errors.test.ts` seeding helpers before writing the correct fixture.

**User feedback:** Self-caught via typecheck; flagged in `.claude/project/gobbi/gotchas/code-edits.md` so future executors skip the re-read round.

**Correct approach:** For test fixtures that seed the event store directly, construct the full `AppendInput` shape with all required fields for the chosen discriminant: `ts`, `type`, `step`, `data`, `actor`, `parent_seq`, `idempotencyKind`, `sessionId`, plus `toolCallId` (kind `'tool-call'`) or `counter` (kind `'counter'`). Canonical seeders at `packages/cli/src/specs/__tests__/errors.test.ts` and `packages/cli/src/workflow/__tests__/store.test.ts` show the full struct.

The factory functions from `workflow/events/*.ts` (`createResume`, `createStepTimeout`, etc.) return a `{ type, data }` pair suitable for `appendEventAndUpdateState(store, state, event, ...)` — the engine-level wrapper that handles idempotency + state derivation in one call. For raw `store.append`, use the full input struct; factory output is not enough. Briefings that say "append event X with idempotency kind system" mean the `AppendInput.idempotencyKind: 'system'` field, not a second positional argument.

The discriminated-union shape at `store.ts:51-87` uses `toolCallId?: never` / `counter?: never` markers to force mutual exclusivity — TypeScript rejects a `kind: 'system'` input that carries a `toolCallId`, and requires `counter` when `kind === 'counter'`. The shape is deliberate; satisfy it by constructing the input for the chosen discriminant, not by casting.

The project gotcha file at `.claude/project/gobbi/gotchas/code-edits.md` contains a fully-worked example of the correct `store.append` call shape. When writing a new seeder, copy from `specs/__tests__/errors.test.ts` or `workflow/__tests__/store.test.ts` rather than reconstructing the call from the briefing's prose. The two test files are the canonical reference for all three variants (`tool-call`, `system`, `counter`).

---

### `predicates.generated.ts` staleness — `tsc` on a fresh worktree fails loudly with a confusing error

---
priority: low
tech-stack: typescript, codegen, bun
enforcement: advisory
---

**Priority:** Low

**What happened:** Adding a `"condition": "newPredicate"` in a `spec.json` or `*.overlay.json` without running `bun run gen:predicates` leaves `PredicateName` in `packages/cli/src/workflow/predicates.generated.ts` without the new name. The `defaultPredicates satisfies Record<PredicateName, Predicate>` gate at `workflow/predicates.ts:246` still compiles against the stale union — but the runtime predicate reference is now unrecognised. The failure mode flips when CI (or a colleague) runs a fresh build: `prebuild` / `pretypecheck` hooks in `packages/cli/package.json:18,20` regenerate the file, the union gains the new name, and `tsc` fails because `defaultPredicates` is missing the implementation. The error points at the registry declaration, not at the spec edit that introduced the reference. Same failure mode appears in a fresh worktree where `dist/` and generated files do not exist until after `bun install` + `bun run build`.

**User feedback:** Predicted gotcha grounded in the `prebuild` / `pretypecheck` script configuration in `packages/cli/package.json:17-20`. No user incident yet, but the failure shape is stated explicitly in the generated-file docblock at `predicates.generated.ts:1-16`. The `pretypecheck` hook is the specific line that makes `bun run typecheck` safe even without an explicit generator invocation.

**Correct approach:** After any spec/overlay/graph edit that adds a predicate reference, run `bun run gen:predicates` (or `bun run build`, which invokes it as `prebuild`). The `pretypecheck` hook means `bun run typecheck` regenerates automatically; `tsc --noEmit` invoked directly does not. In fresh worktrees, always `bun install` first — the `prebuild` hook fires on build, not on checkout. Editing `predicates.generated.ts` by hand is a bug — the next build overwrites the edit; treat `*.generated.ts` files as read-only artifacts.

If the typecheck fails with "property 'newPredicate' is missing in type 'typeof defaultPredicates'" or similar, the regenerated union exposes a gap: register the predicate in `workflow/predicates.ts::defaultPredicates`. If the failure is "type 'string' is not assignable to type 'PredicateName'", the spec edit added a reference the generator has not picked up — run the generator.

Related worktree gotcha: `packages/cli/dist/` is gitignored (per `.claude/project/gobbi/gotchas/test-tooling.md`). Fresh worktrees that try to run the CLI shim `./packages/cli/bin/gobbi.js` without first running `bun run build` fail with a "cannot find module" error. The same root cause — generated/built artifacts are not tracked in git — affects any test that invokes the CLI via the bin shim. Either `bun run build` explicitly, or test via the source form (`bun run packages/cli/src/cli.ts ...`) which bypasses the dist requirement.

`bun test` runs against source files and does not require `bun run build`; `tsc --noEmit` requires only that `predicates.generated.ts` exists (which `pretypecheck` hook provides). Live CLI invocation via the shim requires `dist/`. Three different invocation paths, three different preconditions — factor this into task briefings that ask executors to run any of them in a fresh worktree.

---

### `bun:sqlite` `db.query<Row, [Bindings]>` two-parameter generic — wrong shape silently defaults to `any`

---
priority: medium
tech-stack: typescript, bun-sqlite
enforcement: advisory
---

**Priority:** Medium

**What happened:** `db.query<Row, Bindings>(SQL)` in `bun:sqlite` takes TWO generic parameters: the row shape and the bindings tuple. The call sites in `packages/cli/src/lib/config-store.ts:180-188` and `packages/cli/src/workflow/store.ts:281-293` use the pattern `this.db.query<SessionRow, [SqlBindings]>(SQL)`. Getting the tuple shape wrong — passing `<SessionRow, SqlBindings>` without the outer tuple brackets, or omitting the second parameter entirely — causes TypeScript to fall back to the generic default, which silently accepts any binding shape at call sites. Runtime errors (ON CONFLICT mismatches, missing parameters) then surface in tests rather than at authoring time.

A second trap: with `strict: true` in the `bun:sqlite` `Database` constructor (see `packages/cli/src/workflow/store.ts:273` for the pattern), bun binds named parameters WITHOUT the `$` prefix. If the TS `Bindings` type declares `$ts` as a key but the runtime call passes an object with a bare `ts` key, either the static type or the runtime dispatch fails depending on how the call is written. The codebase resolves this by typing named-bind parameters as `SqlBindings = Record<string, string | number | bigint | boolean | null>` (`workflow/store.ts:93`) — an index signature that sidesteps per-statement param tuples.

**User feedback:** Predicted gotcha anchored in `workflow/store.ts:281-293` + `config-store.ts:180-188` call-site patterns. No user incident yet; the pattern is stable because the `SqlBindings` index signature is the idiomatic shape. The same two-generic shape applies in both `config-store.ts` (session + metadata tables) and `workflow/store.ts` (events table), so agents adding new tables follow the established pattern.

**Correct approach:** For cached prepared statements, always pass both generic parameters: `db.query<RowType, [SqlBindings]>(SQL)` for parameterised queries, `db.query<RowType, []>(SQL)` for queries with no bindings. Reuse the `SqlBindings` index-signature type at `workflow/store.ts:93` rather than inventing per-statement binding shapes — the index signature accepts any named-binding object without widening `RowType`. When positional-tuple bindings are unavoidable, double-check the bindings tuple against the `strict: true` constructor option's prefix behaviour.

Concretely: if the runtime call is `stmt.all({ ts: '2026-01-01', type: 'X' })` (bare keys), the TS bindings type must be `Record<string, ...>`, not `{ $ts: string; $type: string }`. `SqlBindings` in `workflow/store.ts:93` is already typed as `Record<string, string | number | bigint | boolean | null>` — reuse that. Named binding values must be JSON-compatible scalar types; objects and arrays are rejected by bun:sqlite at runtime.

Related Bun runtime mechanics (WAL mode, `strict: true` constructor option semantics, `.immediate()` transactions, ON CONFLICT / RETURNING behavior) belong to `_bun`; the TypeScript contract (generic arity, index-signature binding shape, row typing at the cached-statement level) lives here. Cross-reference with `_bun/gotchas.md` if a Bun-runtime-level subtlety is involved.

---

### `{}` means "any non-null value," not "an empty object" — use `Record<string, never>`

---
priority: low
tech-stack: typescript
enforcement: advisory
---

**Priority:** Low

**What happened:** An executor declares a "payload that should be empty" using the type `{}`, assuming it means "an object with no properties." TypeScript widens `{}` to "any non-nullish value" — `string`, `number`, `true`, arrays, functions, and objects all satisfy the `{}` constraint. The consequence: `FinishData = {}` would accept `'hello'` or `42` as a valid payload, breaking JSON-stringification assumptions at the event-store boundary. The canonical codebase fix is at `packages/cli/src/workflow/events/workflow.ts:73` — `export type FinishData = Record<string, never>` — which actually denotes "a plain object with no properties."

This is a long-standing TypeScript footgun rooted in structural typing: a value satisfies `{}` if it has none of the fields `{}` requires — which is every non-null value. `Record<string, never>` explicitly constrains the object to have no string-keyed properties, which is the "empty object" semantic most authors expect.

**User feedback:** Common misconception; no specific gobbi incident but the codebase's choice of `Record<string, never>` at `workflow/events/workflow.ts:73` is the canonical counter-pattern. The comment pattern in event-category files does not explain why — the skill does.

**Correct approach:** When declaring a payload that carries no fields, use `Record<string, never>`. When declaring "any object-shaped value but I do not know its fields," use `Record<string, unknown>` and narrow with `isRecord` from `packages/cli/src/lib/guards.ts`. Reserve `{}` for the rare intentional "any non-null value" case — in practice, that case is almost always better served by `unknown` plus a guard. `unknown` is the principled choice for "I do not know what shape this has yet"; `Record<string, never>` is the principled choice for "I am promising no fields are present."

The rule composes with the "JSON-safe payload types" convention for event data: every event-data interface is a `Record<string, never>` (no fields), a per-event `interface` with explicit `readonly` fields, or declared `Record<string, unknown>` + validated at the boundary. Do not reach for `{}` in any of these positions.

A subtlety worth naming: ESLint / TypeScript-ESLint ships a rule `@typescript-eslint/no-empty-object-type` that flags `{}` precisely because of this footgun. The rule is not enabled in this project today, but its existence reinforces the principle: the type-checker community has consensus that `{}` is rarely what authors mean. When reviewing a PR that introduces `{}`, ask the author whether they want `Record<string, never>` or `unknown` — one of the two almost always matches the author's intent more precisely.

One case where `{}` reads as intended: `extends {}` on a generic parameter constraint is idiomatic for "any non-null value" and the meaning is exactly that. Outside generic constraints, the type rarely expresses the author's intent — check before accepting it in review.
