# {Target} Coding Review

> **Document role:** Current Coding Review report<br>
> **Target:** {Exact artifact, state, version, or content hash}<br>
> **Reviewer:** {Evaluator identity}<br>
> **Independence:** {Relationship to the target and any conflict or limit}<br>
> **Criteria:** {Caller-supplied criteria source or `None supplied`}

## Summary

{State the contract-gate verdict or why none was issued, the most important Problems and
Improvements, verified Strengths, and material Gaps.}

**Escalations:** {Every `out-of-contract` Problem by title and severity, plus the quality
opinion value, or `None`.}

## Scope

| Item | Detail |
|---|---|
| Included | `{Evaluated artifacts, behavior, states, and claims}` |
| Excluded | `{Named exclusions and reasons}` |
| Frozen at | `{Version, hash, or observed state}` |

## Method

Coverage detail lives in sibling `checklist.md` at `{absolute or relative path}`.

### Checklist

| Source | Coverage | Additions | Limits |
|---|---|---|---|
| `{Checklist or governing source}` | `{Items applied to this target}` | `{Coverage added from internal or external study}` | `{Exclusions, ambiguity, or evidence limits}` |

### Critical review and reconcile

{Summarize the Phase 2 critical review plus Step 3.5 reconcile, and the safe inspections,
reproductions, tests, or measurements used.}

## Problems

Severity is `High` when the target cannot meet an intended result or supplied criterion
without correction, `Medium` when that result is materially weakened but still reached,
and `Low` when the defect is real with limited effect. Blocking is `yes` when correction
must precede acceptance or dependent work, and `no` when it can follow. Contract relation
is `in-contract ({criterion or bound intended result})` or `out-of-contract ({governing
source})`.

### {Short title}

**Expectation:** {Required outcome, condition, or criterion.}

**Observation:** {What the target does or contains.}

**Impact:** {Concrete consequence.}

**Evidence:** {Exact path, line, quote, command result, or observation.}

**Cause:** {Supported cause or clearly labeled hypothesis.}

**Uncertainty:** {Material uncertainty or `None`.}

**Severity:** `{High | Medium | Low}`

**Blocking:** `{yes | no}`

**Contract relation:** `{in-contract ({criterion or bound intended result}) | out-of-contract ({governing source})}`

{Repeat for each Problem, or state `None found`.}

## Improvements

Optional Improvements never change the contract-gate verdict.

### {Short title}

**Current:** {Acceptable current condition.}

**Evidence:** {Exact supporting evidence.}

**Benefit:** {Expected improvement.}

**Suggestion:** {Concise practical suggestion.}

**Cost:** {Material cost or limitation.}

**Contract relation:** `{in-contract ({criterion or bound intended result}) | out-of-contract ({governing source})}`

{Repeat for each Optional Improvement, or state `None found`.}

## Strengths

### {Short title}

**Benefit:** {Verified beneficial result.}

**Evidence:** {Exact supporting evidence.}

{Repeat for each Strength, or state `None found`.}

## Preserve

{List each condition later work should preserve and its supporting Strength or evidence, or state `None`.}

## Gaps

| Gap | Effect | Needed |
|---|---|---|
| `{Missing or uncertain evidence}` | `{Effect on results or verdict}` | `{Evidence, access, or criterion needed}` |

{State `None` when no material gap remains.}

## Quality opinion

This section does not change the contract-gate verdict.

> **Opinion:** `{meets-design | mixed | does-not-meet | not-available}`<br>
> **Sources studied:** `{paths, or None found}`<br>
> **Best-version gap:** `{what the best version would be and where this target falls short, or None}`<br>
> **Gate effect:** Does not change the contract-gate verdict.

{Do not use PASS, REVISE, or FAIL in this section.}

## Verdict

> **Verdict:** `{Caller-supplied verdict or Not issued}`<br>
> **Basis:** {Criteria, thresholds, aggregation, in-contract Problems used, or why no verdict was issued.}

{When caller criteria exist, explain briefly how the in-contract Problems satisfy them.
Optional Improvements, Strengths, out-of-contract Problems, and the quality opinion do not
change the verdict. Do not put quality-opinion tokens in the Verdict field.}

## References

| Name | Location | Use |
|---|---|---|
| `{Internal or external source}` | `{Path or URL}` | `{Checklist addition, evidence, or judgment it supports}` |
