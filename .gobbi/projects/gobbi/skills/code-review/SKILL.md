---
name: code-review
description: "Code Review is an independent read-only operation for evidence-based code feedback."
allowed-tools: Read, Grep, Glob, Bash, Write
skill-type: operation
---

# Code Review

Code Review binds one exact code subject, inspects the actual code before prepared review material, applies
the reusable checklist and activated specialist sources, and writes one caller-bound report. Use it for
independent review or disclosed self-review; it does not change the subject or make a decision about it.

## Principles

### Inspect the actual code first

Direct inspection reveals problems that prepared categories or earlier reports can hide. Record unaided
observations before loading the checklist or another review of the same subject.

### Close coverage category by category

The base checklist supplies one language-independent review path. Apply every item in source order, then
apply only specialist coverage activated by the inspected subject.

### Record root conditions with evidence

One supported root condition produces one Problem with one primary category. Link secondary effects to that
Problem and use a Gap when evidence cannot distinguish the root.

### Keep feedback separate from decisions

The report gives Problems, Improvements, Strengths, and Gaps to its caller. Evaluation and other owners retain
all decision, correction, integration, publication, and release authority.

## Rules

- **MUST bind one exact subject, scope, content identity, governing source set, reviewer relationship,
  invalidation condition, and caller-bound report path before inspection.** Stop as `unable` when identity,
  access, disclosure, a safe read-only method, or a non-overlapping report path cannot be established.
- **MUST inspect the actual code and complete a checklist-free critical review before loading or traversing the
  base checklist, a prepared item list, or a prior Code Review report for the same subject.** Lock the resulting
  record before checklist exposure, do not backfill it from later material, and restart when prepared material
  contaminated either pass.
- **MUST evaluate every applicable base item in source order and every activated overlay afterward.** Record
  exactly `problem found`, `no problem found`, `not applicable`, or `evidence missing` with exact evidence or a
  subject reason.
- **MUST account for every core category and specialist overlay before freezing review sources.** Core results
  are `applicable`, `not applicable`, or `evidence missing`; overlay results are `activated`, `not applicable`,
  or `evidence missing`. Every exclusion needs exact subject evidence, and every missing-evidence result links a
  Gap.
- **MUST record one primary category for each root Problem and link every secondary category effect to it.**
  Judge Unintended Overengineering from unsupported current requirements or observed need, never inferred
  author motive.
- **MUST keep the subject and governing state read-only and write or replace only the bound report.** Disclose
  `author` or `not the author`, and record the review as `current`, `partial`, `unable`, or `historical`.
- **NEVER approve, accept, gate, correct, stage, commit, merge, publish, release, or change workflow or external
  state through Code Review.** Do not score the subject or capture the report in durable Memory automatically.

## Procedure

### Phase 1 — Bind the Subject and Boundary

#### 1.1 Bind identity, scope, and authority

- Bind the repository, exact revision or content identity, included and excluded code, intended questions,
  affected actors, governing sources, reviewer relationship, caller-bound report path, and invalidation condition.
- Prove that every planned inspection is read-only and the report path overlaps neither the subject nor a
  source checklist. Record `unable` with the blocker, last valid evidence, needed input, and recovery owner when
  this proof fails.
- Read the current requirements, accepted design, project rules, and ownership sources needed to interpret the
  code. Do not load the Code Review checklist, a prepared item list, or a prior same-subject Code Review report.

### Phase 2 — Inspect and Critique Without the Checklist

#### 2.1 Inspect the bound subject directly

- Inspect the directory and file structure, diff or code body, callers, dependencies, tests, configuration,
  documents, generated views, product paths, state changes, failures, and recovery before prepared review material.
- Record direct facts and affected-surface leads without forcing them into checklist categories. Trace only
  surfaces that can change a result or its evidence.
- Recheck the subject identity after inspection. Return to Phase 1 when it can be rebound safely, or record
  `historical` and stop current claims when the reviewed state changed.

#### 2.2 Complete the checklist-free critical review

- Critique the directly inspected subject through these five Code Review inquiry prompts. They are not checklist
  items or report taxonomy:

| Prompt | Inquiry |
|---|---|
| Design, intent, and best version | What design and behavior does the subject intend, and what would the best supported version do differently? |
| Failure, misuse, and cosmetic compliance | How can the subject fail, be misused, or satisfy the form of a requirement while missing its purpose? |
| State, data, effects, and resources | What states, data meanings, effects, ownership, lifetimes, and cleanup paths can become wrong or unclear? |
| Change, integration, and compatibility | What callers, integrations, versions, environments, artifacts, and handoffs can this change break or leave inconsistent? |
| Absences across the lifecycle | What necessary design, implementation, testing, verification, delivery, operation, transition, or closure work is absent? |

- Challenge the critique against the concerns represented by the [Checklist scenario
  spectrum](checklist.md#scenario-spectrum), but do not open, load, or traverse the Code Review checklist in this
  phase. Record any new direct-evidence lead under the applicable inquiry prompt.
- Before Phase 3, lock the exact subject identity, direct facts, Problems, Improvements, Strengths, Gaps, and
  coverage leads produced without checklist exposure. A bounded empty result names the inspected reach. Never
  add a checklist-derived observation to this locked record; restart from Phase 1 after prepared-material
  contamination.

### Phase 3 — Freeze Review Coverage

#### 3.1 Load, account for, and freeze applicable sources

- Load [the Code Review checklist](checklist.md) only after the Phase 2 record is locked. Bind its exact content
  identity and preserve its wording and hierarchy.
- Record one applicability result for every core category before source freeze: `applicable`; `not applicable`
  with exact subject evidence; or `evidence missing` with a linked Gap. Do not infer applicability from the
  presence or absence of a checklist-free finding.
- Activate language, framework, platform, domain, and specialist sources only from bound governing evidence or
  direct subject evidence. Record one result for every overlay: `activated`; `not applicable` with exact subject
  evidence; or `evidence missing` with a linked Gap. Absence of a checklist-free finding is never evidence that
  an overlay is not applicable.
- Use these ordered overlay signals and boundaries:

| Overlay | Activation signals and boundary |
|---|---|
| Security | Trust boundaries, untrusted input, identity, authorization, secrets, cryptography, network exposure, or a security requirement. Security owns the specialist expectation. |
| Privacy | Personal or sensitive data, consent, collection, retention, deletion, disclosure, or a privacy requirement. Privacy stays separate from Security and Operations. |
| Concurrency | Threads, tasks, goroutines, shared mutable state, ordering, cancellation, synchronization, backpressure, or shutdown. Concurrency stays separate from Correctness and Performance. |
| Accessibility | User-facing content, semantics, input, focus, assistive technology, motion, contrast, or an accessibility rule. Accessibility stays separate from Usability. |
| Localization | Locale, translation, date, time, number, currency, collation, text direction, or internationalization. Localization stays separate from Usability and Compatibility. |
| Dependencies | Added, removed, updated, resolved, vendored, or externally supplied components. Dependencies stays separate from Project Fit and Delivery. |
| Build | A compiler, generator, build graph, build configuration, or produced artifact. Build stays separate from Verification and Delivery. |
| Packaging | Package metadata, exports, declarations, installation, uninstallation, archives, or a consumer package. Packaging owns artifact structure. |
| Release | Version or tag decisions, candidates, channels, release manifests, notes or changelogs, publication or promotion, signing, release automation, or release-state records. Release owns versioned release identity, candidate composition, the release record, channel or target, publication or promotion contract, and release-to-deployment handoff. |
| Deployment | Environment promotion, rollout, rollback, deployment state, or release topology. Deployment owns environment rollout. |
| Configuration | Configuration sources, schemas, validation, defaults, precedence, environments, secret supply, or feature flags. Configuration stays separate from Parameters and Operations. |
| Observability | Logs, metrics, traces, health, diagnostics, correlation, or diagnostic redaction. Observability stays separate from general Operations. |
| Migration | Data, schema, protocol, state, service, or consumer transition. Migration stays separate from Compatibility. |
| Deprecation | Supported phase-out, warnings, alternatives, timing, or a removal contract. Deprecation stays separate from Compatibility. |
| Retirement | Product or capability exit, disposal, retained state, consumer transition, or support end. Retirement stays separate from Compatibility and Delivery. |

- Delivery owns the reviewed handoff, Compatibility owns supported behavior, and any external mutation remains
  with its operation or manager. Record each activated source, reviewer qualification, uninspected reach, and
  missing capability.
- Freeze the complete applicable source set before answering any item. Return here for a material coverage gap,
  refresh the set, and rerun affected answers without inventing a review item.

### Phase 4 — Run and Reconcile the Review

#### 4.1 Run the item pass

- Walk every base item category by category in source order and record one allowed result with exact evidence or
  reason. Link `problem found` to one Problem and `evidence missing` to one Gap; give the other results no finding
  link.
- For a wholly non-product subject, record one Product Lifecycle `not applicable` reason instead of repeating
  it for every Product sign. For a wholly inapplicable core category, record one category-level `not applicable`
  result instead of repeating every sign.
- For each applicable category, answer every applicable sign. For an applicable category with partial evidence,
  or a category recorded as `evidence missing`, answer every supported sign and link every unsupported sign to a
  Gap.
- Apply each activated specialist source after the base pass. Record `evidence missing` and route the Gap to a
  qualified specialist when the needed source, evidence, or reviewer capability is unavailable.

#### 4.2 Reconcile observations and item results

- Track each finding or lead as `critical review`, `base checklist`, `specialist overlay`, or `both`. Retain every
  unique supported finding, and reinspect direct evidence when sources contradict.
- Assign the earliest supported root condition to one primary core or overlay category. Link affected items and
  secondary categories to that Problem. A supported Problem with no current owner may use `Primary category:
  Unclassified — taxonomy Gap {link}`; this is not a permanent category or an excuse to skip category selection.
- Data Model owns domain representation, identity, relationships, and representable states. Architecture owns
  system data ownership; Parameters owns public-call input; Abstraction owns concept leakage; Correctness owns
  runtime validation, mutation, transition, and corruption; Compatibility and Migration own version transitions;
  Security and Privacy own classification; Vocabulary owns terms.
- Keep a checklist-free Problem even when no source item names it. Record a short taxonomy-coverage Gap for
  later Checklist work without changing the source or backfilling the locked pre-checklist record.

### Phase 5 — Render and Hand Off

#### 5.1 Recheck identity and set the record state

- Use `current` only when the exact subject, source set, and cited evidence revalidate, every core category and
  overlay has an applicability result, and every applicable item is answered. Use `partial` when missing
  evidence, capability, or an interruption narrows supported claims.
- Use `unable` when safe binding or responsible review cannot proceed, preserving the attempted subject, blocker,
  last valid evidence, unreviewed reach, needed input, recovery owner, and first safe action.
- Use `historical` when the subject or a governing source changed, naming the old and observed new identity and
  stopping current claims. Start a fresh review instead of transplanting old item results.

#### 5.2 Render and hand off the report

- Render one report from [the report template](templates/report.md) with its nine sections, exact item evidence,
  finding links, self-review disclosure, typed empty states, and record-state reason.
- Name the next owner and first evidence-supported action, and state the authority the report does not grant.
  Give the caller ownership of the completed caller-bound report after handoff.
- Perform no automatic Memory capture. A separate authorized Memory action may copy a completed report to its
  owned durable location.

## References

| Name | Description |
|---|---|
| [Code Review checklist](checklist.md) | Supplies the reusable lifecycle, category, scenario, and negative-sign source loaded after actual-code inspection. |
| [Code Review report template](templates/report.md) | Supplies the exact developer-facing report structure, item results, finding fields, zero states, and handoff boundary. |
| [Checklist](../checklist/SKILL.md) | Owns creation and substantive revision of reusable checklist sources. |
| [Evaluation](../evaluation/SKILL.md) | Owns independent critique, working checklists, and formal decisions; it completes its unaided same-subject critique before reading a Code Review report. |
| [Execution](../execution/SKILL.md) | Consumes the base checklist for self-review and owns implementation, repair, verification, and the focused task commit. |
