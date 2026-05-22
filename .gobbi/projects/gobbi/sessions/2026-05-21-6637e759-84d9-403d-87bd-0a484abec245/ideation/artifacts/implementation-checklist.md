---
loop: ideation
iter: 4
artifact_type: implementation-checklist
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/design-direction.md
  - ideation/rawdata/draft-iter4.md
---

# Implementation Checklist — Repo Reset (iter4 PASS)

Verbatim from draft-iter4.md § Implementation Checklist. Commit labels ("sweep-branch commit N") refer to bisect-safe commits on the sweep branch; per M-1, the PR squash-merges them into ONE commit on `develop`.

**Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens**

- [ ] `git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required).
- [ ] `git push origin pre-reset-2026-05-21`.
- [ ] Verify: `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches.

**Stage A — Discovery + pre-flight (S1, S4, S7)**

- [ ] Pre-flight: confirm both worktree paths are clean (`git -C <wt> status` → empty), branch state matches expectations.
- [ ] Pre-flight: re-check `git status` against the inventory.
- [ ] Pre-flight: open the sweep branch off `develop` (per `git.workflow=worktree-pr`).

**Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1**

- [ ] `git rm -r packages/` (Q1).
- [ ] `git rm package.json bun.lock package-lock.json` (Q5).
- [ ] `rm -rf node_modules/` (Q5; untracked — FS-only hygiene).
- [ ] `git rm -r plugins/gobbi/` (Q6).
- [ ] Handle `test/gitignore.test.sh` (Q6) — `git rm` if tracked, `rm` if not; then `rmdir test/` if empty.
- [ ] `git rm MIGRATION.md AGENTS.md` (Q7).
- [ ] `git rm .claude-plugin/marketplace.json` (already `D`); `rmdir .claude-plugin/` if empty.
- [ ] `git rm -r .codex/` (Item 5, tracked). NOTE: `.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r` removes the symlinks, not the targets.
- [ ] `rm -rf .agents/` (Item 5, untracked — FS-only hygiene).
- [ ] `git rm -r .claude/project/gobbi/` (Q-D).
- [ ] **(iter2 H-1)** Edit `.claude/CLAUDE.md`: remove lines 61-62 (the two table rows containing `[`v050-overview.md`]` and `[`v050-cli.md`]`). Verification post-edit: `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` → empty.
- [ ] `git add .claude/CLAUDE.md`.

**Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2**

- [ ] `git rm -r .gobbi/projects/gobbi/adversarial-review/` (Item 3).
- [ ] For each of the 13 placeholder subdirs (`archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`):
  - `git rm -r <subdir>/*` if any tracked content present (preserve the dir); plus `rm -rf <subdir>/*` to catch untracked stragglers.
  - Verify the dir is empty.
  - Write a one-line stub `<subdir>/README.md` using the D4 inline template.
  - `git add <subdir>/README.md`.
- [ ] **Do NOT touch** `agents/`, `skills/`, `rules/` content (Q-A survivor set).
- [ ] Replace `.gobbi/projects/gobbi/README.md` with a one-line stub (Q-C): `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

**Stage D — Gitignore transformations (Q4, Q-E) → sweep-branch commit 3 [ORDER CRITICAL — Stage D MUST precede Stage E.1's `git add` of the session dir]**

- [ ] Edit root `.gitignore`: remove the line containing `.gobbi/projects/*/sessions/`. Keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines.
- [ ] Edit `.gobbi/.gitignore` (workspace-level): remove `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines.
- [ ] Verify: `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1.
- [ ] `git add .gitignore .gobbi/.gitignore`.
- [ ] **Commit checkpoint**: `git commit -m '<sweep-branch commit 3 msg>'`. (SHA capture not required per iter3 Q-Gate-Redesign.)

**Stage E — Session-dir sweep (Q8, Q-B) — SPLIT per iter2 H-3 into E.1 (in-commit) + E.2 (post-commit terminal). iter3 Q-Gate-Redesign provides the non-circular gate.**

**Stage E.1 — In-commit session sweep [sweep-branch commit 3 continuation or follow-on bisect-safe commit]**

- [ ] `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (NOW possible because Stage D's gitignore edits are committed).
- [ ] Confirm THIS-workflow session-memory writes are present in the staged contents.
- [ ] **Delete the 52 sibling DIR-FORM session dirs** (FS-only — dirs were ignored so no `git rm` needed):
  - `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/` (iter2 M-3: explicit name)
  - `sess-final/` (fixture)
  - `99999999-aaaa-bbbb-cccc-dddddddddddd/` (fixture)
  - 49 bare-UUID dirs (all historical session UUIDs other than `6637e759-...`)
  - Shell: `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d ! -name '2026-05-21-6637e759-84d9-403d-87bd-0a484abec245' ! -name '6637e759-84d9-403d-87bd-0a484abec245' -print0 | xargs -0 rm -rf`
- [ ] **E.1 explicitly DOES NOT delete** the CLI bare-UUID dir `6637e759-...`. That dir is held until Stage E.2.

**Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]**

- [ ] **Gate**: BOTH pre-conditions must return true:
  1. `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]` (exit 0 ⇒ pass).
  2. `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .` (exit 0 ⇒ pass).
- [ ] **If either fails: NEEDS_CONTEXT** — do NOT rationalize (per `executor-rationalized-failing-verification-gate.md`).
- [ ] When BOTH pass: `rm -rf .gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/`.

**Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep-branch commit 4**

- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation`.
- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules`.
- [ ] **(iter2 L-1)** `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete`.
- [ ] `git branch -d fix/257-complete-mirror-sync`.
- [ ] `git branch -d refactor/257-skills-agents-rules`.
- [ ] `git branch -D pr-fin-2-decisions-hold`.
- [ ] `git branch -D redesign/v050-ideation`.

**Stage G — PR open + head-SHA capture + atomic-guard squash merge + local cleanup [iter4 Q-iter4-Override]**

- [ ] Push the sweep branch.
- [ ] Open PR into `develop`. Tag `pre-reset-2026-05-21` already exists on origin (Stage 0).
- [ ] PR body cites the 19 locked decisions + pre-reset tag + iter2 + iter3 + iter4 remediation deltas.
- [ ] **After PR review + approval, immediately BEFORE `gh pr merge`**: capture `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)`. Echo/log `HEAD_SHA` to executor's session log.
- [ ] **Atomic-guard squash merge**: `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`.
  - Exit 0 ⇒ head-match enforced server-side; squash-merge + remote-branch delete completed.
  - Exit ≠ 0 ⇒ NEEDS_CONTEXT (report `$HEAD_SHA`, current `gh pr view <pr-num> --json headRefOid -q .headRefOid`, and gh stderr; do NOT retry, do NOT rationalize).
- [ ] **(iter2 M-2)** Post-merge local cleanup: `git checkout develop && git pull && git branch -d <sweep-branch>`.
- [ ] Verify Success Criteria 1-14.

**Critical ordering invariants (iter4 final):**

1. Stage 0 (tag) → before any deletion.
2. Stage D (gitignore edits) committed → before Stage E.1 (`git add` of session dir).
3. Stage F (worktree remove) → before Stage F (branch delete).
4. Stage E.2 bare-UUID delete is TERMINAL POST-COMMIT, gated by `git log` + `git ls-tree` (NOT SHA-in-session.json).
5. `git rm` for tracked deletes vs `rm -rf` for untracked — explicitly distinguished in each stage above.
6. **(iter2 M-2)** Post-merge `git branch -d <sweep-branch>` to honor Success Criterion #5.
7. **(iter4 Q-iter4-Override)** Capture `HEAD_SHA` BEFORE `gh pr merge`, then pass `--match-head-commit "$HEAD_SHA"` to the merge command. Non-zero exit ⇒ NEEDS_CONTEXT, no retry, no rationalization.
