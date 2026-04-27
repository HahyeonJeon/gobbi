---
name: _typescript
description: Use when writing, reviewing, or debugging TypeScript in gobbi-cli — strict-mode discipline, discriminated unions, satisfies/assertNever exhaustiveness gates, AJV boundary parsing, readonly conventions, and codegen-branded types.
allowed-tools: Read, Grep, Glob, Bash
---

# TypeScript

TypeScript language patterns for `packages/cli/src/`. Load when authoring, reviewing, or debugging any `.ts` file in the gobbi CLI — strict-mode flag interactions, discriminated unions, `satisfies`/`assertNever` exhaustiveness, AJV boundary parsing, readonly discipline, and codegen-branded types. Load `_bun` separately for runtime APIs (`bun:test`, `bun:sqlite`, `Bun.spawn`).

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Seeded from real incidents — EOPT interactions, JSDoc terminator, AppendInput shape, codegen drift, bun:sqlite generics, empty-object typing |

---

## Core Principles

> **The Compile-Time Oracle — gobbi uses dense types + structural discipline + codegen to make whole classes of mistakes impossible to commit.**

The codebase treats `tsc --noEmit` as a model-checker. Every branching decision the runtime makes also exists as a compile-time graph. Every external JSON boundary has a validator that produces a typed value. Every runtime registry that structural types cannot reach gets a codegen step that turns the invariant into a string-literal union. The five principles below are how the oracle is maintained.

> **Types are the first compiler pass. Make wrong programs fail at compile, not at runtime.**

TypeScript's job in this codebase is to reject programs the reducer cannot reduce, the dispatcher cannot dispatch, and the schema cannot validate. That means writing types precise enough to close the gap between "compiles" and "runs correctly." Widening a type to silence an error — `as any`, a bare `as`, a non-null `!` where narrowing would work — gives up the leverage tsc provides. Effective TypeScript item 5 ("Limit use of the `any` type") and item 35 ("Prefer more precise alternatives") are the authoritative treatments. The codebase's strict-mode triad (`packages/cli/tsconfig.json`) is the operational expression of this principle.

A concrete rule follows: a narrow type is always better than a wide one when both are accurate. A string literal union is narrower than `string`; a discriminated union is narrower than an unstructured record; a `readonly` field is narrower than a mutable one. The compiler catches the errors it can see; every widening reduces the error surface it can catch.

> **Typed-graph dispatch: every branching lookup is `satisfies Record<K,V>` with an `assertNever` tail.**

Dispatchers — command routers, reducers, predicate registries, pathway visitors — are encoded as static graphs the compiler walks. The pattern has three moves: the variant set is a discriminated union keyed on `type`/`kind`, the handler table is declared `as const satisfies Record<Key, Handler>`, and any terminal switch ends with `assertNever(value: never)`. Adding a variant without wiring its handler fails at compile time, never at 2am in a user's workflow. The canonical sites are `packages/cli/src/cli.ts` §`COMMANDS_BY_NAME` (command registry), `packages/cli/src/workflow/predicates.ts` §`defaultPredicates` (predicate registry), `packages/cli/src/workflow/guards.ts` §`GUARDS` (guard tuple), and `packages/cli/src/workflow/reducer.ts` (seven `assertNever` sites across sub-reducers).

Dispatch shape varies with the problem. Three shapes appear in this codebase: category-union + two-level switch (`reducer.ts`), flat record registry (`predicates.ts` — no switch, call sites look up and invoke), and mapped-type visitor (`specs/errors.ts::visitPathway`). The skill does not prescribe one shape — it names the criteria (variant count, variant stability, handler interchangeability, caller locality) and lets the codebase's three examples illustrate the spectrum.

> **Parse at the boundary, trust within. Inside the parse seam no `unknown`, no `as`.**

External JSON — `spec.json`, `state.json`, SQLite rows, hook payloads — is `unknown` until a validator produces a typed value. Inside, code reaches through `readonly` fields without casts. The codebase has three validator shapes: `ajv` bound to `JSONSchemaType<T>` for schema-ed JSON (see `packages/cli/src/specs/_schema/v1.ts:1-53`), hand-written `value is T` guards for self-contained structures (e.g., `isValidState` in `workflow/state.ts`), and the primitive-guard library `packages/cli/src/lib/guards.ts` (`isRecord`, `isString`, `isNumber`, `isBoolean`, `isArray`) composed at narrowing sites. `JSON.parse(raw) as Foo` lies to every downstream consumer — the boundary is the one place the lie becomes load-bearing.

This is Alexis King's "Parse, don't validate" applied at a repo-wide scale, but the gobbi-specific move is *where the line is drawn*: the boundary is not a single `parse()` function, it is a disciplined seam of JSON Schema + ajv + hand-rolled guards + structural interfaces, chosen per kind of external input. Inside the seam, every consumer can rely on types without runtime checks.

> **Brand what structural types cannot express; codegen is a legitimate escape hatch.**

Some invariants are real but unreachable from hand-written types — "this predicate name is registered," "this block-ref keys into `blocks.delegation`," "this tuple sums to 1.0." For the closed-set-of-names class, the codebase generates a string-literal union from disk: `packages/cli/scripts/gen-predicate-names.ts` walks every `spec.json`, `index.json`, and `*.overlay.json` under `src/specs/` and emits `PredicateName` into `packages/cli/src/workflow/predicates.generated.ts`. The default registry is typed `satisfies Record<PredicateName, Predicate>`; a missing implementation is a typecheck error. This is a lightweight branded-type pattern where the brand is generated rather than hand-maintained. Criteria for "codegen is justified" appear in the Codegen section below.

> **`readonly` is the default, not the exception.**

Every field on every workflow type is `readonly`. Every collection is `readonly T[]`, `ReadonlySet<T>`, or `Readonly<Record<K, V>>`. The reducer is pure; the event store's replay assumes events never mutate; derived state crosses module boundaries without defensive copies. A reducer that wrote `state.completedSteps.push(next)` fails to compile because the field is `readonly string[]`. The fix everywhere: `{ ...state, completedSteps: [...state.completedSteps, next] }`. See `packages/cli/src/specs/types.ts:25-33` for the codebase's stated philosophy. When authoring a new interface, reach for `readonly` first and remove it only with explicit justification — the default favors safety.

---

## Strict-mode stance

`packages/cli/tsconfig.json` activates `strict: true`, `noUncheckedIndexedAccess: true`, and `exactOptionalPropertyTypes: true` — the strictest usable tier without cosmetic-only flags. Treat the tsconfig as source of truth; do not list the umbrella's sub-flags in docs that will drift. The TypeScript handbook's tsconfig `strict`-family docs at typescriptlang.org/tsconfig are the authoritative reference; read them once, then rely on the compiler.

The three flags that shape day-to-day code are:

- **`strict: true`** — the umbrella. The rule to internalise: `catch (err)` narrows `err` as `unknown`. Every catch block needs `err instanceof Error` or equivalent before reading `err.message`. The codebase answers this with dedicated error classes carrying stable literal `.code` fields, so catch paths dispatch on the class, not on message strings. Effective TypeScript item 5 ("Limit use of the `any` type") is the background treatment.
- **`noUncheckedIndexedAccess: true`** — `arr[i]` returns `T | undefined`, `record[k]` returns `V | undefined`. The response is to narrow (`??`, `if (x !== undefined)`) rather than to silence with `!`. If the invariant "this index is in range" is real, the code should prove it by length-checking; if it is merely assumed, the assumption is a bug. The idiomatic shape in the codebase is `parts[parts.length - 1] ?? fallback` — the nullish coalesce proves the fallback is considered.
- **`exactOptionalPropertyTypes: true`** — `field?: T` rejects `{ field: undefined }`. The contract is "the key is absent," not "the value is undefined." This is the source of the most agent-facing friction in this codebase and appears twice in the seed gotchas. When writing an optional field, decide explicitly: `field?: T` (key may be absent) or `field: T | undefined` (key present, value may be undefined) — they are not equivalent. `packages/cli/src/workflow/store.ts:40-47` (`AppendInputBase`) intentionally admits `string | null | undefined` and normalises centrally.

`verbatimModuleSyntax` and `moduleDetection` are not enabled. The codebase uses `import type` by convention, not compiler enforcement — stating otherwise invites drift. `skipLibCheck: true` and `forceConsistentCasingInFileNames: true` are pragmatic defaults; `types: ['bun-types']` makes `bun:*` module types implicit without per-file imports.

The interaction with `exactOptionalPropertyTypes` deserves one more line of attention: a library typing `callback?: (x: T) => void` with this flag enabled rejects callers that pass `callback: undefined`. When a consumer accepts values from generic callers (overlays, config objects, library adapters), declare the field explicitly as `field?: T | undefined` to widen the contract — the extra `| undefined` is deliberate, not accidental. `AppendInputBase` in `workflow/store.ts:40-47` is the canonical example of deliberate admission.

---

## Discriminated unions the gobbi way

Every event-category module under `packages/cli/src/workflow/events/` encodes its variants through a fixed compile-time layout: a single-source-of-truth `as const` constant object drives a derived category union, a runtime guard Set built from that object's *values* (not keys), per-event `readonly` payload interfaces, the discriminated union itself, a type-predicate guard, and factory functions. The layout's whole point is that adding an event variant fails at compile time if any link in the chain is missed — the compiler walks from the const object to the guard to the union to the factory, and every new entry must thread through all of them. Read `packages/cli/src/workflow/events/workflow.ts:17-173` for the canonical reference; the section-header comments name each part explicitly so readers scanning the file see the structure without reading the bodies. New event-category modules must follow that file's shape; the pattern is documented there and nowhere else.

One non-obvious trap in the layout deserves calling out: the runtime guard Set is built from `Object.values(EVENTS)`, not keys. The comment at `workflow.ts:34` ("Set for type guard — values, NOT keys") exists because `'workflow.start' in WORKFLOW_EVENTS` returns `false` (the keys are `START`, `FINISH` — the *values* are the event-type strings). An agent that reaches for `in` on the const object gets a silently-wrong runtime check with no compile error. The `Set.has(string)` pattern is load-bearing; do not substitute `in`.

Effective TypeScript item 26 ("Understand how context is used in type inference") explains why `as const` on the object literal preserves the literal strings rather than widening to `string` — without it, the derived category union degrades to `string` and the discriminated union stops discriminating.

JSON-safe payloads: event data interfaces carry only primitives, primitive arrays, and plain records of primitives. No `Date`, no `Map`, no `Set`, no class instances. The constraint exists because events round-trip through `JSON.stringify` / `JSON.parse` at the event-store boundary — any non-JSON-representable value silently mutates on replay. `packages/cli/src/specs/errors.ts` contains the current authoritative note on this.

---

## `satisfies Record<K, V>` as exhaustiveness gate

`as const satisfies Record<Key, Value>` pins a literal's precise inferred type while proving it conforms to a wider contract. The `satisfies` operator (TS 4.9+) is strictly stronger than a plain type annotation: the value keeps its narrow inferred type, but the compiler also checks it against the contract. A missing key fails "property is required"; an extra key fails "excess property." Three load-bearing sites in the codebase:

- `packages/cli/src/cli.ts:120` — `COMMANDS_BY_NAME as const satisfies Record<CommandName, CommandDef>`. `CommandName` is derived via `typeof COMMAND_ORDER[number]` at `cli.ts:95` from a `readonly` tuple at `cli.ts:85-93`. The two halves cross-check: add to the tuple and miss the map, or add to the map and miss the tuple — either way, `tsc` fails. The tuple controls `--help` ordering; the map supplies the dispatcher. One source of truth for the key set, enforced at two sites.
- `packages/cli/src/workflow/predicates.ts:246` — `defaultPredicates ... as const satisfies Record<PredicateName, Predicate>`. `PredicateName` is codegen (see Codegen section), so adding a spec reference without registering the predicate fails to compile. The gate closes a runtime invariant that structural types cannot express.
- `packages/cli/src/workflow/guards.ts:117` — `GUARDS = [] as const satisfies readonly Guard[]`. The empty guard list is typed as a tuple so future entries inherit shape, predicate-name constraints, and the warn-requires-code invariant. Adding a first entry does not require re-typing — the `satisfies` stays, and the tuple widens automatically.

The rule: any time a hand-maintained registry answers "for each X, define Y," type it `satisfies Record<X, Y>` and make the key set come from somewhere the compiler walks (a string-literal union, a const tuple with `typeof T[number]`, or a codegen file). Never hand-duplicate the key set; every duplicate is a future drift. Effective TypeScript item 35 ("Prefer more precise alternatives") is the background treatment — the `satisfies` gate is what "precise" looks like for registries.

---

## Exhaustiveness via `assertNever`

`assertNever(value: never): never` is the tail of every dispatch switch that claims exhaustive coverage. TypeScript narrows `value` to `never` only when every variant has been handled; if a case is missing, `value` retains a residual type and the call fails compilation. A future author who adds a variant gets a typecheck error pointing at the dispatch site, not a silent runtime bug.

The codebase has roughly a dozen `assertNever` call sites — run `rg -n 'assertNever' packages/cli/src/` for the current list. Each sub-reducer in `packages/cli/src/workflow/reducer.ts` ends with one; `packages/cli/src/specs/errors.ts` defines a module-local copy; `packages/cli/src/commands/workflow/guard.ts` and `packages/cli/src/commands/workflow/transition.ts` each have their own. The pattern is local to the module, small, and duplicated — this is deliberate. A central helper would introduce a cross-layer dependency for a four-line function; locality costs nothing and keeps layers clean.

Stronger alternative: the mapped-type visitor at `packages/cli/src/specs/errors.ts:203-207` — `type PathwayVisitor<T> = { readonly [K in ErrorPathwayKind]: (p: Extract<ErrorPathway, {kind:K}>) => T }`. The visitor literal is an object, not a switch; the mapped type requires one handler per variant AND narrows each handler's parameter via `Extract`. Reach for this shape when the union has distant call sites that each need exhaustive handling — an object literal makes the requirement local to every implementation, not just to a central switch. The comment at `errors.ts:192-195` names this as the codebase's first mapped-type visitor and the preferred shape for new visitor-style dispatchers.

The mapped-type visitor gives two compile-time gates for one pattern: (a) a visitor literal missing a key fails because the mapped type requires every key; (b) a residual `switch` inside the handler hitting `assertNever` catches newly-added variants that lack a case. Use both — the redundancy is belt and braces.

---

## Boundary parsing

External JSON enters through three routes, each with a canonical validator shape.

- **Schema-ed JSON files** — `ajv` bound to `JSONSchemaType<T>`. `packages/cli/src/specs/_schema/v1.ts:1-53` documents the drift seam: `types.ts` is the authoritative TS shape, `v1.ts` is the authoritative JSON Schema, and the `JSONSchemaType<StepSpec>` annotation makes divergence fail `tsc --noEmit` before any runtime test. The schema's 53-line docblock explains every non-obvious choice, including the `nullable: true` rule (see `_schema/v1.ts:14-22`) for every TS-optional field — ajv has no first-class "undefined," and models optional keys via `required` omission plus `nullable: true`. This seam keeps static types and runtime validation in sync without a code generator; if `types.ts` gains a required field and `v1.ts` does not, the compiler catches it. The pattern uses `ajv.compile<T>(schema)` which returns a type-predicated validator, so the call site narrows without a cast.
- **Self-contained structures** — hand-written `value is T` guards. `packages/cli/src/workflow/state.ts` exports `isValidState` for `state.json`; `packages/cli/src/workflow/events/workflow.ts:128-130` exports `isWorkflowEvent` for event-type discrimination. Compose these rather than writing a new ad-hoc parser. A guard is `(value: unknown): value is T`, nothing more — the type predicate is load-bearing because it tells the compiler what narrowing occurred.
- **Primitive narrowing** — `packages/cli/src/lib/guards.ts` exports `isRecord`, `isString`, `isNumber`, `isBoolean`, `isArray`. Five guards, four lines each, composed everywhere an `unknown` needs narrowing. Narrow by composition of these primitives, not by `as`. New primitive guards (e.g., `isValidDate`, `isFiniteNumber`) belong in the same file so composition stays local.

Two subtleties specific to this tsconfig's interaction with AJV: optional TS fields require `nullable: true` in the schema binding under `exactOptionalPropertyTypes`, and `JSONSchemaType<T>` forbids `$ref` at `additionalProperties` positions (the fix is to inline the shared subschema constant at such positions — see `_schema/v1.ts:22-32` for the documented convention). A third rule the project has internalised: do NOT use AJV's `useDefaults` for nested config shapes. AJV issue #1710 makes nested-defaults hydration unreliable; apply TS-side defaults via `deepMerge` after validation succeeds. `packages/cli/src/lib/settings.ts:301-320` is the current `deepMerge` implementation — a structurally generic merge that returns the base type `T` after applying any overlay record.

Anti-patterns at the boundary: `JSON.parse(raw) as Foo` (lies to every consumer), `const x: Foo = unknownValue` (fails under strict anyway), `catch (err) { log(err.message) }` without narrowing (`err` is `unknown`). When a new external-data seam is needed, add a validator, do not widen the consumer.

A related discipline: when a function needs to return "valid result OR error," prefer a discriminated-union result type over throwing. The workflow reducer uses `{ ok: true, state } | { ok: false, error }` so the caller narrows and handles both branches; `packages/cli/src/workflow/engine.ts`'s `ReducerRejectionError` class carries a stable literal `.code` field so catch paths dispatch on the class rather than string-matching the message. Use `instanceof` on dedicated error classes when exception handling is unavoidable; never grep `err.message`.

---

## Read/write interface splitting

`packages/cli/src/workflow/store.ts:284,308` declares `ReadStore` (nine pure-query methods, line 284) and `WriteStore extends ReadStore` (adds `append`, `transaction`, `close`, line 308). `EventStore` implements the wider interface; call sites declare the narrowest they need. `workflow/engine.ts`, `commands/session.ts`, `commands/workflow/stop.ts`, and `commands/workflow/capture-subagent.ts` all target `ReadStore` where they only query — the typechecker rejects `.append()` calls against those parameters.

`packages/cli/src/workflow/__tests__/store.test.ts` uses `@ts-expect-error` comments (lines 963, 966, 969) to lock the contract: writing `.append()` through a `ReadStore` reference must fail to compile. If a future change widens `ReadStore` by accident and admits a mutator, the test fails at typecheck time — the `@ts-expect-error` now sits over a line that compiles, which itself is an error. This is the codebase's chosen mechanism for making interface narrowing self-auditing.

Compile-time effect tracking with two interfaces, no class hierarchy, no monads, no effect system. Reach for the same pattern whenever a value has a read-only facet and a mutating facet and the same module needs both. Structural subtyping does the work — the concrete class does not name both interfaces in an `implements` list; it implements the wider one and is assignable to the narrower one. See Effective TypeScript item 35 for the more-precise-types principle this instantiates.

---

## Optionality and `exactOptionalPropertyTypes`

`exactOptionalPropertyTypes` turns `field?: T` into a strictly-conditional presence contract. Only `{}` and `{ field: <T-value> }` are legal — `{ field: undefined }` is rejected. The semantics: the key must be absent, not the value `undefined`. This is the codebase's strictest flag and the source of the most agent-facing friction — two of the six seed gotchas address it directly.

Two anti-patterns recur:

- **Conditional spread that emits `undefined`.** `{ ...obj, field: maybe ?? undefined }` unconditionally writes the key — to a value when `maybe` is truthy, to `undefined` otherwise. The fix is an explicit conditional: `const out = { ...obj }; if (maybe !== undefined) out.field = maybe;` or `...(maybe !== undefined ? { field: maybe } : {})`.
- **Property generators that produce `undefined` leaves.** See `gotchas.md` entry on `fc.option`. The `stripUndefined` helper at `packages/cli/src/specs/__tests__/properties.test.ts:625-639` is the reference.

When the interface must admit both "key absent" and "key present with `undefined`" (e.g., to accept values from generic callers), declare the field explicitly: `field?: T | undefined` or `field: T | undefined` depending on whether the key itself can be missing. `packages/cli/src/workflow/store.ts:40-47` (`AppendInputBase`) does this deliberately — `step?: string | null | undefined`, `data?: string | undefined` — and normalises at a single point downstream.

The directive: prefer field-absent over `field: undefined` at every boundary. When a shape must admit `undefined`, say so explicitly and normalise centrally. The flag turns a subtle class of runtime bugs into compile errors; the cost is learning to write conditional spreads correctly and to wrap property-test generators. Both have clear codebase references.

A related rule: when creating a new interface, decide the optionality contract before writing the field. Absent means "use default" (or "this value is not meaningful here"). `undefined` means "caller explicitly set this to nothing." These carry different semantics and should produce different TS shapes — do not reach for `| undefined` reflexively.

---

## Immutability markers

Every field on every workflow type is `readonly`; every collection is `readonly T[]`, `ReadonlySet<T>`, or `Readonly<Record<K, V>>`. The stated philosophy lives in the top-of-file docblock at `packages/cli/src/specs/types.ts:25-33`; `packages/cli/src/specs/types.ts §StepMeta` (starting at line 85) is the first representative interface showing the convention applied field-by-field. Call sites producing new state use spread: `{ ...state, field: newValue }` and `[...arr, next]`. Function parameters that only read the value should accept `readonly T[]` rather than `T[]` — the caller is not blocked by mutability, and the function cannot accidentally mutate the caller's array.

The reducer is a pure function; the event store's replay assumes events never mutate post-persistence; derived state crosses module boundaries without defensive copies. The invariant means TypeScript catches accidental mutation at compile time — a reducer that wrote `state.completedSteps.push(next)` fails to compile because `completedSteps: readonly string[]` does not expose `push`. The fix pattern everywhere: `{ ...state, completedSteps: [...state.completedSteps, next] }`. Other places the pattern reaches: `ReadonlySet<WorkflowStep>` at `packages/cli/src/workflow/state.ts:57,78` for `ACTIVE_STEPS`; `Readonly<Record<string, readonly string[]>>` for `artifacts`; every event-data interface.

Three conventions worth naming:

- `readonly T[]` and `ReadonlyArray<T>` are the same type. Prefer `readonly T[]` where it reads cleanly; reach for `ReadonlyArray<T>` only when generic composition makes the former awkward.
- `as const` on literal fixtures propagates `readonly` depth — a tuple with `as const` has `readonly` on every element, not just the outer array. Use it for test fixtures and event-type strings; the codebase's `as const` objects (see `workflow/events/workflow.ts:21-31`) illustrate the pattern.
- Narrow from the read-only form to a structural supertype (e.g. `ACTIVE_STEPS as ReadonlySet<string>`) when the caller needs to ask `.has(someString)` — the cast stays inside the module defining the Set, never at call sites.

For empty-payload events, use `Record<string, never>` rather than `{}`. `packages/cli/src/workflow/events/workflow.ts:73` (`type FinishData = Record<string, never>`) is the canonical example. `{}` in TypeScript means "any non-null value," not "an empty object" — see the seed gotcha.

---

## Codegen for runtime-only invariants

Codegen is the escape hatch when an invariant is real but unreachable from hand-written types. Codegen is justified when four conditions hold. `predicates.generated.ts` is the codebase's only current example, and it meets all four:

- **Closed set of names from a discoverable source.** The generator walks `packages/cli/src/specs/**/*.json` — a finite, machine-readable set.
- **Invariant is load-bearing at compile time.** A missing predicate registration is a real bug the compiler can catch via `satisfies Record<PredicateName, Predicate>`.
- **Regeneration is fast and automated.** `packages/cli/package.json` registers `gen:predicates` as `prebuild` and `pretypecheck`, so `bun run build` and `bun run typecheck` regenerate before consuming the file.
- **No pure structural type suffices.** `keyof typeof CONST_OBJECT` and const-tuple-with-`typeof T[number]` both require the key set to live in one file — codegen is needed when the keys are scattered across disk.

Criteria that do NOT justify codegen: value constraints (numeric ranges, sum-equals-1.0), cross-property references (`blockRef` keys in `blocks.delegation`), or any invariant already expressible via `keyof typeof …`. Those belong in runtime validators (custom ajv keywords, post-validation passes) — reaching for codegen there invents complexity without paying for it. Example where codegen is NOT warranted: `cli.ts:95` derives `CommandName` from a const tuple with `typeof COMMAND_ORDER[number]`. No generator needed; the tuple is the source of truth.

The pattern generalises to other registry-key invariants once the tooling is in place — skill names, artifact filenames, block references. Before adding a second generator, weigh the cost: another `prebuild` step, another generated file in PR reviews, another "is this stale?" question for contributors. One generator with clear precedent (`gen-predicate-names.ts`) is the current baseline; extensions should be justified by invariants that are equally closed, equally load-bearing, and equally well-served by a string-literal union.

Cost to remember: a generated file the typecheck depends on means fresh worktrees need `bun install` + `bun run gen:predicates` (or `bun run build`) before `tsc --noEmit` succeeds. The `prebuild` / `pretypecheck` hooks are load-bearing; do not disable them. See the seed gotcha on codegen drift for the failure mode and the fix.

PR reviewers must remember that generated files are not the source of truth. The generator script + its input directory is what reviewers assess; the `*.generated.ts` file is an artifact. Adding a spec reference is an edit in one place; the regenerated file follows automatically via `prebuild`. Editing the generated file directly is a bug — the next build overwrites the hand-edit.

---

## JSDoc conventions

Dense JSDoc is the codebase's documentation substrate — every exported symbol has a multi-paragraph docblock, every module has a top-of-file block explaining scope and cross-references. Examples: `packages/cli/src/workflow/store.ts:1-15`, `packages/cli/src/specs/types.ts:1-45`, `packages/cli/src/workflow/events/workflow.ts:1-15`. When authoring new exports, follow that density; when referencing other modules, use `@see` rather than restating shapes — the annotated file is not the place to re-explain the module it references.

Two mechanics every author must internalise:

- **The `*/` terminator trap.** A literal `*/` inside the body of a `/** ... */` docblock terminates the block there, leaving the remainder as code. TypeScript reports `TS1127` / `TS1443` errors on lines that look fine. See the seed gotcha for the fix (escape with `*\/`, rephrase, or move the content into a `//` comment). When `TS1127` fires on a line that looks syntactically fine, `rg '\*/' <file>` inside the preceding docblock body — the first occurrence is the culprit.
- **`@see` over inline duplication.** Cross-module references go through `@see`; do not copy the referenced shape into the docblock. When the referenced module changes, `@see` stays valid while a copy drifts.

Broader JSDoc style lives in `_claude`; this skill names the trap because the failure mode is a TypeScript-parser fact — agents hitting the error need the pointer immediately, not after loading a docs skill.

---

## Input vs hydrated type pairs

A recurring shape: declare a `FooInput` interface (the on-disk or partially-populated form, with optional fields and nullable values) and a `Foo` interface (the fully hydrated form, no optionals where defaults exist, no nulls where the loader fills). Callers of the loader receive `Foo`; they never see `FooInput`. `packages/cli/src/lib/settings.ts` demonstrates the pattern — `deepMerge` at lines 301-320 takes an on-disk parsed record and an overlay, returning the fully hydrated `T` that downstream code reasons over without casts.

The pattern buys two properties: the loader's validation contract is narrow (accept anything schema-valid), and the consumer's contract is wide (every field is present and typed). Do not leak `FooInput` into consumers — if a function takes a partially-populated config, that is a different concern and should be a separate type.

This composes cleanly with the boundary-parsing principle: AJV validates the `FooInput` shape at the boundary, then `deepMerge` against defaults produces `Foo`. Consumers are purely type-safe; the input shape never leaks past the loader.

---

## Boundary with `_bun`

`_typescript` owns TypeScript language patterns that apply equally under any runtime. `_bun` owns runtime-API quirks and test-framework mechanics. The split:

- **`_typescript` owns** — tsconfig flags, discriminated unions, `satisfies`/`as const`/mapped types, exhaustiveness (`assertNever`, mapped visitor), AJV + `JSONSchemaType<T>` integration, `readonly` discipline, `ReadStore`/`WriteStore` structural split, `import type` convention, `.js`-extension import rule, the primitive-guard library, codegen-branded types.
- **`_bun` owns** — `bun:test` primitives (`describe`/`it`/`test`/`expect`/lifecycle hooks), `bun:sqlite` runtime behaviour (WAL mode, `strict: true` constructor, `.immediate()` transactions, ON CONFLICT / RETURNING semantics), `Bun.spawn` ergonomics and `Subprocess.stdout` narrowing, `Bun.file`/`Bun.write`, build mechanics (`bun run build`, `bun test`, `dist/` gitignore), the `bun-types` dependency.

Two items straddle the boundary. The `fc.option` + `exactOptionalPropertyTypes` interaction is rooted in a TypeScript flag — it lives in `_typescript/gotchas.md`. The `bun:sqlite` `db.query<Row, [Bindings]>` two-parameter generic is a TypeScript-level contract over a Bun API — the type mechanics live here (see seed gotcha) and the runtime behaviour lives in `_bun`.

Rule of thumb when unsure: if the question is "what TypeScript type should I use here and why" — `_typescript`. If the question is "which Bun API or Bun configuration achieves this" — `_bun`. If both apply, teach the TypeScript pattern here and reference the Bun API in `_bun`. Cross-reference, do not duplicate.

Property-testing ergonomics (`stripUndefined`, `fc.constantFrom` composition for hex strings, `fc.option` + EOPT interaction) sit between this skill and a future `_testing` skill. The current resting place: this skill's gotchas file for strict-mode interactions that trip agents, and `_bun` for any `bun:test` framework material. Revisit if a dedicated testing skill emerges.

---

## Constraints

- Never reach for `any` in new code. If `unknown` is unavoidable, narrow with a guard; never silence with `as any`.
- Never use `as X` to coerce external input. Every JSON boundary has a validator; if a new seam appears, add one.
- Never add `!` non-null assertions to working around `noUncheckedIndexedAccess`. Narrow or fall back.
- Never emit `{ field: undefined }` to satisfy an interface declared `field?: T` under `exactOptionalPropertyTypes`. Either omit the key or declare the field `T | undefined` deliberately.
- Never hand-maintain both a key set and a handler map. Derive the keys from a const tuple, a const object, or a codegen file; gate the handlers with `satisfies Record<Key, Handler>`.
- Never end an exhaustive dispatch without `assertNever` — the compiler cannot catch a future variant otherwise.
- Never duplicate the seven-section event-category layout in docs. Point to `packages/cli/src/workflow/events/workflow.ts`.
- Never assume `dist/` or generated files exist in a fresh worktree. `bun install` and the `gen:predicates` prebuild are preconditions for `tsc --noEmit`.
- Never write a literal `*/` inside the body of a JSDoc block — it terminates the block and cascades `TS1127` / `TS1443` errors far from the cause. Escape or rephrase.
- Never edit a `*.generated.ts` file by hand. Edit the generator input + run `bun run gen:predicates` (or the appropriate `bun run gen:*` script); the generator is the source of truth.
