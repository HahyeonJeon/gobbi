---
archived_at: 2026-05-25
archived_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
archive_reason: shipped
original_path: backlogs/git-skill-stale-row-5-5-worktree-reference.md
shipped_in: PR #270 (merged 925f641 on develop)
superseded_by: null
related: []
---

# Archive entry — git-skill-stale-row-5-5-worktree-reference

## Original
Path: `backlogs/git-skill-stale-row-5-5-worktree-reference.md`
Original creation date: `2026-05-25`

## Reason
Bundle C's T02 (commit `2b537ae`) reordered the `orchestration/SKILL.md` Step 1 table — worktree creation moved from row 5.5 to row 5, and state.json init moved to row 5.5. However, `git/SKILL.md` lines 155 and 157 retained the old "Configuration row 5.5" label for the P2 invocation point. Follow-up FU-1 in PR #270 reconciled this drift: `git/SKILL.md` corrected to "row 5"; `gobbi/SKILL.md:91` corrected (also had the wrong row reference plus an ordering error); the D-1 memorial (`features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md`) was kept as historical record with a forward-pointer blockquote per user decision; and a tree-wide FU-1c sweep corrected the same stale label in 5 workflow sub-docs under `orchestration/workflow/`.

## Cross-references
- Commit `4a396ed` — FU-1 git/SKILL.md + gobbi/SKILL.md corrections + D-1 memorial forward-pointer
- FU-1c sweep commits — 5 workflow sub-docs corrected (included in PR #270 bundle)
- PR #270 (merged `925f641` on develop)
