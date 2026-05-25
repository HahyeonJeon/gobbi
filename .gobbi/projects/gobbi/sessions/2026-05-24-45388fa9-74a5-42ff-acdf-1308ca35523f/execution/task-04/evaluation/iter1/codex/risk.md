# Risk Perspective

## Artifact Summary

The risk surface is documentation-induced operational error: a future hook might be registered incorrectly, fail silently, block Claude unexpectedly, or corrupt shared session JSON. The commit scope itself must remain reversible and limited.

## Locked Frame (Stage 1)

Scenario: The change has a bounded blast radius.
- Check: Only the three in-scope files changed.
- Check: No hook script, runtime config, or symlink was modified.
- Check: The backlog closure is reversible by a normal markdown edit.
- Adversarial check: The promoted skill does not alter runtime behavior until a future agent chooses to load and follow it.

Scenario: The skill does not create unmitigated hook-authoring risk.
- Check: Shared JSON writes are protected by `flock -x` and validation.
- Check: PostToolUse/PostToolUseFailure hooks are instructed to exit 0 on recoverable failures.
- Check: Registration guidance is exact enough to avoid silent non-firing hooks.

## Findings

No additional findings.

Why: The commit scope is tightly bounded and reversible. The registration mismatch captured as USAGE-001 is the main operational risk; this perspective adds no separate risk-only finding.

## Verification Evidence

- `git diff --name-only 9dbb5da~1 9dbb5da`: exactly three in-scope files.
- Out-of-scope files named in the prompt were not touched by commit `9dbb5da`.
- Skill evidence for risk controls: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:41-43`, `126-170`, `211-218`.
