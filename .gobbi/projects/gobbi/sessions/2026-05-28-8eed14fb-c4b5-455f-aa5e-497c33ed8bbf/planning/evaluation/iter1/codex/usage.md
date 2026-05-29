# Usage — Planning iter1 Evaluation (Codex)

## Artifact Summary
The artifact is a Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it gives task-level execution briefs for fresh agents. Why: it should remove ambiguity so executors do not ask the manager to re-plan. How: it lists inputs, required skills, required mistakes, target files, success criteria, and verification commands for each task. Scope Contract source: Ideation sections 2, 3, 4, 5, 6, 7, and 9. Downstream consumers are fresh executor agents and the Wrap-up assistant.

## Memory reads
- Required skills and rules listed in `project.md`.
- Planning draft and Ideation artifact listed in `project.md`.
- Gobbi skill map and current repo-local `.agents/skills` directory listing.
- Planning evaluation child doc usage section.

## Locked Frame (Stage 1)
Scenario 1: A fresh executor can load the task's required context.
- Check: required skills exist or are explicitly replaced by current project rules.
- Check: required mistakes are readable and relevant.
- Check: task context does not point to absent mirror paths.

Scenario 2: Verification commands are runnable as-is or give deterministic substitution instructions.
- Check: `<worktree>` is acceptable when the worktree path is supplied elsewhere.
- Check: file placeholders such as `<settings.default.json>` are resolved in the task or command.
- Check: baseline placeholders such as `<pre-T4-rev>` are defined before use.

Scenario 3: Failure modes are communicated before the executor hits them.
- Check: expected symlink/file-existence false positives are pre-annotated.
- Check: deleted `plugins/` mirror is not left as a NEEDS_CONTEXT trap.

Scenario 4 (adversarial): The executor needs to ask "what does this command actually prove?"
- Check: commands that use `grep -c`, `wc -l`, `jq`, or `find | wc -l` either assert values or have an explicit interpretation step.
- Check: pass/fail expectations are machine-enforced when the plan calls the gate binary.

Coverage matrix declarations:
- Operator accessibility: the plan is readable, but executor usability depends on loadable skills and concrete commands.
- Observability: the Plan-level acceptance gate is supposed to be the operator signal.

## Evaluation (Stage 2)
Scenario 1 result:
- No: the `claude` skill is required by five tasks and cited as a skill file, but it does not exist in `.agents/skills`, `.claude/skills`, or canonical `.gobbi/projects/gobbi/skills`.

Scenario 2 result:
- No: T4 and T5 use undefined `<pre-T4-rev>` and `<pre-T5-rev>` baseline placeholders. T4 also uses `<settings.default.json>` after the first command instead of the concrete path. T5 uses `<state.template.json>` and `<session.template.json>` placeholders. The executor can infer them, but the Planning usage standard asks for commands runnable as-is.

Scenario 3 result:
- No: the prompt pre-annotation says not to require plugin mirror work, but the Plan tells executors to check `plugins/gobbi/...` and surface NEEDS_CONTEXT if ambiguous.

Scenario 4 result:
- No: the Plan-level acceptance gate says it is binary, but several commands only print counts or `jq` values. For example, missing `workflow.chat.tasks` would make `jq '.workflow.chat.tasks'` print `null` and still exit 0.

Findings:

### codex-usage-001
- Type: design_flaw
- Domain: execution-readiness
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:138-142` requires `claude`; `draft-iter1.md:540` cites `.claude/skills/claude/SKILL.md`; local checks returned `agents_claude_skill=1`, `claude_mirror_skill=1`, and `canonical_claude_skill=1`. The Gobbi skill map at `gobbi/SKILL.md:187` says the `claude` skill is absent and should not be relied on.
- Disposition: open

### codex-usage-002
- Type: assumption_risk
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:237-241` uses `<settings.default.json>` and `<pre-T4-rev>`; `draft-iter1.md:280-284` uses `<state.template.json>`, `<session.template.json>`, and `<pre-T5-rev>`. No task step defines how to capture the pre-task revision before those commands run.
- Disposition: open

### codex-usage-003
- Type: checklist_gap
- Domain: verification
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter1.md:458` says the Plan-level gate runs after Execution; `draft-iter1.md:468-487` uses `find | wc -l`, `grep -c`, and `jq` value printing with comments such as `# expect 2` / `# []`, but those commands do not fail when the expected value is wrong.
- Disposition: open

VERDICT: REVISE

## Low-confidence appendix
None.
