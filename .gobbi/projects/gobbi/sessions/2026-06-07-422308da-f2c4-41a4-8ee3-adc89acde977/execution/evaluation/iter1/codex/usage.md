## Artifact Summary + Memory reads

Artifact: docs-only diff `HEAD~3..HEAD`.

What / Why / How: same as `project.md`; this perspective checks whether a future manager can follow the docs without asking the wrong question or idling.

Memory reads: Plan, Idea, full changed files, escalation grep output, and `chat-mode.md` context around the only `regression` grep hit.

## Locked Frame (Stage 1)

Scenario: an Auto manager reaches evaluation.
- Check: docs say to run dual-system evaluation without asking how/whether to evaluate.
- Check: docs say manager does not evaluate itself.

Scenario: an Auto manager receives REVISE.
- Check: docs say to auto-iterate within budget instead of asking defer/accept.
- Check: Always-Ask and safety gates still interrupt.

Scenario: a Chat manager reads the same global block.
- Check: Chat still discusses findings with the user before improving.

Adversarial scenario: a manager sees `claude-only` and treats it as a normal setup option.
- Check: `claude-only` is confined to degraded mode after failure and retry.

## Per-scenario per-check results

Auto evaluation start: PASS. `auto-mode.md:283-289` forbids evaluate-mode questions. `workflow/evaluation.md:5` and `auto-mode.md:291-299` forbid self-evaluation and require exactly two evaluator subagents.

Auto REVISE: PASS. `auto-mode.md:303-313` says REVISE re-enters DISCUSSION and re-delegates automatically, with no routine-triage interruption. `workflow/evaluation.md:245,252,264` mode-splits Regression marking, Stuck detection, and Iteration Caps. `.claude/CLAUDE.md:27` matches: Auto auto-iterates on REVISE and reviews the full finding set at Wrap-up.

Safety and Always-Ask: PASS. `auto-mode.md:315-324` preserves safety-gate and Always-Ask interruptions. `workflow/evaluation.md:93,111,123,141,194-203` labels safety-gate behavior in both modes.

Chat behavior: PASS. `.claude/CLAUDE.md:27` preserves Chat discussion. `workflow/evaluation.md:245,252,264` preserves Chat branches. `chat-mode.md` is unchanged; its grep hit at line 564 is the generic phrase `silent regression`, not a Stuck/Regression evaluation rule.

Claude-only boundary: PASS. `auto-mode.md:285-289` and `workflow/evaluation.md:194` make `claude-only` post-failure-only.

## Typed findings

No Usage findings.

## Low-confidence appendix

None.

Verdict: PASS
