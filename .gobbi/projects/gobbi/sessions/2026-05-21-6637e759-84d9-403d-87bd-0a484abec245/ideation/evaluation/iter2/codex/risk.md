# Ideation iter2 — Risk perspective (codex)

## Stage 0 Artifact Summary

The artifact plans an intentionally destructive sweep whose risk controls are a pre-reset tag, user-locked force-delete authorization, worktree-before-branch ordering, tracked-vs-untracked command separation, symlink target preservation, and a terminal gate before deleting the CLI's live bare-UUID session directory. The central risk question is whether those controls are concrete enough to prevent unrecoverable or confusing state loss.

## Stage 1 Locked Frame

- Scenario R1: Rollback remains possible after each destructive phase.
  - Checklist: pre-reset tag exists locally and remotely before deletion; PR can be abandoned pre-merge; post-merge can be reverted.
- Scenario R2: Symlink deletion does not delete targets.
  - Checklist: `.codex/{agents,skills,...}` are removed as symlinks only; `.claude/agents/*` and `.claude/skills/*` targets under `.gobbi/projects/gobbi/{agents,skills}` survive.
- Scenario R3 (adversarial): The bare-UUID session dir is deleted before durable session state can be recovered.
  - Checklist: the SHA gate is satisfiable; filesystem-only session.json divergence is either committed or explicitly accepted; failed gate requires NEEDS_CONTEXT.
- Scenario R4 (adversarial): Branch cleanup fails after worktree cleanup partially succeeds.
  - Checklist: `git worktree remove` is verified before `git branch -d/-D`; a failure path says stop, re-run `git worktree list`, and do not force branch deletion blindly.
- Scenario R5: `gh pr merge --squash --delete-branch` does not merge stale or unexpected head.
  - Checklist: reviewed head SHA is captured or rechecked before merge; post-merge verification confirms branch deletion and expected squash.

## Inherited Iter1 Findings

- F-R-01 (`.codex/` symlink-target dependency): addressed. Stage B line 250 explicitly says `git rm -r` removes `.codex` symlinks, not targets.
- F-R-02 (mistake files deleted): disputed/addressed by user lock. Iter2 records the accepted trade-off at lines 469-473 and says the lessons are encoded at lines 494-496.
- F-R-03 (verification gate honesty): superseded, not fully addressed. The new gate is more concrete but creates an impossible SHA condition.
- F-R-04 (remote tag irreversibility): deferred/n/a for solo repo. The user authorized Q-F; severity remains Low.

## Stage 2 Findings

### F-CX-R-01 — The bare-UUID deletion gate can fail closed forever or be rationalized open

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Lines 292-296 say E.2 must not proceed until the sweep commit exists and that commit's SHA is present in the surviving `session.json`. As written, the only commit that satisfies "contains the staged session dir" cannot also contain its own final SHA in that staged `session.json`. The draft then instructs NEEDS_CONTEXT if either condition fails.
- **Why-it-matters**: This is a safety-critical destructive gate. A disciplined executor will stop forever; an undisciplined one may rationalize the gate and delete the live bare-UUID dir anyway. This repeats the class of risk the draft says it is preventing with `executor-rationalized-failing-verification-gate.md`.

### F-CX-R-02 — Branch deletion failure recovery is implied, not specified

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: The draft correctly orders `git worktree remove` before `git branch -d/-D` at lines 301-307 and invariant #3 at line 322. It does not say what to do if a `git worktree remove` command fails or leaves a registration behind before the later branch deletion commands run.
- **Why-it-matters**: `git branch -D` will still refuse a branch checked out by a registered worktree. The safe recovery is to stop, inspect `git worktree list`, resolve the worktree registration, and only then retry branch deletion. Without that instruction, an executor can turn a recoverable partial cleanup into a confusing mid-stage failure.

### F-CX-R-03 — PR merge head race is not gated

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Stage G merges with `gh pr merge --squash --delete-branch` at line 314 and verifies broad success criteria at line 316, but does not capture/re-check the PR head SHA before merging.
- **Why-it-matters**: Low-probability in a solo repo, but destructive sweeps should defend against stale head merges. A head-stability check would make the post-merge "one new commit" criterion prove the right content, not just the right count.

## Per-perspective Verdict

REVISE. F-CX-R-01 is High/100.

## Must-Preserve

- Preserve the pre-reset tag and remote push before any sweep branch deletion.
- Preserve `.codex` symlink-target semantics and `.claude/{agents,skills}` survivor validation.
- Preserve user pre-authorization split: `-d` for ancestor branches, `-D` only for the two named non-ancestor branches.
