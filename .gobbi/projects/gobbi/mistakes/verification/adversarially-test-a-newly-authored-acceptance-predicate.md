---
name: adversarially-test-a-newly-authored-acceptance-predicate
description: A newly-authored checklist acceptance predicate named specific constructs as "sufficient" that a compiled counterexample proved unsound, twice — a new check needs the same adversarial soundness test as any taught fact.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 054f402b-a9ab-4af6-875d-078233778a0b
tags: [process, verification, execution]
keywords: [acceptance-predicate, new-check, soundness, compile-proof, readonly-depth, harness-blind]
author: claude
priority: high
domain: verification
---

# A new acceptance check claimed constructs "sufficient" that a compiled probe falsified

## What happened

A coverage gap was closed by adding a new scenario + checklist item (a mutable-aliasing check). The check's
PASS condition named specific TypeScript constructs as sufficient to protect private state — first "a
`readonly`-typed boundary", then "`ReadonlyArray<Readonly<T>>` or a spread copy `[...items]`." A re-eval
compiled counterexamples and proved BOTH unsound: a shallow `readonly T[]` over mutable objects lets a caller
assign nested fields; a one-level `Readonly<T>` is shallow in `T` (so `view[0].inner.x = 7` compiles); and a
spread `[...items]` of objects shares the element objects (so `copy[0].x = 7` mutates the owner). The check
that was supposed to REJECT unhandled aliasing would have PASSED it. It took two rounds to get sound, finally by
reframing the check as a PROPERTY ("no mutable path into private state") rather than naming any construct
"sufficient."

## Why it happens

Authoring a check feels like documentation, not code, so it ships without being run. But an acceptance predicate
IS an executable claim — "if the artifact does X, it passes" — and it can be false exactly like a taught code
example can be false. Naming a construct "sufficient" is the trap: TypeScript immutability is shallow and
erased, so almost every shallow guard (`readonly T[]`, `Readonly<T>`, `Object.freeze`, a spread copy) has a
deeper case it does not cover. The compile-harness does not help — it proves the skill's EXAMPLES compile, not
that a checklist's ACCEPTANCE condition is sound.

## Correct approach

Treat a newly-authored check / scenario / acceptance predicate as a claim to be adversarially tested before
shipping, the same bar as a taught fact: construct the counterexample the predicate is supposed to reject and
CONFIRM it fails the predicate (for code claims, compile it). Prefer framing an acceptance condition as a
PROPERTY the artifact must have ("no mutable path into private state") over an enumerated list of "sufficient"
constructs — a property is closed against the cases you did not think of; a construct list is only as sound as
its longest-considered case. When immutability/soundness has a depth dimension, name the shallow traps
explicitly rather than blessing a shallow construct.

## How to detect

Red flags in a check's PASS clause: it names a specific construct as "sufficient"/"enough" (`readonly T[]`,
`Readonly<T>`, a copy, frozen) for a safety property; the property has an obvious depth/nesting dimension; or
the check was added this session and never had a counterexample run against it. Before committing a new
acceptance check, write the exact thing it must reject and verify the predicate rejects it. Remember the
harness/link/crosswalk guards are all green while an unsound acceptance predicate ships — mechanical gates do
not test a check's own soundness.

## Related

- [[acceptance-gate-and-conjunct-escape-hatch]] — the same class: an acceptance predicate that admits the case
  it exists to reject; both were caught only by an adversarial semantic reviewer, not by mechanical guards.
- [[weight-codex-evaluator-on-technical-accuracy]] — the Codex evaluator compiled the readonly counterexamples
  the Claude evaluator's PASS missed across two rounds.
