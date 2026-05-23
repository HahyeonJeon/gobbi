# Usage Perspective

## Artifact Summary

This perspective checks whether the manager, planner, and executor can use the readiness report and staged stub without guessing. Verdict: REVISE.

## Memory reads

- Preparation report
- Staged `codex/SKILL.md`
- Preparation skill generated-skill promotion exception at `preparation/SKILL.md:58-62`
- Ideation Design A and Implementation Checklist

## Locked Frame (Stage 1)

Scenario 1: the manager can decide Preparation PASS or REVISE from the report.
- Check: all blocking generated-skill gaps are resolved or clearly returned as gaps.
- Check: nonblocking Planning questions are separated from Preparation blockers.

Scenario 2: the planner can decompose Item A against a stable file.
- Check: the staged skill has the intended skeleton.
- Check: the frontmatter includes the requested load metadata.

Scenario 3 (adversarial): the manager copies the staged stub to project memory on PASS.
- Check: the copied file is immediately loadable and does not require Planning to repair its skeleton before use.

## Results

- Scenario 1: FAIL. Open concern 4 is a Preparation-stage generated-artifact defect, not merely a Planning discussion topic.
- Scenario 2: FAIL. The staged stub lacks `when-to-load` in frontmatter and has 10 H2 headings instead of 8.
- Scenario 3: FAIL. Preparation's generated-skill exception promotes the staged skill before Planning, so a malformed staged file would become the in-session source of truth.

## Findings

### COD-PREP-USAGE-001

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: `preparation/SKILL.md:60-62` says generated skills are copied to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` after EVALUATION PASS and before Planning. Current staged stub does not meet the user's critical stub checks: 10 H2 headings, no `when-to-load` frontmatter.
- FP-check: no premature copy has happened yet; the usage risk activates at PASS/transition.

## Verdict

REVISE. The next consumer would receive an unstable Item A target unless Preparation fixes the stub first.

## Low-confidence appendix

No low-confidence findings.
