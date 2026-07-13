---
name: language-skill-procedure-must-operationalize-meta-disciplines
description: A language skill's procedure must operationalize the coding + principles meta-disciplines, not just list language decisions.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-12
session: f87055a2-08b2-4605-b33b-c01c47416830
tags: [process, design]
keywords: [python-skill, typescript-skill, meta-review, coding-skill, skill-procedure]
author: claude
supersedes: null
superseded_by: null
related: [dual-system-value-is-divergence-not-agreement]
---

# A Language Skill's Procedure Must Operationalize the Meta-Disciplines

## Insight

A coding-domain / language skill (`python`, and the future `typescript`) is not just
language-idiom principles plus a checklist of language decisions. Its Procedure must
**operationalize** the `coding` skill's and gobbi's `principles` meta-disciplines, in
order: study-first (read the surrounding code, rules, mistakes, callers, and prior art;
lock What/Why/How + scope with the user) → load specialized guidance BEFORE deciding →
decomposed design (identity/responsibility → relationships/patterns → contracts +
verification-seams → data/failure → intent-naming) → CONFIRM the design and names WITH
THE USER (a gate, not a formality) → build the skeleton first → grow it in minimal
verified slices → verify → review with traceability back to the approved design. The
Procedure must also MANDATE loading `coding` and `principles` alongside it — otherwise
its citations of those skills have nothing beneath them.

## Context

The `python` skill's first Procedure (P1-P8) was an internally-consistent checklist of
Python decisions. It PASSED a code-correctness + deepen-not-restate evaluation. A
dedicated adversarial meta-review against `coding` and `principles`, run separately from
that pass, found the Procedure violated study-first, bottom-up construction, decomposed
design, and design-with-the-user: 12 High findings, with the Claude and Codex evaluators
converging independently on the same gaps. The user independently raised 4 of the same
12 findings before the meta-review confirmed them.

## Reason

A checklist of correct language decisions can pass ordinary code-correctness and
restatement checks while still teaching an agent to skip the meta-disciplines the whole
project depends on — jumping straight to implementation, designing alone instead of with
the user, and shipping a first draft as the reference structure. If this lesson is lost,
the next language skill (or the next revision of `python`) repeats the same shape: sound
Python advice sitting on top of an un-operationalized procedure, and the gap only
surfaces if someone happens to run a dedicated meta-review again.

## How

Evaluate a skill's Procedure against the meta-principles (`coding`, `principles`) with a
**dedicated meta-review** — do not rely on internal-consistency or deepen-not-restate
checks to catch this; they check different properties. A language skill's Procedure IS a
meta-principle SOP: it exists to make study-first, bottom-up construction,
design-with-the-user, and traceable review concrete for that language, not to replace
them with a language-decisions checklist. The `typescript` sibling skill should START
from this operationalized procedure shape (study → decomposed and user-confirmed design
→ skeleton-then-grow → verify → review-traceability) rather than re-deriving it. Shipped
in PR #349 (commits ee4af031 + 6d71a9b3).

## Counter-cases

- **A pure-reference skill with no procedure of its own** (e.g., a skill that is only a
  lookup table of conventions, with its build/verify steps inherited unchanged from a
  parent skill) does not need its own meta-review — there is no independent Procedure to
  check against the meta-disciplines.
- **A narrow follow-up patch to an already-reviewed Procedure** does not need a full
  meta-review re-run every time — re-run it when the Procedure's shape changes
  materially (a new phase, a reordered gate), not for a wording-only edit.

## Related

- [[dual-system-value-is-divergence-not-agreement]] — the same session's dual-system
  divergence pattern: this meta-review's 12 findings converged across both evaluators,
  which is the confirming counter-case to that learning's usual divergence signal
