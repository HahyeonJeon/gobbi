# Planning iter1 — Risk perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: What breaks if the plan itself is wrong? Order risk, dependency risk, rollback granularity, blast radius.

**Memory reads**: `principles` (Iron Law 11), `skills/planning/evaluation.md` § Risk, mistake `executor-rationalized-failing-verification-gate.md` (Iron Law 11), `skills/git/SKILL.md` § Forbidden Operations.

## Locked Frame (Stage 1)

Scenarios:
1. Mid-plan task failure has a clear rollback boundary.
2. Tasks touching shared infrastructure are isolated.
3. Tasks touching public interfaces are isolated with consumer-side migration.
4. Plan ordering is robust to interruption.
5. High-blast-radius tasks are gated.
6. Plan total file-touch count matches Ideation Scope Contract.
7. (Adversarial) A task silently widens scope by adding to its outputs.

## Per-scenario per-check results

**S1 — rollback boundary**

Task 01: tag is lightweight and reversible (`git tag -d pre-reset-2026-05-21` + `git push origin :refs/tags/pre-reset-2026-05-21`). PASS.

Task 02: Destructive single-PR sweep. Rollback if Task 02 fails mid-stream:
- Pre-commit: `git checkout -- .` would discard staged + working-tree changes IF the worktree state is clean of staging. Forbidden Operations forbid `git checkout .` / `git restore .` (line 114 of git/SKILL.md) without user approval.
- Post-commit: rollback is the manager-ops side; the executor returns NEEDS_CONTEXT and the manager `git worktree remove`s the sweep worktree (commits preserved in reflog via `--force`-NOT-allowed semantics; tree state lost only if commit boundaries weren't reached).
- The pre-reset tag (Task 01) is the canonical rollback anchor for the post-merge state. ACCEPTABLE.

**S2 — shared infra isolation**

The sweep touches `.gitignore` (root) and `.gobbi/.gitignore`. These are shared-infra. Stage D bundles them with the gitignore-edit commit (sweep-branch commit 3). Other tasks don't touch them. ISOLATED. PASS.

**S3 — public interface impact**

No public API; `packages/` (the runtime) is wholesale deleted (Q1). Out-of-scope per Scope Contract — "the rebuild is a follow-on session". No consumer migration applies. PASS.

**S4 — interruption robustness**

If Task 02 is interrupted after Stage B's commit but before Stage C's, the sweep branch tip carries Stage B's destructive deletes — recoverable via `git worktree remove + git push origin :<sweep-branch>` (manager). The pre-reset tag preserves the pre-sweep state. ACCEPTABLE.

If interrupted between E.1 (uncommitted-or-amended) and the E.2 gate, the gate would fail (`git ls-tree` returns empty) and emit NEEDS_CONTEXT. The session dir's contents are in the executor's worktree, not yet in the tree of `<sweep-branch>`. The mistakes apply: do not rationalize, escalate. The executor would NEEDS_CONTEXT correctly. ACCEPTABLE — but see F-CL-S-01 (Structure) for the commit-boundary ambiguity making this state more likely.

**S5 — high-blast-radius gating**

Stage B (deletes 9 paths including `packages/`, `.codex/`, `.claude/project/gobbi/`), Stage C (deletes adversarial-review, wipes 13 subdirs + 40 mistakes), Stage E.1 (FS-deletes 52 session dirs), Stage E.2 (FS-deletes bare-UUID dir), Stage F (worktree-remove + branch-delete with `-D` force) are ALL high-blast-radius. Single executor lane, sequential. Gating:
- Pre-Stage-E.2 gate (Success #13) is explicit.
- Pre-merge gate (Manager-ops §7 CI green, §8 head-match) is explicit.
- Pre-Task-01: pre-reset tag created and pushed BEFORE any deletion (rollback anchor).

ACCEPTABLE — three independent gates (tag-as-anchor, E.2 gate, merge head-match) carry the blast-radius management.

**S6 — file-count vs Scope Contract**

Scope Contract enumerates ~10 root-level deletions + .claude/project/gobbi/ + .codex/ + .claude/CLAUDE.md 2-line edit + ~13 placeholder dirs + adversarial-review delete + 53 sibling session dirs + 2 worktree removes + 4 local branches + 2 gitignore edits + 1 tag + 1 README stub at .gobbi/projects/gobbi/. Plan Task 02 `files:` enumerates approximately the same set. Counts align. PASS.

**S7 — silent widening (adversarial)**

Task 02's `outputs:` are `sweep-commits-on-<sweep-branch>-in-worktree`, `14-stub-readmes`, `tracked-session-dir-on-<sweep-branch>`, `bare-uuid-dir-deleted-from-fs`. Task 01's `outputs:` are the two tag identifiers. No overlap. No silent widening. PASS.

## Typed findings

### F-CL-R-01 — `git branch -D pr-fin-2-decisions-hold` and `git branch -D redesign/v050-ideation` use `-D` (force) — Forbidden Operations row says forbidden without explicit user request
- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: `skills/git/SKILL.md` line 117: "`git branch -D` on unmerged branches | Discards branch tip irreversibly | `git branch -d` (only succeeds if merged)". This is a Forbidden Operation requiring "explicit user request via AskUserQuestion (Always-Ask category)". The Plan (draft-iter1.md line 124-125) authorizes these via "Q-G pre-authorized" — and Q-G in scope-contract.md line 81 confirms: "`git branch -D` pre-authorized for `pr-fin-2-decisions-hold` and `redesign/v050-ideation`." So the user HAS pre-authorized. PASS on the audit trail.
- **Why it matters**: The pre-reset tag at `487fc35` only preserves develop tip — NOT the branch tips of `pr-fin-2-decisions-hold` and `redesign/v050-ideation`. Once `-D` runs, those branch tips are gone (reachable in reflog for ~90 days by default but not anchored anywhere durable). For a destructive cleanup this is the intended semantics, but it's worth flagging that the rollback anchor (the tag) does NOT cover those branches.
- **Suggested direction**: Note in the Plan (or in Manager-ops §1's issue body) that the pre-reset tag covers develop tip ONLY; the 4 deleted branches' tips live in reflog only. Optionally: capture the 4 branch tips as additional lightweight tags (`pre-reset-<branch-name>-2026-05-21`) before deletion. Not user-requested; offer as advisory.

### F-CL-R-02 — Stage E.2 FS delete of `.gobbi/projects/gobbi/sessions/6637e759-.../` is irreversible and gated only by `git log` + `git ls-tree`
- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: The bare-UUID dir is gitignored (per Stage A scan), so its contents are NOT in any git history before deletion. The Q-Gate-Redesign gate verifies that the KEPT date-prefixed dir is on the sweep branch tip — but does NOT verify the bare-UUID dir's contents are mirrored into the date-prefixed dir. Per Scope Contract line 41 / Q-B, the bare-UUID dir is "the CLI-bootstrapped" companion of the date-prefixed session, so presumably its contents are duplicates. But this is not VERIFIED by the gate.
- **Why it matters**: If the bare-UUID dir contained any unique data (a partial session.json write, an event that was emitted to the CLI artifact but not yet promoted to the kept date-prefixed dir), the rm -rf in Stage E.2 destroys it. The gate only verifies the kept dir exists in tree — not that nothing unique would be lost.
- **Suggested direction**: Add a pre-deletion diff/verify step: `diff -rq .gobbi/projects/gobbi/sessions/6637e759-.../ .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ | head -20` to surface any unique content. If diff is empty, proceed. If non-empty, NEEDS_CONTEXT. (This addresses the Q-Gate-Redesign's original "circularity" concern from a different angle.)

### F-CL-R-03 — `find ... -mindepth 1 -type d -empty -delete` on `.gobbi/projects/gobbi/worktrees/` after worktree-removes can delete parent dirs in unexpected order
- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 25
- **Severity**: Low
- **Evidence**: Stage F runs `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete` after the two `git worktree remove`s. The path `refactor/257-skills-agents-rules` has a parent `refactor/`. After removing the leaf, `find -empty -delete` walks bottom-up by default and removes `refactor/` if empty. ACCEPTABLE — that's the intended behavior, called out by iter2 L-1.
- **Why it matters**: If the executor accidentally runs the find from the wrong directory (e.g., main tree vs worktree), the `-mindepth 1` protects against deleting `.gobbi/projects/gobbi/worktrees/` itself. The `S14` iter2 fix is correct.
- **Suggested direction**: None — the iter2 L-1 + S14 fix already addresses the recursive-delete risk.

### F-CL-R-04 — Manager-ops §8 "non-zero exit → no retry, no rationalization" lacks a recovery procedure
- **Type**: checklist_gap
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Manager-ops §8 (draft-iter1.md line 333): "Non-zero exit → no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); manager re-contracts with user." OK, but the Plan does not specify what state the worktree + sweep branch are in after a non-zero merge: the branch is pushed, the PR exists, possibly with stale HEAD. The user is presented with the failure but no playbook ("retry with fresh head-SHA after re-running CI" vs "force-close PR and re-open" vs "manual rebase").
- **Why it matters**: For the destructive single-PR sweep, the "atomic-guard merge failed because PR head moved" scenario is genuinely possible (e.g., a Codex / parallel session pushed to the sweep branch). The Plan correctly does NOT silently retry — but the manager and user are left without a defined next step.
- **Suggested direction**: Add a one-line recovery sketch to Manager-ops §8 ("Recovery: re-capture HEAD_SHA after CI re-runs against the moved head; if PR head moved due to scope drift, escalate to Ideation re-open."). Optional.

## Low-confidence appendix

- The cumulative file-touch count for Task 02 is high (~50 tracked + ~52 FS-only + 4 branches + 2 worktrees + 13 stub Reads + 2 gitignore + 1 CLAUDE.md edit). All explicitly enumerated. The single-PR squash-merges them into 1 commit on develop — bisect granularity exists only on the sweep branch's 4-5 commits. Low confidence on whether bisect would actually be useful for this destructive sweep; M-1 squash decision was already locked in Ideation.

## Must-preserve list

- The pre-reset tag as rollback anchor BEFORE any deletion (Task 01 → Task 02 dependency).
- The atomic-guard `--match-head-commit "$HEAD_SHA"` merge as the terminal gate.
- The "no retry, no rationalization" stance on §8 failure.
- The single-PR atomic semantics (no multi-PR split risking partial-merge state).

## Verdict: REVISE

F-CL-R-01 (Medium/75) — `git branch -D` carries irreversible blast radius; the rollback-anchor coverage of the pre-reset tag does NOT include those branch tips. User pre-authorized via Q-G, so it's not a contract violation — but the plan should make the limited rollback coverage explicit. Combined with F-CL-R-02 (Medium/50) on the E.2 FS-delete gate, the verdict is REVISE rather than PASS — neither finding is High enough to dominate, but together they suggest the Plan under-documents the irreversibility of the destructive operations.
