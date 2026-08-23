# {Subject} Code Review

> **Document role:** Current Code Review report<br>
> **Record state:** `{current | partial | unable | historical}`<br>
> **Subject:** {Exact paths, objects, and behavior boundary}<br>
> **Reviewed revision:** {Exact commit, tree, range, hash, or observed content identity}<br>
> **Reviewer:** {Identity and runtime}<br>
> **Relationship:** `{author | not the author}`<br>
> **Checklist:** [Canonical Code Review checklist]({absolute or relative path to the bound checklist source}) at {bound content identity}<br>
> **Reviewed at:** {Timestamp or bounded interval}<br>
> **Evaluation timing:** This is prepared review material. An evaluator reviews the same subject unaided before reading it.<br>
> **Authority:** Review only; no target change, approval, merge, publication, or release authority.

## Summary

{State the record state and the most important Problems, Improvements, Strengths, and Gaps. Do not state one
overall code-quality result.}

When all four result sets are empty, use all four bounded sentences:

- `No Problems were found within the bound scope and available evidence.`
- `No evidence-backed optional Improvements were found.`
- `No Strengths were directly verified within the bound scope.`
- `No material evidence Gaps remain within the stated scope and Method.`

## Subject and Scope

| Field | Value |
|---|---|
| Caller | {Exact caller} |
| Intended consumer | {Exact consumer} |
| Review questions | {Exact questions} |
| Included | {Paths, artifacts, behavior, states, and affected surfaces} |
| Excluded | {Material exclusions and reasons, or `None`} |
| Governing sources | {Requirements, accepted design, rules, conventions, and owners} |
| Subject kind | {Diff, commit, range, file set, directory, module, package, or tree} |
| Exact revision | {Commit, tree, range, hash, or observed content identity} |
| Read-only boundary | {Allowed inspection and prohibited effects} |
| Invalidation condition | {Identity or governing-source change that makes this report historical} |

Use `None` only when direct inspection confirms that the corresponding scope set is empty. An unavailable
required field changes the record state and appears in Gaps; it is never silently blank.

## Method

| Item | Detail |
|---|---|
| Actual-code-first inspection | {Directory and file structure, diff or code body, callers, dependencies, tests, configuration, documents, generated views, product paths, failures, and recovery inspected before prepared review material} |
| Affected-surface map | {Reached people, systems, interfaces, and consistency-bound surfaces} |
| Locked subject identity | {Exact identity recorded before checklist exposure} |
| Checklist pass | {Bound checklist identity and source-order category pass} |
| Safe commands | {Exact read-only commands and outputs, or `None; direct file inspection supplied the needed evidence.`} |
| Environment | {Exact relevant environment, tools, and configuration, or `None relevant to the inspected claims.`} |
| Sampling | {Sampling boundary, or `None; the bound subject was inspected in full.`} |
| Uninspected surfaces | {Exact surfaces and reasons, or `None.`} |
| Uncertainty | {Material uncertainty, or `None material.`} |

If prepared material contaminated direct inspection or the checklist-free critical review, discard the
contaminated record and restart from binding; do not render it. If a different blocker prevented inspection,
use `unable` and do not render guessed item answers.

### Checklist-Free Critical Review

Copy the locked pre-checklist record without checklist-derived backfill. A row with no observation must name
the bounded reach inspected before stating that none was found.

| Prompt | Direct evidence | Locked pre-checklist observations | Coverage leads |
|---|---|---|---|
| Design, intent, and best version | {Direct evidence and inspected reach} | {Locked Problems, Improvements, Strengths, Gaps, or bounded empty result} | {Coverage leads or `None from the inspected reach`} |
| Failure, misuse, and cosmetic compliance | {Direct evidence and inspected reach} | {Locked Problems, Improvements, Strengths, Gaps, or bounded empty result} | {Coverage leads or `None from the inspected reach`} |
| State, data, effects, and resources | {Direct evidence and inspected reach} | {Locked Problems, Improvements, Strengths, Gaps, or bounded empty result} | {Coverage leads or `None from the inspected reach`} |
| Change, integration, and compatibility | {Direct evidence and inspected reach} | {Locked Problems, Improvements, Strengths, Gaps, or bounded empty result} | {Coverage leads or `None from the inspected reach`} |
| Absences across the lifecycle | {Direct evidence and inspected reach} | {Locked Problems, Improvements, Strengths, Gaps, or bounded empty result} | {Coverage leads or `None from the inspected reach`} |

Include the coverage leads produced by challenging the linked Checklist scenario spectrum without loading or
traversing the checklist before this record was locked.

### Core Category Applicability

Use only `applicable`, `not applicable`, or `evidence missing`. Render one row for every core category in
checklist source order. A missing-evidence result links a Gap; absence of a checklist-free finding is not an
applicability reason.

| Category | Result | Exact evidence or reason | Affected signs | Gap |
|---|---|---|---|---|
| {Core category} | {Allowed applicability result} | {Exact subject evidence or reason} | {All, named signs, or supported subset} | {Gap link, or `None`} |

### Overlay Applicability

Use only `activated`, `not applicable`, or `evidence missing`. Absence of a checklist-free finding is not
evidence that an overlay is not applicable.

| Overlay | Result | Activation evidence or reason | Source and qualification | Uninspected reach | Gap |
|---|---|---|---|---|---|
| Security | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Privacy | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Concurrency | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Accessibility | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Localization | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Dependencies | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Build | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Packaging | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Release | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Deployment | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Configuration | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Observability | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Migration | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Deprecation | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |
| Retirement | {Result} | {Exact evidence or reason} | {Source and qualification, or needed source} | {Exact reach, or `None`} | {Gap link, or `None`} |

### Reconciliation

Use only `critical review`, `base checklist`, `specialist overlay`, or `both` as origins. Keep unique supported
findings, reinspect contradictions, and keep taxonomy-coverage Gaps short.

| Finding or lead | Origin | Checklist relation | Resolution |
|---|---|---|---|
| {Finding or coverage lead} | {Allowed origin} | {Base sign, overlay question, taxonomy Gap, or `None`} | {Retained, combined, reinspected, or Gap link} |

## Checklist Review

Copy every applicable base heading and negative sign exactly from the bound checklist. Render Project, Design
and Development, then Product in source order; check a report copy only when its result is `problem found`.

### {Lifecycle}

#### {Category}

##### {Broad scenario}

- [x] {Exact negative sign}
  Result: `problem found`
  Evidence: {Exact path, line, object, command output, or observation}
  Finding: [{Problem title}](#{problem-title})

- [ ] {Exact negative sign}
  Result: `no problem found`
  Evidence: {Exact inspection that found no named problem within its stated reach}

- [ ] {Exact negative sign}
  Result: `not applicable`
  Reason: {Exact subject reason}

- [ ] {Exact negative sign}
  Result: `evidence missing`
  Evidence: {Exact missing or conflicting evidence}
  Finding: [{Gap title}](#{gap-title})

Use exactly one result for every item. `no problem found` and `not applicable` have no finding link.

For a wholly non-product subject, replace all Product item rows with one Product Lifecycle `not applicable`
result and exact subject reason. For a wholly inapplicable core category, replace its sign rows with one
category-level `not applicable` result and exact subject evidence. An applicable category answers every
applicable sign. An applicable category with partial evidence, or a category recorded as `evidence missing`,
answers every supported sign and links each unsupported sign to a Gap.

### Specialist Overlays

#### {Activated overlay category}

##### {Owning source question or item}

{Render each activated source question with the same four-result and evidence rules. Repeat the category only
when inspected evidence activates Security, Privacy, Concurrency, Accessibility, Localization, Dependencies,
Build, Packaging, Release, Deployment, Configuration, Observability, Migration, Deprecation, or Retirement.}

When no overlay activates, replace the Specialist Overlays example with:
`No specialist overlay was activated; Method records the evidence-based activation decision.`

When binding prevents the item pass, replace the item structures with:
`No checklist item pass occurred because the binding Gap prevented a safe review.` Link `binding Gap` to the
matching Gaps row or heading.

## Problems

### {Unique literal Problem title}

- **Primary category:** {One core category, one activated overlay, or `Unclassified — taxonomy Gap {link}`}
- **Found during:** {`critical review` | `base checklist` | `specialist overlay` | `both`}
- **Expectation and source:** {Unmet current requirement, accepted decision, contract, rule, or supported quality expectation}
- **Observation:** {What the bound subject shows}
- **Impact:** {Concrete affected actor or system consequence}
- **Evidence:** {Exact path, line, object, command output, or observation}
- **Cause or hypothesis:** {Supported root cause, or a clearly labeled hypothesis}
- **Uncertainty:** {Material uncertainty, or `None material`}
- **Related effects:** {Links to other Checklist Review items or categories, or `None`}
- **Responsible owner:** {Earliest owner able to address the root}

{Repeat once per root Problem. If none, replace the example with exactly:
`No Problems were found within the bound scope and available evidence.`}

## Improvements

### {Unique literal Improvement title}

- **Primary category:** {One core or activated overlay category}
- **Found during:** {`critical review` | `base checklist` | `specialist overlay` | `both`}
- **Acceptable current condition:** {Evidence-backed reason the current condition is acceptable}
- **Evidence:** {Exact supporting evidence}
- **Supported benefit:** {Concrete optional benefit}
- **Suggestion:** {Concise practical suggestion}
- **Trade-off or cost:** {Material cost, downside, or constraint}
- **Uncertainty:** {Material uncertainty, or `None material`}
- **Decision owner:** {Owner who may choose whether to act}

{A required correction is a Problem, not an Improvement. If none, replace the example with exactly:
`No evidence-backed optional Improvements were found.`}

## Strengths

### {Unique literal Strength title}

- **Primary category:** {One core or activated overlay category}
- **Found during:** {`critical review` | `base checklist` | `specialist overlay` | `both`}
- **Verified benefit:** {Directly verified beneficial condition}
- **Evidence:** {Exact supporting evidence}
- **Must-preserve condition:** {Condition later work should retain}
- **Uncertainty:** {Material uncertainty, or `None material`}

{A Strength never cancels a Problem. If none, replace the example with exactly:
`No Strengths were directly verified within the bound scope.`}

## Gaps

Use only `critical review`, `base checklist`, `specialist overlay`, or `both` in `Found during`.

| Gap | Found during | Affected items or claims | Effect | Needed evidence or capability | Recovery owner and first action |
|---|---|---|---|---|---|
| {Unique literal Gap title} | {Allowed origin} | {Checklist items, findings, or claims} | {How the report is narrowed} | {Exact evidence, access, source, or qualification needed} | {Owner and first safe action} |

{If none, replace the table with exactly:
`No material evidence Gaps remain within the stated scope and Method.`}

## Handoff

| Field | Value |
|---|---|
| Rechecked subject identity | {Exact unchanged identity, old and observed new identity, or unavailable proof} |
| Record-state reason | {Why the report is current, partial, unable, or historical} |
| Caller report ownership | The caller owns this caller-bound report after handoff. |
| Next owner | {One exact role, person, agent, or operation owner} |
| First action | {One exact evidence-supported action within that owner's authority} |
| Problems handed over | {Problem-title links, or `None`} |
| Gaps handed over | {Gap-title links, or `None`} |
| Authority boundary | This report grants no target mutation, approval, merge, publication, or release authority. |
| Restart condition | {Subject or governing-source change, or evidence needed for a fresh review} |

When no further action is supported, use: `The caller is the next owner and retains this report; no further
action is supported by the reviewed evidence.`
