# Ideation rawdata — iter 3 (FINAL — 15 locks + 4 iter2 High remediations + 4 iter2 Med/Low surgical fixes + 2 iter3 Codex remediations)

Bottom-up repo reset before rebuilding gobbi. Single-PR destructive sweep, project memory reduced to placeholders (except authoritative skill/agent/rules content), sessions promoted from gitignored to tracked, pre-reset state archived via a lightweight git tag.

This iter3 draft inherits ALL iter2 remediations verbatim and applies the iter2 Codex evaluator's two findings (per the manager's iter3 AskUserQuestion round on Q-Gate-Redesign + the user's implicit approval of the surgical F-CX-OV-02 add). iter1 and iter2 stay untouched as the audit trail at `draft-iter1.md` and `draft-iter2.md`.

**iter3 deltas at a glance** (changes from iter2 — all 18 user locks unchanged; only the gate semantics are repaired):

- **iter3 fix #1 (F-CX-OV-01) — Q-Gate-Redesign locked** — Stage E.2's SHA gate was self-referential (a commit cannot contain its own SHA in a file in its own tree). Resolution: **drop the SHA-in-session.json requirement entirely**. New gate is two pre-conditions checked via plain git plumbing:
  1. `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA (the sweep commit exists on the branch).
  2. `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` shows the kept session dir is in the committed tree.
  If either fails: NEEDS_CONTEXT (no rationalization, per `executor-rationalized-failing-verification-gate.md`). The SHA is NEVER written into a tracked file — audit traceability uses `git log` directly.
- **iter3 fix #2 (F-CX-OV-02) — head-SHA capture around `gh pr merge`** — Codex Medium/50 finding, surgical add. Stage G inserts ONE step before `gh pr merge` to capture `HEAD_SHA=$(gh pr view <num> --json headRefOid -q .headRefOid)` and ONE step after to verify `git log -1 develop` shows a commit whose message body / squash trailer references `HEAD_SHA` (or equivalent — see D11). Proves the merged work corresponds to the reviewed PR tip.

**Inherited iter2 deltas (unchanged from iter2 — re-listed for traceability):**

- **H-1 (F-P-01)** — Stage B edits `.claude/CLAUDE.md` removing lines 61-62 (the two `v050-{overview,cli}.md` table rows). The two design files themselves get deleted via the existing `rm -rf design/*` in Stage C.
- **H-2 (F-R-02)** — Decisions Log records the user-accepted trade-off: the 3 promoted mistake files in `mistakes/` (`executor-rationalized-failing-verification-gate.md`, `session-dir-naming-convention-uses-date-prefix.md`, `manager-mispec-grep-c-for-occurrence-count.md`) will be deleted by Stage C's `rm -rf mistakes/*`. They served their iter1+iter2+iter3 purpose; trade-off is intentional.
- **H-3 (F-S-01 / F-U-01)** — Stage E split into E.1 (in-commit) and E.2 (post-commit terminal). **Gate description rewritten in iter3** (was: SHA-in-session.json; now: `git log` + `git ls-tree`).
- **H-4 (F-OV-01)** — Decisions Log records that the staged backlog `cli-regenerates-gobbi-gitignore.md` has no project-level promotion target post-sweep; it remains session-scoped under the preserved session dir. Wrap-up will document this in the handoff, not stage it for project promotion.
- **M-1 (F-C-01)** — Success Criterion #2: "exactly one new commit on `develop` post-merge (the squashed PR)".
- **M-2 (F-C-02)** — Stage G gains a post-merge step `git branch -d <sweep-branch>` so Success Criterion #5 holds.
- **L-1 (F-S-02)** — Stage F `find` uses `-mindepth 1` so the parent `worktrees/` dir survives.
- **M-3 (F-P-03)** — Stage E.1 explicitly names `2026-05-21-c676684d-...` in the delete-set.

---

## Scope Contract

```yaml
artifact_type: scope-contract
feature: repo-reset
goal: Reset gobbi to a clean baseline before bottom-up rebuild — wipe runtime code, replace most project memory with placeholders, retain only authoritative `skills/`/`agents/`/`rules/` content and root LICENSE/CHANGELOG/README; surgically excise the two soon-to-be-broken design links from `.claude/CLAUDE.md`; tag the pre-reset state for archival cheapness.
created-by: ideation-loop / session 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
created-at: 2026-05-21T05:34Z (iter1) — 2026-05-21 iter2 revision — 2026-05-21 iter3 revision
final-iter: iter3 (post Codex-evaluator REVISE remediation — Q-Gate-Redesign + F-CX-OV-02 surgical fix)
```

### In-Scope

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
- **Q8 + Q-B** — Delete all 53 sibling session dirs under `.gobbi/projects/gobbi/sessions/`, including the CLI-bootstrapped bare-UUID dir `6637e759-...`. The bare-UUID delete is split out as terminal step E.2 (see Stage E split below); the other 52 dirs (including the prior date-prefixed session `2026-05-21-c676684d-...`) are deleted in E.1.
- **Q8 + Q-G** — Branch cleanup:
  - `git branch -d fix/257-complete-mirror-sync` (safe-delete; ancestor of develop).
  - `git branch -d refactor/257-skills-agents-rules` (safe-delete; ancestor of develop).
  - `git branch -D pr-fin-2-decisions-hold` (force-delete; user pre-authorized).
  - `git branch -D redesign/v050-ideation` (force-delete; user pre-authorized).
  - **iter2 M-2**: `git branch -d <sweep-branch>` post-merge (local cleanup; `gh pr merge --squash --delete-branch` handles the remote side).
- **Worktree removal** — `git worktree remove` both registered worktrees BEFORE branch deletion.
- **Q4** — Transform root `.gitignore`: drop the line `.gobbi/projects/*/sessions/` so `sessions/` becomes tracked. Keep `worktrees/`, `tmp/`, `settings.json` ignored.
- **Q-E** — Edit `.gobbi/.gitignore` (workspace-level, CLI-auto-generated) to remove the `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines ignored.
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push the tag to origin.
- **Q3** — Single worktree, single atomic-sweep PR off `develop` (via session's `git.workflow=worktree-pr` setting). Multiple bisect-safe commits on the sweep branch are permitted; the PR squash-merges to a single commit on develop.
- **iter3 fix #2 — F-CX-OV-02 head-SHA capture (in Stage G)**: capture the PR head SHA via `gh pr view --json headRefOid` immediately before `gh pr merge`, and verify post-merge that the squash commit on develop references that head SHA (via merge commit's body / GitHub's squash trailer or an equivalent grep). Surgical, in-scope add — does not change any locked decision.

### Out-of-Scope

- The rebuild itself — explicitly deferred to a follow-on session.
- Touching `.claude/README.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/.env`, `.claude/worktrees/` — neither asked for nor locked. (Note: `.claude/CLAUDE.md` is now in scope under H-1 for the surgical lines-61-62 excision only; no other CLAUDE.md edits.)
- Touching `.gobbi/settings.json` — runtime CLI state.
- Re-architecting `.claude/` content; only `.claude/project/gobbi/` is removed (Q-D) and the H-1 CLAUDE.md table-row excision lands.
- Remote-branch deletion (only local branches; remote sweep-branch is handled by `gh pr merge --delete-branch`).
- Touching `main` or `develop` branches.
- Rewriting git history. The sweep is a new branch with bisect-safe commits, PR'd into `develop`, squash-merged.
- **Writing the sweep commit SHA into any tracked file** — removed in iter3 per Q-Gate-Redesign. The sweep SHA lives in `git log` only; audit traceability does not require duplicating it into `session.json`.

### Decisions Locked (18 total)

**Original 8 (manager rounds 1–2 — unchanged from iter1):**

- **Q1** — Wipe `packages/` entirely. No partial retention.
- **Q2** — Project-memory subdirs become empty dirs each with one-line stub README (subject to Q-A's survivor revision).
- **Q3** — Single worktree, single atomic-sweep PR off `develop` (via `git.workflow=worktree-pr`).
- **Q4** — `sessions/` becomes tracked. `worktrees/`, `tmp/`, `settings.json` remain ignored at root.
- **Q5** — Delete all four root manifests + `node_modules/`.
- **Q6** — Delete `plugins/gobbi/` and `test/gitignore.test.sh`.
- **Q7** — Keep `LICENSE`, `CHANGELOG.md`, `README.md`. Delete `MIGRATION.md`, `AGENTS.md`.
- **Q8** — Delete 4 specific local branches (with the `-d`/`-D` split below); keep `main`+`develop`. Delete all 53 sibling session dirs; keep only this session's date-prefixed dir.

**Gap-fill 7 (manager round 3, post-NEEDS_CONTEXT — unchanged from iter1):**

- **Q-A** — Survivor set inside `.gobbi/projects/gobbi/` is `agents/`+`skills/`+`rules/`+`sessions/<current>`+`worktrees/`+`settings.json`. The other 13 subdirs get placeholdered. `adversarial-review/` is deleted entirely. `README.md` becomes a one-line stub.
- **Q-B** — The CLI bare-UUID sibling session dir `6637e759-...` is deleted with the other 52. Sequenced as terminal step E.2 (see Stage E split).
- **Q-C** — `.gobbi/projects/gobbi/README.md` becomes a one-line stub citing the `pre-reset-2026-05-21` tag.
- **Q-D** — `.claude/project/gobbi/` is deleted in this sweep (`git rm -r`).
- **Q-E** — Edit `.gobbi/.gitignore`: remove `sessions/` and `project/note/` lines; keep `worktrees/` and `settings.json`. Stage one backlog entry capturing the CLI-regeneration risk (the regen source is being deleted with `packages/`).
- **Q-F** — Create lightweight tag `pre-reset-2026-05-21` at `487fc35` BEFORE the PR opens; push to origin.
- **Q-G** — `git branch -D` pre-authorized for `pr-fin-2-decisions-hold` and `redesign/v050-ideation`. Safe `-d` for `fix/257-complete-mirror-sync` and `refactor/257-skills-agents-rules`.

**iter2-round 2 (manager round 4, post-Claude-REVISE — unchanged from iter2):**

- **Q-Survivor** — Don't expand the survivor set; instead surgically excise the two CLAUDE.md table-row citations to the soon-to-be-placeholdered `design/` files. The 3 promoted mistake files in `mistakes/` are accepted as deleted under H-2; their lessons are encoded in the iter2 (and now iter3) draft.
- **Q-StageE** — Split Stage E into E.1 (in-commit) and E.2 (post-commit terminal). E.2 is FS-only; not part of any commit.

**iter3-round 5 (manager round 5, post-Codex-REVISE — NEW iter3 lock):**

- **Q-Gate-Redesign** — Drop the SHA-in-session.json requirement that was the iter2 H-3 gate. The new Stage E.2 gate is two pre-conditions verified via `git log` and `git ls-tree`; the sweep SHA is NEVER written into any file. If either pre-condition fails: NEEDS_CONTEXT. Per the user's selection of the Recommended option.

### Success Criteria

1. `git status` on the post-sweep branch shows only the intended deletions / modifications, no stray files.
2. **(iter2 M-1)** Post-merge: `git log --oneline -2 develop` shows exactly one new commit on `develop` (the squashed PR) plus the prior `487fc35` SOP commit. The pre-merge sweep branch may carry multiple bisect-safe commits — only the post-merge develop count is the contract.
3. Working tree under `.gobbi/projects/gobbi/` contains only: `agents/`, `skills/`, `rules/`, `README.md`, `settings.json`, `sessions/2026-05-21-6637e759-.../`, `worktrees/` (empty), plus the 13 placeholder dirs each holding a single `README.md`.
4. `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d` yields exactly 1 entry: `2026-05-21-6637e759-...`.
5. `git branch | grep -vE '^[* ] (main|develop)$'` returns no rows post-merge (assumes the post-merge `git branch -d <sweep-branch>` step from M-2 has run).
6. `git worktree list | wc -l` returns 1 (only the main tree).
7. `find .claude/{skills,agents} -xtype l` returns empty (no broken symlinks).
8. Root contains only: `.git`, `.gitignore`, `.claude/`, `.gobbi/`, `LICENSE`, `CHANGELOG.md`, `README.md`.
9. `git tag --list pre-reset-2026-05-21` returns the tag at `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` returns a match.
10. `.gobbi/.gitignore` contains neither `sessions/` nor `project/note/`; still contains `worktrees/` and `settings.json`.
11. `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1 (no ignore match).
12. **(iter2 H-1)** `grep -nE '^\| \[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty (the two design-link table rows have been removed).
13. **(iter3 Q-Gate-Redesign)** Pre-E.2 gate, BOTH return true: `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]` AND `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .`.
14. **(iter3 F-CX-OV-02)** Stage G captured the PR head SHA before merge via `gh pr view <num> --json headRefOid -q .headRefOid`, and post-merge `git log -1 --format=%B develop` includes that SHA (GitHub's squash-merge commit body cites the source SHA(s)) — or an equivalent grep verification per D11.

### Deferred

- The rebuild itself — next session.
- CLI regenerator fix for `.gobbi/.gitignore` — backlog entry at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`. Per iter2 H-4: this backlog has no project-level promotion target post-sweep (Q-A places `backlogs/` in PLACEHOLDER); it stays session-scoped under the preserved session dir and the Wrap-up handoff narrative references it.

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

**I1b — (iter2 H-1) `.claude/CLAUDE.md` cites two files in the soon-to-be-placeholdered `design/` dir.**
- Source: `grep -n "v050-overview\|v050-cli" .claude/CLAUDE.md` returns lines 61-62 — two table rows pointing into `.gobbi/projects/gobbi/design/{v050-overview,v050-cli}.md`. These links are NOT symlinks; they're markdown hyperlinks resolved at read time.
- Why-it-applies: Q-A places `design/` in PLACEHOLDER, so after Stage C the two target files no longer exist. The user's directive for iter2 ("fix citations, don't expand survivor set") locks the resolution: surgically excise those two table rows from CLAUDE.md in the same sweep commit. This is the only CLAUDE.md edit; no other lines are touched.

**I2 — Two registered worktrees, both with branches needing different delete modes.**
- Source: `git worktree list` shows `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` ([`redesign/v050-ideation`] @ `0be2f97`) and `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` ([`refactor/257-skills-agents-rules`] @ `f3769cc`). `git merge-base --is-ancestor` against `develop`: `fix/257-complete-mirror-sync` and `refactor/257-skills-agents-rules` ARE ancestors (squash-merge tips happen to be); `pr-fin-2-decisions-hold` and `redesign/v050-ideation` are NOT ancestors.
- Why-it-applies: `git branch -d` (safe-delete) succeeds only for ancestor-merged branches. The 2 non-ancestor branches require `git branch -D` (Forbidden Operations / Always-Ask in `git/SKILL.md`). **Q-G pre-authorizes `-D`** for both — no second AskUserQuestion needed at Execution. The Execution PR must still run `git worktree remove <path>` BEFORE `git branch -d/-D <branch>` (worktree removal first, then branch deletion).

**I3 — `.gobbi/projects/gobbi/adversarial-review/` is git-tracked, not just on-disk.**
- Source: `git ls-files | grep adversarial-review | wc -l` shows the dir is tracked (hundreds of files across iter1..iter19, claude+codex per perspective). Deletion is `git rm -r .gobbi/projects/gobbi/adversarial-review/`, not just `rm -rf`. The same `git rm` semantics apply to other tracked content listed in I1.

**I4 — The current session has BOTH a date-prefixed dir AND a UUID-only dir.**
- Source: `ls .gobbi/projects/gobbi/sessions/ | grep 6637e759` returns both `2026-05-21-6637e759-...` (manager-authored, per mistake `session-dir-naming-convention-uses-date-prefix.md`) and `6637e759-...` (CLI-bootstrapped runtime artifact containing `gobbi.db` + a separate `session.json`). Per that mistake, the UUID-only form is CLI drift; the canonical form is `{date}-{session-id}`.
- **Q-B resolves**: delete the bare-UUID dir with the other 52 in the sweep. **iter3 Q-Gate-Redesign supersedes iter2 H-3's gate semantics**: the bare-UUID delete is still Stage E.2 (terminal post-commit FS-only operation), but the gate is now non-circular — pre-conditions verified by `git log --format=%H -1 <sweep-branch>` (non-empty) AND `git ls-tree <sweep-branch> <kept-session-dir>/` (non-empty). The sweep SHA is NOT written into any file.

**I5 — Multiple non-current session dirs in delete-set, including the prior date-prefixed session (iter2 M-3).**
- Source: `ls .gobbi/projects/gobbi/sessions/`. Three structurally notable entries beyond the bare-UUID twins:
  - `sess-final` — local fixture artifact; `rg -n "sess-final"` against the codebase returns no live references.
  - `99999999-aaaa-bbbb-cccc-dddddddddddd` — local fixture artifact; same.
  - **`2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a`** — the PRIOR session that promoted today's three project mistakes (verified via `head -10` on each: `session_id: c676684d-...` in frontmatter). This dir is deleted in iter2's Stage E.1.
- Why-it-applies: per F-P-03 and the H-2 trade-off accepted by the user, the three mistake files in `mistakes/` (themselves promoted in c676684d) will also be deleted by Stage C — so the broken provenance chain (mistakes deleted; their source session deleted; their `session_id:` frontmatter anchor dangling) is internally consistent. Acceptable per the user's iter2 directive.

**I6 — Root `.gitignore` line for sessions is `.gobbi/projects/*/sessions/` inside a whitelist block.**
- Source: `/playinganalytics/git/gobbi/.gitignore`. The whole `.gobbi/*` is ignored, with an explicit unignore for `!.gobbi/projects/`, then re-ignores for `sessions/`, `rawdata/`, `settings.json`, `worktrees/`, `tmp/`. Q4 requires `sessions/` become tracked while `worktrees/`, `tmp/`, `settings.json` remain ignored. **Exact transformation**: delete the line containing `.gobbi/projects/*/sessions/` from root `.gitignore` (cited by text content, not line number — F-C-04).
- Adjacent: `.gobbi/.gitignore` is auto-generated by the CLI. **Q-E resolves**: edit it directly — drop `sessions/` and `project/note/`; keep `worktrees/` and `settings.json`. The CLI regenerator source is in `packages/cli/` which is being deleted this sweep, so the future rebuilt CLI must honor this policy — captured as a backlog entry (whose post-sweep fate is documented in H-4).

**I7 — Notes content + research subdir under `notes/`.**
- Source: `ls .gobbi/projects/gobbi/notes/` — `2026-05-21-pr-262-entry-point-sop.md`, `handoff-redesign-2026-05-02.md`, and `agent-principles-research/`. All go away under Q2+Q-A's placeholder treatment of `notes/`.

**I8 — Promotion-staged content from prior session (untracked) lives intermixed with tracked content. (Includes the 3 mistakes from H-2.)**
- Source: `git status --short` reveals 3 untracked mistake files (executor-rationalized…, manager-mispec…, session-dir…), 2 untracked feature dirs (`gobbi-install/`, `orchestration-docs/`), `gotchas/`, 1 new note, 1 new backlog. All evaporate under the reset (none survive to placeholder land, since their PARENT subdirs become placeholders).
- iter2 H-2: the user explicitly accepts that the 3 promoted mistake files in `mistakes/` will be deleted with the rest of the subdir's content. They served their iter1/iter2/iter3 purpose (the evaluator findings already absorbed their lessons; this draft applies the `executor-rationalized…` lesson via the NEEDS_CONTEXT clause in Stage E.2's new gate, and the `manager-mispec-grep-c` lesson via D2's command choices, and the `session-dir-naming` lesson via M-3's explicit `c676684d-` naming).

**I9 — `.claude-plugin/marketplace.json` is already `D` in git status.**
- Source: `git status --short` line 1. Including it in the sweep commit finalizes the delete. Verify and `rmdir .claude-plugin/` if empty.

**I10 — `.claude/project/gobbi/` exists, v0.4-era, untouched by the original Q1–Q8.**
- Source: `ls -la .claude/project/gobbi/` shows `mistakes/`, `note/`, `design/`. Tracked in git, not symlinked. **Q-D resolves**: delete in this sweep (`git rm -r`). Confirmed by inventory: nothing under it is referenced by any survivor file (no symlink targets, no rule cites).

**I11 — (iter3 Codex) `gh pr view --json headRefOid` returns the PR's current tip SHA; `gh pr merge --squash` produces a single commit on develop whose default body cites the source PR's SHA in GitHub's squash-merge trailer.**
- Source: GitHub CLI docs (general knowledge — internal reference suffices; this is a one-flag invocation with stable output). The post-merge verification can grep the develop commit body for the captured `HEAD_SHA`, or use `gh pr view <num> --json mergeCommit -q .mergeCommit.oid` to fetch the merge commit and confirm.
- Why-it-applies: F-CX-OV-02's concern is "did the merged commit correspond to the reviewed branch tip?" Without capture, a force-push between the last review and the merge would silently substitute different content. With capture + post-merge grep, that substitution is detected immediately.

### External

None. External research is skipped — see Decisions Log "External research skip reason."

---

## Scenarios

| Scenario | Type | Description | Verification |
|---|---|---|---|
| S1 | Golden | Single squashed sweep commit lands on `develop` via PR; post-merge `git status` clean; `.claude/skills/+agents/` symlinks all resolve. | `find .claude/{skills,agents} -xtype l` returns empty; `git status` clean. |
| S2 | Golden | Current session dir `2026-05-21-6637e759-...` retained; no other session dirs remain (including the bare-UUID sibling and the prior date-prefixed `2026-05-21-c676684d-...`). | `ls .gobbi/projects/gobbi/sessions/` shows exactly one entry. |
| S3 | Golden | `pre-reset-2026-05-21` tag exists at `487fc35` locally and on origin BEFORE the PR opens. | `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin` includes the tag. |
| S3b | Golden | (iter2 H-1) Post-sweep `.claude/CLAUDE.md` no longer contains the two `v050-{overview,cli}.md` table rows. | `grep -nE '\[`v050-(overview\|cli)\.md`\]' .claude/CLAUDE.md` → empty. |
| S4 | Edge | Worktree at `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` has an uncommitted dirty tree. | Executor runs `git -C <wt> status` first; if dirty, NEEDS_CONTEXT to user; else `git worktree remove`. |
| S5 | Edge | `.gitignore` line removal precedes the new `sessions/` content being staged. If sequence inverted, `git add .gobbi/projects/gobbi/sessions/` is a no-op (still ignored), and the kept session dir doesn't enter the commit. | Plan orders: (a) edit root `.gitignore`, (b) verify with `git check-ignore`, (c) `git add` session dir. |
| S6 | Edge | **(iter3 Q-Gate-Redesign)** CLI's live bare-UUID session dir `6637e759-...` deletion mid-workflow could cause the CLI to lose track of the session. Resolved by Stage E.2: bare-UUID delete is a terminal post-commit FS-only operation, gated by TWO non-circular pre-conditions — (1) the sweep commit exists on the sweep branch (`git log --format=%H -1 <sweep-branch>` returns a non-empty SHA), AND (2) the kept session dir is in the committed tree (`git ls-tree <sweep-branch> <kept-session-dir>/` returns a non-empty result). The sweep SHA is NOT written into any file (the iter2 self-referential gate is removed). On gate failure: NEEDS_CONTEXT. | Executor runs the two `git` commands; both must succeed before `rm -rf`. |
| S6b | Edge | **(iter3 F-CX-OV-02)** PR head gets force-pushed between the last review and `gh pr merge`, so the merged commit silently contains different content than what was reviewed. | Stage G captures `HEAD_SHA=$(gh pr view <num> --json headRefOid -q .headRefOid)` immediately before merge; post-merge verifies the squash commit body / `gh pr view --json mergeCommit` references that SHA. If absent, NEEDS_CONTEXT. |
| S7 | Failure | `git rm -r .gobbi/projects/gobbi/adversarial-review/` fails because of a working-tree change. | Executor `git status` first; resolve before retry. |
| S8 | Failure | Single atomic PR exceeds GitHub's diff/file limit when squashed. | Pre-merge sweep branch carries bisect-safe sub-commits (B/C/D/E.1/F); single squash-merge produces one develop commit (M-1). |
| S9 | Failure | Stub READMEs collide with names of existing files in the destination dir. | Executor verifies each subdir is empty (after the wipe) before writing stub README. |
| S10 | Adversarial | After deletion, future agent reads `.claude/skills/orchestration/SKILL.md` (symlink → `.gobbi/.../skills/orchestration/SKILL.md`). | Q-A keeps the symlink target; agent loads succeed. |
| S11 | Adversarial | User changes mind mid-execution; needs to recover. | Pre-reset tag `pre-reset-2026-05-21` makes recovery a one-command checkout. Pre-merge revert: `git checkout develop`. Post-merge revert: `git revert <merge-sha>`. |
| S12 | Adversarial | Future rebuilt CLI regenerates `.gobbi/.gitignore` with the OLD policy, silently re-ignoring `sessions/` and `project/note/`. | Backlog entry `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` flags this; per H-4 it has no project-promotion target but is referenced in the Wrap-up handoff; rebuild session must update the regen template before shipping. |
| S13 | Adversarial | (iter2 M-2) Post-merge, the local sweep branch is not deleted, breaking Success #5. | Stage G post-merge step `git branch -d <sweep-branch>` after `gh pr merge --squash --delete-branch` succeeds. |
| S14 | Edge | (iter2 L-1) `find .gobbi/projects/gobbi/worktrees/ -type d -empty -delete` (without `-mindepth 1`) deletes `worktrees/` itself once empty, breaking Success #3. | Use `find .../worktrees/ -mindepth 1 -type d -empty -delete`. |

---

## Implementation Checklist

Anchored items per scenario. Execution may further decompose; the order below is the dependency-correct order the Planning loop will inherit. **Commit labels** ("sweep-branch commit N") refer to bisect-safe commits on the sweep branch; per M-1, the PR squash-merges them into ONE commit on `develop`.

**Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens**

- [ ] `git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required).
- [ ] `git push origin pre-reset-2026-05-21`.
- [ ] Verify: `git rev-parse pre-reset-2026-05-21` → `487fc35`; `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches.

**Stage A — Discovery + pre-flight (S1, S4, S7)**

- [ ] Pre-flight: confirm both worktree paths are clean (`git -C <wt> status` → empty), branch state matches expectations (`git log -1`).
- [ ] Pre-flight: re-check `git status` against the inventory; no new untracked files appearing between session bootstrap and Execution.
- [ ] Pre-flight: open the sweep branch off `develop` (per `git.workflow=worktree-pr`).

**Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1 (squash-merged into develop as part of the single PR commit per M-1)**

- [ ] `git rm -r packages/` (Q1).
- [ ] `git rm package.json bun.lock package-lock.json` (Q5).
- [ ] `rm -rf node_modules/` (Q5; untracked — FS-only hygiene, does NOT enter the commit).
- [ ] `git rm -r plugins/gobbi/` (Q6).
- [ ] Handle `test/gitignore.test.sh` (Q6) — `git rm test/gitignore.test.sh` if tracked, `rm` if not; then `rmdir test/` if empty.
- [ ] `git rm MIGRATION.md AGENTS.md` (Q7).
- [ ] `git rm .claude-plugin/marketplace.json` (already `D`); `rmdir .claude-plugin/` if empty.
- [ ] `git rm -r .codex/` (Item 5, tracked). NOTE: `.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r` removes the symlinks, not the targets.
- [ ] `rm -rf .agents/` (Item 5, untracked — FS-only hygiene).
- [ ] `git rm -r .claude/project/gobbi/` (Q-D).
- [ ] **(iter2 H-1)** Edit `.claude/CLAUDE.md`: remove lines 61-62 (the two table rows containing `[`v050-overview.md`]` and `[`v050-cli.md`]`). The two design files themselves are deleted in Stage C via the `design/` placeholder reset. Verification post-edit: `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` → empty.
- [ ] `git add .claude/CLAUDE.md`.

**Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2**

- [ ] `git rm -r .gobbi/projects/gobbi/adversarial-review/` (Item 3).
- [ ] For each of the 13 placeholder subdirs under `.gobbi/projects/gobbi/` (`archive/`, `backlogs/`, `decisions/`, `design/`, `features/`, `gotchas/`, `learnings/`, `mistakes/`, `notes/`, `plans/`, `references/`, `reviews/`, `tmp/`):
  - `git rm -r <subdir>/*` if any tracked content present (preserve the dir); plus `rm -rf <subdir>/*` to catch untracked stragglers (this is where today's 3 promoted-but-untracked mistake files in `mistakes/` and the untracked `features/{gobbi-install,orchestration-docs}/`, `gotchas/`, the staged note and backlog get cleaned — H-2 acknowledged by the user).
  - Verify the dir is empty.
  - Write a one-line stub `<subdir>/README.md` using the inline template from D4 (the artifact's `rules/stub-redirect-format.md` covers supersession stubs, not placeholder stubs; D4's template is the authoritative shape).
  - `git add <subdir>/README.md`.
- [ ] **Do NOT touch** `agents/`, `skills/`, `rules/` content (Q-A survivor set).
- [ ] Replace `.gobbi/projects/gobbi/README.md` with a one-line stub (Q-C). Suggested wording: `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

**Stage D — Gitignore transformations (Q4, Q-E) → sweep-branch commit 3 [ORDER CRITICAL — Stage D MUST precede Stage E.1's `git add` of the session dir]**

- [ ] Edit root `/playinganalytics/git/gobbi/.gitignore`: remove the line containing `.gobbi/projects/*/sessions/`. Keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines. (Cite by text content per F-C-04.)
- [ ] Edit `.gobbi/.gitignore` (workspace-level): remove `sessions/` and `project/note/` lines. Keep `worktrees/` and `settings.json` lines.
- [ ] Verify: `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` returns exit 1.
- [ ] `git add .gitignore .gobbi/.gitignore`.
- [ ] **Commit checkpoint**: `git commit -m '<sweep-branch commit 3 msg>'`. (SHA capture not required — Stage E.2's gate uses `git log` directly per iter3 Q-Gate-Redesign; the sweep SHA is NEVER written into `session.json`.)

**Stage E — Session-dir sweep (Q8, Q-B) — SPLIT per iter2 H-3 into E.1 (in-commit) + E.2 (post-commit terminal). iter3 Q-Gate-Redesign replaces the SHA-in-session.json gate with a non-circular `git log` + `git ls-tree` gate.**

**Stage E.1 — In-commit session sweep [sweep-branch commit 3 continuation; same commit as Stage D's commit, or a follow-on bisect-safe commit; both options keep E.1 pre-PR-merge]**

- [ ] **First**: `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` (NOW possible because Stage D's gitignore edits are committed).
- [ ] Confirm THIS-workflow session-memory writes (Memorization promotion outputs, decisions log, final session.json) are present in the staged contents. (No requirement to embed any commit SHA into `session.json` — the iter2 H-3 self-referential gate is removed in iter3 per Q-Gate-Redesign.)
- [ ] **Delete the 52 sibling DIR-FORM session dirs** (untracked under prior `.gitignore`). This is FS-only — the dirs were ignored so no `git rm` is needed; `rm -rf` is sufficient and the changes do NOT enter the commit's diff (they're not in the index). Explicit deletion set:
  - **`2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/`** (iter2 M-3: explicit name; this is the prior date-prefixed session that promoted today's 3 mistakes — its deletion is consistent with H-2)
  - `sess-final/` (fixture)
  - `99999999-aaaa-bbbb-cccc-dddddddddddd/` (fixture)
  - 49 bare-UUID dirs (all the historical session UUIDs other than `6637e759-...`)
  - Equivalent shell: `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d ! -name '2026-05-21-6637e759-84d9-403d-87bd-0a484abec245' ! -name '6637e759-84d9-403d-87bd-0a484abec245' -print0 | xargs -0 rm -rf`
- [ ] **E.1 explicitly DOES NOT delete** the CLI bare-UUID dir `6637e759-...`. That dir contains the CLI's live `gobbi.db` + runtime `session.json` and is held until Stage E.2.
- [ ] Commit Stage E.1's `git add` (the kept session dir + any tracked-session-content `git rm`) together with Stage D's gitignore edits, or as a follow-on bisect-safe commit on the sweep branch. Either way, the kept session dir is now part of the sweep branch's committed tree.

**Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID `6637e759-...` delete [iter3 Q-Gate-Redesign — non-circular gate, replaces iter2 H-3's self-referential gate]**

- [ ] **Gate (concrete + testable, non-circular)**: do NOT proceed until BOTH pre-conditions return true.
  1. **Pre-condition 1**: `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA (the sweep commit exists on the branch).
     - Concrete check: `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]` (exit 0 ⇒ pass).
  2. **Pre-condition 2**: `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` lists at least one entry (the kept session dir is in the committed tree).
     - Concrete check: `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .` (exit 0 ⇒ pass).
- [ ] **If either pre-condition fails: NEEDS_CONTEXT** — do NOT rationalize the gate (per `executor-rationalized-failing-verification-gate.md`). Stop, report the failing pre-condition's exact `git` output, and wait for the manager.
- [ ] When BOTH pre-conditions pass: `rm -rf .gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/`. This is a pure filesystem operation; it is NOT part of any commit (the dir was gitignored, so it was never in any tree).
- [ ] After E.2, any further Wrap-up writes for THIS session go into the date-prefixed dir `2026-05-21-6637e759-...` (which is preserved) and into commits on the sweep branch as needed. The CLI may report "session not found" on its next bootstrap; acceptable per Q-B.
- [ ] **Audit traceability note**: the sweep commit's SHA is recoverable any time via `git log --format=%H -1 <sweep-branch>` while the branch is live, and via `git log <merge-sha>` after PR merge. There is no requirement (and no benefit) to embed the SHA into `session.json` — `git` already serves as the authoritative log.

**Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep-branch commit 4 (or interleaved with E.1)**

- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation`.
- [ ] `git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules`.
- [ ] **(iter2 L-1)** `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete` to clean up empty parent dirs while preserving `worktrees/` itself.
- [ ] `git branch -d fix/257-complete-mirror-sync` (safe-delete; pre-authorized by Q-G as `-d`).
- [ ] `git branch -d refactor/257-skills-agents-rules` (safe-delete; pre-authorized by Q-G as `-d`).
- [ ] `git branch -D pr-fin-2-decisions-hold` (force-delete; pre-authorized by Q-G as `-D`).
- [ ] `git branch -D redesign/v050-ideation` (force-delete; pre-authorized by Q-G as `-D`).

**Stage G — PR open + head-SHA capture + merge + post-merge verification + local cleanup [iter3 F-CX-OV-02 surgical add]**

- [ ] Push the sweep branch.
- [ ] Open PR into `develop`. The tag `pre-reset-2026-05-21` already exists on origin (Stage 0).
- [ ] PR body cites the 15 locked decisions (Q1–Q8, Q-A–Q-G) + the 3 iter2-round answers (Q-Survivor, Q-StageE) + the 1 iter3-round answer (Q-Gate-Redesign) + the pre-reset tag + the iter2 + iter3 remediation deltas.
- [ ] **After PR review + approval, BEFORE `gh pr merge` (iter3 F-CX-OV-02)**: capture the PR's current head SHA.
  - `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)`
  - Echo or log `HEAD_SHA` to the executor's session log (and Wrap-up handoff) so a force-push between this step and merge is detectable.
- [ ] `gh pr merge <pr-num> --squash --delete-branch` (squashes the sweep-branch commits into one new commit on `develop`; deletes the remote sweep-branch).
- [ ] **Post-merge head-SHA verification (iter3 F-CX-OV-02)**: confirm the merged content corresponds to the reviewed PR tip.
  - Option A (preferred — checks GitHub's merge-commit metadata): `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` returns the develop commit SHA; `git log -1 --format=%B <merge-sha>` (after `git pull develop`) contains a reference to `$HEAD_SHA` (GitHub's squash commit message body cites the source commit(s) by short or full SHA).
  - Option B (fallback): `git log <merge-sha> --format=%B | grep -F "$HEAD_SHA"` returns at least one match.
  - If neither matches: NEEDS_CONTEXT — the merged commit may not correspond to the reviewed tip (possible force-push or merge-strategy substitution). Do not rationalize.
- [ ] **(iter2 M-2)** Post-merge local cleanup: `git checkout develop && git pull && git branch -d <sweep-branch>` to remove the local sweep branch (`gh pr merge --delete-branch` handles remote only).
- [ ] Verify Success Criteria 1-14.

**Critical ordering invariants (summary — refined per iter3 Q-Gate-Redesign + F-CX-OV-02):**

1. **Stage 0 (tag) → before any deletion** so the tag points at `487fc35`, not at HEAD-after-sweep.
2. **Stage D (gitignore edits) committed → before Stage E.1 (`git add` of session dir)** so the kept session dir actually enters the index (S5).
3. **Stage F (worktree remove) → before Stage F (branch delete)** because git refuses to delete a branch that has a registered worktree.
4. **Stage E.2 bare-UUID delete is TERMINAL POST-COMMIT, gated by `git log` + `git ls-tree` (NOT by SHA-in-session.json — iter2's self-referential gate is replaced in iter3)** (S6 + iter3 Q-Gate-Redesign). E.2 is FS-only; it is NEVER part of any commit.
5. **`git rm` for tracked deletes vs `rm -rf` for untracked** — explicitly distinguished in each stage above; the per-stage commit-vs-FS labeling is noted inline.
6. **(iter2 M-2)** **Post-merge `git branch -d <sweep-branch>`** to honor Success Criterion #5.
7. **(iter3 F-CX-OV-02)** **Capture `HEAD_SHA` BEFORE `gh pr merge`, verify AFTER `gh pr merge`** — proves merged content corresponds to reviewed PR tip; protects against silent force-push or merge-strategy substitution.

---

## Design

The design surface for a destructive cleanup is small but the **ordering** and **verification** are the load-bearing decisions.

### D1 — Deletion order across the 7 items + iter2 H-1 CLAUDE.md edit + iter3 F-CX-OV-02 head-SHA capture

Order: (0) tag → (A) pre-flight + branch open → (B) code/plugin/root + `.claude/project/gobbi/` + **CLAUDE.md lines 61-62 excision** → (C) adversarial-review + placeholder reset → (D) gitignore edits committed → (E.1) sessions sweep in-commit (52 dirs incl. `c676684d-`) → (E.2) bare-UUID FS-only delete gated by `git log` + `git ls-tree` → (F) worktree removal + branch deletion → (G) **`HEAD_SHA` capture** → PR open + squash-merge + **post-merge `HEAD_SHA` verify** + local sweep-branch delete.

Rationale anchored to I6 + I2 + I1b + Q-B + Q-F + iter2 H-1 + iter3 Q-Gate-Redesign + iter3 F-CX-OV-02: the tag must point at the PRE-reset commit; `.gitignore` edits must be committed before `git add` on the kept session dir; the bare-UUID delete is terminal-post-commit (not part of any commit) and gated by NON-CIRCULAR pre-conditions; CLAUDE.md's surgical 2-line excision lands in Stage B alongside the other Stage-B deletions; worktree removal must precede branch deletion; `HEAD_SHA` capture brackets the merge call; local sweep-branch deletion is the post-merge tail.

### D2 — Verification at the end (S1, S2, S3, S3b, S6, S6b, S10, S13, S14)

The Plan's verification gate enumerates:

1. `find .claude/{skills,agents} -xtype l | wc -l` → 0 (no broken symlinks).
2. `ls .gobbi/projects/gobbi/sessions/ | wc -l` → 1.
3. `ls .gobbi/projects/gobbi/sessions/` → `2026-05-21-6637e759-84d9-403d-87bd-0a484abec245`.
4. `git worktree list | wc -l` → 1.
5. Post-merge: `git branch | sed 's/^..//' | sort` → `develop\nmain` (the sweep branch is deleted by M-2).
6. `ls /playinganalytics/git/gobbi/` → exactly `.git .gitignore .claude .gobbi LICENSE CHANGELOG.md README.md`.
7. `git ls-files | grep -E "^\.gobbi/projects/gobbi/(skills|agents|rules)/" | wc -l` matches pre-sweep count (skills/agents/rules content preserved per Q-A).
8. `git ls-files | grep -E "^\.gobbi/projects/gobbi/adversarial-review/"` → empty.
9. `git ls-files | grep -E "^\.claude/project/gobbi/"` → empty (Q-D).
10. `git check-ignore .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/session.json` → exit 1.
11. `grep -E '^sessions/$|^project/note/$' .gobbi/.gitignore` → empty (Q-E).
12. `grep -E '^worktrees/$|^settings\.json$' .gobbi/.gitignore` → 2 matches (Q-E preserved).
13. Stub README count: `find .gobbi/projects/gobbi/ -maxdepth 2 -name README.md | wc -l` → 14 (13 placeholder subdirs + the root README).
14. `git rev-parse pre-reset-2026-05-21` → `487fc35`.
15. **(iter3 Q-Gate-Redesign — replaces iter2's SHA-in-session.json verifications)** Pre-E.2 gate:
    - `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]` returns exit 0 (sweep commit exists on branch).
    - `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .` returns exit 0 (kept session dir is in committed tree).
    - On either failure: NEEDS_CONTEXT (no rationalization).
16. `git ls-remote --tags origin | grep -c 'refs/tags/pre-reset-2026-05-21$'` → 1. (`$` anchor + line-form output makes `grep -c` a line-count safely usable here; for occurrence counts where lines might collide, use `grep -o ... | wc -l` per `manager-mispec-grep-c-for-occurrence-count.md`.)
17. **(iter2 H-1 / S3b)** `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` → empty.
18. **(iter2 S14)** `test -d .gobbi/projects/gobbi/worktrees` → exit 0 (the `worktrees/` dir survives the `find -mindepth 1` cleanup).
19. **(iter2 M-1)** Post-merge: `git log --oneline -2 develop` shows exactly two commits, the latest being the squashed sweep PR and the prior being `487fc35`.
20. **(iter3 F-CX-OV-02 pre-merge)** `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)` returns a non-empty 40-char SHA; logged to executor's session log.
21. **(iter3 F-CX-OV-02 post-merge)** Either `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` returns the develop-tip SHA AND `git log -1 --format=%B develop | grep -F "$HEAD_SHA"` matches, OR the fallback `git log <merge-sha> --format=%B | grep -F "$HEAD_SHA"` matches. On no match: NEEDS_CONTEXT.

### D3 — Where session-memory tracking is enforced

Two files coordinate: root `/playinganalytics/git/gobbi/.gitignore` (drop `.gobbi/projects/*/sessions/`) AND `.gobbi/.gitignore` (drop `sessions/` and `project/note/`). Both must be edited because the latter is workspace-scoped and could shadow if it included `sessions/`. Q-E makes the change explicit in both files.

### D4 — Stub README format (Q2, Q-C) — inline template, NOT cited from stub-redirect-format.md

Per F-U-02, `.gobbi/projects/gobbi/rules/stub-redirect-format.md` covers ONLY supersession stubs (a file's content has moved). Our placeholders are different: no successor, just an emptied dir with a one-line "this is the seat" marker. **Authoritative template (use this verbatim shape):**

```
# <subdir-name>

<one-line description of the subdir's pre-reset role>. See git tag `pre-reset-2026-05-21` for pre-reset content.
```

For the root `.gobbi/projects/gobbi/README.md` (Q-C):

```
Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.
```

Validation: `find .gobbi/projects/gobbi/ -maxdepth 2 -name README.md -exec wc -l {} \;` → each result ≤ 4 lines.

A follow-up to extend `rules/stub-redirect-format.md` with a "Variant C — placeholder stub after content wipe" is noted in Decisions Log → Deferred follow-ups.

### D5 — `git branch -D` handling

Q-G pre-authorizes `-D` for the 2 non-ancestor branches. The Plan encodes them as explicit `-D` tasks; no AskUserQuestion gate at Execution. Alternative considered (pre-merge them into `develop` via no-op fast-forward) is rejected because they're not actually merge-targets, only history-ancestors of squash-merged tips — git would refuse to fast-forward to an unrelated branch tip.

### D6 — Validation strategy summary

| Decision | Validation method |
|---|---|
| D1 ordering | Plan-encoded gate checks at each stage's exit |
| D2 verification | 21 verification commands at PR ready-for-merge / post-merge (iter3 expanded from iter2's 18) |
| D3 gitignore policy | `git check-ignore` regression test post-edit (both files) |
| D4 stub format | `wc -l` line-count gate + spot-check by manager |
| D5 force-delete | Pre-authorized by Q-G; no runtime gate |
| D7 tag archival | `git rev-parse` + `git ls-remote` checks |
| D9 E.2 gate (iter3 Q-Gate-Redesign) | Two non-circular pre-conditions: `git log` SHA non-empty + `git ls-tree` shows kept session dir |
| D10 CLAUDE.md surgical edit (iter2 H-1) | Pre/post `grep -nE` of the two table-row patterns |
| D11 head-SHA capture/verify (iter3 F-CX-OV-02) | `gh pr view --json headRefOid` pre-merge, `gh pr view --json mergeCommit` + commit-body grep post-merge |

### D7 — Pre-sweep tag (Q-F)

Lightweight tag `pre-reset-2026-05-21` at `487fc35`. Created BEFORE the sweep branch opens so the tag references the pre-reset commit. Pushed to origin so it survives any local clone churn. Recovery via `git checkout pre-reset-2026-05-21` is a one-command operation.

### D8 — CLI-regenerator follow-up risk (Q-E) + post-sweep backlog fate (iter2 H-4)

Editing `.gobbi/.gitignore` is a point-in-time fix; the regenerator that produces this file lives in `packages/cli/` which is being deleted this session. A future rebuilt CLI may regenerate the file with the OLD policy. **Mitigation**: backlog entry staged at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` flags the risk and cites the originating session.

**iter2 H-4**: the post-sweep promotion target `.gobbi/projects/gobbi/backlogs/` is in the PLACEHOLDER set (Q-A). The staged backlog therefore has no project-level promotion target this session. Resolution: the backlog file stays session-scoped under `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ideation/staging/backlogs/project/` (the session dir survives per Q-A). The Wrap-up handoff narrative explicitly references this file so the next session (the rebuild) can find it and update the regen template before shipping the new CLI. No project-`backlogs/` promotion attempted.

### D9 — Bare-UUID session-dir delete sequencing (Q-B + iter3 Q-Gate-Redesign — replaces iter2 H-3's self-referential gate)

The CLI bare-UUID dir `6637e759-...` contains the CLI's live `gobbi.db` + runtime `session.json`. Deleting it mid-workflow could break the CLI's view of state.

**iter3 Q-Gate-Redesign mitigation (concrete, testable, NON-circular):**

The iter2 H-3 gate required the sweep commit's SHA to appear in `session.json`. Codex iter2 (F-CX-OV-01) caught the self-reference: a commit cannot include its own final SHA in a file in its own tree because the SHA is a function of the tree content; mutating the tree (writing the SHA into `session.json`) changes the SHA. As written, a strict executor would stop forever; a loose executor would rationalize an "adjacent" SHA. **iter3 replaces this gate with two non-circular pre-conditions verified by plain `git` plumbing:**

- The bare-UUID delete is split out as Stage E.2 — a TERMINAL post-commit FS-only operation, not part of any commit. (Unchanged from iter2 H-3.)
- The gate has TWO conjunctive pre-conditions, each verifiable by a deterministic `git` command:
  1. **Pre-condition 1 — sweep commit exists on the sweep branch**: `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA. Concrete shell: `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]`.
  2. **Pre-condition 2 — kept session dir is in the committed tree**: `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` lists at least one entry. Concrete shell: `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .`.
- The executor MUST NOT proceed if either pre-condition fails — return NEEDS_CONTEXT with the failing pre-condition's exact `git` output (per `executor-rationalized-failing-verification-gate.md`). This NEEDS_CONTEXT discipline is unchanged from iter2; only the gate's content is replaced.
- The sweep SHA is NEVER written into `session.json` or any other tracked file. Audit traceability relies on `git log --format=%H -1 <sweep-branch>` while the branch is live, and on `git log <merge-sha>` after PR merge. Git is the authoritative log; duplicating into `session.json` adds no value and creates the self-referential paradox.
- After E.2, any further Wrap-up writes land in the preserved date-prefixed dir, not the bare-UUID dir.
- Acceptable risk: the CLI may print "session not found" on its next bootstrap. The session is effectively concluded by E.2; the next bootstrap re-creates fresh state.

### D10 — Surgical CLAUDE.md edit (iter2 H-1)

`.claude/CLAUDE.md` lines 61-62 cite `.gobbi/projects/gobbi/design/{v050-overview,v050-cli}.md`, which are both placeholdered (deleted) in Stage C. Per the user's iter2 directive ("fix citations — don't expand survivor set"), the resolution is to delete those two table rows from CLAUDE.md in the same sweep commit. This is a 2-line edit; no other CLAUDE.md content is touched. The narrative "Navigate deeper from here" table retains the `gobbi skill`, `claude skill`, and `principles` rows — the structural shape of the table is preserved.

Verification: post-edit, `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty. Pre-edit, the same command returns 2 hits (verified at iter2 authoring time, re-verified at iter3 authoring against the system-reminder snapshot of CLAUDE.md which still shows the two table rows at lines 61-62 in the file's current state).

### D11 — Head-SHA capture and post-merge verification (iter3 F-CX-OV-02)

Codex iter2 F-CX-OV-02 (Medium/50) flagged that Stage G's `gh pr merge --squash --delete-branch` did not prove the squashed commit corresponded to the reviewed PR tip. In the solo-user context this risk is low (no other actors are pushing to the sweep branch), but the destructive nature of this sweep elevates the cost of an unverified mismatch. iter3 adds a surgical two-step guard:

- **Capture (immediately before merge)**: `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)`. This returns the PR's current head commit OID. The executor echoes/logs this value so it's visible in the session transcript and the Wrap-up handoff.
- **Verify (immediately after merge)**:
  - Option A (preferred): `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` returns the develop-tip merge-commit SHA; then `git log -1 --format=%B <merge-sha>` (after `git pull origin develop`) contains a reference to `$HEAD_SHA`. GitHub's default squash-merge commit body includes the source commit short-SHAs in a trailer block ("* <short-sha> <commit-subject>"); `grep -F "$HEAD_SHA"` against `--format=%B` matches when the head SHA is present (full or short).
  - Option B (fallback if Option A's grep misses due to short-vs-full SHA): match `${HEAD_SHA:0:7}` (first 7 chars) against the merge commit body, which GitHub's squash trailer always includes.
- **On verification failure**: NEEDS_CONTEXT. The merged commit may not correspond to the reviewed tip (force-push between review and merge, merge-strategy substitution, etc.). The executor reports `HEAD_SHA`, the merge commit SHA, and the body grep output, and waits for the manager.

This is a low-cost, high-signal guard. Implementation effort: 2 shell lines plus 1 conditional. Risk-reduction value: detects any silent tip substitution before the squashed commit is canonicalized as the sweep result. Surgical add only; does not alter any locked decision.

---

## Decisions Log

### Memory reads register (Ideation Sub-step A read paths)

| Path | Purpose | Status |
|---|---|---|
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Stub-redirect format reference; D4 now uses inline template instead (F-U-02) | Read |
| `.gobbi/projects/gobbi/mistakes/session-dir-naming-convention-uses-date-prefix.md` | Confirms date-prefix convention for the surviving session dir (I4); will be deleted by Stage C per H-2 trade-off | Read |
| `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md` | Drives the Stage E.2 NEEDS_CONTEXT discipline (iter2 H-3 and iter3 Q-Gate-Redesign both honor this); will be deleted by Stage C per H-2 trade-off | Read |
| `.gobbi/projects/gobbi/mistakes/manager-mispec-grep-c-for-occurrence-count.md` | `grep -o \| wc -l` preferred for occurrence counts; D2 commands audited; will be deleted by Stage C per H-2 trade-off | Read |
| `.gobbi/projects/gobbi/mistakes/git-workflow.md` | Worktree-PR mode forbids direct develop push | Read |
| `.gobbi/projects/gobbi/mistakes/worktree-vs-main-path-confusion.md` | Worktree path discipline | Read |
| `.gobbi/projects/gobbi/mistakes/cross-session-mistake-bundle.md` | Bundle untracked mistakes into next PR | Read |
| `.gobbi/projects/gobbi/mistakes/session-id-discovery.md` | `$CLAUDE_SESSION_ID` not in Bash env | Read |
| `.gobbi/projects/gobbi/mistakes/gobbi-workflow-cli-from-main-tree.md` | CLI must run from main tree | Read |
| `.gobbi/projects/gobbi/notes/2026-05-21-pr-262-entry-point-sop.md` | Prior session journal | Read |
| `.gitignore` (root), `.gobbi/.gitignore` | Gitignore mechanics (I6) | Read |
| `.claude/CLAUDE.md` (lines 61-62) | iter2 H-1 verification: confirmed two design-link table rows exist; both will be removed | Read (iter2 + re-confirmed iter3) |
| `git worktree list`, `git branch -a`, `git log --oneline -5`, `git status --short` | Git state inventory | Read |
| `ls .gobbi/projects/gobbi/{sessions,*}` walkthrough | Full project-memory directory inventory | Read |
| `find .claude/{skills,agents} -type l` | Confirmed I1 (symlink-tree reality) | Read |
| `git ls-files \| grep .gobbi/projects/gobbi` | Tracked vs untracked content | Read |
| `ls -la .claude/project/gobbi/` | Confirmed I10 (Q-D target) | Read |
| iter1 evaluator files at `<session-dir>/ideation/evaluation/iter1/claude/{project,structure,usage,consistency,risk,overall}.md` | iter2 inputs — 4 High findings + 4 Medium/Low surgical fixes | Read (iter2) |
| iter2 evaluator files at `<session-dir>/ideation/evaluation/iter2/codex/{structure,usage,consistency,risk,overall}.md` | iter3 inputs — F-CX-OV-01 (High) + F-CX-OV-02 (Medium) | Read (iter3) |
| iter2 evaluator files at `<session-dir>/ideation/evaluation/iter2/claude/overall.md` | iter3 input — Preserve list across iter2 → iter3 (9 inherited + 6 new iter2-specific) | Read (iter3) |

### AskUserQuestion outcomes — 18 locked sub-decisions across 5 rounds

**Round 1+2 (pre-leader): Q1–Q8 resolved (unchanged across iters).**

**Round 3 (post-NEEDS_CONTEXT): Q-A through Q-G resolved (unchanged across iters).**

All 15 verbatim in `discussion-log.md`; reproduced as Decisions Locked in Scope Contract.

**Round 4 (post-Claude-iter1-REVISE): Q-Survivor + Q-StageE resolved (unchanged from iter2):**

1. **Q-Survivor** — User answer: **don't expand survivor set; fix the citations instead.**
   - Q-A stays as originally locked: survivor content is `agents/` + `skills/` + `rules/` only.
   - iter2 H-1 adds a Stage B step editing `.claude/CLAUDE.md` to remove lines 61-62.
   - **Trade-off accepted (H-2)**: the 3 promoted mistake files in `.gobbi/projects/gobbi/mistakes/` WILL BE DELETED by Stage C. The lessons are encoded in this draft (Stage E.2's NEEDS_CONTEXT clause from `executor-rationalized-failing-verification-gate.md`; D2 #16 `$`-anchored `grep -c` audit from `manager-mispec-grep-c-for-occurrence-count.md`; M-3 explicit naming from `session-dir-naming-convention-uses-date-prefix.md`).
   - **Backlog fate (H-4)**: staged backlog at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` stays session-scoped under the preserved session dir.

2. **Q-StageE** — User answer: **split Stage E into E.1 (in-commit) and E.2 (post-commit terminal).**
   - Split structure preserved across iter2 → iter3; only the E.2 gate semantics changed in iter3 (see Round 5 below).

**Round 5 (post-Codex-iter2-REVISE): Q-Gate-Redesign resolved (NEW iter3 lock):**

3. **Q-Gate-Redesign** — Codex iter2 (F-CX-OV-01, High/100) caught a critical design flaw: the iter2 H-3 SHA gate was self-referential. The gate required the sweep commit's SHA to appear in `session.json`, but `session.json` lives inside the kept session dir which is `git add`-ed into that same commit. A commit cannot contain its own SHA in a file in its own tree — the SHA is a function of the tree content; mutating the tree changes the SHA.
   - **User's chosen remediation (Recommended option, locked)**: **drop the SHA-in-session.json requirement entirely**. New Stage E.2 gate has two pre-conditions:
     - Pre-condition 1: `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA.
     - Pre-condition 2: `git ls-tree <sweep-branch> <kept-session-dir>/` lists at least one entry.
     - On either failure: NEEDS_CONTEXT (no rationalization).
   - **The sweep SHA is NOT written into any tracked file.** Audit traceability uses `git log` directly — git is the authoritative log; duplicating into a tracked file adds no value and creates the self-referential paradox.
   - **Disposition cite**: iter2 codex `overall.md` § F-CX-OV-01 + § Aggregate Verdict (REVISE driven by this finding alone).
   - **F-CX-OV-02 (Medium/50, also from iter2 codex `overall.md`)** — surgical add. User implicitly approved including it (per the iter3 brief). Stage G inserts `HEAD_SHA` capture before `gh pr merge` and post-merge verification that the squashed commit's body / `mergeCommit.oid` references `HEAD_SHA`. On verification failure: NEEDS_CONTEXT. See D11 for full mechanism.

**Cross-decision mitigation notes:**

- Q-B + iter3 Q-Gate-Redesign: the CLI's live bare-UUID session dir is deleted in this sweep. The gate is now non-circular (uses `git log` + `git ls-tree`, no SHA-in-file). Acceptable downside: the CLI may report "session not found" on next bootstrap — non-fatal, self-resolves.
- iter3 F-CX-OV-02 vs iter2 F-OV-02 disambiguation: same naming root ("F-OV-02") in two different iters, two different evaluators. iter1 F-OV-02 (Claude) was about orthogonal-edits per Karpathy (disputed by Q3 lock, unchanged). iter2 F-CX-OV-02 (Codex) is about merge-head stability (addressed by iter3's Stage G capture+verify). No conflict — the prefix `F-CX-` differentiates the iter2 Codex findings from iter1 Claude's same-numbered findings.

### External research skip reason

External research is skipped. The cleanup is an internal-codebase operation; no library APIs, framework choices, or third-party patterns are in play. Git mechanics (worktree, gitignore, branch -d/-D, lightweight tag, `gh pr view --json headRefOid`, `gh pr view --json mergeCommit`) are anchored to `.claude/skills/git/SKILL.md` + GitHub CLI's stable JSON-field outputs (internal-reference equivalent). Per Ideation skill's Constraints, the skip reason is logged here. No `references/` files staged.

### Backlog staging

One backlog file staged at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` — captures Q-E's follow-up risk (the CLI may regenerate `.gobbi/.gitignore` with the pre-reset policy at next bootstrap; the regen source is being deleted with `packages/`).

**iter2 H-4**: this staged backlog will NOT be promoted to project `backlogs/` post-sweep (target is in PLACEHOLDER per Q-A). It stays session-scoped under the preserved session dir and the Wrap-up handoff narrative references it. The next session's first read can locate it via the date-prefixed session-dir path.

`staging/backlogs/feature/` remains empty (the rebuild itself is the next session's explicit work, not a backlog item).

### Mistakes consulted (per `mistake` skill P1)

See Memory reads register. Three project-level mistakes were directly load-bearing across iter2+iter3:

- `session-dir-naming-convention-uses-date-prefix` — I4 + Q8/Q-B interaction + M-3 explicit naming.
- `executor-rationalized-failing-verification-gate` — H-3 NEEDS_CONTEXT discipline (iter2) + Q-Gate-Redesign's preservation of the NEEDS_CONTEXT clause when the gate itself was rewritten (iter3). The iter3 gate is non-circular by design; the discipline floor still applies — a strict executor MUST NOT rationalize a failing pre-condition.
- `manager-mispec-grep-c-for-occurrence-count` — D2 #16 (`$`-anchored `grep -c` documented as safe for line counts; occurrence-count cases call for `grep -o … | wc -l`).

Per iter2 H-2, all three files are deleted by Stage C — their lessons are encoded in this draft and survive that deletion.

### Preserve list (iter1 + iter2 evaluator must-preserves — confirmed retained in iter3)

**From iter1 Claude evaluator `overall.md` § "Preserve list (must not be broken by REVISE)" (9 items — confirmed retained at iter2 + re-confirmed at iter3):**

1. Q-F pre-reset tag + push to origin BEFORE sweep — preserved (Stage 0).
2. Branch ancestry verification (I2) matches `git merge-base --is-ancestor` exactly — preserved; per-branch `-d` vs `-D` flag intact (Stage F).
3. Q-B mitigation: bare-UUID delete is LAST — preserved AND tightened twice: iter2 H-3 added a (defective, self-referential) SHA gate; iter3 Q-Gate-Redesign replaces the gate with a non-circular `git log` + `git ls-tree` gate while keeping the terminal-post-commit structure intact (Stage E.2).
4. The 5 critical-ordering invariants — preserved (now 7 invariants in the summary block per iter3); language refined per F-S-01 (iter2) and Q-Gate-Redesign (iter3).
5. Memory reads register and Decisions Log traceability — preserved + extended for iter2 + iter3 reads.
6. Mixed `git rm` vs `rm -rf` discipline per item — preserved; inline commit-vs-FS labeling added (iter2).
7. Out-of-Scope enumeration — preserved; iter2 H-1 narrow CLAUDE.md exception noted; iter3 adds "writing sweep SHA into any tracked file" to Out-of-Scope.
8. 15 locked decisions enumerated in two tables (top + bottom) — preserved (now 18 locks at iter3 — 15 + 2 iter2 + 1 iter3).
9. External research skip reason — preserved.

**From iter2 Claude evaluator `overall.md` § "iter2-specific must-preserves (NEW; iter3 must not break)" (6 items — confirmed retained at iter3):**

10. The iter2 "deltas at a glance" block — preserved at iter3 (now expanded with the 2 iter3 deltas at the top, inherited 8 below; structure intact).
11. Stage E.1 / E.2 split — preserved at iter3. The two-condition gate is REPLACED with a non-circular two-condition gate (the structure of "two conjunctive pre-conditions + NEEDS_CONTEXT on failure" survives; only the condition contents change).
12. iter2 H-1 surgical 2-line CLAUDE.md excision — preserved at iter3 verbatim (Stage B line 253-254, D10, Success #12, D2 #17).
13. iter2 H-4 session-scoping of the backlog file — preserved at iter3 (D8 + Deferred + Decisions Log Round 4 all coherent).
14. D4 inline stub template — preserved at iter3 verbatim.
15. The three-lesson encoding map (M-3, NEEDS_CONTEXT clause in E.2 gate, D2 grep-c audit) — preserved at iter3. The NEEDS_CONTEXT clause is unchanged in spirit even though the gate condition contents are rewritten by Q-Gate-Redesign.

### Deferred follow-ups (not in iter3 scope)

- Extend `.gobbi/projects/gobbi/rules/stub-redirect-format.md` with a "Variant C — placeholder stub after content wipe" (F-U-02). The rule file itself is in the survivor set (`rules/` is KEEP CONTENT under Q-A), so this can be a follow-on edit in a later session.
- Backlog `cli-regenerates-gobbi-gitignore.md` remains session-scoped per H-4; the rebuild session must read it from the preserved session dir.
- iter2 Claude-evaluator optional deltas (F-S-05 / F-U-03 / F-P-04 / F-A-04 — all ≤ Medium/50, none load-bearing): not addressed at iter3 because they are below the High≥50 threshold and the iter3 brief is a surgical remediation of F-CX-OV-01 + F-CX-OV-02. Documented here for any future iter.

### Open questions

None remaining. All 18 sub-decisions are locked across 5 rounds; one backlog entry remains as a deferred follow-up (the CLI regenerator fix, scoped to the next session).

### WORK exit checklist (Ideation skill)

- [x] Root problem named (cumulative drift; concrete pre-rebuild reset).
- [x] Approach concrete enough to decompose (18 locked sub-decisions; ordered stages 0/A–G with E.1/E.2 split; iter3 gate is non-circular and deterministic).
- [x] Constraints and trade-offs explicit (`-d` vs `-D`, gitignore ordering, bare-UUID non-circular gate, regenerator follow-up risk, mistake-file deletion trade-off, backlog session-scoping, head-SHA capture cost-vs-value).
- [x] Success measurable (21 verification commands in D2; 14 Scope-Contract success criteria).
- [x] Open questions: none. All iter2 Codex evaluator findings (F-CX-OV-01 High + F-CX-OV-02 Medium) addressed.
- [x] Backlog stage covers all deferrals (1 backlog file for the CLI regenerator; explicitly session-scoped per H-4).
- [x] Memory reads register captures every load-bearing read (including iter3's iter2-codex + iter2-claude evaluator-file reads).
- [x] External research skip reason logged.
- [x] Steel-man checked and addressed (Q-F tag satisfies it).
- [x] Three mistakes (date-prefix, verification-honesty, grep-c) explicitly applied — even though the files themselves will be deleted per H-2, the lessons are encoded in the iter3 draft (M-3 explicit `c676684d-` naming, Stage E.2's NEEDS_CONTEXT clause carrying the executor-rationalized-failing-gate discipline through the iter2→iter3 gate rewrite, D2 #16 `$`-anchored `grep -c` audit).
- [x] iter1 evaluator's must-preserve list (9 items) confirmed retained at iter3.
- [x] iter2 evaluator's must-preserve list (6 items, items 10–15) confirmed retained at iter3.
- [x] All 4 iter1 High findings + 4 iter2 Med/Low surgical fixes addressed (carried verbatim from iter2).
- [x] All 2 iter2 Codex findings addressed: F-CX-OV-01 (Q-Gate-Redesign user-locked → Stage E.2 non-circular gate + D9 rewrite + D2 #15 rewrite + S6 update + Success Criterion #13 add), F-CX-OV-02 (Stage G `HEAD_SHA` capture + post-merge verify + D11 + D2 #20/#21 add + S6b add + Success Criterion #14 add + Critical Invariant #7 add).
- [x] iter3 gate is non-rationalizable: both pre-conditions are deterministic git commands with binary pass/fail outcomes; failure path is NEEDS_CONTEXT, not "best-effort match an adjacent SHA."
- [x] Audit-trail discipline: iter1 + iter2 draft files untouched; iter3 written as a NEW file at the contracted path.
