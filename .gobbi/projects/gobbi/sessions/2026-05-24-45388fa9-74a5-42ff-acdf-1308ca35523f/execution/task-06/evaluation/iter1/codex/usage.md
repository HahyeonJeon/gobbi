## Artifact Summary + Memory reads

Evaluated commit `a8968f8` for T06 / CL-5. Memory reads included `plan.md:573-583`, `plan.md:734-751`, current target skill rows, and `f-risk-01-subagent-ccsi-semantics.md:61-75`.

## Locked Frame (Stage 1)

Scenario: future agents can correctly construct session paths from the row.
- Check: the row says to use the delegation prompt's `session-id:` field.
- Check: the row explicitly says not to read `$CLAUDE_CODE_SESSION_ID` for this value.
- Check: the row explains the spawned-subagent failure mode.

Scenario (adversarial): `gobbi/SKILL.md` env-health prose is wrongly rewritten, making runtime checks less clear.
- Check: `gobbi/SKILL.md` keeps the three legitimate CCSI mentions.

## Per-scenario per-check results

Pass. The 10 target rows contain the three locked clauses, and `grep -cE '\\$CLAUDE_CODE_SESSION_ID|`CLAUDE_CODE_SESSION_ID`' .claude/skills/gobbi/SKILL.md` returned `3`. The `gobbi/SKILL.md` hits at lines 38, 52, and 63 remain env-var passthrough/runtime-health prose, not Path-conventions guidance.

## Typed findings

No findings. The user/agent-facing instruction is direct and preserves the intended runtime-health exception.

## Low-confidence appendix

None.
