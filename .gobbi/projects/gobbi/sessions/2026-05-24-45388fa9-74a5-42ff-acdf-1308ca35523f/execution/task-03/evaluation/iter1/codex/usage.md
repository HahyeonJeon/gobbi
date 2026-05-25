# Usage Perspective - Codex Evaluation

## Artifact Summary + Memory reads
The consumers are future agents loading `mistake/SKILL.md` and future maintainers reading the hooks-domain backlog. The update must make the right operational behavior unambiguous: use the parent session ID from the delegation prompt, do not use the subagent's `$CLAUDE_CODE_SESSION_ID`, stage during working loops, and rely on Wrap-up assistant promotion rather than a CLI.

Memory reads: evaluator prompt, executor draft, planning artifacts, edited mistake skill, edited backlog, project process mistakes related to Codex path and artifact-shape failures, and the execution evaluation child doc.

## Locked Frame (Stage 1)
Scenario: Agent reading the `{session-id}` row can choose the correct ID.
- Check: the row states the source field.
- Check: the row states what not to read.
- Check: the row explains the subagent UUID failure mode.

Scenario: Agent reading promotion rules can choose the correct writer and phase.
- Check: working-loop agents know they write only session staging.
- Check: Wrap-up assistant is clearly named as the sole project/feature-memory promotion exception.
- Check: no instruction tells agents to call a CLI command.

Scenario: Future hook work can use the backlog as an operational reminder.
- Check: status is active enough to keep the item visible.
- Check: the N>=2 threshold tells future agents when to extract a skill.
- Check: the file avoids speculative pre-work while keeping moment-of-capture discipline.

Scenario: A tired operator follows an obsolete command path (adversarial).
- Check: command literal is absent from the target skill.
- Check: P4 points to Wrap-up-phase promotion.

## Per-scenario per-check results
Correct ID source: PASS. Line 129 names the delegation prompt's `session-id:` header field, says not to read `$CLAUDE_CODE_SESSION_ID`, and states the subagent UUID trap.

Correct writer and phase: PASS. Lines 11, 17, 21-23, 27, 45-47, 94-96, 105, and 119-124 separate working-loop staging from Wrap-up assistant promotion.

Backlog usability: PASS. The backlog is `in-progress` at line 3, calls itself a perpetual capture reminder at line 34, and gives the N>=2 extraction trigger at line 38. It also preserves the witness-bound rationale against speculative work.

Obsolete command path: PASS. The exact command literal count in the target skill is zero, and P4 is now titled "Wrap-up-phase promotion".

## Typed findings
No findings.

Reason: future agents get clear operational instructions for ID selection, staging, promotion, and hook-domain skill extraction timing.

## Low-confidence appendix
None.
