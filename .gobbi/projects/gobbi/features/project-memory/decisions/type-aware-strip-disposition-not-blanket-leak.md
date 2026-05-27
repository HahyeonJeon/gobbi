---
name: type-aware-strip-disposition-not-blanket-leak
description: The conformance wave strip must be type-aware; disposition is a legitimate backlog extension and must not be stripped there.
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [conformance, frontmatter, type-aware, disposition, fix1]
decision_status: accepted
finding-iter: 1
---

# Type-aware strip: disposition is NOT a blanket staging-key leak

## Context

An early ideation draft scoped the conformance wave to "strip the 64 staging-key leaks"
including `disposition`. This was unsafe as written: `disposition: open|deferred` is a
**legitimate extension field on `backlogs/` docs** (`rules.md` §2.2 line 110), and the
stripping rule qualifies `disposition` as staging-only "when used purely as eval routing"
(`rules.md` §2.3 line 122) — NOT on backlogs. A naive grep-strip would corrupt backlog
lifecycle semantics.

## Decision

The conformance wave uses a **type-aware allowlist strip (FIX-1)** — NOT a blanket grep.

- **Illegitimate key-set S:** `{ finding-id, confidence, severity, surfaced-by, promoted-from,
  promoted-at, mistake-candidate }` + `disposition` ONLY when the file is NOT under a
  `backlogs/` directory.
- **File-selection predicate P:** operate on P_live (not `archive/`, not
  `sessions/`/`skills/`/`agents/`/`tmp/`). For each F: strip every key in `S \ {disposition}`
  unconditionally; strip `disposition` from F only if F is NOT under `backlogs/`.
- **Safety invariant (locked):** never strip a key that is legitimate for that doc's type/dir.

## Rationale

`rules.md` §2.2 line 110 explicitly allows `disposition: open|deferred` on `backlogs/`.
§2.3 line 122 limits the strip to "when used purely as eval routing." A blanket grep-strip
violates both provisions. The witness file
`features/git-workflow/backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md` carries BOTH legitimate
`disposition` (kept) AND illegitimate eval-routing keys `finding-id`/`confidence`/`severity`
(stripped) — the predicate correctly differentiates.

## Alternatives considered

A blanket grep-strip of every key in S including `disposition` everywhere — rejected: it would corrupt backlog lifecycle semantics by deleting the legitimate `disposition: open|deferred` extension that `backlogs/` docs depend on, violating the safety invariant.

## Consequences

- Planning/Execution must use the FIX-1 predicate + key-set S when implementing the
  mechanical strip. Do not regress to a blanket grep.
- The "0 leaks" Success Criterion counts only illegitimate keys under predicate P —
  legitimate `disposition`-on-`backlogs/` is excluded from the count.
- Baseline: 59 files carry at least one illegitimate key under predicate P (at the named baseline commit).

## Related

- [underscore-staging-keys-false-clean](underscore-staging-keys-false-clean.md) — the follow-on decision extending key-set S to underscore spellings
- [`memorization/rules.md` §4.4](../../../skills/memorization/rules.md) — the standard section encoding the type-aware allowlist and the conditional-`disposition` rule

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Ideation review, Codex F1 (High) + Consistency / Risk perspectives.
