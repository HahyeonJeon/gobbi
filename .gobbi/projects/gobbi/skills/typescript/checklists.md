# TypeScript — Implementation Checklist Register

A copyable binary PASS/FAIL register for a TypeScript implementation change-set. The evaluator copies the
activated items into the phase checklist's `## Stage 1 Additions` and ticks each against the diff; the
executor runs them as a Procedure step P8 self-review. Tick a box when resolved and annotate PASS or FAIL.
This register deepens, it does not restate: every item carries a `SKILL.md` anchor (`H{n}` = a Rule,
`P{n}` = a Principle, `Procedure P{n}` = a Procedure step) that resolves to its verbatim clause through
[`evaluation.md`](evaluation.md)'s rule-key legend; nothing is checked that `SKILL.md` does not teach.

Each item states **one positive acceptance outcome**: the box passes if and only if that outcome holds. The
outcome may require a conjunction of conditions (all must hold — a compound check is still one outcome), but
never an `OR` / sign-off escape. The FAIL clause only lists the forms the outcome can be violated in, and
ownership, ticket status, or review sign-off never stands in for the outcome itself. Groups: Hard invariants · Design judgment · Operation & evidence.

## Hard invariants

- [ ] `TS-CHECK-01` — PASS if the change type-checks green under the maximal-strict base (`strict` plus
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`,
  `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`); FAIL if it relies on a loosened
  flag, or an unchecked index, exact-optional violation, or missing return that a maximal-strict `tsc` rejects.
  *(H1)*
- [ ] `TS-CHECK-02` — PASS if every import uses ESM with `verbatimModuleSyntax` — a type-only import written
  `import type`, a value import left plain — so erasure is deterministic; FAIL if a type import is left as a
  value import (or the reverse), or a CJS `require` sits in the verbatim source. *(H2)*
- [ ] `TS-CHECK-03` — PASS if every relative import extension matches the file's consumption mode (`.js` for a
  tsc-emitted library, `.ts` with `rewriteRelativeImportExtensions` for a directly type-stripped source),
  consistent across the tree; FAIL if the two modes are mixed in one source tree or an extension does not
  resolve under the declared runtime. *(H3)*
- [ ] `TS-CHECK-04` — PASS if every untrusted boundary value (JSON, network, `env`, file) enters as `unknown`
  and is narrowed by a type guard or schema parser into a domain type before any maintained logic reads it;
  FAIL if an annotation or an `as` cast stands in for the runtime validation. *(H4, P4)*
- [ ] `TS-CHECK-05` — PASS if no `any` appears — implicit or explicit — with `unknown` at the boundary narrowed
  by a guard or parser and, at most, a documented `as` for a static fact the checker cannot see; FAIL if `any`
  is used or reintroduced by assignment spread. *(H9, P4)*
- [ ] `TS-CHECK-06` — PASS if every value is checked by an annotation (`: T`) or `satisfies T`, with `as`
  reserved for a fact verified by a prior runtime narrow; FAIL if an `as` (or a `!` non-null assertion or a
  `@ts-ignore`) asserts a shape the value does not satisfy to silence an error. *(H10)*
- [ ] `TS-CHECK-07` — PASS if every promise is awaited, `return`ed, or given a real rejection handler
  (`void promise.catch(...)`), with any background work owned explicitly; FAIL if a promise is left floating,
  OR a bare `void` is used as if it handled the rejection. *(H5, H13, P5)*
- [ ] `TS-CHECK-08` — PASS if `throw` carries only `Error` subclasses (chaining `cause`), every catch types the
  value as `unknown` and narrows with `instanceof` before use, and an expected failure is modeled as a typed
  result in the return type; FAIL if a non-`Error` is thrown, a caught value is used without narrowing, or an
  expected failure is thrown where the signature should carry it. *(H6, P6)*
- [ ] `TS-CHECK-09` — PASS if all syntax is erasable — a closed set modeled by a discriminated union or an
  `as const` object, with no `enum`, `namespace`, or constructor parameter-property; FAIL if any non-erasable
  construct ships where a type-stripping runtime executes the source. *(H7, H11, P7)*
- [ ] `TS-CHECK-10` — PASS if a published package emits ESM-only from its `verbatimModuleSyntax` source, any
  required CJS build isolated as a separate non-default emit; FAIL if it ships dual ESM + CJS from the one
  verbatim source. *(H12)*
- [ ] `TS-CHECK-11` — PASS if every taught `ts` example type-checks under the skill's examples baseline with its
  category marker, an intentionally-invalid example carrying `@ts-expect-error` so it is distinguishable from a
  broken one; FAIL if a taught example does not compile or a bad example cannot be told from an accidentally
  broken one. *(H8)*

## Design judgment

- [ ] `TS-CHECK-12` — PASS if the domain is modeled so illegal states cannot be constructed — a discriminated
  union ending in a `never` exhaustiveness check (with `readonly` or a branded type where an invariant must
  hold), so an unhandled variant is a compile error; FAIL if an illegal combination is representable or a new
  variant compiles without being handled. *(P3, H11)*
- [ ] `TS-CHECK-13` — PASS if the exported type surface (interfaces, generics, unions, the public `.d.ts`) was
  designed and confirmed before bodies, `interface` for an extendable object shape and `type` for a
  union/tuple/mapped/conditional, and a generic added only when it links an input to an output across many
  types; FAIL if the surface was reverse-engineered from bodies, a binding was accidentally exported, or a
  generic serves a single call site. *(P2)*
- [ ] `TS-CHECK-14` — PASS if every resource's release is bound to its scope with `using` / `await using` (or a
  `finally`) so disposal runs on every path including the throwing one, cancellation is carried on an
  `AbortSignal`, and a fan-out bounds its concurrent task creation; FAIL if release runs only on the happy
  path, a long operation carries no cancellation, or the fan-out is unbounded. *(P5)*
- [ ] `TS-CHECK-20` — PASS if every returned or exported reference to internal mutable state is a copy, an
  immutable view, or a `readonly`-typed boundary, so a caller cannot mutate the owner's private state; FAIL if
  a method, getter, or factory hands back a live mutable `T[]` / `Map` / `Set` a caller can mutate in place.
  *(P3)*

## Operation & evidence

- [ ] `TS-CHECK-15` — PASS if the modules, types, and fully-annotated signatures type-checked green under the
  maximal-strict base before any behavior body existed; FAIL if the signature fell out of finished bodies.
  *(Procedure P1, Procedure P5)*
- [ ] `TS-CHECK-16` — PASS if the implementation grew in minimal verified slices, each with fresh focused
  evidence (format → lint → `tsc --noEmit` → focused test) before the next, and every affected caller, test,
  doc, and emitted `.d.ts` moved in the same slice; FAIL if first evidence arrives only after a whole-feature
  pass or an affected surface lagged behind. *(Procedure P6)*
- [ ] `TS-CHECK-17` — PASS if the whole change was verified in the fixed order — format → lint → type-check →
  focused tests → full tests → type-level tests → build when publishing — each gate self-failing on fresh
  output; FAIL if a gate was skipped, asserted without running, or trusted stale output. *(Procedure P7)*
- [ ] `TS-CHECK-18` — PASS if every runtime-boundary decision (module resolution, import-extension mode,
  built-in API, `lib`, type-stripping) matches the declared target runtime read from `runtime-deltas.md`; FAIL
  if one runtime's resolution, built-in, or `lib` is assumed across a different runtime. *(H3, Procedure P2)*
- [ ] `TS-CHECK-19` — PASS if a published package validates from its built artifacts — declaration emit plus
  `publint` and `arethetypeswrong` green on the packed output, its ESM-only `exports` resolving under
  `nodenext` for a consumer; FAIL if the `.d.ts` resolution or `exports` shape is verified only from the
  checkout. *(H12, Procedure P7)*

## Guaranteed coverage map

Every Rule `H1`–`H13` is anchored by at least one check, every Principle `P2`–`P7` is anchored by at least one
check (Principle `P1` — study the TypeScript contract — is operationalized through Procedure `P1` →
`TS-CHECK-15`), and every check is exercised by at least one seed scenario in `scenarios.md`.

| Check | Anchor(s) | Seed scenario |
|---|---|---|
| `TS-CHECK-01` | H1 | `TS-SCENARIO-08` |
| `TS-CHECK-02` | H2 | `TS-SCENARIO-05` |
| `TS-CHECK-03` | H3 | `TS-SCENARIO-05` |
| `TS-CHECK-04` | H4, P4 | `TS-SCENARIO-01` |
| `TS-CHECK-05` | H9, P4 | `TS-SCENARIO-01` |
| `TS-CHECK-06` | H10 | `TS-SCENARIO-07` |
| `TS-CHECK-07` | H5, H13, P5 | `TS-SCENARIO-02` |
| `TS-CHECK-08` | H6, P6 | `TS-SCENARIO-03` |
| `TS-CHECK-09` | H7, H11, P7 | `TS-SCENARIO-04` |
| `TS-CHECK-10` | H12 | `TS-SCENARIO-05` |
| `TS-CHECK-11` | H8 | `TS-SCENARIO-09` |
| `TS-CHECK-12` | P3, H11 | `TS-SCENARIO-06` |
| `TS-CHECK-13` | P2 | `TS-SCENARIO-07` |
| `TS-CHECK-14` | P5 | `TS-SCENARIO-02` |
| `TS-CHECK-15` | Procedure P1, Procedure P5 | `TS-SCENARIO-08` |
| `TS-CHECK-16` | Procedure P6 | `TS-SCENARIO-08` |
| `TS-CHECK-17` | Procedure P7 | `TS-SCENARIO-09` |
| `TS-CHECK-18` | H3, Procedure P2 | `TS-SCENARIO-10` |
| `TS-CHECK-19` | H12, Procedure P7 | `TS-SCENARIO-05` |
| `TS-CHECK-20` | P3, coding P16 | `TS-SCENARIO-11` |
