---
loop: planning
iter: 1
artifact_type: rawdata-draft
created_at: 2026-05-21
status: draft
feature: repo-reset
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/artifacts/design-direction.md
  - ideation/artifacts/scenarios.md
  - preparation/artifacts/pre-routed-gaps.md
  - preparation/artifacts/handoff.md
  - planning/staging/plans/main.md
---

# Planning Rawdata — Repo Reset (iter1)

The plan is intentionally small: a destructive single-PR cleanup is a procedural sweep, not a multi-feature implementation. The Implementation Checklist's Stages 0-G is concrete enough that decomposition is mostly mapping Stages to executor task(s). Per F-CX-PREP-O-01 (binding Preparation constraint), the user-locked decomposition is a **single-executor sweep** (D-PLAN-01 option (a)) covering Stages A through E.2 (terminal bare-UUID delete) so that all `mistake`-skill loads happen ONCE at task start, BEFORE Stage C wipes `.gobbi/projects/gobbi/mistakes/`. Stage 0 (pre-reset archival tag) is carved out as its own preparatory task because it must complete before the sweep branch opens (per Q-F) and because it operates on refs only (no file changes in the worktree). **Per D-PLAN-04 (user-locked: honor git-skill role boundaries), Task 02 stops at "commits ready in worktree" — Stage F's branch cleanup commits and Stage E.2's terminal FS delete remain in-executor (FS work in the worktree), but Stage G's push/PR-create/merge/post-merge cleanup are MANAGER-only operations performed after Task 02 returns DONE.**

---

## Scope reference

**Scope Contract source**: `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ideation/artifacts/scope-contract.md` (iter4 PASS, 19 user-confirmed locks).

**Project / Feature / Task**:
- Project: `gobbi`
- Feature: `repo-reset`
- Task: Destructive single-PR repo reset before bottom-up rebuild — wipe placeholder-target subdirs + session dirs + branches + worktrees + manifests + CLAUDE.md 2-line surgical excision, committed via an atomic squash PR guarded by `--match-head-commit "$HEAD_SHA"`.

**Pre-resolved binding constraints inherited from prior loops** (all 3 user-locked at Planning iter1 DISCUSSION):

1. **All 19 Ideation locks** (Q1-Q8, Q-A-Q-G, Q-Survivor, Q-StageE, Q-Gate-Redesign, Q-iter4-Override) — non-negotiable; see scope-contract.md § Decisions Locked.
2. **F-CX-PREP-O-01** (Preparation iter1 Codex, High/75) — Planning MUST decompose such that all `mistake`-skill loads happen BEFORE Stage C executes. **User-locked: option (a) single-executor sweep (D-PLAN-01).** See Decisions Log.
3. **F-CX-PREP-O-02** (Preparation iter1 Codex, Medium/75) — Stage B inventory MUST enumerate BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as already-deleted-in-worktree. Resolution: documented inline in Task 02's `files:` list and in `staging/plans/main.md` Stage B reference.
4. **F-CX-O4-01** (Ideation iter4 Codex, Medium/75) — `gh pr merge --squash --delete-branch` deletes both local and remote branch; the iter2 M-2 step `git branch -d <sweep-branch>` is redundant. **User-locked: option (a) drop the redundant local `git branch -d` step (D-PLAN-03).** See Decisions Log.
5. **D-PLAN-04 (user-locked)** — Honor `git/SKILL.md` role boundaries: Task 02's executor scope STOPS at "commits ready in worktree" (terminal step: Stage E.2's bare-UUID FS delete after the read-only gate). The MANAGER (post-Task-02) handles push, PR creation, CI monitoring, atomic-guard merge, post-merge sync, and worktree cleanup. See Decisions Log § D-PLAN-04 and the new "Manager pre/post-Execution operations" section.

---

## File map

The sweep touches files across the entire repo. Files group naturally by Implementation Checklist Stage:

### Stage 0 — Refs only (Task 01)
- Local refs: `refs/tags/pre-reset-2026-05-21` (create)
- Remote refs: `origin/refs/tags/pre-reset-2026-05-21` (push)
- No working-tree files touched.

### Stage A — Pre-flight (no file writes; verification only) (Task 02)
- Read-only scans of worktree status, branch state.

### Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Task 02)
**Tracked deletes (`git rm`)**:
- `packages/` (entire tree — Q1)
- `package.json`, `bun.lock`, `package-lock.json` (Q5)
- `plugins/gobbi/` (entire tree — Q6)
- `test/gitignore.test.sh` (Q6) — `git rm` if tracked, `rm` if not; `rmdir test/` if empty
- `MIGRATION.md`, `AGENTS.md` (Q7)
- `.claude-plugin/marketplace.json` (**already `D` in tree per F-CX-PREP-O-02**; `git rm` finalizes); `rmdir .claude-plugin/` if empty
- `.codex/` (tracked symlinks into `.claude/`; Item 5)
- `.claude/project/gobbi/` (entire tree — Q-D)

**Untracked filesystem-only deletes (`rm -rf`)**:
- `node_modules/` (Q5)
- `.agents/` (Item 5)

**Surgical edit**:
- `.claude/CLAUDE.md` — remove lines 61-62 (the two `[v050-overview.md]` and `[v050-cli.md]` table rows; iter2 H-1). Verification: `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty.

**Already-deleted-in-tree (auto-picked-up by `git add -A` / `git rm`; F-CX-PREP-O-02)**:
- `.claude-plugin/marketplace.json` (listed above)
- `.gobbi/projects/gobbi/project.json` (new — was missing from Ideation Stage B inventory)

### Stage C — Adversarial-review + project-memory placeholder reset (Task 02)
**Tracked delete**:
- `.gobbi/projects/gobbi/adversarial-review/` (entire tree — Item 3)

**Placeholder reset** — for each of 13 subdirs under `.gobbi/projects/gobbi/`:
- `archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`
- Per subdir: `git rm -r <subdir>/*` (tracked content) + `rm -rf <subdir>/*` (untracked stragglers), then write one-line stub `<subdir>/README.md` per D4 inline template, then `git add <subdir>/README.md`.

**Root README replace**:
- `.gobbi/projects/gobbi/README.md` → one-line stub per Q-C: `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

**Survivors NOT touched** (Q-A):
- `.gobbi/projects/gobbi/agents/` (entire tree)
- `.gobbi/projects/gobbi/skills/` (entire tree)
- `.gobbi/projects/gobbi/rules/` (entire tree)
- `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (entire tree)
- `.gobbi/projects/gobbi/worktrees/` (will become empty after Stage F)
- `.gobbi/projects/gobbi/settings.json`

### Stage D — Gitignore transformations (Task 02)
- `.gitignore` (root) — drop `.gobbi/projects/*/sessions/` line; keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines.
- `.gobbi/.gitignore` (workspace-level, Q-E) — drop `sessions/` and `project/note/` lines; keep `worktrees/` and `settings.json` lines.
- Verify: `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1.

### Stage E.1 — Session sweep in-commit (Task 02)
**Tracked add**:
- `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (entire tree — possible after Stage D commits gitignore edits).

**Filesystem-only deletes** (the 52 sibling DIR-FORM session dirs):
- `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/` (iter2 M-3: explicit name)
- `sess-final/` (fixture)
- `99999999-aaaa-bbbb-cccc-dddddddddddd/` (fixture)
- 49 bare-UUID dirs (all historical session UUIDs other than `6637e759-...`)
- Excludes BOTH `2026-05-21-6637e759-...` AND the bare-UUID `6637e759-...` (held until E.2).

### Stage E.2 — Terminal bare-UUID delete (Task 02 — **executor's terminal step**)
- `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` — gated FS-only delete (NOT part of any commit; iter3 Q-Gate-Redesign). Gate is two read-only git invocations (`git log --format=%H -1 <sweep-branch>` non-empty SHA AND `git ls-tree <sweep-branch> <kept-session-dir>/ | grep -q .`); the deletion is a pure filesystem op (`rm -rf` of a gitignored dir). Both gate + rm are executor-scope per D-PLAN-04 analysis: read-only git inspection + FS deletion in the worktree are not git mutation operations subject to the manager-only push/PR/merge boundary.

### Stage F — Worktree + branch cleanup (Task 02)
**Worktrees removed**:
- `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation`
- `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules`
- Plus: `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete` (iter2 L-1, with `-mindepth 1` per S14).

**Local branches deleted** (within the worktree, by the executor — these are local-ref mutations, not push/merge):
- `git branch -d fix/257-complete-mirror-sync` (safe-delete)
- `git branch -d refactor/257-skills-agents-rules` (safe-delete)
- `git branch -D pr-fin-2-decisions-hold` (force-delete; Q-G pre-authorized)
- `git branch -D redesign/v050-ideation` (force-delete; Q-G pre-authorized)

**Note**: Stage F's cleanup commits constitute the executor's final sweep-branch commit. Per `git/SKILL.md` Procedure P5 § Forbidden Operations, `git branch -d/-D` on **local-only** branches is an executor-permitted operation in the worktree (it is a local-ref mutation, not a remote push). The sweep branch itself is NOT deleted by the executor — it remains alive when Task 02 returns DONE; the manager pushes it in Stage G.

### Stage G — PR open + atomic-guard merge (**MANAGER, post-Task-02**)
Per D-PLAN-04 (user-locked): all Stage G operations are performed by the manager AFTER Task 02 returns DONE. See "Manager pre/post-Execution operations" section below for the full sequence.

---

## Tasks

### Task 01 — `create-pre-reset-tag`

```yaml
id: 01-create-pre-reset-tag
what: Create lightweight tag `pre-reset-2026-05-21` at `487fc35` (current develop tip) and push to origin, before any sweep work begins.
traces-to:
  - "Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens"
  - "`git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required)"
  - "`git push origin pre-reset-2026-05-21`"
  - "Verify: `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches"
requires: []
files:
  - { path: "refs/tags/pre-reset-2026-05-21", op: create }
inputs: []
outputs:
  - tag-pre-reset-2026-05-21-local
  - tag-pre-reset-2026-05-21-origin
verifies: |
  git rev-parse pre-reset-2026-05-21 == 487fc35 (locally)
  git ls-remote --tags origin | grep pre-reset-2026-05-21 (matches on origin)
```

**Anchor**: Implementation Checklist § Stage 0 (all 3 bullets) + Scope Contract § Q-F + Success Criterion #9.

### Task 02 — `cleanup-sweep`

```yaml
id: 02-cleanup-sweep
what: |
  Run Stages A through E.2 in the worktree to ready the commits for the manager to push.
  Pre-flight + Stage B deletions/CLAUDE.md surgical edit + Stage C adversarial-review removal +
  placeholder reset + Stage D gitignore edits + Stage E.1 in-commit session sweep + Stage F
  worktree-and-local-branch cleanup, each landed as a labeled commit on <sweep-branch>. Final
  step is Stage E.2's terminal bare-UUID FS delete after the read-only `git log` + `git ls-tree`
  gate. The executor returns DONE when all sweep commits are present on <sweep-branch> in the
  worktree and the bare-UUID dir is gone. The MANAGER picks up at push (Stage G) — push,
  PR-create, CI-monitor, atomic-guard merge, and post-merge cleanup are NOT in Task 02 scope
  per D-PLAN-04 (user-locked: honor git-skill role boundaries).
traces-to:
  - "Stage A — Discovery + pre-flight (S1, S4, S7)"
  - "Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1"
  - "Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2"
  - "Stage D — Gitignore transformations (Q4, Q-E) → sweep-branch commit 3"
  - "Stage E.1 — In-commit session sweep"
  - "Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]; executor's last act"
  - "Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep-branch commit 4"
  - "Stage G — MANAGER scope; not in Task 02 [D-PLAN-04 user-lock]"
requires: [01-create-pre-reset-tag]
files:
  # Stage B — code + plugin + root deletes + CLAUDE.md surgical edit
  - { path: "packages/", op: delete }
  - { path: "package.json", op: delete }
  - { path: "bun.lock", op: delete }
  - { path: "package-lock.json", op: delete }
  - { path: "node_modules/", op: delete }
  - { path: "plugins/gobbi/", op: delete }
  - { path: "test/gitignore.test.sh", op: delete }
  - { path: "MIGRATION.md", op: delete }
  - { path: "AGENTS.md", op: delete }
  - { path: ".claude-plugin/marketplace.json", op: delete }  # already D in tree (F-CX-PREP-O-02)
  - { path: ".codex/", op: delete }                         # tracked symlinks
  - { path: ".agents/", op: delete }                        # untracked, rm -rf
  - { path: ".claude/project/gobbi/", op: delete }
  - { path: ".claude/CLAUDE.md", op: modify }               # remove lines 61-62 (iter2 H-1)
  - { path: ".gobbi/projects/gobbi/project.json", op: delete }  # already D in tree (F-CX-PREP-O-02 — NEW vs Ideation Stage B)

  # Stage C — adversarial-review + placeholder reset
  - { path: ".gobbi/projects/gobbi/adversarial-review/", op: delete }
  - { path: ".gobbi/projects/gobbi/archive/", op: modify }       # wipe + stub README
  - { path: ".gobbi/projects/gobbi/backlogs/", op: modify }
  - { path: ".gobbi/projects/gobbi/decisions/", op: modify }
  - { path: ".gobbi/projects/gobbi/design/", op: modify }
  - { path: ".gobbi/projects/gobbi/features/", op: modify }
  - { path: ".gobbi/projects/gobbi/gotchas/", op: modify }
  - { path: ".gobbi/projects/gobbi/learnings/", op: modify }
  - { path: ".gobbi/projects/gobbi/mistakes/", op: modify }      # wipes ALL ~40 project mistakes — load BEFORE this stage
  - { path: ".gobbi/projects/gobbi/notes/", op: modify }
  - { path: ".gobbi/projects/gobbi/plans/", op: modify }
  - { path: ".gobbi/projects/gobbi/references/", op: modify }
  - { path: ".gobbi/projects/gobbi/reviews/", op: modify }
  - { path: ".gobbi/projects/gobbi/tmp/", op: modify }
  - { path: ".gobbi/projects/gobbi/README.md", op: modify }      # → one-line Q-C stub

  # Stage D — gitignore transformations
  - { path: ".gitignore", op: modify }
  - { path: ".gobbi/.gitignore", op: modify }

  # Stage E.1 — in-commit session sweep
  - { path: ".gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/", op: create }  # tracked-add after Stage D
  - { path: ".gobbi/projects/gobbi/sessions/2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/", op: delete }   # FS-only (was gitignored)
  - { path: ".gobbi/projects/gobbi/sessions/sess-final/", op: delete }
  - { path: ".gobbi/projects/gobbi/sessions/99999999-aaaa-bbbb-cccc-dddddddddddd/", op: delete }
  # 49 additional bare-UUID dirs swept by the find/xargs invocation; listed by predicate, not by name

  # Stage E.2 — terminal bare-UUID delete (NOT in any commit; executor's last act before DONE)
  - { path: ".gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/", op: delete }  # FS-only, gated

  # Stage F — worktree + branch cleanup (no files; local refs only — listed for traceability)
  - { path: ".gobbi/projects/gobbi/worktrees/redesign-v050-ideation/", op: delete }
  - { path: ".gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules/", op: delete }
  - { path: "refs/heads/fix/257-complete-mirror-sync", op: delete }
  - { path: "refs/heads/refactor/257-skills-agents-rules", op: delete }
  - { path: "refs/heads/pr-fin-2-decisions-hold", op: delete }
  - { path: "refs/heads/redesign/v050-ideation", op: delete }

inputs:
  - tag-pre-reset-2026-05-21-local
  - tag-pre-reset-2026-05-21-origin
  - <sweep-branch>-name (manager-provided in delegation prompt)
  - <worktree-absolute-path> (manager-provided in delegation prompt)
outputs:
  - sweep-commits-on-<sweep-branch>-in-worktree   # ready for manager to push
  - 14-stub-readmes
  - tracked-session-dir-on-<sweep-branch>
  - bare-uuid-dir-deleted-from-fs
verifies: |
  Executor's terminal verification (executor returns DONE only when ALL pass):
  A. Stage E.2 gate passed:
     - git log --format=%H -1 <sweep-branch>  → non-empty SHA
     - git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../  → grep -q . exit 0
  B. Bare-UUID dir is gone:
     - test ! -e .gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245
  C. Working tree is clean on <sweep-branch> with all sweep commits present:
     - git status --porcelain  → empty
     - git log --oneline develop..<sweep-branch>  → ≥4 commits (Stage B/C/D+E.1/F labels per Implementation Checklist)
  D. Pre-Stage-G executor-verifiable Success Criteria (subset of the full 14; criteria #2/#14
     verify post-merge and are MANAGER-side):
     #1  git status post-sweep shows only intended deletions/modifications  → covered by C
     #3  ls .gobbi/projects/gobbi/ contains only the 6 survivor entries + 13 placeholder dirs
     #4  find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d → 1 entry
     #5  git branch | grep -vE '^[* ] (main|develop|<sweep-branch>)$' → no rows (<sweep-branch> still alive; manager handles its post-merge deletion via --delete-branch)
     #6  git worktree list | wc -l → 2 (main + sweep worktree; manager removes sweep worktree post-merge)
     #7  find .claude/{skills,agents} -xtype l → empty
     #8  Root contains only .git, .gitignore, .claude/, .gobbi/, LICENSE, CHANGELOG.md, README.md
     #9  git tag --list pre-reset-2026-05-21 returns the tag at 487fc35 (Task 01 already pushed to origin)
     #10 .gobbi/.gitignore contains neither `sessions/` nor `project/note/`; still contains worktrees/ + settings.json
     #11 git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json → exit 1
     #12 grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md → empty
     #13 Pre-E.2 gate per A above (read-only `git log` + `git ls-tree`; NOT SHA-in-session.json)
     [#2 + #14 verify post-merge — MANAGER scope]
```

**Anchor**: Implementation Checklist § Stages A through E.2 + F; Scope Contract § Success Criteria 1, 3-13 (Task 02 executor-side); Scenarios S1-S14 + S3b + S6b.

**Critical ordering invariants enforced inside this single task**:
1. Stage 0 (Task 01) before any deletion.
2. Stage D commit before Stage E.1 `git add` of session dir.
3. Stage F worktree-remove before local-branch-delete.
4. Stage E.2 is terminal POST-COMMIT (executor's last act), gated by `git log` + `git ls-tree` (NOT SHA-in-session.json).
5. `git rm` vs `rm -rf` distinguished per file.
6. **Task 02 ends at Stage E.2; Stage G is MANAGER scope per D-PLAN-04 user-lock.**

**Mistake-load timing** (per F-CX-PREP-O-01 option a / D-PLAN-01 user-lock):
- The executor loads project mistakes ONCE at task start, as part of the Load Directives block.
- All 40+ project mistakes are read before Stage 0 launches.
- Stage C wipes `.gobbi/projects/gobbi/mistakes/` mid-task; this is acceptable because no further executor spawn occurs in this task — the lessons are already in the executor's session context.
- The 3 mistake lessons explicitly encoded inline in the Implementation Checklist (executor-rationalized-failing-verification-gate, session-dir-naming-convention-uses-date-prefix, manager-mispec-grep-c-for-occurrence-count) are baked into the Stage E.2 NEEDS_CONTEXT clause, M-3 explicit naming, and D2 #16 grep audit respectively. (The Stage G NEEDS_CONTEXT clause is now manager-side per D-PLAN-04; the manager retains the same `executor-rationalized-failing-verification-gate` discipline when reading `gh pr merge` exit code.)

---

## Manager pre/post-Execution operations

Per D-PLAN-04 (user-locked: honor `git/SKILL.md` role boundaries), the manager performs these operations DIRECTLY (not via subagent delegation) before and after Task 02. They are listed here for audit completeness; they are NOT planned tasks because Planning decomposes only executor work.

### Pre-Task-01 (manager-direct)

1. **Create the GitHub issue** for the sweep, per `git/SKILL.md` Procedure P1: `gh issue create --title "<title>" --body "<body>"`. Issue body cites the 19 user-confirmed locks + the pre-reset tag + this Plan's path + the iter2/3/4 deltas. The returned issue number drives the sweep branch name (per `git/conventions.md`).

### Pre-Task-02 (manager-direct, after Task 01 returns DONE)

2. **Create the worktree** at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`, branched from develop (current tip `487fc35`):
   ```
   git worktree add -b <sweep-branch> .gobbi/projects/gobbi/worktrees/<sweep-branch>/ develop
   ```
3. **Install deps if any** in the worktree (project has no `package.json` post-Workstream-B; this is a no-op for the current repo state, but listed for procedural completeness).
4. **Pass to Task 02's delegation prompt**: the absolute worktree path, the `<sweep-branch>` name, the issue number, the user-locked context (19 locks + 3 pre-routed constraint resolutions + D-PLAN-04 scope boundary). The delegation prompt's `## Constraints / Scope` block explicitly states "executor stops after Stage E.2; do NOT push, do NOT create PR, do NOT merge."

### Post-Task-02 (manager-direct, after Task 02 returns DONE)

These are `git/SKILL.md` Procedure P5 operations performed by the manager itself; they are NOT in any planned task.

5. **Push the sweep branch to origin**, from the worktree:
   ```
   cd <worktree-absolute-path> && git push -u origin <sweep-branch>
   ```
6. **Open the PR** into `develop`:
   ```
   gh pr create --base develop --head <sweep-branch> \
     --title "chore(<issue-num>): destructive repo reset pre-rebuild" \
     --body "<body citing 19 locks + 3 pre-routed constraint resolutions + pre-reset-2026-05-21 tag + iter2/3/4 deltas>"
   ```
7. **Monitor CI**: `gh pr checks <pr-num> --watch`. If checks fail, no merge; investigate.
8. **Capture HEAD_SHA and atomic-guard merge** (per `git/SKILL.md` Procedure P5 + iter4 Q-iter4-Override):
   ```
   HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)
   gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"
   ```
   Non-zero exit → no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); manager re-contracts with user. Per F-CX-O4-01 / D-PLAN-03 user-lock: `--delete-branch` removes both local and remote sweep-branch refs; NO redundant `git branch -d <sweep-branch>` is performed.
9. **Post-merge develop sync** (from main tree):
   ```
   cd /playinganalytics/git/gobbi && git checkout develop && git pull --ff-only
   ```
10. **Worktree cleanup** (per `git/SKILL.md` Procedure P5 steps 3-5):
    ```
    git worktree remove .gobbi/projects/gobbi/worktrees/<sweep-branch>     # NO --force
    git worktree prune
    find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete
    ```
11. **Close the linked issue manually** (per `git/SKILL.md` Procedure P5 step 6 — `develop` is non-default, so PR closing keywords do NOT auto-fire):
    ```
    gh issue close <issue-num> -c "Closed by PR #<pr-num>"
    ```
12. **Post-merge Success Criteria verification** (manager runs the 2 criteria that the executor could not, plus a re-run of executor-side criteria from the main tree):
    - **Success #2**: `git log --oneline -2 develop` → shows 1 new squash commit + `487fc35`
    - **Success #14**: `gh pr merge` returned exit code 0 (already observed in step 8; recorded for audit)
    - Re-run #1, #3-13 from the main tree (post-checkout-develop, post-pull) to confirm the squash-merged state matches the executor's pre-merge in-worktree state.

---

## Dependency table

| Task | Depends on | Blocks | Files touched (groups) |
|---|---|---|---|
| 01-create-pre-reset-tag | (none) | 02-cleanup-sweep | refs/tags/pre-reset-2026-05-21 only — no working-tree files |
| 02-cleanup-sweep | 01-create-pre-reset-tag | (none — terminal executor task; manager picks up at push) | Stage A through E.2 + F file set (see File map; ~50+ tracked paths + ~52 FS-only session dirs + local branch refs) |

**Dependency rationale**:
- 01 → 02 edge per Scope Contract § Q-F: "Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens." Tag must exist locally + on origin before the sweep branch opens.
- 02 is the terminal executor task; commits ready when 02 returns DONE; manager pushes/merges post-Task-02 per D-PLAN-04.

**File-overlap check**: Task 01 only touches refs; Task 02 touches the broad workspace + local branch refs (different from the tag ref). No overlap, no conflict.

---

## Parallel lanes

| Lane | Tasks | Order |
|---|---|---|
| L1 (sole) | 01 → 02 | sequential |

**Lane rationale**: Per Execution Loop's contract, implementation tasks always sequence (never parallelize). Even though Task 01 and Task 02 touch disjoint surfaces, the dependency edge `01 → 02` makes parallelization impossible: the sweep branch's PR body (created post-Task-02 by the manager) cites the tag, and the tag must exist on origin before the sweep branch opens.

**Conflict flags**: None.

---

## Agent assignments

### Task 01 — `01-create-pre-reset-tag`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles` (always); (2) `mistake` (always); (3) `.claude/skills/orchestration/workflow/execution.md` (phase doc); (4) `.claude/skills/execution/SKILL.md` (role skill); (5) `.claude/skills/git/SKILL.md` (Procedures + Forbidden Operations) |
| Required mistakes | `git-workflow.md`, `worktree-vs-main-path-confusion.md`, `executor-rationalized-failing-verification-gate.md`, `executor-boundary-extension-without-asking.md`, `manager-mispec-grep-c-for-occurrence-count.md` |
| Justification | Default executor; no override needed. The task is a small, contract-bounded ref-mutation (tag create + push). |
| Worktree | Operates against the **main tree** at `/playinganalytics/git/gobbi/` — Task 01 only touches refs and pushes the tag; no worktree is required because no working-tree files change. |

### Task 02 — `02-cleanup-sweep`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles`; (2) `mistake`; (3) `.claude/skills/orchestration/workflow/execution.md`; (4) `.claude/skills/execution/SKILL.md`; (5) `.claude/skills/git/SKILL.md` (full Procedures P1-P7 + Forbidden Operations; executor MUST respect the push/PR/merge boundary per D-PLAN-04); (6) `.claude/skills/git/conventions.md` (branch naming, commit grammar, AI-Provenance trailer) |
| Required mistakes | All 40 project mistakes at `.gobbi/projects/gobbi/mistakes/`, filtered/prioritized: `executor-rationalized-failing-verification-gate.md` (E.2 NEEDS_CONTEXT clause); `session-dir-naming-convention-uses-date-prefix.md` (Stage E.1 c676684d- explicit naming); `manager-mispec-grep-c-for-occurrence-count.md` (D2 #16 `$`-anchored grep audit); `git-workflow.md` (entire file — worktree path discipline, stash ban, direct-push prohibition); `worktree-vs-main-path-confusion.md` (Read/Edit/Write must use worktree path); `gobbi-workflow-cli-from-main-tree.md` (any `gobbi workflow *` runs from main tree); `executor-boundary-extension-without-asking.md` (do not silently expand allowlist; do NOT push/PR/merge — manager-only per D-PLAN-04). |
| Justification | Default executor; sonnet appropriate because the Plan provides a concrete contract (Stages A through E.2 + F) with explicit verification gates. The task's complexity is in **execution discipline** (~50+ file paths, 4 commit boundaries, 1 terminal-gate clause), not in design judgment — sonnet handles structured contracts well. |
| Worktree | The **manager** creates the worktree before delegation (per `git/SKILL.md` Procedure P2) at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`. The executor's first action is to `cd` to the worktree's absolute path. Branch name follows `git/conventions.md` (e.g., `chore/<issue-num>-repo-reset` or per user choice at Execution DISCUSSION). |
| Special discipline | (a) **Mistake-load is one-time at task start** (F-CX-PREP-O-01 / D-PLAN-01 option a); the executor MUST NOT attempt to re-load mistakes from `.gobbi/projects/gobbi/mistakes/` after Stage C wipes the directory. (b) **No push, no PR-create, no merge** — these are manager-only per D-PLAN-04. The executor commits Stages B/C/D+E.1/F to `<sweep-branch>` in the worktree, runs Stage E.2's gate + FS deletion, then returns DONE. (c) **No `--no-verify`, no `git stash`, no `git reset --hard`**; on any verification-gate divergence, return NEEDS_CONTEXT (Iron Law 11 + `executor-rationalized-failing-verification-gate.md`). |

---

## Self-review report

### Spec coverage (Sub-step E.1)

Every Implementation Checklist Stage maps to a task or to a manager pre/post-Execution operation:

| Checklist Stage | Owner | Status |
|---|---|---|
| Stage 0 — Pre-reset archival tag | Task 01 (executor) | ✓ |
| Stage A — Discovery + pre-flight | Task 02 (executor) | ✓ |
| Stage B — Code + plugin + root + CLAUDE.md surgical edit | Task 02 (executor) | ✓ |
| Stage C — Adversarial-review + placeholder reset | Task 02 (executor) | ✓ |
| Stage D — Gitignore transformations | Task 02 (executor) | ✓ |
| Stage E.1 — In-commit session sweep | Task 02 (executor) | ✓ |
| Stage E.2 — Terminal bare-UUID delete | Task 02 (executor; terminal step) | ✓ |
| Stage F — Worktree + local-branch cleanup | Task 02 (executor) | ✓ |
| Stage G — Push + PR open + atomic-guard merge + post-merge cleanup | Manager (pre/post-Execution ops §5-12) | ✓ |
| Pre-Task-01: Issue create | Manager (pre/post-Execution ops §1) | ✓ |
| Pre-Task-02: Worktree create | Manager (pre/post-Execution ops §2-4) | ✓ |

All 19 Ideation locks mapped: Q1/Q5/Q6/Q7/Q-D/Item 5/H-1/.claude-plugin → Stage B (Task 02); Q2/Q-A/Q-C/Item 3 → Stage C (Task 02); Q4/Q-E → Stage D (Task 02); Q8/Q-B → Stage E.1/E.2 (Task 02); Worktree + Q-G → Stage F (Task 02); Q3/Q-iter4-Override + Q-Gate-Redesign → Stage E.2 (Task 02) + Stage G (Manager post-Execution); Q-F → Stage 0 (Task 01); Q-Survivor → Stage B H-1 surgical edit (Task 02); Q-StageE → Stage E split (Task 02 E.1 in-commit + E.2 terminal post-commit FS).

**Success Criteria coverage matrix (revised post-D-PLAN-04)**:

| # | Criterion | Verified by | Owner |
|---|---|---|---|
| 1 | `git status` post-sweep shows only intended changes | Task 02 verifies block C | Executor (pre-DONE) |
| 2 | `git log --oneline -2 develop` shows 1 new squash commit + `487fc35` | Manager post-merge step 12 | **Manager (post-merge)** |
| 3 | `ls .gobbi/projects/gobbi/` matches survivors + placeholders | Task 02 verifies #3 | Executor (pre-DONE) |
| 4 | Exactly 1 session dir | Task 02 verifies #4 | Executor (pre-DONE) |
| 5 | No non-main/develop local branches | Task 02 verifies #5 (with <sweep-branch> still alive) + Manager post-merge confirms `<sweep-branch>` gone via `--delete-branch` | Executor + **Manager (post-merge)** |
| 6 | `git worktree list | wc -l → 1` | Task 02 verifies #6 with 2 (main + sweep) + Manager post-merge step 10 brings it to 1 | Executor + **Manager (post-merge)** |
| 7 | No broken symlinks under `.claude/{skills,agents}` | Task 02 verifies #7 | Executor (pre-DONE) |
| 8 | Root contents reduced to canonical set | Task 02 verifies #8 | Executor (pre-DONE) |
| 9 | Pre-reset tag exists locally + on origin at `487fc35` | Task 01 verifies | Executor (Task 01) |
| 10 | `.gobbi/.gitignore` cleaned | Task 02 verifies #10 | Executor (pre-DONE) |
| 11 | `git check-ignore` on tracked session.json returns exit 1 | Task 02 verifies #11 | Executor (pre-DONE) |
| 12 | CLAUDE.md table rows removed | Task 02 verifies #12 | Executor (pre-DONE) |
| 13 | E.2 gate pre-conditions both pass | Task 02 verifies A | Executor (pre-DONE) |
| 14 | `gh pr merge --match-head-commit` returned exit 0 | Manager post-merge step 8 | **Manager (post-merge)** |

Every criterion now maps to Task 01 / Task 02 / a Manager pre/post-Execution operation. Three criteria (#2, #5-confirmation, #6-confirmation, #14) shifted to manager-side per D-PLAN-04; one criterion (#5) is jointly verified (executor confirms non-sweep local branches gone; manager confirms sweep-branch itself gone post-merge); one criterion (#6) is jointly verified (executor confirms 2 worktrees during Task 02; manager confirms 1 worktree post-cleanup).

**Gap check**: Each checklist item has an owner; each task has a checklist anchor; each success criterion has a verifying owner. No anchor-less items, no unmatched checklist items, no orphan criteria.

### Placeholder scan (Sub-step E.2)

`grep -nE '(TBD|TODO|to be defined|<\.\.\.>|XXX|FIXME)' draft-iter1.md` against this file's content: zero hits in task definitions, acceptance criteria, or file paths. (The literal string "TBD" / "TODO" does not appear in any task spec field.) Note: `<sweep-branch>`, `<pr-num>`, `<issue-num>`, `<worktree-absolute-path>`, `<HEAD_SHA>` are placeholder *parameters* filled by the manager at Execution DISCUSSION — not unresolved Plan content.

### Type / name consistency (Sub-step E.3)

| Identifier | First use | Subsequent uses | Match |
|---|---|---|---|
| `pre-reset-2026-05-21` (tag name) | Task 01 `files`, `outputs` | Task 02 `inputs`, manager-ops §6 PR body | ✓ |
| `487fc35` (tag target SHA) | Task 01 `verifies`, scope-contract Q-F | Same form throughout | ✓ |
| `<sweep-branch>` (placeholder for branch name) | Task 02 `verifies`, manager-ops §2/§5/§6/§8 | Same placeholder usage | ✓ — manager fills at delegation time per git/conventions.md |
| `HEAD_SHA` / `$HEAD_SHA` | Manager-ops §8 (single owner) | Same step | ✓ |
| `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (kept session dir) | File map § Stage C survivors + Stage E.1 | Same exact path | ✓ |
| `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` (bare-UUID dir to delete) | File map § Stage E.2 | Same exact path | ✓ — DISTINCT from the kept date-prefixed dir |
| 13 placeholder subdirs | File map § Stage C | Same 13 names in Task 02 `files` | ✓ |

No type/name drift detected.

### User-approved acceptances

- **D-PLAN-01** (user-locked at Planning iter1 DISCUSSION): single-executor sweep adopted.
- **D-PLAN-03** (user-locked at Planning iter1 DISCUSSION): redundant `git branch -d <sweep-branch>` step dropped.
- **D-PLAN-04** (user-locked at Planning iter1 DISCUSSION, OPPOSITE of leader recommendation): honor `git/SKILL.md` role boundaries — Task 02 stops at "commits ready in worktree" (terminal step E.2); manager handles push/PR/merge.

---

## NOT in scope

Items the plan does NOT cover, with rationale:

1. **The rebuild itself** — explicitly deferred to a follow-on session (Scope Contract § Out-of-Scope + § Deferred).
2. **Touching `.claude/README.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/.env`, `.claude/worktrees/`** — Scope Contract § Out-of-Scope (not asked, not locked). The H-1 surgical edit on `.claude/CLAUDE.md` lines 61-62 is the ONLY `.claude/` change.
3. **Touching `.gobbi/settings.json`** — runtime CLI state (Scope Contract § Out-of-Scope).
4. **Re-architecting `.claude/` content** — only `.claude/project/gobbi/` removed (Q-D) and the H-1 2-line edit landed.
5. **Remote-branch deletion** — only local branches by the executor in Stage F; the sweep branch's remote deletion is handled by `gh pr merge --delete-branch` (manager post-merge step 8) per F-CX-O4-01.
6. **Touching `main` or `develop` branches** — sweep lands via PR → squash-merge into develop; no direct edits, no force-push, no history rewrite.
7. **Rewriting git history** — explicitly out (Scope Contract).
8. **Writing the sweep commit SHA into any tracked file** — removed in iter3 per Q-Gate-Redesign (Scope Contract § Out-of-Scope).
9. **Post-merge body-grep verification of `$HEAD_SHA`** — removed in iter4 per Q-iter4-Override; replaced by `--match-head-commit` atomic guard.
10. **Test-writing tasks** — Planning does NOT slice "write test X" as a task (planning/SKILL.md § Core Principles: "Test-writing is NOT a planning task"). Verification gates anchor to D2's 20 commands; no new tests authored.
11. **Backlog promotion target setup** — the staged `cli-regenerates-gobbi-gitignore.md` backlog stays session-scoped (per iter2 H-4); the rebuilt CLI session must read it from the preserved session dir.
12. **CLI regenerator fix for `.gobbi/.gitignore`** — deferred to backlog at `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` (Scope Contract § Deferred).
13. **Push / PR create / PR merge / post-merge cleanup** — per D-PLAN-04 (user-locked), these are MANAGER-only operations performed by the manager directly (not via subagent), AFTER Task 02 returns DONE. Documented in § "Manager pre/post-Execution operations" §5-12. Not in any planned task.
14. **Worktree creation / issue creation orchestration** — manager-direct operations per `git/SKILL.md` Procedure P1+P2. Documented in § "Manager pre/post-Execution operations" §1-4. Not in any planned task.

---

## Decisions log

This section records every AskUserQuestion the manager ran (or pre-resolved via the brief), with the user-locked resolution.

### D-PLAN-01 — F-CX-PREP-O-01 mistake-memory continuity option (a) vs (b)

**Pre-routed binding constraint** (Preparation iter1 Codex, High/75).

| Option | Description | Trade-off |
|---|---|---|
| **(a) Single-executor sweep — USER-LOCKED** | Stages A through E.2 + F run within ONE executor task (Task 02). Project mistakes loaded ONCE at task start before Stage C wipes `mistakes/`. No machinery beyond standard Load Directives. | Task 02 is large (multi-stage destructive operations across ~50+ paths). Sonnet handles structured contracts well; in-context discipline burden mitigated by explicit per-stage gates. |
| (b) Multi-task with snapshot | Stages A, B/C, D, E.1, E.2, F as separate executor tasks. Pre-Stage-C snapshot of `mistakes/` to session staging; post-Stage-C executor tasks load mistakes from the snapshot path. | More bisect-safe per-stage spawn boundaries; but requires delegation-prompt override for the `mistake` skill's P1 path + snapshot orchestration. |

**User decision (locked at Planning iter1 DISCUSSION)**: **(a) Single-executor sweep**. Matches leader recommendation. No further AskUserQuestion needed.

### D-PLAN-02 — F-CX-PREP-O-02 project.json deletion drift

**Pre-routed binding constraint** (Preparation iter1 Codex, Medium/75; resolved inline).

**Resolution**: Task 02's `files:` list explicitly enumerates BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as `op: delete` with the note "already D in tree (F-CX-PREP-O-02)". The Stage B reference in `staging/plans/main.md` calls out both files in the same sub-bullet so an Execution executor verifying "all deletions accounted for" does not flag `project.json` as out-of-scope drift.

**User decision needed?** No — documentation correction with no implementation choice. Recorded for audit.

### D-PLAN-03 — F-CX-O4-01 `gh --delete-branch` redundancy

**Pre-routed binding constraint** (Ideation iter4 Codex, Medium/75).

| Option | Description | Trade-off |
|---|---|---|
| **(a) Drop redundant local `git branch -d <sweep-branch>` — USER-LOCKED** | After `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` succeeds, manager `git checkout develop && git pull` and stops. The sweep branch is already deleted locally + remotely. | Cleaner Stage G (manager-side); one fewer step; matches `gh pr merge --help` behavior. |
| (b) Keep `git branch -d <sweep-branch>` as defense-in-depth | After `gh pr merge`, also run `git branch -d <sweep-branch>`; expect "error: branch not found" exit ≠ 0 but accept it. | One more step; benign-error false-alarm on cleanup verification. |

**User decision (locked at Planning iter1 DISCUSSION)**: **(a) Drop the redundant step**. Matches leader recommendation.

**Plan reflection**: 
- Stage G (manager-side) post-merge cleanup is `git checkout develop && git pull --ff-only` (see § Manager pre/post-Execution operations §9). No `git branch -d <sweep-branch>` step exists in the manager's post-merge sequence.
- Success Criterion #5 (verified by manager post-merge — see Success matrix above) confirms the sweep branch is gone via `--delete-branch`.

### D-PLAN-04 — Task 02 PR-lifecycle scope: honor role boundaries (USER-LOCKED, opposite of leader recommendation)

The Plan's prior draft extended Task 02's executor scope to include `git push`, `gh pr create`, `gh pr merge`. The user has now ruled: **honor `git/SKILL.md` § Role Boundaries — push/PR-create/merge are MANAGER-only operations.**

**User decision (locked at Planning iter1 DISCUSSION)**: **Honor role boundaries.** Subagents commit but never push, create PRs, or merge.

**Resolution applied to this Plan**:

1. **Task 02's `what` field**: rewritten to "Run Stages A through E.2 in worktree to ready the commits for the manager to push." Terminal step is Stage E.2 (bare-UUID FS delete after the read-only gate).
2. **Task 02's `verifies` field**: executor's final verification is `(A) Stage E.2 gate passes` AND `(B) bare-UUID dir is gone` AND `(C) git status clean with all sweep commits on <sweep-branch>` AND `(D) the subset of Success Criteria verifiable pre-merge (1, 3-13)`. Success #2 + #14 + post-merge confirmations of #5 + #6 are manager-side post-merge.
3. **New section "Manager pre/post-Execution operations"** added before this Decisions log, documenting manager-direct operations §1-12 (issue create, worktree create, push, PR create, CI monitor, atomic-guard merge, develop sync, worktree cleanup, issue close, post-merge Success Criteria verification).
4. **Special discipline (Task 02 Agent assignments)**: rewritten — executor MUST NOT push, MUST NOT create PR, MUST NOT merge. These are manager-only per D-PLAN-04.

**Stage E.2 keeps in Task 02 (leader analysis confirmed by brief)**: the gate is two read-only git invocations (`git log` + `git ls-tree`) and the deletion is a pure FS op (`rm -rf` of a gitignored dir). Neither is a git mutation subject to the push/PR/merge boundary. The executor stops AFTER E.2; the manager picks up at push (post-Task-02 step §5).

### D-PLAN-05 — Issue creation timing

`git/SKILL.md` Core Principles: "Every task starts from a GitHub issue."

**Resolution**: The manager creates the GitHub issue as the FIRST pre-Execution operation (see § Manager pre/post-Execution operations §1) — before worktree creation, before delegating any task. Issue number drives the sweep branch name (per `git/conventions.md`) and the PR title/body. Task 02's delegation prompt carries the issue number as an input.

**User decision needed?** No — `git/SKILL.md` already establishes this. Recorded for clarity.

---

## Manager AskUserQuestion shortlist (run before Execution Loop entry)

All 3 D-PLAN AskUserQuestions ran successfully at Planning iter1 DISCUSSION. User-locked answers:
- **D-PLAN-01**: (a) Single-executor sweep
- **D-PLAN-03**: (a) Drop redundant `git branch -d`
- **D-PLAN-04**: Honor git-skill role boundaries (executor stops at "commits ready"; manager handles push/PR/merge)

No outstanding AskUserQuestion remains for the Execution Loop entry. The manager may proceed to:
1. Issue create (Manager-ops §1)
2. Task 01 delegate
3. Worktree create (Manager-ops §2-4)
4. Task 02 delegate (with D-PLAN-04 scope boundary explicit in delegation prompt)
5. Manager post-Task-02 operations §5-12

---

## Notes for the Execution Loop manager

- **Worktree path**: `git/SKILL.md` Procedure P2 names the worktree at `.gobbi/projects/gobbi/worktrees/<branch-name>/`. Suggested branch name (subject to user confirmation per `git/conventions.md`): `chore/<issue-num>-repo-reset` (since the work is housekeeping, not a feature or fix).
- **Working-tree base**: develop tip is `487fc35` per Preparation handoff. Task 01's tag operation runs against the main tree at `/playinganalytics/git/gobbi/` (no worktree needed; refs are global).
- **Pre-merge gate** (manager-side, per `git/SKILL.md` Procedure P5): all CI checks green (step §7), Task 02 returned DONE with all executor-side criteria verified, no orphan worktrees, PR body cites Conventional sections + 19 locks + 3 pre-routed resolutions + pre-reset tag. The atomic-guard merge `--match-head-commit "$HEAD_SHA"` (step §8) is the canonical merge command — no separate gate needed.
- **Post-merge cleanup** (manager-side, per `git/SKILL.md` Procedure P5 steps 2-5): manager pulls develop (§9), removes the worktree (§10 — `git worktree remove ...`, NOT `--force`), prunes, cleans empty parent dirs. The sweep branch is already gone locally + remotely via `--delete-branch`.
- **Issue closure** (manager-side, per `git/SKILL.md` Procedure P5 step 6): since `develop` is non-default, closing keywords in the PR body do NOT auto-fire — manager runs `gh issue close <issue-num> -c "Closed by PR #<pr-num>"` post-merge (§11).
- **NEEDS_CONTEXT recovery semantics**: Task 02's NEEDS_CONTEXT can fire at Stage E.2's gate (either `git log` returns empty SHA or `git ls-tree` misses the kept session dir). Manager-side NEEDS_CONTEXT can fire at step §8 (non-zero exit from `gh pr merge --match-head-commit`). Either case: no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); the responsible role re-contracts with the user.

---

**End of rawdata draft — Planning iter1 (revised after D-PLAN AskUserQuestion locks).**
