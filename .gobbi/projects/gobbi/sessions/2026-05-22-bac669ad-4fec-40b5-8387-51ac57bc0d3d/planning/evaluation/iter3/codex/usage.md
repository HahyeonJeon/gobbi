# Usage Perspective - Iter3

VERDICT: REVISE

## Artifact Summary + Memory reads

Same target and memory register as `project.md`. Usage lens checks whether a fresh manager or executor can run the plan without reinterpretation.

## Locked Frame (Stage 1)

Scenario: a fresh manager can execute M2 without authoring missing content.
- Checklist: M2 includes a convention-valid PR title.
- Checklist: M2 includes a concrete PR body or a command that stamps the concrete body.
- Checklist: M2 re-verifies `gh auth status` at point of use.

Scenario (adversarial): a section outline is mistaken for a pasteable PR body.
- Checklist: The verification command block is checked, not only the narrative outline.

## Per-scenario per-check results

FAIL. `gh auth status` is present in preconditions and command block at plan.md:472 and plan.md:520. The PR title is 64 chars at plan.md:523. But the command still supplies placeholder body text instead of a concrete body.

## Typed findings

### COD-PLAN3-USAGE-001

- Type: checklist_gap
- Domain: git
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: Observed in plan.md:477: `--body <body>` delegates the body to a placeholder. Observed in plan.md:524: the runnable `gh pr create` command still passes `--body "<conventions-compliant body per How step 2>"`.
- Finding: M2 is not executable as written. The manager still has to compose or substitute the PR body during execution, so the iter2 "placeholder/non-template body" finding is not concretely closed.
- Hypothesized impact: execution can produce a non-template or stale PR body despite the plan claiming compliance.

## Low-confidence appendix

None.
