VERDICT: REVISE

# Overall - Task 06 iter1 Codex

## Artifact Summary

Commit `32b9adc6ad4b227aca642394d4202cb33dda57ae` implements Task 06 as a docs-only insertion in orchestration/SKILL.md: direct-mode opt-out prose next to row 5.5 and a branch-name smoke-test regex. The placement satisfies LOCK #5 and both plan acceptance greps pass. The revision blockers are not placement problems; they are operational correctness problems in the newly added prose.

## Memory reads

- Evaluation prompt and session guard marker under `execution/task-06/evaluation/iter1/codex/`
- `planning/artifacts/plan.md` Task 06
- `ideation/artifacts/bundle-b-ideation-pass.md`
- Commit `32b9adc6ad4b227aca642394d4202cb33dda57ae`
- Worktree orchestration/SKILL.md, git/SKILL.md, git/conventions.md, and orchestration/templates/settings.default.json
- Project mistakes filtered to process/docs-sync
- Project rule `stub-redirect-format.md` (not applicable)
- `evaluation/SKILL.md`; requested `skills/evaluation/workflow/execution.md` path absent, treated as pre-existing evaluator-doc drift

## Verdicts by Perspective

| Perspective | Verdict | Notes |
|---|---|---|
| Project | PASS | Scope and acceptance greps pass; LOCK #5 home respected. |
| Structure | PASS | Section placement is correct. |
| Performance | PASS | Docs-only; no runtime cost. |
| Aesthetics | PASS | Prose is readable; command usability defects are classified under Usage/Risk. |
| Usage | REVISE | Direct-mode setting is not actionable; smoke-test command is not a gate. |
| Consistency | REVISE | Cross-link target lacks promised definitions; settings key is absent from template. |
| Risk | REVISE | Manual-only and non-failing smoke test leaves branch regression risk. |

## Findings

### COD-USAGE-T06-001 - Direct-mode setting is not actionable from the settings template

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: new orchestration/SKILL.md lines 109 and 116 name `settings.git.workflow.mode`; worktree settings.default.json git block has no workflow/mode key and no `direct` / `worktree-pr` values.

### COD-USAGE-T06-002 - Smoke-test gate prints a value but does not test it

- Type: `design_flaw`
- Domain: `test`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: new lines 120-126 provide only `jq '.git.branch' ...` plus a regex. Tool reproduction shows `jq '.git.branch'` emits a quoted JSON string and a literal grep against the documented anchored regex fails; `jq -r` plus grep succeeds.

### COD-CONS-T06-001 - Cross-link promises mode definitions that git/SKILL.md does not contain

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: new line 116 points to `git/SKILL.md` Core Principles for full `direct` vs `worktree-pr` definitions. That section contains worktree isolation/lifecycle principles, not the mode-key contracts. `rg` finds no `worktree-pr` or workflow-mode definition in git/SKILL.md.

### COD-CONS-T06-002 - Documented workflow-mode key is inconsistent across row 5.5, the footnote, and settings

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: row 5.5 says `git.workflow.mode`; the new footnote says `settings.git.workflow.mode`; settings.default.json defines neither.

### COD-RISK-T06-001 - Smoke-test gate is manual prose only

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: Medium
- Evidence: worktree grep finds no hook, memorization step, or script wiring for the new smoke-test text. Because Task 06 asked for documentation, this is a risk note rather than the primary blocker.

## Karpathy Failure Modes

- Wrong assumptions: present. The prose assumes a settings workflow-mode key and git/SKILL.md mode-contract section exist.
- Overcomplexity: absent. The local footnote structure is simple.
- Orthogonal edits: absent. The commit changes only Task 06 docs.
- Imperative-over-declarative: present in the smoke test. It says "run this check" but gives a print command instead of a declarative pass/fail assertion.

## Preserve

- Keep the row 5.5 co-location and LOCK #5 heading.
- Keep the two direct-mode use cases: emergency hotfix and pure-read session.
- Keep the regex shape `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; it matches git/conventions.md for the documented sample branch.
- Keep the worktreePath non-null warning for worktree-pr sessions.

## Required Revision Direction

1. Make the direct-mode setting path real or revise the wording so it names the actual resolved setting source.
2. Remove or correct the `git/SKILL.md § Core Principles` cross-link unless that section truly defines `direct` and `worktree-pr` mode contracts.
3. Replace the smoke-test prose with an executable pass/fail command, for example a `jq -er` test or `jq -r ... | grep -E ...`, and make the worktreePath non-null check executable too.

## Low-confidence appendix

None.
