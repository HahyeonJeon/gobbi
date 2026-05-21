---
loop: planning
iter: 4
artifact_type: task-list
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/dependencies.md
  - planning/artifacts/agent-assignments.md
  - planning/staging/plans/main.md
  - planning/rawdata/draft-iter4.md
---

# Task List — Repo Reset (Planning iter4 PASS)

Two-task sequential DAG. All 19 Ideation locks + 12 D-PLAN decisions incorporated.

---

## Task 01 — `create-pre-reset-tag` (local-only)

```yaml
id: 01-create-pre-reset-tag
what: Create lightweight tag `pre-reset-2026-05-21` locally at `487fc35` (current develop tip). STOPS at "tag created locally" — push is MANAGER scope per `git/SKILL.md` § Role Boundaries (Push to remote = Manager; Subagent = Never).
traces-to:
  - "Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens"
  - "`git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required)"
  - "Verify (executor-local): `git rev-parse pre-reset-2026-05-21` → `487fc35`"
requires: []
files:
  - { path: "refs/tags/pre-reset-2026-05-21", op: create }
inputs: []
outputs:
  - tag-pre-reset-2026-05-21-local
verifies: |
  git rev-parse pre-reset-2026-05-21 == 487fc35 (locally — executor-verifiable)
  Note: `git ls-remote --tags origin | grep pre-reset-2026-05-21` is MANAGER-verified after manager push (see Manager pre-Task-02 op §1b).
```

**Anchor**: Implementation Checklist § Stage 0 (tag-create bullet) + Scope Contract § Q-F + Success Criterion #9 (local half).

**Scope boundary (executor stops here)**: Task 01 ends at local tag creation. The manager handles `git push origin pre-reset-2026-05-21` as Manager pre-Task-02 op §1b before delegating Task 02.

---

## Task 02 — `cleanup-sweep`

```yaml
id: 02-cleanup-sweep
what: |
  Run Stages A through E.2 in the worktree to ready the commits for the manager to push.
  Pre-flight (A) + Stage B deletions/CLAUDE.md surgical edit (commit 1) + Stage C adversarial-review
  removal + 13-subdir + root-README placeholder reset (commit 2) + Stage D gitignore transformations
  combined with Stage E.1 in-commit session sweep (commit 3, same commit per Fix 2) + Stage E.2
  terminal bare-UUID FS delete (NOT a commit). The executor returns DONE when exactly 3 sweep
  commits are present on <sweep-branch> in the worktree AND the bare-UUID dir is gone. The MANAGER
  picks up at Stage F (worktree-remove + local-branch cleanup) and Stage G (push, PR create, CI
  monitor, atomic-guard merge, post-merge cleanup) — all per `git/SKILL.md` § Role Boundaries
  (Cleanup, Push, PR, Merge = Manager; Subagent = Never).
requires: [01-create-pre-reset-tag]
inputs:
  - tag-pre-reset-2026-05-21-local         # verify-by: `git rev-parse pre-reset-2026-05-21`
  - tag-pre-reset-2026-05-21-origin        # manager-pushed pre-Task-02 §1b; verify-by: `git ls-remote --tags origin | grep pre-reset-2026-05-21`
  - sweep-branch-name                       # manager-fill at delegation time per `git/conventions.md`
  - worktree-absolute-path                  # manager-fill at delegation time per `git/SKILL.md` P2
outputs:
  - sweep-commits-on-<sweep-branch>-in-worktree   # exactly 3 commits ready for manager to push
  - 14-stub-readmes                                # 13 subdirs + root README of .gobbi/projects/gobbi/
  - tracked-session-dir-on-<sweep-branch>          # in tree of commit 3
  - bare-uuid-dir-deleted-from-fs                  # terminal FS state
verifies: |
  Executor's terminal verification (executor returns DONE only when ALL pass):
  A. Stage E.2 gate passed:
     - git log --format=%H -1 <sweep-branch>  → non-empty SHA
     - git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../  → grep -q . exit 0
  B. Bare-UUID dir is gone:
     - test ! -e .gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245
  C. Working tree is clean on <sweep-branch> with EXACTLY 3 sweep commits present:
     - git status --porcelain  → empty
     - git rev-list --count develop..<sweep-branch>  → 3
     - git log --oneline develop..<sweep-branch>  → 3 lines labeled Stage B, Stage C, Stage D+E.1 (Fix 2 iter2)
  D. Pre-Stage-G executor-verifiable Success Criteria (subset of the full 14):
     #1  git status post-sweep shows only intended deletions/modifications  → covered by C
     #3  ls .gobbi/projects/gobbi/ contains only the 6 survivor entries + 13 placeholder dirs
     #4  find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d → 1 entry
     #5-pre  git branch | grep -vE '^[* ] (main|develop|<sweep-branch>)$' → no rows
     #6-pre  git worktree list | wc -l → 2 (main + sweep worktree)
     #7  find .claude/{skills,agents} -xtype l → empty
     #8  Root contains only .git, .gitignore, .claude/, .gobbi/, LICENSE, CHANGELOG.md, README.md
     #10 .gobbi/.gitignore contains neither `sessions/` nor `project/note/`; still contains worktrees/ + settings.json
     #11 git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json → exit 1
     #12 grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md → empty
     #13 Pre-E.2 gate per A above
     [#2, #5-post, #6-post, #9-origin, #14 verify post-Task-02 — MANAGER scope]
```

**Anchor**: Implementation Checklist § Stages A through E.2 + Scope Contract § Success Criteria 1, 3-13.

**Critical ordering invariants**:
1. Stage 0 (Task 01) complete + tag pushed by manager (pre-Task-02 §1b) before Task 02 starts.
2. Stage D's gitignore edits staged BEFORE Stage E.1's `git add` of session dir — both in the SAME commit (Fix 2 iter2).
3. Stage E.2 is terminal POST-COMMIT (executor's last act), gated by `git log` + `git ls-tree` (NOT SHA-in-session.json).
4. `git rm` vs `rm -rf` distinguished per file.
5. **Task 02 ends at Stage E.2; Stage F + Stage G are MANAGER scope per D-PLAN-04 (Fix 1 iter2).**
