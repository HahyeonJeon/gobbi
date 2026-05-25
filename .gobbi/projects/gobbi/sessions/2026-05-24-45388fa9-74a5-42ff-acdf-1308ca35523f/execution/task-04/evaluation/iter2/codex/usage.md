# Usage Perspective

## Artifact Summary

Usage checks whether the revised skill can be copied by a future hook author without producing an invalid settings entry or a misleading smoke test. The High registration defect from iter1 is resolved; one Low follow-on defect remains in the new SessionStart smoke-test command.

## Locked Frame

Scenario: A future hook author can copy the registration shape.
- Check: the copied JSON includes event name, matcher, `type`, and command path.
- Check: the copied command path matches the current project settings exactly.
- Adversarial check: no example uses the old `"bash ..."` command prefix.

Scenario: A future hook author can run the smoke-test snippets as success examples.
- Check: JSON payloads are concrete and syntactically complete.
- Check: the command includes non-payload runtime prerequisites required by the witness script.
- Adversarial check: the command should not fail before testing the payload because a required environment variable was omitted.

## Prior Finding Disposition

- USAGE-001 is resolved: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:57-59` and lines 65-80 include `"type": "command"` and bare hook paths matching `.claude/settings.json:32-52`.
- USAGE-002 is partially resolved: the literal `...` payload is gone, but the replacement SessionStart success command is still not directly runnable against the real hook unless the caller also sets `CLAUDE_ENV_FILE`.

## Findings

### USAGE-002-R

Type: checklist_gap
Severity: Low
Confidence: 95
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:208-212` shows a SessionStart smoke-test command and `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:218` says to confirm the hook exits 0. The real hook exits 1 when `$CLAUDE_ENV_FILE` is unset at `.claude/hooks/session-start.sh:32-39`; running the documented command exactly produced `session-start.sh: $CLAUDE_ENV_FILE is unset -- cannot persist env vars` and exit code 1.
Why-it-matters: The previous ellipsis problem is fixed, but the new example still fails as a copy-paste success test. That can make a future author debug the wrong thing when the only missing piece is the required env-file target.
Suggested-direction: Make the SessionStart smoke test include the runtime prerequisite, for example `CLAUDE_ENV_FILE=/tmp/gobbi-session-start.env bash .claude/hooks/session-start.sh <<'EOF' ... EOF`, then inspect the env file for exported lines.
