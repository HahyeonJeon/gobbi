## Artifact Summary + Memory reads

Planning iter1 controls several risks well: file-overlap conflicts are sequenced, destructive cleanup mistakes are loaded for T1, and the `rm -rf` mistake is not extended into T3 where it does not apply. Two risks remain material: rollback behavior for promote-now is inconsistent with the upstream recovery contract, and Tasks 07/08 can fail verification because `shellcheck` is required but unavailable.

### Memory reads
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/planning/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.agents/skills/git/SKILL.md`
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

Scenario: Mid-plan failure leaves the project coherent.
- Check: tasks can be committed/reverted independently.
- Check: promote-now rollback semantics match Ideation's failure scenario.
- Adversarial coverage note: a rollback instruction that preserves an uncommitted copied file recreates the original failure mode.

Scenario: High-blast-radius operations are gated and sequenced.
- Check: shared docs are modified in sequenced tasks.
- Check: new hook scripts are verified before settings registration and row 6 narrative reference them.
- Adversarial coverage note: a settings registration task must not reference scripts before they exist.

Scenario: Cost, privacy, supply-chain, and observability risks are handled or not applicable.
- Check: no paid API calls are required.
- Check: no new dependencies are introduced without a plan.
- Check: execution-state observability is represented by hook/reconstructor outputs.
- Adversarial coverage note: depending on a globally installed verification tool is a supply-chain/execution risk if not declared.

## Per-scenario per-check results

Scenario: Mid-plan failure leaves the project coherent.
- no: T1.j rollback drift creates a direct risk. Ideation says failing promote-now must remove the copied file from the worktree before surfacing to the user (`ideation/rawdata/draft-iter3.md:283`). The plan says "no auto-rm" at `draft-iter1.md:173`.
- yes: task-level commits and per-iter cadence are called out in execution intake notes at `draft-iter1.md:539-550`.

Scenario: High-blast-radius operations are gated and sequenced.
- yes: `orchestration/SKILL.md` and `delegation/SKILL.md` overlaps are flagged and sequenced at `draft-iter1.md:394-395`.
- yes: Task 09 depends on Task 07; Task 10 depends on Tasks 07 and 08 (`draft-iter1.md:389-390`).

Scenario: Cost, privacy, supply-chain, and observability risks are handled or not applicable.
- yes: no plan task requires a paid API call for execution.
- no: `shellcheck` is an undeclared external executable in Tasks 07/08 verification (`draft-iter1.md:285`, `:309`), and it is not installed in this environment.
- yes: observability is the purpose of the T3 hook/reconstructor tasks and is represented by outputs `hook-script-artifact`, `reconstructor-artifact`, and settings registration.

## Typed findings

- finding-id: rollback-semantics-drift-from-ideation
- type: design_flaw
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: High
- evidence: The plan's "no auto-rm" rollback text (`draft-iter1.md:173`) contradicts Ideation's required copied-file removal (`ideation/rawdata/draft-iter3.md:283`).
- surfaced-by: codex

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: open
- confidence: 100
- severity: High
- evidence: `command -v shellcheck` returned no path, but Tasks 07/08 require `shellcheck` as verification (`draft-iter1.md:285`, `:309`) without installing or guarding it.
- surfaced-by: codex

## Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
