## Artifact Summary + Memory reads

Planning iter1 mostly traces cleanly to Ideation and Preparation: the 18 checklist anchors are present, the five locks are integrated, and file-overlap conflict flags are accurate for `orchestration/SKILL.md` and `delegation/SKILL.md`. The main consistency failure is a cross-artifact semantic drift in T1.j rollback behavior.

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

Scenario: Every trace points to a real Ideation checklist item.
- Check: `traces-to` strings exist in Ideation.
- Check: plan self-review covers all Ideation anchors exactly once or with justified multi-task coverage.
- Adversarial coverage note: a trace can be real but assigned to the wrong task.

Scenario: User locks are encoded consistently across sections.
- Check: dependency table, lane table, task table, assignment table, and locked-decision replay agree.
- Check: lock locations match user decisions.
- Adversarial coverage note: location lock compliance does not prove behavior compliance.

Scenario: Handoffs and verification claims match upstream semantics.
- Check: outputs and inputs are name-consistent across dependent tasks.
- Check: verification criteria validate the required behavior, not just a keyword.
- Adversarial coverage note: a grep for "rollback" can pass while the rollback instruction is wrong.

## Per-scenario per-check results

Scenario: Every trace points to a real Ideation checklist item.
- yes: all T1/T3 trace anchors appear in the Ideation artifact and plan. `rg` found all 18 anchors in both.
- yes with concern: Task 01 traces to T1-I-T1.c at `draft-iter1.md:132`, but T1.c is the `git/SKILL.md` P2 note and Task 01 edits only `orchestration/SKILL.md`. Task 02 covers the real P2 note at `draft-iter1.md:147-154`; self-review acknowledges "P2-invocation note edit lives in Task 02" at `:565`.

Scenario: User locks are encoded consistently across sections.
- yes: LOCK #1 appears in the dependency table and lane table (`draft-iter1.md:387`, `:398`, `:404-411`).
- yes: LOCK #2 is merged in the assignment table (`draft-iter1.md:458`).
- yes: LOCK #3 is limited to the procedural Iron Law 7 mistake for T3 (`draft-iter1.md:438-442`, `:527-533`).
- partial: LOCK #4's doc home is consistent, but T1.j behavior is not.
- yes: LOCK #5 appears as orchestration row 5.5 footnote location (`draft-iter1.md:248-251`, `:496`).

Scenario: Handoffs and verification claims match upstream semantics.
- yes: Task 07 outputs `shared-jq-snippets` and `hook-stdin-contract`; Task 08 inputs those exact names.
- no: Task 03's `verifies` only greps for rollback wording at `draft-iter1.md:189`, so it would not catch the semantic drift from Ideation's required removal behavior.

## Typed findings

- finding-id: rollback-semantics-drift-from-ideation
- type: design_flaw
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: High
- evidence: Ideation requires removing the copied file from the worktree (`ideation/rawdata/draft-iter3.md:235`, `:283`, `:322`); Task 03 instead says "git checkout" and "no auto-rm" (`planning/rawdata/draft-iter1.md:173`).
- surfaced-by: codex

- finding-id: task01-overclaims-t1c-trace
- type: checklist_gap
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: Low
- evidence: Task 01 traces to T1-I-T1.c (`draft-iter1.md:132`) even though Task 02 is the `git/SKILL.md` P2-note task and self-review says the P2 note edit lives in Task 02 (`draft-iter1.md:565`).
- surfaced-by: codex

## Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
