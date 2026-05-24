## Artifact Summary + Memory reads

Planning iter1 is a task-decomposition artifact for Bundle B. It maps the locked T1/T3 scope into 10 executor tasks, dependency lanes, agent assignments, and verification notes. The decomposition is mostly sound: file-overlap conflicts are explicit, T1->T3 wave ordering is locked, and Tasks 07/08 are intentionally grouped into one executor delegation. Downstream consumers depend on this plan to spawn executors without re-planning.

### Memory reads
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/planning/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.agents/skills/delegation/SKILL.md`
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

Scenario: Task dependencies form an explicit DAG.
- Check: each task has `requires` and the dependency table agrees with task-level requirements.
- Check: file-overlap conflicts have sequencing edges.
- Adversarial coverage note: two tasks sharing a file must not rely on lane prose alone.

Scenario: Each task's verification is executable by a fresh executor.
- Check: `verifies` entries are concrete commands or file checks.
- Check: external tools named in `verifies` are either available or bootstrapped in the task.
- Adversarial coverage note: a command can look concrete but be non-runnable in the repo environment.

Scenario: Agent assignments match available agents.
- Check: every assigned `agent` resolves to a file under `.claude/agents/`.
- Check: merged assignments remain one delegation, not ambiguous parallel work.
- Adversarial coverage note: an assignment table can say "shared executor" while dependency table still implies two separate delegations.

## Per-scenario per-check results

Scenario: Task dependencies form an explicit DAG.
- yes: dependencies are explicit in each task and summarized at `draft-iter1.md:377-390`.
- yes: `orchestration/SKILL.md` overlaps are flagged and sequenced at `draft-iter1.md:394`; `delegation/SKILL.md` overlap is flagged at `:395`.
- yes: LOCK #1 uses dependency `05 -> 07`, visible in the table at `draft-iter1.md:387` and narrative at `:398`.

Scenario: Each task's verification is executable by a fresh executor.
- yes: most tasks use concrete `grep`, `jq`, `test -L`, and `bash -n` checks.
- no: Tasks 07 and 08 require `shellcheck` at `draft-iter1.md:285` and `:309`. `command -v shellcheck` returned no path in the workspace, and `rg -n "shellcheck" .` found no bootstrap or fallback outside this plan artifact.

Scenario: Agent assignments match available agents.
- yes: `ls .claude/agents/` returned `assistant.md`, `evaluator.md`, `executor.md`, `leader.md`, and `manager.md`; every task assignment uses `executor`.
- yes: `draft-iter1.md:458` encodes `07 + 08` as a single executor delegation, satisfying LOCK #2.

## Typed findings

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: open
- confidence: 100
- severity: High
- evidence: Tasks 07 and 08 require `shellcheck` (`draft-iter1.md:285`, `:309`), but `command -v shellcheck` returned no path and no repo bootstrap was found by `rg -n "shellcheck" .`.
- surfaced-by: codex

## Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
