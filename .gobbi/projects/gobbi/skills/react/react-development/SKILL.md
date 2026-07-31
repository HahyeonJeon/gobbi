---
name: react-development
description: "MUST load when implementing or reviewing one scoped React change for a browser application or Electron renderer."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# React Development

Use this operation to turn one accepted React implementation task or defined read-only review into a verified
change or an evidence-backed finding set.

This child owns the ordered work outcome: inspect the project contract, model the behavior, implement or
review, verify, repair, and hand off. React idiom policy and server/client platform facts remain with sibling
skills selected by the React domain root.

The domain root must also route `react-idioms`. It routes `react-server-client` when server rendering,
hydration, Server Components, Server Functions, or client/server directives are in scope.

## Principles

### Establish the contract before acting

The accepted outcome and actual project configuration determine which React capabilities and checks apply.
Missing project evidence is a stop condition, not permission to assume a feature.

### Model the whole observable path

Components, state, external systems, failures, and runtime boundaries form one user outcome. Model their
relationships before implementation or review so a local change does not hide a broken path.

### Verify behavior through its surface

Source shape is not completion evidence. Exercise the rendered outcome and every changed boundary, then run
the project gates that can detect regressions.

## Rules

- **MUST begin with an accepted implementation task or a defined read-only review target.** Record its
  observable outcome, scope, authority, constraints, and available evidence.

- **MUST inspect the installed project contract before choosing or judging an API.** Record the renderer
  target, React and renderer versions, framework, compiler configuration, Hooks lint configuration, rendering
  architecture, and applicable verification commands.

- **MUST route domain guidance before modeling the solution.** Load `react-idioms` for every supported task
  and load `react-server-client` when its trigger applies.

- **MUST keep review mode read-only and implementation mode within the accepted authority.** Stop for an
  unapproved dependency, migration, architecture change, or observable scope change.

- **MUST verify the exact final tree and report every evidence gap.** An unavailable or skipped gate is not a
  pass.

## Procedure

### Phase 1 — Establish the Change Contract

#### 1.1 Inspect the task and project

- Read the accepted task or review target, affected source, callers, tests, manifests, lockfile, and
  configuration.
- Record the source language, renderer target, installed React contract, framework-owned capabilities,
  architecture, and verification commands.
- Load the applicable language, HTML, CSS, interface, framework, and host skills. For React Native, stop and
  use the project's React Native guidance rather than applying this browser-oriented family.
- Stop with the missing evidence or user-owned decision when the required capability or authority is not
  established.

#### 1.2 Model behavior and boundaries

- Map the user path, affected components and Hooks, inputs, events, persistent and derived data, external
  systems, loading and failure states, tests, and every server/client or host boundary.
- Use `react-idioms` to decide the React shape. Use `react-server-client` to look up platform behavior when
  that child is active.
- On a review path, derive the model from the requested behavior and actual diff without editing the work.
- Confirm that every in-scope path reaches observable completion, a recoverable state, or an explicit stop.

### Phase 2 — Implement or Review the Work

#### 2.1 Apply the accepted model

- In implementation mode, establish the component, Hook, state, and boundary skeleton before adding detailed
  behavior. Grow the outcome in small verified slices and keep callers, tests, types, and documents current.
- In review mode, compare the observed work with the accepted outcome and active child guidance. Record each
  problem with expected behavior, observed evidence, impact, and cause; do not edit the subject.
- Keep Electron renderer code behind the typed preload bridge owned by `electron`; do not expose Node or raw
  IPC to React.

#### 2.2 Complete states and boundary behavior

- Implement or review every pending, empty, failed, recovered, preservation, and reset state required by the
  mapped path.
- Apply each active platform or framework owner at its boundary and keep privileged decisions at their owner.
- Pause when implementation reveals a material design choice outside the accepted task.

### Phase 3 — Verify and Hand Off

#### 3.1 Run the evidence gates

- Exercise the requested behavior or reproduce the reported defect through the rendered surface, including
  the changed failure and recovery paths.
- Run focused component or Hook tests, Hooks and compiler lint, language type checks, and the affected test
  suite. Add the applicable build, server render, hydration, or host integration check.
- For evaluation, complete every applicable row in [React Evaluation Checklist](checklists.md) and apply the
  general `evaluation` perspectives.

#### 3.2 Repair and complete

- Trace a failed gate or finding to the earliest wrong contract, model, owner, boundary, or implementation
  choice. Repair that cause and rerun the narrow failure plus affected downstream gates.
- Complete implementation only when the scoped behavior is observable and all affected gates pass. Complete
  review only when every applicable finding and evidence gap remains visible.
- Return the change or finding set, commands and results, limitations, and remaining risks without performing
  an unapproved dependency, migration, architecture, publication, or scope change.

## References

- [React Evaluation Checklist](checklists.md)
