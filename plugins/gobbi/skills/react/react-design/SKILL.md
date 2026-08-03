---
name: react-design
description: "MUST load when designing React-specific component structure, props, composition, render, Hooks, state, Effects, identity, native interface, or Error Boundary behavior."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# React Design

React Design turns an accepted browser or installed-application outcome into a validated React component
design. It starts after the broader interface and experience outcome is known and ends with an implementation
handoff to `react-development`.

This operation covers React-specific component structure, props and events, state and data flow, identity,
render, Hooks, Effects, Error Boundary behavior, native semantics, accessibility obligations, and performance
planning. It does not cover the complete browser or installed-application experience, application integration,
deployment, observability, packaging, release, updates, publication, or independent Evaluation.

Route complete browser interface and experience design to `web-frontend` and browser identity, concept, and
aesthetic judgment to `web-interface`. Route installed-application identity, concept, and aesthetic judgment
to `desktop-interface`, and installed renderer view and state structure to `desktop-architecture`. React Native
is outside this operation and requires project-specific guidance.

## Principles

### Start from the accepted experience

React component design translates a known product outcome and current behavior. It does not invent the
application experience that gives the components meaning.

### Build the component structure before behavior

Map the interface and data model into a component hierarchy and static skeleton before adding state, Effects,
or optimization assumptions.

### Keep React data flow explicit

Render stays a pure calculation from immutable inputs, state stays minimal, and events and Effects keep their
different causes visible.

### Validate behavior before handoff

A plausible component map is not enough. Walk representative states and test uncertain behavior or
performance assumptions before implementation receives the design.

## Rules

- **MUST begin with an accepted product outcome and current product behavior.** Route complete application
  design to the named application skill, and route any independent verdict to Evaluation.

- **MUST present credible, reference-backed alternatives when a material React choice exists.** Explain the
  trade-offs and recommendation, let the user choose, and never infer approval.

- **MUST follow the [Rules of React](https://react.dev/reference/rules).** Keep components and Hooks pure,
  keep props, state snapshots, context values, values returned by Hooks, and values passed to JSX immutable,
  call ordinary Hooks at the top level, and apply the documented
  [`use` exception](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) only inside a
  component or Hook and never inside `try`/`catch`.

- **MUST keep state minimal and give each state value one owner.** Compute renderable values during render,
  use keys that express durable identity, and lift state only to the narrowest state owner that coordinates
  its consumers.

- **NEVER use an Effect to derive render data or handle the user action that caused a change.** Synchronize a
  named external system with complete dependencies, cleanup, and obsolete-result protection.

- **MUST model runtime access and failure boundaries accurately.** Keep privileged capabilities behind typed,
  approved interfaces; an Error Boundary catches descendant render failures and errors thrown inside a
  function passed to the `startTransition` function returned by `useTransition`, but not ordinary
  event-handler, server-rendering, self-boundary, or unrelated asynchronous failures, and it must define an
  observable fallback and recovery path.

## Procedure

### Phase 1 — Study the React Design Context

#### 1.1 Bind the accepted outcome and design boundary

- **Input / precondition:** Take the accepted user outcome, current product behavior, affected people, scope,
  design authority, and the project-native location for the design record.
- **Action / decision:** Confirm a browser application or Electron renderer, exclude React Native, and assign
  broader work to the named application skill: complete browser interface and experience to `web-frontend`, browser
  identity, concept, and aesthetics to `web-interface`, installed-application identity, concept, and
  aesthetics to `desktop-interface`, and installed renderer view and state structure to
  `desktop-architecture`.
- **Evidence / state:** Record the requested outcome, current behavior, included React design questions,
  applicable application skills, explicit exclusions, and the accepted design-record location.
- **Next branch / recovery:** Ask for the missing outcome, authority, or document location instead of
  inventing it; continue to Step 1.2 only when the React component-design boundary is clear.

#### 1.2 Study the project and reference evidence

- **Input / precondition:** Use the bound outcome and readable project source, configuration, and design
  material from Step 1.1.
- **Action / decision:** Inspect the active React project, existing components, design system, data model,
  installed React version and configuration, available user evidence, internal prior art, and current official
  guidance for [component design](https://react.dev/learn/thinking-in-react),
  [state](https://react.dev/learn/managing-state), [escape hatches](https://react.dev/learn/escape-hatches),
  [React Developer Tools](https://react.dev/learn/react-developer-tools), and
  [`Profiler`](https://react.dev/reference/react/Profiler).
- **Evidence / state:** Create an evidence register that names each source, its applicability and limits,
  current product behavior, preserved project patterns, conflicts, and the React decisions it constrains.
- **Next branch / recovery:** Return a material evidence conflict or missing application decision to the user
  or the named application skill; continue to Phase 2 when the evidence can support React alternatives.

### Phase 2 — Design the React Component System

#### 2.1 Present alternatives and record the user's choice

- **Input / precondition:** Take the evidence register and each material React choice that remains open.
- **Action / decision:** Present credible reference-backed alternatives as component maps, data-flow diagrams,
  static skeletons, or interface sketches; explain trade-offs, recommend one, and leave the choice to the user.
- **Evidence / state:** Record the accepted alternative, supporting references, rejected alternatives and
  trade-offs, user decision, and any constraint that leaves only one credible option.
- **Next branch / recovery:** Stop on an unresolved material choice and never infer approval; proceed to Step
  2.2 after every material React direction is accepted.

#### 2.2 Define the component hierarchy, static skeleton, props, and events

- **Input / precondition:** Use the accepted direction, current component library, design system, interface
  specification, and data model.
- **Action / decision:** Map the component hierarchy top-down, then define a static implementation skeleton
  before interactivity. Give each component one coherent responsibility and specify narrow props,
  composition points, children, and event callbacks for real variation.
- **Evidence / state:** Produce an accepted component map and static skeleton plus a props-and-events table
  that states each unit's responsibility, inputs, supplied structure, emitted event, and consumer.
- **Next branch / recovery:** Return to Step 2.1 when the skeleton exposes a material structural choice;
  refine this step when a component adds only a name or prop plumbing, otherwise continue to Step 2.3.

#### 2.3 Define state, data flow, identity, render, Hooks, and Effects

- **Input / precondition:** Start from the accepted component map, props-and-events table, and every required
  interactive state.
- **Action / decision:** Identify the minimal state, place each value at its narrowest state owner, derive
  renderable values, map one-way data and event flow, and decide component identity plus intended state
  preservation or reset. Keep render pure, Hooks in valid positions, custom Hooks focused on reusable stateful
  behavior, and each Effect limited to a named external system with dependencies, cleanup, and
  obsolete-result protection.
- **Evidence / state:** Produce the state and data-flow map, identity and preserve-or-reset decisions, render
  and Hook obligations, and the Effect and external-system map.
- **Next branch / recovery:** Remove duplicate state, render mutation, invalid Hook placement, internal React
  causality in an Effect, or accidental remounting before continuing; return a new material choice to Step 2.1.

#### 2.4 Define failure, accessibility, host, and performance behavior

- **Input / precondition:** Use the complete component, state, data-flow, identity, and Effect maps plus the
  accepted host and privilege limits.
- **Action / decision:** Decide Error Boundary inclusion or exclusion, the smallest recoverable subtree,
  fallback, recovery, and failure routes outside the boundary. Specify native semantics, labels, keyboard and
  focus behavior, approved host interfaces, performance hypotheses, and a measurement plan using React
  Developer Tools or `Profiler` when render measurement is required.
- **Evidence / state:** Produce the Error Boundary and recovery map, accessibility obligations, host limits,
  and performance hypotheses with their interaction, metric, environment, baseline, and comparison method.
- **Next branch / recovery:** Route a newly exposed application-level experience or structure choice to the
  named skill from Step 1.1; continue to Phase 3 when every React behavior has a defined result or named skill.

### Phase 3 — Validate the Complete Design

#### 3.1 Walk the acceptance scenarios

- **Input / precondition:** Take the complete design and its accepted user outcome, constraints, and
  performance-sensitive interactions.
- **Action / decision:** Walk normal, loading, empty, failure, recovery, preservation, reset, accessibility,
  and performance-sensitive scenarios through the component, state, Effect, identity, failure, and host maps.
- **Evidence / state:** Record each scenario, expected observable result, applicable design decisions, passed
  or failed self-validation, and every remaining assumption without issuing an independent verdict.
- **Next branch / recovery:** Return each failed scenario to its earliest design step; continue to Step 3.2
  only for uncertain behavior, unresolved evidence, or a material conflict, otherwise proceed to Phase 4.

#### 3.2 Resolve design evidence gaps

- **Input / precondition:** Use each uncertainty or conflict that Step 3.1 could not settle from the design
  record and current evidence.
- **Action / decision:** Build a static implementation or bounded prototype only when needed, inspect it with
  the project tools, and measure render behavior when the performance plan requires it. Present any material
  conflict or changed direction to the user for a decision.
- **Evidence / state:** Update the design and scenario record with prototype limits, observations,
  measurements, and explicit user decisions.
- **Next branch / recovery:** Stop while a required user decision remains unresolved; return a design defect to its
  earliest step, and enter Phase 4 only when the complete React design self-validates.

### Phase 4 — Hand Off the Validated Design

#### 4.1 Prepare the React implementation handoff

- **Input / precondition:** Require an accepted design, completed scenario walk, resolved material conflicts,
  and current design evidence.
- **Action / decision:** Assemble the accepted component map, props and events, state and data-flow map,
  Effect and external-system map, identity and reset decisions, Error Boundary and recovery map,
  accessibility obligations, performance hypotheses and measurement plan, acceptance scenarios, decisions,
  limits, and verification plan.
- **Evidence / state:** Produce one validated implementation handoff whose citations, design record,
  prototype limits, and scenario results agree, plus a routing record for every remaining application claim.
- **Next branch / recovery:** Hand the accepted React design to `react-development`, and leave independent
  judgment to Evaluation.
- Route cross-layer integration and release readiness to `web-feature`; route production build, deployment,
  live verification, and rollback to `web-deployment`.
- Route production log, metric, trace, crash, and error emission plus destination feedback to
  `web-observability`.
- Route complete installed outcomes to `desktop-delivery`; route desktop target, data, update, and release
  judgments to `desktop-release`.
- Route Electron platform changes to `electron-development`; route Electron process, security, lifecycle,
  native, and packaged-runtime evidence to `electron-testing`; route packaging, signing, notarization, and
  update rehearsal to `electron-release`.

## References

- [React Design Checklist](checklists.md)
- [React Design Lifecycle Checklist](lifecycle-checklists.md)
