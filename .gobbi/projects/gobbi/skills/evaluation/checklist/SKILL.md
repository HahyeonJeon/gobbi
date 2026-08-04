---
name: checklist
description: "MUST load when creating or revising an evaluation checklist. Checklist is an operation sub-skill for authoring one lifecycle-first, reusable, unchecked source with evidenced coverage closure."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Evaluation Checklist

A Checklist author uses this operation to create or revise one reusable, unchecked lifecycle-first source for
an exact subject and version. The result records evidenced lifecycle applicability, expected scenarios,
atomic conditions, governing traces, expected tests, and authored source closure.

Seven nonlinear lifecycle families own coverage. Development and product views, actors, product forms,
scenario-spectrum questions, standards, and optional perspective prompts inform that coverage without
becoming parallel owners or quotas.

Checklist preserves the unchecked source and stops at source closure. It never executes conditions, records
results, judges the subject, or decides acceptance.

## Principles

### Let lifecycle boundaries own coverage

Material stages, transitions, handoffs, alternatives, failures, recovery paths, and terminal states define
coverage. The seven families organize those nonlinear boundaries without prescribing one sequence.

### Derive applicability from subject evidence

Actual actors, responsibilities, interfaces, product forms, governing inputs, and observable state determine
what applies. An unsupported exclusion or unresolved uncertainty is an open gap, not convenience.

### Turn material outcomes into atomic contracts

One family-owned scenario states one boundary, trigger, expected outcome, and deficient outcome. Each nested
condition is independently answerable from evidence in that scenario context.

### Keep source closure separate from judgment

Source closure means the authored baseline is traceable and materially complete. Evaluation completion,
acceptance, finding disposition, and workflow routing remain later and separate states.

## Rules

- **MUST use the exact lifecycle-first physical contract in Step 1.2.** Keep its front records, ordered
  sections, record labels, identity domains, conditional lines, and closure renderings literal.
- **MUST give every scenario one primary owner from the seven lifecycle families.** Treat development and
  product views as one inline boundary property and every other lens as subordinate evidence or questions.
- **MUST evidence every applicability and test status.** Unsupported `N/A`, material `Uncertain`, and
  untraced `Applicable` records keep source closure open.
- **MUST keep identities, references, reuse, and supersession resolvable.** Give each live condition one
  scenario owner, never reuse an ID, and count a shared `both` boundary once.
- **MUST keep the preserved source unchecked and result-free.** Do not add execution evidence, answers,
  findings, severity, scoring, remediation, completion judgments, verdicts, or finding dispositions.
- **NEVER use prompts or counts as coverage credit or failure thresholds.** The optional perspective card and
  scenario spectrum only ask questions, while six and 55 only trigger a recorded semantic review.

## Procedure

### Phase 1 — Bind the Exact Subject

#### 1.1 Freeze the subject and authoring inputs

- Bind one stable subject identity and version or content hash, its intended outcomes, scope, governing
  requirements, rules, decisions, risks, prior failures, expected tests, observable state, and available
  evidence.
- Identify material changes, missing authority, and evidence limits before authoring. Stop when the subject is
  substituted, unstable, too broad to support one closure claim, or too imprecise for stable references.
- Treat the source as an unchecked expectation baseline for that exact subject. A changed material premise
  makes affected authoring evidence historical and returns work to the earliest affected step.

#### 1.2 Render the lifecycle-first source skeleton

- Create the complete skeleton before writing substantive records. A valid source has exactly one H1, the
  three front records below, and each named H2 exactly once in this order.
- Use this exact physical grammar; literal pipes cannot appear inside record values:

```markdown
# <subject> — Lifecycle Checklist

Subject: <stable subject identity>
Version: <version or content hash>
Source kind: lifecycle-first

## Actor Profiles
- ACT-01 | Role: <name> | Responsibilities: <text> | Needs / Outcomes: <text> | Interfaces / Handoffs: <text> | Evidence: <GOV refs or exact evidence>

## Product Forms
- FORM-01 | Form: <application|library/package|SDK|API|service/backend|CLI/tool|development-workflow|release/delivery|documentation/information|other:<name>> | Relationship / Interfaces: <text> | Evidence: <GOV refs or exact evidence>

## Applicability Matrix
- BND-01 | Family: <exact family> | Boundary: <text> | Context: <ACT/FORM refs> | Views: <development|product|both> | Status: <Applicable|N/A|Uncertain> | Basis: <inspected basis> | Scenarios: <SCN refs|—> | Related: <BND refs|—>

## Expected Scenarios
### SCN-<family-code>-01 — <title>
Family: <exact family>
Matrix: <Applicable BND refs>
Actors / Forms: <ACT refs>; <FORM refs>
Supersedes: <prior SCN ref> <!-- only for a genuine family move; otherwise absent -->
Boundary / condition: <semantic prose>
Trigger: <semantic prose>
Expected outcome: <observable prose>
Deficient outcome: <observable material deficiency>
Evidence / Measure: <basis or boundary> <!-- only when material; otherwise absent -->

#### Checklist
- [ ] CHK-<family-code>-01-01 — <one atomic condition>
  - Also applies: <SCN/BND refs> <!-- only for valid reuse; otherwise absent -->
  - Supersedes: <prior CHK refs> <!-- only for split/owner move; otherwise absent -->

## Governing Traces
- GOV-01 | Input: <requirement|rule|decision|risk|prior-failure>:<stable identity> | Covers: <live BND/SCN/CHK/TEST refs> | Basis: <coverage explanation>

## Expected Tests
- TEST-01 | Test: <stable command, artifact, or test identity> | Status: <Applicable|N/A|Uncertain> | Basis: <inspected basis> | Covers: <live BND/SCN/CHK refs|—>

## Source Closure
Source closure: <Open|Closed>
Open gaps: None
Warning review: Not triggered
```

- Keep `Supersedes`, `Evidence / Measure`, `Also applies`, and condition-level `Supersedes` absent unless
  their stated condition applies. Do not emit their comments or empty placeholders in a completed source.
- Stable source-local identity domains are exactly `ACT-NN`, `FORM-NN`, `BND-NN`, `GOV-NN`, `TEST-NN`, and
  `GAP-NN`, plus the family-coded `SCN` and `CHK` forms above. Every `NN` is exactly two digits, ordinals
  increase monotonically within their owner, and no live or superseded identity is ever reused.

### Phase 2 — Build Lifecycle Applicability

#### 2.1 Define evidenced actor profiles and product forms

- Inspect responsibilities, decisions, needs, outcomes, interfaces, dependencies, handoffs, and recovery
  duties. Author stable profiles only for materially affected roles supported by exact evidence.
- Examine development-side actors such as developers, creators, and maintainers and product-side actors such
  as consumers, operators, and integrators. These examples are discovery prompts, not a universal actor list;
  omit unsupported roles and include other evidenced roles.
- Author each profile as one `ACT-NN` record in the exact Step 1.2 form. Keep distinct roles separate when
  their responsibilities, interfaces, handoffs, needs, outcomes, or evidence materially differ.
- Select only evidenced forms and relationships: application, library/package, SDK, API, service/backend,
  CLI/tool, development-workflow, release/delivery, documentation/information, or `other:<name>`.
- Author each form as one `FORM-NN` record. Profiles and forms provide context only; they create no
  applicability, scenario owner, quota, or coverage credit by themselves.

#### 2.2 Build the applicability matrix

- Inspect all material development stages, transitions, handoffs, alternatives, failures, recovery paths,
  and terminal states. Inspect product acquisition, creation, delivery, adoption, integration, use,
  operation, evolution, support, recovery, exit, and retirement outcomes with the same evidence standard.
- Assign each material boundary to exactly one primary nonlinear family:

  | Family | Code |
  | --- | --- |
  | Intent/Acquisition | `IA` |
  | Creation/Delivery | `CD` |
  | Adoption/Integration | `AI` |
  | Use/Operation | `UO` |
  | Change/Evolution | `CE` |
  | Support/Recovery | `SR` |
  | Deprecation/Exit/Retirement | `DER` |

- Write one `BND-NN` record per normalized material boundary. `Boundary` and `Basis` remain
  subject-specific, and `Context` resolves only live `ACT-NN` and `FORM-NN` identities.
- Set `Views` to exactly `development`, `product`, or `both`. `both` means one normalized boundary shared by
  both views, with one `BND-NN`, one scenario obligation, and one coverage credit; `Views` is not an identity
  or reference target.
- Set `Status` to `Applicable`, `N/A`, or `Uncertain` and give the same record an inspected `Basis`.
  `Applicable` requires scenario traces before closure; `N/A` requires inspected exclusion evidence;
  `Uncertain` names the missing evidence and possible effect.
- An `Applicable` boundary may use `—` for `Scenarios` only while the source is Open and an exact `GAP-NN`
  cites it. An `N/A` boundary uses `—` and cites inspected exclusion evidence; an `Uncertain` boundary uses
  `—`, names its missing evidence and possible effect, and keeps source closure Open.
- Use `Related` for real cross-family relationships without creating a second owner. Treat restoration or
  re-entry as a separate Support/Recovery scenario only when it is an independently evaluable outcome.

#### 2.3 Challenge applicability with non-owning prompts

- Challenge the complete matrix for successful outcomes; limits and transitions; failure, rejection,
  containment, and recovery; materially deficient yet functioning outcomes; governing-constraint violations;
  and abuse, gaming, or cosmetic compliance.
- Optionally consult this unordered prompt card: Project, Structure, Performance, Aesthetics, Usage,
  Consistency, Risk, and Overall. Consult none, some, or all as useful questions only after lifecycle,
  actor/form, and matrix derivation.
- Store no prompt use, order, provenance, completion, heading, ID, tag, field, count, result class, or coverage
  credit. A concern matters only after it enters the ordinary actor/form, matrix, scenario, condition, trace,
  test, or gap model.
- Return to Step 2.1 or 2.2 when a prompt exposes a missing actor, form, boundary, status basis, or
  relationship.

### Phase 3 — Derive Expected Scenarios

#### 3.1 Create family-owned scenarios

- Turn every `Applicable` matrix outcome into one or more compact expected scenarios. Each scenario has one
  family owner and references every applicable matrix entry and live actor/form context that gives its
  contract meaning.
- Use `SCN-<family-code>-NN`, with the exact family codes in Step 2.2 and a two-digit ordinal that increases
  monotonically within that family. The ID stays stable through wording and trace edits while the family
  owner and scenario contract remain the same.
- Write `Boundary / condition`, `Trigger`, `Expected outcome`, and `Deficient outcome` as independently
  interpretable semantic prose. The deficient outcome names observable material inadequacy even when the
  subject still functions.
- Add `Evidence / Measure` when thresholds, variability, quality or compatibility boundaries, repeatability,
  causality, uncertainty, or consistent condition answers require it. Otherwise omit the line.

#### 3.2 Apply the expected-scenario spectrum

- Ask whether each applicable boundary and the complete scenario inventory covers success; limits and
  transitions; failure, rejection, containment, and recovery; deficient-but-functioning behavior;
  governing violations; and abuse, gaming, or cosmetic compliance.
- Treat those questions as a generalized spectrum, never scenario classes, headings, fields, IDs, quotas,
  completion data, or result classes.
- Deduplicate semantically identical contracts. Split scenarios when family, actor/form contract, boundary,
  trigger, expected outcome, deficient outcome, or `Evidence / Measure` contract materially differs.
- Return to Phase 2 when a scenario exposes a missing boundary or unsupported applicability assertion.

#### 3.3 Preserve scenario identity and relationships

- Keep one live family owner for each scenario and use matrix `Related` references for cross-family meaning.
- When a genuine family move changes ownership, allocate the next destination-family ID and add the exact
  scenario `Supersedes` line. Never reuse or silently move the prior ID.
- Confirm that every live `Applicable` boundary traces to at least one live scenario and that no scenario
  claims a `N/A` or `Uncertain` boundary as applicable coverage.

### Phase 4 — Derive Executable Atomic Conditions

#### 4.1 Write atomic checklist conditions

- Add `#### Checklist` directly beneath every scenario and write at least one unchecked condition in the
  exact Step 1.2 form. Use `CHK-<family-code>-<scenario-ordinal>-NN` with a two-digit condition ordinal that
  increases monotonically within that scenario.
- Give each condition one live scenario owner and enough scenario context for a binary, independently
  evidenced answer. State the required condition, not an action log, result, test procedure, severity,
  score, or remediation.
- Split a condition when its answer, required evidence, affected actor, trigger or environment, or acceptance
  effect can differ. Keep one condition when the same required state applies to several explicitly named
  members of a set.
- Never generalize named members or broaden a verb phrase merely to merge conditions. A wording change does
  not make different evidence meanings or acceptance effects identical.

#### 4.2 Use reuse and supersession precisely

- Define a condition once. Add its nested `Also applies` line only when the wording, required evidence,
  answer semantics, and governing threshold are identical in every referenced scenario or boundary context.
- Resolve every reuse reference to a live `SCN` or `BND` identity and preserve the owning `CHK` definition.
  An alias, prompt, relationship, or repeated test earns no extra coverage credit.
- When a split or owner move replaces a condition, allocate the next live owner ID and add the nested
  `Supersedes` line. Keep superseded IDs resolvable and never reuse them.

#### 4.3 Add governing traces and expected tests

- Author `GOV-NN` records for applicable requirements, rules, decisions, risks, and prior failures. Each
  `Covers` field resolves only the named live `BND`, `SCN`, `CHK`, or `TEST` domains and explains the coverage
  basis once.
- Author stable `TEST-NN` records for expected commands, artifacts, or test identities. Give each test
  `Applicable`, `N/A`, or `Uncertain` plus same-record inspected `Basis`, and resolve `Covers` only to live
  `BND`, `SCN`, or `CHK` identities.
- Use `—` for an `N/A` test's `Covers`. An `Uncertain` test names missing evidence and possible effect, uses
  `—`, and keeps closure open; an `Applicable` test may use `—` only while the source is Open and a gap cites
  it.
- Trace every material governing input and expected test to live coverage or an exact open gap. Counts and
  percentages do not establish traceability or closure.

### Phase 5 — Close, Preserve, and Hand Off the Source

#### 5.1 Review source boundaries and warning tripwires

- Split the source when subjects have independent versions, decisions, authorities, disjoint matrices or
  profiles, or no reproducible single closure claim. Preserve explicit cross-source relationships without
  duplicating semantic ownership.
- More than six live conditions in one scenario or 55 live conditions in one source triggers a semantic
  split review. Review condition atomicity, scenario coherence, subject breadth, and candidate splits; do not
  fail, split, merge, drop, bundle, or award coverage merely to satisfy a count.
- When neither tripwire triggers, write exactly `Warning review: Not triggered`. When either triggers,
  replace it with exactly:

```markdown
Warning review: Triggered | Counts: <scenario/source counts> | Tripwires: <checked semantic boundaries> | Candidate splits: <considered splits> | Rationale: <why the retained unit is coherent>
```

#### 5.2 Close or keep open the source

- Resolve every actual reference inside the explicitly named domain of its field. `Views` is never resolved as
  an identity, `Context` resolves only `ACT` and `FORM`, and live/superseded/reuse references must retain one
  unambiguous owner.
- Keep source closure Open for material `Uncertain`, unsupported `N/A`, untraced `Applicable` boundaries,
  unresolved references, missing governing or test traces, incomplete scenario or condition contracts, or
  any other material authored gap.
- For an Open source, render:

```markdown
Source closure: Open
Open gaps:
- GAP-NN | References: <BND/SCN/CHK/GOV/TEST refs> | Reason: <unresolved material gap> | Evidence needed: <exact evidence or authority>
```

- An Open source requires at least one valid `GAP-NN` record and forbids `Open gaps: None`. Each gap cites the
  affected live domains and names the exact missing evidence or authority needed for recovery.
- Set `Source closure: Closed` only after all material authored obligations and references are supported and
  traced. A Closed source requires exactly `Open gaps: None` and forbids every `GAP-NN` record.
- A missing or invalid `Views` value, invalid `Context` domain, malformed required record, or invalid
  conditional rendering is a physical defect. An Open gap cannot repair it.

#### 5.3 Challenge the source and recover from change

- Walk representative ordinary, boundary, failing, recovery, deficient-but-functioning, governing-violation,
  abuse, gaming, and cosmetic-compliance cases against the authored scenarios and conditions.
- Confirm that a superficially compliant but materially broken subject fails an applicable condition and
  that supported exclusions do not invent work for absent actors or forms.
- Return to the earliest affected step when the challenge reveals a missing premise, actor, form, boundary,
  scenario, condition, trace, test, gap, or incorrect closure state. Repeat every dependent check after the
  repair.
- When the subject, version, governing input, evidence, actor/form context, or expected outcome changes
  materially, keep prior evidence historical and rebuild from the earliest changed premise.

#### 5.4 Preserve and hand off the unchecked source

- Re-read the exact source, confirm every checklist condition remains unchecked, and verify that it contains
  no evaluation answer, execution evidence, finding, severity, improvement, strength, verdict, disposition,
  acceptance state, or workflow gate state.
- Preserve its exact identity, version/hash, source kind, references, closure state, and any open evidence or
  authority needs. Hand the unchanged source to [Evaluation](../SKILL.md#procedure) for independent,
  read-only execution and judgment.
- Stop after the handoff. Checklist neither executes the source nor records Evaluation completion or results.

## References
