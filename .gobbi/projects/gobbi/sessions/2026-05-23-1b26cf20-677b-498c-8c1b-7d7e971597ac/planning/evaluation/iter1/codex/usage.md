## Artifact Summary + Memory reads

Planning iter1 is intended to be handed to fresh executor agents as scoped task briefs. Most tasks have enough files, inputs, outputs, and command checks to start without manager context. Usage breaks on Tasks 07/08 because a required verification command is not available in the current environment and the plan gives no fallback for a missing executable.

### Memory reads
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/planning/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.agents/skills/delegation/SKILL.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md`
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- `planning/rawdata/draft-iter1.md`
- `ideation/artifacts/bundle-b-ideation-pass.md`
- `ideation/rawdata/draft-iter3.md`
- `preparation/artifacts/preparation.md`

## Locked Frame (Stage 1)

Scenario: A fresh executor can execute each task from its task block.
- Check: each task names files to edit.
- Check: each task names concrete verification commands.
- Check: commands are runnable as-is or declare prerequisites.
- Adversarial coverage note: a missing local tool turns a concrete command into an execution blocker.

Scenario: Executor-facing failure modes are communicated.
- Check: mistake bundles are included for T1 and T3 per locks.
- Check: edit-contract notes are present for symlinked `.claude/skills/...` paths.
- Adversarial coverage note: a mistake tier must not include irrelevant rules that make load directives noisy.

Scenario: Inter-task handoff is explicit.
- Check: outputs and inputs line up for dependent tasks.
- Check: Task 07 produces shared jq snippets and hook stdin contract for Task 08.
- Adversarial coverage note: merged delegation must not obscure which artifact Task 08 consumes.

## Per-scenario per-check results

Scenario: A fresh executor can execute each task from its task block.
- yes: every task block lists `files` and `verifies`.
- no: Tasks 07 and 08 require `shellcheck` (`draft-iter1.md:285`, `:309`). `command -v shellcheck` returned no executable. The plan does not say to install it, skip it if absent, or replace it with another check.

Scenario: Executor-facing failure modes are communicated.
- yes: T1 task briefs get the full three-mistake bundle at `draft-iter1.md:434-436` and `:515-523`.
- yes: T3 task briefs get only the Iron Law 7 procedural mistake at `draft-iter1.md:438-442` and `:527-533`.
- yes: edit-contract notes are present at `draft-iter1.md:506-513` and in assignment notes for Tasks 01-06 and 10.
- yes with concern: Task 09 includes `stub-redirect-format.md` as a tier-4 add-on even though it is not a mistake and does not govern JSON edits (`draft-iter1.md:459`).

Scenario: Inter-task handoff is explicit.
- yes: Task 07 outputs `shared-jq-snippets` and `hook-stdin-contract` at `draft-iter1.md:281-283`; Task 08 consumes both at `:303-305`.
- yes: the merged executor row at `draft-iter1.md:458` explains why both tasks share context.

## Typed findings

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: open
- confidence: 100
- severity: High
- evidence: Tasks 07/08 require `shellcheck`, but `command -v shellcheck` returned no path and the plan declares no installation or fallback.
- surfaced-by: codex

- finding-id: task09-stub-rule-in-mistake-tier
- type: checklist_gap
- domain: process
- disposition: open
- confidence: 100
- severity: Low
- evidence: `draft-iter1.md:459` cites `stub-redirect-format.md` in a tier-4 mistakes cell for JSON validation, while that rule covers Markdown stub redirects.
- surfaced-by: codex

## Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
