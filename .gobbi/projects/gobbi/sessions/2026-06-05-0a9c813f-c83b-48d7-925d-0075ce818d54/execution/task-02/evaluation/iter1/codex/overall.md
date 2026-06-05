# Execution Evaluation - task-02 executor default model to opus - Codex iter1 Overall

VERDICT: REVISE

## Rationale

The core model-default edits in commit `98c91b8` are correct in the authoritative skill and agent surfaces: `delegation`, `gobbi`, `planning`, and `agents/executor.md` now state executor=`opus`; assistant remains `sonnet`; manager/leader/evaluator remain `opus`; and `git show --stat 98c91b8` shows no template JSON changes.

The completeness criterion does not pass. A broader sweep outside the explicitly immutable folders (`sessions/`, `notes/`, `archive/`, `mistakes/`, `backlogs/`) still finds active feature-memory files saying executor defaults to `sonnet` or that the executor model drift remains open. That contradicts the task claim that executor=`opus` is now consistent everywhere relevant and that no file was missed.

## Verification Evidence

- `git show --stat --oneline 98c91b8`: changed `.gobbi/projects/gobbi/agents/executor.md`, `.gobbi/projects/gobbi/skills/delegation/SKILL.md`, `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`, `.gobbi/projects/gobbi/skills/planning/SKILL.md`, and the task execution record. No `templates/*.json`.
- Literal `git diff develop..HEAD -- skills/ agents/` from the worktree root returned no diff because this worktree stores canonical Gobbi files under `.gobbi/projects/gobbi/{skills,agents}`. I evaluated those canonical paths directly.
- Required sweep from `.gobbi/projects/gobbi`: `grep -rniE "executor" skills/ agents/ | grep -iE "sonnet|opus|model"` produced 11 hits. Each hit was read. The authoritative `skills/` and `agents/` hits are consistent: executor=`opus`; `sonnet` belongs to assistant or unrelated prose.
- Retired wording sweep in `skills/` and `agents/`: no hits for `contract-bounded`, `contract bounded`, `structured execution against an explicit spec`, `executor.*sonnet`, or `sonnet.*executor`.
- Invariant check: `agents/manager.md:5`, `agents/leader.md:5`, `agents/executor.md:5`, and `agents/evaluator.md:5` are `model: opus`; `agents/assistant.md:5` is `model: sonnet`.
- Template invariant: `skills/orchestration/templates/settings.auto.json:38-42` and `settings.chat.json:38-42` already have Claude manager/leader/executor/evaluator=`opus`, assistant=`sonnet`; commit `98c91b8` did not modify them.
- Broader non-immutable sweep run from the worktree root:

```bash
rg -n -i '(executor.{0,120}sonnet|sonnet.{0,120}executor|contract[- ]bounded|structured execution against an explicit spec)' \
  .gobbi/projects/gobbi \
  -g '!**/sessions/**' \
  -g '!**/archive/**' \
  -g '!**/notes/**' \
  -g '!**/mistakes/**' \
  -g '!**/backlogs/**'
```

This found the active feature-memory stale references listed below.

## Findings

### COD-OVERALL-001 - Active feature memory still says executor is sonnet or drift is open

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Severity: `High`
- Confidence: `100`
- Evidence:
  - `.gobbi/projects/gobbi/features/workflow/design/orchestration-settings-skip-and-models.md:95` still says ``delegation/SKILL.md`` says executor=`sonnet`.
  - `.gobbi/projects/gobbi/features/workflow/design/orchestration-settings-skip-and-models.md:107` still says the executor model drift remains open and unaddressed.
  - `.gobbi/projects/gobbi/features/install-runtime/plans/2026-05-30-gobbi-claude-code-plugin-build.md:22` says all tasks are executor with `sonnet` default.
  - `.gobbi/projects/gobbi/features/install-runtime/decisions/plugin-plan-decomposition-and-ordering.md:33` says all tasks go to executor with `sonnet` default.
  - These files are not under the explicitly excluded immutable folders. They are tracked active feature memory; `orchestration-settings-skip-and-models.md` has `status: active` at line 7 and was added on this branch.
- False-positive check: Not pre-existing historical session output, not under `sessions/`, `notes/`, `archive/`, `mistakes/`, or `backlogs/`. If the project intends active feature `plans/`, `decisions/`, and `design/` records to be point-in-time immutable, the exclusion list in the task brief needs to say that. Under the stated criteria, these are missed files.
- Impact: A reader of active project memory can still conclude that executor defaults to `sonnet` or that the executor drift remains unresolved. This fails the task's "no file was missed" and "executor=opus is consistent everywhere" pass condition.

### COD-OVERALL-002 - The execution record's semantic sweep was too narrow for the stated claim

- Type: `checklist_gap`
- Domain: `process`
- Disposition: `open`
- Severity: `Medium`
- Confidence: `100`
- Evidence:
  - `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-02/artifacts/execution-record.md:16` claims executor=`opus` was set everywhere it had been documented as `sonnet`.
  - `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-02/artifacts/execution-record.md:88-90` records only `grep ... skills/ agents/`, then concludes every executor=`sonnet` assertion was flipped.
  - `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-02/artifacts/execution-record.md:111-112` excludes `notes/`, `sessions/`, `archive/`, `mistakes/`, and `backlogs/`, but does not exclude `features/`; the broader sweep finds stale active `features/` hits.
- False-positive check: The execution record is part of commit `98c91b8`, and the stale feature-memory evidence is tool-verified. This is not a style preference or speculative concern.
- Impact: The executor verification repeated the prior narrow-grep failure pattern called out in project mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep`.

## Passing Checks

- `skills/delegation/SKILL.md:280-290` coherently says reasoning/implementation-heavy roles use `opus`, assistant uses `sonnet`, and the executor table row is `opus`.
- `skills/delegation/SKILL.md:324-328` roster has manager/leader/executor/evaluator=`Opus`, assistant=`Sonnet`.
- `skills/gobbi/SKILL.md:146-150` taxonomy has manager/leader/executor/evaluator=`opus`, assistant=`sonnet`.
- `skills/gobbi/SKILL.md:238-239` operating bullets put executor in the `opus` role list and assistant in the `sonnet` role list.
- `skills/planning/SKILL.md:248` says defaults are executor=`opus`, leader=`opus`, assistant=`sonnet`.
- `agents/executor.md:5` is `model: opus`.
- No remaining `contract-bounded` or `structured execution against an explicit spec` framing in canonical `skills/` or `agents/`.

## Karpathy Mode Checks

- Wrong assumptions: present. The implementation assumed `skills/` and `agents/` were the complete live surface for executor-model statements, but active feature memory also contains current-looking model statements.
- Overcomplexity: not found.
- Orthogonal edits: not found in commit `98c91b8`; the changed core files map to the model-default task.
- Imperative-over-declarative: present in verification. The recorded proof used a command limited to `skills/ agents/` rather than proving the declarative property "no stale executor-sonnet statements outside immutable folders."

## Preserve

- Keep executor=`opus` in `agents/executor.md`, `skills/delegation/SKILL.md`, `skills/gobbi/SKILL.md`, and `skills/planning/SKILL.md`.
- Keep assistant=`sonnet` in agent frontmatter, delegation table/roster, gobbi taxonomy/operating bullets, planning defaults, and settings templates.
- Keep manager/leader/evaluator=`opus`.
- Keep settings templates untouched by this task unless a separate task explicitly scopes them.
