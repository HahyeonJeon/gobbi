# Usage Perspective - Iter2

VERDICT: REVISE

## Artifact Summary + Memory reads

Same artifact and memory register as `project.md`. Usage lens checks whether a fresh manager/executor can run the plan without reinterpretation.

## Locked Frame (Stage 1)

Scenario: fresh executors can run their tasks as written.
- Checklist: T1-T7 commands are concrete.
- Checklist: T7 final sweep has no deferrals to earlier fixtures.

Scenario: manager can execute M2 without inventing missing PR content.
- Checklist: PR title is convention-valid.
- Checklist: PR body follows the required template exactly.

Scenario (adversarial): a late-bound value is treated as a placeholder.
- Checklist: only GitHub-assigned values such as PR number are late-bound.

## Per-scenario per-check results

FAIL. Executor-side T7 is now runnable, but manager-side M2 still requires inventing the PR body at execution time and gives a 99-character PR title.

## Typed findings

### COD-PLAN2-USAGE-001

- Type: checklist_gap
- Domain: git
- Disposition: open
- Confidence: 100
- Severity: Medium
- Evidence: `plan.md:462-467` specifies a non-literal body outline; `plan.md:493` passes a placeholder string to `--body`.
- Finding: M2 is not fully executable as written. The manager still has to author the actual PR body during execution.

### COD-PLAN2-USAGE-002

- Type: convention_violation
- Domain: git
- Disposition: open
- Confidence: 100
- Severity: Medium
- Evidence: PR title at `plan.md:462` is 99 characters; `git/conventions.md:171` makes PR titles follow commit-subject grammar, and `git/conventions.md:80` caps subjects at 72 characters.
- Finding: The concrete PR title is present, but it is not convention-valid.

## Low-confidence appendix

None.
