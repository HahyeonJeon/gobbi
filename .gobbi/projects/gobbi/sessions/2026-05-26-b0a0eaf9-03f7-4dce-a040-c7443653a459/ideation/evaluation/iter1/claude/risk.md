# Risk — Ideation eval (iter1, claude)

## Artifact Summary + Memory reads
(see project.md)

## Locked Frame (Stage 1)
**S1 — Rollback path identified for the retrofit.** Checks: rollback per irreversible step or "no irreversible steps" confirmed.
**S2 — Blast radius bounded.** Checks: which docs/consumers affected enumerated.
**S3 — No silent security-surface expansion.** Checks: delta none / described.
**S4 — Irreversible steps gated.** Checks: never-delete discipline honored.
**S5 — Two-week smell test.** Checks: no load-bearing "we'll improve later"; maintenance burden named.
**S6 (adversarial) — Design touches files outside the Scope Contract.** Checks: diff Scope Contract vs Design; flag OOS file mentions.
**S7 — "It's just a docs change" dismissal (mistake-derived).** Checks: blast radius through `MUST load` directives / link targets considered, per the ideation child doc Risk anti-pattern.
**S8 (mistake-derived) — Retire/strip without replacement.** Checks: per mistake `design-literal-retire-instruction-without-replacement`, no strip/delete without a named destination.
**S9 — Unmerged-#272 / develop divergence risk.** Checks: standard relies on #272-only artifacts (P13, naming standard, re-home) that are not yet on develop.

## Per-scenario per-check results
- S1 YES — every retrofit step is a doc rewrite under git; rollback = `git revert`. No data migration, no schema change. Wave-based + verify-before-next bounds the blast.
- S2 YES — blast radius = the ~200+ memory docs under `features/` + project content dirs (the artifact says ~147; see consistency C-1), explicitly excluding `archive/`. Consumers = future agents reading memory + user (line 60).
- S3 YES — security surface delta = none; this is internal project-memory prose/frontmatter. No auth/network/untrusted-input path. Confirmed: standard lands in a skill doc + edits memory markdown only.
- S4 YES — never-delete discipline is explicit (D9, Locked Decision 6, Failure scenario) and correctly anchored to mistake `design-literal-retire-instruction-without-replacement`. Reclassify-to-notes is the named destination — exactly the "name a replacement before retiring" lesson.
- S5 YES — maintenance burden named (wave-based, evergreen-type one-time pass argued durable in the counterfactual). No "improve later" load-bearing promise; the deferred enforcement tier is explicitly backlogged, not assumed.
- S6 YES — Design touches only `.claude/skills/memorization/rules.md` (new section) + memory doc bodies/frontmatter + a grep gate; all inside the Scope Contract. No OOS file. P13/principles explicitly NOT touched (D8).
- S7 YES — the artifact treats this as a real change (it IS editing a `MUST load`-adjacent skill doc, `memorization/rules.md`); blast through that doc is bounded because the change is additive (new section) per D2.
- S8 YES — see S4; the de-crypt rule (D5) strips session coordinates from bodies but PRESERVES the decision prose and lifts provenance to a footer — a transform, not a delete; matches the mistake.
- S9 — see R-1. The standard's reliance on P13 + the 13-type taxonomy + the re-home is sound WITHIN the #272 worktree (I confirmed P13 present at `principles/SKILL.md:331`, and `git merge-base --is-ancestor origin/develop HEAD` → develop IS an ancestor, so the worktree is ahead of develop and contains it). But these are #272-branch-only until #272 merges.

## Typed findings

### R-1 — Standard is authored against #272-only invariants (P13, 13-type taxonomy, re-home) that are not yet on develop
- Type: `assumption_risk` · Domain: `process` · Disposition: open · Confidence: 50 · Severity: Medium
- Evidence: the main tree `.claude/CLAUDE.md` lists **12** principles (no P13); the #272 worktree lists **13** (P13 = "NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN", confirmed at `principles/SKILL.md:331`). The artifact references "full Principle-13 encoding" (Out-of-Scope line 28; Deferred line 48) and "keep gobbi's locked 13 types". Both are valid only on the #272 branch. The discussion-log Q3 ratified "build on #272 branch, defer merge" — so this is an accepted condition, not a defect — but the artifact does not flag that if #272 lands AFTER an unrelated develop change that re-touches rules.md/principles, the standard's anchors could conflict at merge.
- Why it matters: Medium — a merge-time collision between this session's rules.md edits and any concurrent develop edit to the same file (the MEMORY.md history shows concurrent sessions bouncing develop) would surface as a conflict in a `MUST load` doc. The artifact's "defer merge" stance is correct but the merge-back risk is unstated.
- Suggested direction: note in the Scope Contract or Wrap-up that the standard's rules.md/P13 anchors are #272-branch-relative and must be reconciled at #272 merge; keep the rules.md edit additive (new section) to minimize conflict surface (already the plan per D2 — good).

### R-2 — Conformance grep gate could false-positive-strip legitimate per-type extension frontmatter
- Type: `design_flaw` · Domain: `docs-sync` · Disposition: open · Confidence: 50 · Severity: Medium
- Evidence: cross-ref consistency C-3 — a naive staging-key strip would remove legitimate `disposition` on `backlogs/` (28 files) and potentially `confidence`/`severity` on `reviews/`. The grep gate is in-scope (Locked Decision 4); if built mechanically it can corrupt valid frontmatter. This is the Risk-side framing of C-3: blast radius = legitimate backlog/review files mutated by a too-broad strip.
- Why it matters: Medium — silently mutating valid frontmatter is a reversible-but-noisy error class; the never-delete discipline does not cover never-strip-valid-fields.
- Suggested direction: the grep gate must be type-scoped (exclude backlogs/ for disposition, reviews/ for verdict-adjacent keys). Verify the strip against rules.md §2.2 per-type extension table before running it tree-wide.

## Per-perspective verdict: REVISE
No security/rollback/irreversibility concern; never-delete discipline is exemplary. Two Medium/50 findings: the #272-merge-relative anchor risk (accepted-but-unstated) and the grep-gate false-positive-strip risk (shared with Consistency C-3). Both are correctable before Planning closes.

## Low-confidence appendix
(none)
