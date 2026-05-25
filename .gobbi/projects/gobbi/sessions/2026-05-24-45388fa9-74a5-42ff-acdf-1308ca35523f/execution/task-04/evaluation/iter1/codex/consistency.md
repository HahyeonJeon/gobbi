# Consistency Perspective

## Artifact Summary

Consistency checks whether the authored skill matches the two hook witnesses and `.claude/settings.json`, with special attention to the prompt's required areas: env-file `@sh` passthrough, `agents[]` upsert, `flock -x`, matcher strings, stdin payload fields, and settings registration.

## Locked Frame (Stage 1)

Scenario: The skill's hook mechanics match the witness scripts.
- Check: SessionStart payload fields are described as they appear in `session-start.sh`.
- Check: PostToolUse/PostToolUseFailure fields and `agents[]` upsert mechanics match `post-tool-use-agents.sh`.
- Check: `flock -x` and atomic `mv` guidance matches the actual critical section.
- Adversarial check: The skill does not invent nested payload fields or overstate exit behavior.

Scenario: The skill's settings registration guidance matches project settings.
- Check: Matcher strings match `.claude/settings.json`.
- Check: Hook command object shape matches `.claude/settings.json`.

## Findings

### CONSISTENCY-001

Type: design_flaw
Severity: Medium
Confidence: 100
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:57` says the SessionStart matcher is matched against `hook_event_name.source`. The actual payload fields are top-level `hook_event_name` and top-level `source`; `session-start.sh:51-55` exports them separately, and `.claude/settings.json:32-36` registers the matcher string `startup|resume|clear|compact`.
Why-it-matters: `hook_event_name.source` is not a real field path in the witness payload. This contradicts the skill's own payload list at `:82-96` and can lead future hook authors to look for or document a nested field that does not exist.
Suggested-direction: Replace `hook_event_name.source` with `source`, and optionally add one sentence that `hook_event_name` remains `SessionStart` while `source` carries `startup|resume|clear|compact`.

### CONSISTENCY-002

Type: general
Severity: Medium
Confidence: 100
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:31` says `session-start.sh` exits 1 "only if" `$CLAUDE_ENV_FILE` is unset or unwritable. The witness also exits 1 for empty stdin at `.claude/hooks/session-start.sh:45-46`, and `set -euo pipefail` at `:27` means malformed JSON or failed required `jq` extraction can also abort non-zero.
Why-it-matters: The skill is teaching strict-mode discipline. Understating the fatal paths makes the SessionStart behavior look narrower than the actual witness and weakens future review of malformed-payload handling.
Suggested-direction: Reword the principle to say SessionStart treats env-file and payload/export failures as fatal, with explicit examples for unset env file, unwritable env file, empty stdin, and strict-mode `jq` failures.
