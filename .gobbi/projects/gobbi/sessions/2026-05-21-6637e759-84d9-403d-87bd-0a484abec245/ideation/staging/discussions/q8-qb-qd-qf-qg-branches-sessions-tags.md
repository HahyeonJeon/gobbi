---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: branches-sessions-tags-worktree
rounds: [2, "3a", "3b"]
locks: [Q8, "Q-B", "Q-D", "Q-F", "Q-G"]
---

# Branches, Session Dirs, Tags, and Worktree Cleanup

## Discussion Summary

**Q8 — Local branches + session dir sweep (Round 2)**

Manager asked which branches and session dirs to delete. User chose: delete 4 local branches (`fix/257-complete-mirror-sync`, `pr-fin-2-decisions-hold`, `redesign/v050-ideation`, `refactor/257-skills-agents-rules`); keep `main` and `develop`; delete all 53 other session dirs under `.gobbi/projects/gobbi/sessions/` — keep only the current session `2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/`.

**Q-B — CLI bare-UUID sibling session dir (Round 3b)**

The CLI runtime created a bare-UUID sibling dir `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` (without the date prefix). This is CLI drift — the spec requires date-prefixed dirs. Manager asked whether to delete it with the 52 legacy dirs. User confirmed: delete it now. Risk accepted: CLI may need to be re-bootstrapped if it depends on the bare-UUID dir mid-workflow. Mitigation captured in Implementation Checklist (delete bare-UUID dir LAST in Stage E.2, only after the sweep commit is confirmed on the branch).

**Q-D — `.claude/project/gobbi/` deletion (Round 3a)**

The v0.4-era `.claude/project/gobbi/` tree is not part of the symlink farm (not symlinked from `.codex/`). Manager recommended deleting it in the sweep. User confirmed: `git rm -r .claude/project/gobbi/`.

**Q-F — Pre-sweep archival tag (Round 3a)**

Manager recommended creating a lightweight tag at `develop` HEAD `487fc35` named `pre-reset-2026-05-21` before the sweep, pushed to origin. User confirmed. Reversibility: `git checkout pre-reset-2026-05-21` recovers the full pre-reset state from any clone.

**Q-G — Pre-authorize `git branch -D` (Round 3a)**

`pr-fin-2-decisions-hold` and `redesign/v050-ideation` are not ancestors of `develop` or `main` (squash-merged). `git branch -d` would refuse. The git skill's Forbidden Operations gate requires "Always Ask" for `git branch -D`. Manager asked user to pre-authorize both. User confirmed: both get `git branch -D`. Executor proceeds without per-branch interruption.

## Locked Decisions

| Lock | Decision |
|------|----------|
| Q8 | Delete 4 branches; delete all 53 legacy session dirs; keep current session dir |
| Q-B | Delete CLI bare-UUID sibling dir `6637e759-...` (LAST, after sweep commit confirmed) |
| Q-D | Delete `.claude/project/gobbi/` via `git rm -r` |
| Q-F | Create `pre-reset-2026-05-21` lightweight tag at `487fc35`, push to origin |
| Q-G | Pre-authorize `git branch -D` for `pr-fin-2-decisions-hold` and `redesign/v050-ideation` |

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage 0 (tag), Stage E (session dir delete), Stage F (branch delete)
- `ideation/artifacts/scope-contract.md` § Decisions Locked
- `ideation/rawdata/discussion-log.md` § Rounds 2, 3a, 3b
