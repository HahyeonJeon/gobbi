---
name: web-frontend
description: "MUST load when designing, building, or reviewing a web feature's browser-facing interface and experience."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Frontend

Use this operation for the browser-facing outcome: journey, content, interaction, visual hierarchy, responsive
behavior, accessibility, trust, recovery, and user-visible measurement. Generic UI and UX skills are not
prerequisites.

It owns observable frontend behavior. HTML, CSS, language, framework, platform, backend, topology, testing,
and security owners load only when their triggers apply.

## Principles

### The interface and the experience are one continuous journey

Entry, action, waiting, interruption, recovery, and completion must stay coherent across browser and session
boundaries.

### Accessibility and recovery are behavior

Semantics, keyboard use, focus, error correction, responsive layout, and safe resumption are part of the
feature, not later polish.

### Evidence shapes the specification before implementation

Study the current product first, use external references or new direct-user evidence when material risk
requires them, and carry accepted conclusions into the complete frontend specification before production code.

### Trust must be legible at the decision point

People need accurate status, consequences, data use, cost, reversibility, and recovery information before
they act.

## Rules

- **MUST study the current product and available user evidence before committing a design.** Use external
  references or new representative-user evidence only for a material choice that is novel, uncertain,
  exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material
  risk of harm.
- **MUST specify the complete browser journey top-down and its smallest units bottom-up before production
  implementation.** Cover every required state, transition, content, interaction, adaptation, and recovery
  path.
- **MUST route topology to `web-convention`, suite mechanics to `web-testing`, and security analysis to
  `web-security` when triggered.** Keep accessibility integral to frontend behavior.
- **MUST make semantics and interaction operable without guessing.** Prefer native elements and expose
  accurate names, roles, states, structure, keyboard behavior, focus movement, form guidance, error
  association, overlay behavior, responsive reflow, and motion alternatives.
- **MUST scaffold the complete frontend and prove one real browser-to-authoritative path before breadth.** A
  mock, screenshot, or polished placeholder is not integration evidence.
- **MUST keep trust, status, and evidence claims truthful.** Separate specification, implementation,
  technical verification, representative-user evidence, release readiness, and post-release observation.

## Procedure

### Phase 1 — Study the Current Frontend

#### 1.1 Bind the outcome and current evidence

- Start with the bounded feature outcome, current product, governing records, and available user evidence.
- Trace relevant entry, waiting, interruption, false-completion, recovery, and completion paths while
  inspecting identity, design-system and codebase patterns, content, controls, URLs, browser states,
  accessibility, responsiveness, localization, trust, support, analytics, complaints, and prior research.
- Record the affected people and contexts, authoritative current behavior, compatibility obligations, known
  gaps, preserved conventions, and deliberate departures in the active project's design material.
- Continue when outcome, audience, authority, and compatibility are clear; return an unresolved conflict to
  `web-feature`, the requesting caller, or the user.

#### 1.2 Resolve material evidence before committing a design

- Use Step 1.1 to name each material question that current evidence does not safely resolve and set the
  risk-proportional direct-user evidence threshold.
- When the material trigger applies, select the closest current owner: project or design-system material,
  applicable standards such as [WCAG 2.2](https://www.w3.org/TR/WCAG22/) or
  [WHATWG HTML](https://html.spec.whatwg.org/), representative-user evidence, or non-binding visual and
  interaction exemplars; load `web-platform` when platform facts need interpretation.
- Verify each source's owner, version or date, relevance, applicability, context, conflict, and limits; for
  direct evidence, define representative characteristics, realistic tasks, consent, privacy, accessibility,
  accommodations, withdrawal, welfare, stop conditions, and the decision rule.
- Put each accepted conclusion and citation beside the specification clause it shapes; return missing
  consequential evidence through project authority.

### Phase 2 — Specify the Complete Frontend

#### 2.1 Define the top-down journey and state skeleton

- Map the complete trigger-to-completion journey, information and action hierarchy, document regions,
  navigation and URLs, history and refresh behavior, backend truth, trust decisions, support, and recovery
  before choosing detailed presentation.
- Define every applicable normal, waiting, empty, partial, stale, degraded, invalid, unauthorized,
  interrupted, failed, retried, duplicated, cancelled, recovered, completed, and false-completion state,
  including its transition and authoritative completion evidence.
- State user-visible status, preserved input, safe recovery, and trust information for every applicable
  transition.
- Continue with one coherent whole skeleton; return a missing path, unresolved content intent, absent backend
  truth, unsupported user need, or contradictory reference conclusion to its owner.

#### 2.2 Specify units bottom-up

- Choose the smallest meaningful control, component, content unit, or state that advances the accepted
  skeleton.
- Specify its purpose, preconditions, inputs, outputs, semantics, accessible name, focus, feedback, error,
  recovery, responsive and localized behavior, trust effect, and evidence, citing borrowed claims beside the
  affected clause.
- Connect the unit to the next one, complete the shortest normal path plus an applicable failure and recovery
  route, then grow one unit at a time until every required path, state, content, interaction, accessibility,
  and adaptation obligation is covered and reconciled with the skeleton.
- Use the lightest disposable representation and required representative-user evidence; revise the
  specification before production code and proceed only when the whole design is accepted.

### Phase 3 — Scaffold and Implement

#### 3.1 Materialize the complete scaffold

- Load applicable HTML, CSS, language, framework, platform, convention, testing, and security owners.
- Materialize routes, semantic document regions, component boundaries, state and data seams, focus targets,
  responsive structure, representative state placeholders, test seams, and explicit labels on simulated data
  or dependencies.
- Trace the scaffold back to the specification and verify its document and accessibility-tree structure
  before detailed behavior or presentation.
- Repair a missing clause, structural seam, state owner, or simulation boundary before continuing; proceed
  only when the whole scaffold can support every specified path.

#### 3.2 Prove one real path and grow slices

- Select the shortest complete path and order its work from native semantics, content, and local state through
  interaction, request and response, authoritative backend outcome, truthful completion, diagnostics,
  failure, and recovery.
- Implement the path through real seams, preserving entered data and safe resumption where applicable and
  distinguishing disabled, pending, cancelled, failed, recovered, and completed states for sighted and
  non-sighted users.
- Verify the path in a live browser, including its real authoritative outcome; do not treat a mocked backend,
  static capture, or polished placeholder as proof of integration, semantics, focus, or recovery.
- Add one complete visual, responsive, modality, localization, lifecycle, failure, or recovery slice at a
  time; repair false success, duplicate submission, lost state, inaccessible behavior, or missing truthful
  recovery before adding breadth.

### Phase 4 — Reconcile Evidence and Hand Off

#### 4.1 Reconcile the browser outcome

- Use the current specification, supported browser and responsive assumptions, reference-derived obligations,
  user-evidence threshold, and recorded slice results as verification inputs.
- Ask `web-testing` to run suite evidence; inspect live keyboard, pointer, touch, and applicable
  assistive-technology interaction, DOM, accessibility trees, rendered states, and authoritative completion
  at their owners.
- Re-run required representative-user evidence when implementation changes a material accepted assumption,
  and match each claim to its owning specification clause and evidence without inferring intent from
  analytics.
- Return specification drift, implementation failure, unsupported reference use, or an unproven claim to the
  earliest owning Step; screenshots cannot prove semantics, focus, responsiveness, interaction, or usability.

#### 4.2 Prepare the frontend handoff

- Require resolved verification findings or an explicit disposition of every remaining acceptance gap.
- Bring the project-native specification into agreement with the implementation and assemble the complete
  paths and states, accessibility and responsive behavior, material reference decisions, user-evidence
  limits, degradations, verification evidence, outcome signals, and support route.
- State separately what was specified, implemented, technically verified, evidenced with representative
  users, and observed after release.
- Hand the result to `web-feature` or the requesting caller, preserving release and live-outcome claims until
  their evidence exists.

## References
