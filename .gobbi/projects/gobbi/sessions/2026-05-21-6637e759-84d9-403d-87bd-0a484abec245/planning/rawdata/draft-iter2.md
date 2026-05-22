---
loop: planning
iter: 2
artifact_type: rawdata-draft
created_at: 2026-05-21
status: draft
feature: repo-reset
supersedes: planning/rawdata/draft-iter1.md
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/artifacts/design-direction.md
  - ideation/artifacts/scenarios.md
  - preparation/artifacts/pre-routed-gaps.md
  - preparation/artifacts/handoff.md
  - planning/rawdata/restore/iter1-pre-revise.md
  - planning/evaluation/iter1/claude/overall.md
  - planning/evaluation/iter1/codex/overall.md
  - planning/staging/plans/main.md
---

# Planning Rawdata — Repo Reset (iter2, surgical-fix REVISE)

iter1 verdict: **REVISE** (Claude) / **FAIL Critical/90** (Codex) — convergent root cause: **role-boundary leak** in Tasks 01 and 02 contradicting `git/SKILL.md` § Role Boundaries. iter2 is a tightly surgical fix per the user-authorized 4 fixes + 5 bundled cleanups. All 19 Ideation locks and 4 D-PLAN locks (D-PLAN-01 single-executor; D-PLAN-03 drop redundant `git branch -d`; D-PLAN-04 honor role boundaries) are preserved. Restore point at `planning/rawdata/restore/iter1-pre-revise.md`.

The plan remains intentionally small: 2 tasks (01 tag-create-local, 02 cleanup-sweep) with a single executor sweep (D-PLAN-01) covering Stages A through E.2. The 4 surgical fixes (F-CL-P-01 + F-CX-PLAN-O-01 role boundaries; F-CL-S-01 + F-CX-PLAN-O-02 commit count; F-CL-C-03 M-2 supersession flag; F-CX-PLAN-O-03 self-review accuracy) plus 5 bundled cleanups (F-CL-PF-01 timeout caveat; F-CL-A-01 schema uniformity; F-CL-C-04 grep-pattern self-description; F-CL-R-01 rollback coverage; F-CL-U-02 Stage C op overload) are applied to bring the artifact to PASS-ready shape.

---

## Scope reference

**Scope Contract source**: `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ideation/artifacts/scope-contract.md` (iter4 PASS, 19 user-confirmed locks).

**Project / Feature / Task**:
- Project: `gobbi`
- Feature: `repo-reset`
- Task: Destructive single-PR repo reset before bottom-up rebuild — wipe placeholder-target subdirs + session dirs + branches + worktrees + manifests + CLAUDE.md 2-line surgical excision, committed via an atomic squash PR guarded by `--match-head-commit "$HEAD_SHA"`.

**Pre-resolved binding constraints inherited from prior loops**:

1. **All 19 Ideation locks** (Q1-Q8, Q-A-Q-G, Q-Survivor, Q-StageE, Q-Gate-Redesign, Q-iter4-Override) — see scope-contract.md § Decisions Locked.
2. **F-CX-PREP-O-01** (Preparation iter1 Codex, High/75) — all `mistake`-skill loads happen BEFORE Stage C executes. **User-locked: option (a) single-executor sweep (D-PLAN-01).**
3. **F-CX-PREP-O-02** (Preparation iter1 Codex, Medium/75) — Stage B inventory enumerates BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as already-deleted-in-worktree.
4. **F-CX-O4-01** (Ideation iter4 Codex, Medium/75) — `gh pr merge --squash --delete-branch` deletes both local and remote sweep branch. **User-locked: option (a) drop redundant `git branch -d <sweep-branch>` (D-PLAN-03).**
5. **D-PLAN-04 (user-locked)** — Honor `git/SKILL.md` Role Boundaries. The fix in this iter2 EXTENDS D-PLAN-04 to its full implications: not just push/PR/merge but ALL manager-owned operations in the Role Boundaries table (Issue, Push to remote, PR, Merge, Cleanup, **tag push**) live with the manager. See § Decisions log § D-PLAN-04 (clarified) and the new Manager pre/post-Task-02 ops sections.

---

## File map

The sweep touches files across the entire repo. Files group naturally by Implementation Checklist Stage:

### Stage 0 — Refs only — split across Task 01 (local) + Manager pre-Task-02 (push)
- **Task 01 (executor, local-only)**: create local annotated tag `refs/tags/pre-reset-2026-05-21` at `487fc35`. STOPS at "tag created locally."
- **Manager pre-Task-02 (post-Task-01)**: `git push origin pre-reset-2026-05-21` per `git/SKILL.md` § Role Boundaries (Push to remote: Manager; Subagent: Never).
- No working-tree files touched in either step.

### Stage A — Pre-flight (no file writes; verification only) (Task 02)
- Read-only scans of worktree status, branch state.

### Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Task 02 — commit 1)
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
- `.claude/CLAUDE.md` — remove lines 61-62 (the two `[v050-overview.md]` and `[v050-cli.md]` table rows; iter2 H-1). Verification: `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty. The gate's empty-output assertion is what guarantees correctness — see F-CL-C-04 cleanup at Self-review § 4 for the verbatim rationale (the `manager-mispec-grep-c-for-occurrence-count.md` mistake does NOT apply to empty-output assertions; only to occurrence-count assertions).

**Already-deleted-in-tree (auto-picked-up by `git add -A` / `git rm`; F-CX-PREP-O-02)**:
- `.claude-plugin/marketplace.json` (listed above)
- `.gobbi/projects/gobbi/project.json` (was missing from Ideation Stage B inventory; explicitly added)

### Stage C — Adversarial-review + project-memory placeholder reset (Task 02 — commit 2)
**Tracked delete**:
- `.gobbi/projects/gobbi/adversarial-review/` (entire tree — Item 3)

**Placeholder reset** — for each of 13 subdirs under `.gobbi/projects/gobbi/`: **two-step operation per subdir** (per F-CL-U-02 cleanup: the previous single `op: modify` keyword was overloaded — see Self-review § 6):
- **Sub-op (i) — delete-contents**: `git rm -r <subdir>/*` (tracked content) + `rm -rf <subdir>/*` (untracked stragglers)
- **Sub-op (ii) — create stub**: write one-line stub `<subdir>/README.md` per D4 inline template, then `git add <subdir>/README.md`

The 13 subdirs: `archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`.

**Root README replace** — same two-step shape (delete + create stub):
- `.gobbi/projects/gobbi/README.md` → one-line stub per Q-C: `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

**Survivors NOT touched** (Q-A):
- `.gobbi/projects/gobbi/agents/` (entire tree)
- `.gobbi/projects/gobbi/skills/` (entire tree)
- `.gobbi/projects/gobbi/rules/` (entire tree)
- `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (entire tree)
- `.gobbi/projects/gobbi/worktrees/` (will become empty after Manager post-Task-02 cleanup)
- `.gobbi/projects/gobbi/settings.json`

### Stage D + Stage E.1 — Gitignore transformations + in-commit session sweep (Task 02 — commit 3, single commit per Fix 2)

Per Fix 2 (user-locked decomposition resolution to F-CL-S-01 + F-CX-PLAN-O-02 commit-boundary ambiguity): **Stage D and Stage E.1 land in the SAME commit (commit 3)**. The dependency between them ("Stage D's gitignore edits must be staged before Stage E.1's `git add` of the now-trackable session dir") is honored by ordering within a single commit, not by separate commits. This eliminates the iter1 ambiguity about amend-vs-separate-commit and removes the risk that a gate runs against a tree where Stage E.1's add is uncommitted.

**Stage D — gitignore transformations**:
- `.gitignore` (root) — drop `.gobbi/projects/*/sessions/` line; keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines.
- `.gobbi/.gitignore` (workspace-level, Q-E) — drop `sessions/` and `project/note/` lines; keep `worktrees/` and `settings.json` lines.
- Verify: `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1.

**Stage E.1 — in-commit session sweep (same commit as Stage D)**:
- **Tracked add (made possible by the gitignore edits staged earlier in this same commit)**: `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (entire kept session tree)
- **Filesystem-only deletes** (the 52 sibling DIR-FORM session dirs, all of them gitignored and therefore not subject to `git rm`):
  - `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/` (iter2 M-3: explicit name)
  - `sess-final/` (fixture)
  - `99999999-aaaa-bbbb-cccc-dddddddddddd/` (fixture)
  - 49 bare-UUID dirs (all historical session UUIDs other than `6637e759-...`)
  - Excludes BOTH `2026-05-21-6637e759-...` AND the bare-UUID `6637e759-...` (held until E.2 terminal delete).

**Commit message (single commit for D + E.1)**: `chore(<issue-num>): gitignore transformations + in-commit session sweep (Stage D + E.1)` — Conventional Commits per `git/conventions.md`.

### Stage E.2 — Terminal bare-UUID delete (Task 02 — executor's terminal FS step, NOT a commit)
- `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` — gated FS-only delete (NOT part of any commit; iter3 Q-Gate-Redesign). Gate is two read-only git invocations: `git log --format=%H -1 <sweep-branch>` returns non-empty SHA AND `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ | grep -q .` exit 0. The deletion is a pure filesystem op (`rm -rf` of a gitignored dir). Both gate + rm are executor-scope per D-PLAN-04 analysis: read-only git inspection + FS deletion in a gitignored worktree path are not git mutation operations (they touch neither refs nor tracked trees).

### Stage F — Worktree + branch cleanup (**MANAGER post-Task-02**, NOT in Task 02)

Per Fix 1 (F-CL-P-01 + F-CX-PLAN-O-01 role-boundary leak): Stage F is **removed from Task 02 scope** and lives entirely in the Manager post-Task-02 ops section. `git/SKILL.md` § Role Boundaries assigns Cleanup (worktree remove + prune + empty parent dir cleanup) to Manager and "Never" to Subagent. The iter1 "local-ref mutation" carve-out was a leader interpretation not present in the skill — per user authorization in this REVISE, we honor the literal Role Boundaries table.

**Manager performs (per § Manager pre/post-Execution operations below)**:
- `git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation` (NO `--force`)
- `git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` (NO `--force`)
- `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete` (iter2 L-1 / S14)
- `git branch -d fix/257-complete-mirror-sync` (safe-delete, Q-G)
- `git branch -d refactor/257-skills-agents-rules` (safe-delete, Q-G)
- `git branch -D pr-fin-2-decisions-hold` (force-delete; Q-G pre-authorized)
- `git branch -D redesign/v050-ideation` (force-delete; Q-G pre-authorized)

### Stage G — Push + PR open + atomic-guard merge + post-merge cleanup (**MANAGER post-Task-02**)
Per D-PLAN-04 (user-locked): all Stage G operations remain manager-owned. See § Manager pre/post-Execution operations for the full sequence.

---

## Tasks

### Task 01 — `create-pre-reset-tag` (local-only per Fix 1)

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

### Task 02 — `cleanup-sweep`

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
traces-to:
  - "Stage A — Discovery + pre-flight (S1, S4, S7)"
  - "Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1"
  - "Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2"
  - "Stage D — Gitignore transformations (Q4, Q-E) → combined with Stage E.1 into sweep-branch commit 3 [Fix 2 iter2]"
  - "Stage E.1 — In-commit session sweep [combined with Stage D into sweep-branch commit 3 — same commit, executor stages D edits before E.1 add]"
  - "Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]"
  - "F-CX-PREP-O-02 — `.gobbi/projects/gobbi/project.json` already-D-in-tree finalized via Stage B `git rm`/`git add -A`"
  - "iter3 Q-Gate-Redesign — Stage E.2 gate uses `git log` + `git ls-tree` (NOT SHA-in-session.json)"
  - "Stage F (worktree-remove + local-branch cleanup) — MANAGER post-Task-02 scope [Fix 1 iter2]"
  - "Stage G (push + PR + atomic-guard merge + post-merge cleanup) — MANAGER post-Task-02 scope [D-PLAN-04 user-lock]"
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
  - { path: ".claude-plugin/marketplace.json", op: delete }
  - { path: ".codex/", op: delete }
  - { path: ".agents/", op: delete }
  - { path: ".claude/project/gobbi/", op: delete }
  - { path: ".claude/CLAUDE.md", op: modify }
  - { path: ".gobbi/projects/gobbi/project.json", op: delete }

  # Stage C — adversarial-review delete
  - { path: ".gobbi/projects/gobbi/adversarial-review/", op: delete }

  # Stage C — 13 placeholder subdirs + root README — each entry is TWO sub-ops: delete-contents + create stub README
  # (per Fix Cleanup F-CL-U-02: `op: modify` was overloaded in iter1; split into uniform delete+create pair)
  - { path: ".gobbi/projects/gobbi/archive/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/archive/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/backlogs/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/backlogs/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/decisions/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/decisions/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/design/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/design/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/features/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/features/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/gotchas/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/gotchas/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/learnings/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/learnings/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/mistakes/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/mistakes/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/notes/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/notes/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/plans/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/plans/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/references/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/references/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/reviews/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/reviews/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/tmp/", op: delete-contents }
  - { path: ".gobbi/projects/gobbi/tmp/README.md", op: create }
  - { path: ".gobbi/projects/gobbi/README.md", op: delete }
  - { path: ".gobbi/projects/gobbi/README.md", op: create }

  # Stage D + Stage E.1 — gitignore transformations + in-commit session sweep (SAME commit, Fix 2)
  - { path: ".gitignore", op: modify }
  - { path: ".gobbi/.gitignore", op: modify }
  - { path: ".gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/", op: create }
  - { path: ".gobbi/projects/gobbi/sessions/2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/", op: delete }
  - { path: ".gobbi/projects/gobbi/sessions/sess-final/", op: delete }
  - { path: ".gobbi/projects/gobbi/sessions/99999999-aaaa-bbbb-cccc-dddddddddddd/", op: delete }
  # 49 additional bare-UUID dirs swept by predicate (find/xargs); see File map § Stage E.1

  # Stage E.2 — terminal bare-UUID FS-only delete (NOT in any commit; executor's last act before DONE)
  - { path: ".gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/", op: delete }

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
     #5-pre  git branch | grep -vE '^[* ] (main|develop|<sweep-branch>)$' → no rows (executor-side precursor only — Success #5 itself verifies post-merge from main tree per F-CL-S-02 cleanup)
     #6-pre  git worktree list | wc -l → 2 (main + sweep worktree; manager removes sweep + 2 stale worktrees in Stage F)
     #7  find .claude/{skills,agents} -xtype l → empty
     #8  Root contains only .git, .gitignore, .claude/, .gobbi/, LICENSE, CHANGELOG.md, README.md
     #10 .gobbi/.gitignore contains neither `sessions/` nor `project/note/`; still contains worktrees/ + settings.json
     #11 git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json → exit 1
     #12 grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md → empty
     #13 Pre-E.2 gate per A above
     [#2, #5-post, #6-post, #9-origin, #14 verify post-Task-02 — MANAGER scope]
```

**Anchor**: Implementation Checklist § Stages A through E.2 (Stage F + Stage G are MANAGER-scope, NOT part of Task 02); Scope Contract § Success Criteria 1, 3-13 (executor-verifiable subset); Scenarios S1-S14 + S3b + S6b.

**Critical ordering invariants enforced inside this single task**:
1. Stage 0 (Task 01) complete + tag pushed by manager (pre-Task-02 §1b) before Task 02 starts.
2. Stage D's gitignore edits staged BEFORE Stage E.1's `git add` of session dir — both in the SAME commit (Fix 2 iter2).
3. Stage E.2 is terminal POST-COMMIT (executor's last act), gated by `git log` + `git ls-tree` (NOT SHA-in-session.json).
4. `git rm` vs `rm -rf` distinguished per file.
5. **Task 02 ends at Stage E.2; Stage F + Stage G are MANAGER scope per D-PLAN-04 (Fix 1 iter2).**

**Mistake-load timing** (per F-CX-PREP-O-01 option a / D-PLAN-01 user-lock):
- The executor loads project mistakes ONCE at task start (Load Directives block), BEFORE Stage A begins.
- All 40+ project mistakes are read at task start.
- Stage C wipes `.gobbi/projects/gobbi/mistakes/` mid-task; this is acceptable because no further executor spawn occurs in this task — the lessons are already in the executor's session context.
- The 3 mistake lessons explicitly encoded inline in the Implementation Checklist (executor-rationalized-failing-verification-gate, session-dir-naming-convention-uses-date-prefix, manager-mispec-grep-c-for-occurrence-count) are baked into the Stage E.2 NEEDS_CONTEXT clause, the explicit `c676684d-` naming, and the empty-output grep gate respectively.

---

## Manager pre/post-Execution operations

Per D-PLAN-04 (user-locked) + Fix 1 (iter2 role-boundary remediation): the manager performs these operations DIRECTLY (not via subagent delegation) before and after Task 02. They are listed here for audit completeness; they are NOT planned tasks because Planning decomposes only executor work.

### Pre-Task-01 (manager-direct)

1. **Create the GitHub issue** for the sweep, per `git/SKILL.md` Procedure P1: `gh issue create --title "<title>" --body "<body>"`. Issue body cites the 19 user-confirmed locks + the pre-reset tag + this Plan's path + the iter2/3/4 deltas + the iter2 REVISE rationale. The returned issue number drives the sweep branch name (per `git/conventions.md`).

### Pre-Task-02 (manager-direct, after Task 01 returns DONE)

1b. **Push the pre-reset tag to origin** (NEW step per Fix 1 iter2 — tag push moved out of Task 01 to honor `git/SKILL.md` § Role Boundaries "Push to remote = Manager"):
   ```
   git push origin pre-reset-2026-05-21
   ```
   Verify: `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches. This completes Success Criterion #9's origin half (Task 01 already verified the local half).

2. **Create the worktree** at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`, branched from develop tip `487fc35`:
   ```
   git worktree add -b <sweep-branch> .gobbi/projects/gobbi/worktrees/<sweep-branch>/ develop
   ```
3. **Install deps if any** in the worktree (no-op for current repo state — no `package.json` post-Workstream-B).
4. **Delegate Task 02** with: absolute worktree path, `<sweep-branch>` name, issue number, the user-locked context (19 locks + 3 pre-routed constraints + 4 D-PLAN locks + Fix 1 iter2 scope boundary). The delegation prompt's `## Constraints / Scope` block explicitly states: "executor stops after Stage E.2; do NOT push, do NOT create PR, do NOT merge, do NOT remove worktrees, do NOT delete branches — Stage F + Stage G are MANAGER scope per D-PLAN-04."

### Post-Task-02 (manager-direct, after Task 02 returns DONE)

These are `git/SKILL.md` Procedure P5 operations performed by the manager itself; they are NOT in any planned task. Steps 5a-5b cover Stage F (worktree-remove + local-branch cleanup, moved from Task 02 to manager per Fix 1 iter2); steps 6-13 cover Stage G.

5a. **Stage F.1 — Worktree removal** (NEW manager step per Fix 1 iter2 — Cleanup row in `git/SKILL.md` § Role Boundaries):
   ```
   git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation         # NO --force
   git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules  # NO --force
   git worktree prune
   find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete            # iter2 L-1 / S14
   ```
   The sweep worktree itself is removed later (step 11) after the squash merge — pre-merge it still hosts the sweep commits the manager needs to push.

5b. **Stage F.2 — Local branch deletion** (NEW manager step per Fix 1 iter2):
   ```
   git branch -d fix/257-complete-mirror-sync                # safe-delete, Q-G
   git branch -d refactor/257-skills-agents-rules            # safe-delete, Q-G
   git branch -D pr-fin-2-decisions-hold                     # force-delete; Q-G pre-authorized
   git branch -D redesign/v050-ideation                      # force-delete; Q-G pre-authorized
   ```
   `-D` use is pre-authorized by Scope Contract § Q-G (the user's explicit lock); per `git/SKILL.md` Forbidden Operations this satisfies the Always-Ask category.

6. **Push the sweep branch to origin**, from the sweep worktree:
   ```
   cd <worktree-absolute-path> && git push -u origin <sweep-branch>
   ```
7. **Open the PR** into `develop`:
   ```
   gh pr create --base develop --head <sweep-branch> \
     --title "chore(<issue-num>): destructive repo reset pre-rebuild" \
     --body "<body citing 19 locks + 3 pre-routed constraint resolutions + pre-reset-2026-05-21 tag + iter2 REVISE fixes + iter4 deltas>"
   ```
8. **Monitor CI**:
   ```
   gh pr checks <pr-num> --watch
   ```
   **Timeout caveat (F-CL-PF-01 cleanup iter2)**: `gh pr checks --watch` has its own default poll-with-no-explicit-timeout behavior — it polls until checks complete or the user interrupts. If CI runs longer than the manager's session-level patience window, the manager pauses and emits NEEDS_CONTEXT to the user ("CI still running after <duration>; investigate or wait?"). No silent retry, no `--exit-status` short-circuit before checks complete.

9. **Capture HEAD_SHA and atomic-guard merge** (per `git/SKILL.md` Procedure P5 + iter4 Q-iter4-Override):
   ```
   HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)
   gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"
   ```
   Non-zero exit → no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); manager re-contracts with user. Per F-CX-O4-01 / D-PLAN-03 user-lock: `--delete-branch` removes both local and remote sweep-branch refs; NO redundant `git branch -d <sweep-branch>` is performed.

10. **Post-merge develop sync** (from main tree):
    ```
    cd /playinganalytics/git/gobbi && git checkout develop && git pull --ff-only
    ```

11. **Sweep worktree cleanup** (per `git/SKILL.md` Procedure P5 steps 3-5):
    ```
    git worktree remove .gobbi/projects/gobbi/worktrees/<sweep-branch>     # NO --force
    git worktree prune
    find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete
    ```

12. **Close the linked issue manually** (per `git/SKILL.md` Procedure P5 step 6 — `develop` is non-default, so PR closing keywords do NOT auto-fire):
    ```
    gh issue close <issue-num> -c "Closed by PR #<pr-num>"
    ```

13. **Post-merge Success Criteria verification** (manager runs the criteria that the executor could not, plus a re-run of executor-side criteria from the main tree):
    - **Success #2**: `git log --oneline -2 develop` → shows 1 new squash commit + `487fc35`
    - **Success #5 (post-merge)**: `git branch | grep -vE '^[* ] (main|develop)$'` → no rows (sweep branch gone via `--delete-branch`; the 4 Q-G branches gone via step 5b). This is the LITERAL Scope Contract Success #5 (no `<sweep-branch>` patch — per F-CL-S-02 cleanup iter2).
    - **Success #6 (post-merge)**: `git worktree list | wc -l` → 1 (main only; sweep + 2 stale removed by steps 5a + 11).
    - **Success #9 (origin half)**: confirmed at step 1b above.
    - **Success #14**: `gh pr merge` returned exit code 0 (already observed in step 9; recorded for audit).
    - Re-run #1, #3, #4, #7, #8, #10-13 from the main tree (post-checkout-develop, post-pull) to confirm the squash-merged state matches the executor's pre-merge in-worktree state.

---

## Dependency table

| Task | Depends on | Blocks | Files touched (groups) |
|---|---|---|---|
| 01-create-pre-reset-tag | (none) | Manager pre-Task-02 §1b (tag push), then 02-cleanup-sweep | local `refs/tags/pre-reset-2026-05-21` only — no working-tree files |
| 02-cleanup-sweep | 01-create-pre-reset-tag (+ manager tag-push pre-Task-02 §1b + manager worktree create §2-4) | (none — terminal executor task; manager picks up at Stage F + Stage G) | Stage A through E.2 file set (see File map; ~30 tracked paths + ~52 FS-only session dirs + 1 terminal FS delete) |

**Dependency rationale**:
- 01 → manager-push §1b → 02 chain per Scope Contract § Q-F: tag must exist locally + on origin before the sweep branch opens. Per Fix 1 iter2, the push is now manager-scope, sitting between Task 01 and Task 02.
- 02 is the terminal executor task; commits ready when 02 returns DONE; manager performs Stage F (worktree-remove + branch cleanup) and Stage G (push/PR/merge) post-Task-02.

**File-overlap check**: Task 01 touches only the tag ref (no working-tree files); Task 02 touches the broad workspace (no ref operations). No overlap, no conflict.

---

## Parallel lanes

| Lane | Tasks | Order |
|---|---|---|
| L1 (sole) | 01 → 02 | sequential |

**Lane rationale**: Per Execution Loop's contract, implementation tasks always sequence (never parallelize). Task 01's local tag must exist before manager-push §1b runs; manager-push §1b must complete before Task 02 starts because Task 02's eventual PR (manager-created post-Task-02) cites the tag.

**Conflict flags**: None.

---

## Agent assignments

### Task 01 — `01-create-pre-reset-tag`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles` (always); (2) `mistake` (always); (3) `.claude/skills/orchestration/workflow/execution.md` (phase doc); (4) `.claude/skills/execution/SKILL.md` (role skill); (5) `.claude/skills/git/SKILL.md` (Role Boundaries — note the executor MUST NOT push the tag per Fix 1 iter2) |
| Required mistakes | `executor-rationalized-failing-verification-gate.md`, `executor-boundary-extension-without-asking.md`, `manager-mispec-grep-c-for-occurrence-count.md`, `session-dir-naming-convention-uses-date-prefix.md` (load full project mistakes set at task start; these 4 are the inline-cited ones) |
| Justification | Default executor; no override needed. The task is a small, contract-bounded local-ref-only operation. |
| Worktree | Operates against the **main tree** at `/playinganalytics/git/gobbi/` — Task 01 only touches a local ref; no worktree needed because no working-tree files change. |
| Special discipline | **NO PUSH** — `git push origin pre-reset-2026-05-21` is manager-scope per Fix 1 iter2 / `git/SKILL.md` § Role Boundaries "Push to remote = Manager / Subagent = Never". The executor stops at `git tag -a pre-reset-2026-05-21 487fc35` and returns DONE with the local tag confirmed via `git rev-parse`. |

### Task 02 — `02-cleanup-sweep`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles`; (2) `mistake`; (3) `.claude/skills/orchestration/workflow/execution.md`; (4) `.claude/skills/execution/SKILL.md`; (5) `.claude/skills/git/SKILL.md` (full § Role Boundaries — executor MUST respect manager-only operations: Push, PR, Merge, Cleanup, tag push; (6) `.claude/skills/git/conventions.md` (branch naming, commit grammar, AI-Provenance trailer) |
| Required mistakes | All 40 project mistakes at `.gobbi/projects/gobbi/mistakes/` (loaded ONCE at task start per F-CX-PREP-O-01 / D-PLAN-01); inline-cited: `executor-rationalized-failing-verification-gate.md` (E.2 NEEDS_CONTEXT clause); `session-dir-naming-convention-uses-date-prefix.md` (Stage E.1 c676684d- explicit naming); `manager-mispec-grep-c-for-occurrence-count.md` (empty-output assertion for CLAUDE.md table-row grep; rationale corrected in iter2 — see Self-review § 4); `executor-boundary-extension-without-asking.md` (do NOT push, do NOT create PR, do NOT merge, do NOT remove worktrees, do NOT delete branches — all manager-scope per Fix 1 iter2 + D-PLAN-04). |
| Justification | Default executor; sonnet appropriate because the Plan provides a concrete contract (Stages A through E.2) with explicit verification gates. The task's complexity is in **execution discipline** (~30 tracked paths, 3 commit boundaries, 1 terminal-gate clause), not in design judgment. Stage F (the iter1 stretch goal) is now manager-scope so the executor's cognitive load is reduced. |
| Worktree | The **manager** creates the worktree before delegation (per `git/SKILL.md` Procedure P2) at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`. The executor's first action is to `cd` to the worktree's absolute path. Branch name follows `git/conventions.md` (e.g., `chore/<issue-num>-repo-reset` or per user choice at Execution DISCUSSION). |
| Special discipline | (a) **Mistake-load is one-time at task start** (F-CX-PREP-O-01 / D-PLAN-01 option a); the executor MUST NOT attempt to re-load mistakes from `.gobbi/projects/gobbi/mistakes/` after Stage C wipes the directory. (b) **No push, no PR-create, no merge, NO worktree-remove, NO local-branch delete, NO `--force`** — all manager-only per Fix 1 iter2 / D-PLAN-04 / `git/SKILL.md` § Role Boundaries. The executor commits Stages B, C, D+E.1 (3 commits total) to `<sweep-branch>` in the worktree, runs Stage E.2's gate + FS deletion, then returns DONE. (c) **No `--no-verify`, no `git stash`, no `git reset --hard`**; on any verification-gate divergence, return NEEDS_CONTEXT (Iron Law 11 + `executor-rationalized-failing-verification-gate.md`). (d) **No `git commit --amend`** — D+E.1 share a commit by staging D's edits and E.1's add before the single `git commit` (Fix 2 iter2). |

---

## Self-review report

### 1. Spec coverage matrix (Sub-step E.1, revised iter2 per Fix 1 + Fix 4)

Every Implementation Checklist Stage maps to a task or to a manager pre/post-Task-02 operation:

| Checklist Stage | Owner | Status |
|---|---|---|
| Stage 0 — tag create (local) | Task 01 (executor) | ✓ |
| Stage 0 — tag push to origin | **Manager pre-Task-02 §1b** (Fix 1 iter2) | ✓ |
| Stage A — Discovery + pre-flight | Task 02 (executor) | ✓ |
| Stage A — branch-open (worktree create) | **Manager pre-Task-02 §2** (Fix 4 iter2 — was Task 02 in iter1) | ✓ |
| Stage B — Code + plugin + root + CLAUDE.md surgical edit | Task 02 (executor) — commit 1 | ✓ |
| Stage C — Adversarial-review + placeholder reset | Task 02 (executor) — commit 2 | ✓ |
| Stage D — Gitignore transformations | Task 02 (executor) — combined into commit 3 (Fix 2 iter2) | ✓ |
| Stage E.1 — In-commit session sweep | Task 02 (executor) — combined into commit 3 (Fix 2 iter2) | ✓ |
| Stage E.2 — Terminal bare-UUID delete | Task 02 (executor; terminal FS step, NOT a commit) | ✓ |
| Stage F — Worktree-remove + local-branch cleanup | **Manager post-Task-02 §5a + §5b** (Fix 1 iter2 — was Task 02 in iter1) | ✓ |
| Stage G — Push + PR open + atomic-guard merge + post-merge cleanup | **Manager post-Task-02 §6-13** | ✓ |
| Pre-Task-01: Issue create | Manager pre-Task-01 §1 | ✓ |

**Spec-coverage corrections from iter1**:
- iter1 marked Stage A as Task 02 only; iter2 splits Stage A's branch-open (worktree create) to manager pre-Task-02 §2 (Fix 4 — F-CX-PLAN-O-03 self-review accuracy).
- iter1 marked Stage F as Task 02; iter2 reassigns to manager post-Task-02 §5a+5b (Fix 1 — F-CL-P-01 + F-CX-PLAN-O-01 role-boundary leak).
- iter1 marked Stage 0's push as Task 01; iter2 reassigns to manager pre-Task-02 §1b (Fix 1).

All 19 Ideation locks mapped (unchanged from iter1 Plan's mapping): Q1/Q5/Q6/Q7/Q-D/Item 5/H-1/.claude-plugin → Stage B (Task 02); Q2/Q-A/Q-C/Item 3 → Stage C (Task 02); Q4/Q-E → Stage D (Task 02, combined with E.1); Q8/Q-B → Stage E.1/E.2 (Task 02); Q-G + Worktree → Stage F (Manager §5a+5b — moved); Q3/Q-iter4-Override + Q-Gate-Redesign → Stage E.2 (Task 02) + Stage G (Manager §9); Q-F → Stage 0 (Task 01 local + Manager push §1b); Q-Survivor → Stage B H-1 surgical edit (Task 02); Q-StageE → Stage E split (Task 02 E.1 in-commit + E.2 terminal post-commit FS).

**Success Criteria coverage matrix (revised iter2 per Fix 1)**:

| # | Criterion | Verified by | Owner |
|---|---|---|---|
| 1 | `git status` post-sweep shows only intended changes | Task 02 verifies block C | Executor (pre-DONE) |
| 2 | `git log --oneline -2 develop` shows 1 new squash commit + `487fc35` | Manager post-merge §13 | Manager (post-merge) |
| 3 | `ls .gobbi/projects/gobbi/` matches survivors + placeholders | Task 02 verifies #3 | Executor (pre-DONE) |
| 4 | Exactly 1 session dir | Task 02 verifies #4 | Executor (pre-DONE) |
| 5 | `git branch | grep -vE '^[* ] (main|develop)$'` returns no rows post-merge | Manager post-merge §13 (literal Scope Contract pattern) | Manager (post-merge) |
| 6 | `git worktree list | wc -l → 1` post-cleanup | Manager post-merge §13 (after §5a + §11) | Manager (post-merge) |
| 7 | No broken symlinks under `.claude/{skills,agents}` | Task 02 verifies #7 | Executor (pre-DONE) |
| 8 | Root contents reduced to canonical set | Task 02 verifies #8 | Executor (pre-DONE) |
| 9 | Pre-reset tag exists locally + on origin at `487fc35` | Task 01 verifies local; Manager pre-Task-02 §1b verifies origin | Executor (Task 01 — local) + **Manager pre-Task-02 §1b (origin — Fix 1 iter2)** |
| 10 | `.gobbi/.gitignore` cleaned | Task 02 verifies #10 | Executor (pre-DONE) |
| 11 | `git check-ignore` on tracked session.json returns exit 1 | Task 02 verifies #11 | Executor (pre-DONE) |
| 12 | CLAUDE.md table rows removed | Task 02 verifies #12 | Executor (pre-DONE) |
| 13 | E.2 gate pre-conditions both pass | Task 02 verifies A | Executor (pre-DONE) |
| 14 | `gh pr merge --match-head-commit` returned exit 0 | Manager post-merge §9 | Manager (post-merge) |

Every criterion maps to Task 01 / Task 02 / a Manager pre/post-Execution operation. **Per F-CL-S-02 cleanup iter2**, criterion #5 is no longer "jointly verified" with a patched regex — it is exclusively manager post-merge using the literal Scope Contract regex; the executor's `#5-pre` block-D entry is a clearly-labeled pre-merge precursor, not a verification of Success #5.

**Gap check**: Each checklist item has an owner; each task has a checklist anchor; each success criterion has a verifying owner. No anchor-less items, no unmatched checklist items, no orphan criteria.

### 2. Placeholder scan (Sub-step E.2)

`grep -nE '(TBD|TODO|to be defined|<\.\.\.>|XXX|FIXME)' draft-iter2.md` against this file: zero hits in task definitions, acceptance criteria, or file paths. The placeholder *parameters* `<sweep-branch>`, `<pr-num>`, `<issue-num>`, `<worktree-absolute-path>`, `<HEAD_SHA>` are manager-fill-at-delegation values, not unresolved Plan content.

### 3. Type / name consistency (Sub-step E.3)

| Identifier | First use | Subsequent uses | Match |
|---|---|---|---|
| `pre-reset-2026-05-21` (tag name) | Task 01 `files`, `outputs` | Manager pre-Task-02 §1b, Task 02 `inputs`, manager §7 PR body | ✓ |
| `487fc35` (tag target SHA) | Task 01 `verifies` | Manager §1b verify, scope-contract Q-F | ✓ |
| `<sweep-branch>` (placeholder for branch name) | Task 02 `verifies`, manager §2/§6/§7/§9 | Same placeholder usage | ✓ |
| `HEAD_SHA` / `$HEAD_SHA` | Manager §9 (single owner) | Same step | ✓ |
| `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (kept session dir) | File map § Stage C survivors + Stage E.1 | Same exact path | ✓ |
| `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` (bare-UUID dir to delete) | File map § Stage E.2 | Same exact path | ✓ DISTINCT from kept dir |
| 13 placeholder subdirs | File map § Stage C | Same 13 names in Task 02 `files` | ✓ |
| `redesign/v050-ideation` vs `redesign-v050-ideation` (worktree dir slash-encoded) | File map § Stage F (Manager §5a) | Manager §5a worktree-remove path uses the literal worktree dir name `redesign-v050-ideation`; branch name `redesign/v050-ideation` | ✓ — branch ref name and worktree dir name intentionally differ (branch contains `/`; worktree dir does not — `git worktree add` flattens) |
| `refactor/257-skills-agents-rules` (branch + worktree dir both use slash) | File map § Stage F | Manager §5a uses literal path | ✓ |

No type/name drift detected.

### 4. F-CL-C-04 cleanup — grep-pattern self-description fix

iter1 main.md line 55 stated: "D2 #16 (the CLAUDE.md table-row excision audit) uses `$`-anchored `grep -c` per `manager-mispec-grep-c-for-occurrence-count.md` — counts lines, not occurrences, which is correct because each table row is one line." This was factually wrong on two counts: (a) the actual Plan gate at Task 02 #12 is `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` (no `$`-anchor, no `-c` flag); (b) Scope Contract Success #12 uses `grep -nE '^\| \[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` (`^`-anchored start-of-line + pipe, not `$`-anchored).

**iter2 correction (applied to staging/plans/main.md and reflected in File map § Stage B and Task 02 `verifies` #12)**: the gate asserts **empty output** of an unanchored `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md`. The `manager-mispec-grep-c-for-occurrence-count.md` mistake teaches that `grep -c` counts lines (not occurrences) — that mistake does **not** apply here because this gate is an empty-vs-nonempty assertion, not an occurrence-count assertion. The gate works in practice because lines 61-62 are the only lines in `.claude/CLAUDE.md` containing those tokens (verified empirically). Optionally, the gate could be hardened to the literal Scope Contract pattern (`^\| \[`v050-(overview|cli)\.md`\]`) to be self-anchoring — but the unanchored gate is functionally correct against the current `.claude/CLAUDE.md` content.

### 5. F-CL-C-03 cleanup — M-2 Implementation Checklist supersession flag

Implementation Checklist line 104 (Stage G section) reads: `**(iter2 M-2)** Post-merge local cleanup: git checkout develop && git pull && git branch -d <sweep-branch>.` and line 114 (Critical ordering invariant 6) reads: `**(iter2 M-2)** Post-merge git branch -d <sweep-branch> to honor Success Criterion #5.` Both contain the redundant `git branch -d <sweep-branch>` step.

**iter2 supersession notice (NEW, applied in the Decisions Log § D-PLAN-03 below)**: **For this workflow, Implementation Checklist lines 104 and 114's `git branch -d <sweep-branch>` clauses are LOGICALLY SUPERSEDED by D-PLAN-03 user-lock — the manager post-merge sequence (this Plan § Manager post-Task-02 §10) ends at `git checkout develop && git pull --ff-only` only; no `git branch -d <sweep-branch>` is run because `gh pr merge --squash --delete-branch` already deletes the local sweep branch.** This notice does NOT edit the Ideation artifact (which retains `status: final`); the Plan-level supersession flag tells the executor's delegation prompt and any manager script-driver to skip those checklist clauses.

### 6. F-CL-U-02 cleanup — Stage C `op:` schema uniformity fix

iter1 used `op: modify` for the 13 placeholder subdir entries with the prose semantic "wipe contents + write stub README". This overloaded the keyword: `modify` elsewhere in the Plan means "edit some content" (e.g., the CLAUDE.md surgical edit, the `.gitignore` line drop). **iter2 split** each subdir into TWO uniform entries: `{ path: "<subdir>/", op: delete-contents }` + `{ path: "<subdir>/README.md", op: create }`. The root README receives the same treatment: `{ path: ".gobbi/projects/gobbi/README.md", op: delete }` + `{ path: ".gobbi/projects/gobbi/README.md", op: create }` — semantically a replace, mechanically a delete-then-create pair.

**Schema legend** (now uniform across Task 02 `files:`):
- `op: create` — write a new file (path is the file).
- `op: modify` — edit existing file contents (path is the file).
- `op: delete` — `git rm` (if tracked) or `rm -rf` (if untracked) — path is file or directory.
- `op: delete-contents` — remove ALL items under a directory (`git rm -r <dir>/*` for tracked + `rm -rf <dir>/*` for untracked stragglers) — path is the directory; the directory itself remains.

### 7. F-CL-A-01 cleanup — `files:` inline-comment cleanup

iter1's Task 02 `files:` list mixed schema entries with inline `# ...` comments encoding load-bearing context (e.g., `# wipes ALL ~40 project mistakes — load BEFORE this stage` on the mistakes/ entry; `# already D in tree (F-CX-PREP-O-02)` on `.claude-plugin/marketplace.json`). **iter2 keeps the YAML schema clean** — inline comments are removed from `files:` and the load-bearing context lives in: (a) File map prose (per-Stage sections), (b) Task 02 `traces-to:` (added explicit F-CX-PREP-O-02 + Q-Gate-Redesign anchors per F-CL-P-02 spirit), (c) the "Mistake-load timing" subsection. The YAML is now greppable as pure `{path, op}` pairs.

### 8. F-CL-R-01 cleanup — Rollback coverage explicit

iter1 did not explicitly document that the pre-reset tag (`pre-reset-2026-05-21` at `487fc35`) covers ONLY the develop tip — the 4 branches deleted in Stage F (`fix/257-complete-mirror-sync`, `refactor/257-skills-agents-rules`, `pr-fin-2-decisions-hold`, `redesign/v050-ideation`) have their tips deleted with `-d` (safe) or `-D` (force, Q-G pre-authorized) and are recoverable ONLY via `git reflog` for the local default of ~30-90 days. **iter2 documents this explicitly** in § NOT in scope item 15 below. This is the known rollback constraint, accepted under Q-G's pre-authorization.

### User-approved acceptances

- **D-PLAN-01** (user-locked at Planning iter1 DISCUSSION): single-executor sweep adopted.
- **D-PLAN-03** (user-locked at Planning iter1 DISCUSSION): redundant `git branch -d <sweep-branch>` step dropped; Implementation Checklist lines 104+114 logically superseded for this workflow (see § 5 above).
- **D-PLAN-04** (user-locked at Planning iter1 DISCUSSION): honor `git/SKILL.md` Role Boundaries — push/PR/merge stay with the manager.
- **Fix 1 iter2 (user-authorized at REVISE entry)**: extend D-PLAN-04 to ALL manager-owned operations in the Role Boundaries table — tag push (out of Task 01), worktree-remove + local-branch cleanup (out of Task 02, moved to Manager §5a + §5b).
- **Fix 2 iter2 (user-authorized at REVISE entry)**: Stage D + Stage E.1 land in the SAME commit (commit 3 of exactly 3 sweep commits). No `git commit --amend` is used.

---

## NOT in scope

Items the plan does NOT cover, with rationale:

1. **The rebuild itself** — explicitly deferred to a follow-on session (Scope Contract § Out-of-Scope + § Deferred).
2. **Touching `.claude/README.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/.env`, `.claude/worktrees/`** — Scope Contract § Out-of-Scope. The H-1 surgical edit on `.claude/CLAUDE.md` lines 61-62 is the ONLY `.claude/` change.
3. **Touching `.gobbi/settings.json`** — runtime CLI state (Scope Contract § Out-of-Scope).
4. **Re-architecting `.claude/` content** — only `.claude/project/gobbi/` removed (Q-D) and the H-1 2-line edit landed.
5. **Remote-branch deletion of the 4 Q-G branches** — these are local-only deletes by the manager in Stage F (§5b); no `git push origin :<branch>` is run because none of the 4 branches has a tracked origin counterpart per Preparation handoff.
6. **Touching `main` or `develop` branches** — sweep lands via PR → squash-merge into develop; no direct edits, no force-push, no history rewrite.
7. **Rewriting git history** — explicitly out (Scope Contract).
8. **Writing the sweep commit SHA into any tracked file** — removed in iter3 per Q-Gate-Redesign.
9. **Post-merge body-grep verification of `$HEAD_SHA`** — removed in iter4 per Q-iter4-Override; replaced by `--match-head-commit` atomic guard.
10. **Test-writing tasks** — Planning does NOT slice "write test X" as a task. Verification gates anchor to the 14 Success Criteria + D2's commands.
11. **Backlog promotion target setup** — the staged `cli-regenerates-gobbi-gitignore.md` backlog stays session-scoped (per iter2 H-4); the rebuilt CLI session reads it from the preserved session dir.
12. **CLI regenerator fix for `.gobbi/.gitignore`** — deferred to backlog at `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`.
13. **Push / PR create / PR merge / post-merge cleanup** — per D-PLAN-04 (user-locked) + Fix 1 iter2: MANAGER-only operations performed directly (not via subagent), AFTER Task 02 returns DONE. Documented in § Manager pre/post-Execution operations §6-13. Not in any planned task.
14. **Worktree creation, worktree removal, local-branch deletion, tag push, issue create/close** — manager-direct operations per `git/SKILL.md` § Role Boundaries (Issue, Worktree, Branch [remote], Push, PR, Merge, Cleanup). Documented in § Manager pre/post-Execution operations §1, §1b, §2-4, §5a-5b, §11-12. Not in any planned task.
15. **Rollback coverage beyond develop tip (F-CL-R-01 cleanup iter2)** — the `pre-reset-2026-05-21` tag at `487fc35` preserves the develop tip ONLY. The 4 branch tips deleted in Manager §5b (`fix/257-complete-mirror-sync`, `refactor/257-skills-agents-rules`, `pr-fin-2-decisions-hold`, `redesign/v050-ideation`) live in the local reflog for ~30-90 days post-deletion; after reflog expiry their tip SHAs are unreachable. This is the accepted irreversibility of Stage F per user lock Q-G (which pre-authorized the `-D` force-deletes). No additional `pre-reset-<branch>-2026-05-21` tags are created for those branches; they have already passed the Q-G "no longer needed" determination.

---

## Decisions log

This section records every AskUserQuestion the manager ran (or pre-resolved via the brief), with the user-locked resolution.

### D-PLAN-01 — F-CX-PREP-O-01 mistake-memory continuity option (a) vs (b)

**Pre-routed binding constraint** (Preparation iter1 Codex, High/75).

| Option | Description | Trade-off |
|---|---|---|
| **(a) Single-executor sweep — USER-LOCKED** | Stages A through E.2 run within ONE executor task (Task 02). Project mistakes loaded ONCE at task start before Stage C wipes `mistakes/`. No machinery beyond standard Load Directives. | Task 02 covers multi-stage destructive operations across ~30 tracked paths. Sonnet handles structured contracts well; in-context discipline burden mitigated by explicit per-stage gates. |
| (b) Multi-task with snapshot | Stages A, B/C, D, E.1, E.2 as separate executor tasks. Pre-Stage-C snapshot of `mistakes/` to session staging; post-Stage-C executor tasks load from snapshot path. | More bisect-safe per-stage spawn boundaries; but requires delegation-prompt override for `mistake` skill's P1 path + snapshot orchestration. |

**User decision (locked at Planning iter1 DISCUSSION)**: **(a) Single-executor sweep**.

### D-PLAN-02 — F-CX-PREP-O-02 project.json deletion drift

**Pre-routed binding constraint** (Preparation iter1 Codex, Medium/75; resolved inline).

**Resolution**: Task 02's `files:` list explicitly enumerates BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as `op: delete`. Task 02 `traces-to:` also names the F-CX-PREP-O-02 anchor for executor visibility (added iter2 per F-CL-P-02 spirit).

### D-PLAN-03 — F-CX-O4-01 `gh --delete-branch` redundancy + iter4 checklist supersession flag

**Pre-routed binding constraint** (Ideation iter4 Codex, Medium/75).

| Option | Description | Trade-off |
|---|---|---|
| **(a) Drop redundant local `git branch -d <sweep-branch>` — USER-LOCKED** | After `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` succeeds, manager `git checkout develop && git pull` and stops. The sweep branch is already deleted locally + remotely. | Cleaner Stage G; one fewer step; matches `gh pr merge --help` behavior. |
| (b) Keep `git branch -d <sweep-branch>` as defense-in-depth | After `gh pr merge`, also run `git branch -d <sweep-branch>`; accept benign "branch not found" exit. | One more step; benign-error false-alarm on cleanup verification. |

**User decision (locked at Planning iter1 DISCUSSION)**: **(a) Drop the redundant step**.

**iter2 supersession flag (NEW, per F-CL-C-03 cleanup)**: Implementation Checklist line 104 (`(iter2 M-2)` post-merge `git branch -d <sweep-branch>`) and line 114 (`(iter2 M-2)` Critical Ordering Invariant 6) are **LOGICALLY SUPERSEDED for this workflow** by D-PLAN-03 user-lock. The Ideation artifact itself is NOT edited (it retains `status: final` per the iter4 PASS lock); the Plan-level supersession flag here instructs:
- The executor delegation prompt: omit those checklist clauses from the executor's effective contract.
- The manager post-merge sequence (this Plan § Manager post-Task-02 §10): ends at `git checkout develop && git pull --ff-only` only.
- Any human reader of the Implementation Checklist: read those lines knowing they are superseded.

### D-PLAN-04 — Honor git-skill role boundaries (USER-LOCKED at iter1; EXTENDED at iter2 REVISE)

**Original user lock (Planning iter1 DISCUSSION)**: Subagents commit but never push, create PRs, or merge.

**iter2 extension (user-authorized at REVISE entry, per Fix 1)**: The Role Boundaries table in `git/SKILL.md` (lines 90-102) names six manager-owned categories: Issue, Worktree, Branch (remote push), Push to remote, PR, Merge, Cleanup. iter1's Plan correctly assigned Push/PR/Merge to the manager but kept (i) Task 01's `git push origin pre-reset-2026-05-21`, (ii) Task 02's Stage F (worktree-remove + local-branch cleanup) inside executor scope — citing an unwritten "local-ref mutation" carve-out. The leader's interpretation was not in the skill. **At iter2 REVISE, the user authorized extending D-PLAN-04 to the LITERAL Role Boundaries table**: all six manager-owned categories are MANAGER scope; the executor commits and runs Stage E.2's gate + FS delete, nothing else.

**Resolution applied to iter2 Plan**:

1. **Task 01's `what` rewritten**: "Create lightweight tag locally at `487fc35`. STOPS at 'tag created locally' — push is MANAGER scope." `outputs:` reduced to just `tag-pre-reset-2026-05-21-local`. `verifies:` only the local rev-parse; ls-remote verification moves to Manager pre-Task-02 §1b.
2. **Task 02's `what` rewritten**: scope narrowed to Stages A through E.2 (no Stage F). The `files:` list no longer contains worktree-remove or branch-delete targets. The `verifies:` block C now asserts EXACTLY 3 commits (commit count fix per F-CL-S-01 + F-CX-PLAN-O-02; see D-PLAN-06 below).
3. **Manager pre/post-Execution operations expanded**: new §1b (tag push) and §5a (Stage F worktree-remove) and §5b (Stage F branch cleanup) added. Renumbered to keep §6-13 in chronological order.
4. **Special discipline in both tasks' Agent assignments**: rewritten — Task 01 NO PUSH; Task 02 NO PUSH/PR/MERGE/WORKTREE-REMOVE/BRANCH-DELETE.

**Stage E.2 keeps in Task 02 (executor)**: the gate is two read-only git invocations (`git log` + `git ls-tree`) and the deletion is a pure FS op (`rm -rf` of a gitignored dir). Neither is a git mutation subject to the Role Boundaries table — they touch neither refs (read-only) nor tracked trees (the bare-UUID dir is gitignored).

### D-PLAN-05 — Issue creation timing

`git/SKILL.md` Core Principles: "Every task starts from a GitHub issue."

**Resolution**: The manager creates the GitHub issue as the FIRST pre-Execution operation (§1) — before tag work, before worktree, before delegating any task. Issue number drives the sweep branch name and the PR title/body.

### D-PLAN-06 — Stage D + Stage E.1 commit boundary (user-authorized at iter2 REVISE per Fix 2)

iter1's Task 02 `verifies:` block C asserted "≥4 commits" labeled "Stage B/C/D+E.1/F" — combining "D+E.1" into one commit by convention but never spelling out HOW (separate `git commit --amend` vs deferred E.1 commit vs same-commit staging). F-CL-S-01 (Claude Structure, High/75) and F-CX-PLAN-O-02 (Codex Overall, High/80) converged on this ambiguity.

**iter2 user-authorized resolution**: **Stage D and Stage E.1 are staged together and land in a SINGLE commit (commit 3)** — the executor stages Stage D's gitignore edits, then stages Stage E.1's `git add` of the now-trackable session dir AND runs the 52-sibling-dir `rm -rf` AND only THEN runs `git commit` for commit 3. No `git commit --amend` is used. The total sweep-branch commit count is **EXACTLY 3** (commit 1 = Stage B; commit 2 = Stage C; commit 3 = Stage D + Stage E.1). Stage E.2 is post-commit and is NOT a commit. Stage F is no longer in Task 02 (moved to manager per Fix 1) and therefore contributes ZERO commits to the sweep branch.

**Verification**: Task 02 `verifies:` block C now asserts `git rev-list --count develop..<sweep-branch>` == 3 (not "≥4"). Self-review § 1 spec-coverage matrix reflects the same.

### D-PLAN-07 — Stage A branch-open ownership (user-authorized at iter2 REVISE per Fix 4)

iter1 self-review marked Stage A as "Task 02 (executor)". F-CX-PLAN-O-03 surfaced that Stage A's `branch-open` step (per Implementation Checklist line 28) is "[ASSUMES: manager pre-Task-02 has created sweep worktree + branch]" — the branch-open is a manager pre-condition, not an executor action.

**iter2 user-authorized resolution**: Spec-coverage matrix (Self-review § 1) now splits Stage A:
- Stage A's discovery + pre-flight scans → Task 02 (executor).
- Stage A's branch-open (worktree create) → Manager pre-Task-02 §2.

---

## Manager AskUserQuestion shortlist (run before Execution Loop entry)

All 4 D-PLAN AskUserQuestions are resolved (D-PLAN-01, -03, -04 at Planning iter1 DISCUSSION; -06 + -07 at iter2 REVISE user authorization). User-locked answers:
- **D-PLAN-01**: (a) Single-executor sweep
- **D-PLAN-03**: (a) Drop redundant `git branch -d`; iter4 checklist lines 104+114 logically superseded for this workflow
- **D-PLAN-04**: Honor git-skill role boundaries (extended at iter2 to ALL six manager-owned categories)
- **D-PLAN-06**: Stage D + Stage E.1 share commit 3; sweep branch has EXACTLY 3 commits
- **D-PLAN-07**: Stage A branch-open is manager pre-Task-02 op (not Task 02)

No outstanding AskUserQuestion remains for the Execution Loop entry. The manager may proceed to:
1. Issue create (Manager-ops §1)
2. Task 01 delegate (local-only tag create)
3. Tag push (Manager-ops §1b)
4. Worktree create (Manager-ops §2-4)
5. Task 02 delegate (with Fix 1 + Fix 2 scope explicit in delegation prompt)
6. Manager post-Task-02 operations §5a-§13

---

## Notes for the Execution Loop manager

- **Worktree path**: `git/SKILL.md` Procedure P2 names the worktree at `.gobbi/projects/gobbi/worktrees/<branch-name>/`. Suggested branch name (subject to user confirmation per `git/conventions.md`): `chore/<issue-num>-repo-reset`.
- **Working-tree base**: develop tip is `487fc35` per Preparation handoff. Task 01's tag operation runs against the main tree at `/playinganalytics/git/gobbi/` (no worktree needed; refs are global).
- **Pre-merge gate** (manager-side): all CI checks green (§8), Task 02 returned DONE with all executor-side criteria verified, no orphan worktrees (after §5a), PR body cites Conventional sections + 19 locks + 3 pre-routed resolutions + 5 D-PLAN locks + pre-reset tag + iter2 REVISE rationale. The atomic-guard merge `--match-head-commit "$HEAD_SHA"` (§9) is the canonical merge command.
- **Post-merge cleanup**: manager pulls develop (§10), removes the sweep worktree (§11 — `git worktree remove ...`, NOT `--force`), prunes, cleans empty parent dirs. The sweep branch is already gone locally + remotely via `--delete-branch`. The 2 stale worktrees + 4 stale branches were removed by §5a + §5b PRE-merge.
- **Issue closure** (manager-side): manager runs `gh issue close <issue-num> -c "Closed by PR #<pr-num>"` post-merge (§12).
- **NEEDS_CONTEXT recovery semantics**: Task 02's NEEDS_CONTEXT can fire at Stage E.2's gate (either `git log` returns empty SHA or `git ls-tree` misses the kept session dir). Manager-side NEEDS_CONTEXT can fire at §8 (CI timeout per F-CL-PF-01 cleanup) or §9 (non-zero exit from `gh pr merge --match-head-commit`). Either case: no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); the responsible role re-contracts with the user.

---

**End of rawdata draft — Planning iter2 (surgical-fix REVISE; supersedes draft-iter1.md).**
