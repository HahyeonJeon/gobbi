# Preparation EVALUATION — Project perspective (Claude, iter1)

## Artifact Summary + Memory reads
- Target: `preparation/rawdata/draft-iter1.md` (READY readiness assessment for the memory-doc-standard retrofit, builds on PR #272).
- Ideation contract read: `ideation/artifacts/idea.md`, `scope-contract.md` (Feature project-memory; deliverable = dev-doc standard inside `memorization/rules.md` + conformance/prose/nav waves; `.claude/`-surface authoring explicitly OUT of scope).
- Project mistakes read: `naming-standard-needs-positive-guidance-not-just-blocklist.md`, `manager-context-overflow-with-large-bundle.md`, `sendmessage-continued-cwd-resets-to-main-tree.md`, `skills-mirror-symlinks-not-copies.md`, `executor-main-tree-edit-near-miss.md`.
- Project rules read: `rules/stub-redirect-format.md`.
- Baselines RE-RUN at HEAD d2b5b37: P_live 208/17/191 PASS; conformance 50/208 PASS; FIX-1 leak 59 PASS (27 backlog-disposition / 35 non-backlog-disposition / 13 backlog non-disposition).

## Locked Frame (Stage 1)
Seeds from `preparation/evaluation.md` Project lens + adversarial anti-patterns (gap-count inflation, scope creep, summary-detail mismatch). Augmented with: cross-reference of the surfaced gap against the live 208-doc population at HEAD.

## Per-scenario per-check results
- **Every gap traces to the locked Scope Contract** — PASS. The readiness signals (standard home, templates, 208 population, doc types, mistakes) all trace to `scope-contract.md` / `idea.md`. Out-of-scope gaps section exists (draft L109-116).
- **All Ideation scenarios confirmed present / classified** — PASS. Standard home (`memorization/rules.md`) verified real file; templates 17/17 verified; population reproduces.
- **Readiness summary matches detail** — PARTIAL. Summary L15-16 says "1 new gap found this loop". This is NOT a new gap: it was already tracked in TWO committed backlog files at HEAD (see Typed finding F1).
- **`skip` gaps have explicit user reason** — PASS (0 skips).
- **Artifact does not absorb out-of-scope gaps** — PASS. The dangling link was correctly NOT fixed and routed to "Out of scope gaps"; user `defer` decision recorded.

## Typed findings

### F1 — "1 new gap found this loop" is a triplicate, not a new gap
- Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: Medium
- Evidence: draft L15-16 "1 new gap found this loop (the dangling `claude` doc-authoring skill link at `CLAUDE.md:60`)". At HEAD d2b5b37 the tracked 208-doc population ALREADY contains two backlog files for this exact issue: `.gobbi/projects/gobbi/backlogs/claude-doc-standard-skill-missing.md` (FLAG-2, priority HIGH, disposition open, created 2026-05-25) and `.gobbi/projects/gobbi/backlogs/stub-redirect-dangling-claude-skill-ref.md` (FLAG-3, priority MEDIUM). Both confirmed present via `git cat-file -e HEAD:...` and counted inside the 208 population. The Preparation loop staged a THIRD file `dangling-claude-doc-skill-link.md` (priority LOW, disposition deferred) without referencing either pre-existing entry.
- Why it matters: gap-count inflation (the evaluation.md Project anti-pattern names this exactly). The readiness narrative claims discovery of something already tracked twice, and creates a triplicate backlog with conflicting priorities (HIGH/MEDIUM/LOW) and dispositions (open/open/deferred) that Wrap-up will promote into project memory alongside the originals — the one-record-one-concept atomicity rule (`rules.md` §3) is violated for this concept.
- Suggested direction (not prescriptive): the manager + user decide whether to dedupe against FLAG-2/FLAG-3 (supersede or merge) rather than promote a third entry, and reconcile priority.

### F2 — "unrelated to the memory-doc retrofit" understates the project's own coupling
- Type: `assumption_risk` · Domain: `docs-sync` · Disposition: `open` · Confidence: 75 · Severity: Low
- Evidence: draft L22-23/L89-93 frames the dangling link as "out-of-scope `.claude/`-surface drift unrelated to the memory-doc retrofit". But `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:187` (FLAG-2 row) states the missing `claude` skill's "intended home is the `project-memory` value-feature (the doc-authoring standard Principle 13 leans on)" — the very feature this session retrofits, under the very principle (P13) that governs this doc-work session.
- Why it matters: the "unrelated" claim is the basis for the LOW severity + defer. The coupling is real (same feature, same P13). The defer DECISION is still faithful to the user's explicit avoid-unnecessary-change steer (so this is not a re-ideate trigger), but the characterization overstates independence.
- Suggested direction: re-characterize as project-memory-feature-adjacent drift, not unrelated; let the user weigh whether the existing FLAG-2 HIGH priority should hold.

## Low-confidence appendix
None.

Per threshold (no Critical≥75, no High≥50; findings are Medium): computed verdict PASS. Medium findings F1/F6 recorded for manager+user attention.

VERDICT: PASS
