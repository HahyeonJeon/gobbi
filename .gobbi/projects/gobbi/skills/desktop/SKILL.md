---
name: desktop
description: Use when designing, orchestrating, and accepting one complete installed desktop application outcome; route every Electron platform decision and implementation through the Electron skill family.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Desktop Application Delivery

Deliver one complete installed desktop application outcome: what a person needs, how the experience is
designed, how the work is sequenced, what safety and accessibility mean, what direct user evidence supports,
and what proves the whole outcome ready on every claimed operating system.

This skill is the product-design and orchestration owner. It is not an Electron platform-policy owner.
Before any Electron work, **MUST load [`electron`](../electron/SKILL.md)** and every child whose trigger
applies:

| Electron work | Required child |
|---|---|
| Security boundaries, project shape, bridge and IPC contracts, process or window ownership, native behavior, errors, or platform defaults | [`electron-convention`](../electron/electron-convention/SKILL.md) |
| Implementing or reviewing main, preload, renderer, utility, window, lifecycle, or native-integration changes | [`electron-development`](../electron/electron-development/SKILL.md) |
| Looking up process capabilities, preload and IPC mechanics, lifecycle, native integration, or operating-system behavior | [`electron-runtime`](../electron/electron-runtime/SKILL.md) |
| Designing, implementing, running, or interpreting Electron-specific evidence | [`electron-test`](../electron/electron-test/SKILL.md) |
| Packaging, signing, notarizing, upgrading, update-rehearsing, or preparing release artifacts | [`electron-release`](../electron/electron-release/SKILL.md) |

Load several children when several triggers apply. The Desktop supporting documents are subordinate
desktop-outcome projections. They help translate a product contract into questions for the Electron family;
they never replace an applicable Electron child or define Electron settings, mechanisms, version facts, or
release policy. If an unchanged Desktop companion names an Electron mechanism or historical platform check,
read it only as a product-risk or evidence-activation prompt: the applicable Electron child supplies the
current rule, procedure, mechanism, and pass condition. Never implement or accept the companion wording by
itself.

## Principles

### One whole outcome is the unit of work

A desktop outcome begins with a person’s situation and ends with verified completion in the installed
application on every claimed operating system. A polished window, a working capability, a green development
build, or an installer is evidence for one part; none is the whole outcome.

### Design is a ladder of questions

Research, task structure, information architecture, navigation, flows, structural specification, wireflow,
high-fidelity presentation, and an interactive prototype answer different questions. Existing evidence may
close a rung when it answers that rung directly, but polish on a later rung cannot fill an earlier gap.

### Platform conformance is observable product behavior

People experience window, lifecycle, native, install, and update behavior as part of the product. Desktop
defines the promised experience and acceptance claim; the applicable Electron skills exclusively define and
verify the platform mechanisms that realize it.

### Evidence stays matched to the claim

Direct representative-user evidence supports human-outcome claims. Electron process and boundary evidence,
packaged-artifact evidence, and release evidence support their own platform claims. A result from one class,
build, operating system, or delivery state never silently stands in for another.

## Rules

- **MUST bind the complete desktop outcome before implementation.** Record the people, situation, required
  actions, states, meanings, entry modes, completion evidence, claimed operating systems, quality targets,
  product authority, and explicit in-scope and out-of-scope boundaries.
- **MUST route every Electron platform concern through the Electron root and all applicable children.**
  Process placement, bridge and IPC policy, security settings, loader behavior, lifecycle mechanisms,
  native APIs, platform deltas, Electron tests, packaging, signing, notarization, updating, and release
  mechanics are Electron-family policy. No Desktop document may restate or override it.
- **MUST resolve the design ladder in question order and record re-entry.** A cited prior artifact closes a
  rung only when it is inspectable, substantive, current, answers that rung’s question, and states its
  limits. When later evidence changes an earlier answer, return to the earliest affected rung and re-check
  every dependent rung.
- **MUST protect accessibility, safety, participant consent, and direct representative-user evidence as
  non-waivable floors.** No platform convention, stakeholder preference, prior artifact, schedule, or
  recorded owner can reduce these properties or turn an applicable failure into acceptance.
- **MUST prove each claim at its truthful seam and on each claimed target.** Product behavior is observed
  through the user-visible outcome; Electron behavior follows `electron-test`; shipped behavior is checked
  in the actual packaged or installed artifact; release behavior follows `electron-release`. Evidence from
  one operating system supports only that operating system.
- **MUST accept and hand off the whole outcome, not a collection of partial greens.** Every approved design
  item, implementation slice, affected document, target claim, limitation, recovery route, and authority
  state remains traceable. Publication or another irreversible external action requires explicit user
  authority.

### Stable companion identifiers

Existing Desktop companions use stable `DESK-*` identifiers. The identifiers below remain routing aliases,
not an additional policy layer. An alias that concerns Electron resolves to the applicable Electron child;
it does not restore Desktop ownership of the mechanism.

| Identifier | Resolution in this skill |
|---|---|
| `DESK-R01`, `DESK-R02` | Bind the complete outcome, scope, claimed targets, authority, and boundary at P1. |
| `DESK-R03` | Decide product-form and Electron stack fit at P1 using current evidence from applicable Electron children. |
| `DESK-R04` | Desktop exclusively owns product design and whole-outcome acceptance; the Electron family exclusively owns Electron platform policy. |
| `DESK-R05`, `DESK-R06` | Keep and substantiate the nine-row rung register at P3–P4. |
| `DESK-R07`, `DESK-R08`, `DESK-R09` | Keep fidelity axes independent, choose an artifact that answers the rung, and preserve generative-before-evaluative order and recorded iteration. |
| `DESK-R10` | `DESK-FLOOR-01`, the accessibility property and its inventory-wide check. |
| `DESK-R11` | `DESK-FLOOR-02`, the safety property and its inventory-wide check. |
| `DESK-R12` | `DESK-FLOOR-03`, participant consent and protection, including fail-closed missing context. |
| `DESK-R13` | `DESK-FLOOR-04`, direct representative-user acceptance evidence per claimed target. |
| `DESK-R14`, `DESK-R15`, `DESK-R16`, `DESK-R17`, `DESK-R18` | Product capability, trust, contract, project-shape, and lifecycle needs are recorded at P5; every Electron placement, validation, bridge, target, loader, and disposal mechanism routes to `electron-convention`, `electron-development`, `electron-runtime`, and `electron-test`. |
| `DESK-R19`, `DESK-R20` | Electron security and hardening policy routes to `electron-convention`, `electron-test`, and `electron-release`; Desktop retains the product safety consequence and user decision. |
| `DESK-R21`, `DESK-R22` | Desktop defines the native and per-target product promise; Electron convention, runtime, development, and test own the platform fact, mechanism, and evidence. |
| `DESK-R23` | Packaged, installed, identity, and update claims route to `electron-release` and `electron-test` at P9 and remain distinct. |
| `DESK-R24` | Desktop owns the supported-version, irreversible user-consequence, recovery, and release-authority promise; `electron-release` owns the release and update mechanisms. |
| `DESK-R25` | Keep product, process, security, packaged, installed, identity, update, and release evidence as separate claims. |
| `DESK-R26` | Current Electron versions, support, mechanisms, and source verification belong to `electron-runtime` and `electron-release`; Desktop records only the resulting product limitation or promise. |
| `DESK-R27` | Fire and record `DESK-G1` through `DESK-G8` before the work each governs. |
| `DESK-R28` | Trace every approved design item, scope item, claim, verifier, and limitation at P9–P10. |
| `DESK-R29` | Keep the complete Desktop design record from P1 through P10. |
| `DESK-R31` | A deferred product capability or Electron need stays visibly incomplete and cannot support acceptance. |

The stable prohibitions resolve as follows:

| Identifier | Prohibition |
|---|---|
| `DESK-N01` | Never call an outcome complete while an approved in-scope path is missing. |
| `DESK-N02` | Never skip or mark a rung inapplicable without inspected evidence for that rung’s property. |
| `DESK-N03` | Never collapse interaction, visual, and content fidelity into one label. |
| `DESK-N04` | Never use a static artifact as behavioral or accessibility evidence. |
| `DESK-N05` | Never waive a protected floor or treat an owner, limitation, deferral, or recorded-open item as acceptance. |
| `DESK-N06`, `DESK-N07`, `DESK-N08` | Never treat types, a project target, a development build, or one hardening signal as proof of an Electron boundary; route the exact claim to the applicable Electron child. |
| `DESK-N09` | Never invent or repeat an unverified platform convention; obtain it from `electron-runtime` or record the limitation. |
| `DESK-N10` | Never resolve a user gate, production-dependency choice, release-stack choice, or authority decision on the user’s behalf. |
| `DESK-N12` | Never present deferred platform capability as implemented, tested, packaged, or released. |

The eight decision gates also stay stable: `DESK-G1` stack fit, `DESK-G2` rung applicability,
`DESK-G3` structural approval, `DESK-G4` design acceptance, `DESK-G5` any platform hardening-versus-
testability choice returned by the Electron family, `DESK-G6` release-stack selection from
`electron-release`, `DESK-G7` production-dependency adoption, and `DESK-G8` release authority.

## Procedure

### P1 — Bind the outcome and stack fit

1. Record What, Why, How, scope, success, target people, operating systems, entry modes, current evidence,
   constraints, decision owners, and release authority.
2. Decide whether an installed desktop application is the right product form. If the product’s defining
   value depends on a different surface or on platform capability that may not exist, inspect the applicable
   `electron-runtime` and `electron-release` evidence before committing to Electron.
3. Inventory existing design, code, tests, packaging, released behavior, and prior failure evidence without
   treating any of them as proof for a claim they cannot observe.

**Complete when:** the product outcome, claim boundary, stack-fit decision, and authority map are explicit.

### P2 — Establish the Electron evidence foundation

Load [`electron`](../electron/SKILL.md) and every child triggered by the bound outcome. Record the pinned
project state, claimed targets, existing platform and release stack, applicable child routes, evidence
available now, and evidence that can exist only in an Electron process, packaged artifact, installed
artifact, or release rehearsal. Do not copy the children’s mechanism or version policy into the Desktop
record.

**Complete when:** every Electron need has an applicable owner, current evidence source, and recheck trigger,
and every unavailable fact is a visible limitation rather than an inference.

### P3 — Resolve design rungs 0 through 4

Use [`fidelity-ladder.md`](fidelity-ladder.md) for each rung’s default artifact and validation depth.
Resolve the first five questions in order:

| Rung | Question |
|---|---|
| 0 — Research and problem definition | Is this the right problem, for whom, in what situation? |
| 1 — Task analysis | What does the person actually do, in what order, and at what cost? |
| 2 — Information architecture | What exists, how is it organized, and what is it called? |
| 3 — Navigation | Can people reach it directly and understand where they are? |
| 4 — User flows | What is the complete path, including waits, failures, and recovery? |

For each rung, record `answered`, `cited`, or `n/a:<property>`, the artifact or evidence pointer, what
inspection found, limitations, chronology, and any downstream re-check after re-entry. A pointer, owner,
plan, placeholder, or recorded-open item does not accept a rung.

**Complete when:** rungs 0–4 are substantiated and no later answer leaves an earlier rung stale.

### P4 — Resolve design rungs 5 through 8 and the protected floors

Continue through the structural and visual questions:

| Rung | Question |
|---|---|
| 5 — Structural skeleton | Does one surface-neutral structure hold hierarchy, state, action priority, status, failure, recovery, adaptation, and completion together? |
| 6 — Low-fidelity structure | Does that structure hold when representative people try to use it? |
| 7 — High-fidelity presentation | Do hierarchy, affordance, content, and every material state read correctly? |
| 8 — Interactive prototype | Can representative people complete the outcome unaided at realistic response speed? |

Stop after rung 5 for explicit user approval of the structural specification before visual work. After rung
8, present the complete design record for explicit acceptance. Record every visual artifact independently on
interaction, visual, and content fidelity; a static artifact is never behavioral evidence. Record each row
with the same substantiation, limitation, chronology, and re-entry fields used at P3.

These are open properties, not checklists that become complete when their examples pass:

1. **`DESK-FLOOR-01` — Accessibility.** Every required action, state, and meaning remains available through every applicable
   modality. At minimum inspect perception, operation, focus or cursor flow, reading or announcement order,
   input alternatives, status, error identification, recovery, timing, motion, non-color cues, language,
   locale, adaptation, and assistive-technology behavior on each claimed operating system.
2. **`DESK-FLOOR-02` — Safety.** No clause permits a consequence the actor cannot foresee, refuse, or recover from. Sweep every
   product action, data operation, native interaction, lifecycle transition, update consequence, and release
   decision; discovery of an unlisted hazard expands the floor.
3. **`DESK-FLOOR-03` — Participant consent and protection.** Before any activity involving a person, ensure informed consent,
   needed accommodations, genuinely representative access, required evidence conditions, minimized data,
   protected retention, and separation of observation from interpretation. Missing conditions stop the work
   with missing context; they do not produce design acceptance.
4. **`DESK-FLOOR-04` — Direct representative-user evidence.** Human-outcome acceptance requires direct evidence from
   representative people using this outcome’s own artifacts, per claimed operating system. Cover
   perception, comprehension, operation, completion, alternatives, errors, recovery, feedback, status
   recognition, trust, accessibility, adaptation, workarounds, and unintended harm as applicable. Prior
   research, analytics, expert review, conformance checks, static captures, and stakeholder approval remain
   context only.

Each floor gets an inventory-wide property check in addition to its known-member checks. Acceptance requires
`PASS` for every applicable item. A limitation, owner, deferral, waiver, or open resolution closes neither
the floor nor the whole outcome.

**Complete when:** rungs 5–8 are substantiated, both user decisions are recorded, and all four property
checks and every applicable member pass with direct evidence.

### P5 — Lock the desktop outcome contract

Describe the product without choosing Electron mechanisms:

- the action, state, meaning, completion, and recovery inventory;
- the presentation surfaces and the user-visible capability each needs;
- the data and migration outcomes, including downgrade and interruption behavior;
- the lifecycle and entry-mode outcomes across cold start, warm start, no-window, externally initiated, and
  background-resident cases that are actually in scope;
- the native interaction promises and claimed operating-system differences;
- the release audience, distribution promise, supported-version window, recovery promise, and authority
  boundary.

Use the subordinate projections in [`process-model.md`](process-model.md),
[`windows-lifecycle.md`](windows-lifecycle.md), [`native-integration.md`](native-integration.md),
[`security.md`](security.md), [`runtime-deltas.md`](runtime-deltas.md),
[`packaging-distribution.md`](packaging-distribution.md), and
[`signing-updates.md`](signing-updates.md) to expose product-level questions. Use
[`filesystem-data.md`](filesystem-data.md) for the application’s data outcome. For every Electron design or
mechanism decision discovered here, load the Electron root and the applicable children before deciding it.

**Complete when:** the accepted design maps to one coherent outcome contract without embedding Electron
platform policy.

### P6 — Plan proof, slices, and release authority

Map each slice from a user-visible path to its product completion evidence. Activate the applicable
[`scenarios.md`](scenarios.md) and [`checklists.md`](checklists.md) items, the four protected floors, the
claimed-target matrix, and the authority decisions.

For Electron work, load `electron-development`, plus `electron-convention`, `electron-runtime`,
`electron-test`, and `electron-release` wherever their triggers apply. Let those skills define the process
chain, platform contract, dependency order, evidence layers, release stack, and artifact plan. Desktop
records the resulting user consequence, product acceptance seam, limitation, and required gate without
restating the mechanism.

**Complete when:** the ordered slice plan covers every in-scope path, each claim has a truthful evidence
owner, all triggered decisions have a user, and irreversible work is marked behind explicit authority.

### P7 — Deliver the thinnest complete vertical path

Use `electron-development` to deliver the smallest real path from a visible user action through every
required Electron boundary to an authoritative product result. Apply `electron-convention` and
`electron-runtime`, and verify the path through `electron-test`. The Desktop acceptance observes the real
completion and recovery behavior, not an internal success signal.

**Complete when:** the structural path works end to end, the applicable Electron children accept their
claims, and any contradiction has returned to P5 rather than being hidden in implementation.

### P8 — Grow bounded verified slices

Add ordinary, alternative-valid, exact-boundary, failure, recovery, adversarial, per-operating-system,
compatibility, and migration behavior one slice at a time. Move the full affected set—design record, code,
contracts, configuration, tests, instrumentation, and user-facing documentation—in the same slice. Verify
each slice before beginning the next and return structural contradictions to their earliest owner.

**Complete when:** every in-scope path is implemented, no placeholder remains, and every slice has fresh
focused evidence.

### P9 — Verify the complete outcome

Run the project’s format, lint, type, focused-test, full-test, integration, and build gates in order. Then:

1. Give Electron process, bridge, security, lifecycle, native, platform, cleanup, and packaged claims to
   [`electron-test`](../electron/electron-test/SKILL.md).
2. Give packaging, signing, notarization, install, upgrade, update, recovery, and release-artifact claims to
   [`electron-release`](../electron/electron-release/SKILL.md), which in turn routes artifact tests through
   `electron-test`.
3. Exercise every claimed operating system and actual delivery state needed by the claim. An unrunnable gate
   records a limitation and blocks that claim.
4. Re-run the four protected-floor checks and trace each approved design item to observable implemented
   behavior.
5. Route the final independent review through [`evaluation.md`](evaluation.md), using
   [`scenarios.md`](scenarios.md) and [`checklists.md`](checklists.md) as applicable.

**Complete when:** every success criterion has truthful fresh evidence, every applicable check passes, and
the whole-outcome trace is complete.

### P10 — Prepare the decision-ready handoff

Publish the product contract, design-acceptance state, floor evidence, implementation trace, per-operating-
system support and limitation matrix, exact Electron evidence returned by the applicable children, release
and recovery plan, supported-version window, and remaining authority state. Keep claims distinct and make
the next operator able to reproduce each result without hidden session context.

Stop before publication or another irreversible external action unless the user has explicitly authorized
it.

**Complete when:** the handoff is reproducible, every limitation is visible, and no in-scope work remains
unowned or silently incomplete.

## References

- [`electron`](../electron/SKILL.md) — exclusive router for Electron platform work.
- [`electron-convention`](../electron/electron-convention/SKILL.md) — exclusive owner of Electron security,
  boundary, project-shape, bridge, IPC, window-ownership, native-default, and error conventions.
- [`electron-development`](../electron/electron-development/SKILL.md) — exclusive implementation and local
  verification operation for Electron platform changes.
- [`electron-runtime`](../electron/electron-runtime/SKILL.md) — exclusive lookup manual for Electron
  capabilities, mechanics, lifecycle, native behavior, and platform-specific failures.
- [`electron-test`](../electron/electron-test/SKILL.md) — exclusive Electron-specific evidence operation.
- [`electron-release`](../electron/electron-release/SKILL.md) — exclusive packaging, hardening, signing,
  notarization, upgrade, update, and release-artifact operation.
- [`fidelity-ladder.md`](fidelity-ladder.md) — Desktop design-rung artifacts, validation methods, and
  fidelity-axis depth.
- [`ideation.md`](ideation.md) — Desktop product decisions and user gates.
- [`filesystem-data.md`](filesystem-data.md) — application data, durability, migration, downgrade, secret,
  and external-data outcomes.
- [`process-model.md`](process-model.md), [`windows-lifecycle.md`](windows-lifecycle.md),
  [`native-integration.md`](native-integration.md), [`security.md`](security.md),
  [`runtime-deltas.md`](runtime-deltas.md), [`packaging-distribution.md`](packaging-distribution.md), and
  [`signing-updates.md`](signing-updates.md) — subordinate desktop-outcome projections; none replaces an
  applicable Electron skill.
- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and
  [`evaluation.md`](evaluation.md) — Desktop whole-outcome probes, checks, and independent evaluation; any
  Electron platform wording in them is subordinate activation context and requires the applicable Electron
  child’s current policy and evidence.
