---
name: code-review
description: "Code Review is a read-only operation that produces an evidence-backed review of one exact code subject. It has no correction, verdict, acceptance, publication, or workflow authority."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Code Review

Code Review inspects one exact code subject and returns a reproducible record of evidence, coverage, problems, optional improvements, strengths, gaps, limits, and the next owner. Use it when code needs read-only review without correction, verdict, acceptance, publication, or workflow authority.

## Principles

### Bind and protect one exact subject

Review evidence describes only the identity, scope, owners, and state fixed before inspection. A changed
subject ends current claims instead of being silently substituted.

### Inspect code and governing owners before claims

Actual code, affected surfaces, and their governing contracts determine the review. Summaries, checklists,
producer claims, and passing tests cannot replace direct inspection.

### Make coverage follow evidence

Every mandatory code-design dimension remains visible, while lifecycle branches activate only from relevant
reach, rules, risk, or affected people. Missing evidence stays a gap rather than becoming a result.

### Keep findings separate from decisions

Problems, Optional Improvements, Strengths, gaps, and limits have distinct meanings. Evaluation, correction,
acceptance, and publication remain with their separate owners.

## Rules

- **MUST bind the exact subject, scope, governing owners, reviewer relationship, review method, evidence plan,
  and invalidation condition before inspection.** Use a blocked record when stable identity, access, or a safe
  read-only method cannot be established.
- **MUST keep every inspection action read-only and inspect the actual subject before prepared material.** Mark
  any command with unknown or persistent effects unavailable instead of running it.
- **MUST close every mandatory code-design dimension separately.** Activate conditional dimensions only when
  subject reach, governing rules, risk, or affected people make them relevant.
- **MUST classify each distinct condition once as a Problem, Optional Improvement, Strength, or evidence gap.**
  A contract-required change is a Problem; an Optional Improvement requires an acceptable current condition,
  evidence, concrete benefit, trade-off, confidence, non-binding direction, and decision owner.
- **MUST render every record from the normative template and keep Optional Improvements visible.** Use its exact
  state and empty forms, traceable IDs, limits, identity recheck, and one primary next owner.
- **NEVER correct, stage, commit, publish, merge, accept, issue a verdict, change workflow state, or grant another
  mutation through Code Review.** Hand each action or decision to its current owner without changing the
  subject.

## Procedure

### Phase 1 — Bind the Subject and Review Contract

#### 1.1 Freeze identity, scope, authority, and method

- Take the caller, intended consumer, review questions, reviewer relationship and independence disclosure,
  exact repository and revision or content identity, relevant runtime state, included and excluded scope,
  governing contracts and convention owners, known risks, prior evidence, and requested output channel.
- Define the read-only boundary, inspection order, evidence plan, environment and time boundary, and the exact
  identity or governing-contract change that invalidates current evidence. Permit only reads and commands
  whose effects are proved non-mutating for the named subject and environment.
- Record the bound identity and contract before reading summaries, checklists, test reports, or producer
  claims. Treat supplied material as evidence to inspect, not as proof of the subject.
- If stable identity, protected access, reviewer credibility, or a safe method cannot be established, render
  `blocked`: preserve the attempted identity, exact blocker, last valid evidence, affected dimensions,
  missing input or access, recovery owner, and first non-mutating recovery action, then continue at Step 4.2.

### Phase 2 — Inspect the Actual Subject

#### 2.1 Map the actual code and its evidence

- Inspect the bound directory and file tree before prepared claims. Map modules or packages, dependencies,
  callers, consumers, tests, configuration, documents, generated views, runtime effects, failure paths, and
  recovery states that the subject changes or can affect.
- Identify the governing project, language, domain, platform, and lifecycle owner for each applicable
  expectation. Do not turn a language-specific or local preference into a universal convention.
- Record direct observations as `EV-*` evidence with exact paths, lines or object identities, commands when
  used, reproduction details, environment, sampling, uncertainty, and limits. Sanitize secrets and unrelated
  private data without weakening the evidence.
- When sources conflict or access is missing, record an evidence gap and its effect. Keep a cause as a labeled
  hypothesis when read-only evidence cannot distinguish it.

#### 2.2 Inspect behavior and boundaries

- Inspect ordinary and alternative-valid behavior, invalid input, boundaries, state transitions, failure,
  partial failure, recovery, cleanup, adversarial use, subject change, and cosmetic compliance when the
  subject makes each case relevant.
- Compare public and internal contracts with actual callers, tests, documentation, configuration, generated
  artifacts, and observable behavior. Passing tests or compilation never replaces contract inspection.
- Use prepared checklists and reports only after actual-subject inspection and only as baselines. Extend the
  review when direct evidence exposes a material scenario they omit.
- Record each material exclusion, unrun check, sampling choice, and unavailable observation. Continue only
  with claims that the remaining evidence can support.

### Phase 3 — Close Coverage

#### 3.1 Account for every mandatory code-design dimension

- Review **project-directory structure** for placement, package or module boundaries, dependency direction,
  ownership, visibility, and fit with the established project tree.
- Review **file structure** for cohesion, ordering, responsibility boundaries, imports or dependencies,
  visibility, and generated-file provenance.
- Review **design patterns** for fit with the accepted design and current system, justified use, coupling,
  state and data ownership, boundary placement, and failure containment.
- Review **class design** for responsibility, construction, invariants, mutability, ownership, lifetime,
  collaboration, and compatibility. When the subject has no class surface, record an evidence-backed
  `not-applicable` row.
- Review **function design** for caller need, inputs, outputs, side effects, invariants, error contract,
  cohesion, test seams, and compatibility.
- Review **naming conventions** for clarity at definitions and use sites, consistency, visibility, and match
  with the applicable naming owner.
- Review **domain vocabulary** for one coherent model, accurate terms, stable meaning, and absence of leaked
  accidental implementation detail.
- Review **overengineering** for speculative layers, abstractions, options, indirection, configuration,
  generic mechanisms, or reuse unsupported by a current need.
- Review **code complexity** for avoidable branching, state, coupling, duplication, cognitive load, and the
  distinction between necessary domain difficulty and accidental design complexity.
- Review **docstring quality** for correct purpose, contracts, inputs, outputs, errors, side effects,
  invariants, examples, and maintenance value where docstrings apply.
- Review **convention match** against the cited project, language, domain, and platform owners for structure,
  design, names, vocabulary, functions, classes, comments, and docstrings.
- Give each mandatory dimension one `inspected`, `partial`, `not-inspected`, or evidence-backed
  `not-applicable` coverage row. Missing or conflicting evidence is a gap, not a pass, failure, Strength, or
  Optional Improvement.

#### 3.2 Activate only relevant conditional dimensions

- Activate **correctness and recovery** for behavior, invalid states, errors, concurrency, failure, cleanup,
  rollback, or caller recovery reached by the subject.
- Activate **tests and verification** for changed behavior, claims, test seams, checks, fixtures, skipped
  coverage, or verification obligations.
- Activate **cross-surface consistency** when code, callers, contracts, tests, configuration, documents,
  schemas, generated views, or lifecycle records express the same behavior.
- Activate **security and privacy** for trust boundaries, untrusted input, identity, authorization, secrets,
  sensitive data, network exposure, dependencies, cryptography, abuse, or redaction.
- Activate **performance and resources** for hot paths, scale or latency claims, allocation, retention, I/O,
  concurrency, startup, payload size, capacity, or resource budgets. Require measurements for quantified
  improvement claims.
- Activate **accessibility and interaction** for user-facing interfaces, content, input, focus, semantics,
  error recovery, responsiveness, motion, locale, or assistive-technology effects.
- Activate **operations and observability** for deployable or long-running behavior, logs, metrics, traces,
  health, diagnostics, redaction, incident recovery, capacity, support, maintenance, or retirement.
- Activate **documentation and developer experience** for public or shared APIs, behavior, configuration,
  invariants, migrations, procedures, generated contracts, or changed user or developer workflows.
- Activate **delivery lifecycle** for build, packaging, migration, release, deployment, mixed versions,
  rollback, compatibility, update, deprecation, or removal.
- Add only activated conditional rows and cite the evidence that made each relevant. If applicability is
  uncertain, record a gap; extend beyond these branches when the subject exposes another material concern.

### Phase 4 — Classify and Render the Record

#### 4.1 Classify supported results once

- Record a `PR-*` Problem only for a supported unmet expectation, outcome, or material-risk boundary. Include
  its dimensions, governing expectation and owner, observation, impact, `EV-*` evidence, supported cause or
  labeled hypothesis, uncertainty, confidence, and earliest responsible owner.
- Record an `OI-*` Optional Improvement only when direct evidence shows the current condition is acceptable
  and supports a concrete benefit. Include the acceptable condition, evidence, benefit, trade-off or cost,
  confidence and basis, non-binding suggested direction, uncertainty, decision owner, and `Mandatory: no`;
  move any contract-required change to Problems.
- Record an `ST-*` Strength only for a directly verified beneficial condition. Include its evidence, benefit,
  must-preserve condition, uncertainty, and confidence without using it to cancel a Problem.
- Record missing or conflicting evidence as `GAP-*` and method or environment limits as `LIM-*`. Define each
  root condition once and cite its ID across affected dimensions instead of duplicating it.
- Never invent a defect, recommendation, Strength, or certainty to fill a section. Absence of a supported
  result remains the template's exact empty form.

#### 4.2 Render the normative record and its state

- Load [`templates/review.md`](templates/review.md) and render its complete schema in the caller-provided
  output channel. Include subject and scope, method and evidence, coverage, Problems, Optional Improvements,
  Strengths, gaps, limits, handoff, and all used IDs.
- Always render Optional Improvements. When no item is supported, use the template's exact no-item sentence;
  never create advice merely to avoid an empty result.
- Use `current` only when the exact subject and cited evidence revalidate at handoff. Use `partial` when
  material uncertainty narrows claims, `blocked` when protected review cannot proceed, and `historical` when
  the subject or a governing contract changed.
- Reread the record alone against the template. Confirm every mandatory dimension, activated conditional
  branch, state, result, gap, limit, empty form, ID reference, authority boundary, and next-owner field is
  complete and mutually consistent.

### Phase 5 — Recheck and Hand Off

#### 5.1 Recheck identity, evidence, and recovery state

- Recheck the exact subject identity, relevant state, governing contracts, cited locations, and read-only
  boundary immediately before handoff. Record the recheck evidence and confirm that review changed none of
  them.
- If identity or a governing contract changed, preserve the old and observed new identities, stop current
  claims, mark the record `historical`, and route a fresh review. Never transplant evidence to the new
  subject.
- If interruption or missing evidence materially narrows but does not prevent responsible claims, mark the
  record `partial` and link every affected claim to its `GAP-*` or `LIM-*`. If review cannot proceed safely,
  use the `blocked` recovery form from Step 1.1.
- Re-render and reread any state or evidence change before handoff. Do not repair the subject or suppress the
  condition that changed the record.

#### 5.2 Hand the unchanged subject and record to one owner

- Name one exact primary next owner and one first action within that owner's authority. Route supported
  Problems to the correction owner, Optional Improvements to their decision owner, evidence gaps to their
  recovery owner, and a verdict request to independent Evaluation.
- Hand over the unchanged subject identity, complete review record, and applicable `PR-*`, `OI-*`, `ST-*`,
  `GAP-*`, and `LIM-*` IDs. State explicitly that review grants no correction, disposition, verdict,
  acceptance, workflow change, publication, or other mutation authority.
- If no further action is requested or supported, name the caller as the primary next owner to retain the
  record and bound subject. Never use an unspecified owner such as `TBD`.
- Complete when the record is reproducible, its state matches the final identity and evidence, one next owner
  is named, and no review action changed the subject or another governed state.

## References

- [Normative review record template](templates/review.md)
