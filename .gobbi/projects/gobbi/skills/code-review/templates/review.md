# {Exact Subject Name} — Code Review Record

> **Document role:** Scoped code-review evidence and findings.<br>
> **Record state:** `{current | partial | blocked | historical}`<br>
> **Verdict boundary:** This record contains no Evaluation verdict and no acceptance decision.<br>
> **Subject identity:** `{repository, exact revision/tree/content identity, and relevant state identity}`<br>
> **Reviewed at:** `{timestamp or bounded review interval}`

Use this template as the normative rendering contract for the Code Review operation. Replace every required
brace, retain every section, use the exact state and empty forms below, and add no independent trigger or
frontmatter.

## Subject and Scope

| Field | Value |
|---|---|
| Caller | {Exact caller} |
| Reviewer and relationship | {Reviewer; producer or decision relationship, or `No material producer role disclosed`} |
| Intended consumer | {Exact consumer} |
| Review questions | {Exact questions} |
| Included | {Paths, artifacts, states, and checks} |
| Excluded | {Material exclusions and reasons, or `None`} |
| Governing owners | {Requirements, contracts, rules, conventions, and canonical owner locations} |
| Read-only boundary | {Allowed inspection and prohibited effects} |
| Invalidation condition | {Identity, state, or governing-contract change that makes evidence historical} |

## Method and Evidence

### Method

{State the actual-subject-first inspection order, proved read-only techniques, environment, time boundary,
sampling, uncertainty, and evidence plan. State every material check or surface that was not inspected and why.}

The Method values for environment, time boundary, sampling, and uncertainty apply to every evidence row unless
that row records an override.

### Evidence

| ID | Dimension | Exact source or command | Observation | Reproduction | Limit |
|---|---|---|---|---|---|
| `EV-001` | `DIM-...` | {Path and line, object identity, or exact read-only command} | {Direct observation} | {Short reproducible step} | {`LIM-...` or `None known`} |

{Repeat once for each distinct evidence item. IDs are local to this record and provide traceability only; their
numbers do not imply priority, severity, or order of resolution.}

## Coverage

Use `inspected`, `partial`, `not-inspected`, or `not-applicable` exactly. Every mandatory row remains present.
Every non-`inspected` row gives an evidence-backed reason and links a material `GAP-*` or `LIM-*`.

| ID | Mandatory dimension and question | Governing expectation and owner | Subject responsibility | Evidence | Coverage | Limit or gap |
|---|---|---|---|---|---|---|
| `DIM-001` | Project-directory structure — Does placement, ownership, visibility, and dependency direction fit the project tree? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-002` | File structure — Are cohesion, ordering, responsibility, dependencies, visibility, and generated provenance sound? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-003` | Design patterns — Do used patterns fit current needs, boundaries, ownership, coupling, and failure containment? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-004` | Class design — Are responsibilities, construction, invariants, mutability, ownership, lifetime, and collaboration sound? | {Expectation and owner} | {Component or role, or evidenced absent surface} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-005` | Function design — Do functions meet caller needs with clear inputs, outputs, effects, errors, cohesion, and seams? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-006` | Naming conventions — Are names clear at definitions and uses and consistent with the applicable naming owner? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-007` | Domain vocabulary — Do terms express one accurate, coherent, stable domain model? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-008` | Overengineering — Does each layer, abstraction, option, indirection, or generic mechanism serve a current need? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-009` | Code complexity — Is complexity necessary for the domain rather than accidental branching, state, coupling, or duplication? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-010` | Docstring quality — Are applicable docstrings correct, useful, complete, and maintainable? | {Expectation and owner} | {Component or role, or evidenced absent surface} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |
| `DIM-011` | Convention match — Does the subject match cited project, language, domain, and platform conventions? | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |

### Activated Conditional Coverage

Add one row only for each branch activated by subject reach, governing rules, risk, or affected people. Use
the next `DIM-*` IDs. The available branches are correctness and recovery; tests and verification;
cross-surface consistency; security and privacy; performance and resources; accessibility and interaction;
operations and observability; documentation and developer experience; and delivery lifecycle. If relevance
is uncertain, record a gap instead of silently omitting or performatively rendering the branch.

| ID | Activated dimension and exact question | Relevance evidence | Governing expectation and owner | Subject responsibility | Evidence | Coverage | Limit or gap |
|---|---|---|---|---|---|---|---|
| `DIM-012` | {Activated branch and question} | `EV-...` | {Expectation and owner} | {Component or role} | `EV-...` | {Coverage state} | {Reason, `GAP-*`, or `LIM-*`} |

{Delete the example conditional row when no conditional branch is activated. Add another material dimension
when actual evidence requires it; do not invent one to hide a gap.}

## Problems

### PR-001 — {Literal problem statement}

- **Dimensions:** `{DIM-...}`
- **Expectation and owner:** {Unmet contract, outcome, or material-risk boundary and its owner}
- **Observation:** {What the subject actually shows}
- **Impact:** {Who or what is affected and how}
- **Evidence:** `{EV-...}`
- **Cause or hypothesis:** {Supported cause, or an explicitly labeled hypothesis}
- **Uncertainty:** {Material uncertainty or `None material`}
- **Confidence:** `{high | medium | low}` with {basis}
- **Responsible owner:** {Earliest owner able to address the unmet expectation}

{Repeat once per distinct Problem. If none, replace the example with exactly:
`No Problems are supported by the reviewed evidence within this scope. This is not a pass, verdict, readiness claim, or acceptance decision.`}

## Optional Improvements

### OI-001 — {Literal optional opportunity}

- **Dimensions:** `{DIM-...}`
- **Acceptable current condition:** {Evidence-backed reason the current condition is not a Problem}
- **Evidence:** `{EV-...}`
- **Supported benefit:** {Concrete useful benefit supported by the evidence}
- **Trade-off or cost:** {Concrete cost, downside, or constraint}
- **Confidence:** `{high | medium | low}` with {basis}
- **Suggested direction:** {Non-binding direction, not a required correction}
- **Decision owner:** {Owner who may accept, reject, or defer it}
- **Mandatory:** `no`
- **Uncertainty:** {Material uncertainty or `None material`}

{Always render this section. If the change is required by a contract, move it to Problems. If no opportunity
is supported, replace the example with exactly:
`No Optional Improvements are supported by the reviewed evidence. This does not claim that further inspection could find none.`}

## Strengths

### ST-001 — {Verified beneficial condition}

- **Dimensions:** `{DIM-...}`
- **Evidence:** `{EV-...}`
- **Why it matters:** {Benefit}
- **Must-preserve condition:** {Condition later work should retain}
- **Uncertainty:** {Material uncertainty or `None material`}
- **Confidence:** `{high | medium | low}` with {basis}

{Repeat once per distinct Strength. If none, replace the example with exactly:
`No Strengths were directly verified within this scope.`}

## Evidence Gaps and Unanswered Questions

| ID | Dimension | Missing evidence or unresolved question | Effect on this record | Needed evidence or access | Recovery owner and first action |
|---|---|---|---|---|---|
| `GAP-001` | `DIM-...` | {Gap or question} | {Claims narrowed or unavailable} | {Exact need} | {Owner; first non-mutating action} |

{If none, replace the table with exactly:
`No material evidence gaps were identified within the stated scope and method.`}

## Limits

| ID | Affected dimensions or evidence | Limit | Consequence |
|---|---|---|---|
| `LIM-001` | `DIM-...`, `EV-...` | {Access, sampling, freshness, causality, environment, or method limit} | {How the claim is narrowed} |

{If none, replace the table with exactly:
`No additional limits beyond the stated subject, scope, and method.`}

## Handoff

| Field | Value |
|---|---|
| Rechecked subject identity | {Exact unchanged identity, old and observed new identity, or unavailable proof} |
| Record state reason | {Why the record is current, partial, blocked, or historical; cite `GAP-*` or `LIM-*` when applicable} |
| Primary next owner | {One exact role, person, agent, or operation owner; never `TBD`} |
| Items handed over | {Applicable `PR-*`, `OI-*`, `ST-*`, `GAP-*`, and `LIM-*` IDs, or `None`} |
| First next action | {One exact action within that owner's authority} |
| Authority not granted by review | Correction, disposition, verdict, acceptance, workflow change, publication, and other mutation |
| Restart condition | {Subject or governing-contract change, or evidence needed for a new review} |

## Required State and Empty Forms

Use exactly one top-level record state and apply its required meaning:

| State | Required rendering |
|---|---|
| `current` | Use only after the exact subject identity and cited evidence revalidate unchanged at handoff. Keep every material dimension and all populated or exact empty result sections visible. |
| `partial` | Use when material uncertainty narrows the record. Link each affected claim to a `GAP-*` or `LIM-*`; never infer the missing result. |
| `blocked` | Preserve the attempted subject identity, exact blocker, last valid evidence, affected dimensions, missing input or access, recovery owner, and first non-mutating recovery action. Make no claim for uninspected dimensions. |
| `historical` | Name the old and observed new identity or governing contract, stop current claims, and route a fresh review. Do not transplant old evidence to the changed subject. |

When a result section has no supported item, use these exact sentences without modification:

- Problems: `No Problems are supported by the reviewed evidence within this scope. This is not a pass, verdict, readiness claim, or acceptance decision.`
- Optional Improvements: `No Optional Improvements are supported by the reviewed evidence. This does not claim that further inspection could find none.`
- Strengths: `No Strengths were directly verified within this scope.`
- Evidence Gaps and Unanswered Questions: `No material evidence gaps were identified within the stated scope and method.`
- Limits: `No additional limits beyond the stated subject, scope, and method.`
