---
name: env-var-audit-and-sessionstart-hook-plan
description: Decomposes the locked Ideation iter3 + Preparation iter2 design into 7 ordered Execution tasks (T1-T7) on branch `feat/env-var-audit-sessionstart-hook` off `develop`, plus 2 manager-direct integration actions (M0 worktree create; M2 push/PR/merge/cleanup) and 1 post-merge manager-direct stamping action (M1). Single worktree, single squash-merge PR.
phase: planning
iter: 3
iter2_revised_at: 2026-05-22
iter3_revised_at: 2026-05-22
verdict: pass
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: planning
artifact_type: plan
feature: env-var-audit
created: 2026-05-22
related:
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/preparation/artifacts/preparation.md
---

# Plan — Env-Var Audit + SessionStart Hook (iter3)

## Iter2 Changelog

Six surgical revisions applied in response to iter1 dual-system EVAL (Claude PASS w/ 5 worktree-doc Mediums; Codex REVISE w/ 5 role-boundary Highs). Aggregate verdict REVISE. User-accepted fixes:

- **FIX I — Add M0 (manager-direct, pre-T1):** explicit worktree-create action per `git/SKILL.md` Procedure P2 (sync base, re-verify remote, `git worktree add`, pass absolute worktree path to every executor delegation). Closes "T1 never says who created the worktree" gap.
- **FIX II — Split T7 + add M2 (manager-direct integration):** T7 reduces to executor-only verification + final consolidating commit; push / PR create / CI watch / squash-merge / post-merge sync / worktree cleanup move into new M2 per `git/SKILL.md` Procedures P4 + P5 + P7. Closes Codex P6/P7/P1 Highs (subagent never pushes / creates PRs).
- **FIX III — Re-order M1 to AFTER M2 squash-merge:** session.json transcriptPath stamping happens post-merge from the main-tree develop, not pre-merge. New action ordering: M0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → M2 → M1.
- **FIX IV — Per-task commit grammar with `AI-Provenance-Record` trailer:** every executor task T1-T7 (and M1 / M2 commit actions) carries an explicit "Commit message" block citing `git/conventions.md` (Type + ≤72-char subject + optional body + canonical `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}` trailer). NEVER `Co-Authored-By:` (per `git/SKILL.md § AI provenance` and conventions.md:120). Trailer slug uses canonical `gobbi://session/.../task/T<n>` form per conventions.md:118.
- **FIX V — Expand T7 verification block (no placeholders, no "same fixture" deferrals):** every `<worktree-path>` placeholder replaced with the absolute path `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` (or `${WORKTREE_PATH}` env var the manager sets at M0). Full T7 sweep now inline (rg sweeps, hook executable check, two-step jq verification, P7 reword cite count, FIX C round-trip fixture written out, transcriptPath docstring grep).
- **FIX VI — M2 pre-conditions include `gh auth status` re-verify (per Prep δ):** Codex iter1's `gh` may have been sandboxed without auth; the manager re-verifies authentication at point of use before push / PR create. No conflict with FIX γ (session-write-path discipline) — auth check and main-tree write path target different concerns.

Final action ordering (after iter2): **M0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → M2 → M1** (10 actions: 1 + 7 + 1 + 1).

---

## Iter3 Changelog

Five surgical mechanical edits applied in response to iter2 dual-system EVAL (Claude PASS-with-findings; Codex REVISE). Both systems converged on the same grammar/template/placeholder cluster. User-accepted fixes (this is the final iter, max=3):

- **FIX α — Commit subject length ≤ 72 chars (conventions.md § Commit Messages):** T4 (86 chars) shortened to `refactor: use CLAUDE_CODE_SESSION_ID in 11 skill path-conventions` (65 chars). T5 (78 chars) shortened to `feat(orchestration): add transcriptPath field + manager-stamp docs` (66 chars). T6 (98 chars) shortened to `docs(skills): cite session.json.transcriptPath in 6 path-conventions` (68 chars). T1/T2/T3/M1 already ≤ 72.
- **FIX β — M2 PR title ≤ 72 chars:** 99 chars shortened to `feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID)` (64 chars). The full scope (add CCSI + hook) is in the PR body's Summary section, not the title.
- **FIX γ — Replace 5 `<main-tree root>` placeholders with concrete absolute path:** all 5 occurrences in M2 + M1 (lines 471, 483, 497, 512, 535 of iter2 plan) now read `/playinganalytics/git/gobbi` (the main-tree absolute path, verified by `pwd` at session start). Picks the concrete-path approach over a `${MAIN_TREE_ROOT}` env var for robustness.
- **FIX δ — Rewrite M2 PR body per conventions.md PR template:** M2's PR body now follows the four-section template — **Summary** (with witness cite: `NO_HOOKS_BLOCK` on 2026-05-22), **Linked issues** (`N/A` — session-tracked), **Changes** (file-or-area-grouped, T1-T6 mapped), **Test plan** (8 reviewer-runnable checkbox items + the hook-fires-next-session caveat). The `AI-Provenance-Record` trailer convention is referenced as a note after the Test plan.
- **FIX ε — Add explicit P5 pre-remove gate to M2 cleanup:** before any `git worktree remove`, the manager confirms (a) `git status --short` empty AND (b) `git branch --contains HEAD develop` shows `develop` (merged into base) per `git/SKILL.md` Procedure P5 step 3. Never uses `--force`. Both the narrative `How` block and the verification command block carry the gate; the M2 step list extends from 7 to 8 ordered steps.

No tasks added or removed. No new design content. The iter1 + iter2 baselines hold — 10 actions, single worktree, single squash-merge PR, manager-direct M0/M2/M1, executor T1-T7.

### Post-iter3-EVAL manager polish (2026-05-22, user-authorized)

After iter3 dual-system EVAL diverged (Claude PASS-with-findings; Codex REVISE on bash-command PR-body placeholder + Claude Low on PR-section-order), the user authorized a manager-direct surgical fix to close cleanly without exceeding the iter budget. Two edits applied:

- **Inline M2 PR body via HEREDOC** in the verification command block. The `--body "<conventions-compliant body per How step 2>"` placeholder is replaced with `--body "$(cat <<'PRBODY' ... PRBODY)"` containing the full four-section body literal. The bash command is now literally executable without prose-reading.
- **Reorder PR body sections** to match `conventions.md` § Pull Request Format → Body — required template: **Summary → Changes → Test plan → Linked issues**. The prose How step 2 description was reordered too; an explicit "Stamp the template; do not improvise structure" citation was added.

Effective Planning Loop verdict: PASS-equivalent. Iter3 changelog meta-description carries the historical record of the iter2 REVISE → iter3 fixes → iter3 EVAL divergence → manager polish chain.

---

## Plan Summary

This plan decomposes the locked iter3 Ideation design and iter2 Preparation handoff into **7 ordered Execution tasks (T1-T7)** plus **3 manager-direct actions (M0, M2, M1)**. M0 creates the worktree before T1 dispatch; M2 pushes / opens PR / watches CI / squash-merges / syncs / cleans up after T7; M1 stamps this session's own `session.json.transcriptPath` on the main-tree `develop` after M2 merges. All Execution tasks run sequentially in a **single worktree** under `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` on a fresh branch `feat/env-var-audit-sessionstart-hook` cut from `develop`. Commits land per task (bisect-safe), each carrying an `AI-Provenance-Record` trailer per `git/conventions.md`. Decision groups P1–P7 + FIX A/B/C are user-locked from Ideation iter3 — Planning does not re-open them. Manager-side stamping (M1) is in-scope this session via the updated `orchestration/SKILL.md` Step 1 row 6 procedure; CLI automation of the same stamping remains deferred.

---

## Task Decomposition

Three manager-direct integration actions (M0, M2, M1) bracket seven ordered executor tasks. Each executor task is small enough to verify atomically and to land as one focused commit per `git/conventions.md`. File scopes are disjoint where possible; where two tasks edit the same file (T3 edits `gobbi/SKILL.md` lines 51/55/56/66 + table insertions + new sub-section; T4 does not re-touch `gobbi/SKILL.md`), the boundary is enforced by explicit per-task in-scope/out-of-scope file lists.

The manager creates the worktree at M0 and passes the absolute worktree path as `WORKTREE_PATH=.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` in every executor delegation prompt. The executor's first action on each task is to `cd "$WORKTREE_PATH"` per `git/SKILL.md` Procedure P3.

---

### M0 — (Manager-direct, pre-Execution) Create worktree + sync base + cut branch

- **What:** a new git worktree at `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` with a fresh branch `feat/env-var-audit-sessionstart-hook` cut from an up-to-date `develop`. The absolute worktree path is captured into `WORKTREE_PATH` for every subsequent executor delegation prompt.
- **Why:** `git/SKILL.md` Procedure P2 — the manager owns worktree creation; subagents never create worktrees, never push, never create PRs (`git/SKILL.md:11, 27-29, 47, 95-99, 122`). Branch grammar `feat/env-var-audit-sessionstart-hook` already validated against `conventions.md` § Branch Naming during Preparation iter2 (disposition α).
- **How (procedural; NOT an executor task):**
  1. `git checkout develop && git pull --ff-only` — sync local develop with origin.
  2. `git ls-remote --heads origin develop` — re-verify base branch exists on remote (P2 re-verification principle, `git/SKILL.md:86`).
  3. `git check-ignore -q .gobbi/projects/gobbi/worktrees/` — confirm worktree directory is gitignored (P1 invariant, `git/SKILL.md:82-84`).
  4. `git worktree add -b feat/env-var-audit-sessionstart-hook .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook develop`.
  5. `cd .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` — verify the new worktree is on the new branch and tracks `develop`.
  6. **Dependencies install:** this project's runtime work touches no Bun/Node deps in-scope for this Plan (the hook is shell + jq; settings.json is plain JSON; the remaining edits are markdown). If a `bun install` baseline is required for tests run by an executor, the manager runs it once at M0 before delegating T1.
  7. Set `WORKTREE_PATH=.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook` and pass this absolute path verbatim in every executor delegation prompt for T1-T7.
- **Files in-scope:** none modified directly; M0 creates the worktree directory and the branch ref.
- **Files out-of-scope:** every workspace file — M0 is structural setup, not editing.
- **Agent assignment:** `manager-direct` (NOT delegated — `git/SKILL.md:47, 95` reserve worktree creation to the manager).
- **Skills referenced:** `git` (Procedures P1, P2).
- **Dependencies:** none.
- **Success criteria:**
  - `git worktree list` shows the new worktree at the expected path on the new branch.
  - `git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook rev-parse --abbrev-ref HEAD` returns `feat/env-var-audit-sessionstart-hook`.
  - `git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook status --porcelain` is empty (clean worktree at creation).
  - The manager has captured `WORKTREE_PATH` and includes it in every T1-T7 delegation prompt.
- **Verification commands:**
  ```
  git worktree list | grep -F 'feat/env-var-audit-sessionstart-hook'
  git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook rev-parse --abbrev-ref HEAD
  git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook status --porcelain
  ```

---

### T1 — Author `.claude/hooks/session-start.sh` (bash + jq + `@sh`)

- **What:** a new executable file at `.claude/hooks/session-start.sh` (shebang `#!/usr/bin/env bash`) that reads stdin JSON, emits `export VAR=value` lines for the 7 hook-only vars + `CLAUDE_HOOK_SOURCE` + the 3 passthroughs (if already in env) to `$CLAUDE_ENV_FILE`, using `jq -r @sh` for POSIX-shell-safe quoting on every emitted line. Exit non-zero with stderr message if `$CLAUDE_ENV_FILE` is unset or unwritable.
- **Why:** Idea § How → Hook contract (P2 + P3) + FIX 1 (drop `CLAUDE_SESSION_ID` export) + FIX 5 (`CLAUDE_HOOK_SOURCE` from stdin `source`) + FIX C (shell-safe serialization). Witness: `cat .claude/settings.json | jq '.hooks // "NO_HOOKS_BLOCK"'` returned `"NO_HOOKS_BLOCK"` on 2026-05-22 — the hook the docs promise does not exist.
- **How:**
  1. `cd "${WORKTREE_PATH}"` (absolute: `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook`) — set by the manager at M0.
  2. `mkdir -p .claude/hooks/` (verify dir does not yet exist; if it exists, that is also fine — `mkdir -p` is idempotent).
  3. Write the script body per the canonical pattern in Idea § Hook contract (one `jq -r '@sh "export VAR=\(.field)"'` line per stdin field, conditional emission for the 3 optional fields, conditional re-export for the 3 passthroughs).
  4. `chmod +x .claude/hooks/session-start.sh`.
  5. Local smoke-test with a fixture: pipe a JSON payload through the script with `CLAUDE_ENV_FILE=$(mktemp)`, then `source "$CLAUDE_ENV_FILE"` and `printf '%s\n' "$CLAUDE_TRANSCRIPT_PATH"` to confirm round-trip on a value containing spaces and a single quote (e.g., `/tmp/foo bar's baz.jsonl`).
- **Files in-scope:**
  - `.claude/hooks/session-start.sh` (NEW)
- **Files out-of-scope:** everything else — including `.claude/settings.json` (T2), all skill docs (T3-T6), `session.template.json` (T5).
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`
- **Dependencies:** M0 (worktree + branch must exist).
- **Success criteria:**
  - File exists at `.claude/hooks/session-start.sh` with mode `0755` (or any owner-executable mode).
  - First line is `#!/usr/bin/env bash`.
  - Contains at least one `jq -r '@sh ...'` invocation.
  - Does NOT contain the string `CLAUDE_SESSION_ID` outside a comment that explains the historical name (`CLAUDE_CODE_SESSION_ID` is the exported variable).
  - Fixture round-trip with `/tmp/foo bar's baz.jsonl` succeeds byte-for-byte.
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  test -x .claude/hooks/session-start.sh
  head -1 .claude/hooks/session-start.sh | grep -F '#!/usr/bin/env bash'
  grep -F "jq -r" .claude/hooks/session-start.sh | grep -F "@sh"
  ! grep -E '^[[:space:]]*export[[:space:]]+CLAUDE_SESSION_ID=' .claude/hooks/session-start.sh
  # Fixture round-trip:
  ENV_FIXTURE=$(mktemp)
  printf '%s' '{"session_id":"abc","transcript_path":"/tmp/foo bar'\''s baz.jsonl","cwd":"/tmp","hook_event_name":"SessionStart","source":"startup"}' \
    | CLAUDE_ENV_FILE="$ENV_FIXTURE" bash .claude/hooks/session-start.sh
  ( source "$ENV_FIXTURE" && [ "$CLAUDE_TRANSCRIPT_PATH" = "/tmp/foo bar's baz.jsonl" ] ) && echo OK_ROUND_TRIP
  rm -f "$ENV_FIXTURE"
  ```
- **Commit message** (per `git/conventions.md` § Commit Messages + § Commit Trailers):
  ```
  feat: add SessionStart hook with shell-safe jq @sh quoting

  Installs .claude/hooks/session-start.sh implementing Idea P2/P3 + FIX 1/5/C:
  emits CLAUDE_CODE_SESSION_ID, the 4 hook payload vars, CLAUDE_HOOK_SOURCE,
  and 3 optional passthroughs via `jq -r @sh` for POSIX-safe quoting.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T1
  ```

---

### T2 — Register the hook in `.claude/settings.json`

- **What:** an added `hooks.SessionStart` array entry in `.claude/settings.json` registering `.claude/hooks/session-start.sh` with a matcher covering `startup|resume|clear|compact`.
- **Why:** Idea § How → Hook contract — the script alone is inert; Claude Code only fires it if the settings block exists. Witness: same `NO_HOOKS_BLOCK` finding above. Convention precedent: PR #229 (`feat/229-sessionstart-clear-matcher` from session 2026-04-29) established `"startup|resume|clear|compact"` as the canonical matcher.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Read `.claude/settings.json`; preserve `enabledPlugins` and `permissions` keys verbatim.
  3. Insert a top-level `hooks` key (object) containing a `SessionStart` array with a single entry: `{ "matcher": "startup|resume|clear|compact", "hooks": [{ "type": "command", "command": ".claude/hooks/session-start.sh" }] }` — confirm exact shape against Claude Code hook docs before writing.
  4. Validate via `jq` round-trip; preserve 2-space indent.
- **Files in-scope:**
  - `.claude/settings.json`
- **Files out-of-scope:** `.claude/settings.local.json`, `.claude/CLAUDE.md`, the hook script itself (T1), any skill docs.
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`
- **Dependencies:** T1 (the script must exist before the registration points at it; without T1 the registration is a dangling reference).
- **Success criteria:**
  - `.claude/settings.json` parses as valid JSON.
  - `.hooks.SessionStart` is a non-null array of length ≥ 1.
  - The first array entry has `matcher == "startup|resume|clear|compact"` and a command whose value contains `.claude/hooks/session-start.sh`.
  - Existing `enabledPlugins` + `permissions` keys are byte-identical to pre-edit state.
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  jq -e '.' .claude/settings.json >/dev/null
  jq -e '.hooks.SessionStart | type == "array" and length >= 1' .claude/settings.json
  jq -e '.hooks.SessionStart[0].matcher == "startup|resume|clear|compact"' .claude/settings.json
  jq -e '[.hooks.SessionStart[0].hooks[].command] | any(test("\\.claude/hooks/session-start\\.sh"))' .claude/settings.json
  ```
- **Commit message:**
  ```
  feat: register SessionStart hook in .claude/settings.json

  Adds hooks.SessionStart entry with matcher startup|resume|clear|compact
  (precedent: PR #229) pointing at .claude/hooks/session-start.sh from T1.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T2
  ```

---

### T3 — Rewrite `gobbi/SKILL.md § Session env vars arrive automatically` (P4 + P5 single editing pass)

- **What:** an updated `§ Session env vars arrive automatically` section in `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` containing: (a) line 51-area paragraph citing the actual `.claude/hooks/session-start.sh` script + `.claude/settings.json hooks.SessionStart` registration; (b) line 55 table row renamed `CLAUDE_SESSION_ID → CLAUDE_CODE_SESSION_ID`; (c) line 56 table row UNCHANGED on var name (`CLAUDE_TRANSCRIPT_PATH` stays — FIX 2 hard constraint) but description column may mention the new `session.json.transcriptPath` mirror; (d) NEW table row for `CLAUDE_HOOK_SOURCE` (stdin `source`, distinct from `CLAUDE_HOOK_EVENT_NAME`); (e) line 66 warning rewritten to document the two-gate health model (Gate 1 = CCSI presence; Gate 2 = `$CLAUDE_TRANSCRIPT_PATH` non-empty AND its target file exists); (f) NEW "Runtime-set env vars" sub-section listing the 4 runtime-set vars + the docs-vs-empirical discrepancy for `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA`, citing Claude Code v2.1.132 (official changelog) for CCSI's introduction.
- **Why:** Idea § Decisions Log P4 + P5; FIXes 2 / 4 / 5 / 6; criterion 6 of the Ideation success criteria. Witness: lines 51 / 55 / 56 / 66 verified at scan in Preparation iter2 § Verified resources row 1.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Re-grep `CLAUDE_SESSION_ID` and `CLAUDE_TRANSCRIPT_PATH` in `gobbi/SKILL.md` first to confirm current line offsets before editing (defensive against drift).
  3. Use `Edit` (per-section anchored replacements), NOT `Write` — preserves the rest of the file untouched.
  4. Apply the six sub-edits (a)–(f) in order; verify each by reading the file after each edit.
  5. Confirm line 56's var name text `CLAUDE_TRANSCRIPT_PATH` is byte-identical to pre-edit state (only the surrounding description column may change).
- **Files in-scope:**
  - `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- **Files out-of-scope:** all other skill files (T4, T5, T6).
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`, `claude`
- **Dependencies:** T1, T2 (both must exist so the paragraph can honestly cite the installed hook + settings registration without lying — Principle 7 / 8).
- **Success criteria:**
  - File parses (markdown — visual spot-check, no parser).
  - Zero occurrences of `CLAUDE_SESSION_ID` in this file post-edit.
  - At least one occurrence of `CLAUDE_CODE_SESSION_ID` in the env-var table.
  - `CLAUDE_TRANSCRIPT_PATH` still present at the line-56 row (var name preserved per FIX 2).
  - A new `CLAUDE_HOOK_SOURCE` table row exists.
  - The warning paragraph mentions BOTH gates (CCSI gate AND transcript-path gate).
  - A new sub-section heading exists for "Runtime-set env vars" listing `CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE`, `CLAUDE_CODE_REMOTE` and the discrepancy note.
  - The string `v2.1.132` appears at least once (CCSI introduction version per official changelog).
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  ! rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  rg -n 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  rg -n 'CLAUDE_TRANSCRIPT_PATH' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  rg -n 'CLAUDE_HOOK_SOURCE' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  rg -n 'Runtime-set env vars' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  rg -nF 'v2.1.132' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
  ```
- **Commit message:**
  ```
  docs(skills): rewrite gobbi/SKILL.md env-vars section (P4 + P5)

  Renames CLAUDE_SESSION_ID -> CLAUDE_CODE_SESSION_ID at the entry-point doc,
  preserves CLAUDE_TRANSCRIPT_PATH (FIX 2), adds CLAUDE_HOOK_SOURCE row, rewrites
  the two-gate health warning, and adds Runtime-set env vars sub-section citing
  Claude Code v2.1.132.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T3
  ```

---

### T4 — Bulk rename `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` in the 11 remaining skill files (P1 rows 3-13)

- **What:** 11 skill files edited so every reference to `$CLAUDE_SESSION_ID` (or unprefixed `CLAUDE_SESSION_ID` in path-conventions prose) becomes `$CLAUDE_CODE_SESSION_ID` (or `CLAUDE_CODE_SESSION_ID`). Old name removed entirely — no dual-name fallback.
- **Why:** Idea § Decisions Log P1 + FIX 1; criterion 1/2 of the Ideation success criteria; witness 12-file × 13-occurrence inventory in Idea § File inventory.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Re-grep `CLAUDE_SESSION_ID` across `.gobbi/projects/gobbi/skills/` first; expected hit count = 11 (T3 already removed the 2 in `gobbi/SKILL.md`). If count diverges, halt and surface to manager (line-drift since Preparation scan).
  3. Per file (11 files in inventory order), apply `Edit` with `replace_all=true` on the local context substring to rename in-place. The 11 files each carry the same path-conventions sentence pattern, so a single replacement per file is sufficient.
  4. After each file, re-read the edited line and confirm new name is present + old name absent.
- **Files in-scope (11 files):**
  - `.gobbi/projects/gobbi/skills/mistake/SKILL.md` (line 129)
  - `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` (line 325)
  - `.gobbi/projects/gobbi/skills/research/SKILL.md` (line 145)
  - `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` (line 292)
  - `.gobbi/projects/gobbi/skills/planning/SKILL.md` (line 462)
  - `.gobbi/projects/gobbi/skills/execution/SKILL.md` (line 255)
  - `.gobbi/projects/gobbi/skills/ideation/SKILL.md` (line 465)
  - `.gobbi/projects/gobbi/skills/memorization/SKILL.md` (line 227)
  - `.gobbi/projects/gobbi/skills/interview/SKILL.md` (line 324)
  - `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` (line 563)
  - `.gobbi/projects/gobbi/skills/preparation/SKILL.md` (line 375)
- **Files out-of-scope:** `gobbi/SKILL.md` (already done in T3); all P7 transcript-path-cite files (T6); `orchestration/SKILL.md` + `session.template.json` (T5).
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`
- **Dependencies:** T3 (so `gobbi/SKILL.md` and the rest land together as a coherent rename pass; ordering also makes the final `rg` sweep in T7 unambiguous).
- **Success criteria:**
  - Each of the 11 files has zero remaining `CLAUDE_SESSION_ID` occurrences post-edit.
  - Each of the 11 files has at least one `CLAUDE_CODE_SESSION_ID` occurrence at the previously-cited anchor area.
  - File-level repo-wide sweep returns empty (verified in T7).
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  for f in mistake/SKILL.md wrap-up/SKILL.md research/SKILL.md orchestration/workflow/evaluation.md \
           planning/SKILL.md execution/SKILL.md ideation/SKILL.md memorization/SKILL.md \
           interview/SKILL.md evaluation/SKILL.md preparation/SKILL.md; do
    p=".gobbi/projects/gobbi/skills/$f"
    if rg -q 'CLAUDE_SESSION_ID' "$p"; then echo "FAIL_OLD_NAME: $p"; exit 1; fi
    rg -q 'CLAUDE_CODE_SESSION_ID' "$p" || { echo "FAIL_NEW_NAME: $p"; exit 1; }
  done
  echo OK_T4
  ```
- **Commit message:**
  ```
  refactor: use CLAUDE_CODE_SESSION_ID in 11 skill path-conventions

  Eleven path-conventions sentences updated to the canonical runtime-set var
  name. No dual-name fallback. Matches Claude Code v2.1.132 official env.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T4
  ```

---

### T5 — Add `transcriptPath` to `session.template.json` + update `orchestration/SKILL.md` (Step 1 row 6 + § Session metadata top-level-fields list)

- **What:** (a) `transcriptPath: null` added at top level of `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` in canonical serialization order; (b) `orchestration/SKILL.md` Step 1 row 6 procedure text (line 103-area) updated to describe the manager-agent stamp — read `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the hook), perform tilde-substitution against `$HOME`, write tilde-form path into `session.json.transcriptPath` — explicitly distinguishing this manager-agent mechanism (in-scope) from CLI automation (deferred) per FIX A; (c) `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list around line 371 updated to include `transcriptPath` per FIX 7.
- **Why:** Idea § Decisions Log P6; FIXes 3 / 7 / 8 / A / B; criteria 4 / 7 of the Ideation success criteria. Witness: Preparation iter2 § Verified resources row 13 confirms `orchestration/SKILL.md:103` row 6 + `:371` top-level-fields list; § Verified resources schema target row confirms `session.template.json` parses and lacks `transcriptPath`.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Read `session.template.json`; identify the canonical field ordering (manager owns the order — typically alphabetical or per existing pattern; mirror the order used in this session's actual `session.json` if helpful).
  3. Add `"transcriptPath": null` in serialization order; preserve 2-space indent.
  4. Validate JSON via `jq`.
  5. Edit `orchestration/SKILL.md` Step 1 row 6 procedure text to describe the manager-agent stamp, including: tilde-substitution against `$HOME`; the disambiguation that this is manager-driven (in-scope) and CLI automation is deferred; the tilde-form storage rationale (git-tracked → no $HOME leakage).
  6. Edit `orchestration/SKILL.md § Session metadata` top-level-fields list (line 371 area) to add `transcriptPath` in serialization order matching the template.
  7. The example illustration of the stamped value MUST use `$HOME` notation, not a literal `/home/jeonhh0061/...` prefix (FIX B).
- **Files in-scope:**
  - `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
  - `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- **Files out-of-scope:** all P1 skill files (T3/T4); all P7 skill files (T6); the hook script (T1); settings.json (T2). **CRITICAL: this session's own `session.json` is NOT edited here** — that is the M1 manager-direct action, NOT an Execution task.
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`, `orchestration`
- **Dependencies:** T1, T2 (the orchestration procedure text describes a behavior whose env-var supply depends on the hook + settings being installed; ordering ensures coherent docs).
- **Success criteria:**
  - `session.template.json` parses; `has("transcriptPath")` returns `true`; literal value is `null`.
  - `orchestration/SKILL.md` Step 1 row 6 mentions `transcriptPath`, mentions tilde-form / `$HOME`-substitution, mentions the manager-agent stamping mechanism, AND mentions that CLI automation is deferred (FIX A disambiguation present).
  - `orchestration/SKILL.md § Session metadata` top-level-fields list around line 371 lists `transcriptPath`.
  - No literal `/home/jeonhh0061` (or similar concrete home prefix) appears in any new illustration in `orchestration/SKILL.md`.
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  jq -e 'has("transcriptPath")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json
  jq '.transcriptPath' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json   # must print: null
  rg -n 'transcriptPath' .gobbi/projects/gobbi/skills/orchestration/SKILL.md
  rg -n '\$HOME' .gobbi/projects/gobbi/skills/orchestration/SKILL.md
  ! rg -nF '/home/jeonhh0061' .gobbi/projects/gobbi/skills/orchestration/SKILL.md
  rg -nF 'CLI automation' .gobbi/projects/gobbi/skills/orchestration/SKILL.md   # FIX A disambiguation present
  ```
- **Commit message:**
  ```
  feat(orchestration): add transcriptPath field + manager-stamp docs

  Schema: session.template.json gains "transcriptPath": null. Docs:
  orchestration/SKILL.md Step 1 row 6 documents manager-agent stamp (tilde-form,
  $HOME-substituted; CLI automation deferred per FIX A); top-level-fields list
  at :371 includes transcriptPath.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T5
  ```

---

### T6 — Reword `$CLAUDE_TRANSCRIPT_PATH` references in 6 skill files (P7)

- **What:** 9 line-anchored rewrites across 6 skill files such that each reference reads "from the manager-stamped `session.json.transcriptPath` field (tilde-expand `$HOME` on read), or `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env" (or equivalent phrasing preserving each file's voice).
- **Why:** Idea § Decisions Log P7; criterion 5 of the Ideation success criteria. Witness: the 9 line numbers are confirmed in Preparation iter2 § Verified resources rows 3, 6, 7, 8, 9, 12.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Re-grep `CLAUDE_TRANSCRIPT_PATH` across `.gobbi/projects/gobbi/skills/` to confirm line offsets; expected hits include the 9 cited + `gobbi/SKILL.md:56` (preserved per T3 / FIX 2).
  3. Per file (6 files, sorted by inventory order), apply `Edit` per line — the line text varies per file, so the executor reads the surrounding context for each line before editing.
  4. Each reworded occurrence must (a) cite `session.json.transcriptPath` as the primary source, (b) mention tilde-expansion-on-read, and (c) name `$CLAUDE_TRANSCRIPT_PATH` as the env-direct fallback.
- **Files in-scope (6 files, 9 lines):**
  - `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` (line 280)
  - `.gobbi/projects/gobbi/skills/planning/SKILL.md` (line 417)
  - `.gobbi/projects/gobbi/skills/execution/SKILL.md` (line 208)
  - `.gobbi/projects/gobbi/skills/ideation/SKILL.md` (lines 407, 415)
  - `.gobbi/projects/gobbi/skills/memorization/SKILL.md` (lines 20, 146, 155)
  - `.gobbi/projects/gobbi/skills/preparation/SKILL.md` (line 330)
- **Files out-of-scope:** `gobbi/SKILL.md` (line 56 var name preserved per T3 / FIX 2); all P1 files that don't appear in this inventory.
- **Agent assignment:** `executor`
- **Skills to load:** `principles`, `mistake`, `execution`, `git`
- **Dependencies:** T5 (the rewording cites `session.json.transcriptPath` as the canonical field; that field is only documented as canonical after T5 lands).
- **Success criteria:**
  - Each of the 9 line-anchored occurrences post-edit mentions both `session.json.transcriptPath` AND tilde-expansion (or equivalent phrasing satisfying the contract).
  - Repo-wide `CLAUDE_TRANSCRIPT_PATH` count is ≥ 9 + 1 (the preserved `gobbi/SKILL.md:56` row + the 9 reworded references which still mention `$CLAUDE_TRANSCRIPT_PATH` as fallback) + at least 1 occurrence in `orchestration/SKILL.md` from T5 = ≥ 11 hits expected.
- **Verification commands:**
  ```
  cd "${WORKTREE_PATH}"
  for f in wrap-up/SKILL.md planning/SKILL.md execution/SKILL.md ideation/SKILL.md \
           memorization/SKILL.md preparation/SKILL.md; do
    p=".gobbi/projects/gobbi/skills/$f"
    rg -q 'session\.json\.transcriptPath' "$p" || { echo "FAIL_PRIMARY_CITE: $p"; exit 1; }
  done
  rg -c 'CLAUDE_TRANSCRIPT_PATH' .gobbi/projects/gobbi/skills/   # expect >= 11
  echo OK_T6
  ```
- **Commit message:**
  ```
  docs(skills): cite session.json.transcriptPath in 6 path-conventions

  Across 6 SKILL.md files, primary cite becomes session.json.transcriptPath
  (tilde-expand on read); $CLAUDE_TRANSCRIPT_PATH retained as env-direct
  fallback. Aligns docs with T5 schema landing.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T6
  ```

---

### T7 — Final verification sweep (executor-only; NO push / NO PR)

- **What:** a verification log proving all Ideation success criteria 1-7 + 9 hold across the worktree state, plus any consolidating doc fixups surfaced by the sweep landed as a single focused final commit. **Criterion 8 (manager stamp) is deferred to M1 post-merge; criterion 9's PR-merge gate is the M2 manager-direct action.** This task does NOT push, does NOT open a PR, does NOT touch remote — per `git/SKILL.md:11, 27-29, 122, 170` (subagent: never push / never `gh pr *` / never `gh issue *`).
- **Why:** Principle 7 (verification gate) + Codex iter1 P6/P7/P1 Highs (subagent ownership boundary). Idea § How → Execution shape Task G remains the executor's verification responsibility; integration moves to M2.
- **How:**
  1. `cd "${WORKTREE_PATH}"`.
  2. Run the full inline verification command block below (no placeholders, no "same fixture as T1" deferrals — every command is written out here).
  3. If any check fails: halt and report `BLOCKED` with the failure to manager — do NOT advance to commit; the manager re-plans.
  4. If all pass and the sweep surfaces no additional fixups: report DONE with verification output; the manager proceeds to M2.
  5. If the sweep surfaces a minor consolidating fix (e.g., a stale cross-reference noticed only during full sweep), land it as one final focused commit titled `chore: T7 sweep follow-up — <one-line>` carrying its own `AI-Provenance-Record` trailer.
- **Files in-scope:** the worktree's full doc surface as a verification target; one optional consolidating commit if a fixup is needed. No push, no PR.
- **Files out-of-scope:** any non-doc file outside the T1-T6 inventory; remote refs; the PR / issue surface; the main-tree `session.json` (M1 target).
- **Agent assignment:** `executor` (verification + at most one consolidating commit).
- **Skills to load:** `principles`, `mistake`, `execution`, `git`
- **Dependencies:** T1, T2, T3, T4, T5, T6 (all prior tasks must be committed in the worktree).
- **Success criteria (all 7 of Idea § How → Success criteria 1-7+9 must pass; criterion 8 is M1's; criterion 9's PR-merge half is M2's):**
  1. `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty.
  2. `rg -c 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/` aggregate ≥ 13.
  3. `.claude/hooks/session-start.sh` exists, executable, contains shebang + `@sh` pattern + exports `CLAUDE_CODE_SESSION_ID` + exports `CLAUDE_HOOK_SOURCE`.
  4. Fixture round-trip with `/tmp/foo bar's baz.jsonl` succeeds byte-for-byte (FIX C — written inline below, no deferral).
  5. `jq -e '.hooks.SessionStart[0].matcher == "startup|resume|clear|compact"' .claude/settings.json` succeeds.
  6. Hook-fires verification deferred to next-session bootstrap (not gated here — hook cannot fire mid-session).
  7. Two-step jq verification on `session.template.json` returns `has=true` + value=`null`; `orchestration/SKILL.md` § Session metadata top-level-fields list (line ~371) includes `transcriptPath` AND the body of `orchestration/SKILL.md` documents the manager-agent stamp.
  9-doc. P7 reword cite count: ≥ 9 hits of `session.json.transcriptPath` literal across the 6 P7 files.
- **Verification commands (inline; FIX V — no placeholders, no "same as T1" deferrals):**
  ```
  cd "${WORKTREE_PATH}"

  # Criterion 1 — old name fully removed across skills
  ! rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/

  # Criterion 2 — new name appears >= 13 times
  test "$(rg -c 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/ | awk -F: '{s+=$2} END {print s}')" -ge 13

  # Criterion 3 — hook present + executable + shape
  test -x .claude/hooks/session-start.sh && echo OK
  head -1 .claude/hooks/session-start.sh | grep -F '#!/usr/bin/env bash'
  grep -F "@sh" .claude/hooks/session-start.sh
  grep -F "CLAUDE_CODE_SESSION_ID" .claude/hooks/session-start.sh
  grep -F "CLAUDE_HOOK_SOURCE" .claude/hooks/session-start.sh

  # Criterion 4 — FIX C shell-safety round-trip fixture (inline; no T1 deferral)
  ENV_FIXTURE=$(mktemp)
  printf '%s' '{"session_id":"abc","transcript_path":"/tmp/foo bar'\''s baz.jsonl","cwd":"/tmp","hook_event_name":"SessionStart","source":"startup"}' \
    | CLAUDE_ENV_FILE="$ENV_FIXTURE" bash .claude/hooks/session-start.sh
  ( source "$ENV_FIXTURE" && [ "$CLAUDE_TRANSCRIPT_PATH" = "/tmp/foo bar's baz.jsonl" ] ) && echo OK_ROUND_TRIP
  rm -f "$ENV_FIXTURE"

  # Criterion 5 — settings matcher
  jq -e '.hooks.SessionStart' .claude/settings.json
  jq -e '.hooks.SessionStart[0].matcher == "startup|resume|clear|compact"' .claude/settings.json

  # Criterion 7 — two-step jq on session.template.json
  jq -e 'has("transcriptPath")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json
  jq '.transcriptPath' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json   # must print: null

  # Criterion 7 — orchestration/SKILL.md transcriptPath documentation (>= 1 hit around line 371 area + body)
  rg -n 'transcriptPath' .gobbi/projects/gobbi/skills/orchestration/SKILL.md
  test "$(rg -c 'transcriptPath' .gobbi/projects/gobbi/skills/orchestration/SKILL.md)" -ge 1

  # P7 reword cite count — >= 9 occurrences of session.json.transcriptPath literal across the 6 files
  test "$(rg -nE 'session\.json\.transcriptPath|session\.json\.transcriptPath' \
            .gobbi/projects/gobbi/skills/wrap-up/SKILL.md \
            .gobbi/projects/gobbi/skills/planning/SKILL.md \
            .gobbi/projects/gobbi/skills/execution/SKILL.md \
            .gobbi/projects/gobbi/skills/ideation/SKILL.md \
            .gobbi/projects/gobbi/skills/memorization/SKILL.md \
            .gobbi/projects/gobbi/skills/preparation/SKILL.md \
            | wc -l)" -ge 9

  # Worktree-only confirmation — NO push, NO PR (these are M2):
  git log --oneline develop..HEAD   # expect 6 task commits T1-T6 (+ optional T7 follow-up)
  echo OK_T7_VERIFICATION
  ```
- **Commit message** (only if T7 surfaces a consolidating fixup; otherwise no commit at this task):
  ```
  chore: T7 sweep follow-up — <one-line description of consolidating fix>

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T7
  ```

---

### M2 — (Manager-direct, post-T7) Push + open PR + watch CI + squash-merge + cleanup

- **What:** branch pushed to `origin`; PR opened against `develop`; CI watched to green; PR squash-merged with `--delete-branch`; main-tree `develop` synced; worktree removed. Per `git/SKILL.md` Procedures P4 (push + PR), P5 (land + cleanup), and the manager↔subagent boundary at `git/SKILL.md:11, 27-29, 95-99, 122, 170`.
- **Why:** subagents never push, never create PRs, never merge (`git/SKILL.md:11, 122, 170`). All integration is manager-owned. Closes Codex iter1 P6/P7/P1 Highs.
- **Pre-conditions (all must hold before any push / `gh` invocation):**
  1. All executor tasks T1-T7 report DONE with verified commits in the worktree.
  2. `git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook status --porcelain` is empty (no uncommitted changes).
  3. `git -C .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook log --oneline develop..HEAD` shows the expected 6-7 task commits (T1-T6 + optional T7 follow-up), each with an `AI-Provenance-Record` trailer.
  4. **`gh auth status` succeeds** (FIX VI re-verification per Prep δ — Codex iter1 sandbox may have lacked auth; the manager re-verifies at point of use).
  5. PR title + body are drafted per `git/conventions.md` § Pull Request Format (no placeholder `"..."`).
  6. If a tracking issue has been filed for this feature, close-keyword (e.g., `Closes #N`) is included in the PR body; otherwise the PR stands alone (no issue was filed for this session's surface).
- **How (procedural; NOT an executor task):**
  1. **Push:** `cd .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook && git push -u origin feat/env-var-audit-sessionstart-hook`.
  2. **Open PR:** `gh pr create --base develop --head feat/env-var-audit-sessionstart-hook --title "feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID)" --body <body>` where `<body>` follows `conventions.md` § Pull Request Format with these sections:
     The body MUST be in this exact section order per `conventions.md` § Pull Request Format → Body — required template: **Summary → Changes → Test plan → Linked issues** ("Stamp the template; do not improvise structure"). The actual literal body content is inlined in the M2 verification command block below via HEREDOC; the prose here describes intent only.

     - **Summary** (intent) — one-paragraph statement of what the PR does (install SessionStart hook; rename CLAUDE_SESSION_ID to CLAUDE_CODE_SESSION_ID; add transcriptPath schema field; reword 9 P7 references). Cite the witness: env-var defect + missing SessionStart hook detected at session bootstrap on 2026-05-22 (`cat .claude/settings.json | jq '.hooks // "NO_HOOKS_BLOCK"'` returned `"NO_HOOKS_BLOCK"`).
     - **Changes** (intent) — file-or-area-grouped bullets:
       - `.claude/hooks/session-start.sh` (NEW) — bash + jq SessionStart hook persisting 10 env vars to `$CLAUDE_ENV_FILE` with shell-safe `@sh` quoting (T1).
       - `.claude/settings.json` — adds `hooks.SessionStart` block registering the hook (T2).
       - `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` — rewrites § Session env vars arrive automatically (env-var table updated, two-gate health warning, Runtime-set sub-table) (T3).
       - 11 skill SKILL.md files — `$CLAUDE_SESSION_ID` to `$CLAUDE_CODE_SESSION_ID` rename in P1 path-conventions rows (T4).
       - `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` + `templates/session.template.json` — adds top-level `transcriptPath` field to session.json schema + manager-stamp docs (T5).
       - 6 skill SKILL.md files — `$CLAUDE_TRANSCRIPT_PATH` to `session.json.transcriptPath` citation (P7 reword across 9 line anchors) (T6).
     - **Test plan** (intent) — concrete reviewer-runnable checks:
       - [ ] `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty (grep-clean).
       - [ ] `rg -nc 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/` aggregate ≥ 13.
       - [ ] `test -x .claude/hooks/session-start.sh && echo OK` prints `OK`.
       - [ ] `jq -e '.hooks.SessionStart' .claude/settings.json` exits 0.
       - [ ] `jq -e 'has("transcriptPath")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` exits 0.
       - [ ] `jq '.transcriptPath' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` prints `null`.
       - [ ] FIX C shell-safety fixture: round-trip a path with single quote + space + Unicode through the hook; `source $CLAUDE_ENV_FILE && printf '%s\n' "$CLAUDE_TRANSCRIPT_PATH"` returns input byte-for-byte.
       - [ ] All 9 P7 reword citations present (`session.json.transcriptPath` literal across the 6 skill files).
       - [ ] Hook-fires verification deferred to next-session bootstrap (criterion 6 — hook cannot fire mid-session).
     - **Linked issues** (intent) — `N/A — work tracked via session 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d` (no GitHub issue filed for this surface; if an issue is filed before PR-create, replace with `Closes #N` or `Refs #N` per the default-branch-caveat in conventions.md).
     - **AI-Provenance-Record note** — every commit in this PR carries `AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T<n>` per `git/conventions.md` § Commit Trailers.
  3. **Watch CI:** `gh pr checks <num> --watch` until all checks return success.
  4. **Pre-merge gate:** confirm (a) all CI green, (b) PR body complete (no placeholders), (c) worktree still clean, (d) no late commits added to develop that would conflict.
  5. **Squash-merge:** `gh pr merge <num> --squash --delete-branch`.
  6. **Post-merge sync:** `cd /playinganalytics/git/gobbi && git checkout develop && git pull --ff-only` — pull the squashed commit onto the local main-tree develop.
  7. **Pre-remove gate (per `git/SKILL.md` Procedure P5 step 3):** before any `git worktree remove`, the manager `cd`s into the worktree and confirms (a) `git status --short` is empty (clean working tree) AND (b) `git branch --contains HEAD develop` shows `develop` (the branch is merged into base). Never use `--force` / `-f` on `git worktree remove`. Then `cd /playinganalytics/git/gobbi` (back to the main tree) before running the remove command.
  8. **Cleanup:** `git worktree remove .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook && git worktree prune && find .gobbi/projects/gobbi/worktrees/feat -type d -empty -delete` (no `--force`).
- **Files in-scope:** remote `origin/feat/env-var-audit-sessionstart-hook`, PR surface, local develop ref; worktree directory (removed). No workspace file is edited by M2 itself.
- **Files out-of-scope:** every workspace file inside the worktree — M2 only ships what the executor already committed.
- **Agent assignment:** `manager-direct` (NOT delegated — push / PR / merge are exclusively manager-owned per `git/SKILL.md:11, 27-29, 95-99, 122, 170`).
- **Skills referenced:** `git` (Procedures P4, P5, P7), `git/conventions.md` (PR template).
- **Dependencies:** T1-T7 all DONE.
- **Success criteria:**
  - `git push -u origin feat/env-var-audit-sessionstart-hook` exits 0.
  - `gh pr create` returns a PR URL; PR exists with conventions-compliant title + body.
  - `gh pr checks <num> --watch` returns success.
  - `gh pr merge <num> --squash --delete-branch` exits 0; PR shows merged; remote branch deleted.
  - `git -C /playinganalytics/git/gobbi log --oneline -1 develop` shows the squash-merge commit at `develop` HEAD.
  - `git worktree list` no longer shows `feat/env-var-audit-sessionstart-hook`.
- **Verification commands:**
  ```
  cd .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook
  git log --oneline develop..HEAD                                   # expect 6-7 trailer-carrying commits
  gh auth status                                                    # FIX VI pre-condition
  git push -u origin feat/env-var-audit-sessionstart-hook
  gh pr create --base develop --head feat/env-var-audit-sessionstart-hook \
    --title "feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID)" \
    --body "$(cat <<'PRBODY'
## Summary

Audits and corrects the env-var contract that gobbi's skills depend on. Installs a real `.claude/hooks/session-start.sh` (bash + jq, shell-safe `@sh` quoting) that persists 10 hook-only env vars to `$CLAUDE_ENV_FILE`. Renames `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` across 13 occurrences in 12 skills (the runtime-auto-set name as of Claude Code v2.1.132). Adds a top-level `transcriptPath` field to the `session.json` schema. Rewords 9 references in 6 skills to cite `session.json.transcriptPath` as the canonical transcript source. Witness: env-var defect + missing SessionStart hook detected empirically at session bootstrap on 2026-05-22 (`cat .claude/settings.json | jq '.hooks // "NO_HOOKS_BLOCK"'` returned `"NO_HOOKS_BLOCK"`; `\$CLAUDE_SESSION_ID` was unset in Bash subprocesses while `\$CLAUDE_CODE_SESSION_ID` was set).

## Changes

- `.claude/hooks/session-start.sh` (NEW) — bash + jq SessionStart hook persisting 10 env vars to \`\$CLAUDE_ENV_FILE\` with shell-safe \`@sh\` quoting (T1).
- `.claude/settings.json` — adds \`hooks.SessionStart\` block registering the hook (T2).
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` — rewrites § Session env vars arrive automatically (env-var table updated, two-gate health warning, Runtime-set env vars sub-table) (T3).
- 11 skill SKILL.md files — \`\$CLAUDE_SESSION_ID\` → \`\$CLAUDE_CODE_SESSION_ID\` rename in P1 path-conventions rows (T4).
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` + `templates/session.template.json` — adds top-level \`transcriptPath\` field to session.json schema + manager-stamp docs (T5).
- 6 skill SKILL.md files — \`\$CLAUDE_TRANSCRIPT_PATH\` → \`session.json.transcriptPath\` citation across 9 line anchors (T6).

## Test plan

- [ ] \`rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/\` returns empty (grep-clean).
- [ ] \`rg -nc 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/\` aggregate ≥ 13.
- [ ] \`test -x .claude/hooks/session-start.sh && echo OK\` prints \`OK\`.
- [ ] \`jq -e '.hooks.SessionStart' .claude/settings.json\` exits 0.
- [ ] \`jq -e 'has("transcriptPath")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json\` exits 0.
- [ ] \`jq '.transcriptPath' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json\` prints \`null\`.
- [ ] FIX C shell-safety fixture: round-trip a path with single quote + space + Unicode through the hook; \`source \$CLAUDE_ENV_FILE && printf '%s\\n' "\$CLAUDE_TRANSCRIPT_PATH"\` returns input byte-for-byte.
- [ ] All 9 P7 reword citations present (\`session.json.transcriptPath\` literal across the 6 skill files).
- [ ] Hook-fires verification deferred to next-session bootstrap (criterion 6 — hook cannot fire mid-session).

## Linked issues

N/A — work tracked via session 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d. No GitHub issue filed for this surface. (If an issue is filed before PR-create, replace this section with \`Refs #N\` per conventions.md non-default-branch caveat; \`Closes #N\` does not auto-fire on develop-targeted PRs.)

---

AI-Provenance-Record per-commit: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T<n>.
PRBODY
)"
  PR=$(gh pr view --json number -q .number)
  gh pr checks "$PR" --watch
  gh pr merge "$PR" --squash --delete-branch
  cd /playinganalytics/git/gobbi
  git checkout develop && git pull --ff-only
  # Pre-remove gate per git/SKILL.md P5 step 3 (clean working tree + merged into base)
  ( cd .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook && \
    test -z "$(git status --short)" && \
    git branch --contains HEAD develop | grep -qE '(^| )develop( |$|\*)' )
  cd /playinganalytics/git/gobbi
  git worktree remove .gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook
  git worktree prune
  find .gobbi/projects/gobbi/worktrees/feat -type d -empty -delete
  git worktree list | grep -F 'feat/env-var-audit-sessionstart-hook' && echo FAIL_NOT_REMOVED || echo OK_M2
  ```

---

### M1 — (Manager-direct, post-M2 squash-merge) Stamp this session's `session.json.transcriptPath`

- **What:** this session's `session.json` at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/session.json` carries a populated `transcriptPath` in tilde form (e.g., `~/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl`), committed on the main-tree `develop` as one focused commit.
- **Why:** Idea § Stamping mechanism disambiguation (FIX A) + criterion 7 of exit criteria + criterion 8 of success criteria. The manager-agent (this manager — an LLM agent) is the in-scope mechanism; CLI automation is the deferred mechanism. **Ordered after M2** so the manager applies the procedure that was just merged to `develop`, and the M1 commit lands on main-tree develop (NOT inside the worktree, NOT inside the PR — the worktree is already removed by M2). Per Prep γ (session-write-path discipline), session memory writes always target the main-tree absolute path (`git/SKILL.md:31-33`).
- **How (procedural; NOT an executor task):**
  1. Confirm M2 has merged + main-tree `develop` is current (`git -C /playinganalytics/git/gobbi log --oneline -1` shows the squash-merge).
  2. Re-read the now-merged `orchestration/SKILL.md` Step 1 row 6 procedure.
  3. Read `$CLAUDE_TRANSCRIPT_PATH` from env (currently set in this session because the new hook is on disk — though only future sessions will actually invoke the hook; for THIS session, the manager may also fall back to deriving the path via `find ~/.claude/projects -name '*{session-id}*.jsonl'`).
  4. Perform tilde-substitution against `$HOME` and write the resulting tilde-form path into the **main-tree absolute** `session.json` path (NOT a worktree path — per Preparation iter2 item 10 / `git/SKILL.md:31-33`; the worktree no longer exists post-M2).
  5. Verify the stamp by reading back `session.json.transcriptPath` and confirming tilde-form (no literal `/home/...` prefix).
  6. Stage + commit on main-tree `develop` with a conventions-compliant single-commit (no PR — direct commit to develop for session-memory stamping is acceptable per the v0.5.0 session-memory model; if branch protection blocks direct develop commit, the manager opens a one-commit follow-up PR `chore(session): stamp transcriptPath ...` and squash-merges).
- **Files in-scope:**
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/session.json`
- **Files out-of-scope:** everything else (M1 touches only this one file).
- **Agent assignment:** `manager-direct` (NOT an executor; NOT delegated to a subagent — the manager performs this action itself, following the updated docs).
- **Skills referenced:** `orchestration` (Step 1 row 6 procedure as updated by T5 + merged by M2), `git`.
- **Dependencies:** M2 (the orchestration/SKILL.md procedure that M1 follows is only on main-tree develop after M2 squash-merges; running M1 before M2 would violate Principle 8 docs-truth — manager would be acting on procedure text that lives only in the unmerged worktree).
- **Success criteria:**
  - `jq -e 'has("transcriptPath") and .transcriptPath != null' <main-tree session.json>` returns `true`.
  - The stamped value begins with `~/` (tilde-form, no `$HOME` leakage).
  - The stamped value's tilde-expanded target exists on disk (`test -f`).
  - One focused commit on main-tree `develop` ahead of M2's squash commit, with conventions-compliant subject + trailer.
- **Verification commands:**
  ```
  SJ='/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/session.json'
  jq -e 'has("transcriptPath") and .transcriptPath != null' "$SJ"
  jq -r '.transcriptPath' "$SJ" | grep -E '^~/'
  TP="$(jq -r '.transcriptPath' "$SJ")"; test -f "${TP/#\~/$HOME}"
  git -C /playinganalytics/git/gobbi log --oneline -1                          # latest commit is the M1 stamp
  ```
- **Commit message** (for the main-tree develop commit that lands the stamp):
  ```
  chore(session): stamp transcriptPath in 2026-05-22-bac669ad session.json

  Manager-agent stamp per the orchestration/SKILL.md Step 1 row 6 procedure
  merged by PR <num>. Tilde-form, $HOME-substituted; satisfies Idea criterion 8.

  AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/M1
  ```

---

## Dependency Graph

```
M0 (manager-direct: create worktree + branch off develop)
  └── T1 (hook script)
        └── T2 (settings register)
              └── T3 (gobbi/SKILL.md rewrite — P4 + P5)
                    └── T4 (bulk rename P1 rows 3-13)
                          └── T5 (orchestration + session.template.json)
                                └── T6 (P7 transcript-path rewording)
                                      └── T7 (executor-only verification sweep; NO push, NO PR)
                                            └── M2 (manager-direct: push + PR + CI watch + squash-merge + cleanup)
                                                  └── M1 (manager-direct: post-merge stamp on main-tree develop)
```

Linearization rationale:
- **M0 → T1** — worktree must exist before any executor can `cd` into it (`git/SKILL.md` P2/P3).
- **T1 → T2** — settings registration must point at an existing script (Principle 7).
- **T2 → T3** — `gobbi/SKILL.md` cites the actual installed hook + settings registration; lying about installation status would violate Principle 8 docs-truth.
- **T3 → T4** — `gobbi/SKILL.md` is the canonical entry-point doc; landing it first anchors the rename pattern that T4 propagates to the other 11 files.
- **T4 → T5** — `T5` introduces the `transcriptPath` field; doing it AFTER the rename pass keeps the rename PR commit clean and lets T5's commit message focus on schema extension.
- **T5 → T6** — T6 cites `session.json.transcriptPath` as the canonical source; T5 makes that field canonical.
- **T6 → T7** — all docs must be in place before the final sweep validates them.
- **T7 → M2** — verification must pass before any push / PR (Principle 7); push / PR / merge are manager-only (`git/SKILL.md:11, 27-29, 122, 170`).
- **M2 → M1** — the stamping procedure that M1 follows is documented in `orchestration/SKILL.md` which is only on main-tree develop after M2's squash-merge; M1 acts on the merged procedure and writes to the main-tree session.json per Prep γ.

There are no parallel-safe lanes within this plan: every task touches doc / config surfaces whose verification depends on prior tasks' artifacts (per Principle 3, sequential editing).

---

## Agent Roster

| Action | Agent | Why this agent |
|--------|-------|----------------|
| M0 | `manager-direct` | Worktree creation + branch cut + base sync are manager-only per `git/SKILL.md:11, 47, 95`. Never delegated. |
| T1 | `executor` | Bash + jq script authoring; well within standard `execution` skill scope per Preparation iter2 § Execution skills readiness. |
| T2 | `executor` | JSON edit with `jq` verification; standard executor scope. |
| T3 | `executor` | Anchored markdown edits with `claude` skill governing doc style. |
| T4 | `executor` | 11-file bulk rename pass; same edit shape per file. |
| T5 | `executor` | Multi-file edit (JSON template + 2 sections of `orchestration/SKILL.md`); standard executor scope. |
| T6 | `executor` | 9-line reword across 6 files; per-line context-aware edits. |
| T7 | `executor` | Verification sweep + optional single consolidating commit. **NO `git push`, NO `gh pr *`, NO `gh issue *`** per `git/SKILL.md:11, 27-29, 122, 170`. |
| M2 | `manager-direct` | Push / PR / CI watch / squash-merge / post-merge sync / worktree cleanup are exclusively manager-owned per `git/SKILL.md:11, 27-29, 95-99, 122, 170` + Procedures P4 / P5 / P7. |
| M1 | `manager-direct` | Per FIX A, the manager agent performs this stamp by reading the merged `orchestration/SKILL.md` Step 1 row 6 — it is not an executor implementation, and it writes to a path (main-tree session memory) outside the executor's writable surface per `git/SKILL.md:31-33`. |

The single worktree is shared across T1-T7; the manager creates it at M0 and removes it during M2 cleanup.

---

## Plan-level Success Criteria

Synthesized from the Ideation iter3 § How → Success criteria (1-9). The Wrap-up loop verifies all of these before declaring the session done:

1. **Rename complete (criteria 1+2):** `rg 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` = empty AND `rg -c 'CLAUDE_CODE_SESSION_ID' ...` ≥ 13.
2. **Hook installed (criterion 3):** `.claude/hooks/session-start.sh` exists, executable, contains shebang + `@sh` pattern + exports `CLAUDE_CODE_SESSION_ID` + exports `CLAUDE_HOOK_SOURCE`.
3. **Shell-safe quoting (criterion 4):** fixture round-trip passes (FIX C).
4. **Settings registered (criterion 5):** `.claude/settings.json` parses; `hooks.SessionStart[0].matcher` covers `startup|resume|clear|compact`.
5. **Hook fires (criterion 6):** documented for the NEXT session's bootstrap; not gated on this session's verification (the hook doesn't fire mid-session).
6. **Schema field landed (criterion 7):** two-step jq verification on `session.template.json` returns `has=true` + value=`null`; `orchestration/SKILL.md` § Session metadata top-level-fields list includes `transcriptPath`.
7. **Manager stamp (criterion 8):** this session's `session.json.transcriptPath` is populated, tilde-form, with no literal `$HOME` leakage. Cross-referenced from criterion 7 per the iter3 FIX-CONS-04 inline correction during Ideation Memorization. **Closed by M1 post-M2-merge.**
8. **PR merged (criterion 9):** worktree PR squash-merges to `develop` with one clean commit on develop's history. **Closed by M2.**
9. **(Sub-criterion of 6/8):** two-gate health warning in `gobbi/SKILL.md` line 66 area documents both gates (CCSI gate AND transcript-path gate).

---

## Deferred Items

Explicitly OUT of this plan's scope (per Idea § Out-of-Scope + Preparation iter2 § Out of scope gaps):

- **Plugin mirror sync** (`plugins/` directory) — excluded by user setup answer; do not propose mirror sync tasks.
- **Runtime CLI code** under `packages/cli/src/` — excluded; no Execution task touches the runtime.
- **TypeScript + bun port of the hook** — deferred to a future session per user answer; the bash + jq implementation is the shippable artifact this session.
- **CLI automation of `session.json.transcriptPath` stamping** — deferred to a future session per FIX A; M1 is the manager-agent stamping mechanism that satisfies criterion 8 this session.
- **`.claude/agents/*.md` env-var audit** — empirically clean per grep; no task needed.
- **`CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` docs-vs-empirical investigation** — flagged in the new "Runtime-set env vars" sub-section (T3); investigation deferred.
- **Downstream consumers of `CLAUDE_HOOK_SOURCE`** — currently no skill consumes it; documentation in T3 keeps the artifact aligned with official Claude Code hook docs.
- **Future TS+bun port migration note** — already documented in the Idea § Hook contract; no separate task.

---

## Self-Review Checklist (per planning skill Sub-step E)

- [x] Every action (M0, T1-T7, M2, M1) has clear What / Why / How.
- [x] Every executor task's verification commands are concrete and runnable (no placeholders; `${WORKTREE_PATH}` is documented at M0 + threaded through every task).
- [x] Every action's dependencies are stated explicitly; dependency graph is acyclic and linearized.
- [x] No two executor tasks have unintentionally overlapping file scope: T1 (hook script), T2 (settings.json), T3 (gobbi/SKILL.md), T4 (11 other skill files, none overlapping with T3 or T6), T5 (session.template.json + orchestration/SKILL.md), T6 (6 skill files, none in T4's list; preparation/SKILL.md appears in both T4 and T6 but at different line offsets — line 375 P1 vs line 330 P7 — both are distinct edits within the same file; the executor handles both sequentially within their respective tasks). **NOTE:** `preparation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md`, `ideation/SKILL.md`, `memorization/SKILL.md`, and `wrap-up/SKILL.md` each appear in BOTH T4 (P1 rename) AND T6 (P7 reword) but at non-overlapping line ranges. The dependency graph T4 → T5 → T6 enforces ordering naturally.
- [x] Total action count: 10 (M0 + T1-T7 + M2 + M1); matches the brief's target.
- [x] Type/name consistency: `CLAUDE_CODE_SESSION_ID`, `CLAUDE_HOOK_SOURCE`, `transcriptPath`, `feat/env-var-audit-sessionstart-hook` consistently spelled across all action references.
- [x] No placeholders, no TODO markers in the plan body. M2's PR body shape is fully specified (Summary / Why / Changes / Test plan / AI-Provenance-Record reference); concrete title is set; PR number is the only late-bound value (`<num>`) because it is only assigned by GitHub at PR-create time.
- [x] Manager↔executor boundary respected: **M0, M2, M1 are manager-direct; T1-T7 are executor. No executor anywhere does `git push`, `gh pr create`, `gh pr merge`, `gh issue *`, or worktree create/remove.** Closes Codex iter1 P1/P6/P7 Highs.
- [x] Every executor task carries an explicit `Commit message` block citing `git/conventions.md` with subject ≤ 72 chars + body + canonical `AI-Provenance-Record: gobbi://session/<id>/task/T<n>` trailer. **NEVER `Co-Authored-By:`** per `git/SKILL.md § AI provenance` and `git/conventions.md:120`.
- [x] M2 pre-conditions include `gh auth status` re-verify per FIX VI / Prep δ. No conflict with FIX γ (session-write-path) — auth target is GitHub remote; session-write-path target is local main-tree filesystem.
- [x] Out-of-scope clauses preserved verbatim from Ideation; no scope drift introduced at Planning.

**Per-task commit-grammar count (FIX IV verification):** 8 commit-message blocks total — T1, T2, T3, T4, T5, T6 (always commit) + T7 (optional consolidating commit) + M1 (post-merge stamp commit) = 8 explicit blocks. M2 produces no workspace-edit commit (only push / PR / merge / cleanup git operations); the PR carries the 6-7 trailer-bearing commits from T1-T7 unchanged through squash-merge.

**One self-review concern surfaced (carried from iter1):** the six files appearing in BOTH T4 and T6 (preparation, planning, execution, ideation, memorization, wrap-up SKILL.md) are sequentially edited — once for P1 rename and again for P7 reword. This is safe because (a) T4 → T6 ordering is enforced via the dependency graph (T5 sits between), (b) the line ranges are disjoint within each file (P1 line offsets are higher in 5 of 6 files), and (c) per-line `Edit` rather than `Write` is mandated. Documented here so the executor does not get surprised at T6 entry to find that those files were already modified once in T4 — the worktree state at T6 entry already carries T1-T5's edits; T6 is additive within the already-modified files.

---

STATUS: DONE
