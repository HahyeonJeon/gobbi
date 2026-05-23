---
artifact_type: per-perspective-evaluation
system: claude
perspective: structure
loop: ideation
iter: 1
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
verdict: REVISE
---

# Structure — Claude evaluator iter1

## Artifact Summary + Memory reads

Same as project.md.

## Locked Frame (Stage 1)

**S-S1 — Each touched skill has one owning concern; no circular dependency emerges.**
**S-S2 — Directional design names the library/pattern/section, not just "improve X".**
**S-S3 — Boring-by-default; new mechanism only with rationale.**
**S-S4 — Two-week smell test passes.**
**S-S5 — Testability is first-class (validation method per design).**
**S-S6 (adversarial) — Decomposition silently introduces a shared-state hub or circular linkage.**

## Per-scenario per-check results

- [yes] S-S1: 6 touched skills (`codex`, `memorization`+`mistake`, `delegation`, `wrap-up`, `evaluation`, `gobbi`) each have a distinct ownership.
- [yes] S-S2: each Design section names specific section/line numbers + edit shape.
- [partial] S-S3: codex skill is **new** content; rationale provided. But see finding F-CLAUDE-S-01 on its size + responsibility scope.
- [yes] S-S4: validation methods are grep/file-existence — directly auditable in 2 weeks.
- [yes] S-S5: every Design carries a validation-method bullet.
- [partial] S-S6: see F-CLAUDE-S-02 below on bidirectional link cycles.

## Typed findings

### F-CLAUDE-S-01 — Codex skill section count creep (target "5+ H2" in checklist; "6-7 H2" in Design A; 8 enumerated items in body outline)

- **Type**: design_flaw
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**:
  - Checklist item 1 (draft line 308): "5+ H2 sections"
  - Design A (draft line 332): "6-7 H2 sections"
  - Design A section outline (draft lines 338-381) enumerates **8 sections** (1-When-to-load, 2-Invocation-patterns, 3-Why-subagents-must-use-codex-exec, 4-Sandbox+CWD, 5-Hang+timeout, 6-Use-cases, 7-Anti-patterns, 8-Constraints).
- **Why it matters**: Planning will need to pick one section count. Three different numbers in the same draft is structural drift the Planner has to resolve — likely with a re-discussion. Also: a single SKILL.md with 7 H2 sections + frontmatter + Constraints + multi-paragraph subsections under each is on the heavy side; comparable skills (`git/SKILL.md`, `discussion/SKILL.md`) are slimmer.
- **Suggested direction**: Planning DISCUSSION pins one section count and confirms whether "Why subagents must use `codex exec`" is its own H2 vs an H3 under Invocation patterns (the latter halves the section bloat). Also consider whether Use cases needs to be H2 or could fold into Invocation patterns with worked examples.

### F-CLAUDE-S-02 — Reciprocal-link soup risk between memorization + mistake + delegation + wrap-up

- **Type**: design_flaw
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Item B says `memorization/SKILL.md` Core Principle "Moment-of-capture" cross-links to `mistake/SKILL.md` P2; mistake P2 reciprocally points back. Item C says `delegation/SKILL.md` Core Principles names the memorization gate. Item D says `wrap-up/SKILL.md` Step 2.5 references `evaluation/SKILL.md § Finding Metadata` classification table. Item E says `evaluation/SKILL.md § Coverage Ownership Matrix` row cross-links to `memorization/SKILL.md § Path Conventions` which itself cross-links back to the Matrix row. **Five mutual-link surfaces** edited in one session is a maintenance hot-spot.
- **Why it matters**: every reciprocal link is a docs-sync constraint. If any one of these skills is later restructured, all the back-pointers risk going stale (the famous `mistake-loaded-after-skill-but-loaded-once` failure mode in `delegation/SKILL.md`-like docs). The draft does not enumerate the closure of cross-links explicitly.
- **Suggested direction**: at Planning, produce a single "cross-link manifest" task that lists every (source-skill, source-section, target-skill, target-section) pair this bundle creates, so the Executor can stamp them deterministically and the Wrap-up's docs-sync check (item D Step 2.5 implicitly) can verify the closure.

### F-CLAUDE-S-03 — Decomposition coupling: Item D's Step 2.5 depends on `evaluation/SKILL.md § Finding Metadata` for "deterministic Type+Domain routing" — but that routing semantic is partly Item E's territory

- **Type**: scenario_gap
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Design D mechanical-vs-judgment-required classification (draft lines 425-426) leans on `evaluation/SKILL.md § Finding Metadata` Type+Domain routing as the deterministic source. This routing exists today (in the loaded `evaluation/SKILL.md` lines 332-419). But item E adds a row to `evaluation/SKILL.md § Coverage Ownership Matrix` for staging shape — which is a different sub-section than Finding Metadata. If item E's row text inadvertently introduces a new Type or Domain (e.g., a "naming" Domain), the deterministic routing changes; Item D's classification semantics could shift.
- **Why it matters**: Planning needs to land Item E's exact text *before* Item D's classification table is finalized, or document the explicit invariant that Item E only adds a *seed-scenario* in the Coverage Ownership Matrix (no Type/Domain creation).
- **Suggested direction**: Planning explicitly orders Item E before Item D in the task sequence, AND adds an invariant "Item E does not add new Type or Domain values" to the Item D task brief.

## Per-perspective verdict: **REVISE**

F-CLAUDE-S-01 is `Medium`/`Confidence 75` — under the REVISE threshold (`High` ≥ 50), so it alone does NOT trigger REVISE per the rules. F-CLAUDE-S-02 and F-CLAUDE-S-03 are Medium/50. **Re-reading the threshold rule strictly: any `High` ≥ 50 triggers REVISE; none of my findings are `High`. Per the rule the perspective verdict is PASS.**

Per-perspective verdict adjusted: **PASS** (3 Medium findings, all `Confidence 50–75`, none `High`; recorded for context).

## Low-confidence appendix

None.
