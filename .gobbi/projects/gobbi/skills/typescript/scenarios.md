# TypeScript — Implementation Scenario Library

Good, bad, and adversarial TypeScript implementation cases. Load only when a TypeScript implementation task
is being evaluated, or when an executor runs a pre-handoff idiom self-check. This library deepens, it does
not restate: every case exercises a `SKILL.md` rule or principle and teaches nothing new — its `Exercises`
line anchors to Rules (`H{n}`), Principles (`P{n}`), and Procedure steps (`Procedure P{n}`), each resolving
to its verbatim `SKILL.md` clause through [`evaluation.md`](evaluation.md)'s rule-key legend, and its
`Checklist IDs` line points at the binary items in [`checklists.md`](checklists.md). Snippets are inline and
describe a shape to recognize, not runnable code. Cases group under Hard invariants · Design judgment ·
Bottom-up operation.

## Hard invariants

### TS-SCENARIO-01 — Boundary data trusted through an annotation or `as`
- **Axis:** Hard invariant.
- **Situation:** a function reads JSON, a network body, `env`, or a file, and treats the result as a domain
  type; elsewhere an `any` is introduced as a "temporary" escape hatch.
- **Good handling:** the value enters as `unknown` and a type guard or schema parser narrows it into the
  domain type before any maintained logic reads it; where the checker cannot see a static fact, a documented
  `as` follows a prior runtime narrow, never `any`.
- **Bad handling:** `JSON.parse(raw) as Config` (or `: Config`) trusts the annotation without a runtime check;
  an `any` is used so the value flows unchecked and spreads by assignment.
- **Adversarial probe:** feed malformed or partial input — the `as` cast still compiles, but a missing field
  is `undefined` at runtime and surfaces far from the boundary.
- **Exercises:** H4, H9, H10, P4.
- **Checklist IDs:** `TS-CHECK-04`, `TS-CHECK-05`, `TS-CHECK-06`.

### TS-SCENARIO-02 — A floating promise and an un-scoped resource
- **Axis:** Hard invariant.
- **Situation:** an async fan-out issues work under a deadline, and a file or connection handle is acquired
  inside the same scope.
- **Good handling:** every promise is awaited, `return`ed, or given a real `void promise.catch(...)` (a bare
  `void` is not a handler); the fan-out bounds
  its concurrent task creation; cancellation is carried on an `AbortSignal`; each resource's release is bound
  to scope with `using` / `await using` so disposal runs on every path, including the throwing one.
- **Bad handling:** a fire-and-forget call drops its rejection; an unbounded eager `Promise.all` retains every
  task; a long await carries no cancellation; a handle is closed only on the happy path.
- **Adversarial probe:** one branch throws and one hangs past its deadline — the handle leaks and the rejection
  surfaces detached; grow the input until retained-task memory shows.
- **Exercises:** H5, H13, P5.
- **Checklist IDs:** `TS-CHECK-07`, `TS-CHECK-14`.

### TS-SCENARIO-03 — Failure shape: thrown vs typed result, caught as `unknown`
- **Axis:** Hard invariant.
- **Situation:** an operation has both an expected miss (a validation failure, a not-found) and a genuinely
  exceptional error.
- **Good handling:** the expected miss is modeled as a typed result in the return type, where the compiler
  forces the caller to handle it; only `Error` subclasses (carrying `cause`) are thrown for the exceptional;
  every catch types the value as `unknown` and narrows with `instanceof` before use.
- **Bad handling:** a string or plain object is thrown (losing the stack and cause); a caught value is used as
  though it were an `Error`; an expected miss is thrown where the signature should carry it.
- **Adversarial probe:** throw a non-`Error` and catch it — `.message` is `undefined` and the cause chain is
  gone; the caller never sees the expected failure the signature hid.
- **Exercises:** H6, P6.
- **Checklist IDs:** `TS-CHECK-08`.

### TS-SCENARIO-04 — Non-erasable syntax in a type-stripping runtime
- **Axis:** Hard invariant.
- **Situation:** portable code — meant to run directly under Node 24+ `--experimental-strip-types`, which
  STRIPS type syntax rather than transpiling (Bun and Deno transpile instead) — uses an `enum`, a
  `namespace`, or a constructor parameter-property to model a closed set or carry state.
- **Good handling:** the closed set is a discriminated union or an `as const` object with a derived type;
  `erasableSyntaxOnly` is on, so only strippable syntax ships.
- **Bad handling:** `enum Direction { Up, Down }`, a `namespace` wrapper, or a `constructor(private x: T)`
  parameter-property — each emits runtime code that type-stripping cannot produce.
- **Adversarial probe:** run the source under Node's `--experimental-strip-types` — the non-erasable construct
  is a load error there (Bun and Deno transpile it, so they accept it); the erasable baseline is a cross-runtime
  portability policy, not a claim that every runtime rejects the construct.
- **Exercises:** H7, H11, P7.
- **Checklist IDs:** `TS-CHECK-09`.

### TS-SCENARIO-05 — Module boundary: ESM, import extension, and dual emit
- **Axis:** Hard invariant.
- **Situation:** a package publishes an emitted build and its source is also run directly; a consumer resolves
  the shipped `.d.ts` under `nodenext`.
- **Good handling:** `verbatimModuleSyntax` with `import type` on every type-only import; the relative
  extension matches the consumption mode (`.js` for the tsc-emitted library, `.ts` with
  `rewriteRelativeImportExtensions` for the directly stripped source), one mode per tree; the package is
  ESM-only with a `types` + `import` `exports` map that resolves correctly for the consumer.
- **Bad handling:** a type import left as a value import; mixed `.js` and `.ts` extensions in one tree; dual
  ESM + CJS emitted from the one `verbatimModuleSyntax` source; a `.d.ts` that resolves wrong under `nodenext`.
- **Adversarial probe:** install the built package in a `nodenext` consumer — the mismatched extension or the
  dual-emit `exports` shape breaks resolution the checkout never showed.
- **Exercises:** H2, H3, H12.
- **Checklist IDs:** `TS-CHECK-02`, `TS-CHECK-03`, `TS-CHECK-10`, `TS-CHECK-19`.

## Design judgment

### TS-SCENARIO-06 — Illegal states left representable
- **Axis:** Design judgment.
- **Situation:** a value carries a status plus optional companion fields (`{ status: string; value?: T;
  error?: string }`), so illegal combinations (a success with an error, a failure with a value) can be
  constructed; a closed variant set is switched over.
- **Good handling:** the domain is a discriminated union whose variants make the wrong combination
  unconstructable, with `readonly` (and a branded type where an invariant must hold), and the `switch` ends in
  a `never` exhaustiveness check so a new variant is a compile error.
- **Bad handling:** a bag of optional fields the compiler cannot constrain; a `default` branch that silently
  accepts an unhandled variant.
- **Adversarial probe:** add a variant to the union — a real exhaustiveness check fails the build until it is
  handled; a swallowing `default` compiles and drops the case at runtime.
- **Exercises:** P3, H11.
- **Checklist IDs:** `TS-CHECK-12`.

### TS-SCENARIO-07 — The exported type surface and the `satisfies` / `as` / generic choice
- **Axis:** Design judgment.
- **Situation:** a public API whose exported interfaces, generics, and `.d.ts` are the caller's contract; a
  config literal must stay narrowly typed while being checked; a helper is offered a type parameter.
- **Good handling:** the exported type surface is shown and confirmed before bodies; `satisfies T` validates a
  literal while keeping its narrow inferred type; an annotation is chosen over an assertion; a generic is added
  only when it links an input to an output across many types; `interface` describes an extendable object shape,
  `type` a union or tuple or mapped type.
- **Bad handling:** the surface is reverse-engineered from finished bodies; a binding is accidentally
  `export`ed into the contract; `as T` forces a shape the value does not hold; a widening annotation is used
  where `satisfies` was needed; a generic serves a single call site.
- **Adversarial probe:** change an un-narrowed exported return type — every downstream build breaks because the
  accidental shape was the published contract.
- **Exercises:** P2, H10.
- **Checklist IDs:** `TS-CHECK-13`, `TS-CHECK-06`.

### TS-SCENARIO-11 — Returning a live reference to internal mutable state
- **Axis:** Design judgment.
- **Situation:** a unit holds mutable internal state — a `#items` array, a `Map`, a `Set` — and a method,
  getter, or exported factory returns it directly to a caller.
- **Good handling:** the boundary returns a defensive copy (`[...items]`, `new Map(m)`), an immutable view
  whose immutability REACHES the mutable state (`ReadonlyArray<Readonly<T>>` or primitive elements, not a
  shallow `readonly T[]` over mutable objects), or frozen data, so a caller cannot reach in and mutate the
  owner's private state (the coding P16 "minimize shared mutable state" rule, in TypeScript form).
- **Bad handling:** `get items(): number[] { return this.#items; }` hands back the live array, so a caller's
  `x.items.push(...)` silently corrupts internal state; a shallow `readonly { x: T }[]` view is NOT enough —
  the caller still assigns `view[0].x`, mutating the owner's nested state with zero diagnostics.
- **Adversarial probe:** mutate the returned value and re-read the owner — if the owner's state changed, the
  container leaked. TypeScript's `readonly` is shallow AND erased: it blocks reassigning an element or the
  binding, but a `readonly { x: T }[]` still permits `view[0].x = ...`, and an aliased non-`readonly` handle
  to the same object mutates it too.
- **Exercises:** P3.
- **Checklist IDs:** `TS-CHECK-20`.

## Bottom-up operation

### TS-SCENARIO-08 — Skeleton-first typed growth
- **Axis:** Bottom-up operation.
- **Situation:** a new strict module needs modules, exported types, signatures, bodies, callers, and tests.
- **Good handling:** first study the declared TypeScript contract (the tsconfig strict flags, the target
  runtime and its import-extension mode, the module system, the artifact type, the `.d.ts` consumers); then
  materialize the modules, types, and fully-annotated signatures with stub bodies; confirm it imports cleanly
  and `tsc --noEmit` passes under the maximal-strict base before any body; then grow one verified slice at a
  time (format → lint → `tsc --noEmit` → focused test), updating every affected caller, test, and `.d.ts` in
  the same slice.
- **Bad handling:** fill every body in one pass; discover the exported signature after the body; add tests only
  after the whole feature is entangled; loosen a strict flag to get it compiling.
- **Adversarial probe:** ask for evidence at the skeleton checkpoint and after each slice — a single final green
  `tsc` does not prove incremental growth.
- **Exercises:** H1, Procedure P1, Procedure P5, Procedure P6.
- **Checklist IDs:** `TS-CHECK-01`, `TS-CHECK-15`, `TS-CHECK-16`.

### TS-SCENARIO-09 — Whole-change verification order and taught-example fidelity
- **Axis:** Bottom-up operation.
- **Situation:** a change ships, and the skill's own fenced `ts` examples are taught facts a reader will copy.
- **Good handling:** the whole change is verified in the fixed order (format → lint → type-check → focused
  tests → full tests → type-level tests → build when publishing), each gate self-failing on fresh output; every
  taught `ts` example type-checks under the examples baseline with its category marker, and an
  intentionally-invalid example carries `@ts-expect-error` so it is distinguishable from a broken one.
- **Bad handling:** "tsc passes" is asserted without running the ordered gates or on stale output; a taught
  example reads right but does not compile; a bad example is indistinguishable from an accidentally-broken one.
- **Adversarial probe:** re-run each gate on fresh output and extract-and-compile each example — a skipped gate
  or an uncompiled example is where the untrue claim hides.
- **Exercises:** H8, Procedure P7.
- **Checklist IDs:** `TS-CHECK-11`, `TS-CHECK-17`.

### TS-SCENARIO-10 — Runtime-agnostic code at a runtime boundary
- **Axis:** Bottom-up operation.
- **Situation:** otherwise runtime-agnostic code touches a Node / Bun / Deno / browser boundary — module
  resolution, an import-extension mode, a built-in API, the `lib` set, or type-stripping.
- **Good handling:** the target-runtime delta is read from `runtime-deltas.md` (through the Procedure P2 router)
  before the boundary decision, and each choice — resolution, extension mode, built-in, `lib` — matches the
  declared runtime.
- **Bad handling:** one runtime's resolution, built-in, or `lib` is assumed across a different runtime — a
  `node:` builtin in browser code, or a `.ts` specifier where the consumer strips nothing.
- **Adversarial probe:** run the same source under a second runtime — resolution or a built-in breaks where the
  delta was never read.
- **Exercises:** H3, Procedure P2.
- **Checklist IDs:** `TS-CHECK-18`.

## Candidate additional cases

One-line cases that reuse an existing hazard as a discriminator, none duplicating a seed above: a `@ts-ignore`
suppressing a real error where a narrow would fix it (H10); a `!` non-null assertion standing in for a guard
(H9); an un-cancelled long await inside an otherwise-bounded fan-out (P5); a `require` reintroduced into a
`verbatimModuleSyntax` source (H2); a public function returning `any` from a boundary parse (H4, P4); a
`skipLibCheck`-hidden `.d.ts` break surfaced only by `arethetypeswrong` (H12).
