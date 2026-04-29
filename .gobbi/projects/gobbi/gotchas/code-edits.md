# Project Gotchas: Code Edits

Project-specific gotchas for editing code in the gobbi CLI (TypeScript + bun).

---

### JSDoc `*/` inside docblock content terminates the block early
---
priority: medium
tech-stack: typescript, docblock
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR C Wave 6 executor (C.5 `gobbi workflow guard` command) embedded a file path containing the literal sequence `*/` inside a JSDoc block — for example a reference such as `* .claude/project/gobbi/note/20260416-2225-.../research/research.md` when the path or a URL actually included `*/`, or a sample docstring that itself contained the characters. TypeScript interpreted the first `*/` as the end of the docblock and started parsing the remainder as code, producing a cascade of `TS1127` (invalid character) and `TS1443` (unterminated block comment) errors pointing at lines far from the true cause. The error messages did not name the offending `*/` sequence, so the root cause was non-obvious.

**User feedback:** Surfaced in the Wave 6 execution report; flagged by the overall-perspective PR C evaluator (m1) as an unrecorded gotcha that should be captured so future executors skip the debugging round.

**Correct approach:** Never write a literal `*/` inside the body of a JSDoc / block comment (`/** ... */` or `/* ... */`). Substitutes when the sequence is unavoidable:

- Split the characters with a zero-width escape: `*\/` (TypeScript accepts the backslash; the rendered doc reads as `*/`).
- Rephrase the prose — cite the reference descriptively without quoting the exact path containing `*/` (e.g. `research.md §Wave 6` instead of the glob-style path).
- Move the literal into a regular `//` line comment, which has no terminator semantics.
- If it must appear in a code sample inside the docblock, wrap the sample in a template-literal fenced block and escape the slash the same way (`*\/`).

When `TS1127` / `TS1443` fires on a line that looks syntactically fine, `grep -n '\*/' <file>` for every occurrence inside the preceding JSDoc and inspect each — the first one inside a docblock body is the culprit.

---

### `store.append` takes a full `AppendInput`, not `(WorkflowEvent, {kind: ...})`
---
priority: medium
tech-stack: typescript, bun-sqlite, event-store
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR D.4 executor, when seeding events for `compileResumePrompt` snapshot fixtures, initially wrote `store.append(createResume({...}), { kind: 'system' })` — mirroring the briefing's prose description of "idempotency kind `system`". The actual `EventStore.append` signature is `(input: AppendInput): EventRow | null` where `AppendInput` is a full discriminated union: `{ ts, type, step, data, actor, parent_seq, idempotencyKind, toolCallId | counter, sessionId }`. The two-argument form does not exist on the public surface. Typecheck caught the mismatch, but the executor had to re-read `store.ts` + the `errors.test.ts` seeding helpers before writing the correct fixture.

**User feedback:** Self-caught via typecheck; flagged for memory so future executors seeding event-store fixtures skip the re-read round.

**Correct approach:** For test fixtures that seed the event store directly, use the full `AppendInput` shape:

```ts
store.append({
  ts: '2026-01-01T00:05:00.000Z',
  type: WORKFLOW_EVENTS.STEP_TIMEOUT,
  step: 'execution',
  data: JSON.stringify({ step: 'execution', elapsedMs: 300_000, configuredTimeoutMs: 120_000 }),
  actor: 'hook',
  parent_seq: null,
  idempotencyKind: 'tool-call',
  toolCallId: 'tc-timeout',
  sessionId: 'my-session-id',
});
```

The factory functions from `workflow/events/*.ts` (`createResume`, `createStepTimeout`, etc.) return a `{ type, data }` pair suitable for `appendEventAndUpdateState(store, state, event)` — the engine-level wrapper that handles idempotency + state derivation in one call. For raw `store.append`, use the full input struct; existing seeders in `specs/__tests__/errors.test.ts` and `workflow/__tests__/store.test.ts` are the canonical reference.

Briefings that say "append event X with idempotency kind system" mean the AppendInput's `idempotencyKind: 'system'` field, not a second positional argument to `store.append`.

---

### `Bun.spawn` stdio streams need narrowing before `new Response(...)` — type is `ReadableStream<Uint8Array> | number | undefined`
---
priority: medium
tech-stack: typescript, bun
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 feature-pass-1 P7 executor (GAP-01 `gobbi --is-latest` implementation) wrote `await new Response(child.stdout).text()` expecting `child.stdout` to be a `ReadableStream<Uint8Array>`. TypeScript `tsc --noEmit` rejected with `TS2345: Argument of type 'ReadableStream<Uint8Array> | number | undefined' is not assignable to parameter of type 'BodyInit'`. Bun's `Subprocess.stdout` field is a discriminated union — it can be a `ReadableStream`, a numeric file descriptor (when stdio was overridden with `"inherit"` / `"ignore"` / `number`), or `undefined` (when the stdio option made the field absent).

**User feedback:** Self-caught by P7 executor during typecheck 2026-04-21; no user correction required.

**Correct approach:** Before passing `child.stdout` to `new Response()` or any other `ReadableStream`-consuming API, narrow the type. Pattern used in `packages/cli/src/workflow/verification-scheduler.ts` (`drainToBuffer` helper):

- Check for `undefined` / `number` cases early; bail or throw with a specific error
- Only pass the narrowed `ReadableStream<Uint8Array>` to `new Response(...)` or similar

When a utility reads stdout from a `Bun.spawn` subprocess, either reuse the existing `drainToBuffer` helper if the shape matches, or write a local narrowing helper (~6 lines) that throws when the stdio option makes the stream absent. Do NOT cast with `as ReadableStream<Uint8Array>` — that silently accepts the numeric/undefined cases at runtime and will fail later with a confusing error.

Canonical reference: `packages/cli/src/workflow/verification-scheduler.ts` for the narrowing pattern; `packages/cli/src/lib/version-check.ts` for a fresh example.

---

### AJV `JSONSchemaType<T>` cannot express required-plus-nullable fields
---
priority: medium
tech-stack: typescript, ajv
enforcement: advisory
---

**Priority:** Medium

**What happened:** The gobbi-memory Pass 2 W1.2 executor extended `Settings` with `projects: ProjectsRegistry` where `active: string | null` is required (key present) but the value may be `null`. AJV's strict `JSONSchemaType<ProjectsRegistry>` inference refused to admit `{type: 'string', nullable: true}` on a required field — the derivation pins `nullable?: false` for any field listed in `required`. Making `active?: string | null` optional in TS to get past that in turn made `required: ['active', 'known']` reject the list as "Type '\"active\" | \"known\"' is not assignable to type '\"known\"'". The two shapes (required+nullable and optional+nullable) are mutually exclusive under `JSONSchemaType`'s strict type derivation.

**User feedback:** Self-caught during W1.2 AJV compile; fixed by inlining the projects slot with a narrowed `as unknown as JSONSchemaType<Settings>['properties']['projects']` cast so AJV's runtime validation runs unchanged while TS accepts the shape. The `_schema/v1.ts` subschema pattern uses the same escape — unannotated constants plugged at property positions where the strict inference cannot compose.

**Correct approach:** When an AJV schema needs a required field whose value admits `null`:

1. Keep the TS type shape on the owning interface honest (`active: string | null`, not `active?: string | null`) — the runtime contract is "key is always present."
2. Inline the sub-schema literal at the property position in the top-level `JSONSchemaType<T>` annotation.
3. Cast the inline literal with `as unknown as JSONSchemaType<T>['properties'][key]` — this preserves AJV's own validation behaviour while bypassing the strict-derivation conflict.
4. Document the cast inline so future authors know it is load-bearing and deliberate, not an accidental escape hatch.

Do NOT reach for `as any` or drop the `JSONSchemaType<T>` annotation entirely. The top-level annotation is what gives drift safety — if `Settings.projects` gains a new field, the inline sub-schema fails `tsc --noEmit` at the call-site even through the cast, because the cast target itself is derived from the outer `Settings` type. The `specs/_schema/v1.ts` shared-subschema pattern is the other precedent for this class of workaround; reach for whichever form reads cleaner at the call-site.

Related: `_typescript/SKILL.md` §"Boundary parsing" covers the general AJV binding pattern; this gotcha covers the required-nullable corner case where the strict inference has no way to express the shape without help.
