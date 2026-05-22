---
loop: ideation
iter: 4
artifact_type: handoff
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/artifacts/resolution-log.md
  - ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md
---

# Ideation Handoff — Preparation Loop

The Ideation Loop has closed at iter4 PASS. The Preparation Loop inherits the following locked Idea: a destructive single-PR sweep to reset the gobbi repo to a clean baseline before bottom-up rebuild. All 19 user-confirmed locks are recorded in `ideation/artifacts/scope-contract.md`; the Implementation Checklist (Stages 0–G) is in `ideation/artifacts/implementation-checklist.md`. The survivor set inside `.gobbi/projects/gobbi/` is `agents/`+`skills/`+`rules/`+`sessions/2026-05-21-6637e759-.../`+`worktrees/`+`settings.json`; all 13 other subdirs become one-line placeholder READMEs; `adversarial-review/` is deleted entirely. The merge uses `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` (iter4 Q-iter4-Override — atomic head-match enforced server-side by gh 2.45.0+).

**Pre-reset tag**: lightweight tag `pre-reset-2026-05-21` at `487fc35` is created BEFORE the sweep branch opens and pushed to origin — this is the archival recovery point; audit it via `git rev-parse pre-reset-2026-05-21` during Preparation.

**Deferred finding for Planning**: F-CX-O4-01 (Codex iter4, Medium/75) flags a `--delete-branch` local cleanup wording mismatch — the gh CLI flag deletes both local and remote branch, but the draft mentions "remote only" + a separate `git branch -d <sweep-branch>`. This is below the REVISE threshold for Ideation but Planning should normalize the Stage G post-merge cleanup command against `gh --delete-branch` actual local behavior to prevent a false-alarm cleanup failure. Staged at `ideation/staging/decisions/gh-delete-branch-local-cleanup-wording.md` with `disposition: deferred`.

**Session-scoped backlog**: `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` documents the risk that a rebuilt CLI may regenerate `.gobbi/.gitignore` with the pre-reset policy. Per H-4, this backlog has no project-level promotion target after the sweep (the `backlogs/` dir becomes a placeholder under Q-A). It stays under the preserved session dir; the rebuild session must read it from `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` and update the regen template before shipping the new CLI.

**Dual-system anti-groupthink payoff**: the 4-iter campaign produced two divergence events — iter2 Codex caught the SHA-gate logical impossibility (Claude missed it); iter3 Claude supplied empirical refutation of the body-grep verify mechanism (Codex prescribed the fix). Both systems converged at PASS on iter4. See `ideation/artifacts/cross-system-divergence.md` for the full audit.

**Three mistake lessons encoded in the iter4 draft** (these files will be deleted by Stage C per H-2, but their lessons are baked into the Checklist): `executor-rationalized-failing-verification-gate.md` (Stage E.2 NEEDS_CONTEXT clause AND Stage G non-zero exit NEEDS_CONTEXT clause), `session-dir-naming-convention-uses-date-prefix.md` (M-3 explicit `c676684d-` naming), `manager-mispec-grep-c-for-occurrence-count.md` (D2 #16 `$`-anchored `grep -c` audit).
