# Ideation iter1 — Structure perspective (claude)

## Artifact Summary + Memory reads

See `project.md` for the canonical Artifact Summary and Memory reads register; not repeated here.

Structure-specific reads: re-read Implementation Checklist Stages 0 → G (artifact lines 199–275) and Design D1–D9 (lines 280–344) for ordering invariants.

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` § Structure (cohesion, mapping, boring-by-default, 2-week test, testability, adversarial-decomposition) carried through. Updates:

- **scenario_gap S-STR-NEW-1**: "Stage ordering invariants 1–5 (artifact lines 271–275) are individually verified by a check the Plan/Execute can run, not just declared." Adversarial.
- **scenario_gap S-STR-NEW-2**: "Worktree dir path discrepancy: `git worktree list` reports `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` (a SUBdir of `worktrees/refactor/`), but the artifact's Stage F has only one `git worktree remove` for that path with no rmdir for the `worktrees/refactor/` parent — verify the cleanup leaves no empty intermediate dirs."

Cross-cutting matrix: Observability `not-applicable` (one-shot delete); Supply chain `not-applicable` (no new deps).

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Components cohere | Unidirectional coupling | YES | Stages are forward-only; tag → branch → deletes → gitignore → session-add → worktree+branch → PR |
| Every check item → structural element | Library/pattern explicit | YES | Each Stage cites the specific git/fs operation |
| Boring-by-default | Alternatives documented | YES | D5 considers fast-forward merge alternative for force-deletes and rejects with reason |
| 2-week smell test | Self-evident from artifact alone | YES | Comprehensive Decisions Log; mistakes consulted explicit |
| Testability | Verification hooks named | YES | D2 enumerates 15 verifications |
| Circular dep / hub | Cross-module data flow acyclic | YES | No shared-state hub; stages are sequential |
| **S-STR-NEW-1 ordering invariants verified** | Each of 5 invariants has a Plan-runnable check | PARTIAL — see F-S-01 |
| **S-STR-NEW-2 worktree path cleanup** | `worktrees/refactor/` intermediate dir cleaned | PARTIAL — see F-S-02 |

## Typed findings

### F-S-01 — Stage D ↔ Stage E "same commit" coupling is structurally ambiguous

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: Artifact lines 239 (Stage D header: "sweep commit 3 [ORDER CRITICAL]") and 246 (Stage E header: "sweep commit 3 (continuation; same commit as Stage D) [ORDER CRITICAL]") declare Stages D and E share **one** commit. But Stage E contains:
  - `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-...` (a tracked-add that needs Stage D's gitignore edit staged AT LEAST, ideally committed)
  - `rm -rf .../sessions/<52 dirs>` (untracked deletes — not staged at all)
  - `rm -rf .../sessions/6637e759-...` (the LAST bullet, an untracked delete)
  
  Issue: untracked `rm -rf` operations don't enter a commit — they're filesystem-only. But the artifact says Stage E is "the continuation; same commit as Stage D". An executor reading this could plausibly try `git add` on the 52 deletions or try to make the bare-UUID delete part of the commit. More importantly, the "[ORDER CRITICAL]" annotation conflates two distinct orderings:
  1. **Gitignore edit MUST precede `git add` of the session dir** (artifact's S5 + invariant #2) — correct
  2. **The bare-UUID `rm -rf` MUST be LAST after the workflow's session-memory writes are committed** (artifact's Q-B + S6 + invariant #4)
  
  These are not the same ordering. Invariant #2 is intra-Stage D→E; invariant #4 is Stage E's internal terminal step. By bundling them under "same commit 3", the artifact obscures that the bare-UUID delete is a post-commit FS operation, not a commit content. The executor may also create the sweep PR before the bare-UUID delete runs (since "commit 3" is "done" once the gitignore edits + session-add are committed).
- **Why it matters**: This is the load-bearing ordering claim of the entire artifact. If the executor mis-sequences, either (a) the session dir doesn't enter the index (gitignore edit not staged first → `git add` silently no-ops on still-ignored paths), or (b) the bare-UUID dir is deleted while the CLI is writing to it. Both failure modes are explicitly what Q-B + S5 + S6 were designed to prevent. Per `executor-rationalized-failing-verification-gate.md`, the executor must not rationalize ambiguous spec.
- **Suggested direction**: split Stage E into two sub-stages:
  - Stage E.1 (part of "commit 3" with Stage D): `git add <kept session dir>` + the 52 untracked-dir `rm -rf` (these are not in the commit but are FS-side-effects safe to run pre-commit since they're already untracked).
  - Stage E.2 (post-commit, post-push, possibly post-merge): the bare-UUID `rm -rf` as a terminal Memorization/Wrap-up step *after* the PR's content is sealed. Make explicit that this delete is NOT part of any commit.

### F-S-02 — `worktrees/refactor/` parent dir not cleaned in Stage F

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: Verified `git worktree list` returns `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` (nested under `refactor/`). After `git worktree remove` of that path, the parent `worktrees/refactor/` directory remains (verified via `ls .gobbi/projects/gobbi/worktrees/`). Artifact line 257 says `find .gobbi/projects/gobbi/worktrees/ -type d -empty -delete to clean up empty parent dirs (preserve worktrees/ itself)` — this is technically correct (`-empty -delete` is depth-first by default), but the wording "preserve `worktrees/` itself" doesn't make explicit *how* `worktrees/` is preserved when it would also become empty. GNU `find -delete` will attempt to delete `worktrees/` too if it's empty, since `-delete` implies `-depth` and `worktrees/` matches `-type d -empty` after children are removed.
- **Why it matters**: After the sweep, `worktrees/` should remain (per Scope Contract Success #3: "worktrees/ (empty)"). If `find ... -empty -delete` runs from `worktrees/`, GNU `find` will delete `worktrees/` itself, breaking Success #3.
- **Suggested direction**: change the command to `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete` (the `-mindepth 1` prevents the starting dir from being deleted).

### F-S-03 — Stage B `rm -rf node_modules/` is correct but Stage B is described as "sweep commit 1" with no explicit note that untracked deletes don't enter commits

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Artifact lines 215–226 list a mix of `git rm` (tracked) and `rm -rf` (untracked) operations under "sweep commit 1." A naïve executor may try to add the untracked deletes (`.agents/`, `node_modules/`) to the commit, which won't work (they were never in the index). The artifact's Critical Invariant #5 (line 275) does note "git rm for tracked deletes vs rm -rf for untracked — explicitly distinguished in each stage above" — partial protection.
- **Why it matters**: Minor — the executor likely figures it out, but the docs-clarity ratio is below the artifact's other sections.
- **Suggested direction**: add a one-line preface to each stage clarifying which bullets contribute to the commit's diff and which are pure FS hygiene.

## Low-confidence appendix

- (25) — `find -delete` on macOS BSD `find` lacks `-delete`; gobbi is Linux-only per user solo-context, so not applicable.

## Must-preserve list

- The five-invariant summary at lines 271–275 is the strongest structural anchor in the artifact — keep it; refine its language per F-S-01.
- `git rm` vs `rm -rf` discrimination per item.
- Stage 0 (tag-before-anything) placement is correct.

## Verdict

REVISE — F-S-01 (High/75) triggers High≥50 → REVISE.
