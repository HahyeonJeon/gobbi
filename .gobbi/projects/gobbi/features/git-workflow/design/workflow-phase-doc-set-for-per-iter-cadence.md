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

## Context

Design Decision D-4 (per-iteration session-memory commit cadence) calls for adding the `chore(session): record <loop> iter{n} memory` commit rule to "all 5 workflow phase docs" — but D-4 itself refers to "5 phase docs" without listing the exact file set. The `.claude/skills/orchestration/workflow/` directory actually holds **7** files: the 5 loop docs plus the two cross-cutting sub-phase docs `evaluation.md` and `memorization.md`. Anyone implementing D-4 without an explicit enumeration would have to re-derive the target set from the directory listing and risks an off-by-one — missing a loop doc, or over-editing the two sub-phase docs. This design closes that ambiguity by naming the 5 target files explicitly and stating why the other 2 are excluded.

## Approach

Each of the 5 workflow loop docs gains a uniform "Per-iteration session-memory commit cadence" rule, co-located with the doc's own MEMORIZATION boundary. The rule's substance (exact phrasing is an implementation concern):

> After every iteration's MEMORIZATION completes (PASS, REVISE, or FAIL), the manager creates a session-memory commit on the worktree branch with the format:
>
> `chore(session): record <loop> iter{n} memory`
>
> followed by the canonical AI-Provenance-Record trailer per `git/conventions.md`. The commit is `git -C "$worktreePath" commit` to keep history on the worktree branch (per the worktree-first lock).

The 5 target loop docs (canonical paths under workspace `.claude/`):

| # | File | Loop |
|---|---|---|
| 1 | `.claude/skills/orchestration/workflow/ideation.md` | Ideation |
| 2 | `.claude/skills/orchestration/workflow/preparation.md` | Preparation |
| 3 | `.claude/skills/orchestration/workflow/planning.md` | Planning |
| 4 | `.claude/skills/orchestration/workflow/execution.md` | Execution |
| 5 | `.claude/skills/orchestration/workflow/wrap-up.md` | Wrap-up |

Mirror propagation: per the mirror-canonical-symlinks policy (`decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`), the mirror at `.gobbi/projects/gobbi/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` is the canonical storage; the workspace paths above are symlinks resolving to those same physical files. Editing either path edits the same file; no separate mirror-edit is needed.

## Rationale

The cadence rule is applied at the **loop level** — each loop's MEMORIZATION phase emits the commit — so the rule belongs only on docs that own a MEMORIZATION phase. The 5-loop set is fixed by the gobbi workflow's 5 productive steps plus Wrap-up (Configuration is CLI init, not a workflow doc), so an explicit enumeration is durable: change pressure on the set is near-zero. Naming the files in one place is far cheaper than forcing every reader of D-4 to re-derive the set by directory scan, and it prevents the over-edit failure (touching all 7 files).

## Alternatives considered

- **Leave the file set implicit ("all 5 workflow phase docs") and let each implementer re-derive it** — rejected: the directory holds 7 files, not 5, so re-derivation risks an off-by-one in either direction (missing a loop doc, or wrongly editing the two sub-phase docs).
- **Apply the cadence rule to all 7 files in the directory** — rejected: `evaluation.md` and `memorization.md` are cross-cutting sub-phase docs with no MEMORIZATION phase or iter cadence of their own (see Consequences); adding the rule there would duplicate it 5× and break their single-source-of-truth shape.
- **Document the cadence in one shared place (`memorization.md`) for cross-reference** — deferred, not adopted now: a future task could add such a cross-reference in `memorization.md`'s output-paths section, but it is out of scope for the enumeration this design locks.

## Consequences

The 5 loop docs carry the cadence rule; the 2 sub-phase docs are excluded for these reasons:

| File | Why excluded |
|---|---|
| `evaluation.md` | A cross-cutting sub-phase doc shared by all 5 loops. It describes the EVALUATION sub-phase that runs inside each loop; it has no MEMORIZATION phase of its own and no iter cadence at the file level. Carrying a per-iter commit rule here would duplicate it once per loop and break the single-source-of-truth shape. |
| `memorization.md` | Same rationale: the cross-cutting doc describing the MEMORIZATION procedure, loaded BY each loop's own phase doc rather than invoked at its own iter cadence. The cadence rule is per-loop; each of the 5 loop docs references `memorization.md` for the procedure. |

Verification: `grep -l "chore(session): record .* iter.* memory" .claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` returns all 5 paths; the same grep against `{evaluation,memorization}.md` returns 0 matches (catches accidental over-edit). Grep against either the workspace or the canonical mirror path returns the same hits because the workspace paths are symlinks. This design becomes stale only if the workflow gains or loses a phase doc — an event with near-zero change pressure.

## Related

- `design/per-iteration-session-commit-cadence.md` — Design Decision D-4, the cadence this enumeration implements.
- `decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` — the mirror-canonical-symlinks policy this design relies on.
- `../../../notes/2026-05-23-workflow-phase-doc-set-enumeration.md` — the project-level session journal of how this enumeration evolved (the 7-vs-5 file-count correction).

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`.
