# Project Perspective

## Stage 0 Artifact Summary

Reviewed `preparation/rawdata/draft-iter2.md` against `draft-iter1.md`, Codex iter1 `overall.md`, and the iter4 Ideation handoff. Iter2 is a surgical additive revision: it adds `## Pre-routed gaps for Planning`, updates the readiness summary, and adds an iter2 outcome entry. The new section explicitly covers F-CX-PREP-O-01 and F-CX-PREP-O-02.

Primary verification:

- `git ls-files | grep 'project.json'` returns `.gobbi/projects/gobbi/project.json`.
- Root `.gitignore` ignores `.gobbi/*` but re-includes `.gobbi/projects/`; it ignores sessions, rawdata, settings, worktrees, and tmp, not `project.json`.
- `git status --short | grep 'project.json\|marketplace.json'` returns ` D .claude-plugin/marketplace.json` and ` D .gobbi/projects/gobbi/project.json`.

## Stage 1 Locked Frame

Adversarial check: did iter2 actually address the two inherited Codex findings, or only paper over them? Project answer: it addressed them sufficiently for Preparation by converting both into explicit Planning constraints. F-CX-PREP-O-01 gives Planning two executable decomposition options and makes the constraint binding. F-CX-PREP-O-02 correctly identifies `project.json` as a tracked deleted file that Planning must include in the deletion inventory.

## Stage 2 Findings

- **Type:** accuracy note
  **Domain:** project state
  **Disposition:** new, documented, non-blocking
  **Confidence:** 75
  **Severity:** Low
  **Evidence:** Iter2 says `project.json` is a "staged deletion"; current porcelain output is ` D .gobbi/projects/gobbi/project.json`, meaning worktree-deleted but not index-staged. This does not invalidate the mitigation because `git add -A` will still pick up the tracked deletion, and iter2 correctly says no separate `rm` is needed.

## Stage 2 Step 3: Inherited Finding Disposition

- **F-CX-PREP-O-01:** Accepted and mitigated. Iter2 makes mistake-memory continuity a binding Planning constraint and gives two concrete remediations: recommended single-executor sweep or pre-Stage-C session snapshot plus post-Stage-C prompt override.
- **F-CX-PREP-O-02:** Accepted and mitigated. Iter2 requires Planning to augment the inventory with both `.claude-plugin/marketplace.json` and `.gobbi/projects/gobbi/project.json`; verification confirms `project.json` is tracked and deleted in the worktree, not gitignored.
- **F-CX-O4-01:** Preserved as the existing Ideation deferral to Planning for `gh --delete-branch` cleanup wording.

## Per-Perspective Verdict

**PASS.** No Critical >=75 or High >=50 finding remains. The only new issue is a low-severity wording imprecision about staging state.

## Must-Preserve

- Preserve all 19 locked Ideation decisions.
- Preserve the new Planning binding constraints for F-CX-PREP-O-01 and F-CX-PREP-O-02.
- Preserve the tracked-deletion inventory: both `.claude-plugin/marketplace.json` and `.gobbi/projects/gobbi/project.json`.
- Preserve `--match-head-commit "$HEAD_SHA"` and NEEDS_CONTEXT on merge failure.
