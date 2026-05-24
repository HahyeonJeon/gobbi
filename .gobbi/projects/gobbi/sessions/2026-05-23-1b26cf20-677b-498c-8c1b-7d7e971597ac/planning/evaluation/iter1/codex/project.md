## Artifact Summary + Memory reads

Planning iter1 evaluates `draft-iter1.md`, a 10-task execution plan for Bundle B: T1 worktree-first session architecture plus T3 `session.json.agents[]` hook/reconstructor work, with T2 deferred. What is clear: the plan decomposes 18 Ideation checklist anchors into ordered executor work. Why is clear: it implements the PASS iter3 Ideation scope and Preparation readiness locks. How is mostly clear: tasks list files, dependencies, verification, assignment, and execution-intake notes. Scope Contract source: `ideation/artifacts/bundle-b-ideation-pass.md`; downstream consumers are the manager constructing executor briefs, executors running Tasks 01-10, and later evaluators checking execution against this plan.

### Memory reads
- `.agents/skills/gobbi/SKILL.md`
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/orchestration/SKILL.md`
- `.agents/skills/discussion/SKILL.md`
- `.agents/skills/delegation/SKILL.md`
- `.agents/skills/git/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/planning/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.agents/skills/orchestration/templates/settings.default.json`
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

Scenario: Every Ideation checklist item is implemented or explicitly routed.
- Check: all 10 T1 anchors and all 8 T3 anchors from Ideation appear in the plan self-review table.
- Check: verification-only routing for T3.f and T3.h points to existing Ideation backlog files.
- Adversarial coverage note: a plan can mark an item covered while changing its semantics; T1.j is checked against raw Ideation detail, not just the summary label.

Scenario: The plan stays inside the Scope Contract.
- Check: no task adds T2, Codex CI, Auto-mode redesign, chat-mode redesign, status-field schema extension implementation, or `.gobbi/project.json` implementation.
- Check: T3.f and T3.h remain backlog-only, matching the Scope Contract's deferred list.
- Adversarial coverage note: a verification-only item must not become hidden implementation work.

Scenario: User-locked decisions are integrated.
- Check: LOCK #1 is encoded as dependency `05 -> 07`.
- Check: LOCK #2 is encoded as one assignment row for `07 + 08`.
- Check: LOCK #3 extends only the Iron Law 7 procedural mistake to T3 tasks.
- Check: LOCK #4 keeps T1.j rollback docs in `preparation/SKILL.md`.
- Check: LOCK #5 keeps direct-mode opt-out in `orchestration/SKILL.md` row 5.5 footnote.
- Adversarial coverage note: lock location can pass while the underlying upstream semantics drift.

## Per-scenario per-check results

Scenario: Every Ideation checklist item is implemented or explicitly routed.
- yes: `rg` found all Ideation anchors T1-I-T1.a through T1-I-T1.j and T3-I-T3.a through T3-I-T3.h in the plan. The self-review table at `draft-iter1.md:563-580` covers all 18.
- yes: `test -f` confirmed both verification-only backlog files exist: `schema-extension-agents-status-field.md` and `dot-gobbi-project-json-bootstrap.md`.
- no: T1.j is not semantically preserved. Ideation rawdata says the manager must remove the copied file from the worktree before surfacing to the user (`draft-iter3.md:283`, reinforced at `:235` and `:322`). The plan instead specifies "restoration via git checkout, no auto-rm of skill body" at `draft-iter1.md:173`.

Scenario: The plan stays inside the Scope Contract.
- yes: no task implements T2, Codex CI, Auto-mode redesign, chat-mode redesign, or broader validator work. The out-of-scope section at `draft-iter1.md:616-635` preserves those exclusions.
- yes: T3.f and T3.h are verification-only at `draft-iter1.md:366-374` and self-review lines `578` and `580`.

Scenario: User-locked decisions are integrated.
- yes: LOCK #1 is encoded by `05` depending into `07` at `draft-iter1.md:387` and explained at `:398`.
- yes: LOCK #2 is encoded by the merged `07 + 08` agent row at `draft-iter1.md:458`.
- yes: LOCK #3 is encoded at `draft-iter1.md:438-442` and `:527-533`.
- partial: LOCK #4's location is correct at `draft-iter1.md:173`, `:474`, and `:494`, but the rollback behavior drifts from Ideation.
- yes: LOCK #5 location is correct at `draft-iter1.md:248-251`, `:479`, and `:496`.

## Typed findings

- finding-id: rollback-semantics-drift-from-ideation
- type: design_flaw
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: High
- evidence: Ideation requires `git -C "$worktreePath" rm` before surfacing a failed promote-now copy (`ideation/rawdata/draft-iter3.md:283`); the plan changes this to "restoration via git checkout, no auto-rm" (`planning/rawdata/draft-iter1.md:173`).
- surfaced-by: codex

## Verdict

VERDICT: REVISE

## Low-confidence appendix

None. The blocking finding is directly cross-checked against the raw Ideation checklist detail.
