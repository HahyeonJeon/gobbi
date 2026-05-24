# Sub-step D Design (iter1)

Leader iter 1, Sub-step D (Design) for the 2-task bundle `session-foundations-bundle-b` after T2 deferral. T2 design content is OUT OF SCOPE this loop and is not produced below.

Loaded skills: `principles`, `mistake`, `orchestration/workflow/ideation.md`, `ideation/SKILL.md`. Re-read for Sub-step D: `git/SKILL.md` + `git/conventions.md`, `orchestration/SKILL.md` Configuration Step 1, `preparation/SKILL.md` Core Principles narrow-exception, `session.template.json`, `session-start.sh`, `.claude/settings.json`. All four mistake files cited in Load Directives re-read. Staged references re-read: T1-E-1, T1-E-2, T3-E-1 (full text), T3-E-2 (full text); T1-E-4, T1-E-3, T3-E-3, T3-E-4 spot-checked.

Develop tip `1829fa3` (unchanged). Pre-resolved decisions (worktree-first uniform; session dir lives in worktree; mechanism (c) bash+jq verify-and-fix; hybrid step/phase/iter extraction) are taken as input; not re-opened.

This artifact is consumed at Sub-step D 6b (manager presents package to user). Approval converts these directional choices into the locked design which Planning will decompose.

---

## T1 — Worktree-first architecture (with NEW absorbed)

### Scenarios

#### Golden path

**G-1 — Feature session, worktree-first bootstrap, in-session generate-now skill ships in PR.**

The user types `/gobbi` for a feature session. Configuration Step 1 advances row-by-row. At the new row 5.5 (worktree creation; see Design Decision D-1) the manager runs P2 to create the worktree, then row 6 stamps `git.branch` + `git.worktreePath` in `session.json` (no longer `null`). All subsequent agents — leader, executor, evaluator, assistant — receive the worktree's absolute path as their `cwd` via delegation prompt. Ideation runs; Preparation runs and the user approves a `generate-now` skill. The narrow-exception promote-now (`preparation/SKILL.md:62`) copies `staging/skills/{slug}/SKILL.md` into `.gobbi/projects/{name}/skills/{slug}/SKILL.md` — and because `cwd` is the worktree, the write lands on the worktree branch automatically. The promote-now step now also performs `git add` + `git commit` (NEW absorbed; see Design Decision D-3). PR diff includes the skill body AND its `.claude/skills/{slug}` + `.agents/skills/{slug}` symlinks. Reviewer sees the complete artifact; merge ships it intact.

- Anchored to: T1-I-1 (proxy-rule failure mode), T1-I-2 (cwd-flips-at-Execution-start is the current bug), T1-I-3 (commit-on-branch is the structural completion of the existing exception), T1-E-1 (Claude Code runtime endorses per-session worktree isolation).

**G-2 — Session memory ships in the PR squash and lives on develop indefinitely.**

When the PR merges (squash + delete-branch per `git/SKILL.md` P5), the squashed commit on develop contains `.gobbi/projects/{name}/sessions/{date}-{ssid}/` — meaning every iteration's rawdata, staging, evaluation, session.json, settings.json, state.json, and transcript-iter*.jsonl files become part of develop's history. Worktree removal then deletes the worktree tree on disk but loses nothing — develop has the audit trail. Future sessions read prior session memory directly from develop's `.gobbi/projects/{name}/sessions/`.

- Anchored to: T1-I-5 (only session-dir is at risk, transcripts already in `~/`), T1-E-1 (runtime defers cross-session state to project), T1-E-2 (commit-at-session-boundaries — uncommitted = unrecovered).

#### Edge cases

**E-1 — Resume / `/clear` / `/compact` in the middle of a worktree-first session.**

SessionStart fires with matcher `startup|resume|clear|compact`. `session-start.sh` re-stamps `CLAUDE_CWD`, `CLAUDE_TRANSCRIPT_PATH`, etc. into `$CLAUDE_ENV_FILE`. The manager re-reads `gobbi/SKILL.md` Session Bootstrap Order and `orchestration/SKILL.md` § Step 1. Because the worktree was created at row 5.5 of the *original* Configuration run and `session.json.git.worktreePath` is already stamped, the manager **must not** re-create the worktree on resume — it `cd`s into the existing worktreePath and continues. Design Decision D-1 spells out the idempotency guard: row 5.5 reads `session.json.git.worktreePath` first and skips P2 if non-null and the path exists on disk.

- Anchored to: T1-I-2, T1-E-1, T1-E-4 (the discipline travels at the agent boundary — re-entry must be idempotent).

**E-2 — Non-feature session under the Scope Contract's "uniform for every session" lock.**

The user types `/gobbi` for an investigation / doc-only / mistake-promotion session. Per the Scope Contract lock (Sub-step B), the worktree-first procedure runs uniformly. The manager creates a worktree on a `chore/`-or-`docs/`-prefixed branch (per `git/conventions.md` branch naming). Session runs in the worktree; if no source-tree changes are produced, the only commit on the branch is the session-memory commit (per G-2 / D-4). The branch + worktree still go through P4 push + P5 merge so session memory ships to develop. This is heavier than the prior "main-tree direct" path; the user has locked this uniformity in Scope Contract Sub-step B and CP-1.3-γ Option A.

- Anchored to: T1-I-2 (uniform discipline), T1-E-2 (community caveat: 2-3 parallel sessions sustainable; flag for monitoring), counterfactual from Sub-step A forcing-question 5.

**E-3 — Wrap-up never reaches PR merge (session aborted mid-flight).**

The user aborts the session before Wrap-up promotes / pushes / opens the PR. Worktree is unmerged. Session memory lives only in the worktree branch's local commits and the on-disk worktree directory. Until the next merge / explicit cleanup, the data survives in `.git/worktrees/...` + the worktree tree. The user can resume in a new session and either push the abandoned branch, cherry-pick the session-memory commit onto develop, or run `git worktree remove` + `git branch -d` to discard. Design Decision D-4 makes the per-iteration session-memory commit cadence the survival mechanism — uncommitted Wrap-up data does NOT survive worktree removal, so the procedure must commit at iteration boundaries, not only at Wrap-up.

- Anchored to: T1-E-2 (rule 3 — commit at session boundaries; uncommitted = unrecovered).

#### Failure modes

**F-1 — Re-routing inversion: an evaluator with worktree `cwd` writes session memory relative to `cwd` (the worktree) — same shape as `codex-eval-session-write-path-nested-in-worktree` but inverted.**

Under the legacy rule, evaluators received "use main-tree absolute path" guidance; their `cwd` was the worktree, the manager passed the main-tree path, and the safety net was the explicit absolute path in the delegation prompt. Under worktree-first with session-dir-in-worktree, "relative to `cwd`" is now correct — but the inverse failure becomes possible: an evaluator that still applies the old "use absolute main-tree path" reflex from a stale skill copy or memory will write to the main tree, landing files at the OLD main-tree session dir which is no longer the current session's home. Mitigation in Design Decision D-2: `git/SKILL.md:33` rule is qualified (not removed) so it now reads "session writes use the *session.json.git.worktreePath* root when set, falling back to main tree for assets explicitly listed (transcript path)." Delegation prompts pass `git.worktreePath` from `session.json` rather than asserting "main tree."

- Anchored to: T1-I-1, T1-I-4 (the inverse witness — must not replicate), mistake `codex-eval-session-write-path-nested-in-worktree.md`.

**F-2 — Symlink lands on main tree because the manager runs the symlink-create step from a main-tree shell (resumed session, stale env).**

Resume / compaction could leave the manager's bash invocations defaulting to the repo root rather than the worktree. The promote-now step's `ln -sfn` invocations could land symlinks at `<repo-root>/.claude/skills/{slug}` instead of `<worktree>/.claude/skills/{slug}`. Mitigation: Design Decision D-3 specifies that the promote-now path resolution uses `$(git -C "$worktreePath" rev-parse --show-toplevel)` for all `ln` + `git add` targets — never `pwd`, never `$PWD`. The committed file paths are then guaranteed worktree-relative.

- Anchored to: `1829fa3` commit body (witness), T1-I-1, T1-I-3.

**F-3 — Worktree creation fails at row 5.5 (branch name collision, dependency install error, gitignore not configured).**

`git worktree add -b` returns non-zero. The manager has not yet stamped `git.branch`/`git.worktreePath` (those happen at row 6). The session is in a half-bootstrapped state. Mitigation: row 5.5 is fail-loud — manager surfaces the git error to the user via AskUserQuestion ("worktree creation failed: <error>. Recover via P6 or abort?") and does not advance to row 6. State machine is unchanged from today (Configuration is one pass; if it fails, the session does not enter Ideation). The recovery path is `git/SKILL.md` P6 (orphaned worktree cleanup) — already specified.

- Anchored to: `git/SKILL.md` P6, T1-I-2.

#### Adversarial

Not security-sensitive — no input boundary, no untrusted data flow. The worktree-first bootstrap is a path-routing change. The adversarial scenario column is therefore empty for T1. (The closest "adversarial-like" concern — a malicious skill body landing during promote-now — is governed by `preparation/SKILL.md`'s user-approval gate for `generate-now` decisions, which is unchanged. No new attack surface is opened.)

### Implementation checklist

Each item names the file edited + the type of edit + the anchored insight. Detailed mechanism (exact text, function bodies, line counts) deferred to Execution.

1. **Edit `.claude/skills/orchestration/SKILL.md` § Step 1 — Workflow Configuration table**: insert a new row 5.5 ("Create worktree (P2 wrapper) and stamp `git.worktreePath` for use by row 6") between current row 5 (state.json) and current row 6 (session.json stamp). Row 5.5 reads the resolved `git.workflow.mode` from settings (`direct` skips; `worktree-pr` runs P2). Row 5.5 is idempotent — if `session.json.git.worktreePath` is already set on resume, it `cd`s + skips creation. Row 6's existing text "if it is `worktree-pr`, leave `git.branch`/`git.worktreePath` as `null` until `git` creates the worktree" is rewritten to "stamp `git.branch` and `git.worktreePath` from the worktree just created in row 5.5." *(anchor: T1-I-2, T1-E-1)*

2. **Edit `.claude/skills/git/SKILL.md` § Memory Access Matrix row "Session notes / mistakes"**: qualify the "always write to the main tree absolute path" rule. New text reads: "session writes (notes, mistakes, project memory drafts) MUST use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when `worktreePath` is null (direct mode). Worktree-relative path construction (via `git -C "$worktreePath" rev-parse --show-toplevel`) is required for symlink + commit operations." *(anchor: T1-I-1, T1-I-4, F-1 mitigation)*

3. **Edit `.claude/skills/git/SKILL.md` § Critical rule — write paths (the paragraph at line 33)**: replace the "always main-tree" sentence with the qualified rule. Add an explicit pointer that transcript paths (`session.json.transcriptPath` = `~/.claude/projects/...`) live in the user's home and are not under either tree. *(anchor: T1-I-5)*

4. **Edit `.claude/skills/git/SKILL.md` § Procedures — P2 Create worktree**: P2's text is unchanged in body. Add a one-sentence note: "P2 is invoked from Configuration row 5.5 for worktree-first sessions, not from Execution start. The Execution-start invocation path is retired; executors are passed the existing `session.json.git.worktreePath`." *(anchor: T1-I-2, T1-E-4)*

5. **Edit `.claude/skills/preparation/SKILL.md` § Core Principles — narrow exception text (the paragraph at line 62)**: extend the promotion-path sentence to specify the worktree-branch commit. New text appends: "After the file copy, the manager (or its proxied executor) runs `git -C "$worktreePath" add <relative-paths>` for the skill body + both symlinks, then `git -C "$worktreePath" commit -m "<conventional commit subject>"` with the `AI-Provenance-Record:` trailer (per `git/conventions.md` § Commit Trailers). This commit lands on the worktree branch and is absorbed into the PR at merge." *(anchor: T1-I-3, T1-E-2, T1-DQ-3)*

6. **Edit `.claude/skills/gobbi/SKILL.md` § Session Bootstrap Order**: no semantic change but cross-reference the row 5.5 step (e.g., "Configuration Step 1 — see `orchestration/SKILL.md` § Step 1 for the row order including worktree creation"). Keep `gobbi/SKILL.md` as the front door per the current Entry Point split. *(anchor: T1-I-2, T1-E-1, T1-E-4)*

7. **Edit `.claude/CLAUDE.md` if and only if a load-discipline statement is affected**: NOT required by T1 directly. Skip unless a Sub-step D-driven decision (D-1 or D-2) introduces a new always-active rule.

8. **Append the per-iteration session-memory commit cadence rule to `.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` MEMORIZATION phase descriptions**: each loop's MEMORIZATION procedure gains a one-line "Before exit: `git add` + `git commit` the session-memory deltas under `sessions/{date}-{ssid}/` to the worktree branch with `chore(session): record <loop> iter{n} memory` subject. Skip if no deltas." *(anchor: T1-E-2 commit-at-session-boundaries, F-3 mitigation, G-2)*

9. **Update the existing direct-mode handling note** (`orchestration/SKILL.md` Step 1 row 6: "if the resolved git workflow mode is `direct`..."): no rewrite required; row 5.5's "skip if direct mode" guard preserves direct-mode behavior. Confirm direct mode still has its use case (emergency hotfix without worktree); the scope-contract lock is "worktree-first uniform" — meaning the *default* and *recommended* mode is worktree-first, with direct mode retained as an opt-out at session-settings level. (See Design Decision D-5.) *(anchor: counterfactual from Sub-step A forcing-question 5)*

10. **THIS-session migration exception**: this session bootstrapped under the old rules (cwd in main tree; worktree not yet created). T1's docs land on develop via the existing direct-vs-worktree-pr Execution flow for this session. Add a one-line note to the Execution-time wrap-up that flags this self-modifying session as the migration boundary. Future sessions starting from the next `/gobbi` will use the new row 5.5. NEW absorbed (commit-on-branch for any THIS-session Preparation `generate-now` skill) DOES apply if Preparation generates a skill — flag in the Sub-step D contribution points (none expected based on Sub-step C; the matrix work is T2 which is deferred). *(anchor: brief context paragraph "THIS session continues in main tree")*

### Design decisions

**D-1 — Configuration Step 1 row order: insert worktree creation as row 5.5 (between state.json init and session.json stamp). Idempotent — skip if `session.json.git.worktreePath` is already set on resume.**

- *Rationale.* Row 6 needs to stamp `git.branch` + `git.worktreePath` as non-null values (current text says "leave null until `git` creates the worktree" — that "until" is the bug). Worktree creation must therefore complete before row 6. Inserting as row 5.5 (rather than promoting to row 5) preserves the existing semantic where `state.json` is initialized first (row 5) so the bootstrap state is durable before any side-effect-heavy operation. The idempotency guard handles resume + `/clear` + `/compact` correctly (since the SessionStart hook fires on all four matchers per `.claude/settings.json:34`).
- *Anchored insights.* T1-I-2 (worktree-at-Execution-start is the legacy bug); T1-E-1 (runtime endorses per-session worktree); T1-DQ-2.
- *Trade-off considered.* Promote worktree-creation to row 5 (before state.json) — rejected because state.json being initialized first is the current contract and reordering it changes more than necessary.
- *Validation method.* **Future-session smoke test**: the next session starting from `/gobbi` after T1 ships emits a `session.json` with non-null `git.worktreePath` immediately after Configuration (verifiable by `jq '.git.worktreePath' .gobbi/projects/gobbi/sessions/<latest>/session.json`). Evaluator perspective check (Consistency): the orchestration table at Step 1 numerically reads 1 → 2 → 3 → 4 → 5 → 5.5 → 6 → 7 in order with no gaps. Manual check on the iter1 dispatch: this session's existing manual bootstrap is the migration witness.

**D-2 — `git/SKILL.md:33` rule: qualify rather than remove. The rule applies only to non-session-memory user-home assets (`session.json.transcriptPath` already lives in `~/.claude/projects/`).**

- *Rationale.* Removing the rule outright would re-open the `codex-eval-session-write-path-nested-in-worktree` failure mode (Codex evaluator wrote session memory to a worktree-NESTED path because cwd was worktree-root and no rule countered it). Qualifying — "use `session.json.git.worktreePath` as root, falling back to main-tree" — both eliminates the symlink-gap failure (`1829fa3`) and preserves a defensible default for direct mode + transcript-path handling. The transcript path is already in `~/.claude/projects/` so the qualified rule does not touch it.
- *Anchored insights.* T1-I-1 (proxy-rule); T1-I-4 (inverse mistake witness); T1-I-5 (transcript path is outside both trees).
- *Trade-off considered.* Remove the rule outright — rejected because the inverse failure has a documented witness (`codex-eval-session-write-path-nested-in-worktree.md`) and the qualified rule keeps the safety net for direct mode.
- *Validation method.* **Evaluator perspective check (Consistency)**: the new rule text matches in `git/SKILL.md` Memory Access Matrix + Critical rule paragraph + Delegation skill's "always-pass-this" instruction (no contradictory phrasings remaining). **Manual check**: `grep -rn "main tree absolute" .claude/skills/` returns ≤ 1 occurrence after the edit, all qualified.

**D-3 — NEW absorbed (commit-on-branch for promote-now): `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` runs as the closing step of the Preparation EXIT promote-now. Commit message: `chore(skills): promote {slug} generated by preparation iter{n}` (conventional grammar per `git/conventions.md`). Required `AI-Provenance-Record: gobbi://session/{session-id}/loop/preparation/promote-now` trailer.**

- *Rationale.* T1-I-3 establishes that the narrow-exception promote-now is already a sole-writer violation justified by in-session loadability; extending it to commit-on-branch is the structural completion of the same exception. The `-C "$worktreePath"` form is explicit about which tree the commit lands on, avoiding F-2. The conventional-commit grammar is locked by `git/conventions.md` and the `AI-Provenance-Record:` trailer is mandatory per `git/conventions.md` § Required trailers. Scope: covers the promoted skill body, the `.claude/skills/{slug}` symlink, the `.agents/skills/{slug}` symlink, AND any per-slug supporting files (e.g., `evaluation.md`) if the staged skill includes them.
- *Anchored insights.* T1-I-3; T1-E-2 (commit-at-session-boundaries discipline); `git/conventions.md` § Commit Trailers; T1-DQ-3.
- *Trade-off considered.* `chore(skills):` vs `feat(skills):` — chore is correct because the skill body is generated by the workflow's Preparation, not a user-facing feature. Subject scope `skills` matches the directory affected.
- *Validation method.* **Future-session smoke test**: the next Preparation `generate-now` session produces a worktree-branch commit with subject matching `^chore\(skills\): promote .*` and a body containing the `AI-Provenance-Record:` trailer. PR diff includes the skill body + both symlinks. **Evaluator perspective check (Project)**: the promote-now procedure's text in `preparation/SKILL.md:62` cites `git/conventions.md` § Commit Trailers for trailer authority. **Wrap-up verification gate**: pre-merge checklist (P5) gains a row "If session triggered any `generate-now` skill promotion, verify the promote-now commit lands on the worktree branch (not main tree)."

**D-4 — Per-iteration session-memory commit cadence: each loop's MEMORIZATION step ends with a worktree-branch commit recording the iteration's session-memory deltas (rawdata, staging, evaluation, transcripts).**

- *Rationale.* Worktree removal at P5 cleanup will discard uncommitted session-memory state. Per T1-E-2 rule 3, the only state that survives worktree removal is committed state. The Scope Contract locks session-dir-in-worktree, so the discipline must apply: commit at each iteration boundary so a half-complete session's data still ships to develop after merge. Cadence = per iteration (not per file, not per session) — matches the existing MEMORIZATION runs.
- *Anchored insights.* T1-E-2 (rule 3); T1-I-5 (session-dir-in-worktree is the at-risk surface); F-3 mitigation; E-3.
- *Trade-off considered.* Commit-once-at-Wrap-up — rejected because if the session aborts before Wrap-up the data is lost.
- *Validation method.* **Future-session smoke test**: after a multi-iteration loop (e.g., ideation iter1 + iter2), `git log --oneline` on the worktree branch shows two commits with subjects matching `^chore\(session\): record ideation iter[12] memory$`. **Evaluator perspective check (Risk)**: confirm the abort-mid-session edge case (E-3) is covered. **Manual check**: list the loop docs (`orchestration/workflow/*.md`) and confirm each MEMORIZATION phase has the new closing step.

**D-5 — Direct mode (worktree-first opt-out) is retained as a documented escape hatch.**

- *Rationale.* The user-locked Scope Contract says "uniform for every session" with worktree-first as the default. The Sub-step A forcing-question 5 counterfactual surfaced "what about emergency hotfix / pure read-only" — the answer must be that direct mode still works. Row 5.5's "skip if `git.workflow.mode` is `direct`" guard preserves this. No new code; the existing direct-mode path remains.
- *Anchored insights.* Sub-step A counterfactual / steel-man (forcing-question 5 + counter-evidence); `orchestration/SKILL.md:103` existing direct-mode text.
- *Trade-off considered.* Remove direct mode entirely — rejected because the Scope Contract lock is a *default*, not a *mandate*, and removing direct mode would force every session to go through worktree creation even when the user explicitly opts out.
- *Validation method.* **Evaluator perspective check (Consistency)**: the `git/SKILL.md` P2 "Create worktree" procedure and `orchestration/SKILL.md` Step 1 row 5.5 both reference `settings.git.workflow.mode` in the same way. **Manual check**: `grep -n "direct" .claude/skills/orchestration/SKILL.md .claude/skills/git/SKILL.md` returns the same conditional in both files.

### Validation strategy

| Decision | Validation method | Owner | Cadence |
|---|---|---|---|
| D-1 row 5.5 placement | Future-session smoke test on `session.json.git.worktreePath` non-null + evaluator Consistency perspective check | Next session post-merge + Execution-time evaluator | Once next session starts; then ongoing per Configuration |
| D-2 qualified `git/SKILL.md:33` rule | Evaluator Consistency check + `grep` audit for residual unqualified phrasings | Execution-time evaluator + manager Wrap-up | Once at PR review |
| D-3 NEW absorbed commit-on-branch | Future-session smoke test on next `generate-now` PR; PR P5 pre-merge gate row addition; evaluator Project perspective on `preparation/SKILL.md` | Next `generate-now` session + Execution-time evaluator | At next Preparation generate-now |
| D-4 per-iteration session-memory commit | Smoke test (`git log` subjects after iter1+iter2); evaluator Risk perspective on abort-recovery; doc grep across loop files | Execution-time evaluator + next multi-iter session | Once next multi-iter loop runs |
| D-5 direct-mode preservation | Consistency check across `orchestration/SKILL.md` + `git/SKILL.md` direct-mode handling | Execution-time evaluator | At PR review |

Cross-cutting: the docs-sync mistake (`claude-evaluator-step4-only-vs-codex-whole-file-grep.md`) mandates whole-file `grep` audits, not Step 4-only checks. The Execution-time evaluator MUST whole-file scan each touched skill file after T1 edits.

---

## T3 — PostToolUse hook + reconstructor

### Scenarios

#### Golden path

**G-1 — Subagent spawn completes; PostToolUse hook fires; `agents[]` gains a new entry with full telemetry.**

The manager spawns a leader / executor / evaluator / assistant via the Task tool. Claude Code's PostToolUse event fires with matcher `"Task"`. The hook script `.claude/hooks/post-tool-use-agents.sh` receives stdin JSON containing `session_id`, `transcript_path`, `cwd`, `tool_name="Task"`, `tool_use_id`, `tool_input` (with `subagent_type, description, model, prompt`), and `tool_result`. The hook:

1. Resolves the session dir from `session_id` + `cwd` (the session dir under `$cwd/.gobbi/projects/<name>/sessions/{date}-{session_id-prefix}/`; see Design Decision D-3-3 for the resolution algorithm).
2. Reads `$transcript_path` JSONL and finds the line whose `toolUseResult.tool_use_id == $tool_use_id` (or equivalent correlation).
3. Extracts `agentId`, `agentType`, `usage.{input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens}`, `totalDurationMs`, `toolStats`.
4. Extracts `model` from `tool_input.model` (passed via the hook stdin).
5. Parses `tool_input.prompt` for the structured headers (`Your phase:`, `Your iteration:`, `Your sub-step:`) per Design Decision D-3-4. Derives `step` from `phase` (`ideation`→`ideation`, `preparation`→`preparation`, etc.).
6. Upserts into `session.json.agents[]` keyed by `id = agentId`: if an entry with the same `id` exists, merge; otherwise append. Sets `finishedAt = <ISO-8601 now>`.

By session end, `agents[]` has 1 manager seed + N specialist entries — fully populated for ≥ 90% of fields.

- Anchored to: T3-I-1 (the empirical failure), T3-I-2 (transcript is the rich source), T3-I-3 (model + step/phase/iter come from `tool_input`), T3-I-4 (bash+jq stack), T3-I-5 (settings.json registration shape), T3-E-1 + T3-E-2 (verified contract).

**G-2 — Reconstructor runs at session-end or on-demand; verify-and-fix idempotent.**

The manager invokes `.claude/scripts/reconstruct-agents.sh <session-dir-path>` at Wrap-up (or any time the user asks). The script:

1. Reads `$session-dir/session.json` to learn existing agents[].
2. Reads `$session-dir/session.json.transcriptPath` (resolves `~` → `$HOME`).
3. Walks the transcript JSONL line-by-line, identifying every `toolUseResult` line with `agentId` non-null (the spawn telemetry).
4. For each transcript-discoverable spawn: upsert into agents[] by `id`. New spawns get appended; existing entries get merged (the hook-real-time write may have missing fields if the hook failed). Existing fields the hook already populated are preserved on conflict (transcript-derived value used only if the existing field is null).
5. Detects orphans: any `agents[]` entry whose `id` is not found in the transcript. Reports them to stdout (warn-only; does not delete — see Design Decision D-3-2).
6. Writes the merged agents[] back to session.json atomically (temp file + `mv`).

The script is idempotent — running it N times after any hook-failure scenario converges to the same final agents[] state.

- Anchored to: T3-I-2, T3-I-4, T3-E-2 (transcript is authoritative), T3-DQ-2 (verify-and-fix as the chosen algorithm).

#### Edge cases

**E-1 — Subagent spawn fails (tool errors, sandbox blocks, timeout) — PostToolUse vs PostToolUseFailure event.**

Per T3-E-4 the Claude Code lifecycle has both `PostToolUse` (success) and `PostToolUseFailure` (failure). For T3 mechanism (c), the hook should fire on every Task completion regardless of success — Design Decision D-3-3 picks: register the hook for BOTH events (`PostToolUse` matcher `Task` + `PostToolUseFailure` matcher `Task`). For failures, the hook still extracts whatever telemetry the transcript carries (failed spawns typically have partial usage telemetry but no `agentId` if the agent never started) and records `status: "failed"` in the agents[] entry. If the transcript lacks an `agentId` (the spawn never bound an agent ID), use `tool_use_id` as the synthetic `id` so the agents[] row is still uniquely identifiable for the reconstructor.

- Anchored to: T3-E-4 (lifecycle), T3-DQ-3 (failure handling), T3-I-1 (data-loss-is-the-failure-we're-fixing — failed spawns are part of the audit trail).

**E-2 — Hook fires twice for the same `tool_use_id` (rerun, retry, idempotency contract).**

Design Decision D-3-2 makes the hook upsert-by-id rather than append. Detection key is `agentId` (preferred) or `tool_use_id` (fallback). If an entry with the same key exists, the hook performs a field-merge with last-write-wins on non-null transcript values for `finishedAt`, `tokensUsed.*`, `toolStats`, etc. The first-write-wins fields are `startedAt` and `id` (immutable post-creation).

- Anchored to: T3-DQ-2 (verify-and-fix idempotency), `codex-rescue-agent-fire-and-forget-without-result-capture.md` (contract-assumption defensive lesson).

**E-3 — Manager's own seed entry in `agents[0]` must not be duplicated.**

The manager stamps `agents[0]` at Configuration row 6 with `type: "manager"`, `id: <manager session id>`. The hook reads the manager's `agentId` from the spawn's `tool_input` for the *spawned* subagents — these have distinct `agentId` values. The hook's upsert key `id` will not collide with `agents[0].id` because the manager is not spawned via Task. Belt-and-suspenders: Design Decision D-3-2 also adds an explicit guard — if the discovered `agentId == session.json.agents[0].id`, skip the upsert. The reconstructor applies the same guard. Manager seed is preserved by `type: "manager"` matching.

- Anchored to: T3-I-2 (agentId mapping), T3-DQ-2.

**E-4 — Worktree-first interaction: session dir is in the worktree, but the hook receives `cwd` — does it match the worktree path?**

Under T1 worktree-first, `cwd` of all agent processes (including the hook subprocess) is the worktree. The session dir is at `$worktreePath/.gobbi/projects/<name>/sessions/{date}-{ssid}/`. The hook's `cwd` stdin field matches `$worktreePath` directly. The session-dir resolver (D-3-3) builds the path as `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`. Under direct mode, `cwd` is the main tree and the path resolves correctly too. The hook does not need to know which mode is active — `cwd` is the always-correct root.

- Anchored to: T3-I-2 (cwd-relative path is the natural shape under T1), T1-I-2 (cwd flips at row 5.5 under worktree-first), T3-I-5 (settings.json shape).

#### Failure modes

**F-1 — Hook script crashes / `jq` parse error / transcript file not yet flushed.**

Per `session-start.sh` precedent (T3-I-4): strict mode `set -euo pipefail`, explicit guards for `[[ -n "$payload" ]]` and `[[ -n "${CLAUDE_TRANSCRIPT_PATH:-}" ]]` and readable-file check before `jq`. If the transcript line is not yet written (race between PostToolUse fire time and JSONL flush), the hook reads what's available; missing fields default via `jq` `// null`. Failed hook execution must not block the Task tool result from being returned to the manager. The script exits non-zero on guard failures (logged to stderr) but never blocks. The reconstructor (G-2) is the recovery mechanism — running it at Wrap-up backfills anything the hook missed.

- Anchored to: T3-I-4 (`session-start.sh` precedent), T3-E-3 (defensive jq + forward-compat), F-1 mitigation, T3-DQ-2 (verify-and-fix as recovery).

**F-2 — Schema drift: Claude Code minor version changes `toolUseResult` shape; the hook's `jq` expressions silently produce nulls.**

Per T3-E-3, the documented `TaskOutput` interface is the stable surface; the empirical `toolUseResult` is richer but not guaranteed to be stable. Design Decision D-3-1 specifies a two-tier extraction strategy: (a) **prefer** the rich transcript shape (`toolUseResult.{agentId,agentType,usage,totalDurationMs,toolStats}`); (b) **fall back** to the stable `tool_result.{usage,duration_ms}` from the hook stdin if the transcript fields are null. Defensive `// "fallback"` patterns throughout. The reconstructor uses the same two-tier strategy. If both tiers fail, log to stderr and record what is available (do not block).

- Anchored to: T3-E-3, T3-I-2 (transcript is rich but not contract), F-1 mitigation.

**F-3 — `$transcript_path` resolution fails (tilde-form path stored in `session.json.transcriptPath` doesn't match the hook's stdin `transcript_path` which is absolute).**

Two normalization rules: the hook's stdin `transcript_path` is always absolute (per the Claude Code hook contract); the manager stamps `session.json.transcriptPath` in tilde form (`~/.claude/projects/...`). The hook should use the absolute `$transcript_path` directly (not look up `session.json.transcriptPath`). The reconstructor reads `session.json.transcriptPath` and applies `s|^~|$HOME|` substitution before opening the file.

- Anchored to: T3-I-5 + `orchestration/SKILL.md` row 6 (tilde-form stamping convention), F-1 mitigation.

#### Adversarial

Not security-sensitive — the hook only reads its own session's transcript and writes to its own session's `session.json`. No untrusted-input boundary; the `tool_input.prompt` is the manager's own delegation prompt, not user-supplied. The transcript file lives in the user's home directory under Claude Code's own sandbox. No new attack surface.

### Implementation checklist

1. **Create `.claude/hooks/post-tool-use-agents.sh`**: bash + jq, strict mode (`set -euo pipefail`), shape cloned from `session-start.sh` (writability guards, stdin payload read, `@sh` shell-safe processing where command interpolation is involved). Script body sketches: read stdin → resolve session.json path via D-3-3 → if not Task tool, exit 0 → read transcript line by `tool_use_id` → extract fields with `jq` (two-tier defensive per D-3-1) → upsert agents[] entry → atomic write back. *(anchor: T3-I-4, T3-E-1, T3-E-2)*

2. **Create `.claude/scripts/reconstruct-agents.sh`**: bash + jq, takes a session-dir path as arg, walks transcript JSONL, upserts agents[] keyed by `id`, reports orphans, atomic-writes. Shares the field-extraction `jq` snippets with the hook (Design Decision D-3-2 specifies shared library — keep them inline for simplicity in iter1, factor to a sourced helper only if iter2 evaluation demands). *(anchor: T3-I-2, T3-DQ-2)*

3. **Edit `.claude/settings.json`**: add two new hooks blocks under `hooks`:
   - `PostToolUse` with matcher `"Task"` (per T3-E-1) and command `.claude/hooks/post-tool-use-agents.sh`.
   - `PostToolUseFailure` with matcher `"Task"` and command `.claude/hooks/post-tool-use-agents.sh` (same script handles success + failure via `tool_result.status` / `toolUseResult.status` field). *(anchor: T3-I-5, T3-E-4, E-1 mitigation)*

4. **Edit `.claude/skills/orchestration/SKILL.md` § Step 1 row 6**: the existing text mandates the manager append specialist entries. New text: "The manager's manual append discipline is superseded by the `PostToolUse` hook (`.claude/hooks/post-tool-use-agents.sh`) which appends specialist entries automatically after every Task tool completion. The manager runs `.claude/scripts/reconstruct-agents.sh` at Wrap-up to verify/repair agents[] against the transcript." *(anchor: T3-I-1, T3-I-3, T3-E-1)*

5. **Edit `.claude/skills/orchestration/SKILL.md` § Workflow Metadata § agents[] subsection** (the existing description of agents[] update points): replace the manual-append narrative with the hook + reconstructor description, citing the script paths and the field-extraction strategy. Cite this design decision document for the schema-drift defensive approach. *(anchor: T3-I-1, T3-I-3)*

6. **Edit `.claude/skills/delegation/SKILL.md`**: document the structured-header convention (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) under a new sub-section "Structured prompt metadata headers" near the Load Directives Block. State that these headers MUST appear in the first 10 lines of every delegation prompt, in this format, so the PostToolUse hook can extract them. List the canonical regex patterns the hook uses (`^Your phase: (\w+)$`, etc.) so future prompt authors stay aligned. *(anchor: T3-I-3, T3-DQ-4)*

7. **Add a backlog entry under `.gobbi/projects/gobbi/backlogs/` (staged for Wrap-up promotion)**: "Template extension — `session.json.agents[]` schema field `status`". Currently the schema implies happy-path; failed spawns need a status field per E-1. Defer the template update so this PR's scope stays at the docs + hook + script level. If the template needs the field immediately to avoid eval-perspective challenges, escalate via D-3-3 contribution point. *(anchor: T3-DQ-3, E-1 mitigation)*

8. **No edits to `session.template.json`** — per Sub-step A CP-4.1-γ Recommended, the template's existing schema is sufficient. The hook and reconstructor populate within the existing fields. Status field extension deferred to backlog (item 7). *(anchor: CP-4.1-γ confirmation in Sub-step C T3 design questions)*

### Design decisions

**D-3-1 — Hook authoring stack: bash + `jq`, modeled on `session-start.sh` (strict mode, writability + nonempty guards, `@sh` shell-safe quoting, defensive `// "fallback"` for forward-compat).**

- *Rationale.* T3-I-4 establishes `session-start.sh` as the established precedent. jq is already a hard project dependency. No new runtime is introduced. Defensive patterns mitigate schema drift (T3-E-3 forward-compat) without leaving the bash+jq layer. Node / Python would add runtime dependencies and break the precedent.
- *Anchored insights.* T3-I-4 (precedent); T3-E-3 (forward-compat); T3-DQ-1 confirmed.
- *Trade-off considered.* Node script (would require Node available + cross-platform shebang handling) — rejected. Python script — rejected (jq is leaner for the data-extraction work).
- *Validation method.* **Evaluator perspective check (Consistency)**: `head -1 .claude/hooks/post-tool-use-agents.sh .claude/scripts/reconstruct-agents.sh .claude/hooks/session-start.sh` returns the same shebang; `grep -n 'set -euo pipefail' ...` returns one match per script. **Single-script verifier**: running the hook against a captured fixture transcript produces the expected `agents[]` row.

**D-3-2 — Reconstructor algorithm: verify-and-fix (upsert by id; idempotent; orphan-report only, no delete).**

- *Rationale.* T3-DQ-2 surfaced three algorithms; (c) verify-and-fix is robust to both the empty-and-rebuild scenario (prior session shipped with `agents[]` length 1) and the partial-population scenario (the hook fired for some spawns but not others). Idempotency means running the script N times converges. Orphan-report-only (warn but don't delete) means a manually-added entry survives even if it doesn't appear in the transcript — preserving the manager's right to seed `agents[0]` and the user's right to hand-edit. Critical safety property.
- *Anchored insights.* T3-DQ-2; T3-I-1 (the empirical state); T3-I-2 (transcript is authoritative).
- *Trade-off considered.* (a) Scan-and-replace — rejected (deletes the manager seed if the transcript doesn't have a manager line, which it doesn't). (b) Append-only — rejected (cannot fix partial-field entries from hook failures).
- *Validation method.* **Single-script verifier**: run the reconstructor against a fixture session.json + transcript pair where 5 of 10 agents[] entries are pre-populated by the hook; verify post-run agents[] has 10 entries with merged fields and the manager seed preserved. **Evaluator perspective check (Risk)**: confirm idempotency by running twice; second run produces no diff.

**D-3-3 — Hook scope: register both PostToolUse + PostToolUseFailure with matcher `"Task"`. Single script handles both events (branches on event name / status field).**

- *Rationale.* T3-DQ-3 + E-1 — failed spawns are part of the audit trail; agents[] entries for failed spawns gain `status: "failed"`. T3-E-4 confirms both events are shell-command-compatible. Single script keeps maintenance burden low. The event name is available in stdin (`hook_event_name`) so branching is trivial. Failed-spawn entries use `tool_use_id` as the synthetic `id` when no `agentId` exists.
- *Anchored insights.* T3-E-4 (both events available); T3-DQ-3; E-1 scenario; `codex-rescue-agent-fire-and-forget-without-result-capture.md` (must capture results even on contract-violations).
- *Trade-off considered.* PostToolUse only — rejected (loses the failed-spawn audit row). Two separate scripts — rejected (DRY violation).
- *Validation method.* **Future-session smoke test**: artificially fail a spawn (e.g., invalid `subagent_type`); verify agents[] gains an entry with `status: "failed"` and a synthetic `id`. **Evaluator perspective check (Risk)**: confirm error-handling path is exercised.

**D-3-4 — Metadata extraction: hybrid — `model` from `tool_input.model`; `step / phase / iter / sub-step` parsed from `tool_input.prompt` via canonical structured headers. Convention codified in `delegation/SKILL.md`.**

- *Rationale.* T3-I-3 + T3-DQ-4 — `tool_input.model` is reliable (the manager always sets it via the Task tool's parameters). The prompt-text parse is fragile but works on every existing prompt (the headers are visible in this very brief and in every Sub-step delegation). Codifying the convention in `delegation/SKILL.md` ensures future prompts stay extractable. Regex `^Your (phase|iteration|sub-step|step): (.+)$` is forgiving but anchored.
- *Anchored insights.* T3-I-3; T3-DQ-4; T3-E-2 (empirically the headers exist in line 164's prompt).
- *Trade-off considered.* (b) JSON header comment block in every prompt — rejected (more invasive to existing prompt templates; the structured headers already work). (a) Parse-only without delegation/SKILL.md codification — rejected (the convention is currently implicit; without codification, future prompts may drop the headers and silently break the hook).
- *Validation method.* **Evaluator perspective check (Project)**: `delegation/SKILL.md` cites the regex patterns the hook uses + lists the headers as a MUST. **Single-script verifier**: run the hook against a fixture prompt with all four headers; verify the agents[] entry has correct `step/phase/iter/sub-step`. **Manual check**: `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/` should return one hit per loop (the templates Manager uses).

### Validation strategy

| Decision | Validation method | Owner | Cadence |
|---|---|---|---|
| D-3-1 bash+jq stack | Evaluator Consistency (file headers match) + single-script verifier on fixture | Execution-time evaluator + executor | At PR review + Execution-time fixture test |
| D-3-2 verify-and-fix reconstructor | Single-script verifier on 2-state fixture (empty + partial); idempotency double-run | Executor | Execution-time + integration test |
| D-3-3 dual-event hook scope | Future-session smoke test on artificial spawn failure; evaluator Risk perspective | Next-session manager + Execution-time evaluator | At PR review + on first failed Task call in next session |
| D-3-4 hybrid metadata extraction | Evaluator Project perspective on `delegation/SKILL.md` codification; single-script verifier on header parsing; grep audit | Execution-time evaluator + executor | At PR review |

Cross-cutting: per `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`, evaluators MUST whole-file scan `delegation/SKILL.md`, `orchestration/SKILL.md`, `.claude/settings.json`, and both new scripts for consistency — not just the changed-line diff.

---

## Cross-task observations + ordering

### T1 ↔ T3 dependencies

1. **T1's worktree-first `cwd` change is what makes T3's hook session-dir resolver simple.** Under T1, the hook's stdin `cwd` is the worktree root; the session dir is at `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid}/`. Without T1, the hook would need to detect "main tree vs worktree" and route accordingly. T1 lands first in the PR diff (docs edits), T3 follows (hook + script + settings.json edits). The PR's commit order should be docs-first then hook-first inside docs (so any commit-by-commit bisect leaves the docs and hooks aligned).

2. **NEW absorbed (D-3) extends the `git add` + `git commit` to the promote-now path. The hook does not write to git index** — it writes only to `session.json` (a session memory file). So T3 introduces no new git commit; it only adds rows to a single JSON file. The per-iteration session-memory commit (D-4) covers the persistence of those JSON-file changes to the worktree branch. T3's hook does NOT need to trigger a git commit itself; the loop's MEMORIZATION phase commits the rolled-up session-memory delta on exit.

3. **Both T1 and T3 touch `orchestration/SKILL.md` Step 1 — T1 row 5.5 + row 6 text; T3 row 6 manager-append narrative.** These edits are in the same section but are line-disjoint. Recommendation: single commit covering both edits to `orchestration/SKILL.md` rather than two interleaved commits, so the file's narrative reads cleanly post-merge.

4. **Evaluator implications.** Per `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` the evaluation step MUST whole-file scan the touched files. Files touched by T1+T3 (consolidated):
   - `.claude/skills/orchestration/SKILL.md` (T1 row 5.5 + T3 row 6 narrative + agents[] subsection)
   - `.claude/skills/git/SKILL.md` (T1 Memory Access Matrix + Critical rule + P2 note)
   - `.claude/skills/preparation/SKILL.md` (T1 narrow exception extension)
   - `.claude/skills/gobbi/SKILL.md` (T1 cross-reference)
   - `.claude/skills/delegation/SKILL.md` (T3 structured-headers convention)
   - `.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` (T1 D-4 per-iteration commit cadence — 5 files)
   - `.claude/settings.json` (T3 hooks block)
   - `.claude/hooks/post-tool-use-agents.sh` (new — T3)
   - `.claude/scripts/reconstruct-agents.sh` (new — T3)
   - `.gobbi/projects/gobbi/backlogs/<staged>` (T3 deferred schema-extension item)

   Total: ~10 doc edits + 2 new scripts + 1 settings edit + 1 staged backlog. All within the docs/hooks/scripts surface — no `packages/` code (matches Sub-step A observation 6).

5. **THIS-session migration**: this session bootstrapped under the legacy rule (cwd in main tree, no row 5.5). T1 + T3 edits land in this session's PR via the existing direct-or-worktree-pr Execution flow. The migration boundary is documented as a one-line Wrap-up note. The next `/gobbi` session post-merge will exercise both T1 (row 5.5 creates a worktree at Configuration) and T3 (the hook fires from the first Task spawn) — that session is the canonical end-to-end validation.

6. **The two evaluator perspectives that catch the most T1+T3 risks** (per the design above): **Consistency** (cross-file phrasing alignment for the qualified `git/SKILL.md:33` rule, the new orchestration table row 5.5, and the manager-append-vs-hook narrative) and **Risk** (the abort-mid-session edge case E-3, the partial-hook-failure-then-reconstructor-repair scenario, the failed-spawn audit-trail). Recommend the manager seed both perspectives explicitly in the Execution-time evaluation prompt.

### Ordering recommendation for Planning

Planning Loop should decompose T1+T3 into the following implementation tasks (high level; Planning decomposes further):

1. T1.a — Edit `orchestration/SKILL.md` (row 5.5 + row 6 rewrite + agents[] narrative — T1 + T3 combined)
2. T1.b — Edit `git/SKILL.md` (Memory Access Matrix + Critical rule + P2 note + qualified rule)
3. T1.c — Edit `preparation/SKILL.md` (narrow-exception extension with commit-on-branch)
4. T1.d — Edit `gobbi/SKILL.md` (cross-ref) + 5 workflow loop docs (per-iteration commit cadence)
5. T3.a — Create `.claude/hooks/post-tool-use-agents.sh` (new file)
6. T3.b — Create `.claude/scripts/reconstruct-agents.sh` (new file)
7. T3.c — Edit `.claude/settings.json` (hooks block addition)
8. T3.d — Edit `delegation/SKILL.md` (structured-header convention)
9. T3.e — Stage `.gobbi/projects/gobbi/backlogs/<schema-extension-status-field>` (backlog item)

Implementation tasks sequence (per `agents/leader.md` planning discipline: implementation tasks SEQUENCE, only investigation/research/eval parallelize). T1.a-T1.d before T3.a-T3.e because T1 changes the `cwd` semantics the hook relies on. Inside T3, T3.a + T3.b can share an executor since they share the field-extraction jq snippets.

---

## Contribution points (if any remain for manager to AskUserQuestion)

The Sub-step D directional decisions above lock without re-opening Scope Contract items. Two items are flagged for the manager's optional confirmation — neither is a blocker; defaulting to the leader's recommendation is acceptable in Auto Mode.

**CP-D-1 — Hook + PostToolUseFailure dual registration confirmation.**

> **Decision**: D-3-3 picks dual registration (PostToolUse + PostToolUseFailure, same script). Is this the right scope?
>
> **Description**: Failed spawns are part of the audit trail per E-1 and per the `codex-rescue-agent-fire-and-forget-without-result-capture.md` defensive lesson. But the existing template implies happy-path (no `status` field). The leader recommends adding a `status: "failed"` field via the deferred backlog item (checklist item 7), leaving the template extension to a future session. User confirms the scope (dual registration this session; template extension deferred) or refines.
>
> **Options**:
> - **(Recommended) Dual registration this session; template extension deferred to backlog.** Reason: covers the audit trail mechanically; the schema accommodates `status` as an extra-property without template change (the runtime JSON merging is permissive); deferred backlog item closes the loop in a future session. Pros: ships the safety net now. Cons: agents[] entries for failed spawns have an "extra" field until the template formally accepts it.
> - **Single registration (PostToolUse only); skip failed-spawn audit.** Reason: tighter scope; happy-path only. Pros: smallest PR. Cons: loses the audit trail for failures (the canonical witness that motivates this task in the first place).
> - **Dual registration + template extension THIS session.** Reason: complete the schema in one PR. Pros: clean docs/template alignment. Cons: scope creep; needs schema version bump (template.json schemaVersion 1 → 2) and migration of any in-flight session.json files.

**CP-D-2 — Per-iteration session-memory commit subject scope.**

> **Decision**: D-4 specifies commit subject `chore(session): record <loop> iter{n} memory`. Is `chore(session):` the right type+scope, or should it be `chore(memory):` / `chore:` / `docs:`?
>
> **Description**: Conventional-commits scope (per `git/conventions.md` § Scope discipline) "matches the task's domain stated in the delegation prompt." The per-iteration session-memory commit is generated by the loop's MEMORIZATION phase, not by a user-facing task. The leader picks `chore(session):` because `session` matches `sessions/` directory + is unambiguous. User confirms or refines.
>
> **Options**:
> - **(Recommended) `chore(session):` matching the `sessions/` directory.** Reason: precise scope; matches what the commit touches. Pros: descriptive. Cons: introduces a new scope token never previously used.
> - **`chore(memory):` matching the broader concept of project / session memory.** Reason: aligns with "memorization" loop phase. Pros: name aligns with phase. Cons: less precise about *which* memory.
> - **`chore:` no scope.** Reason: minimal. Pros: simplest. Cons: less informative in `git log`.

Neither contribution point blocks Planning. The leader recommends defaulting to (Recommended) for both unless the user has a preference.
