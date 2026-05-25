# Usage Perspective

## Artifact Summary

The downstream consumer is an agent or maintainer writing the next Claude Code hook. The skill must be sufficient to register, implement, and verify a hook correctly without having to reverse-engineer the witnesses.

## Locked Frame (Stage 1)

Scenario: A hook author can register a hook correctly from this skill alone.
- Check: The skill's registration object matches `.claude/settings.json`.
- Check: The skill names the event, matcher, command object, and script path fields accurately.
- Adversarial check: A copied example should not produce a settings entry that diverges from the project schema.

Scenario: A hook author can run the verification examples directly after filling real values.
- Check: "Valid JSON" examples are syntactically valid JSON or are explicitly marked as pseudocode.
- Check: Failure-path expectations match the hook event being tested.

## Findings

### USAGE-001

Type: design_flaw
Severity: High
Confidence: 100
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:55-58` says each settings hook entry needs `matcher` and `hooks[].command`, and the examples at `:63-75` show `hooks` objects with only `command`. Actual `.claude/settings.json:35-36`, `:43-44`, and `:51-52` use `{ "type": "command", "command": ".claude/hooks/..." }`.
Why-it-matters: The skill is meant to teach hook authoring. If a future author copies the registration shape from the skill, they will omit the `type: "command"` field used by the real project settings and may create a hook entry that does not match the current schema or project convention.
Suggested-direction: Update P1 and both JSON examples to include `type: "command"` and to mirror the in-tree command strings exactly, e.g. `{ "type": "command", "command": ".claude/hooks/post-tool-use-agents.sh" }`. If `bash ...` is intentionally supported, state it as an alternative rather than the project witness shape.

### USAGE-002

Type: checklist_gap
Severity: Low
Confidence: 75
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:201` labels `echo '{"session_id":"test","cwd":"/tmp",...}'` as a "minimal valid stdin payload", but the literal JSON contains `...` and is not valid JSON.
Why-it-matters: Verification examples in a hook-authoring skill should be copy-editable into runnable smoke tests. A placeholder inside a "valid" JSON example creates avoidable friction and can obscure whether a hook failure came from the script or the example payload.
Suggested-direction: Replace the ellipsis with a complete minimal payload for each hook class, or label the snippet as pseudocode and add one runnable example immediately below it.
