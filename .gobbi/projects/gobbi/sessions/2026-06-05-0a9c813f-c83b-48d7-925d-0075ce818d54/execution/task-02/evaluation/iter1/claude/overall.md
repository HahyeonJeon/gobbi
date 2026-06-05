# Execution Evaluation — task-02 (executor model → opus) — Claude / iter1 / Overall

VERDICT: PASS

Target: commit `98c91b8` on `chore/session-2026-06-05-0a9c813f`.
Scope: set executor default model to opus everywhere it was sonnet; reframe model-selection rationale so only the read-only assistant is sonnet.

## Method

Verified by reading files and running git/grep — not trusting the producer. Applied the two loaded mistakes:
- `evaluator-false-pass-without-diffing`: diffed `git show 98c91b8` directly (full hunks below).
- `claude-evaluator-step4-only-vs-codex-whole-file-grep`: ran a whole-PROJECT grep for the retired wording, not just the changed sections — included the `features/` tree.

## Verification results

### 1. executor=opus stated consistently (all required sites confirmed)
- `delegation/SKILL.md`: principle line 280 (assistant-only sonnet), rationale 282 (executor in opus list), model table 288 (`| executor | — | opus |`), override example 294 (reframed to mechanical→sonnet / complex-assistant→opus), roster 326 (`Opus`). ✓
- `gobbi/SKILL.md`: taxonomy 148 (`opus`), operating bullets 238–239 (executor in opus list; sonnet = assistant only). ✓
- `planning/SKILL.md:248`: `executor→opus, leader→opus, assistant→sonnet`. ✓
- `agents/executor.md` frontmatter: `model: opus`. ✓ (`.claude/agents/executor.md` is a symlink → source; mirror reads `model: opus`.)

### 2. Completeness sweep — no remaining executor=sonnet or contract-bounded framing in live docs
Command: `grep -rniE "executor" skills/ agents/ | grep -iE "sonnet|opus|model"`
All `executor` hits assert opus. The only `sonnet` co-occurrences are sentences that correctly assign **assistant→sonnet** (delegation:282, planning:248).
- `grep "contract-bounded" skills/` → NONE.
- `grep "structured execution against|follows the contract|contract-bounded" skills/` → NONE.
- `grep executor=sonnet across whole project excluding sessions/notes/archive/mistakes/backlogs` → only the two assistant→sonnet sentences above.

### 3. Internal consistency
The reframed Model Selection section (delegation:278–296) is coherent end-to-end: principle, prose rationale, table, and override example all agree (opus = manager/leader/evaluator/executor; sonnet = assistant only). No sentence still implies executor is sonnet or contract-bounded. The override example was correctly inverted (was "narrow executor task warrants opus"; now "mechanical sub-task fits sonnet / complex assistant warrants opus"). Plain-language (Principle 14): yes.

### 4. Invariants — all hold
- assistant STILL sonnet: frontmatter `agents/assistant.md` = sonnet; delegation:280/290, gobbi:150/239 all sonnet. ✓
- leader/manager/evaluator unchanged opus: frontmatter all opus. ✓
- settings templates NOT modified: `git show 98c91b8 --stat` touches only `agents/executor.md` (+ 3 skill docs + the execution-record artifact). No settings.*.json, no other agent frontmatter. ✓

## Findings

CLA-CONS-001 — Low — design-doc staleness (informational, NON-BLOCKING)
- Type: general / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: Low
- Evidence: `features/workflow/design/orchestration-settings-skip-and-models.md:94-97,107-108` still reads "Defer executor-model drift fix … rejected — out of scope. `claude.executor: opus` while `delegation/SKILL.md` says executor=sonnet" and "The executor model drift … remains OPEN — not addressed in this change."
- Why it matters: a reader landing on this ADR out of context could believe the drift is still open and that delegation says sonnet — both now false after 98c91b8.
- Why NON-BLOCKING: this is an append-only `design/` ADR scoped to the *skip-key* change; it accurately records the scope of THAT change (the executor half was deliberately deferred there). The live authoritative model docs (delegation/gobbi/planning SKILL.md + executor.md) are fully corrected. Per the move-on-terminal / supersede-not-rewrite model, point-in-time decision records are not retroactively edited. Same applies to the historical hits in `install-runtime/plans/...:22`, `install-runtime/decisions/...:33`, and `workflow/changelogs/2026-06-05-...:71,77` — all are accurate records of prior states.
- Suggested direction (manager + user decide): if desired, annotate the design doc / backlog with a "closed by 98c91b8 (task-02)" pointer. Not required for PASS.

## Must-preserve list
- executor=opus across delegation:280/282/288/294/326, gobbi:148/238/239, planning:248, executor.md frontmatter.
- assistant stays sonnet everywhere (frontmatter + delegation:280/290 + gobbi:150/239).
- leader/manager/evaluator opus untouched.
- settings.*.json templates untouched by this commit.
- Coherent reframed Model Selection section — do not reintroduce "contract-bounded executor" language.

## Verdict
PASS — consistent, complete, assistant stays sonnet, invariants hold. The single Low finding is an informational note on an append-only historical ADR, not a defect in the deliverable.
