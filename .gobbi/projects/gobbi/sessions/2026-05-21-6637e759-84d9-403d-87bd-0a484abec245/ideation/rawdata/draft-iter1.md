# Ideation rawdata — iter 1 (FINAL — 15 locks)

Bottom-up repo reset before rebuilding gobbi. Single-PR destructive sweep, project memory reduced to placeholders (except authoritative skill/agent/rules content), sessions promoted from gitignored to tracked, pre-reset state archived via a lightweight git tag.

This draft applies all 15 locked decisions: the original 8 (Q1–Q8) from the manager's first two AskUserQuestion rounds, plus the 7 gap-fill answers (Q-A through Q-G) the manager returned after the leader's `NEEDS_CONTEXT`.

---

## Scope Contract

```yaml
artifact_type: scope-contract
feature: repo-reset
goal: Reset gobbi to a clean baseline before bottom-up rebuild — wipe runtime code, replace most project memory with placeholders, retain only authoritative `skills/`/`agents/`/`rules/` content and root LICENSE/CHANGELOG/README; tag the pre-reset state for archival cheapness.
created-by: ideation-loop / session 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
created-at: 2026-05-21T05:34Z
final-iter: iter1-rev2 (post Q-A–Q-G resolution)
```

### In-Scope

- **Q1** — Delete `packages/` entirely.
- **Q5** — Delete root manifests: `package.json`, `bun.lock`, `package-lock.json`, `node_modules/`.
- **Q7** — Delete `MIGRATION.md`, `AGENTS.md` from repo root.
- **Q6** — Delete `plugins/gobbi/` and `test/gitignore.test.sh`.
- **Item 5** — Delete `.codex/` (tracked) and `.agents/` (untracked).
- **`.claude-plugin/marketplace.json`** — already shown as `D` in git status; finalize the delete; `rmdir .claude-plugin/` if empty.
- **Q-D** — Delete `.claude/project/gobbi/` (`git rm -r`); v0.4-era tracked tree, not symlinked, confirmed nothing under it is referenced by any survivor file.
- **Q2 + Q-A** — Under `.gobbi/projects/gobbi/`:
  - **KEEP CONTENT** (NO placeholdering): `agents/`, `skills/`, `rules/`, `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/`, `worktrees/` (which becomes empty after worktree removal), `settings.json`.
  - **PLACEHOLDER-IZE** (empty dir + 1-line stub README each): `archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/` — exactly 13 subdirs.
  - **DELETE ENTIRELY** (Item 3): `adversarial-review/`.
  - **`README.md` → 1-line stub** (Q-C) describing the dir's purpose and pointing at the `pre-reset-2026-05-21` tag.
- **Q8 + Q-B** — Delete all 53 sibling session dirs under `.gobbi/projects/gobbi/sessions/`, including the CLI-bootstrapped bare-UUID dir `6637e759-84d9-403d-87bd-0a484abec245/`. Sequenced AFTER all this-workflow session-memory writes are committed.
- **Q8 + Q-G** — Branch cleanup:
  - `git branch -d fix/257-complete-mirror-sync` (safe-delete; ancestor of develop).
  - `git branch -d refactor/257-skills-agents-rules` (safe-delete; ancestor of develop).
  - `git branch -D pr-fin-2-decisions-hold` (force-delete; user pre-authorized).
  - `git branch -D redesign/v050-ideation` (force-delete; user pre-authorized).
- **Worktree removal** — `git worktree remove` both registered worktrees BEFORE branch deletion.
- **Q4** — Transform root `.gitignore`: drop the line `.gobbi/projects/*/sessions/` so `sessions/` becomes tracked. Keep `worktrees/`, `tmp/`, `settings.json` ignored.
- **Q-E** — Edit `.gobbi/.gitignore` (workspace-level, CLI-auto-generated) to remove the `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines ignored.
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push the tag to origin.
- **Q3** — Single worktree, single atomic-sweep PR off `develop` (via session's `git.workflow=worktree-pr` setting).

### Out-of-Scope

- The rebuild itself — explicitly deferred to a follow-on session.
- Touching `.claude/CLAUDE.md`, `.claude/README.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/.env`, `.claude/worktrees/` — neither asked for nor locked.
- Touching `.gobbi/settings.json` — runtime CLI state.
- Re-architecting `.claude/` content; only `.claude/project/gobbi/` is removed (Q-D).
- Remote-branch deletion (only local branches).
- Touching `main` or `develop` branches.
- Rewriting git history. The sweep is a single new commit on a new branch, PR'd into `develop`.

### Decisions Locked (15 total)

**Original 8 (manager rounds 1–2):**

- **Q1** — Wipe `packages/` entirely. No partial retention.
- **Q2** — Project-memory subdirs become empty dirs each with one-line stub README (subject to Q-A's survivor revision).
- **Q3** — Single worktree, single atomic-sweep PR off `develop` (via `git.workflow=worktree-pr`).
- **Q4** — `sessions/` becomes tracked. `worktrees/`, `tmp/`, `settings.json` remain ignored at root.
- **Q5** — Delete all four root manifests + `node_modules/`.
- **Q6** — Delete `plugins/gobbi/` and `test/gitignore.test.sh`.
- **Q7** — Keep `LICENSE`, `CHANGELOG.md`, `README.md`. Delete `MIGRATION.md`, `AGENTS.md`.
- **Q8** — Delete 4 specific local branches (with the `-d`/`-D` split below); keep `main`+`develop`. Delete all 53 sibling session dirs; keep only this session's date-prefixed dir.

**Gap-fill 7 (manager round 3, post-NEEDS_CONTEXT):**

- **Q-A** — Survivor set inside `.gobbi/projects/gobbi/` is `agents/`+`skills/`+`rules/`+`sessions/<current>`+`worktrees/`+`settings.json`. The other 13 subdirs get placeholdered. `adversarial-review/` is deleted entirely. `README.md` becomes a one-line stub.
- **Q-B** — The CLI bare-UUID sibling session dir `6637e759-...` is deleted with the other 52. The Implementation Checklist sequences this delete AFTER all session-memory writes for THIS workflow are committed (mitigation in I4 + S6 below).
- **Q-C** — `.gobbi/projects/gobbi/README.md` becomes a one-line stub citing the `pre-reset-2026-05-21` tag.
- **Q-D** — `.claude/project/gobbi/` is deleted in this sweep (`git rm -r`).
- **Q-E** — Edit `.gobbi/.gitignore`: remove `sessions/` and `project/note/` lines; keep `worktrees/` and `settings.json`. Stage one backlog entry capturing the CLI-regeneration risk (the regen source is being deleted with `packages/`).
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push to origin.
- **Q-G** — `git branch -D` pre-authorized for `pr-fin-2-decisions-hold` and `redesign/v050-ideation`. Safe `-d` for `fix/257-complete-mirror-sync` and `refactor/257-skills-agents-rules`.

### Success Criteria

1. `git status` on the post-sweep branch shows only the intended deletions / modifications, no stray files.
2. `git log --oneline -2` shows exactly one new sweep commit (squashed PR) plus the prior `487fc35` SOP commit on `develop`.
3. Working tree under `.gobbi/projects/gobbi/` contains only: `agents/`, `skills/`, `rules/`, `README.md`, `settings.json`, `sessions/2026-05-21-6637e759-.../`, `worktrees/` (empty), plus the 13 placeholder dirs each holding a single `README.md`.
4. `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d` yields exactly 1 entry: `2026-05-21-6637e759-...`.
5. `git branch | grep -vE '^[* ] (main|develop)$'` returns no rows post-merge.
6. `git worktree list | wc -l` returns 1 (only the main tree).
7. `find .claude/{skills,agents} -xtype l` returns empty (no broken symlinks).
8. Root contains only: `.git`, `.gitignore`, `.claude/`, `.gobbi/`, `LICENSE`, `CHANGELOG.md`, `README.md`.
9. `git tag --list pre-reset-2026-05-21` returns the tag at `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` returns a match.
10. `.gobbi/.gitignore` contains neither `sessions/` nor `project/note/`; still contains `worktrees/` and `settings.json`.
11. `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1 (no ignore match).

### Deferred

- The rebuild itself — next session.
- CLI regenerator fix for `.gobbi/.gitignore` — backlog entry at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`.

---

## Framed Problem

**Root cause**

Cumulative drift across ~26 v0.5.0 development sessions left the repo with overlapping competing surfaces: tracked `packages/` runtime alongside channel-managed `gobbi-dev`, dual `.claude/`-vs-`.gobbi/projects/gobbi/` mirrors (where `.claude/skills/+agents/` are SYMLINKS into `.gobbi/projects/gobbi/{skills,agents}/`), an `adversarial-review/` artifact tree the rules do not sanction, 54 session dirs (53 historical + 1 current), `.claude-plugin/marketplace.json` already mid-delete, a v0.4-era `.claude/project/gobbi/` tree, and root manifests that no longer match the channel-split distribution model. Evidence: `git status` snapshot at session bootstrap (5 modified + 2 deleted + many untracked); `git ls-files | grep .gobbi/projects/gobbi/` showing tracked content collocated with newly untracked promotion artifacts; `.gobbi/projects/gobbi/sessions/` containing 54 dirs of which 3 are non-UUID test/CLI artifacts. Per project memory entry `project_v050_redesign_env_prep.md` (PR #250 / `7aad94a`), the channel-split moved gobbi-stable to npm-global and gobbi-dev to a manual symlink; root `package.json`+`bun.lock` retain no operational role and are residue.

**Impact**

- **Who is affected**: only the solo user (`feedback_solo_user_context`). Affected agent surfaces: any future Claude/Codex session bootstrapping from the repo, the `gobbi` CLI's session resolution (driven by `.gobbi/projects/gobbi/sessions/`), and Plan/Execute loops that read project memory.
- **Severity**: blocker for the rebuild — a bottom-up redesign can't anchor on incoherent prior state. Not a runtime regression (`.claude/skills/+agents/` survive intact because their symlink targets `.gobbi/projects/gobbi/{skills,agents}/` are preserved under Q-A).
- **Cost of inaction**: rebuild drags accumulated debt forward; any leader/executor reading project memory loads 80+ files of half-superseded v0.5.0 history that no longer reflects the redesign target.

**Success criteria**

See Scope Contract → Success Criteria.

**Prior attempts**

- `feedback_redesign_version_naming` locks the redesign as v0.5.0 (no v0.6.0 framing).
- `project_v050_redesign_env_prep` (2026-05-02 PR #250) executed env prep but did NOT touch project memory or `packages/` — explicitly out of scope at the time.
- The recent 9-commit `refactor/257-skills-agents-rules` branch (now squash-merged via PRs #260/#261/#262) consolidated the 5-role agent taxonomy and 16-skill v0.5 surface, locking the survivor content at `.gobbi/projects/gobbi/{skills,agents}/`.

**Counterfactual / steel-man**

Strongest argument against destructive single-PR reset: **"Archive the prior state via a `v0.5-archive` tag (or branch) before deletion, so future investigation can recover the lived design history."** This steel-man IS satisfied under Q-F: lightweight tag `pre-reset-2026-05-21` at `487fc35`, pushed to origin BEFORE the PR opens. Zero cost; surfaces the "reset point" for future readers; recovery is a one-command `git checkout pre-reset-2026-05-21` away.

**Re-framing conclusion**

The literal ask — destructive cleanup followed by rebuild — is the right framing. The leader checked two adjacent framings:
- "Maybe the cleanup should also re-design the placeholder structure to match the rebuild's bottom-up shape, not just preserve subdir names." — Rejected: this couples cleanup to rebuild design, defeating bottom-up. The placeholder shape is "what currently exists, with content removed."
- "Maybe the cleanup should consolidate `.claude/` and `.gobbi/projects/gobbi/` into a single tree to remove the mirror complexity." — Rejected: out of scope. The user redesigned `.claude/skills/+agents/` recently and wants it preserved; the mirror is a deliberate distribution mechanism, not an accident.

---

## Research Insights

### Internal

External research is skipped for this loop — see Decisions Log → "External research skip reason." The investigation is entirely internal-codebase + project-memory + git-state.

**I1 — `.claude/skills/` and `.claude/agents/` are SYMLINK trees, not authoritative content.**
- Source: `find .claude/{skills,agents} -maxdepth 4 -type l` shows every leaf is a symlink into `.gobbi/projects/gobbi/{skills,agents}/`. The orchestration dir, e.g., is a real directory at `.claude/skills/orchestration/` but `SKILL.md` inside it is `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
- Why-it-applies: under Q2's naïve reading, the placeholder reset would wipe the symlink TARGETS, leaving the survivor `.claude/` shell with broken symlinks. **Q-A resolves this**: `.gobbi/projects/gobbi/{agents,skills,rules}/` content stays intact. The 13 other subdirs become placeholders; symlinks remain whole.

**I2 — Two registered worktrees, both with branches needing different delete modes.**
- Source: `git worktree list` shows `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` ([`redesign/v050-ideation`] @ `0be2f97`) and `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` ([`refactor/257-skills-agents-rules`] @ `f3769cc`). `git merge-base --is-ancestor` against `develop`: `fix/257-complete-mirror-sync` and `refactor/257-skills-agents-rules` ARE ancestors (squash-merge tips happen to be); `pr-fin-2-decisions-hold` and `redesign/v050-ideation` are NOT ancestors.
- Why-it-applies: `git branch -d` (safe-delete) succeeds only for ancestor-merged branches. The 2 non-ancestor branches require `git branch -D` (Forbidden Operations / Always-Ask in `git/SKILL.md`). **Q-G pre-authorizes `-D`** for both — no second AskUserQuestion needed at Execution. The Execution PR must still run `git worktree remove <path>` BEFORE `git branch -d/-D <branch>` (worktree removal first, then branch deletion).

**I3 — `.gobbi/projects/gobbi/adversarial-review/` is git-tracked, not just on-disk.**
- Source: `git ls-files | grep adversarial-review | wc -l` shows the dir is tracked (hundreds of files across iter1..iter19, claude+codex per perspective). Deletion is `git rm -r .gobbi/projects/gobbi/adversarial-review/`, not just `rm -rf`. The same `git rm` semantics apply to other tracked content listed in I1.

**I4 — The current session has BOTH a date-prefixed dir AND a UUID-only dir.**
- Source: `ls .gobbi/projects/gobbi/sessions/ | grep 6637e759` returns both `2026-05-21-6637e759-...` (manager-authored, per mistake `session-dir-naming-convention-uses-date-prefix.md`) and `6637e759-...` (CLI-bootstrapped runtime artifact containing `gobbi.db` + a separate `session.json`). Per that mistake, the UUID-only form is CLI drift; the canonical form is `{date}-{session-id}`.
- **Q-B resolves**: delete the bare-UUID dir with the other 52 in the sweep. **Mitigation (mandatory ordering)**: the Implementation Checklist sequences the bare-UUID delete AFTER all session-memory writes for THIS workflow (Memorization promotion outputs, decisions log, final session.json) are committed. If the CLI re-references the bare-UUID dir mid-sweep, those reads happen post-delete and the CLI will surface a re-bootstrap or "session not found" — acceptable risk since this is the last workflow against this layout.

**I5 — Two non-UUID session dirs exist: `sess-final` and `99999999-aaaa-bbbb-cccc-dddddddddddd`.**
- Source: `ls .gobbi/projects/gobbi/sessions/`. `rg -n "sess-final"` and `rg -n "99999999-aaaa"` against the codebase return no hits (excluding `sessions/` itself). These appear to be local fixture artifacts (not test code references). Q8 covers them in the "53 other dirs" count: 54 total dirs − 1 keeper = 53 to delete.

**I6 — Root `.gitignore` line for sessions is `.gobbi/projects/*/sessions/` inside a whitelist block.**
- Source: `/playinganalytics/git/gobbi/.gitignore` lines 9–18. The whole `.gobbi/*` is ignored, with an explicit unignore for `!.gobbi/projects/`, then re-ignores for `sessions/`, `rawdata/`, `settings.json`, `worktrees/`, `tmp/`. Q4 requires `sessions/` become tracked while `worktrees/`, `tmp/`, `settings.json` remain ignored. **Exact transformation**: delete the line `.gobbi/projects/*/sessions/` from root `.gitignore`.
- Adjacent: `.gobbi/.gitignore` is auto-generated by the CLI. **Q-E resolves**: edit it directly — drop `sessions/` and `project/note/`; keep `worktrees/` and `settings.json`. The CLI regenerator source is in `packages/cli/` which is being deleted this sweep, so the future rebuilt CLI must honor this policy — captured as a backlog entry.

**I7 — Notes content + research subdir under `notes/`.**
- Source: `ls .gobbi/projects/gobbi/notes/` — `2026-05-21-pr-262-entry-point-sop.md`, `handoff-redesign-2026-05-02.md`, and `agent-principles-research/`. All go away under Q2+Q-A's placeholder treatment of `notes/`.

**I8 — Promotion-staged content from prior session (untracked) lives intermixed with tracked content.**
- Source: `git status --short` reveals 3 untracked mistake files (executor-rationalized…, manager-mispec…, session-dir…), 2 untracked feature dirs (`gobbi-install/`, `orchestration-docs/`), `gotchas/`, 1 new note, 1 new backlog. These all evaporate under the reset (none survive to placeholder land, since their PARENT subdirs become placeholders).

**I9 — `.claude-plugin/marketplace.json` is already `D` in git status.**
- Source: `git status --short` line 1. Including it in the sweep commit finalizes the delete. Verify and `rmdir .claude-plugin/` if empty.

**I10 — `.claude/project/gobbi/` exists, v0.4-era, untouched by the original Q1–Q8.**
- Source: `ls -la .claude/project/gobbi/` shows `mistakes/`, `note/`, `design/`. Tracked in git, not symlinked. **Q-D resolves**: delete in this sweep (`git rm -r`). Confirmed by inventory: nothing under it is referenced by any survivor file (no symlink targets, no rule cites).

### External

None. External research is skipped — see Decisions Log "External research skip reason."

---

## Scenarios

| Scenario | Type | Description | Verification |
|---|---|---|---|
| S1 | Golden | Single sweep commit lands on `develop` via PR; post-merge `git status` clean; `.claude/skills/+agents/` symlinks all resolve. | `find .claude/{skills,agents} -xtype l` returns empty; `git status` clean. |
| S2 | Golden | Current session dir `2026-05-21-6637e759-...` retained; no other session dirs remain (including the bare-UUID sibling). | `ls .gobbi/projects/gobbi/sessions/` shows exactly one entry. |
| S3 | Golden | `pre-reset-2026-05-21` tag exists at `487fc35` locally and on origin BEFORE the PR opens. | `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin` includes the tag. |
| S4 | Edge | Worktree at `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` has an uncommitted dirty tree. | Executor runs `git -C <wt> status` first; if dirty, NEEDS_CONTEXT to user; else `git worktree remove`. |
| S5 | Edge | `.gitignore` line removal precedes the new `sessions/` content being staged. If sequence inverted, `git add .gobbi/projects/gobbi/sessions/` is a no-op (still ignored), and the kept session dir doesn't enter the commit. | Plan orders: (a) edit root `.gitignore`, (b) verify with `git check-ignore`, (c) `git add` session dir. |
| S6 | Edge | CLI's live bare-UUID session dir `6637e759-...` deletion mid-workflow could cause the CLI to lose track of the session. | Executor sequences bare-UUID delete AFTER all THIS-workflow session-memory writes are committed (last operation in the session-sweep stage). |
| S7 | Failure | `git rm -r .gobbi/projects/gobbi/adversarial-review/` fails because of a working-tree change. | Executor `git status` first; resolve before retry. |
| S8 | Failure | Single atomic PR exceeds GitHub's diff/file limit when squashed. | Split into staged commits within one PR: (1) tag; (2) code/plugin/root delete + `.claude/project/gobbi/`; (3) adversarial-review + project-memory placeholder reset; (4) session-dir sweep + gitignore transforms + branch/worktree cleanup. Single squash-merge. |
| S9 | Failure | Stub READMEs collide with names of existing files in the destination dir. | Executor verifies each subdir is empty (after the wipe) before writing stub README. |
| S10 | Adversarial | After deletion, future agent reads `.claude/skills/orchestration/SKILL.md` (symlink → `.gobbi/.../skills/orchestration/SKILL.md`). | Q-A keeps the symlink target; agent loads succeed. |
| S11 | Adversarial | User changes mind mid-execution; needs to recover. | Pre-reset tag `pre-reset-2026-05-21` makes recovery a one-command checkout. Pre-merge revert: `git checkout develop`. Post-merge revert: `git revert <merge-sha>`. |
| S12 | Adversarial | Future rebuilt CLI regenerates `.gobbi/.gitignore` with the OLD policy, silently re-ignoring `sessions/` and `project/note/`. | Backlog entry `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` flags this; rebuild session must update the regen template before shipping. |

---

## Implementation Checklist

Anchored items per scenario. Execution may further decompose; the order below is the dependency-correct order the Planning loop will inherit.

**Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens**

- [ ] `git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required).
- [ ] `git push origin pre-reset-2026-05-21`.
- [ ] Verify: `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches.

**Stage A — Discovery + pre-flight (S1, S4, S7)**

- [ ] Pre-flight: confirm both worktree paths are clean (`git -C <wt> status` → empty), branch state matches expectations (`git log -1`).
- [ ] Pre-flight: re-check `git status` against the inventory; no new untracked files appearing between session bootstrap and Execution.
- [ ] Pre-flight: open the sweep branch off `develop` (per `git.workflow=worktree-pr`).

**Stage B — Code + plugin + root file deletion (Q1, Q5, Q6, Q7, Q-D, Item 5) → sweep commit 1**

- [ ] `git rm -r packages/` (Q1).
- [ ] `git rm package.json bun.lock package-lock.json` (Q5).
- [ ] `rm -rf node_modules/` (Q5; untracked).
- [ ] `git rm -r plugins/gobbi/` (Q6).
- [ ] Handle `test/gitignore.test.sh` (Q6) — `git rm test/gitignore.test.sh` if tracked, `rm` if not; then `rmdir test/` if empty.
- [ ] `git rm MIGRATION.md AGENTS.md` (Q7).
- [ ] `git rm .claude-plugin/marketplace.json` (already `D`); `rmdir .claude-plugin/` if empty.
- [ ] `git rm -r .codex/` (Item 5, tracked).
- [ ] `rm -rf .agents/` (Item 5, untracked).
- [ ] `git rm -r .claude/project/gobbi/` (Q-D).

**Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep commit 2**

- [ ] `git rm -r .gobbi/projects/gobbi/adversarial-review/` (Item 3).
- [ ] For each of the 13 placeholder subdirs under `.gobbi/projects/gobbi/` (`archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`):
  - `git rm -r <subdir>/*` if any tracked content present (preserve the dir); plus `rm -rf <subdir>/*` to catch untracked stragglers.
  - Verify the dir is empty.
  - Write a one-line stub `<subdir>/README.md` describing the subdir's purpose (per `rules/stub-redirect-format.md`, but without the supersession banner — these are placeholders, not stubs for moved content).
  - `git add <subdir>/README.md`.
- [ ] **Do NOT touch** `agents/`, `skills/`, `rules/` content (Q-A survivor set).
- [ ] Replace `.gobbi/projects/gobbi/README.md` with a one-line stub (Q-C). Suggested wording: `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

**Stage D — Gitignore transformations (Q4, Q-E) → sweep commit 3 [ORDER CRITICAL]**

- [ ] Edit root `/playinganalytics/git/gobbi/.gitignore`: remove the line `.gobbi/projects/*/sessions/`. Keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines.
- [ ] Edit `.gobbi/.gitignore` (workspace-level): remove `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines.
- [ ] Verify: `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1.
- [ ] `git add .gitignore .gobbi/.gitignore`.

**Stage E — Session-dir sweep (Q8, Q-B) → sweep commit 3 (continuation; same commit as Stage D) [ORDER CRITICAL]**

- [ ] `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (NOW possible because Stage D edits are staged).
- [ ] Confirm THIS-workflow session-memory writes (Memorization promotion outputs, decisions log, final session.json) are present in the staged contents.
- [ ] Delete all 52 sibling DIR-FORM session dirs (untracked under prior `.gitignore`): `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d ! -name '2026-05-21-6637e759-84d9-403d-87bd-0a484abec245' ! -name '6637e759-84d9-403d-87bd-0a484abec245' -print0 | xargs -0 rm -rf`.
- [ ] **LAST** (per Q-B mitigation, S6): delete the CLI bare-UUID sibling `rm -rf .gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/`. This step runs AFTER the workflow's writes are committed so the CLI's `gobbi.db` and runtime session.json removal does not interfere with mid-workflow state.

**Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep commit 4 (or post-merge ops)**

- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation`.
- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules`.
- [ ] `find .gobbi/projects/gobbi/worktrees/ -type d -empty -delete` to clean up empty parent dirs (preserve `worktrees/` itself).
- [ ] `git branch -d fix/257-complete-mirror-sync` (safe-delete; pre-authorized by Q-G as `-d`).
- [ ] `git branch -d refactor/257-skills-agents-rules` (safe-delete; pre-authorized by Q-G as `-d`).
- [ ] `git branch -D pr-fin-2-decisions-hold` (force-delete; pre-authorized by Q-G as `-D`).
- [ ] `git branch -D redesign/v050-ideation` (force-delete; pre-authorized by Q-G as `-D`).

**Stage G — PR open**

- [ ] Push the sweep branch.
- [ ] Open PR into `develop`. The tag `pre-reset-2026-05-21` already exists on origin (Stage 0).
- [ ] PR body cites the 15 locked decisions + the pre-reset tag.

**Critical ordering invariants (summary):**

1. **Stage 0 (tag) → before any deletion** so the tag points at `487fc35`, not at HEAD-after-sweep.
2. **Stage D (gitignore edits) → before Stage E (`git add` of session dir)** so the kept session dir actually enters the index (S5).
3. **Stage F (worktree remove) → before Stage F (branch delete)** because git refuses to delete a branch that has a registered worktree.
4. **Q-B bare-UUID delete → LAST in Stage E** so this-workflow's session writes are committed before the CLI's live state dir disappears.
5. **`git rm` for tracked deletes vs `rm -rf` for untracked** — explicitly distinguished in each stage above.

---

## Design

The design surface for a destructive cleanup is small but the **ordering** and **verification** are the load-bearing decisions.

### D1 — Deletion order across the 7 items

Order: (0) tag → (A) pre-flight + branch open → (B) code/plugin/root + `.claude/project/gobbi/` → (C) adversarial-review + placeholder reset → (D) gitignore edits → (E) sessions sweep with bare-UUID LAST → (F) worktree removal + branch deletion → (G) PR open.

Rationale anchored to I6 + I2 + Q-B + Q-F: the tag must point at the PRE-reset commit; `.gitignore` edits must precede `git add` on the kept session dir; bare-UUID delete must be LAST in the session sweep; worktree removal must precede branch deletion.

### D2 — Verification at the end (S1, S2, S3, S10)

The Plan's verification gate enumerates:

1. `find .claude/{skills,agents} -xtype l | wc -l` → 0 (no broken symlinks).
2. `ls .gobbi/projects/gobbi/sessions/ | wc -l` → 1.
3. `ls .gobbi/projects/gobbi/sessions/` → `2026-05-21-6637e759-84d9-403d-87bd-0a484abec245`.
4. `git worktree list | wc -l` → 1.
5. `git branch | sed 's/^..//' | sort` → `develop\nmain\n<sweep-branch>` (or just `develop\nmain` post-merge).
6. `ls /playinganalytics/git/gobbi/` → exactly `.git .gitignore .claude .gobbi LICENSE CHANGELOG.md README.md`.
7. `git ls-files | grep -E "^\.gobbi/projects/gobbi/(skills|agents|rules)/" | wc -l` matches pre-sweep count (skills/agents/rules content preserved per Q-A).
8. `git ls-files | grep -E "^\.gobbi/projects/gobbi/adversarial-review/"` → empty.
9. `git ls-files | grep -E "^\.claude/project/gobbi/"` → empty (Q-D).
10. `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` → exit 1.
11. `grep -E '^sessions/$|^project/note/$' .gobbi/.gitignore` → empty (Q-E).
12. `grep -E '^worktrees/$|^settings\.json$' .gobbi/.gitignore` → 2 matches (Q-E preserved).
13. Stub README count: `find .gobbi/projects/gobbi/ -maxdepth 2 -name README.md | wc -l` → 14 (13 placeholder subdirs + the root README).
14. `git rev-parse pre-reset-2026-05-21` → `487fc35`.
15. `git ls-remote --tags origin | grep -c 'refs/tags/pre-reset-2026-05-21$'` → 1.

Use `grep -o … | wc -l` for occurrence counts where lines might collide (per `manager-mispec-grep-c-for-occurrence-count.md`).

### D3 — Where session-memory tracking is enforced

Two files coordinate: root `/playinganalytics/git/gobbi/.gitignore` (drop `.gobbi/projects/*/sessions/`) AND `.gobbi/.gitignore` (drop `sessions/` and `project/note/`). Both must be edited because the latter is workspace-scoped and could shadow if it included `sessions/`. Q-E makes the change explicit in both files.

### D4 — Stub README format (Q2, Q-C)

User locked "empty dirs with one-line stub README per dir." Format: `# <subdir-name>\n\n<one-line description of the dir's pre-reset role>.` For the root `.gobbi/projects/gobbi/README.md` (Q-C): a one-line stub like `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.` Final wording is at the executor's discretion; the contract is "one short line per file." Validation: `find .gobbi/projects/gobbi/ -maxdepth 2 -name README.md -exec wc -l {} \;` → each result ≤ 4 lines.

### D5 — `git branch -D` handling

Q-G pre-authorizes `-D` for the 2 non-ancestor branches. The Plan encodes them as explicit `-D` tasks; no AskUserQuestion gate at Execution. Alternative considered (pre-merge them into `develop` via no-op fast-forward) is rejected because they're not actually merge-targets, only history-ancestors of squash-merged tips — git would refuse to fast-forward to an unrelated branch tip.

### D6 — Validation strategy summary

| Decision | Validation method |
|---|---|
| D1 ordering | Plan-encoded gate checks at each stage's exit |
| D2 verification | 15 verification commands at PR ready-for-merge |
| D3 gitignore policy | `git check-ignore` regression test post-edit (both files) |
| D4 stub format | `wc -l` line-count gate + spot-check by manager |
| D5 force-delete | Pre-authorized by Q-G; no runtime gate |
| D7 tag archival | `git rev-parse` + `git ls-remote` checks |

### D7 — Pre-sweep tag (Q-F)

Lightweight tag `pre-reset-2026-05-21` at `487fc35`. Created BEFORE the sweep branch opens so the tag references the pre-reset commit. Pushed to origin so it survives any local clone churn. Recovery via `git checkout pre-reset-2026-05-21` is a one-command operation.

### D8 — CLI-regenerator follow-up risk (Q-E)

Editing `.gobbi/.gitignore` is a point-in-time fix; the regenerator that produces this file lives in `packages/cli/` which is being deleted this session. A future rebuilt CLI may regenerate the file with the OLD policy. **Mitigation**: backlog entry staged at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` flags the risk and cites the originating session. The rebuild session must update the regen template before shipping the new CLI.

### D9 — Bare-UUID session-dir delete sequencing (Q-B)

The CLI bare-UUID dir `6637e759-...` contains the CLI's live `gobbi.db` + runtime `session.json`. Deleting it mid-workflow could break the CLI's view of state. **Mitigation**: the Implementation Checklist places this delete as the LAST step in Stage E, after all THIS-workflow session-memory writes are committed. The CLI surfacing a "session not found" after that point is acceptable — this is the last workflow against this layout, and any subsequent gobbi command can re-bootstrap.

---

## Decisions Log

### Memory reads register (Ideation Sub-step A read paths)

| Path | Purpose | Status |
|---|---|---|
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Stub-redirect format reference for D4 | Read |
| `.gobbi/projects/gobbi/mistakes/session-dir-naming-convention-uses-date-prefix.md` | Confirms date-prefix convention for the surviving session dir (I4) | Read |
| `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md` | Forces DONE_WITH_CONCERNS on divergent gates (S3-style honesty) | Read |
| `.gobbi/projects/gobbi/mistakes/manager-mispec-grep-c-for-occurrence-count.md` | `grep -o | wc -l` preferred over `grep -c` (D2) | Read |
| `.gobbi/projects/gobbi/mistakes/git-workflow.md` | Worktree-PR mode forbids direct develop push | Read |
| `.gobbi/projects/gobbi/mistakes/worktree-vs-main-path-confusion.md` | Worktree path discipline | Read |
| `.gobbi/projects/gobbi/mistakes/cross-session-mistake-bundle.md` | Bundle untracked mistakes into next PR | Read |
| `.gobbi/projects/gobbi/mistakes/session-id-discovery.md` | `$CLAUDE_SESSION_ID` not in Bash env | Read |
| `.gobbi/projects/gobbi/mistakes/gobbi-workflow-cli-from-main-tree.md` | CLI must run from main tree | Read |
| `.gobbi/projects/gobbi/notes/2026-05-21-pr-262-entry-point-sop.md` | Prior session journal | Read |
| `.gitignore` (root), `.gobbi/.gitignore` | Gitignore mechanics (I6) | Read |
| `git worktree list`, `git branch -a`, `git log --oneline -5`, `git status --short` | Git state inventory | Read |
| `ls .gobbi/projects/gobbi/{sessions,*}` walkthrough | Full project-memory directory inventory | Read |
| `find .claude/{skills,agents} -type l` | Confirmed I1 (symlink-tree reality) | Read |
| `git ls-files \| grep .gobbi/projects/gobbi` | Tracked vs untracked content | Read |
| `ls -la .claude/project/gobbi/` | Confirmed I10 (Q-D target) | Read |

### AskUserQuestion outcomes (15 locked decisions across 3 manager rounds)

Rounds 1+2 (pre-leader): Q1–Q8 resolved.
Round 3 (post-NEEDS_CONTEXT): Q-A through Q-G resolved.
Verbatim in the manager's brief; reproduced as Decisions Locked above.

**Cross-decision mitigation note (Q-B):** the CLI's live bare-UUID session dir is deleted in this sweep. The sweep is ordered such that the bare-UUID delete is the LAST operation in Stage E, after all THIS-workflow session-memory writes are committed (see D9). The acceptable downside: if the CLI is invoked between Stage E and the next gobbi command, it may report "session not found" — non-fatal, will self-resolve on next bootstrap.

### External research skip reason

External research is skipped. The cleanup is an internal-codebase operation; no library APIs, framework choices, or third-party patterns are in play. Git mechanics (worktree, gitignore, branch -d/-D, lightweight tag) are anchored to `.claude/skills/git/SKILL.md` (internal reference). Per Ideation skill's Constraints, the skip reason is logged here. No `references/` files staged.

### Backlog staging

One backlog file staged at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` — captures Q-E's follow-up risk (the CLI may regenerate `.gobbi/.gitignore` with the pre-reset policy at next bootstrap; the regen source is being deleted with `packages/`).

`staging/backlogs/feature/` remains empty (the rebuild itself is the next session's explicit work, not a backlog item).

### Mistakes consulted (per `mistake` skill P1)

See Memory reads register. Three project-level mistakes were directly load-bearing: `session-dir-naming-convention-uses-date-prefix` (I4 + Q8/Q-B interaction), `executor-rationalized-failing-verification-gate` (verification gate honesty), `manager-mispec-grep-c-for-occurrence-count` (D2 metric choice).

### Open questions

None remaining. All 15 decisions are locked; one backlog entry captures the only deferred follow-up (the CLI regenerator fix, scoped to the next session).

### WORK exit checklist (Ideation skill)

- [x] Root problem named (cumulative drift; concrete pre-rebuild reset).
- [x] Approach concrete enough to decompose (15 locked decisions; ordered stages 0/A–G).
- [x] Constraints and trade-offs explicit (`-d` vs `-D`, gitignore ordering, bare-UUID sequencing, regenerator follow-up risk).
- [x] Success measurable (15 verification commands in D2).
- [x] Open questions: none. All 7 gaps resolved.
- [x] Backlog stage covers all deferrals (1 backlog file for the CLI regenerator).
- [x] Memory reads register captures every load-bearing read.
- [x] External research skip reason logged.
- [x] Steel-man checked and addressed (Q-F tag satisfies it).
- [x] Three mistakes (date-prefix, verification-honesty, grep-c) explicitly applied.
