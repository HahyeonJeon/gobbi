---
loop: ideation
iter: 4
artifact_type: scope-contract
created_at: 2026-05-21
status: final
feature: repo-reset
related:
  - ideation/artifacts/idea.md
  - ideation/rawdata/draft-iter4.md
---

# Scope Contract — Repo Reset (iter4 PASS)

Verbatim from draft-iter4.md § Scope Contract.

```yaml
artifact_type: scope-contract
feature: repo-reset
goal: Reset gobbi to a clean baseline before bottom-up rebuild — wipe runtime code, replace most project memory with placeholders, retain only authoritative `skills/`/`agents/`/`rules/` content and root LICENSE/CHANGELOG/README; surgically excise the two soon-to-be-broken design links from `.claude/CLAUDE.md`; tag the pre-reset state for archival cheapness.
created-by: ideation-loop / session 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
created-at: 2026-05-21T05:34Z (iter1) — 2026-05-21 iter2 revision — 2026-05-21 iter3 revision — 2026-05-21 iter4 revision
final-iter: iter4 (post iter3 dual-EVAL convergence — Claude REVISE empirically refuted body-grep + Codex Medium/75 prescribed `--match-head-commit` atomic guard; user-authorized iter4 override per Q-iter4-Override)
```

## In-Scope

- **Q1** — Delete `packages/` entirely.
- **Q5** — Delete root manifests: `package.json`, `bun.lock`, `package-lock.json`, `node_modules/`.
- **Q7** — Delete `MIGRATION.md`, `AGENTS.md` from repo root.
- **Q6** — Delete `plugins/gobbi/` and `test/gitignore.test.sh`.
- **Item 5** — Delete `.codex/` (tracked) and `.agents/` (untracked).
- **`.claude-plugin/marketplace.json`** — already shown as `D` in git status; finalize the delete; `rmdir .claude-plugin/` if empty.
- **Q-D** — Delete `.claude/project/gobbi/` (`git rm -r`); v0.4-era tracked tree, not symlinked, confirmed nothing under it is referenced by any survivor file.
- **iter2 H-1** — Edit `.claude/CLAUDE.md` to remove lines 61-62 (the two `[v050-overview.md]` and `[v050-cli.md]` table rows pointing into `.gobbi/projects/gobbi/design/`). This is a surgical narrow edit, not a broad CLAUDE.md touch.
- **Q2 + Q-A** — Under `.gobbi/projects/gobbi/`:
  - **KEEP CONTENT** (NO placeholdering): `agents/`, `skills/`, `rules/`, `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/`, `worktrees/` (which becomes empty after worktree removal), `settings.json`.
  - **PLACEHOLDER-IZE** (empty dir + 1-line stub README each): `archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/` — exactly 13 subdirs.
  - **DELETE ENTIRELY** (Item 3): `adversarial-review/`.
  - **`README.md` → 1-line stub** (Q-C) describing the dir's purpose and pointing at the `pre-reset-2026-05-21` tag.
- **Q8 + Q-B** — Delete all 53 sibling session dirs under `.gobbi/projects/gobbi/sessions/`, including the CLI-bootstrapped bare-UUID dir `6637e759-...`. The bare-UUID delete is split out as terminal step E.2; the other 52 dirs (including the prior date-prefixed session `2026-05-21-c676684d-...`) are deleted in E.1.
- **Q8 + Q-G** — Branch cleanup: `git branch -d fix/257-complete-mirror-sync` (safe-delete); `git branch -d refactor/257-skills-agents-rules` (safe-delete); `git branch -D pr-fin-2-decisions-hold` (force-delete; user pre-authorized); `git branch -D redesign/v050-ideation` (force-delete; user pre-authorized); **iter2 M-2**: `git branch -d <sweep-branch>` post-merge.
- **Worktree removal** — `git worktree remove` both registered worktrees BEFORE branch deletion.
- **Q4** — Transform root `.gitignore`: drop the line `.gobbi/projects/*/sessions/` so `sessions/` becomes tracked. Keep `worktrees/`, `tmp/`, `settings.json` ignored.
- **Q-E** — Edit `.gobbi/.gitignore` (workspace-level, CLI-auto-generated) to remove the `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines ignored.
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push the tag to origin.
- **Q3** — Single worktree, single atomic-sweep PR off `develop` (via session's `git.workflow=worktree-pr` setting). Multiple bisect-safe commits on the sweep branch are permitted; the PR squash-merges to a single commit on develop.
- **iter3 capture + iter4 atomic-guard merge (F-CX-OV-02 resolution)**: capture the PR head SHA via `gh pr view --json headRefOid` immediately before `gh pr merge`, then invoke `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. The `--match-head-commit` flag (gh 2.45.0+) makes the merge fail atomically if the PR head has moved between capture and merge.

## Out-of-Scope

- The rebuild itself — explicitly deferred to a follow-on session.
- Touching `.claude/README.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/.env`, `.claude/worktrees/` — neither asked for nor locked. (Note: `.claude/CLAUDE.md` is now in scope under H-1 for the surgical lines-61-62 excision only; no other CLAUDE.md edits.)
- Touching `.gobbi/settings.json` — runtime CLI state.
- Re-architecting `.claude/` content; only `.claude/project/gobbi/` is removed (Q-D) and the H-1 CLAUDE.md table-row excision lands.
- Remote-branch deletion (only local branches; remote sweep-branch is handled by `gh pr merge --delete-branch`).
- Touching `main` or `develop` branches.
- Rewriting git history.
- **Writing the sweep commit SHA into any tracked file** — removed in iter3 per Q-Gate-Redesign.
- **Post-merge body-grep verification of `$HEAD_SHA`** — removed in iter4 per Q-iter4-Override.

## Decisions Locked (19 total)

**Original 8 (rounds 1–2 — unchanged from iter1):**
- **Q1** — Wipe `packages/` entirely. No partial retention.
- **Q2** — Project-memory subdirs become empty dirs each with one-line stub README (subject to Q-A's survivor revision).
- **Q3** — Single worktree, single atomic-sweep PR off `develop`.
- **Q4** — `sessions/` becomes tracked. `worktrees/`, `tmp/`, `settings.json` remain ignored at root.
- **Q5** — Delete all four root manifests + `node_modules/`.
- **Q6** — Delete `plugins/gobbi/` and `test/gitignore.test.sh`.
- **Q7** — Keep `LICENSE`, `CHANGELOG.md`, `README.md`. Delete `MIGRATION.md`, `AGENTS.md`.
- **Q8** — Delete 4 specific local branches; keep `main`+`develop`. Delete all 53 sibling session dirs; keep only this session's date-prefixed dir.

**Gap-fill 7 (round 3, post-NEEDS_CONTEXT — unchanged from iter1):**
- **Q-A** — Survivor set inside `.gobbi/projects/gobbi/` is `agents/`+`skills/`+`rules/`+`sessions/<current>`+`worktrees/`+`settings.json`. The other 13 subdirs get placeholdered. `adversarial-review/` is deleted entirely. `README.md` becomes a one-line stub.
- **Q-B** — The CLI bare-UUID sibling session dir `6637e759-...` is deleted with the other 52. Sequenced as terminal step E.2.
- **Q-C** — `.gobbi/projects/gobbi/README.md` becomes a one-line stub citing the `pre-reset-2026-05-21` tag.
- **Q-D** — `.claude/project/gobbi/` is deleted in this sweep (`git rm -r`).
- **Q-E** — Edit `.gobbi/.gitignore`: remove `sessions/` and `project/note/` lines; keep `worktrees/` and `settings.json`.
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push to origin.
- **Q-G** — `git branch -D` pre-authorized for `pr-fin-2-decisions-hold` and `redesign/v050-ideation`. Safe `-d` for `fix/257-complete-mirror-sync` and `refactor/257-skills-agents-rules`.

**iter2-round 2 (post-Claude-REVISE — unchanged from iter2):**
- **Q-Survivor** — Don't expand the survivor set; surgically excise the two CLAUDE.md table-row citations instead.
- **Q-StageE** — Split Stage E into E.1 (in-commit) and E.2 (post-commit terminal).

**iter3-round 5 (post-Codex-iter2-REVISE — unchanged from iter3):**
- **Q-Gate-Redesign** — Drop the SHA-in-session.json requirement. New E.2 gate: `git log --format=%H -1 <sweep-branch>` returns non-empty SHA AND `git ls-tree <sweep-branch> <kept-session-dir>/` lists at least one entry. On failure: NEEDS_CONTEXT.

**iter4-round 6 (NEW iter4 lock):**
- **Q-iter4-Override** — Authorize iter4 with the `--match-head-commit` surgical fix. Replace iter3's post-merge body-grep with `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. Exit ≠ 0 → NEEDS_CONTEXT, no retry, no rationalization.

## Success Criteria

1. `git status` on the post-sweep branch shows only intended deletions/modifications, no stray files.
2. Post-merge: `git log --oneline -2 develop` shows exactly one new commit (the squashed PR) plus `487fc35`.
3. Working tree under `.gobbi/projects/gobbi/` contains only: `agents/`, `skills/`, `rules/`, `README.md`, `settings.json`, `sessions/2026-05-21-6637e759-.../`, `worktrees/` (empty), plus the 13 placeholder dirs each holding a single `README.md`.
4. `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d` yields exactly 1 entry.
5. `git branch | grep -vE '^[* ] (main|develop)$'` returns no rows post-merge.
6. `git worktree list | wc -l` returns 1.
7. `find .claude/{skills,agents} -xtype l` returns empty.
8. Root contains only: `.git`, `.gitignore`, `.claude/`, `.gobbi/`, `LICENSE`, `CHANGELOG.md`, `README.md`.
9. `git tag --list pre-reset-2026-05-21` returns the tag at `487fc35`; pushed to origin.
10. `.gobbi/.gitignore` contains neither `sessions/` nor `project/note/`; still contains `worktrees/` and `settings.json`.
11. `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json` returns exit 1.
12. `grep -nE '^\| \[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty.
13. Pre-E.2 gate: both `git log` and `git ls-tree` pre-conditions pass; on failure: NEEDS_CONTEXT.
14. Stage G: `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` returned exit code 0 (atomic head-match enforced server-side).

## Deferred

- The rebuild itself — next session.
- CLI regenerator fix for `.gobbi/.gitignore` — backlog entry at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`. Per iter2 H-4: this backlog has no project-level promotion target post-sweep; stays session-scoped under the preserved session dir.
