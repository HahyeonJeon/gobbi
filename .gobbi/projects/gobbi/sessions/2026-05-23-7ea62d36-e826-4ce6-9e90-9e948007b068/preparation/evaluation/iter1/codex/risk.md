# Risk Perspective

## Artifact Summary

This perspective checks blast radius, reversibility, and process risk. Verdict: REVISE.

## Memory reads

- Preparation report
- Staged `codex/SKILL.md`
- `.gobbi/projects/gobbi/skills/` listing
- Project mistakes about Codex session-write paths and destructive cleanup
- `preparation/SKILL.md` generated-skill promotion exception

## Locked Frame (Stage 1)

Scenario 1: no premature project-memory writes occurred.
- Check: `.gobbi/projects/gobbi/skills/codex/` does not exist before Preparation PASS.
- Check: only session staging contains the `codex` skill stub.

Scenario 2: generated-skill promotion is reversible and safe.
- Check: the staged file is valid enough to promote.
- Check: the report gives the manager an accurate PASS/REVISE basis.

Scenario 3 (adversarial): a known Codex path mistake recurs.
- Check: evaluation writes land under the absolute main-tree session path.
- Check: no worktree-nested session writes are introduced.

## Results

- Scenario 1: PASS. `.gobbi/projects/gobbi/skills/codex` does not exist. The project skills directory contains 16 directories and no `codex`.
- Scenario 2: FAIL. The staged file is not valid enough to promote because it violates the H2/frontmatter contract.
- Scenario 3: PASS for this Codex evaluation write path. This file is being written under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../preparation/evaluation/iter1/codex/`, the main-tree absolute path required by the recorded mistake.

## Findings

### COD-PREP-RISK-001

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: High
- Evidence: `preparation/SKILL.md:62` routes generated skills to project memory after Evaluation PASS. Since the staged stub currently fails the skeleton checks, a false PASS would promote a malformed `codex` source-of-truth skill before Planning.
- FP-check: the risk is not current project-memory corruption; no premature write occurred. The risk is the immediate PASS transition.

## Verdict

REVISE. The no-premature-write check passes, but the promotion target is not safe yet.

## Low-confidence appendix

No low-confidence findings.
