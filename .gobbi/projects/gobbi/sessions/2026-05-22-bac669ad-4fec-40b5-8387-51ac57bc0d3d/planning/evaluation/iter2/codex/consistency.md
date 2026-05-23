# Consistency Perspective - Iter2

VERDICT: REVISE

## Artifact Summary + Memory reads

Same artifact and memory register as `project.md`. Consistency lens checks internal claims against git skill and conventions.

## Locked Frame (Stage 1)

Scenario: self-review claims match artifact body.
- Checklist: "no placeholders" claim is true.
- Checklist: "conventions-compliant title + body" claim is true.

Scenario: PR body matches the canonical template.
- Checklist: body has the four required sections in order.
- Checklist: no improvised required-section set replaces the template.

Scenario (adversarial): plan says "complete" while citing a different template.
- Checklist: M2 section list is compared to `git/conventions.md`.

## Per-scenario per-check results

FAIL. The self-review says no placeholders remain and the PR body shape is fully specified, but M2 still has placeholder body text and uses the wrong section set.

## Typed findings

### COD-PLAN2-CONS-001

- Type: contradiction
- Domain: git
- Disposition: open
- Confidence: 100
- Severity: Medium
- Evidence: self-review claims "No placeholders" and "M2's PR body shape is fully specified" at `plan.md:637`, but M2 uses `<body>` at `plan.md:462` and `"<conventions-compliant body per How step 2>"` at `plan.md:493`.
- Finding: The artifact contradicts itself on placeholder removal.

### COD-PLAN2-CONS-002

- Type: convention_violation
- Domain: git
- Disposition: open
- Confidence: 100
- Severity: Medium
- Evidence: M2 body sections are Summary, Why, Changes, Test plan, AI-Provenance-Record at `plan.md:463-467`; required PR template sections are Summary, Changes, Test plan, Linked issues in `git/conventions.md:173-190`.
- Finding: The PR body outline is not the canonical PR template and omits the required `Linked issues` section.

## Low-confidence appendix

None.
