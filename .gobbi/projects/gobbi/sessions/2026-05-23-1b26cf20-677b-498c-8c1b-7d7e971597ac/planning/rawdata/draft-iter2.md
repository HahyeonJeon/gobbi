# Planning iter2 — Draft

Phase: planning
Iter: 2 (maxIterations=3; budget remaining: 1 after this iter)
Bundle: `session-foundations-bundle-b` — T1 worktree-first session architecture (with NEW absorbed) + T3 PostToolUseFailure hook + reconstructor. T2 deferred.
Sub-steps executed in one pass: A (readiness confirmation) → B (file map + tasks) → C (deps + lanes) → D (agent assignments).
Self-review (Sub-step E) embedded as the final section before "NOT in scope".

**Status note (iter2 REVISE pass):** This draft is a surgical delta on `draft-iter1.md`. iter1 closed REVISE on 5 surgical findings (Fix 1-5 below). Modified sections only: (a) Task 03 `what` (Fix 4 — rollback semantics align with Ideation:283); (b) Tasks 07 + 08 `verifies` (Fix 5 — `shellcheck` made conditional with `bash -n` fallback); (c) Task 07 + 10 `requires` and § Dependency table (Fix 2 — LOCK #1 graph enforcement); (d) § Agent assignment table Task 09 row (Fix 3 — remove `stub-redirect-format.md` citation); (e) § Execution intake notes Edit-tool default block (Fix 1 — restore command depth corrected to `../../../`, with verify-against-adjacent-symlink note); (f) § Decisions log rows 11-15 (one per fix). All other sections copied verbatim from iter1.

---

## Scope reference (Ideation + Preparation canonical artifacts)

**Ideation canonical (PASS iter3):**
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`

**Preparation canonical (PASS iter3):**
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/artifacts/preparation.md`

**Locked decision artifacts (Preparation staging):**

- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` — mirror canonical / workspace symlink layer + symlink-preservation edit contract (Edit tool default; `sed -i` / `perl -i` forbidden on workspace; canonical mirror path for bulk rewrites; `test -L` post-edit gate).
- `preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md` — every T1 task brief tier-4 Load Directives MUST cite three mistakes (paths enumerated below in Agent assignment table).
- `preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` — 5-file phase doc set (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md` only — NOT `evaluation.md` / `memorization.md`).

**Scope Contract — verbatim from Ideation artifact § Scope Contract:**

- **Project**: gobbi
- **Feature**: `session-foundations-bundle-b`
- **Task (in-scope)**:
  - **T1 — Worktree-first session architecture** with NEW (Preparation `generate-now` symlink commit-on-worktree-branch) absorbed. Edits to `.claude/skills/{orchestration,git,preparation,gobbi}/` plus per-loop MEMORIZATION cadence rule.
  - **T3 — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.** New `.claude/hooks/post-tool-use-agents.sh`, `.claude/scripts/reconstruct-agents.sh`, `.claude/settings.json` registration block, `delegation/SKILL.md` structured-header convention, `orchestration/SKILL.md` narrative replacement.
- **Out-of-scope** (selected): T2 skill-loading-discipline matrix, Codex CI, Auto-mode silence vs Always-Ask, chat-mode tiki-taka, Item 1-3 alternatives, Item 1-2 broader verifier, `agents[]` status field schema extension, `.gobbi/project.json` bootstrap (dormant resolver step-i precondition).

---

## Sub-step A — Readiness confirmation

**Scope still valid?** YES — bundle is still T1 + T3 (T2 deferred mid-Ideation per Scope Contract). No re-Ideate trigger surfaced during Preparation iter1+iter2+iter3.

**Preparation gaps all closed?** YES (per Preparation iter3 § Readiness summary):

- 2 generate-now decisions produced staged artifacts (D-3 mistake-load directive + D-4 phase doc set design).
- 3 defer-to-backlog items staged (D-2 hooks-domain mistakes watchlist, D-6 aggregated session-lifecycle design doc, D-7 `gobbi-hook-authoring` skill, plus iter3 NEW ci-symlink-integrity-check).
- 4 skip items recorded with rationale (D-1, D-5, D-8, D-9).
- 0 re-Ideate triggers.

**Pre-locked decisions imported (do NOT re-litigate):**

- T1 bundle = T1 + T3 (T2 deferred).
- Mirror policy = mirror canonical, workspace symlink layer.
- Edit contract = Edit tool default; `sed -i` / `perl -i` forbidden on workspace; canonical mirror path for bulk rewrites; `test -L` post-edit verification gate.
- 5 phase docs only for per-iter cadence rule (sub-phase docs `evaluation.md` + `memorization.md` excluded per D-4 § Excluded files).
- Hook contract verified: PostToolUse matcher `Task` receives `tool_input` + `tool_result` + `transcript_path`; PostToolUseFailure officially documented (Fix B verbatim).
- Branch naming `chore/session-{date}-{ssid-short}` (registry-compliant `chore` type, 27 chars).
- Per-iter commit subject `chore(session): record <loop> iter{n} memory`.
- Promote-now commit subject `chore(skills): promote {slug} generated by preparation iter{n}` with canonical `AI-Provenance-Record:` trailer `gobbi://session/{ssid}/task/{task-id}`.

**Task seed set (in-scope checklist items, verbatim from Ideation § Implementation Checklist):**

T1: T1.a, T1.b, T1.c, T1.d, T1.e, T1.f, T1.g, T1.h, T1.i, T1.j (10 items)
T3: T3.a, T3.b, T3.c, T3.d, T3.e, T3.f, T3.g, T3.h (8 items)

Total seed-checklist anchors: 18 → packed into 10 planning tasks per Sub-step B below (multi-anchor consolidation where files overlap).

**Notes for Planning intake (carried from Preparation iter3 § Notes for Planning intake):**

- Path correction: `session.template.json` lives at `.claude/skills/orchestration/templates/session.template.json` (NOT `.claude/templates/...`).
- Iron Law 7 procedural reminder for manager: Read Ideation artifact freshly when constructing any "verbatim" T1 brief instruction (`manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`).
- D-4 verification gate: Planning's T1-I-T1.f task brief should include the dual grep — expect 5 matches in the 5 loop docs + 0 matches in `evaluation.md` / `memorization.md`.
- Bundle A handoff anchor: `notes/2026-05-23-orch-workflow-improvements.md` "Open items carried" pre-declares this bundle.

**Open gap surfaced this sub-step:** none. Advance to Sub-step B.

---

## File map

Files grouped by feature concern. Op codes: `create` (new file), `modify` (edit existing).

### Group F1 — Workflow phase docs (5 files, identical surgical edit)

Per D-4 design file, only the 5 loop docs receive the per-iter commit cadence rule. Canonical mirror paths (workspace paths are symlinks resolving here):

| Path | Op | Responsibility |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/workflow/ideation.md` | modify | Add per-iter cadence rule at MEMORIZATION exit |
| `.gobbi/projects/gobbi/skills/orchestration/workflow/preparation.md` | modify | Same |
| `.gobbi/projects/gobbi/skills/orchestration/workflow/planning.md` | modify | Same |
| `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md` | modify | Same |
| `.gobbi/projects/gobbi/skills/orchestration/workflow/wrap-up.md` | modify | Same |

Workspace equivalents (symlinks; cited in briefs for discoverability — single Edit on workspace path updates canonical via symlink traversal):
`.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md`

### Group F2 — Worktree-first session architecture surfaces (T1 doc edits)

| Path | Op | Responsibility |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | modify | Configuration Step 1 row 5.5 insertion (worktree create branch `chore/session-{date}-{ssid-short}` with idempotency guard); row 5.5 footnote (direct-mode opt-out per LOCK #5); row 6 `agents[]` narrative replacement (hook-based, supersedes manual append); cross-references to git/preparation/gobbi changes |
| `.gobbi/projects/gobbi/skills/git/SKILL.md` | modify | Memory Access Matrix row 31 qualified rule (use `worktreePath` when set; fallback main tree); Critical rule paragraph at line 33 qualifier; P2 invocation note (invoked from Configuration row 5.5) |
| `.gobbi/projects/gobbi/skills/preparation/SKILL.md` | modify | Narrow-exception extension: `generate-now` promotion commits to worktree branch via `git -C "$worktreePath" add` + `git -C "$worktreePath" commit` with `chore(skills): promote {slug} generated by preparation iter{n}` + canonical `AI-Provenance-Record:` trailer; rollback semantics for partial promotion failure co-located with the narrow-exception text (T1.j; per LOCK #4) |
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | modify | Session Bootstrap Order cross-reference to orchestration row 5.5 |
| `.gobbi/projects/gobbi/skills/delegation/SKILL.md` | modify | (a) main-tree-boilerplate grep audit per T1.i — qualify any "main tree path" boilerplate against worktree-active case; (b) T3 structured-header convention for `phase`/`iter`/`step` extraction from `tool_input.prompt`; (c) `flock -x` documentation note (T3.g) |

### Group F3 — PostToolUseFailure hook + reconstructor (T3 new artifacts)

| Path | Op | Responsibility |
|---|---|---|
| `.claude/hooks/post-tool-use-agents.sh` | create | bash + jq + `flock -x` hook script; reads PostToolUse / PostToolUseFailure stdin payload; extracts `tool_use_id`, `tool_input` (model + structured-header phase/iter/step), `tool_result` (status, timestamps, optionally rich `toolUseResult` from `transcript_path`); upserts `session.json.agents[]` entry by `tool_use_id`; serialized via `flock` on `session.json` |
| `.claude/scripts/reconstruct-agents.sh` | create | bash + jq + `flock -x` verify-and-fix reconstructor; idempotent; replays transcript jsonl looking for Task tool spawns; upserts missing `agents[]` entries by `tool_use_id`; orphan-report-only (never deletes) |
| `.claude/settings.json` | modify | Add PostToolUse `Task` matcher block + PostToolUseFailure `Task` matcher block, both invoking `.claude/hooks/post-tool-use-agents.sh` |

### Group F4 — Backlog stage (T3.f, T3.h: already staged in Preparation; verify only)

No executor work. Verification: confirm `staging/backlogs/feature/schema-extension-agents-status-field.md` (T3.f) and `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` (T3.h) exist (already created during Ideation per Preparation iter3 readiness).

---

## Task table (Tasks)

10 tasks total. Each task is medium-granularity (2-5 files OR single substantial edit OR script authoring). Canonical YAML schema per `planning/SKILL.md` Sub-step B step 4.

### Task 01 — T1.a + T1.d (partial) — Configuration Step 1 row 5.5 worktree creation

```yaml
id: 01-orchestration-row-5-5-worktree-create
what: Insert "row 5.5" in orchestration/SKILL.md Configuration Step 1 table — invokes git P2 to create the worktree at branch chore/session-{date}-{ssid-short} with idempotency guard skipping if session.json.git.worktreePath is non-null. Stamp worktreePath + branch into session.json at row 6 (already present; verify ordering).
traces-to:
  - "T1-I-T1.a — Insert row 5.5 in orchestration/SKILL.md with branch name chore/session-{date}-{ssid-short}"
  - "T1-I-T1.c — git/SKILL.md P2 note: invoked from Configuration row 5.5"
requires: []
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
inputs: []
outputs:
  - row-5-5-narrative
  - branch-naming-spec
verifies:
  - "grep -E 'chore/session-\\{date\\}-\\{ssid-short\\}' .claude/skills/orchestration/SKILL.md returns ≥1 match"
  - "test -L .claude/skills/orchestration/SKILL.md (symlink integrity gate)"
  - "Manual: Configuration Step 1 table shows new row between row 5 and row 6 with idempotency guard text"
effort: Medium
```

### Task 02 — T1.b + T1.c — git/SKILL.md Memory Access Matrix qualifier + P2 invocation note

```yaml
id: 02-git-skill-worktree-path-qualifier
what: Qualify git/SKILL.md Memory Access Matrix row 31 + Critical rule paragraph at line 33 — when session.json.git.worktreePath is set, session writes resolve to {worktreePath}/.gobbi/projects/{name}/sessions/...; when null (direct mode), fall back to main tree absolute path. Add P2 invocation note pointing at Configuration row 5.5.
traces-to:
  - "T1-I-T1.b — Qualify git/SKILL.md:33 rule to use session.json.git.worktreePath when set"
  - "T1-I-T1.c — git/SKILL.md P2 note: invoked from Configuration row 5.5"
requires: [01-orchestration-row-5-5-worktree-create]
files:
  - {path: ".gobbi/projects/gobbi/skills/git/SKILL.md", op: modify}
inputs:
  - row-5-5-narrative
outputs:
  - worktree-path-qualifier-rule
verifies:
  - "grep -E 'worktreePath' .claude/skills/git/SKILL.md returns ≥2 matches (matrix + critical-rule paragraph)"
  - "test -L .claude/skills/git/SKILL.md"
  - "Manual: row 31 ('Session notes / mistakes') now reads 'worktree path when set; main tree when null'"
effort: Small
```

### Task 03 — T1.d + T1.j — preparation/SKILL.md generate-now commit-on-branch + rollback semantics (LOCK #4 consolidation; Fix 4 alignment with Ideation:283)

```yaml
id: 03-preparation-generate-now-commit-on-branch
what: Extend preparation/SKILL.md narrow-exception to add the two-line git -C "$worktreePath" add + git -C "$worktreePath" commit promote-now path with canonical AI-Provenance-Record trailer (gobbi://session/{ssid}/task/{task-id}). Per LOCK #4, document rollback semantics for partial promotion failure co-located with the narrow-exception text in this same SKILL.md — NOT in git/SKILL.md. Rollback sequence per Ideation iter3 draft line 283 (T1-I-T1.j) and § Decision D-3 (line 322 — "Partial-failure rollback"): if `git commit` fails post-copy, the manager MUST `git -C "$worktreePath" rm <copied-paths>` to remove the copied skill body before AskUserQuestion surfaces the failure to the user; re-attempt or abort follows the user's response. The rollback explicitly REMOVES the copied file (no "git checkout" restore, no auto-revert — copied file did not pre-exist in the worktree, so removal is the correct restoration). Cite Ideation:283 verbatim in the executor brief.
traces-to:
  - "T1-I-T1.d — preparation/SKILL.md narrow-exception: git -C \"$worktreePath\" add + git -C \"$worktreePath\" commit with canonical AI-Provenance-Record trailer"
  - "T1-I-T1.j — Rollback semantics for promote-now git commit failure (per LOCK #4 → preparation/SKILL.md, co-located with narrow exception; per Ideation:283 — git -C \"$worktreePath\" rm copied-paths + AskUserQuestion + re-attempt-or-abort)"
requires: [01-orchestration-row-5-5-worktree-create, 02-git-skill-worktree-path-qualifier]
files:
  - {path: ".gobbi/projects/gobbi/skills/preparation/SKILL.md", op: modify}
inputs:
  - worktree-path-qualifier-rule
outputs:
  - generate-now-promote-commit-pattern
  - rollback-semantics-block
verifies:
  - "grep -E 'git -C \"\\$worktreePath\"' .claude/skills/preparation/SKILL.md returns ≥3 matches (add + commit + rm rollback)"
  - "grep -E 'chore.skills.: promote' .claude/skills/preparation/SKILL.md returns ≥1 match"
  - "grep -E 'gobbi://session/' .claude/skills/preparation/SKILL.md returns ≥1 match"
  - "grep -E 'git -C \"\\$worktreePath\" rm' .claude/skills/preparation/SKILL.md returns ≥1 match (rollback removes copied file)"
  - "grep -E 'AskUserQuestion' .claude/skills/preparation/SKILL.md returns ≥1 match co-located with the rollback paragraph"
  - "test -L .claude/skills/preparation/SKILL.md"
effort: Medium
```

### Task 04 — T1.e + T1.i — gobbi/SKILL.md cross-reference + delegation/SKILL.md main-tree boilerplate audit

```yaml
id: 04-gobbi-and-delegation-cross-ref-and-audit
what: Add gobbi/SKILL.md "Session Bootstrap Order" cross-reference pointer to orchestration row 5.5. Run delegation/SKILL.md grep audit per T1.i; identify every "main tree" boilerplate sentence; qualify each to acknowledge worktree-active case while preserving the read-only "session writes resolve to main tree" claim for direct mode.
traces-to:
  - "T1-I-T1.e — gobbi/SKILL.md Session Bootstrap Order cross-reference"
  - "T1-I-T1.i — delegation/SKILL.md grep audit for main-tree boilerplate"
requires: [01-orchestration-row-5-5-worktree-create, 02-git-skill-worktree-path-qualifier]
files:
  - {path: ".gobbi/projects/gobbi/skills/gobbi/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/delegation/SKILL.md", op: modify}
inputs:
  - row-5-5-narrative
  - worktree-path-qualifier-rule
outputs:
  - bootstrap-order-cross-ref
  - delegation-main-tree-audit-result
verifies:
  - "grep -E 'row 5.5|Configuration Step 1' .claude/skills/gobbi/SKILL.md returns ≥1 match"
  - "grep -nE 'main.tree' .claude/skills/delegation/SKILL.md  — every match site checked + qualified (audit log in commit body)"
  - "test -L .claude/skills/gobbi/SKILL.md && test -L .claude/skills/delegation/SKILL.md"
effort: Small
```

### Task 05 — T1.f — Per-iter commit cadence in 5 workflow phase docs

```yaml
id: 05-five-phase-docs-per-iter-cadence
what: Add uniform "Per-iteration session-memory commit cadence" rule to the MEMORIZATION exit section of the 5 loop docs (ideation, preparation, planning, execution, wrap-up). Substance per D-4 design file Approach section — chore(session) commit-subject + canonical AI-Provenance-Record trailer + git -C "$worktreePath" commit invocation. Do NOT edit evaluation.md or memorization.md (per D-4 Excluded files + rationale).
traces-to:
  - "T1-I-T1.f — Per-iteration session-memory commit cadence in all 5 workflow phase docs"
requires: [01-orchestration-row-5-5-worktree-create, 03-preparation-generate-now-commit-on-branch]
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/ideation.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/preparation.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/planning.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/execution.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/wrap-up.md", op: modify}
inputs:
  - generate-now-promote-commit-pattern
outputs:
  - per-iter-cadence-rule-block
verifies:
  - "grep -l 'chore(session): record .* iter.* memory' .claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md returns 5 paths"
  - "grep -lE 'chore.session.: record .* iter' .claude/skills/orchestration/workflow/{evaluation,memorization}.md returns 0 paths"
  - "for f in ideation preparation planning execution wrap-up; do test -L .claude/skills/orchestration/workflow/$f.md; done — all pass"
effort: Medium
```

### Task 06 — T1.g + T1.h — Direct-mode opt-out footnote + smoke-test gate (LOCK #5 consolidation)

```yaml
id: 06-direct-mode-opt-out-and-smoke-test
what: Per LOCK #5, document the direct-mode opt-out path in orchestration/SKILL.md as a row 5.5 footnote — "If workflow.git.mode = 'direct', row 5.5 is skipped and worktreePath remains null." Co-locate the T1-I-T1.h smoke-test gate documentation — jq '.git.branch' matches ^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$ — next to the same row 5.5 footnote. Doc home is orchestration/SKILL.md row 5.5 footnote, NOT git/SKILL.md.
traces-to:
  - "T1-I-T1.g — Direct-mode preserved as opt-out (per LOCK #5 → orchestration/SKILL.md row 5.5 footnote)"
  - "T1-I-T1.h — Smoke test gate: jq '.git.branch' matches regex (co-located with row 5.5 footnote)"
requires: [01-orchestration-row-5-5-worktree-create]
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
inputs:
  - row-5-5-narrative
outputs:
  - direct-mode-opt-out-footnote
  - smoke-test-gate-spec
verifies:
  - "grep -E 'direct.*mode|workflow.git.mode' .claude/skills/orchestration/SKILL.md returns ≥1 match co-located with row 5.5"
  - "grep -E 'chore/session-\\[0-9\\]\\{4\\}' .claude/skills/orchestration/SKILL.md returns ≥1 match (regex documented)"
  - "test -L .claude/skills/orchestration/SKILL.md"
effort: Small
```

### Task 07 — T3.a + T3.g (partial) — `post-tool-use-agents.sh` hook script (LOCK #2: shared executor with Task 08; LOCK #1 graph-enforced via requires: [05, 06])

```yaml
id: 07-post-tool-use-agents-hook-script
what: Create .claude/hooks/post-tool-use-agents.sh — bash + jq + flock -x hook script invoked from PostToolUse + PostToolUseFailure Task-matcher blocks. Reads stdin JSON payload (tool_name=Task; tool_use_id; tool_input.prompt; tool_input.model; tool_result; transcript_path); two-tier extraction (prefer rich toolUseResult from transcript_path; fallback to tool_result fields); structured-header parsing for phase/iter/step from tool_input.prompt; upserts session.json.agents[] entry keyed by tool_use_id; orphan-report-only on missing fields; resolves session dir via D-3-3-resolver step (ii) directory scan fallback (step (i) project.json dormant — Fix C). Header comments codify the bash strict-mode + flock + jq conventions (per Preparation D-9 skip rationale — codify in script header until N≥2). Per LOCK #2, this task and Task 08 share a single executor delegation back-to-back to preserve jq snippets + stdin-contract context.
traces-to:
  - "T3-I-T3.a — Create .claude/hooks/post-tool-use-agents.sh (bash + jq, flock, two-tier, upsert by id)"
  - "T3-I-T3.g — Document flock -x in delegation/SKILL.md and hook comment block"
requires: [05-five-phase-docs-per-iter-cadence, 06-direct-mode-opt-out-and-smoke-test]
files:
  - {path: ".claude/hooks/post-tool-use-agents.sh", op: create}
inputs: []
outputs:
  - hook-script-artifact
  - shared-jq-snippets
  - hook-stdin-contract
verifies:
  - "bash -n .claude/hooks/post-tool-use-agents.sh returns exit 0 (syntax check — ALWAYS run; bash is universally available)"
  - "If shellcheck is available (command -v shellcheck && shellcheck --version): run shellcheck .claude/hooks/post-tool-use-agents.sh and require exit 0 OR documented suppressions. If shellcheck is NOT available (empirical at planning-iter2 time: shellcheck absent from this workspace), fall back to bash -n above and note the omission in the commit body so a future CI run can re-gate."
  - "Hook header comment block contains: bash strict-mode line, flock -x rationale, jq-stdin pattern, D-3-3-resolver step (ii) note"
  - "echo '{}' | bash .claude/hooks/post-tool-use-agents.sh — exits gracefully (no-op on empty payload; no crash)"
  - "Smoke test (manual): inject a fixture stdin JSON with a synthetic tool_use_id; confirm session.json.agents[] gains the upsert"
effort: Large
```

### Task 08 — T3.b — `reconstruct-agents.sh` verify-and-fix reconstructor (LOCK #2: shared executor with Task 07)

```yaml
id: 08-reconstruct-agents-script
what: Create .claude/scripts/reconstruct-agents.sh — bash + jq + flock -x verify-and-fix reconstructor. Reads transcript jsonl (path argv or $CLAUDE_TRANSCRIPT_PATH), iterates Task tool spawn events, upserts missing session.json.agents[] entries by tool_use_id (shares jq snippets with Task 07's hook). Idempotent — re-running on a complete session.json is a no-op. Orphan-report-only — never deletes existing entries. mkdir -p .claude/scripts/ at task start (per D-5 skip rationale). Per LOCK #2, executed by the same executor as Task 07 (back-to-back within one delegation) to preserve shared jq snippets + hook stdin contract in working context.
traces-to:
  - "T3-I-T3.b — Create .claude/scripts/reconstruct-agents.sh (flock, verify-and-fix, idempotent)"
requires: [07-post-tool-use-agents-hook-script]
files:
  - {path: ".claude/scripts/reconstruct-agents.sh", op: create}
inputs:
  - shared-jq-snippets
  - hook-stdin-contract
outputs:
  - reconstructor-artifact
verifies:
  - "bash -n .claude/scripts/reconstruct-agents.sh returns exit 0 (syntax check — ALWAYS run; bash is universally available)"
  - "If shellcheck is available (command -v shellcheck && shellcheck --version): run shellcheck .claude/scripts/reconstruct-agents.sh and require exit 0 OR documented suppressions. If shellcheck is NOT available (empirical at planning-iter2 time: shellcheck absent from this workspace), fall back to bash -n above and note the omission in the commit body so a future CI run can re-gate."
  - "Idempotency: running reconstruct on a session.json that already has N entries returns same N entries + 0 changes (compare jq-canonical-form before/after)"
  - "Verify-and-fix: on a session.json missing entries vs transcript, exit code 0 + appended entries match transcript Task spawns by tool_use_id"
effort: Large
```

### Task 09 — T3.c — `.claude/settings.json` PostToolUse + PostToolUseFailure registration

```yaml
id: 09-settings-json-hook-registration
what: Add PostToolUse Task-matcher block + PostToolUseFailure Task-matcher block to .claude/settings.json hooks section. Both blocks invoke .claude/hooks/post-tool-use-agents.sh. Use the exact Claude Code hooks JSON schema per T3-E-1 / T3-E-5 (officially documented — both events confirmed via WebFetch in Ideation Fix B).
traces-to:
  - "T3-I-T3.c — Edit .claude/settings.json: PostToolUse + PostToolUseFailure blocks"
requires: [07-post-tool-use-agents-hook-script]
files:
  - {path: ".claude/settings.json", op: modify}
inputs:
  - hook-script-artifact
outputs:
  - settings-json-hook-blocks
verifies:
  - "jq -e '.hooks.PostToolUse[] | select(.matcher == \"Task\")' .claude/settings.json returns the block"
  - "jq -e '.hooks.PostToolUseFailure[] | select(.matcher == \"Task\")' .claude/settings.json returns the block"
  - "jq . .claude/settings.json exits 0 (valid JSON)"
  - "Both blocks reference .claude/hooks/post-tool-use-agents.sh exactly"
effort: Small
```

### Task 10 — T3.d + T3.e + T3.g (partial) — orchestration row 6 narrative + delegation structured-header convention + flock documentation

```yaml
id: 10-orchestration-row-6-and-delegation-headers
what: (a) Replace orchestration/SKILL.md row 6 "manager appends specialist entries to agents[] as the workflow progresses" narrative with "PostToolUse + PostToolUseFailure hook upserts agents[] entries; reconstructor (.claude/scripts/reconstruct-agents.sh) is the recovery mechanism on hook crash/gap." (b) Add delegation/SKILL.md structured-header convention codifying "## Phase: X / ## Iter: N / ## Step: ..." regex-extractable patterns in delegation prompt tool_input.prompt body (per D-3-4 hybrid extraction). (c) Add delegation/SKILL.md flock -x documentation note (T3.g) cross-referencing the hook script comment block.
traces-to:
  - "T3-I-T3.d — orchestration/SKILL.md row 6 + agents[] narrative: replace manual with hook+reconstructor"
  - "T3-I-T3.e — delegation/SKILL.md: structured-header convention, regex patterns, migration note"
  - "T3-I-T3.g — Document flock -x in delegation/SKILL.md and hook comment block (delegation portion)"
requires: [01-orchestration-row-5-5-worktree-create, 04-gobbi-and-delegation-cross-ref-and-audit, 06-direct-mode-opt-out-and-smoke-test, 07-post-tool-use-agents-hook-script, 08-reconstruct-agents-script]
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/delegation/SKILL.md", op: modify}
inputs:
  - hook-script-artifact
  - reconstructor-artifact
  - delegation-main-tree-audit-result
outputs:
  - row-6-hook-based-narrative
  - structured-header-convention-spec
  - flock-doc-note
verifies:
  - "grep -E 'PostToolUse|reconstructor' .claude/skills/orchestration/SKILL.md returns ≥1 match in/near row 6 context"
  - "grep -E '## Phase|## Iter|## Step' .claude/skills/delegation/SKILL.md returns ≥3 matches (header convention codified)"
  - "grep -E 'flock' .claude/skills/delegation/SKILL.md returns ≥1 match"
  - "test -L .claude/skills/orchestration/SKILL.md && test -L .claude/skills/delegation/SKILL.md"
effort: Medium
```

### T3.f + T3.h verification-only (no executor task)

T3.f (`agents[]` status field schema extension) and T3.h (`.gobbi/project.json` bootstrap) are deferred to feature-level backlog already staged during Ideation. Planning verification: confirm both files exist at:

- `sessions/.../ideation/staging/backlogs/feature/schema-extension-agents-status-field.md`
- `sessions/.../ideation/staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`

(Not a planning task — already done at Ideation; Wrap-up promotes both.)

---

## Dependency table

| Task ID | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01-orchestration-row-5-5-worktree-create | — | 02, 03, 04, 05, 06, 10 | `orchestration/SKILL.md` (row 5.5) |
| 02-git-skill-worktree-path-qualifier | 01 | 03, 04 | `git/SKILL.md` |
| 03-preparation-generate-now-commit-on-branch | 01, 02 | 05 | `preparation/SKILL.md` |
| 04-gobbi-and-delegation-cross-ref-and-audit | 01, 02 | 10 | `gobbi/SKILL.md`, `delegation/SKILL.md` |
| 05-five-phase-docs-per-iter-cadence | 01, 03 | 07 | 5 loop docs under `orchestration/workflow/` |
| 06-direct-mode-opt-out-and-smoke-test | 01 | 07, 10 | `orchestration/SKILL.md` (footnote near row 5.5) |
| 07-post-tool-use-agents-hook-script | **05, 06** (per LOCK #1 — strict T1→T3 wave ordering: T1 wave Tasks 01-06 complete before T3 wave starts; both 05 and 06 are required to graph-enforce the wave gate — Fix 2) | 08, 09, 10 | `.claude/hooks/post-tool-use-agents.sh` |
| 08-reconstruct-agents-script | 07 | 10 | `.claude/scripts/reconstruct-agents.sh` |
| 09-settings-json-hook-registration | 07 | — | `.claude/settings.json` |
| 10-orchestration-row-6-and-delegation-headers | 01, 04, **06**, 07, 08 (06 added per Fix 2 — Tasks 06 and 10 both touch `orchestration/SKILL.md`, edge enforces sequential modification) | — | `orchestration/SKILL.md`, `delegation/SKILL.md` |

**File-overlap conflict flags:**

- ⚠ Tasks 01, 06, 10 all touch `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (rows 5.5 / 5.5-footnote / 6). Sequential, not parallel-safe. Dependency edges enforce ordering: 01 → 06 (foot-note follows row 5.5 insertion), 01 → 10 (row 6 follows row 5.5), and **06 → 10** (footnote written before row 6 narrative; prevents lost edits when two tasks edit the same file — Fix 2).
- ⚠ Tasks 04 and 10 both touch `.gobbi/projects/gobbi/skills/delegation/SKILL.md` (main-tree boilerplate audit + structured-header convention + flock note). Sequential — 04 → 10 enforced.
- ⚠ Tasks 02 + 03: `preparation/SKILL.md` references the qualified `worktreePath` rule that lands in `git/SKILL.md` during Task 02; Task 03's promote-now block depends on that rule being in place semantically (cross-skill cite). Edge 02 → 03 enforced.

**Wave ordering (LOCK #1; Fix 2 graph enforcement):** Per user confirmation, the leader-recommended sequential T1-wave (Tasks 01-06) then T3-wave (Tasks 07-10) is **locked as strict ordering**, not advisory. Dependency edges `05 → 07` AND `06 → 07` together graph-enforce the strict wave gate: every T1-wave task (specifically the two terminal T1 leaves 05 and 06) must complete before Task 07 begins. Rationale (carried from prior § Dependency table notes): coherent commit history per per-iter cadence rule; T1 doc edits land as one wave commit before the T3 wave starts; hook script (Task 07) still tolerates pre-T1 `cwd` semantics via D-3-3-resolver step (ii) directory scan, but strict ordering avoids any interleaving ambiguity. **Why both 05 AND 06 in `requires`**: with only `requires: [05]` (iter1 form), the dependency graph permitted 06 → 07 interleaving (since 06 had no downstream gate); Fix 2 closes the loophole — neither 05 nor 06 alone gates 07, both do, matching the textual "Tasks 01-06 must complete first" claim.

---

## Parallel lanes

Execution runs sequentially (per `planning/SKILL.md` Sub-step C note — "lanes are documentation, not a runtime contract"). Lanes captured below for documentation / future possibility. **Per LOCK #1, L4-L6 (T3 wave) MUST NOT start until L1-L3 (T1 wave) complete** — sequential T1→T3 with no interleaving.

| Lane | Wave | Tasks (in order) | Notes |
|---|---|---|---|
| L1 — T1 root | T1 | 01 | Foundation; everything else depends on it |
| L2 — T1 doc edits | T1 | 02, 03, 04, 06 | All depend on L1; pairwise file-distinct (each task touches different file groups), so internally parallelizable in theory but recommended sequential per § Dependency table edges |
| L3 — T1 phase doc bulk edit | T1 | 05 | Depends on L1 + L2 (specifically 03); standalone 5-file group; closes T1 wave |
| L4 — T3 script authoring | T3 | 07, 08 | **Gated on L3 + L2-step-06 complete (LOCK #1 strict T1→T3 ordering, Fix 2 graph form: requires: [05, 06]).** 08 depends on 07 (shared jq snippets contract); pairwise file-distinct from L1–L3. Per LOCK #2, single shared executor for both 07 + 08 back-to-back. |
| L5 — T3 settings | T3 | 09 | Depends on 07 only; standalone single-file edit |
| L6 — T3 cross-cutting (row 6 narrative + delegation headers) | T3 | 10 | Depends on 01, 04, 06, 07, 08 — final cross-cutting wire-up (06 added per Fix 2; both touch orchestration/SKILL.md) |

**File-overlap conflict memos** (re-flag from § Dependency table for lane-level visibility):

- ⚠ L1 (Task 01) + L2 (Task 06 footnote) + L6 (Task 10 row 6) all touch `orchestration/SKILL.md` — strictly sequential; per Fix 2 the edge `06 → 10` is now in `requires:`, graph-enforcing the sequence.
- ⚠ L2 (Task 04 delegation audit) + L6 (Task 10 delegation structured-headers) both touch `delegation/SKILL.md` — strictly sequential.
- L4 + L5 + L6: Task 09 settings only depends on 07; Task 10 depends on 07 + 08. L5 could run after L4-step-07 without waiting for L4-step-08.

---

## Agent assignment table

Tier conventions (per `planning/SKILL.md` Sub-step D + `delegation/SKILL.md` Load Directives):

- **Tier 1 — Principles**: `principles` (always)
- **Tier 2 — Project rules**: `.gobbi/projects/gobbi/rules/` (all files)
- **Tier 3 — Domain skills**: `mistake` (always), workflow phase doc (`orchestration/workflow/execution.md`), domain skills per files touched
- **Tier 4 — Mistakes**: project mistakes (every T1 task: 3 mandatory mistakes per Preparation D-3; T3 tasks get the Iron Law 7 procedural mistake only per LOCK #3 — see bundles below)

**MANDATORY T1 mistake-load bundle** (per `preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md` — every T1 task brief MUST cite these 3 in tier 4):

- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

**MANDATORY T3 procedural mistake extension (LOCK #3)** — every T3 task brief (Tasks 07-10) MUST cite the Iron Law 7 procedural mistake from the T1 bundle:

- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

Rationale (per LOCK #3): T3 surfaces (hook script, reconstructor, settings.json, delegation headers) involve "verbatim" citation of Ideation hook contract, structured-header regexes, and JSON schema fields — exactly the failure mode the mistake guards against. The other two T1 mistakes (cwd routing / rm -rf safety) are **not** procedurally extended to T3 because T3 tasks neither write to session paths nor remove files. Per-task `Brief notes` may add task-specific mistakes (e.g., `codex-rescue-agent-fire-and-forget-without-result-capture.md`) on top.

**MANDATORY edit-contract brief note** (per `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` § Symlink-preservation edit contract — every executor brief touching workspace `.claude/skills/` paths MUST include):

> "Edit tool default; `sed -i` / `perl -i` forbidden on workspace `.claude/skills/...` paths; canonical mirror path (`.gobbi/projects/gobbi/skills/...`) for bulk rewrites; `test -L .claude/skills/<path>` post-edit verification gate with `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>` restore command if symlink broken (the exact `../../../` prefix depth depends on the file's depth — for `SKILL.md` directly under `.claude/skills/<topic>/`, use `../../../`; for files under `.claude/skills/<topic>/<sub>/`, use `../../../../`; verify against an adjacent untouched symlink with `ls -la`)."

### Per-task assignments

| Task | Agent | Model | Tier 3 (skills) | Tier 4 (mistakes) | Brief notes |
|---|---|---|---|---|---|
| 01 | executor | sonnet (default) | principles, mistake, claude (`.claude/` doc authoring standard), orchestration, git, execution (workflow doc), planning (consume artifact) | **T1 mandatory bundle (3)** | Edit-contract note; cite Ideation artifact verbatim for branch-name regex (Iron Law 7) |
| 02 | executor | sonnet | principles, mistake, claude, git, execution | **T1 mandatory bundle (3)** | Edit-contract note; per Iron Law 7 read git/SKILL.md row 31 + line 33 freshly before editing |
| 03 | executor | sonnet | principles, mistake, claude, preparation, git, execution | **T1 mandatory bundle (3)** + `codex-rescue-agent-fire-and-forget-without-result-capture.md` (commit/trailer authoring discipline; ensures git invocation result is captured) | Edit-contract note; cite the canonical AI-Provenance-Record trailer format `gobbi://session/{ssid}/task/{task-id}` verbatim from Ideation; per LOCK #4 the rollback-semantics block lives co-located with the narrow-exception text in this same SKILL.md; **per Fix 4** the rollback sequence MUST be cited verbatim from Ideation iter3 draft line 283 + § D-3 (line 322 — "Partial-failure rollback") — manager `git -C "$worktreePath" rm <copied-paths>` + AskUserQuestion + re-attempt-or-abort; the rollback REMOVES the copied file (no git-checkout restore, no auto-revert; copied file did not pre-exist) |
| 04 | executor | sonnet | principles, mistake, claude, delegation, gobbi, execution | **T1 mandatory bundle (3)** | Edit-contract note; for delegation/SKILL.md audit, leader proposes grep command in brief: `grep -nE 'main.tree' .claude/skills/delegation/SKILL.md` and require executor to log each match-site decision in commit body |
| 05 | executor | sonnet | principles, mistake, claude, orchestration (workflow phase docs), execution | **T1 mandatory bundle (3)** | Edit-contract note; cite D-4 design file verbatim for the 5-file enumeration + 0-match exclusion gate; MUST run the dual grep verification before declaring complete |
| 06 | executor | sonnet | principles, mistake, claude, orchestration, execution | **T1 mandatory bundle (3)** | Edit-contract note; smoke-test regex MUST be cited verbatim from Ideation T1-I-T1.h; per LOCK #5 the direct-mode opt-out lives as a row 5.5 footnote in orchestration/SKILL.md (NOT git/SKILL.md) |
| **07 + 08 (LOCK #2 — shared executor, one delegation)** | executor (single delegation covering both tasks back-to-back) | sonnet | principles, mistake, claude, delegation (hook contract reference), execution | **T3 procedural mistake (LOCK #3)** — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — plus per-task: `codex-rescue-agent-fire-and-forget-without-result-capture.md` (script must capture jq result + flock outcome; same fire-and-forget failure mode applies to subprocess invocations within a hook); for Task 07 also `evaluator-returned-verdict-inline-no-per-perspective-files.md` (procedural reminder: any extraction must write to its declared output path, never stop at "the data is in stdout") | Hook+reconstructor author needs: bash strict-mode `set -euo pipefail`, `flock -x` on session.json, jq for JSON manipulation. Single delegation preserves shared jq snippets + hook stdin contract across both files (Task 07 produces them; Task 08 consumes them). WebFetch hooks documentation page `https://code.claude.com/docs/en/hooks` for fresh PostToolUse + PostToolUseFailure stdin contract (Iron Law 7 — do not rely on Ideation summary alone). The scripts are NEW artifacts under `.claude/hooks/` and `.claude/scripts/`, not `.claude/skills/` edits, so the symlink-preservation contract does not apply; executor still uses Write (not `cat > <<EOF`) per CLAUDE.md tool preference. mkdir -p `.claude/scripts/` at task start (per D-5 skip rationale). **Per Fix 5**: `bash -n <script>` is ALWAYS run as the syntax-gate (universal); `shellcheck` is run CONDITIONALLY only if `command -v shellcheck` finds it — at planning-iter2 time shellcheck was empirically absent from this workspace, so the executor's verifies block treats shellcheck as optional and documents the omission in the commit body for a future CI re-gate. |
| 09 | executor | sonnet | principles, mistake, claude, execution | **T3 procedural mistake (LOCK #3)** — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | Edit-contract note does NOT apply (`.claude/settings.json` is a regular file, not a workspace symlink); but executor must run `jq . .claude/settings.json` post-edit. WebFetch hooks documentation page if any field name ambiguity arises. (**Fix 3**: prior iter1 brief cited `stub-redirect-format.md` as a tier-4 mistake — citation REMOVED. `stub-redirect-format.md` lives in `.gobbi/projects/gobbi/rules/`, not `.gobbi/projects/gobbi/mistakes/`, and governs superseded-Markdown stub-redirect format — unrelated to JSON editing of `.claude/settings.json` hooks blocks. Task 09's executor brief does not need stub-redirect-format guidance.) |
| 10 | executor | sonnet | principles, mistake, claude, orchestration, delegation, execution | **T3 procedural mistake (LOCK #3)** — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | Edit-contract note (touches workspace symlink paths). Cross-cutting wire-up — executor MUST verify hook artifact (Task 07) and reconstructor (Task 08) exist before referencing them in row 6 narrative. |

**No non-default agent type or model override across the 10 tasks** — all executor-sonnet. Rationale: every task is an implementation-category task (doc edits, script authoring, JSON edits) with bounded scope. No sub-decomposition warranted (which would justify `leader`); no purely mechanical rename-only work (which would justify `assistant`). Per LOCK #2, Tasks 07 + 08 share one executor delegation (back-to-back within the same context) — this is a delegation-grouping decision, not a different agent type.

---

## Decisions log

DISCUSSION-phase decisions captured in this iter1 single-pass leader execution. All 5 user-facing decision points were resolved via AskUserQuestion during DISCUSSION; outcomes recorded in § Locked decisions below and integrated into task scopes / assignment table above. iter2 REVISE-pass surgical fix-decisions appended as rows 11-15 (one per Fix).

| # | Decision | Source | Outcome |
|---|---|---|---|
| 1 | T1.1 / T3.4 merge into single orchestration/SKILL.md task | Planning brief Sub-step B guidance | **Merge as Tasks 01 + 06 + 10** — three separate edits to orchestration/SKILL.md but each with a distinct anchor (row 5.5 insertion / row 5.5 footnote / row 6 narrative). Merging all three into one task would violate medium-granularity discipline (>5 sub-anchors). Splitting preserves clear scope per task while file-overlap conflict flags + dependency edges enforce sequential ordering. |
| 2 | T1 ↔ T3 strict ordering | Ideation D-3-5 + Planning brief cross-cutting reminder + **LOCK #1** | **Strict sequential T1-wave (01-06) then T3-wave (07-10)** per user lock. Dependency edge 05 → 07 enforces. Wave-ordering rationale: per-iter cadence rule one-commit-per-wave + coherent commit history; not for hard correctness (hook tolerates pre-T1 cwd via D-3-3-resolver). [iter2 update — see row 12: edge strengthened to `05, 06 → 07` to graph-enforce the full wave gate.] |
| 3 | T1.j rollback semantics doc home | Ideation Implementation Checklist T1.j (preparation/SKILL.md OR git/SKILL.md) + **LOCK #4** | **preparation/SKILL.md, co-located with the narrow-exception text (Task 03 consolidates).** Per user lock — rollback applies to the promote-now commit pattern that lives in preparation/SKILL.md; co-locating the failure mode with the procedure preserves single-source-of-truth. git/SKILL.md keeps the general critical-rule paragraph (Task 02) but does not get a generate-now-specific rollback section. [iter2 update — see row 14: rollback sequence specifics aligned with Ideation:283 = `git rm` copied-paths + AskUserQuestion.] |
| 4 | Task 07 + Task 08 shared executor | Planning brief Sub-step D guidance + **LOCK #2** | **Single executor delegation covering both Task 07 (hook) and Task 08 (reconstructor) back-to-back** per user lock. Preserves the shared jq snippets + hook stdin contract that Task 07 establishes for Task 08 within a single working context. |
| 5 | T3.g (flock documentation) split across Task 07 (hook script comments) + Task 10 (delegation/SKILL.md note) | Ideation Implementation Checklist T3.g (single anchor, two natural locations) | **Split as recommended — Task 07 owns hook-script-header comment block, Task 10 owns delegation/SKILL.md doc-note.** Each location serves a different audience (script maintainer vs delegation-prompt author). |
| 6 | Edit-contract brief note application | Preparation iter3 mirror policy § Symlink-preservation edit contract | **Applied universally to every task touching `.claude/skills/...` paths (Tasks 01-06, 10).** Tasks 07-09 do not touch workspace symlinks; edit-contract note omitted with explicit rationale in brief. [iter2 update — see row 11: restore-command depth corrected to `../../../` for `SKILL.md` paths, with explicit depth-disclaimer.] |
| 7 | T1 mistake bundle application to T3 tasks | Preparation D-3 decision + **LOCK #3** | **Procedural Iron Law 7 mistake (`manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`) cited in EVERY T3 task brief (Tasks 07-10).** The other two T1 mistakes (cwd routing / rm -rf safety) are NOT extended to T3 — they bind file/path classes T3 does not touch. T1 tasks (01-06) still get the full 3-mistake bundle. [iter2 update — see row 13: erroneous citation of `stub-redirect-format.md` on Task 09 removed.] |
| 8 | Direct-mode opt-out doc home | Ideation T1.g (orchestration/SKILL.md OR git/SKILL.md workflow-mode docs) + **LOCK #5** | **orchestration/SKILL.md row 5.5 footnote (Task 06 consolidates).** Per user lock — co-locates the opt-out flag with the row it opts out of; avoids a third cross-skill reference. |
| 9 | Test-writing not a separate task | `planning/SKILL.md` § "Test-writing is NOT a planning task" | **Confirmed — no separate test-authoring tasks.** Each task's `verifies` block names runnable commands the executor uses to gate completion; EVALUATION phase runs full evaluation if needed. Bundle B's Ideation has no scenario-anchored test artifacts. |
| 10 | (reserved; no row 10 in iter1) | — | — |
| **11 (Fix 1 — iter2)** | Symlink-restore command depth | Claude eval iter1 F-USAGE-2 — § Execution intake notes prescribed `ln -sfn ../../...` (2 dots) while actual workspace symlinks for `.claude/skills/<topic>/SKILL.md` use `../../../` (3 dots) and files under `.claude/skills/<topic>/<sub>/...` use `../../../../` (4 dots). Empirical check (iter2 leader, 2026-05-24): `ls -la .claude/skills/orchestration/SKILL.md` → `lrwxrwxrwx ... -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (confirms 3-dot form). | **Restore command corrected to `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>` in § Execution intake notes + § Agent assignment table edit-contract brief note**, with explicit depth-disclaimer ("for `SKILL.md` directly under `.claude/skills/<topic>/`, use `../../../`; for files under `.claude/skills/<topic>/<sub>/`, use `../../../../`; verify against an adjacent untouched symlink with `ls -la`"). Mirrors the Preparation iter3 edit-contract source verbatim. |
| **12 (Fix 2 — iter2)** | LOCK #1 graph enforcement | Claude eval iter1 F-STRUCT-1 / F-CONS-2 (Task 07 requires only [05] permitted 06 → 07 interleaving) + F-STRUCT-2 / F-CONS-1 (Tasks 06 and 10 both touch orchestration/SKILL.md but no edge enforced ordering). | **Task 07 `requires` changed from `[05]` to `[05, 06]`** to graph-enforce the strict T1-wave gate (both terminal T1 leaves must complete before T3 wave starts). **Task 10 `requires` adds `06`** (now `[01, 04, 06, 07, 08]`) to enforce the orchestration/SKILL.md sequential ordering edge (06 footnote written before row 6 narrative; prevents lost edits when both tasks edit the same file). § Dependency table + § Parallel lanes updated to reflect the strengthened edges. |
| **13 (Fix 3 — iter2)** | Task 09 erroneous mistake citation | Claude eval iter1 + Codex eval iter1 (convergent): iter1 Agent assignment table Task 09 row cited `stub-redirect-format.md` as a tier-4 mistake. Empirical check (iter2 leader, 2026-05-24): `ls .gobbi/projects/gobbi/rules/stub-redirect-format.md` → file exists in **rules/** (not mistakes/); `ls .gobbi/projects/gobbi/mistakes/stub-redirect-format.md` → No such file or directory. Even as a rule, `stub-redirect-format` governs superseded-Markdown stub redirects, unrelated to JSON editing of `.claude/settings.json` hooks blocks (Task 09's surface). | **Citation REMOVED from Task 09's tier-4 mistakes column.** Task 09's executor brief retains only the T3 procedural mistake (`manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` per LOCK #3). Task 09's discipline is enforced by the `jq . .claude/settings.json` post-edit verify gate (JSON-validity check), not by a misapplied stub-redirect rule. |
| **14 (Fix 4 — iter2)** | Task 03 rollback semantics drift | Codex eval iter1 COD-PROJ/CONS/RISK-01: iter1 Task 03 `what` field said "restoration via git checkout, no auto-rm of skill body" — drifts from Ideation:283 + Ideation D-3 (line 322 — "Partial-failure rollback") which require the copied skill body to be REMOVED via `git -C "$worktreePath" rm`, then AskUserQuestion, then re-attempt-or-abort. The copied file did not pre-exist in the worktree, so git-checkout has nothing to restore; the correct rollback is removal. | **Task 03 `what` field rewritten** to: "Rollback sequence per Ideation iter3 draft line 283 (T1-I-T1.j) and § Decision D-3 (line 322 — 'Partial-failure rollback'): if `git commit` fails post-copy, the manager MUST `git -C "$worktreePath" rm <copied-paths>` to remove the copied skill body before AskUserQuestion surfaces the failure to the user; re-attempt or abort follows the user's response. The rollback explicitly REMOVES the copied file (no 'git checkout' restore, no auto-revert — copied file did not pre-exist in the worktree, so removal is the correct restoration)." Task 03 `verifies` block adds two grep gates: `git -C "\$worktreePath" rm` present + `AskUserQuestion` co-located with the rollback paragraph. § Agent assignment table Task 03 brief note adds the Ideation:283 verbatim citation requirement. |
| **15 (Fix 5 — iter2)** | `shellcheck` verifier dependency | Codex eval iter1 COD-STRUCT/USAGE/RISK-01: iter1 Tasks 07 + 08 `verifies` specified `shellcheck .claude/...` returns exit 0; `shellcheck` is not installed in this workspace. Empirical check (iter2 leader, 2026-05-24): `command -v shellcheck` → exit code 2 (not found). | **Tasks 07 + 08 `verifies` rewritten** to make shellcheck CONDITIONAL: `bash -n <script>` is ALWAYS run (bash is universally available) as the canonical syntax-gate; shellcheck is run only IF `command -v shellcheck` finds it, with documented suppressions on exit non-zero, and the omission noted in the commit body for a future CI re-gate when shellcheck becomes available. § Agent assignment table Task 07+08 brief note adds the same conditional-shellcheck instruction with the empirical "shellcheck absent from this workspace" note. |

---

## Locked decisions

Five contribution points (recommended by the leader in DISCUSSION) were surfaced to the user via manager AskUserQuestion. All five resolved; outcomes are now stamped into the task scopes, dependency table, lane table, and agent assignment table above. Replays:

1. **LOCK #1 — T1 → T3 wave ordering**: **Strict sequential** confirmed. T1 wave (Tasks 01-06, L1-L3) completes before T3 wave (Tasks 07-10, L4-L6) starts. Encoded as dependency edges `05 → 07` AND `06 → 07` (per Fix 2 — iter2; both terminal T1 leaves graph-gate Task 07) in § Dependency table; flagged on each lane in § Parallel lanes; not interleaved.

2. **LOCK #2 — Tasks 07 + 08 shared executor**: **One executor handles both** confirmed. Single executor delegation covers both Task 07 (hook script) and Task 08 (reconstructor) back-to-back to preserve shared jq snippets + hook stdin contract within one working context. Encoded in § Agent assignment table as a merged row for "07 + 08 (shared executor)".

3. **LOCK #3 — Mistake bundle procedural extension to T3 tasks**: **Iron Law 7 mistake only** confirmed. T3 task briefs (Tasks 07-10) MUST cite `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (procedural). The other two T1 mistakes (cwd routing / rm -rf safety) are NOT extended to T3 surfaces because T3 tasks neither write to session paths nor remove files. T1 tasks (01-06) keep the full 3-mistake bundle. Encoded in § Agent assignment table tier-4 column.

4. **LOCK #4 — T1.j rollback semantics doc home**: **preparation/SKILL.md** confirmed. Rollback semantics live co-located with the narrow-exception text in preparation/SKILL.md (Task 03 consolidates). NOT git/SKILL.md. Encoded in Task 03 `what` + `traces-to` + `verifies` (rollback grep), and § F2 file map row. Sequence specifics (per Fix 4 — iter2): manager `git -C "$worktreePath" rm <copied-paths>` + AskUserQuestion + re-attempt-or-abort, per Ideation:283.

5. **LOCK #5 — T1.g direct-mode opt-out doc home**: **orchestration/SKILL.md row 5.5 footnote** confirmed. Direct-mode opt-out documented as a row-5.5 footnote in orchestration/SKILL.md (Task 06 consolidates). NOT git/SKILL.md workflow-mode docs. Encoded in Task 06 `what` + § F2 file map row.

No USER CHALLENGE escalation triggered during DISCUSSION — all 5 leader recommendations were accepted by the user as-stated or with minor scoping (LOCK #3 narrowed the recommended T3 procedural extension from 3 mistakes to 1; LOCK #1 accepted the strict-ordering recommendation directly).

---

## Execution intake notes

Cross-cutting requirements the manager must include in **every executor task brief** when delegating into the Execution loop. These are not new tasks — they are mandatory boilerplate to surface in tier-4 Load Directives / brief notes / commit-discipline blocks of every Execution delegation prompt.

### Edit tool default for workspace `.claude/skills/` paths

(per Preparation `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` § Symlink-preservation edit contract — also reiterated in § Agent assignment table. **Fix 1 (iter2) — restore-command depth corrected to `../../../` for `SKILL.md` paths**; iter1 used `../../` which would have created broken or wrong-target symlinks.)

- **Default**: Edit tool for every modification to `.claude/skills/...` paths in workspace (symlinks resolving to canonical mirror).
- **Forbidden on workspace**: `sed -i`, `perl -i`, any in-place stream editor that may re-create the file and break the symlink.
- **Bulk rewrites**: target the canonical mirror path `.gobbi/projects/gobbi/skills/...` directly (single source of truth) — the workspace symlink resolves through automatically.
- **Post-edit verification gate**: `test -L .claude/skills/<path>` on every edited path — if it returns non-zero, the symlink was broken; restore with the canonical-relative-link form below. Per the Preparation iter3 edit-contract source (`mirror-propagation-policy-mirror-canonical-symlinks.md` § Discipline point 3, verbatim): `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`. **Depth disclaimer (verbatim from the same source)**: "The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`." Specifically: for `SKILL.md` directly under `.claude/skills/<topic>/`, use `../../../`; for files under `.claude/skills/<topic>/<sub>/`, use `../../../../`. Empirical witness (iter2 leader, 2026-05-24): `ls -la .claude/skills/orchestration/SKILL.md` → `lrwxrwxrwx ... -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (confirms 3-dot form for SKILL.md depth).

### 3-mistake load directive for T1 task briefs (Tasks 01-06)

(per Preparation D-3 decision `planning-brief-mistake-load-directives-for-t1.md` — also iter3 binding.)

Every T1 task brief tier-4 Load Directives section MUST cite all three:

- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

Per-task additions allowed on top (see § Agent assignment table).

### 1-mistake procedural extension for T3 task briefs (Tasks 07-10) — LOCK #3

Every T3 task brief tier-4 Load Directives section MUST cite the Iron Law 7 procedural mistake:

- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`

Rationale: T3 tasks involve verbatim citation of hook stdin contract, structured-header regexes, JSON schema field names, and AI-Provenance-Record trailer format — exactly the failure mode the mistake guards against. The other two T1 mistakes (cwd routing / rm -rf safety) bind file/path classes that T3 tasks do not touch and are therefore NOT included.

### Branch naming convention

`chore/session-{date}-{ssid-short}` (per Preparation iter3 readiness; registry-compliant `chore` type; 27 chars). Examples are derived from active session ID — the manager (not executor) creates the worktree branch at session bootstrap row 5.5 invocation.

### Per-iter commit subject (chore(session) cadence)

`chore(session): record <loop> iter{n} memory`

(per D-4 design file Approach section + § Sub-step A Pre-locked decisions). Issued by MEMORIZATION at iter-exit on the active worktree branch.

### AI-Provenance-Record trailer

Every commit emitted by Execution (or by Preparation generate-now / Memorization session memory cadence) MUST carry the canonical trailer:

```
AI-Provenance-Record: gobbi://session/{ssid}/task/{task-id}
```

(per Ideation lock + § Sub-step A Pre-locked decisions). The trailer is placed at the bottom of the commit message body, blank-line separated from the prose. `{ssid}` is the full session ID; `{task-id}` is the planning task ID (e.g., `01-orchestration-row-5-5-worktree-create`).

---

## Self-review report (Sub-step E)

**Spec coverage check** — every Ideation in-scope checklist item → at least one task:

| Checklist anchor | Task(s) | OK? |
|---|---|---|
| T1-I-T1.a | 01 | ✓ |
| T1-I-T1.b | 02 | ✓ |
| T1-I-T1.c | 01, 02 (P2-invocation note edit lives in Task 02) | ✓ |
| T1-I-T1.d | 03 | ✓ |
| T1-I-T1.e | 04 | ✓ |
| T1-I-T1.f | 05 | ✓ |
| T1-I-T1.g | 06 (per LOCK #5) | ✓ |
| T1-I-T1.h | 06 | ✓ |
| T1-I-T1.i | 04 | ✓ |
| T1-I-T1.j | 03 (per LOCK #4; rollback sequence per Fix 4 → Ideation:283) | ✓ |
| T3-I-T3.a | 07 | ✓ |
| T3-I-T3.b | 08 | ✓ |
| T3-I-T3.c | 09 | ✓ |
| T3-I-T3.d | 10 | ✓ |
| T3-I-T3.e | 10 | ✓ |
| T3-I-T3.f | (verification-only — already staged at Ideation) | ✓ (no task; non-actionable) |
| T3-I-T3.g | 07 (hook-script header), 10 (delegation note) | ✓ |
| T3-I-T3.h | (verification-only — already staged at Ideation) | ✓ (no task; non-actionable) |

**Result**: 18/18 in-scope checklist items have anchor coverage (16 actionable tasks + 2 verification-only). No unmatched checklist items. No tasks without an Ideation anchor.

**Placeholder scan** — search every task description + acceptance criterion for forbidden tokens:

- `TBD`: 0 hits.
- `TODO`: 0 hits.
- `to be defined`: 0 hits.
- `<...>`: 0 literal hits (paths use `{date}` / `{ssid-short}` / `{n}` / `{slug}` / `{task-id}` / `{loop}` / `{path}` / `{ssid}` which are canonical template tokens carried from Ideation locks, NOT placeholders for unresolved decisions; the `<copied-paths>` and `<script>` tokens in Task 03 and Tasks 07/08 are likewise template placeholders for command-shell substitution, not unresolved decisions).
- `XXX`: 0 hits.
- `FIXME`: 0 hits.

**Result**: clean.

**Type / name consistency check** — every identifier used across tasks matches its definition:

- `chore/session-{date}-{ssid-short}` — branch name; defined Task 01; cited Tasks 02, 06 + § Execution intake notes. Consistent.
- `chore(session): record <loop> iter{n} memory` — commit subject; defined per Ideation D-4; cited Tasks 05, 06 verification + § Execution intake notes. Consistent.
- `chore(skills): promote {slug} generated by preparation iter{n}` — promote-now commit subject; defined Task 03; cited by Task 03 verifies only. Consistent.
- `AI-Provenance-Record:` + `gobbi://session/{ssid}/task/{task-id}` trailer — defined Task 03; cited by Task 03 verifies + § Execution intake notes. Consistent.
- `tool_use_id` — correlation key; cited Tasks 07, 08 (same semantic). Consistent.
- `post-tool-use-agents.sh` (path: `.claude/hooks/post-tool-use-agents.sh`) — defined Task 07; cited Tasks 08 (shared jq snippets), 09 (settings registration), 10 (row 6 narrative). Consistent.
- `reconstruct-agents.sh` (path: `.claude/scripts/reconstruct-agents.sh`) — defined Task 08; cited Task 10. Consistent.
- `session.json.git.worktreePath` — defined Tasks 01 + 02; cited Tasks 03, 06, plus general T1 mandate. Consistent.
- `D-3-3-resolver step (ii)` — directory-scan fallback; cited Task 07 brief notes. Consistent with Ideation Fix C lock.
- `5 phase docs` enumeration — defined D-4 design file; cited Task 05. Verified verbatim path-match (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`).
- `evaluation.md` + `memorization.md` exclusions — cited Task 05 verifies (0-match gate). Consistent with D-4 § Excluded files.
- `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — cited in T1 bundle (3-mistake) AND T3 procedural extension (1-mistake per LOCK #3). Consistent — same file used in two scopes by design.
- `../../../` symlink-restore prefix (Fix 1) — defined § Execution intake notes Edit-tool default block; cited § Agent assignment table edit-contract brief note. Consistent depth-3 form for `SKILL.md`-depth paths; explicit `../../../../` callout for one-level-deeper paths. No drift.
- `git -C "$worktreePath" rm <copied-paths>` (Fix 4) — defined Task 03 `what`; cited Task 03 `verifies` (grep gate); cited § Decisions log row 14; cited § Agent assignment table Task 03 brief note. Consistent.
- `bash -n` + conditional `shellcheck` (Fix 5) — defined Tasks 07 + 08 `verifies`; cited § Agent assignment table Task 07+08 brief note; cited § Decisions log row 15. Consistent.

**Result**: clean; no type/name drift.

**iter2 fix-coverage check** — every Fix 1-5 reflected in the right sections:

| Fix | Sections modified | Coverage |
|---|---|---|
| 1 — symlink-restore depth | § Execution intake notes (Edit tool default block); § Agent assignment table (edit-contract brief note); § Decisions log row 11; § Locked decisions row 6 update note; § Self-review type-consistency entry | ✓ |
| 2 — LOCK #1 graph enforcement | Task 07 `requires`; Task 10 `requires`; § Dependency table (rows 05, 06, 07, 10 + wave-ordering paragraph); § Parallel lanes (L4 + L6 notes); § Decisions log row 12; § Locked decisions row 1 update note | ✓ |
| 3 — Task 09 mistake citation removed | § Agent assignment table Task 09 row (tier-4 column + brief note); § Decisions log row 13; § Locked decisions row 7 update note | ✓ |
| 4 — Task 03 rollback semantics | Task 03 `what`; Task 03 `verifies` (two new grep gates); § Agent assignment table Task 03 brief note; § Decisions log row 14; § Locked decisions row 4 update note; § Self-review spec-coverage row T1-I-T1.j | ✓ |
| 5 — shellcheck conditional | Tasks 07 + 08 `verifies`; § Agent assignment table Task 07+08 brief note; § Decisions log row 15 | ✓ |

**Self-review verdict**: zero placeholders, zero type/name drift, 18/18 spec coverage, all 5 user locks integrated into task scopes + dependency edges + lane labels + agent-assignment table + decisions log + § Locked decisions subsection. All 5 iter2 surgical fixes reflected. § Execution intake notes correctly cite the `../../../` restore prefix (Fix 1). § Dependency table graph-enforces LOCK #1 (Fix 2). Task 09's erroneous citation removed (Fix 3). Task 03's rollback aligns with Ideation:283 (Fix 4). Tasks 07+08 verifies are shellcheck-conditional (Fix 5). iter2 WORK-ready.

---

## NOT in scope (out-of-bundle items)

Carried verbatim from Ideation § Scope Contract § Out-of-Scope + Preparation iter3 § Out of scope gaps:

- **T2 — skill-loading-discipline matrix + Load-Directives validator.** Deferred mid-Ideation. Backlog at `staging/backlogs/project/item-1-2-skill-loading-discipline.md`.
- **Codex CI integration for dual-system evaluation.** Deferred. Backlog at `staging/backlogs/project/codex-ci-integration-for-dual-system-eval.md`.
- **Auto-mode silence vs Always-Ask categories (Item 2-1).** Out of scope.
- **Chat-mode tiki-taka redesign.** Out of scope.
- **Item 1-3 alternative collapsing strategies.** Backlogged.
- **Item 1-2 broader delegation contract verifier.** Backlogged.
- **`session.template.json.agents[]` status field schema extension.** Deferred to feature-level backlog (T3.f staged at Ideation; promoted at Wrap-up).
- **`.gobbi/project.json` bootstrap.** Deferred (iter3 Fix C; T3.h dormant precondition). Feature backlog at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`.
- **Memory Access Matrix clarification across skills (workspace-symlink-layer language).** Out of scope; informal follow-up.
- **CI symlink-integrity check** (Preparation iter3 NEW deferred backlog). Witness-bound; pick-up trigger first real defect.
- **`gobbi-hook-authoring` project skill.** Deferred until N=2 hook scripts exist. Backlog at `staging/backlogs/project/gobbi-hook-authoring-skill.md`.
- **`gobbi-shell-script-conventions` project skill.** Deferred until N≥2 scripts in `.claude/scripts/`. Header comments in Task 07 + Task 08 scripts codify meanwhile (D-9 skip rationale).
- **`gobbi-session-architecture` project skill.** Skipped permanently — T1 doc edits ARE the codification (D-8 skip rationale).
- **Aggregated session-lifecycle / worktree-boundaries project design doc.** Deferred until N=2 sessions exercise the worktree-first pattern (D-6 backlog).
- **Hooks-domain mistakes watchlist.** Deferred; capture mid-Execution as witnesses emerge (D-2 backlog).
- **Test-writing as separate planning tasks.** Forbidden by `planning/SKILL.md`. EVALUATION runs the scenario-anchored evaluation if needed.
