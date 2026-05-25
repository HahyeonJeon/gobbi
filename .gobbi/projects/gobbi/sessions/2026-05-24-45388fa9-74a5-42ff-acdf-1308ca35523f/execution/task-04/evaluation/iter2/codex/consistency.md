# Consistency Perspective

## Artifact Summary

Consistency checks whether the revised skill matches the real project files and whether the prior iter1 consistency findings were actually remediated. The main witnesses are `.claude/settings.json` lines 32-52 and `.claude/hooks/session-start.sh` lines 27-55.

## Locked Frame

Scenario: Registration guidance mirrors `.claude/settings.json`.
- Check: every example hook command object includes `"type": "command"`.
- Check: every example command is a bare hook path, not a `"bash ..."` command string.
- Check: matcher strings match the real settings file.

Scenario: SessionStart payload and exit behavior match the witness.
- Check: SessionStart `source` is documented as top-level, distinct from `hook_event_name`.
- Check: SessionStart fatal paths include env-file guard failures, empty stdin, and strict-mode export failures.
- Adversarial check: no later verification instruction contradicts the corrected fatal-path guidance.

## Prior Finding Disposition

- CONSISTENCY-001 is resolved: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:57` now says the matcher uses the top-level `source` field, and lines 101-103 list `source` as a SessionStart field.
- CONSISTENCY-002 is partially resolved: line 31 now names the correct SessionStart fatal categories, but P7 still gives a generic malformed-JSON expectation that is wrong for SessionStart.

## Findings

### CONSISTENCY-002-R

Type: general
Severity: Medium
Confidence: 100
Evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:31` correctly says `session-start.sh` treats required-export failures under `set -euo pipefail` as fatal, but `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:221` still says to pass malformed JSON and verify the hook exits 0. The real witness has `set -euo pipefail` at `.claude/hooks/session-start.sh:27` and required `jq` export commands at `.claude/hooks/session-start.sh:51-55`; a fresh malformed-JSON run with `CLAUDE_ENV_FILE` set exited 5.
Why-it-matters: A hook author or evaluator applying P7 to a SessionStart hook will expect malformed JSON to exit 0, even though the corrected principle and real script intentionally treat malformed required-payload/export failures as fatal. That preserves part of the prior SessionStart exit-behavior ambiguity.
Suggested-direction: Split the failure-path test by event class: SessionStart malformed/empty payload should be expected to fail non-zero, while PostToolUse/PostToolUseFailure malformed JSON should exit 0 via `bail()`.
