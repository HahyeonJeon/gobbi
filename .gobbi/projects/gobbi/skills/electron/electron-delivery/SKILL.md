---
name: electron-delivery
description: "MUST load when coordinating one complete or multi-capability Electron application outcome across design, development, testing, diagnostics, packaging, installed verification, and release readiness."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Delivery

Electron Delivery coordinates one complete application outcome across the Electron owners. It returns a
complete coordinated delivery record at the exact last accepted state, ending in `maintained`, `reopened`,
or an explicit recoverable stop.

Delivery owns the complete outcome map, active-owner map, work order, state record, handoff tracking,
cross-owner invalidation, failure containment, maintenance routing, and coordination result. Each lower owner
keeps its policy and acceptance authority.

A caller may request a narrower pre-release terminal. Delivery returns that state literally with its handoff
and never describes it as full delivery.

## Principles

### Complete the map before dependent work

Map the whole observable outcome, its authorities, identities, lifecycle, failures, and owners first. Start
only the smallest dependency-ready owner-scoped work unit.

### Advance only on accepted owner records

Every literal delivery state requires an identity-matched accepted record from its named owner. A planned
step, placeholder, proxy, or Delivery opinion cannot advance state.

### Keep every decision with one owner

Every substantive decision belongs to exactly one lower owner or to user or product authority. Delivery
coordinates records and checks their identities; it does not repeat the decision.

### Reopen the earliest invalid premise

Preserve the last accepted state and name the first failed dependency. Route replacement work to the earliest
owner whose premise changed, then recheck every dependent acceptance.

## Rules

- **MUST classify the request as one-owner or coordinated before work starts.** Preserve read-only intent, and
  stop when the actor, target, requirement, owner, authority, identity, or requested terminal is missing.

- **MUST complete the outcome map, active-owner map, dependency order, and handoff identities before owner
  work.** Start no dependent work from a placeholder or planned record.

- **MUST use only the literal delivery states in this skill and advance each from its named owner's accepted,
  identity-matched record.** Record limitations and the last accepted state at every stop.

- **MUST reject stale, partial, proxy, cosmetic, or identity-mismatched handoffs.** Invalidate the earliest
  changed premise and every dependent state before recovery advances.

- **NEVER choose or copy sibling policy, run another owner's procedure, interpret Testing evidence, accept a
  Packaging candidate, decide Release readiness, change accepted contract or design, or issue a verdict.**
  Delivery checks only named, identity-matched accepted records.

- **NEVER infer authority or authorize or perform an external action.** Stop at the last accepted state when
  the named authority or responsible owner is unavailable or rejects a handoff.

## Procedure

### Phase 1 — Classify the Request

#### 1.1 Accept the coordination subject

- Record the requested user or product outcome, affected actors, exact application or artifact subject,
  target operating system and architecture, requested terminal, and current known state.
- Record who may accept product requirements, lower-owner outputs, release authority, and any external
  action. Keep these roles separate even when one person fills several roles.
- Record whether the request permits changes or is read-only. A read-only request remains read-only throughout
  coordination.
- Stop before state `requested` when the outcome, actor, target, requirement, owner, authority, subject
  identity, or requested terminal is absent or conflicts with another accepted input.

#### 1.2 Choose the one-owner or coordinated branch

- Use the one-owner branch when one lower owner can answer or change the request without depending on a new
  accepted output from another owner.
  - Route the exact subject, input, authority, expected output, and terminal to that owner.
  - Return the owner's handoff without creating or claiming a full Delivery lifecycle.
- Use the coordinated branch when the request covers a complete installed behavior or needs two or more
  owners to create new accepted outputs.
  - Name the complete coordination subject.
  - Continue through every phase needed by the requested terminal.
- If classification remains ambiguous, preserve the input and stop for the caller to choose the scope.

#### 1.3 Initialize the state and active-owner map

- Set `requested` only when the exact coordination subject, outcome, terminal, actors, targets, and authorities
  are accepted enough to coordinate.
- Create one active-owner entry per required lower owner with:
  - primary outcome owner and child owner;
  - why the owner applies;
  - exact input and expected output;
  - dependencies and identity fields;
  - acceptance authority;
  - stop and reopen condition.
- Delivery is the sole coordination owner. It is never the substantive owner named in a child entry.

### Phase 2 — Complete the Outcome Map Before Work

#### 2.1 Map the outcome, actors, targets, and identities

- Record the user or product outcome and every actor who initiates, experiences, supports, accepts, or
  authorizes it.
- Record every target operating system, architecture, distribution channel, application identity, artifact
  identity, version identity, candidate byte identity, installed identity, and observed population identity.
- Record the complete observable success path, every expected failure, user-visible feedback, preservation
  rule, recovery path, support path, and diagnostic need.
- Record the accepted interface, technical design, installed contract, source outcome, diagnostics, Testing
  claims and environments, Packaging candidates, Release policy and readiness inputs, installed evidence,
  post-release signals, maintenance owner, and recovery owner.
- Mark an item as absent, conflicting, stale, or accepted. Never convert absence into an assumed default.

#### 2.2 Reconcile the complete accepted design lifecycle

- Require identity-matched owner records for this complete sequence:

```text
authority and actors established
→ current application and official constraints studied
→ at least two materially different observable concepts compared
→ structure, states, content, feedback, recovery, accessibility, locale, and modality decided
→ process, trust, state, bridge, window and view, resource, performance, and isolation decisions accepted
→ installed contract and target differences reconciled
→ validation questions, measures, harmful proxies, and reopen signals defined
→ accepted, revised, or rejected
→ accepted design handed to Delivery
→ changed evidence or requirements reopen the earliest decision
```

- Interface owns observable experience decisions. Design owns technical architecture and security decisions.
  Contract owns installed behavior and safe recovery.
- Compare the three accepted records for the same actors, target, outcome, and subject identity. Return any
  conflict to its earliest owner; Delivery never chooses between records or edits an accepted decision.

#### 2.3 Map the complete installed application lifecycle

- Map installation and partial installation, first launch, cold start, initialization, ready state, ordinary
  quit, stopped state, relaunch, uninstall, data treatment, recovery, and support.
- Map window creation, no-window state, background or tray behavior, close compared with quit, window
  recreation, second-instance handling, and duplicate-instance handling.
- Map each alternate entry independently; a generic alternate-entry record cannot replace these four:
  - cold-start deep-link;
  - running-application deep-link;
  - cold-start file-open;
  - running-application file-open.
- For each of the four entries, record target availability and start, input validation and delivery, the
  correct instance and window, success and failure behavior, state preservation, recovery and support, and
  diagnostics and evidence.
- Map suspend and resume, operating-system shutdown and next recovery, update restart, migration, version
  checks, refusal, recovery, and support.
- Map renderer unresponsive and responsive transitions, renderer crash, utility or child failure, main
  process exit, external crash capture, and relaunch. A generic crash record cannot replace these cases.

#### 2.4 Order owner-scoped work and handoffs

- Create the smallest dependency-ready work units. For each unit, name one substantive owner, its accepted
  inputs, output identity, limitations, next owner, and stop condition.
- Use these dynamic work-record flows without treating them as static ownership links:
  - Interface and Design records flow to Contract reconciliation;
  - accepted design and contract records flow to Development;
  - Development records flow to Testing, then Testing returns evidence to the affected owner;
  - verified source records flow to Packaging;
  - Packaging exchanges evidence requests and returns with Testing;
  - Packaging candidate acceptance flows to Release;
  - Release exchanges evidence requests and returns with Testing;
  - Release results flow to Observability;
  - observed failures flow through Runtime diagnosis to the earliest affected owner;
  - every active child exchanges handoffs with Delivery.
- Start a unit only when all named inputs are accepted and identity-matched. Otherwise preserve the dependency
  gap and stop or run an earlier ready unit.

### Phase 3 — Advance Contract, Design, Source, and Behavior States

#### 3.1 Use the literal state contract

Use this sequence without renaming, merging, or skipping a required state:

```text
requested
→ contract-defined
→ design-accepted
→ implementation-ready
→ implemented
→ construction-verified
→ behavior-verified
→ packaged
→ packaging-evidence-requested
→ installed-verified
→ candidate-accepted
→ release-evidence-requested
→ release-ready
→ release-authorized
→ released
→ observed
→ maintained or reopened
```

Every transition record contains the subject identity, owner, accepted output, evidence class, limitations,
next owner, dependencies, acceptance or stop, and invalidation condition.

| State | Required meaning and owner record |
|---|---|
| `requested` | The exact coordination subject, outcome, terminal, actors, targets, and authorities are accepted enough to coordinate. |
| `contract-defined` | Contract accepted the exact installed behavior and safe recovery for the target and outcome. |
| `design-accepted` | Identity-matched Interface, Design, and Contract records are accepted and contain no unresolved conflict. |
| `implementation-ready` | Development accepted the exact inputs and one source outcome it can implement. |
| `implemented` | Product source changed; no verification is implied. |
| `construction-verified` | Development accepted construction and source checks only; runtime behavior is not implied. |
| `behavior-verified` | Testing returned passing, identity-matched behavior evidence for the source and environment; installed behavior is not implied. |
| `packaged` | Packaging produced exact candidate bytes; installed evidence and candidate acceptance are not implied. |
| `packaging-evidence-requested` | Packaging sent Testing an identity-matched dynamic evidence request. |
| `installed-verified` | Testing returned an identity-matched, environment-classified packaged or installed evidence record; Packaging acceptance is not implied. |
| `candidate-accepted` | Packaging alone accepted the exact record as an immutable candidate for each operating-system and architecture target. |
| `release-evidence-requested` | Release sent Testing an identity-matched dynamic evidence request. |
| `release-ready` | Release alone accepted readiness for the exact target, candidate, and policy after checking the returned record; external authority is not implied. |
| `release-authorized` | The exact current authority named the action, destination, candidate, target, channel, and time. |
| `released` | Release proved the exact external action and resulting destination. |
| `observed` | Accepted Observability signals arrived for the exact identity, population, and time; health is not inferred without accepted thresholds. |
| `maintained` | Current requirements, records, evidence, signals, support, and recovery are accepted. |
| `reopened` | A change or failure invalidated a named earlier state and routed work to the earliest owner. |

#### 3.2 Advance contract and design

- Advance to `contract-defined` only from Contract's accepted record for the exact target and outcome.
- Advance to `design-accepted` only after Interface, Design, and Contract records share the same identities and
  have no unresolved decision or conflict.
- On a rejected, revised, stale, partial, or mismatched record, preserve the prior state and route the exact
  gap to its owner.

#### 3.3 Advance source construction

- Advance to `implementation-ready` only when Development accepts every exact design, contract, source,
  configuration, and target input needed for its work unit.
- Advance to `implemented` only when Development reports the exact product source change. Record that no
  verification follows from this state.
- Advance to `construction-verified` only from Development's accepted construction and source-check record.
  Keep runtime and installed claims outside that record.

#### 3.4 Advance behavior evidence and diagnostics

- Send Development's exact source and environment identities to Testing. Testing alone defines the claim,
  evidence class, environment, result, limitation, and strength.
- Advance to `behavior-verified` only from Testing's passing identity-matched behavior evidence.
- Route diagnostic emission and arrival needs to Observability. Route Electron runtime facts and causal
  diagnosis to Runtime, then return the diagnosis to the earliest affected owner.
- Delivery records Testing, Observability, and Runtime outputs literally. It never upgrades a partial,
  unavailable, synthetic, or source-only record into stronger evidence.

### Phase 4 — Coordinate Packaging, Installed Evidence, and Candidate Acceptance

#### 4.1 Advance to packaged bytes

- Give Packaging the exact behavior-verified source, configuration, target matrix, identity inputs, and
  required metadata.
- Advance to `packaged` only when Packaging returns the exact produced byte identities per target. Preserve
  every limitation and never infer installed behavior.
- A rebuilt, replaced, renamed, resigned, notarized, or otherwise changed byte identity is a new subject and
  must re-enter Packaging acceptance work.

#### 4.2 Request and record installed evidence

- Advance to `packaging-evidence-requested` only when Packaging sends Testing a request naming exact candidate
  bytes, installed subject, target environment, lifecycle claims, and expected evidence classes.
- Testing owns the test design, execution, interpretation, and evidence strength. Packaging checks the
  returned identity against its request; Delivery checks only that both owner records match.
- Advance to `installed-verified` only from Testing's identity-matched, environment-classified record for the
  packaged or installed subject. Stop at `packaging-evidence-requested` when the environment is unavailable
  or the result is missing, partial, stale, or mismatched.

#### 4.3 Record candidate acceptance

- Packaging alone decides whether the installed evidence and exact bytes satisfy its candidate policy.
- Advance to `candidate-accepted` only from Packaging's acceptance of an immutable candidate identity for
  each operating-system and architecture target.
- On rejection, retain `installed-verified` when that evidence remains current, name Packaging's first failed
  condition, and route the replacement without altering Testing's record.

### Phase 5 — Coordinate Release, Authority, External Action, and Observation

#### 5.1 Request release evidence and record readiness

- Give Release the exact candidate identities, targets, predecessor, channel, metadata, policy, known
  limitations, and current authority record.
- Advance to `release-evidence-requested` only when Release sends Testing an identity-matched request for the
  claims and environments Release requires. Testing owns the returned evidence.
- Release alone checks that record against Release policy. Advance to `release-ready` only from Release's
  accepted readiness record for the exact target, candidate, and policy.
- Readiness never implies authority. Stop at `release-ready` when no exact current authority exists.

#### 5.2 Record authority and release

- Advance to `release-authorized` only from an authority record naming the exact action, destination,
  candidate, target, channel, and time.
- Release, not Delivery, performs the authorized external action under Release's procedure. Delivery cannot
  access credentials, publish, promote, roll out, withdraw, roll back, merge, or clean up.
- Advance to `released` only when Release proves the exact external action and resulting destination. Record
  a refusal, partial action, wrong destination, expired authority, or identity mismatch as a stop at the last
  accepted state.

#### 5.3 Record observation

- Give Observability the exact released identity, population, time range, expected signals, accepted
  thresholds, limitations, and support route.
- Advance to `observed` only when accepted signals arrive for that identity, population, and time.
- Do not infer health from signal arrival alone. Route a threshold breach or unexplained absence through
  Observability and Runtime to the earliest affected owner.

### Phase 6 — Accept Handoffs, Invalidate, and Recover

#### 6.1 Check every dynamic handoff

- Require each handoff to name:
  - subject, target, candidate-byte, application, and version identities that apply;
  - substantive owner and acceptance authority;
  - exact output and evidence class;
  - limitations and acceptance state;
  - dependencies and next owner.
- Reject a partial, stale, proxy, cosmetic, or same-name-different-byte record. Preserve the sender's literal
  output and record the identity or acceptance gap without interpreting it.
- Accept a handoff into coordination only when its named owner accepted it and every required identity
  matches the active outcome map.

#### 6.2 Invalidate from the earliest changed premise

| Change or failure | Earliest route and dependent invalidation |
|---|---|
| Installed contract or requirement changed | Reopen Contract, then affected design, source, evidence, Packaging, Release, and observation states. |
| Accepted observable or technical design changed | Reopen its owning Interface or Design record, then affected Contract reconciliation, source, and later states. |
| Source or configuration changed | Reopen Development and every dependent evidence, Packaging, Release, and observation state. |
| Testing subject, environment, test, or evidence changed | Invalidate that evidence and every acceptance or state that depended on it. |
| Candidate bytes or candidate identity changed | Return to Packaging and invalidate installed evidence, candidate acceptance, Release, and observation states. |
| Release policy, metadata, target, predecessor, or environment changed | Reopen Release evidence and readiness and every later state; unchanged candidate bytes remain a Packaging record. |
| Observed failure or missing expected signal | Route through Observability and Runtime, then reopen the earliest affected product owner and every dependent state. |

- Record the last accepted state, first failed dependency, stale records, affected identities, and exact owner
  that must replace the premise.
- Do not erase history. Mark dependent records stale so the next owner can distinguish prior acceptance from
  current acceptance.

#### 6.3 Replace the premise or stop recoverably

- Request only the replacement owner record and the dependent evidence that invalidation made stale.
- Advance forward again only after every replacement and dependent owner accepts an identity-matched record.
- When an owner fails, rejects the request, lacks an environment, or cannot reach authority, stop with:
  - the last accepted state;
  - the first failed dependency;
  - the responsible owner or authority;
  - preserved accepted and stale records;
  - the exact first resume point.
- Set `reopened` when a changed premise or failure has active replacement work. Do not call an unavailable
  prerequisite `reopened` when no owner or authority can yet act; return an explicit recoverable stop.

### Phase 7 — Maintain or Return the Requested Terminal

#### 7.1 Route maintenance

- Route changed requirements to Contract and the affected design owner. Route support evidence and Electron
  fact changes through Observability or Runtime before the affected product owner.
- Route target behavior, source, candidate, Release policy, and user evidence changes to the earliest owner
  whose accepted premise changed.
- Keep the coordination state `reopened` until replacement records and every dependent acceptance advance
  again.
- Set `maintained` only when current requirements, owner records, evidence, signals, support, and recovery are
  accepted. When release is in scope, require current post-release signals before `maintained`.

#### 7.2 Return a narrower terminal

- When the caller requested a state before full release, stop exactly at that accepted state.
- Return its identity-matched handoff, limitations, excluded later states, responsible next owner, and first
  resume point.
- Never label the result full delivery or `maintained` unless all required later prerequisites and current
  post-release inputs actually exist.

#### 7.3 Return the coordination record

- Return one record containing:
  - the complete active-owner map and owner-scoped work order;
  - the exact current state and immutable state history;
  - accepted, rejected, and stale records;
  - every subject, target, version, byte, installed, destination, and population identity;
  - installed-path coverage, including all four alternate entries and all failure cases;
  - diagnostics, evidence classes, limitations, and residual risks;
  - current authority and external-action state;
  - maintenance and recovery owners;
  - explicit exclusions and the exact first resume point.
- A full release path ends at `maintained`, `reopened`, or an explicit recoverable stop. A narrower requested
  terminal ends at its literal accepted state with no claim that full delivery occurred.
- Use [the Delivery checklist](checklists.md) to inspect the complete record. The checklist supplies
  evaluation prompts; it does not give Delivery authority to issue a verdict.

## References

Delivery may read every lower Electron owner because it coordinates their accepted records. This table lists
the static ownership order from highest lower tier to foundation.

| Tier | Owner | Unique authority used by Delivery |
|---|---|---|
| 6 | [Electron Testing](../electron-testing/SKILL.md) | Test design, execution, interpretation, environment classification, and evidence strength |
| 5 | [Electron Release](../electron-release/SKILL.md) | Release policy, readiness, and authorized external release actions |
| 4 | [Electron Packaging](../electron-packaging/SKILL.md) | Produced bytes, immutable candidate identity, and candidate acceptance |
| 3 | [Electron Observability](../electron-observability/SKILL.md) | Diagnostic emission, arrival, identity, and signal limitations |
| 3 | [Electron Development](../electron-development/SKILL.md) | Source implementation, construction, and source-check acceptance |
| 2 | [Electron Contract](../electron-contract/SKILL.md) | Installed behavior, target differences, lifecycle obligations, and safe recovery |
| 1 | [Electron Design](../electron-design/SKILL.md) | Process, trust, bridge, state, resource, performance, and isolation decisions |
| 1 | [Electron Interface](../electron-interface/SKILL.md) | Observable structure, states, content, feedback, recovery, accessibility, locale, and modality |
| 0 | [Electron Runtime](../electron-runtime/SKILL.md) | Current Electron facts and causal runtime diagnosis |

The exchanges named in the Procedure are dynamic work records. They do not create new static ownership links
or transfer a lower owner's authority to Delivery.
