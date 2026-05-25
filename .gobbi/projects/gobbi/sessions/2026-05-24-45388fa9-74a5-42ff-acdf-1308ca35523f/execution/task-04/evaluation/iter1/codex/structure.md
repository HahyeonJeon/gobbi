# Structure Perspective

## Artifact Summary

The artifact is a project skill document plus its staged copy and backlog closure. Structurally, the skill needs to be loadable, template-derived, organized around durable hook-authoring guidance, and easy for later agents to scan during Study phase.

## Locked Frame (Stage 1)

Scenario: The skill has the required canonical project-skill sections.
- Check: It includes at least the required H2s `Core Principles`, `Procedures`, `Constraints`, and `Output paths`.
- Check: It includes concrete load triggers.
- Check: It provides procedures tied to the two hook witnesses.
- Adversarial check: The structure does not hide required operational guidance in prose-only narrative.

Scenario: The staged and promoted copies preserve one source of truth.
- Check: Both skill paths have identical content.
- Check: The promoted path is the runtime project-skill path.

## Findings

No findings.

Why: The skill contains the four required canonical H2 sections, clear load triggers, procedure-level decomposition, anti-patterns, constraints, and output paths. The staged and promoted copies are byte-identical.

## Verification Evidence

- `grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`: `4`.
- `wc -l`: both staged and promoted skill files are 254 lines.
- `diff <staged SKILL.md> <promoted SKILL.md>`: no output.
