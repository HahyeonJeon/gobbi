---
name: dev-doc-memory-standard
description: Design for the development-document-level writing standard for gobbi project-memory docs (conformance + prose + nav waves).
type: design
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [standard, conformance, prose-quality, wave-based, rules-md]
supersedes: null
superseded_by: null
related:
  - ../../../skills/memorization/rules.md
  - ../decisions/type-aware-strip-disposition-not-blanket-leak.md
  - ../plans/2026-05-26-dev-doc-standard-retrofit.md
---

# Design — development-document-level project-memory standard

## Context

PR #272 fixed where memory files live and what they are named. It did NOT define or enforce
how well each doc is written as a development document. Two evidenced consequences (HEAD d2b5b37):
1. Frontmatter never retrofitted: 50 / 208 live docs carry the full base schema (~24%).
2. Cryptic session-internal references survive in doc bodies (confirmed at
   `features/git-workflow/design/worktree-create-before-session-stamp.md:31-33,49-51`).

The work is scoped into three tiers, in priority order:
- Tier 1 (primary): write the dev-doc standard as a new section in `memorization/rules.md`;
  run conformance wave (mechanical, type-aware FIX-1 strip + base-schema normalization);
  run prose-quality wave (per-type rewrite).
- Tier 2 (optional): minimal mechanical grep gate extended to `features/` (verification
  command only; no behavioral change; heavier enforcement deferred).
- Tier 3 (tertiary): light nav wave — verify each feature README.md's Subdirectories section.

Explicitly out-of-scope: re-home, big-bang rewrite, new eval perspective, Principle-13 surgery,
frozen archive/ docs, stripping legitimate per-type frontmatter keys.

## Approach

### Standard authoring (wave 0 — the spec)
A new section is added to `memorization/rules.md` (canonical:
`.gobbi/projects/gobbi/skills/memorization/rules.md`). The section:
- Defines a dev-doc (a doc a zero-context reader understands end-to-end).
- Leads with "what good looks like" + a real before/after table drawn from this tree.
- Specifies per-type section contracts:
  - decisions/design → Context → Decision → Rationale → Alternatives → Consequences → Related (ADR-shaped).
  - mistakes → What/Why/Recognize/Corrected (existing enforced schema).
  - learnings → Insight → Context → Why-it-matters → How-to-apply → Counter-cases.
  - notes → What-happened → What-shipped → Deferred → Decisions-to-respect.
- States the self-contained-prose rule: no load-bearing vanished-session coordinates in bodies.
- States the type-purity rule (per Diátaxis): one doc, one type's job; do not blend types.

### Conformance wave (wave 1 — mechanical)
Apply the FIX-1 type-aware allowlist strip (see [type-aware-strip-disposition-not-blanket-leak](../decisions/type-aware-strip-disposition-not-blanket-leak.md) for the full predicate).
Also normalize base schema (add missing base keys) and de-crypt cryptic session-coord body
references. Absorb backlog `feature-dir-frontmatter-full-normalization.md`.

### Prose-quality wave (wave 2 — per type)
Rewrite bodies toward the quality bar, type-by-type. Verify per wave.

### Tier-3 nav wave (wave 3 — light, lowest priority)
Verify each feature README.md's Subdirectories section; optionally add top-level index pointer.
Must not block tier-1.

## Rationale

The standard optimizes for durable, machine-addressable project memory that a zero-context
reader can navigate without re-reading session transcripts. The wave-based sequencing (spec →
mechanical conformance → per-type prose → light nav) honors the steel-man's anti-big-bang
warning while staying bottom-up: each wave is independently verifiable before the next begins.

**The scenarios the standard must serve** (the teaching examples that motivate the section
contracts):

- **Golden path:** a new `decisions/` doc authored next session passes type-purity + ADR section
  contract + base frontmatter + self-contained-prose checks with zero rework.
- **Edge (legitimate-key backlog):** a `backlogs/` doc with both legitimate `disposition` AND
  illegitimate eval-routing keys — the FIX-1 predicate strips the eval keys, preserves `disposition`.
- **Edge (half-narrative):** a migrated design doc with `T1-I-2` / `draft-iter3.md:308` in the
  body — retrofit keeps the decision prose, lifts provenance to frontmatter/footer, drops inline
  coordinates.
- **Failure (no clear home):** a session-journal mislabeled as `design/` — reclassify to `notes/`;
  never delete.

**How each wave is validated** (the evidence that the approach worked):

- Standard section exists in canonical `rules.md`; symlink auto-reflects.
- Conformance wave: type-aware grep gate reports 0 illegitimate keys; 100% P_live_all (208) carry
  base schema.
- Prose wave: evaluator scores 3 sample docs against the section-contract checklist — pass/fail.
- Nav wave: each feature README.md Subdirectories section lists all existing subdirs.

## Alternatives considered

- **Big-bang rewrite** — rejected: a one-shot rewrite of all 208 docs is faster on paper but
  fails opaquely under context pressure (Principle 3) and forfeits per-wave verification. The
  wave-based approach is slower than big-bang but de-risked, and it honors the steel-man's
  explicit anti-big-bang warning.
- **Blanket grep strip of frontmatter keys** — rejected in favor of the type-aware FIX-1
  allowlist, which preserves keys legitimate for a doc's type (e.g., `disposition` on a
  `backlogs/` doc) instead of stripping every routing-shaped key indiscriminately.
- **Deleting mislabeled narrative** — rejected: a session-journal mislabeled as `design/` is
  reclassified to `notes/`, never deleted; deleting valuable history to satisfy type-purity
  would trade one defect for another.

## Consequences

- The standard lives as a new section in canonical `rules.md`; the symlink auto-reflects it, so
  every agent loading memorization meets the same contract.
- Conformance and prose are enforced per wave, not in one pass — slower throughput, higher
  confidence, and a clean intervention point between waves.

Forward-consequences carried as open issues for Execution:

- **CN-1 (Low, cosmetic):** FIX-1 disposition sub-count cross-foot (28 vs 27 under strict filter).
  Normalize at Execution.
- **PR-1 (Low, confirm/defer):** AGENTS.md 12→13 entrypoint reconciliation — surface at Planning.
- **12/13/16 type-count framing:** when authoring the standard's per-type section list, reconcile
  against `rules.md` §2 (12 promotable + 4 feature-subdir-only = 16) and `memory-map.md` (13 types).
  Not a blocker; a standard-authoring concern for Execution.

## Related

- [`skills/memorization/rules.md`](../../../skills/memorization/rules.md)
- [`decisions/type-aware-strip-disposition-not-blanket-leak.md`](../decisions/type-aware-strip-disposition-not-blanket-leak.md)
- [`plans/2026-05-26-dev-doc-standard-retrofit.md`](../plans/2026-05-26-dev-doc-standard-retrofit.md)
</content>
</invoke>
