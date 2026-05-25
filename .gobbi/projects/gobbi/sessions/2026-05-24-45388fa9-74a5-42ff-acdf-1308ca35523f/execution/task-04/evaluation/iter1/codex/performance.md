# Performance Perspective

## Artifact Summary

This is a docs-only project skill and backlog update. Runtime performance is not directly applicable, but the skill must avoid recommending hook patterns that would create avoidable runtime contention or expensive behavior.

## Locked Frame (Stage 1)

Scenario: Hook-authoring guidance does not introduce avoidable runtime cost.
- Check: Shared JSON writes are serialized with `flock -x`.
- Check: Transcript scanning guidance chooses the last matching line with `tail -n1`.
- Check: Non-matching tools exit early before expensive work.
- Adversarial check: Broad PostToolUse hooks do not process every tool invocation.

## Findings

No findings.

Why: Performance is largely not applicable for this docs-only change. The skill preserves the important cost controls from the hook witnesses: early tool-name filtering, narrow transcript lookup, and locked read-modify-write only around the shared JSON update.

## Verification Evidence

- Skill evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:45-47`, `172-186`, `211-218`.
- Witness evidence: `.claude/hooks/post-tool-use-agents.sh:55-58`, `151-161`, `219-249`.
