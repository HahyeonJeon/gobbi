# Structure — Planning iter1 Evaluation (Codex)

## Artifact Summary
The artifact is a Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it decomposes the locked Ideation iter2 artifact into seven ordered tasks with files, dependencies, required skills, risks, success criteria, and verification commands. Why: it should give fresh executors narrow contracts for implementing the redesign without improvising around user-locked decisions. How: it sequences mode docs before the SKILL.md amendment, keeps JSON/template edits independent, files one backlog, and defers backlog archiving to Wrap-up. Scope Contract source: Ideation artifact sections 2 and 7. Downstream consumers are executor agents, the Wrap-up assistant, and the manager reconciling evaluator findings.

## Memory reads
- Required skills and rules listed in `project.md`.
- Planning draft: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- Ideation artifact: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- Gobbi skill map: `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`

## Locked Frame (Stage 1)
Scenario 1: Task dependencies form a DAG and match the documented order.
- Check: T3 depends on T1 and T2 and appears after both.
- Check: T6 depends on T1, T2, and T3 and runs only in Wrap-up after Execution tasks pass.
- Check: T1, T2, T4, T5, and T7 have no hidden file-overlap dependency requiring sequencing beyond the stated order.

Scenario 2: Required skills are loadable by the assigned agent.
- Check: each required skill exists under the repo-local `.agents/skills` or the task provides a valid replacement path.
- Check: no task depends on a known-absent skill.

Scenario 3: Verification structure is concrete enough to support fresh execution.
- Check: commands that claim "byte-for-byte preserved" name a concrete baseline.
- Check: commands that verify additive-only changes cover every file named by the success criteria.
- Check: plan-level commands assert, rather than merely print, expected results.

Scenario 4 (adversarial): Two independent-looking tasks share a missing prerequisite.
- Check: task-level required-skill lists are compared against the actual repo-local skills.
- Check: a missing shared prerequisite is treated as a plan blocker, not an executor burden.

Coverage matrix declarations:
- Dependency supply chain: no new dependency is planned, but required-skill availability is a structural dependency.
- Observability: the Plan includes a Plan-level acceptance gate, but the gate must be executable as a binary test to serve as an observable signal.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes: the stated order T1 -> T2 -> T4 -> T5 -> T3 -> T7 is topologically compatible with `requires:`. T3 requires `[01-chat-mode-canonical-spec, 02-auto-mode-canonical-spec]` and comes after T1/T2. T6 requires T1/T2/T3 and is in Wrap-up. File sets are distinct except for intentional conceptual coupling through orchestration docs.

Scenario 2 result:
- No: T1, T2, T3, T4, and T5 require `claude`, and the cross-reference list names `.claude/skills/claude/SKILL.md`. The Gobbi skill map explicitly marks this doc-authoring skill as absent, and local filesystem checks confirm no `.agents`, `.claude`, or canonical `.gobbi` `claude/SKILL.md` exists.

Scenario 3 result:
- No: T4 and T5 verification commands use unresolved baseline placeholders such as `<pre-T4-rev>` and `<pre-T5-rev>`. T5's additive-only verification checks deletions for `state.template.json` only, despite the success criteria covering both state and session templates.

Scenario 4 result:
- No: the absent `claude` skill is a shared prerequisite across most executor tasks, so the plan can fail before implementation begins.

Findings:

### codex-structure-001
- Type: design_flaw
- Domain: planning
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:138-142` requires `claude`; `draft-iter1.md:195-199`, `245-249`, `288-292`, and `352-356` repeat that requirement; `draft-iter1.md:540` cites `.claude/skills/claude/SKILL.md`. `gobbi/SKILL.md:187` says the `claude` doc-authoring standard is "currently absent" and "do not rely on this row until it resolves." Local checks returned `agents_claude_skill=1`, `claude_mirror_skill=1`, `canonical_claude_skill=1`.
- Disposition: open

### codex-structure-002
- Type: checklist_gap
- Domain: planning
- Confidence: 75
- Severity: Medium
- Evidence: T5 success criteria require both existing workflow loop fields to be byte-for-byte preserved and no new top-level keys outside `workflow.chat` (`draft-iter1.md:276-278`), but its only additive-only diff command is `git diff <pre-T5-rev> -- <state.template.json> | grep -cE '^\\-' | grep -q '^0$'` (`draft-iter1.md:284`), which omits `session.template.json` and does not check top-level key bleed.
- Disposition: open

VERDICT: REVISE

## Low-confidence appendix
None.
