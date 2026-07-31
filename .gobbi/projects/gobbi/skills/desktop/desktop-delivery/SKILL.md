---
name: desktop-delivery
description: "Use when coordinating one installable Electron and TypeScript application outcome across design, implementation, local data, packaging, updates, and release readiness."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Desktop Delivery

Use this operation when an agent must coordinate several capability owners or deliver a complete installable
Electron and TypeScript application outcome. It produces one bounded outcome that a person can install,
launch, use, exit, relaunch, and recover on every operating-system and architecture pair the result claims.

Route the observable installed-platform contract to `desktop-platform`, release judgment to
`desktop-release`, and bounded Electron mechanics through the [`electron`](../../electron/SKILL.md) root.
Isolated interface, experience, language, or renderer work stays with its owner; this operation coordinates without replacing owner policy, evaluating independently, or publishing.

## Principles

### Complete means installed and recoverable

Source, a development run, and a package are intermediate states. The outcome is complete only when its
observable path and recovery work from the exact installed artifacts and targets being claimed.

### Keep one owner per decision

Coordination joins owner-approved contracts without copying or overruling them. A conflict returns to the
earliest owner whose decision must change.

### Contract first, then grow vertically

Lock the observable, runtime, data, and release contracts before construction. Establish the whole skeleton,
prove one thin installed path, and then add complete slices without leaving a layer for later.

### Name every delivery state literally

Development, code-verified, packaged, installed, signed or notarized, update-rehearsed, release-ready,
release-authorized, published, and post-release are different states. Evidence or authority for one never
implies another.

## Rules

- **MUST run this operation only for multi-capability coordination or a complete installed, packaged, or
  release-ready claim.** Route a bounded single-owner request directly and stop this operation after recording
  the handoff.
- **MUST lock one complete outcome and its delivery boundary before implementation.** Record actors, entry
  modes, observable and system completion, paths, failures, recovery, targets, data effects, support,
  non-goals, and publication authority.
- **MUST preserve the accepted stack unless current evidence materially challenges it.** For a new or
  challenged stack, assess resource and package cost, content trust, native depth, target and update fit, team
  upgrade capacity, migration cost, and release needs; a material conflict pauses for the user's decision.
- **MUST keep each decision with its current owner.** UI and UX own observable design, coding and applicable
  language or renderer skills own idiom, `desktop-platform` owns the installed-platform contract, the
  Electron family owns Electron mechanics, `desktop-release` owns release judgment, and Evaluation owns the
  independent verdict.
- **MUST keep every slice and target internally consistent.** Code, configuration, types, tests,
  documentation, persistent-data behavior, package inputs, and operational evidence move together, and a
  missing target proof narrows the claim rather than becoming an inferred pass.
- **NEVER publish an installer, update, store release, feed change, or rollout without explicit user authority
  for that action.** Release readiness and release authority remain separate even when every technical gate
  passes.

## Procedure

### Phase 1 — Frame and route the delivery

#### 1.1 Confirm the trigger and owner map

- **Input and precondition:** read the request, accepted design and stack decisions, live application when one
  exists, project rules, target matrix, and the manager's scope and authority.
- **Action:** decide whether the requested result needs more than one capability owner or makes a complete
  installed, packaged, or release-ready claim. Name every active owner and the artifact or decision each must
  return.
- **Branch and recovery:** route a bounded single-owner change directly and end with that handoff. If an owner,
  required source, or decision authority is missing, preserve the request and return `NEEDS_CONTEXT` rather
  than inventing policy.
- **Evidence and completion:** record the trigger classification, owner map, source set, authority boundary,
  and explicit non-goals. This step completes when every in-scope obligation has exactly one owner.

#### 1.2 Lock the outcome, target claim, and stack fit

- **Input and precondition:** use the owner map and every accepted project or design decision that constrains
  the application.
- **Action:** lock the primary and supporting actors, trigger, entry modes, normal and alternative paths,
  visible and system completion, false completion, failure and recovery, data effects, support route,
  operating-system and architecture claims, scope, non-goals, and publication authority.
- **Decision:** preserve the accepted stack unless it is new or materially challenged. In that case compare
  resource and package cost, trusted and untrusted content, required native depth, target and update support,
  team capacity for continuing upgrades, migration cost, and release obligations.
- **Branch and recovery:** a material stack conflict or a target with no credible delivery path pauses for an
  explicit user decision; revise the outcome or target matrix only through that decision.
- **Evidence and completion:** produce the locked outcome contract, exact claim matrix, stack-fit record,
  material assumptions, and reopen conditions. This phase completes when the intended installed result and
  its limits are unambiguous.

### Phase 2 — Lock the complete application contract

#### 2.1 Reconcile observable design and implementation ownership

- **Input and precondition:** use the accepted UI and UX contracts, outcome contract, current application
  structure, and selected implementation owners.
- **Action:** trace every entry mode, state, action, failure, recovery route, accessibility obligation, first
  paint, and touched native behavior to an observable specification. Assign each implementation unit one
  process and one capability owner.
- **Routing:** apply coding and TypeScript to implementation; load React, HTML, and CSS only when those
  technologies enter scope. Take installed-platform behavior to `desktop-platform`, and route Electron
  process, bridge, security, lifecycle, native, build, package, test, and release mechanics through the
  Electron root and every applicable child.
- **Branch and recovery:** if an implementation constraint contradicts the accepted experience, return the
  conflict and evidence to the owning design decision instead of silently changing behavior.
- **Evidence and completion:** produce the design-to-unit trace, process and capability map, implementation
  affected set, and unresolved-decision register. This step completes with no unowned or contradictory
  observable obligation.

#### 2.2 Lock runtime, local-data, and release contracts

- **Input and precondition:** use the reconciled design, `desktop-platform` contract, the project's selected
  Electron version, current mechanism-owner facts, persisted formats, and `desktop-release` judgments.
- **Action:** lock the observable target, entry, window, lifecycle, native, installed-resource, and recovery
  behavior through `desktop-platform`. Obtain process placement, bridge and IPC contracts, caller and payload
  trust rules, cleanup, and development-versus-packaged load paths from the applicable Electron children.
- **Action:** lock local-data CRUD, location, retention, export, atomic or detectably incomplete writes,
  schema versions, migration, downgrade or forward compatibility, corrupt-state recovery, and fail-closed
  secret handling.
- **Action:** for each claimed target, lock the package and installed artifact, signing or notarization
  obligations, store or package-manager obligations, update mechanism and channel, supported-version window,
  monitoring, rollout stop conditions, support route, recovery limits, and forward-fix path.
- **Branch and recovery:** resolve mutable platform facts from their current owner. An unknown obligation,
  unsupported target, unowned migration, or absent recovery path blocks the affected claim until its owner
  closes it or the user narrows scope.
- **Evidence and completion:** produce one coherent application contract, channel inventory, lifecycle map,
  data and compatibility map, release-control plan, and claim-to-proof plan. This phase completes when every
  in-scope path can be built, recovered, and proved without an unstated decision.

### Phase 3 — Build the complete installed outcome

#### 3.1 Establish the skeleton and one thin installed path

- **Input and precondition:** use the locked application contract and owner-approved implementation designs.
- **Action:** establish the complete source, process, bridge, data, build, package, test, documentation, and
  instrumentation skeleton before detailed behavior. Keep each configuration and type boundary with the
  process it governs.
- **Action:** connect the smallest real path from one supported entry through the observable interface and
  narrow bridge to its authoritative effect, truthful completion, and applicable persisted state; package,
  install, and exercise that path on one explicitly named target.
- **Branch and recovery:** if the path exposes a structural, privilege, data, packaging, or design defect,
  repair the earliest owning contract and rebuild the dependent skeleton before adding behavior.
- **Evidence and completion:** retain per-owner checks, the exact installed artifact identity, and an
  end-to-end observation at the authoritative effect. This step completes only when the thin installed path
  works without a development-only assumption.

#### 3.2 Grow complete vertical slices

- **Input and precondition:** begin from the verified skeleton, thin path, outcome paths, and proof plan.
- **Action:** implement one user-visible capability at a time across code, bridge, data, configuration,
  package inputs, tests, documentation, and instrumentation; verify the complete affected slice before the
  next.
- **Exercise:** cover every applicable normal, alternative, boundary, failure, interruption, cancellation,
  duplicate, stale or corrupt state, dependency failure, unsupported input, adversarial renderer or content,
  platform delta, lifecycle cleanup, and recovery path. Measure main-process responsiveness and bounded
  resource use under representative work.
- **Branch and recovery:** return a contract mismatch to Phase 2 and a skeleton defect to Step 3.1. Repair a
  behavior defect in its owning slice, then repeat that slice and every dependent check.
- **Evidence and completion:** maintain a slice trace from each locked path to its implementation and fresh
  checks. This phase completes when every in-scope path is implemented with no placeholder or deferred layer.

### Phase 4 — Prove, evaluate, and hand off

#### 4.1 Prove every claimed target from its installed artifact

- **Input and precondition:** use the complete candidate, exact claim matrix, target-specific build
  environments, owner-required package controls, and representative fixtures.
- **Action:** for every claimed operating-system and architecture pair, build and package in the required
  environment; clean-install; launch, use, exit, and relaunch; and exercise applicable entry modes, native
  integrations, data effects, failure, and recovery.
- **Action:** inspect the same artifact's resources, native dependencies, fuse posture, secret absence,
  integrity, signing, notarization, store or package-manager obligations, and update metadata. Measure
  installed performance and resource targets under the declared conditions.
- **Branch and recovery:** repair and repeat the affected target when proof fails. If a required environment or
  obligation cannot be exercised, mark that target unproved and narrow the claim; another target's result
  cannot substitute.
- **Evidence and completion:** fill the exact target claim matrix with artifact identities, conditions,
  observations, limitations, and the delivery state each row proves. This step completes when every retained
  target claim has matching installed-artifact evidence.

#### 4.2 Rehearse version transition and recovery

- **Input and precondition:** use the candidate, realistic persisted data, the immediately previous installed
  released artifact, and every supported predecessor with a materially different migration, updater, data,
  or packaging path.
- **Action:** rehearse each supported transition through update discovery, download, installation,
  migration, launch, ordinary use, and relaunch. Exercise interruption, restart, retry, corrupt input, older
  version behavior, recovery, and the forward-fix route.
- **Branch and recovery:** an incompatible version must refuse explicitly while preserving recoverable data.
  A failed update must preserve a usable application and data or enter the declared recovery path; an
  unavailable predecessor leaves its transition unproved and outside the supported claim.
- **Evidence and completion:** record the predecessor matrix, realistic-data identities, transition and
  interruption observations, data compatibility, recovery limits, and forward-fix result. This step completes
  when every supported transition is proven recoverable.

#### 4.3 Evaluate independently and hand off the delivery states

- **Input and precondition:** freeze the exact candidate, installed artifacts, claim matrices, transition
  records, design trace, owner checks, limitations, support plan, and authority state.
- **Action:** route the complete frozen subject to independent Evaluation. Return each problem to its earliest
  owner, repair only after its disposition is authorized, and repeat the affected proof plus every dependent
  whole-outcome check.
- **Handoff:** state the outcome and non-goals, target and artifact matrix, observable contract, process and
  bridge map, data schemas and recovery, update paths, support and forward-fix plan, limitations, and each
  distinct delivery state through release readiness and authority.
- **Authority branch:** release-ready requires accepted evaluation and matching proof for every retained
  claim. Publication remains a separate explicit user action; without that authority, hand off the ready
  artifacts and stop before any external effect.
- **Completion:** this operation ends with one reproducible installed outcome, no in-scope gap, a cold
  operator handoff, and literal claim boundaries—or with a recoverable blocked state naming the missing
  owner, evidence, or authority.
