# Project Perspective

## Artifact Summary

Target evaluated: the leader's Preparation iter1 readiness report plus the staged `codex` skill stub. What: a readiness decision for Bundle A and a generated skill stub intended to be promoted before Planning. Why: Preparation must close blockers surfaced by Ideation before Planning starts. How: verify the report's A-G readiness grades, the staged stub, no premature project-memory write, open-concern triage, and the 5-Type vocabulary. Verdict: REVISE.

## Memory reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/preparation/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
- Project mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`
- Project rule: `rules/stub-redirect-format.md`

Note: the separate `preparation/evaluation.md` child doc referenced by `evaluation/SKILL.md` was not present in the repo. I used the embedded Preparation W/W/H mapping in `evaluation/SKILL.md` plus the user's critical verification list as the frame.

## Locked Frame (Stage 1)

Scenario 1: Preparation must not exit with a generated skill stub that violates the locked Idea contract.
- Check: Design A locks exactly 8 H2 sections.
- Check: the staged stub satisfies the requested frontmatter shape.
- Check: any non-final stub sections do not alter the skeleton Planning will consume.

Scenario 2: Preparation's open concerns must be Planning-phase decisions, not unresolved Preparation fixes.
- Check: each open concern is wording, anchor placement, or user-confirmable scope.
- Check: no open concern defers an already-writeable generated artifact shape defect.

Scenario 3 (adversarial): if the manager promotes the stub immediately after PASS, project memory must receive a valid planning target.
- Check: `.gobbi/projects/gobbi/skills/codex/` does not exist before PASS.
- Check: the staged source is safe to copy as the pre-Planning skill.

## Results

- Scenario 1: FAIL. Design A locks 8 H2 sections (`item-a-codex-skill-structure.md:15-23`) and validation says `grep -c "^## "` must return 8 (`item-a...:29`). The staged stub returns 10 and includes extra H2 sections `## Constraints` and `## STUB metadata`.
- Scenario 2: FAIL. Concern 4 defers the stub section-count/Constraints decision to Planning, but the staged stub is Preparation's own generated artifact and is already in the writeable Preparation staging path.
- Scenario 3: MIXED. No premature project-memory write occurred; `test -e .gobbi/projects/gobbi/skills/codex` returned 1 and the skills directory lists 16 non-codex skills. But a PASS would promote the malformed stub before Planning.

## Findings

### COD-PREP-PROJ-001

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: the locked design lists 8 H2 sections at `ideation/staging/design/item-a-codex-skill-structure.md:15-23`. The staged stub has 10 H2 sections: lines 17, 23, 33, 39, 51, 60, 70, 78, 93, and 107. It also lacks a `when-to-load` frontmatter key; frontmatter only has `name`, `description`, and `allowed-tools` at lines 2-4.
- FP-check: not a final-content complaint. The issue is skeleton/readiness shape, which Preparation explicitly generated for Planning.

### COD-PREP-PROJ-002

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: High
- Evidence: report lines 157-159 list the STUB delivery contract as a Planning DISCUSSION concern, including whether Constraints should be merged or retained as a 9th section. That is not just a Planning wording choice because the current staged stub already violates the locked 8-H2 validation.
- FP-check: concerns 1, 2, 3, and 5 are legitimate Planning anchors or user-confirmable choices; this finding is limited to concern 4.

## Verdict

REVISE. The right scope is identified, project memory was not prematurely modified, and most A-G readiness checks hold. The `codex` stub gap must be resolved before Preparation PASS.

## Low-confidence appendix

No low-confidence findings.
