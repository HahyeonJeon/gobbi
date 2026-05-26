---
name: workflow-phase-doc-set-for-per-iter-cadence
description: Enumerates the 5 workflow loop docs that must carry the per-iteration session-memory commit cadence rule (D-4), and explains why evaluation.md and memorization.md are excluded.
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, per-iter-cadence, workflow-docs, d4]
related:
  - features/workflow/decisions/2026-05-24-planning-brief-mistake-load-directives-for-t1.md
  - features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md
---

# Workflow phase doc set for per-iter commit cadence

## Problem

Design Decision D-4 (per-iteration session-memory commit cadence) calls for adding the `chore(session): record <loop> iter{n} memory` commit rule to "all 5 workflow phase docs" — but the Ideation artifact and design staging files refer to "5 phase docs" without listing the exact file set. A Planning decomposer reading the D-4 implementation requirement without explicit enumeration would have to re-derive the file set from `.claude/skills/orchestration/workflow/` directory listing or infer from context, risking off-by-one (missing or extra files).

A Preparation gap scan flagged this as a Planning-ambiguity gap (low-medium severity). This design file closes it by enumerating the 5 target files explicitly.

## Scope

In-scope (this design artifact): naming the 5 target files and the textual contract each must carry.

Out-of-scope: the per-loop commit-message format itself (already locked by D-4 in the Ideation artifact); the smoke test verifying commit subjects (T1-I-T1.h); rollback semantics for commit failure (T1-I-T1.j).

## Approach

Each of the 5 workflow phase docs gains a uniform "Per-iteration session-memory commit cadence" rule co-located with the doc's own MEMORIZATION / EVALUATION boundary. The rule reads (substance — exact phrasing is a Planning / Execution concern, not a Preparation design decision):

> After every iteration's MEMORIZATION completes (PASS, REVISE, or FAIL), the manager creates a session-memory commit on the worktree branch with the format:
>
> `chore(session): record <loop> iter{n} memory`
>
> followed by the canonical AI-Provenance-Record trailer per `git/conventions.md:116-119`. Commit is `git -C "$worktreePath" commit` to keep history on the worktree branch (per T1's worktree-first lock).

The 5 target files (canonical paths under workspace `.claude/`):

| # | File | Loop |
|---|---|---|
| 1 | `.claude/skills/orchestration/workflow/ideation.md` | Ideation |
| 2 | `.claude/skills/orchestration/workflow/preparation.md` | Preparation |
| 3 | `.claude/skills/orchestration/workflow/planning.md` | Planning |
| 4 | `.claude/skills/orchestration/workflow/execution.md` | Execution |
| 5 | `.claude/skills/orchestration/workflow/wrap-up.md` | Wrap-up |

Mirror propagation: per the iter2 corrected lock (`decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`), the mirror at `.gobbi/projects/gobbi/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` is the canonical storage; the workspace paths above are symlinks resolving to those same physical files. Editing either path edits the same file; no separate mirror-edit is needed.

## Scenarios

- **G-1 (canonical)** — Executor implementing T1-I-T1.f opens each of the 5 files, inserts the per-iter cadence rule in the MEMORIZATION section, runs `git diff` to verify all 5 are touched. Diff shows changes only at the canonical mirror path (`.gobbi/projects/gobbi/skills/orchestration/workflow/...`) because the workspace path is a symlink.
- **E-1 (verification gate)** — Smoke test T1-I-T1.h's branch-name regex check passes; a separate sanity grep confirms all 5 phase docs contain the literal commit-subject pattern `chore(session): record .* iter.* memory`. Grep against either path returns the same hits.
- **F-1 (off-by-one)** — Executor scans `ls .claude/skills/orchestration/workflow/` (7 files: 5 loop + `evaluation.md` + `memorization.md`) and accidentally edits all 7 instead of the 5 loop docs. Mitigated by this file's explicit enumeration of the 5 loop docs only. See "Excluded files + rationale" below.

## Validation

Per file: `grep -l "chore(session): record .* iter.* memory" .claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` returns all 5 paths.

Overall T1-I-T1.f completion: the 5-file set carries the cadence rule.

## Trade-offs

- **Optimized**: removes Planning-time ambiguity by naming the file set explicitly; one staging file is much cheaper than re-deriving via directory scan in every Planning decomposition.
- **Sacrificed**: this design file becomes stale if `.claude/skills/orchestration/workflow/` adds or removes a phase doc. Acceptable because the 5-phase set is fixed by the 5 productive steps + Wrap-up of the gobbi workflow (Configuration is CLI init, not a workflow doc) — change pressure is near-zero.

## Open issues

None within Preparation scope. The cadence rule's exact phrasing and placement within each phase doc is a Planning / Execution concern.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`. D-4 lock in the Ideation PASS artifact; gap analysis in Preparation rawdata; the user confirmed generating this enumeration file rather than deferring.

---

## Excluded files + rationale (added iter2)

Both iter1 evaluators flagged that `.claude/skills/orchestration/workflow/` contains **7 files**, not 5. Empirical re-verification (iter2):

```
$ ls .claude/skills/orchestration/workflow/
evaluation.md  execution.md  ideation.md  memorization.md  planning.md  preparation.md  wrap-up.md
```

The 2 files NOT included in T1-I-T1.f's targeted set are:

| File | Why excluded |
|---|---|
| `evaluation.md` | Cross-cutting sub-phase document shared by all 5 loop docs. The per-iter commit cadence rule (T1-I-T1.f decision D-4) is applied at the **loop level** — each loop's MEMORIZATION phase emits the commit. `evaluation.md` describes the EVALUATION sub-phase that runs inside each loop; it has no MEMORIZATION phase of its own and no iter cadence at the file level. Editing `evaluation.md` to carry a per-iter commit rule would duplicate the rule (5x — once for each loop that runs evaluation) and break the single-source-of-truth shape of `evaluation.md`. |
| `memorization.md` | Same rationale. `memorization.md` is the cross-cutting sub-phase doc describing MEMORIZATION procedure; it is loaded BY each loop's own phase doc, not invoked at its own iter cadence. The commit-cadence rule is per-loop, and each of the 5 loop docs references `memorization.md` for the procedure — adding the cadence rule to `memorization.md` itself would create the same duplication issue. |

**Substance of the per-iter cadence rule** (from D-4 of the Ideation artifact + the "Approach" section above):

Per-iter commit cadence per T1-I-T1.f applies to the 5 **loop** docs (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`). Each loop's MEMORIZATION phase emits the commit. Sub-phase docs (`evaluation.md`, `memorization.md`) don't have iters of their own — the iter cadence belongs to the loops that invoke them.

If a future task wants to document the cadence pattern in one place for cross-reference, the natural home is `memorization.md`'s "Output paths" section (which already enumerates the per-iter `session.json` upserts) — but T1-I-T1.f scope is exactly the 5 loop docs and excludes that cross-reference enhancement.

**Planning verification gate** (recommended for the T1 task brief): the smoke test should grep BOTH for the cadence pattern presence in the 5 loop docs AND for its **absence** in `evaluation.md` / `memorization.md`, to catch accidental over-edit:

```
# Expect: 5 matches (one per loop doc)
grep -l "chore(session): record .* iter.* memory" \
  .claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md

# Expect: 0 matches (sub-phase docs should NOT carry the rule)
grep -lE "chore.session.: record .* iter" \
  .claude/skills/orchestration/workflow/{evaluation,memorization}.md
```
