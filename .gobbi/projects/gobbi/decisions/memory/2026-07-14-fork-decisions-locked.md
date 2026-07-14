---
name: fork-decisions-locked
description: The user's 4 locked forks (principle set, hard-invariant count, word target, triad design) + the anchor-vocabulary fix.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [design, ideation, process]
keywords: [locked-forks, principle-consolidation, hard-invariant-count, word-budget, triad-design, anchor-vocabulary]
author: claude
related: [reharden-edit-blast-radius-miss]
---

# Fork decisions locked for the python-skill quality/compaction/reframe pass

## Context

Ideation researched the python skill's quality-compaction-reframe pass (PR #349, 10 existing docs,
35,193 words) through two independent drafts (a Claude leader draft and a Codex proposer draft). Four
genuine forks — places the two drafts disagreed on direction, not just wording — needed a user decision
before the draft could lock, plus a fifth cross-cutting naming problem (numeric vs phrase-keyed
anchors) that surfaced during dual-system iter1 evaluation. The user resolved all five on 2026-07-14
(Always-Ask — each changes the shape of the pass Planning/Execution decomposes).

## Decision

1. **Principle set** — lock the Codex-merged 8-principle set (current 7 → 8: sharpen the design
   principle, merge two principles into one, reframe one principle, merge two more into one, keep one
   principle unchanged, then add three new principles for study-first, class-necessity, and
   typed-skeleton-first), each carrying a verified deepen-not-restate verdict against the current
   python principle it maps from.
2. **Hard-invariant count** — consolidate the 49 existing rules (28 MUST + 21 NEVER) toward roughly 16
   hard invariants, but the user re-hardened 2 of the 7 directions an independent (Claude) analysis
   judged real footguns — returning a live mutable internal container, and reading/mutating a raw
   `__annotations__` string — bringing the locked hard set to **18** (16 consolidated + 2
   user-re-hardened). The other 5 candidates for re-hardening stay softened, each keeping its stated
   rationale.
3. **Word target** — net roughly 24,200 words within the band 23,500–24,500 (a 31% cut from the 35,193
   baseline), split existing-10 docs at roughly 21,800 words and the 2 new docs (`scenarios.md` +
   `checklists.md`) at roughly 2,400 words.
4. **Design shape** — the scenario/checklist/evaluation triad (`scenarios.md` + `checklists.md` new,
   `evaluation.md` reframed), reusing the prior-art split already shipped for gobbi's own
   `execution/{scenario,checklist,evaluation}.md`; explicit reuse-hazard naming (source-before-trim,
   union-scope floor, no extra evaluator output beyond the contracted set); plural filenames locked
   (not singular).
5. **Anchor vocabulary** (surfaced by dual-system iter1 evaluation, not an original fork but a
   cross-cutting naming fix the user's four locks made necessary) — one resolvable anchor system:
   numeric keys for the hard-invariant legend, and a distinct principle-number key for the principle
   legend, replacing an overloaded bare numbering scheme that had collided between "principle number"
   and "procedure step number."

## Rationale

- **Principle set (Codex-merged):** the Codex 8-set carries a verified per-principle deepen-not-restate
  math (no principle deleted, net +1) and each mapped principle was independently confirmed against the
  live python design doc's text — a stronger evidence base than the Claude draft's alternative
  consolidation, which the user reviewed and did not prefer.
- **Hard-invariant re-hardening:** the Codex base's consolidation softened 7 directions that an
  independent Claude analysis flagged as real footguns, not judgment calls. The user reviewed the
  ranked list and drew the line at the 2 with the clearest, least-conditional harm (aliasing via a
  returned live container; a correctness bug via an unresolved annotation string) — both are the same
  class of harm as an existing hard rule (a mutable-default argument), unlike the other 5 which stay
  context-dependent.
- **Word target:** the roughly-24,200 figure within the band is the arithmetic result of the locked
  existing-10/new-2 split; the band gives Planning/Execution a verifiable floor and ceiling instead of
  a single brittle number.
- **Design shape:** the triad reuses a proven, already-shipped split rather than inventing a new
  document architecture, and explicitly names the reuse hazards up front so Execution does not repeat
  them.
- **Anchor vocabulary:** dual-system iter1 evaluation converged on the same defect from three
  independent lenses — the same bare numbering scheme meant two different things (principle vs.
  procedure step) — so a single, disambiguated vocabulary removes the ambiguity without renaming either
  underlying concept.

## Alternatives considered

- **Keep the Claude draft's principle consolidation** — rejected: the Codex-merged set had the more
  complete deepen-not-restate audit trail; the user did not raise a substantive disagreement with it.
- **Accept the Codex base's lower hard-invariant count unmodified** — rejected: an independent Claude
  analysis found 2 of the 7 softened directions were not judgment calls but real, harm-bearing
  footguns; the user chose to re-harden exactly those 2, not all 7, preserving the other 5 as strong
  guidance rather than reflexively re-hardening the whole set.
- **A single brittle word-count target instead of a band** — rejected: the plan's own iter1 evaluation
  flagged one child-doc sub-target as aggressive; a band gives Execution room to verify against a
  floor/ceiling instead of missing one exact number.
- **Leave the ambiguous bare-numbering anchor as-is (defer the naming fix to Execution)** — rejected:
  three independent evaluator perspectives converged on the same ambiguity; fixing it at Ideation,
  before Planning decomposes the doc-edit tasks, avoids Execution inheriting an already-known-ambiguous
  vocabulary.

## Consequences

- Planning decomposes against the locked 8-principle set, the 18-item hard-invariant register, the
  23,500–24,500-word band, and the triad shape — none of these five may be re-opened without a new user
  decision.
- Every downstream register (the checklist seed and the evaluation-doc legend) must carry the
  disambiguated anchor vocabulary consistently; a re-opened ambiguity anywhere downstream is a
  regression against this decision.
- The 2 user-re-hardened footguns are full hard invariants going forward — the same enforcement weight
  as every other hard invariant — in every downstream register (checklist coverage, doc-level row
  counts, the evaluation-doc legend). See [[reharden-edit-blast-radius-miss]] for the consumer-sweep gap
  this re-hardening edit exposed and its correction.

## Related

- [[reharden-edit-blast-radius-miss]] — the consumer-sweep gap uncovered while propagating the
  re-hardening decision (item 2 above) through every downstream register
