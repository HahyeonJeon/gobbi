# Plan — Restructure orchestration Step 1 + full-tree consistency (always-worktree)

Session 06668274, Chat-mode task 03. Planning artifact. The 7 Step-1 changes and D1–D4 are user-locked; this plan is HOW to implement them and the verbatim drop-in for the new Step 1 section.

**Read root / worktree:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-06-05-06668274`
All canonical edits are under `.gobbi/projects/gobbi/...` (the `.claude/...` paths are mirror symlinks — one edit covers both; the executor edits the canonical path only).

---

## 0. SPEC (Principle 13)

- **What the doc task must achieve:** Replace the worktree-pr-vs-direct branching model with an always-worktree model across the whole gobbi skill tree, restructure the Step-1 Configuration procedure table (reorder + new column shape + bulleted descriptions), drop three now-obsolete Step-1 blocks (LOCK #5 / Smoke-test T1.h / 3-tier table + row 7), introduce a new session-worktree branch naming convention, and add a no-gh PR-deferral resilience rule.
- **Affected file types (all `type: skill` developer docs under `.gobbi/projects/gobbi/skills/`):** orchestration SKILL + its `workflow/*.md` phase docs + `auto-mode.md`; `git/SKILL.md` + `git/conventions.md`; `interview/SKILL.md`; the two settings templates (`type: template`, JSON).
- **Adjacent types this must NOT bleed into:** Do NOT add interview/project-memory gate content to `gobbi/SKILL.md` — it already owns that gate (D4). Do NOT touch `sessions/` (historical). Do NOT rename this session's own branch (forward-looking only).

---

## 1. Blast-radius sweep (file:line, every hit, excludes `sessions/`)

Grepped canonical tree: `.gobbi/projects/gobbi/skills`, `.gobbi/projects/gobbi/agents`, `.claude/CLAUDE.md`, settings templates. Patterns: `direct mode` / `Direct commit` / `Direct mode` / `worktree-pr` / `git.workflow.mode` / `chore/session` / `ssid-short` / `ssid-full` / `LOCK #5` / `T1.h` / `3-tier` / `smoke-test`.

### A. `skills/orchestration/SKILL.md` — PRIMARY (the Step-1 spec). 11 hit-lines.
- **L72–81** — the procedure table (rows 1–7), incl. row 5 (worktree, `chore/session-{date}-{ssid-short}`, `worktree-pr`/`direct` branch, conventions `:22`/`:64` links), row 5.5 (state.json, `direct` fallback), row 6 (session.json, `direct`/`worktree-pr` branch stamping), row 7 (interview check). → **REWRITE whole table** (change 1,2,3,4,5,7; D2).
- **L83–98** — "Row 5 — Direct-mode opt-out (LOCK #5)" block + the 3-axis differ list. → **DELETE** (change 4).
- **L100–110** — "Smoke-test gate (T1.h …)" block + regex `^chore/session-…$` + worktreePath null check. → **DELETE** (change 6).
- **L112–118** — "3-tier bootstrap detection" table. → **DELETE** (change 7, D4).
- **L341** — Session-metadata "Git block (in serialization order)" row: describes `git.branch` as "current HEAD in `direct`, feature branch in `worktree-pr`" and `git.worktreePath` "absolute path … in `worktree-pr`; `null` in `direct`". → **UPDATE** wording to always-worktree (`git.branch` = the session-worktree branch; `git.worktreePath` = always the worktree absolute path, never null). Keep the sentence "The git workflow mode itself lives in `settings.json`" → that sentence is now stale (no mode key); see Open Question OQ-2.
- **L342** — "Update points" row mentions "worktree creation (stamp `git.branch` + `git.worktreePath` in `worktree-pr` mode)". → **UPDATE** — drop "in `worktree-pr` mode" qualifier (always happens).

### B. `skills/orchestration/auto-mode.md` — 1 hit.
- **L63** — "See …§ Step 1… for the full procedure table (rows 1-7 + Direct-mode opt-out + 3-tier bootstrap detection)." → **UPDATE** the parenthetical to match the new Step-1 shape (rows 1–4, no opt-out, no 3-tier).

### C. `skills/orchestration/workflow/*.md` — 5 hits (one "Direct mode opt-out" block per phase doc).
- `ideation.md` **L126**, `preparation.md` **L117**, `planning.md` **L115**, `execution.md` **L87**, `wrap-up.md` **L62** — each: "**Direct mode opt-out:** when `settings.git.workflow.mode == "direct"`, there is no worktree branch and `git.worktreePath` is `null`; the per-iter … commit is skipped. … See `orchestration/SKILL.md § Configuration Step 1` row 5 footnote …". → **DELETE** each block (always-worktree means the per-iter commit cadence always applies; the "row 5 footnote" it points to is being removed). The preceding "The commit lands on the worktree branch (per … row 5 worktree-first lock)" sentence in each file STAYS (still true) but its cross-ref "row 5" must be re-anchored — see §4 note on row renumbering.

### D. `skills/interview/SKILL.md` — 2 hits referencing the removed orchestration content (NOT enumerated in the brief; see Finding F-1).
- **L26** — "**Bootstrap detection** (3-tier — mirrors `orchestration/SKILL.md` § Step 1 row 7):" then a 3-tier table (L28–32) that interview ACTUALLY USES. → **UPDATE the cross-reference only**: the 3-tier table here is interview's own canonical copy and must STAY; change "mirrors `orchestration/SKILL.md` § Step 1 row 7" to point at `gobbi/SKILL.md` (the project-memory baseline check, L95–98), since orchestration no longer holds a 3-tier table.
- **L72** — "applies the 3-tier detection from `orchestration/SKILL.md` § Step 1 row 7." → **UPDATE** the cross-reference target to `gobbi/SKILL.md` project-memory baseline check. Keep the Empty/Sparse/Mature prose (interview's own gate).

### E. `skills/git/SKILL.md` — direct-mode + no-gh fallback (D1, D2). Hits at L31, L33, L75, L151, L246, L278, L283.
- **L75** — "**Fallback**: if the user cannot install `gh`, … fall back to Direct commit mode rather than blocking the session entirely." → **REWRITE to D2**: worktree is always created (local git, no gh needed); only PR creation needs gh; if gh/auth/remote is unavailable the session still creates the worktree and commits on the branch, and the manager DEFERS the PR with a "PR deferred — push/open when gh is available" notice. Never work in the main tree.
- **L151** — P1 step: "If any **Critical** prerequisite fails, fall back to Direct commit mode." → **REWRITE to D2**: a failed Critical prereq (gh/auth/remote) no longer aborts worktree creation; it defers PR + surfaces the deferral notice. (The Critical/Warning table at L67–84 stays; only the consequence sentence changes.)
- **L283** — Constraint: "**Requires GitHub and the `gh` CLI** — repos not hosted on GitHub fall back to Direct commit mode." → **REWRITE**: GitHub + gh required only for the PR lifecycle; worktree + commits work without them; PR is deferred when unavailable.
- **L31, L33, L246, L261, L278** — the Memory-Access-Matrix "(direct mode)" / "fall back to main tree when `worktreePath` is null" clauses. Because `worktreePath` is now ALWAYS set (always-worktree), the "null → main tree" branch is dead. **Choice (call-out per brief):** do NOT silently delete the defensive concept. Replace each "fall back to main tree when `worktreePath` is null (direct mode)" with a single defensive one-liner: `worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. Apply uniformly at **L31** (matrix row), **L33** (Critical-rule paragraph), **L246** (Output-paths preamble), **L261** (Output-paths table row), **L278** (Constraints bullet). Rationale: keeps a guard against a malformed session.json while removing the direct-mode escape hatch the user dropped.
- **P2 (L153–163)** stays (already the always-worktree create path); only the branch-name reference resolves to the new conventions rule (§E below). The "for worktree-first sessions" qualifier in P2's preamble (L155, L157) can drop "for worktree-first sessions" since all sessions are now worktree-first — **UPDATE** wording (cosmetic, low-risk; list in plan, executor's discretion to keep terse).

### F. `skills/delegation/SKILL.md` — 1 hit.
- **L111** — "**Session-write path discipline.** … use `session.json.git.worktreePath` … when that field is set (worktree-first mode); fall back to the main tree's absolute path when `worktreePath` is null (direct mode)." → **UPDATE** to the same defensive one-liner as §E (always set; null = error, not main-tree signal). Removes the last "direct mode" mention outside git/orchestration.

### G. Settings templates — `settings.chat.json` + `settings.auto.json`.
- **No `git.workflow.mode` key exists** in either template (the `git` block has `repo`/`baseBranch`/`pr`/`issue`/`worktree`/`branch` only). → **NO key change required.** State this explicitly: the `settings.git.workflow.mode == "direct"` references in the docs were reading a key the templates never defined (Finding F-2). The only template-adjacent edit is the Step-1 **row 2 "customize" list** in `orchestration/SKILL.md` (L75) which currently ends "…per-agent-type `models`, **git workflow**." → **UPDATE** to drop "git workflow" from the customize list (there is no git-workflow-mode toggle to customize anymore). This is an orchestration edit, not a template edit.

### H. `.claude/CLAUDE.md` / `agents/*.md` — **0 hits** for any of the 13 patterns. No edit.

---

## 2. CRUD table (file / op / section-or-line granularity)

| File | Op | Sections / lines | Change |
|---|---|---|---|
| `skills/orchestration/SKILL.md` | **Update** | L72–118 (table + 3 blocks); L75 (customize list); L341–342 (git-block metadata rows) | Replace Step-1 §; drop "git workflow" from customize list; always-worktree wording in metadata |
| `skills/orchestration/auto-mode.md` | **Update** | L63 parenthetical | Match new Step-1 shape |
| `skills/orchestration/workflow/ideation.md` | **Delete** | L126 block | Remove "Direct mode opt-out" block; re-anchor preceding row-5 cross-ref |
| `skills/orchestration/workflow/preparation.md` | **Delete** | L117 block | same |
| `skills/orchestration/workflow/planning.md` | **Delete** | L115 block | same |
| `skills/orchestration/workflow/execution.md` | **Delete** | L87 block | same |
| `skills/orchestration/workflow/wrap-up.md` | **Delete** | L62 block | same |
| `skills/git/SKILL.md` | **Update** | L75, L151, L283 (no-gh→D2); L31, L33, L246, L261, L278 (null-defensive one-liner); L155/L157 (drop "worktree-first sessions" qualifier) | D2 rewrite + defensive null clause |
| `skills/git/conventions.md` | **Update** | new "Session-Worktree Branches" subsection in § Branch Naming (after L66); scope note on L19/L27 type-prefix + slug rules | D3 — add session-branch regex + exempt session branches from type/slug grammar |
| `skills/interview/SKILL.md` | **Update** | L26 cross-ref; L72 cross-ref | Repoint "orchestration § Step 1 row 7" → `gobbi/SKILL.md` baseline check; keep interview's own 3-tier table |
| `skills/delegation/SKILL.md` | **Update** | L111 | Defensive null one-liner (drop "direct mode") |
| `templates/settings.chat.json` | **Read** | git block | Confirm no `workflow.mode` key — NO edit |
| `templates/settings.auto.json` | **Read** | git block | Confirm no `workflow.mode` key — NO edit |

No **Create**. No physical **Delete** of files (only intra-file block removals).

---

## 3. Drafted new `### Step 1 — Workflow Configuration` (verbatim drop-in)

Replaces current L62–118 of `skills/orchestration/SKILL.md`. New table column order `# | Action | Description | Refs | Agent`; rows reordered worktree→settings→state→session; bulleted short descriptions; always-worktree; new naming; no LOCK #5 / no Smoke-test / no 3-tier / no row 7. The `{system}` token resolves to `claude` for the `claude-code` system and `codex` for the `codex` system (read from `session.json.system` / the running runtime).

````markdown
### Step 1 — Workflow Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`, an initialized `state.json` and `session.json`, and a per-session worktree that every subsequent write roots into.

**Procedure.** Every session creates a worktree first, then resolves settings, then initializes `state.json` and `session.json` inside that worktree.

| # | Action | Description | Refs | Agent |
|---|---|---|---|---|
| 1 | Create Worktree | <ul><li>Every session creates its own worktree — local git, no `gh` required.</li><li>Invoke `git/SKILL.md` § P2 to create the worktree at branch `{system}-{date}-{ssid-full}`, where `{system}` is `claude` (claude-code runtime) or `codex`, `{date}` is the session-start date `YYYY-MM-DD`, and `{ssid-full}` is the full `$CLAUDE_CODE_SESSION_ID` UUID.</li><li>The branch name follows the session-worktree rule in `git/conventions.md` § Branch Naming (exempt from the type-prefix and 3–50-char slug rules).</li><li>**Idempotency — 3-state guard** (SessionStart fires on `startup\|resume\|clear\|compact`): (1) `worktreePath` is `null` → fresh session; create via P2. (2) `worktreePath` set AND path exists → healthy resume/clear/compact; `cd` in and skip P2. (3) `worktreePath` set AND path missing → orphaned; warn and AskUserQuestion "Worktree at `<path>` is missing — recreate (re-run P2) or abort to investigate?" (recovery: `git/SKILL.md` § P6).</li><li>**Write-root rule:** P2's output is an in-turn worktree path the manager holds in memory; rows 3 and 4 use it as the absolute write root. Row 4 stamps it into `session.json.git.worktreePath`, the durable canonical write-root from that point on (per `git/SKILL.md` § Memory Access Matrix).</li></ul> | [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree), [`git/SKILL.md` § P6](../git/SKILL.md#p6----recover-orphaned-worktree), [`git/conventions.md` § Branch Naming](../git/conventions.md#branch-naming) | manager |
| 2 | Resolve Settings | <ul><li>Read the per-mode default template `settings.{mode}.json` matching the bootstrap-selected mode (Chat → `settings.chat.json`; Auto → `settings.auto.json`).</li><li>Chat: present the defaults and AskUserQuestion — use as-is or customize. Auto: use defaults without asking.</li><li>If customizing, walk each section via AskUserQuestion — per-step evaluation policy, discussion policy, `skip`, `maxIterations`, and per-agent-type `models`. (`mode` is already fixed by the loaded file.)</li><li>Write the resolved `settings.json` (defaults overlaid with overrides) to the session dir, then read the cascade back to confirm the write took effect.</li></ul> | [settings.chat.json](templates/settings.chat.json) / [settings.auto.json](templates/settings.auto.json) | manager |
| 3 | Init state.json | <ul><li>Copy `templates/state.template.json` into `…/sessions/{date}-{session-id}/state.json`, rooted at the row-1 worktree path (in-turn value — `session.json` is not written yet).</li><li>Set `mode` from the resolved settings.</li><li>Mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` (Step 1 has just completed).</li></ul> | [state.template.json](templates/state.template.json) | manager |
| 4 | Init session.json | <ul><li>Copy `templates/session.template.json` into the session dir, rooted at the row-1 worktree path. This row stamps `git.worktreePath`, making it the durable canonical write-root for all later session-memory writes.</li><li>Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior `sessionId` on resume / post-`/clear` / post-`/compact`, else `null`); `project`; `feature` (`null` if not yet clear — stamp later during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` `null`; `transcriptPath` from `$CLAUDE_TRANSCRIPT_PATH` with `$HOME`→`~/` (leave `null` if absent).</li><li>Resolve `git`: stamp `git.repo` + `git.baseBranch` from settings (derive `git.repo` via `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project settings if `null`); stamp `git.branch` and `git.worktreePath` from the row-1 worktree; stamp `git.issue` if known.</li><li>Fill the `agents[]` manager entry (`type: "manager"`) with `id`, `name`, `model`, `system`, `transcriptPath`, `startedAt`; set `step: "configuration"`, `phase: null`. Specialist entries are appended automatically by the PostToolUse hook ([`post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh), matcher `Task\|Agent`); the reconstructor ([`reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh)) reconciles on missed events. The manager seeds only its own entry and never hand-appends specialist entries.</li></ul> | [session.template.json](templates/session.template.json) | manager |

**No-`gh` resilience.** The worktree and branch are always created with local git. Only PR creation needs `gh` (CLI + auth + remote). If `gh`, auth, or the remote is unavailable, the session still creates the worktree and commits on the branch; the manager defers the PR and surfaces a "PR deferred — push/open when `gh` is available" notice. The session never falls back to working in the main tree. See `git/SKILL.md` § Prerequisites.

**Project-memory / interview gate.** The project-memory baseline check and the interview auto-recommendation are owned by `gobbi/SKILL.md` (session bootstrap) — see its project-memory baseline check. Configuration does not re-run that gate.
````

> **Carry-over note for the executor:** the new table is 4 rows (was 7). The five `workflow/*.md` docs and `execution.md` cross-reference "row 5"/"Configuration Step 1 row 5 worktree-first lock" — update those cross-refs to "Configuration Step 1 row 1 (Create Worktree)". Do this in the same task that removes the Direct-mode-opt-out blocks (§C).

---

## 4. `git/conventions.md` — D3 session-worktree branch rule (exact)

Slot a new subsection into **§ Branch Naming**, immediately after the Rules table (after current L66, before the `---` that precedes § Commit Messages):

````markdown
### Session-Worktree Branches

Per-session worktree branches created at Configuration Step 1 (orchestration/SKILL.md row 1) do **not** use the type-prefix grammar or the 3–50-char slug rule above — those govern non-session feature branches. Session-worktree branches use a fixed, machine-generated shape keyed to the running system and the session UUID:

```regex
^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

- `claude` for the `claude-code` system; `codex` for the `codex` system.
- `\d{4}-\d{2}-\d{2}` — session-start date `YYYY-MM-DD`.
- The trailing group is the full lowercase `$CLAUDE_CODE_SESSION_ID` UUID (8-4-4-4-12 hex).

Examples:
- `claude-2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2` — PASS
- `codex-2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2` — PASS
- `chore/session-2026-06-05-06668274` — old convention, no longer generated (existing branches are not renamed)

The shape-check regex and the 3–50-char slug rule in **§ Branch Naming → Validator** apply to **non-session** branches only. The session-worktree validator above is the sole shape check for Step-1 worktree branches.
````

And add a one-clause scope note to the existing Validator section (L17–18 area) and the Rules table intro (L57): change "Branch name validation is a two-step procedure" → "Branch name validation for **non-session feature branches** is a two-step procedure (session-worktree branches use the dedicated rule in § Session-Worktree Branches below)."

> **Regex choice rationale.** The brief's candidate `^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f-]{36}$` works but `[0-9a-f-]{36}` is loose (accepts mis-placed hyphens / wrong group lengths). The fully-expanded 8-4-4-4-12 form above is stricter and self-documents the UUID shape. **OQ-3** flags this for user confirmation; if the user prefers the looser brief form, swap it in — both are acceptable.

---

## 5. Ordered implementation sequence (for the executor)

Single executor, one commit (cohesive cross-doc rename). Sequence chosen so cross-references resolve to targets that exist after each step:

1. **`git/conventions.md`** — add § Session-Worktree Branches + scope notes. (No inbound dep; new anchor that Step-1 row 1 will link to.)
2. **`orchestration/SKILL.md`** — replace Step-1 § (§3 draft); drop "git workflow" from row-2 customize list; update L341–342 git-metadata wording to always-worktree. (Now links to the conventions anchor from step 1.)
3. **`orchestration/auto-mode.md`** — fix L63 parenthetical to the new Step-1 shape.
4. **`orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md`** — delete the 5 "Direct mode opt-out" blocks; re-anchor each "row 5 worktree-first lock" cross-ref to "row 1 (Create Worktree)".
5. **`git/SKILL.md`** — D2 no-gh rewrite (L75/L151/L283); defensive null one-liner (L31/L33/L246/L261/L278); drop "worktree-first sessions" qualifier in P2 preamble.
6. **`interview/SKILL.md`** — repoint L26 + L72 cross-refs from "orchestration § Step 1 row 7" to `gobbi/SKILL.md` project-memory baseline check; keep interview's own 3-tier table.
7. **`delegation/SKILL.md`** — L111 defensive null one-liner.
8. **Verify-only:** read both settings templates; confirm no `git.workflow.mode` key (no edit).

**Verification greps (run from worktree root at end; all must return ZERO in canonical docs, excluding `sessions/`):**
```bash
grep -rn --include="*.md" --include="*.json" \
  -e "git.workflow.mode" -e "chore/session" -e "ssid-short" \
  -e "LOCK #5" -e "T1.h" -e "Smoke-test gate" -e "3-tier bootstrap" \
  -e "Direct-mode opt-out" -e "Direct mode opt-out" -e "Direct commit mode" \
  .gobbi/projects/gobbi/skills .gobbi/projects/gobbi/agents .claude/CLAUDE.md \
  | grep -v "/sessions/"
```
Plus targeted positive checks:
- Step-1 table header is exactly `| # | Action | Description | Refs | Agent |`.
- `git/conventions.md` contains `^(claude|codex)-\d{4}-\d{2}-\d{2}-` (the new regex anchor).
- `interview/SKILL.md` no longer cites "Step 1 row 7"; its 3-tier table still present.
- `grep -rn "fall back to .*main tree" git/SKILL.md` returns only the defensive-error phrasing, not the old "direct mode" branch.

Note the brief's example greps "direct mode" / "T1.h" / "3-tier" must hit zero **in the rewritten/removed locations**; `git/SKILL.md` will retain "direct mode" ONLY if any defensive clause keeps the parenthetical — the chosen rewrite removes the parenthetical entirely, so "(direct mode)" should also reach zero. The verification list above treats `git.workflow.mode` / `chore/session` / `LOCK #5` / `T1.h` / `Smoke-test gate` / `3-tier bootstrap` / `Direct …opt-out` / `Direct commit mode` as the hard-zero set.

---

## 6. Findings (discovered drift — NOT folded into the plan silently; surface to user)

- **F-1 (in-scope per D1, but not enumerated in the brief's file list):** `interview/SKILL.md` L26 + L72 reference the orchestration 3-tier table / "Step 1 row 7" being deleted. This is a genuine co-update under D1 "full consistency now." Handled in §1.D / §2 / step 6. The 3-tier table itself is interview's own working copy — it stays; only the dangling cross-ref to orchestration moves to `gobbi/SKILL.md`. (Mistake `design-literal-retire-instruction-without-replacement` applies: do not delete a referenced thing without reconciling its referrers.)
- **F-2:** Neither settings template defines a `git.workflow.mode` key. The docs' `settings.git.workflow.mode == "direct"` checks read a key that never existed in the shipped templates — the direct-mode path was effectively dead config. Removing it is purely a doc-consistency win; no template schema change is needed. Confirms D1 scope for templates = "no key changes."
- **F-3 (pre-existing, out of scope):** Step-1 rows cite `qualified-git-write-path-rule.md`, but no mistake file by that name exists (actual files: `session-dir-placed-outside-worktree.md`, `codex-subprocess-writes-to-main-tree.md`). The new Step-1 draft drops the `qualified-git-write-path-rule.md` citation (replaced by the `git/SKILL.md` § Memory Access Matrix link). Listed as a finding; not separately fixed.

---

## 7. Open questions / risks (for the user)

- **OQ-1 (D2 deferral mechanics):** When the PR is deferred (no `gh`), where is the "PR deferred" notice surfaced and tracked — only as a user-facing message at Wrap-up, or also stamped into `session.json.git.pr` (e.g., a `"deferred"` sentinel vs. `null`)? The plan currently keeps `git.pr = null` + a user message. Confirm no schema field is wanted.
- **OQ-2 (orchestration L341 stale sentence):** The session-metadata git-block row says "The git workflow mode itself lives in `settings.json` and is not duplicated here." With direct mode dropped and no `git.workflow.mode` key in templates, this sentence is now misleading. Plan: delete that sentence. Confirm.
- **OQ-3 (branch regex strictness):** Use the strict 8-4-4-4-12 expansion `^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` (recommended) or the brief's looser `^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f-]{36}$`? Both planned-compatible.
- **OQ-4 (hooks/scripts parsing old branch shape):** No `.claude/` hook or script greps `chore/session-` (0 hits in the canonical sweep; hooks/scripts under `.claude/` were not in the grep set — executor should re-grep `.claude/hooks` + `.claude/scripts` for `chore/session` / `ssid` / the old branch regex before committing, as a belt-and-suspenders check). Flagged as a pre-commit verification, not a planned edit.
- **Risk — column-order contract (mistake `section-order-is-part-of-the-contract-not-just-the-set`):** the new column order `# | Action | Description | Refs | Agent` is an ordered contract. The Description column holds the long content (was `Action`); the new `Action` column holds the short title. Executor must not swap them or revert to the old single-column shape. The §3 draft fixes the order verbatim.
- **Risk — symlink edits:** edit canonical `.gobbi/projects/gobbi/skills/...` paths only; the `.claude/skills/...` mirrors update automatically (mistake `skills-mirror-symlinks-not-copies`). The Edit tool refuses symlink paths (mistake `edit-tool-refuses-symlink-paths`) — another reason to target canonical paths.
