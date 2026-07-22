---
name: web
description: Use when designing, implementing, and evaluating one release-ready web application feature as a complete vertical slice.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Feature Development

Operation skill for producing one release-ready web application feature as a complete vertical slice. Load it
for a bounded outcome such as login, account recovery, search, payment, or checkout when the work may cross the
browser, routes, client state, server/API behavior, data or provider effects, trust boundaries, tests,
observability, and release operations. Include only the layers the feature needs.

This is the discoverable root. It routes browser-interface work through generic [`ui`](../ui/SKILL.md) and
then [`web/ui`](ui/SKILL.md), and browser-experience work through generic [`ux`](../ux/SKILL.md) and then
[`web/ux`](ux/SKILL.md). Load [`coding`](../coding/SKILL.md) and each applicable language, runtime, and
framework skill for implementation idioms. The future React skill will own React APIs and ecosystem policy;
this skill owns only the framework-independent web contract and React integration outcomes.

## Principles

> **One feature is one observable outcome across every layer it needs.**

The unit of work is not a page, endpoint, component, migration, or happy path. It is the bounded outcome from
entry to verified completion, including false completion, failure, recovery, and all required system effects.

> **The current application is the first design constraint.**

Existing routes, contracts, state, data, security controls, interface conventions, tests, telemetry, and
release practices are evidence. Preserve them deliberately or record and authorize the change.

> **Accepted design precedes production realization.**

UI and UX specifications, direct-user evidence, and explicit gates remain distinct from implementation. A
working build does not retroactively accept an untested design.

> **Build a thin vertical skeleton, then grow verified paths.**

Make the smallest end-to-end path real first. Add normal, alternative, boundary, failure, recovery, and
adversarial behavior one slice at a time while keeping the whole feature verifiable.

> **Security, accessibility, recovery, observability, and rollback are behavior.**

They are part of what the feature does. Deferring them changes the feature contract and cannot be hidden as
cleanup.

> **A claim is no stronger than its owning evidence.**

Source inspection, automated checks, browser behavior, DOM/accessibility evidence, rendered captures,
representative-user use, telemetry, and release evidence prove different properties. Keep the claims separate.

## Rules

### Must-Follow

- **WEB-R01 — MUST bind one complete feature outcome and its boundary.** Name actors, trigger, entry,
  user-visible and system completion, false completion, paths, states, failures, recovery, side effects,
  support, scope, and non-goals. Adjacent outcomes require a new user decision.
- **WEB-R02 — MUST study the live application before choosing the change.** Inspect governing project rules,
  feature/design records, routes, UI patterns, API contracts, schemas, authorization, tests, telemetry,
  configuration, migrations, and release controls. Record what stays compatible and any deliberate break.
- **WEB-R03 — MUST load the capability owners.** Load `coding` and applicable language/runtime/framework
  skills before code. For an observable browser interface, load generic `ui` before `web/ui`. For flow,
  content, recovery, trust, research, or measurement, load generic `ux` before `web/ux`. A skipped child needs
  inspected evidence that its trigger is absent.
- **WEB-R04 — MUST preserve generic UI and UX acceptance chronology.** Complete and approve the applicable
  whole design specification, create only a disposable prototype, obtain the required representative-user
  evidence, revise the specification first, and accept the design before treating it as ready for production
  realization. Missing required people, consent, accommodations, or evidence yields `NEEDS_CONTEXT` and blocks
  release readiness.
- **WEB-R05 — MUST lock one vertical feature contract before implementation.** Define URLs and entry modes,
  browser/client states, client-server messages, server/domain behavior, data or provider effects,
  authorization, privacy, error semantics, recovery, instrumentation, configuration, migrations, rollout, and
  rollback. Mark each element applicable or give evidence for its absence.
- **WEB-R06 — MUST map data and authority at every boundary.** Record who creates, reads, updates, deletes,
  retains, exports, and observes data; validate untrusted input before privileged use; minimize sensitive data;
  and define authentication, authorization, consent, abuse, secret, and third-party boundaries.
- **WEB-R07 — MUST build bottom-up through a thin end-to-end skeleton.** Establish the smallest path through
  browser, server, data/provider, and observable completion before filling breadth. Add one verified behavior
  slice at a time and keep the contract, code, tests, docs, and telemetry in agreement.
- **WEB-R08 — MUST make failure and recovery explicit.** Cover invalid state, timeout, interruption, partial
  mutation, stale client, dependency failure, cancellation, retry, duplicate action, idempotency, concurrency,
  late result, and safe resumption when their triggers apply. No path may report false success or require
  hidden repair.
- **WEB-R09 — MUST define and verify applicable quality obligations.** Accessibility, localization, security,
  privacy, performance, resilience, cost, observability, support, browser/runtime compatibility, and data
  integrity each need a project-owned target or a current, evidence-based feature target. Do not invent a
  universal performance budget or security checklist.
- **WEB-R10 — MUST verify every claim at its owner.** Use source/static analysis for structure, tests for code
  behavior, live browser interaction for user-visible operation, DOM/accessibility-tree evidence for hidden
  semantics, rendered captures for captured pixels, direct representative-user evidence for design
  acceptance, server/data evidence for effects, and telemetry/release evidence for operations. A screenshot
  never proves hidden behavior, responsiveness, focus order, semantics, or conformance.
- **WEB-R11 — MUST finish the production change.** Complete all in-scope code, configuration, migrations,
  provider setup, tests, documentation, instrumentation, support diagnostics, and compatibility work. Do not
  label prototypes, mocks, fixtures, or planned work as production implementation.
- **WEB-R12 — MUST gate release readiness and external release separately.** Release-ready requires every
  applicable technical, UI, UX, security, accessibility, performance, observability, migration, and rollback
  gate to pass. Prepare rollout, monitoring, stop conditions, and tested rollback. Deployment or another
  irreversible external action still requires its own authority.
- **WEB-R13 — MUST report claims separately.** Report implementation correctness, UI design acceptance, UX
  design acceptance, release readiness, deployment authorization, and post-deployment outcome validation as
  distinct claims. Production outcomes remain pending until live evidence exists.
- **WEB-R14 — MUST keep this contract framework-independent.** React may be used to exercise hydration,
  component-state, routing, and semantic integration cases, but React APIs, hooks, rendering-mode choices,
  router/state libraries, and ecosystem conventions belong to the future React skill.
- **WEB-R15 — MUST stop at the feature boundary.** Whole-product discovery, project startup, global
  architecture redesign, framework migration, project-wide design-system creation, a complete identity or
  commerce platform, unrelated cleanup, and speculative abstractions are out of scope unless the user changes
  the contract.

### Must-Not-Follow

- **NEVER call a page, endpoint, component, schema, or green happy path a finished feature.** Return to
  WEB-R01 and WEB-R05 and close the missing layers and paths.
- **NEVER let implementation convenience choose or waive design, security, accessibility, privacy, or data
  obligations.** Use the owning evidence and return a material conflict to user authority.
- **NEVER infer acceptance from a polished capture, passing unit suite, framework convention, or dashboard
  event.** Verify the specific claim at its owner under WEB-R10 and WEB-R13.
- **NEVER copy general coding, UI, UX, vision, language, framework, or standards policy into this skill.** Name
  the local consequence and point to its owner.

## Procedure

Run ten phases in order. Each phase produces evidence and names the return route for a failed gate.

### P1 — Frame authority, current reality, and one feature

Read project rules and relevant memory. Inspect the live surfaces named by WEB-R02. Write the one-sentence
outcome, actors, completion and false-completion signals, boundary, non-goals, current behavior, and decision
authority. Use [`ideation.md`](ideation.md) for the discussion sequence. Stop on an unresolved scope or
authority conflict.

**Evidence:** current-reality register, locked outcome and scope, authority map, compatibility constraints.

### P2 — Route design and implementation owners

Apply WEB-R03. Record which generic/child UI and UX bundles apply, which language/runtime/framework skills own
implementation idioms, and why any candidate owner is not applicable. Complete applicable generic UI/UX
design work and direct evidence under WEB-R04 before production realization.

**Evidence:** load/owner map, accepted UI/UX specifications and evidence, or `NEEDS_CONTEXT`.

### P3 — Lock the vertical feature contract

Map routes and entry modes; browser/client states; messages and API errors; domain rules; data/provider
effects; auth, privacy, consent, and abuse boundaries; failure/recovery; instrumentation; configuration;
migrations; rollout; and rollback. Mark trust crossings and irreversible effects. Resolve contradictions with
the existing application before continuing.

**Evidence:** approved vertical contract, state/sequence map, trust/data CRUD map, affected-surface map.

### P4 — Plan proof and release controls

Derive normal, alternative, boundary, failure/recovery, adversarial, compatibility, and counterfactual cases
from [`scenarios.md`](scenarios.md). Select the checks in [`checklists.md`](checklists.md). Set project-owned or
current evidence-based quality targets, lab/field distinctions, telemetry signals, rollout stops, and rollback
proof. Pause before any migration, provider mutation, or external release requiring new authority.

**Evidence:** scenario/check register, evidence plan, quality targets and sources, release-control plan.

### P5 — Build the thin vertical skeleton

Materialize contracts, seams, types, routes, state shapes, error shapes, test seams, and instrumentation points.
Connect the smallest safe request from browser entry to server/data/provider effect and truthful completion.
Use fakes only where marked. Verify the skeleton before adding breadth.

**Evidence:** import/build/type/static checks plus one end-to-end skeleton trace.

### P6 — Grow behavior one verified slice at a time

Add the ordinary path, then alternative-valid classes, exact boundaries, failures and recovery, adversarial
behavior, compatibility, and counterfactual assumptions. For each slice, update code, contracts, data,
configuration, docs, tests, and telemetry together; run focused proof before the next slice.

**Evidence:** ordered slice log with focused verification and updated affected-surface trace.

### P7 — Complete production and operational behavior

Close all applicable WEB-R06–WEB-R11 obligations. Apply migrations/configuration in safe test conditions,
exercise provider and data behavior, confirm support diagnostics, and remove or clearly isolate simulated
behavior. Prepare rollout, monitoring, stop, and rollback instructions without deploying.

**Evidence:** complete implementation and operations bundle with no unowned in-scope gap.

### P8 — Verify the whole feature

Run the strongest safe proof each claim admits: static and dependency checks; focused and full automated
tests; live browser and DOM/accessibility checks; security verification; localization and browser matrices;
lab performance and available field evidence; data/provider effect checks; telemetry validation; migration
and rollback rehearsal. Record gaps rather than widening a weaker signal.

**Evidence:** claim-owner verification matrix with commands, environments, results, and limitations.

### P9 — Evaluate independently

Route review through [`evaluation.md`](evaluation.md) inside the active Gobbi evaluation. Evaluate all seven
perspectives plus Overall. Keep technical, UI, UX, release, deployment, and production-outcome claims separate.
Revise from the owning parent rule when a companion exposes a gap.

**Evidence:** active evaluation outputs, filled checklist, dispositions, and preserved strengths.

### P10 — Hand off release readiness

Confirm every applicable required check is `PASS`. Publish the feature contract, implementation summary,
verification limits, design acceptance, compatibility notes, configuration/migration steps, dashboards and
alerts, support route, rollout/stop/rollback plan, deployment authority state, and post-deployment validation
plan. A cold operator must be able to release or roll back without hidden session context.

**Evidence:** release-ready handoff and the WEB-R13 claim ledger.

## References

- [`ideation.md`](ideation.md) owns the feature-scale user discussion sequence used by P1–P4.
- [`scenarios.md`](scenarios.md) exercises this parent contract without adding policy.
- [`checklists.md`](checklists.md) supplies the unchecked operational gates for this contract.
- [`evaluation.md`](evaluation.md) extends active Gobbi evaluation with web-feature selection and lenses.
- [`../startup/topics.md`](../startup/topics.md) supplies the structured interview topic bank adapted by this
  feature's ideation companion; it does not expand the task into project startup.
- [`../coding/SKILL.md`](../coding/SKILL.md) owns language-agnostic software construction quality.
- [`../ui/SKILL.md`](../ui/SKILL.md) and [`../ux/SKILL.md`](../ux/SKILL.md) own the generic design and direct-
  evidence acceptance contracts specialized by the two web children.
- [`../vision/SKILL.md`](../vision/SKILL.md) and [`../vision/ui.md`](../vision/ui.md) own rendered-capture
  analysis and its evidence limits.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the normative web-accessibility reference.
- [WHATWG HTML](https://html.spec.whatwg.org/) owns browser forms, interaction, navigation, and history
  mechanics.
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) supplies versioned
  web-application security verification requirements selected from the feature threat model.
- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) explains current
  field-threshold methodology; project context still owns the feature target.
- [React `hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) and [state preservation](https://react.dev/learn/preserving-and-resetting-state)
  validate integration cases only; they do not make this a React policy skill.
