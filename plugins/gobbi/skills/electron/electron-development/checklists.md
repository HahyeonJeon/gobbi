# Electron Development Evaluation Checklist

This reusable unchecked source evaluates one bounded Electron source change implemented or reviewed under
the local operation. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `ELECDEV`.

This file defines reusable evaluation-checklist coverage for one bounded Electron source change. It defines
no test specification, evidence metadata, row result, severity, score, verdict, or remediation instruction.
Preserve every row as an unchecked binary condition.

A row is defined once beneath its owning scenario. An `Also applies` line reuses a row defined elsewhere,
carries no checkbox, and creates no second condition.

## Project

### ELECDEV-SC-PROJECT-01 — Normal case: one bounded source outcome has accepted inputs

An ordinary implementation or read-only review starts from accepted decisions, current runtime facts, and
explicit authority for one source outcome. It succeeds when those inputs are clear and the work is identified
as implementation or read-only review; it fails when the diff or reviewer must invent them.

#### Checklist

- [ ] ELECDEV-CK-PROJECT-01-01 — The subject is one bounded Electron source outcome.
- [ ] ELECDEV-CK-PROJECT-01-02 — Accepted installed contract, interface, and technical design records plus current runtime facts are identified for the affected targets.
- [ ] ELECDEV-CK-PROJECT-01-03 — Every affected process owner and trust boundary is identified.
- [ ] ELECDEV-CK-PROJECT-01-04 — Authority for source edits, security exceptions, dependencies, credentials, and scope changes is recorded where applicable.
- [ ] ELECDEV-CK-PROJECT-01-05 — The source work is labeled as implementation or read-only review.

### ELECDEV-SC-PROJECT-02 — Expected failure: an accepted input or authority is unavailable

A required lower-tier decision is missing or contradictory, or implementation lacks edit authority. It
succeeds by stopping at the earliest gap and returning it to its owner; continuing from an invented decision
is the failure.

#### Checklist

- [ ] ELECDEV-CK-PROJECT-02-01 — Implementation remains unstarted while an accepted record is missing or contradictory or required edit authority is absent.
- [ ] ELECDEV-CK-PROJECT-02-02 — The stop identifies the earliest owner and the exact decision or authority gap.
- [ ] ELECDEV-CK-PROJECT-02-03 — A failed later result returns to the earliest invalid source or decision owner.

### ELECDEV-SC-PROJECT-03 — Rule violation: a review request is used as edit authority

A source review is requested without implementation authority. It succeeds when review remains read-only;
editing or silently reclassifying the request as implementation is the Rule violation.

#### Checklist

- [ ] ELECDEV-CK-PROJECT-03-01 — A read-only review changes no source, type, schema, configuration, build, documentation, caller, or cleanup path.
- [ ] ELECDEV-CK-PROJECT-03-02 — A review request is not reclassified as implementation without explicit implementation authority.

## Structure

### ELECDEV-SC-STRUCTURE-01 — Normal case: the whole process chain is built in dependency order

A cross-process change has shared contracts and dependent process integrations. It succeeds when the whole
chain exists before details and each layer follows the accepted design; it fails when a dependent layer
defines the boundary it consumes.

#### Checklist

- [ ] ELECDEV-CK-STRUCTURE-01-01 — Applicable implementation or read-only review proceeds in this dependency order: shared application contracts and types, privileged main or utility owner, preload adapter or bridge, renderer consumer, window or view and application-lifecycle integration, operating-system integration, then configuration, build entries, documentation, callers, and cleanup.
- [ ] ELECDEV-CK-STRUCTURE-01-02 — A shared contract or type imports no runtime module restricted to one process.
- [ ] ELECDEV-CK-STRUCTURE-01-04 — Renderer source uses only web APIs and the declared preload bridge.
- [ ] ELECDEV-CK-STRUCTURE-01-05 — Each changed privileged main or utility owner is integrated at its accepted lifecycle point.
- [ ] ELECDEV-CK-STRUCTURE-01-06 — Accepted restart, teardown, and cleanup decisions are applied to the changed source.
- [ ] ELECDEV-CK-STRUCTURE-01-07 — The complete affected process and entry skeleton exists before detailed implementation or review findings.

### ELECDEV-SC-STRUCTURE-02 — Poor quality: source placement follows import convenience

The source may construct successfully while a capability sits where it was easiest to import. It succeeds
when placement follows the accepted technical design; convenience without that decision is the quality
failure.

#### Checklist

- [ ] ELECDEV-CK-STRUCTURE-02-01 — Every changed placement matches the accepted capability, trust, lifecycle, and failure-isolation decision.
- [ ] ELECDEV-CK-STRUCTURE-02-02 — No capability is placed in a process because importing it there was convenient.

### ELECDEV-SC-STRUCTURE-03 — Normal case: the affected set has a complete CRUD and 5W1H map

Source work can leave callers, build entries, documentation, or cleanup stale even when its main file is
correct. It succeeds when each affected action and dependency is known before edits; an isolated-file map is
the failure.

#### Checklist

- [ ] ELECDEV-CK-STRUCTURE-03-01 — The Create map identifies every new affected code, type or schema, configuration, build, documentation, caller, and cleanup path.
- [ ] ELECDEV-CK-STRUCTURE-03-02 — The Read map identifies every existing definition, consumer, configuration, build entry, document, and cleanup path required for consistency.
- [ ] ELECDEV-CK-STRUCTURE-03-03 — The Update map identifies every affected path whose existing content changes.
- [ ] ELECDEV-CK-STRUCTURE-03-04 — The Delete map identifies every removed or replaced path and every obsolete registration or resource that requires cleanup.
- [ ] ELECDEV-CK-STRUCTURE-03-05 — The 5W1H map states who owns the change, what changes, when it applies, where each boundary occurs, why it is required, and how it remains consistent.

## Performance

### ELECDEV-SC-PERFORMANCE-01 — Poor quality: construction omits accepted end conditions

A crossing or long-lived resource can compile without its accepted timeout, cancellation, or cleanup path.
It succeeds when source construction includes those accepted end conditions; a locally successful path that
can remain active indefinitely is the quality failure.

#### Checklist

- [ ] ELECDEV-CK-PERFORMANCE-01-01 — Every changed cross-process contract follows its accepted timeout or cancellation decision.
- [ ] ELECDEV-CK-PERFORMANCE-01-02 — Every changed subscription or long-lived resource follows its accepted disposer or cleanup decision.

## Aesthetics

### ELECDEV-SC-AESTHETICS-01 — Poor quality: the source record is hard to review

The source may be correct while its record hides paths, commands, or evidence limits. It succeeds when a
cold reviewer can trace the construction result directly; a polished summary that merges later claims is the
quality failure.

#### Checklist

- [ ] ELECDEV-CK-AESTHETICS-01-01 — Every local construction result records its exact command or inspection, subject, result, and relevant output.
- [ ] ELECDEV-CK-AESTHETICS-01-02 — Every affected code, type or schema, configuration, build, documentation, caller, and cleanup path is listed.
- [ ] ELECDEV-CK-AESTHETICS-01-03 — Construction results and later behavior or artifact claims are presented as separate states.

## Usage

### ELECDEV-SC-USAGE-01 — Normal case: implementation follows the accepted crossing contract

An implementation changes a capability across privileged and renderer processes. It succeeds when source
implements the accepted crossing without widening it; it fails when transport or a dependent consumer
silently changes the accepted contract.

#### Checklist

- [ ] ELECDEV-CK-USAGE-01-01 — Each changed preload bridge method matches its accepted application-action contract.
- [ ] ELECDEV-CK-USAGE-01-03 — Each changed renderer consumer depends only on the declared bridge contract and web APIs.
- [ ] ELECDEV-CK-USAGE-01-04 — Each accepted unavailable, rejection, cancellation, and teardown state has its required source path.

### ELECDEV-SC-USAGE-03 — Edge case: a review remains read-only

A caller requests inspection rather than implementation. It succeeds when the same affected chain is
reviewed in dependency order and receives a precise classification; source edits or an incomplete inspection
are the failure.

#### Checklist

- [ ] ELECDEV-CK-USAGE-03-01 — The review inspection set covers every path in the recorded affected set.
- [ ] ELECDEV-CK-USAGE-03-02 — The review inspects the applicable process chain in dependency order.
- [ ] ELECDEV-CK-USAGE-03-03 — The review returns `accept`, `revise`, or `reject` with exact findings, affected owners, and required handoffs.

## Consistency

### ELECDEV-SC-CONSISTENCY-01 — Normal case: all affected source surfaces agree

The change reaches source and the project surfaces that load, build, describe, call, or clean it up. It
succeeds when those surfaces describe one current result; a stale dependent surface is the failure.

#### Checklist

- [ ] ELECDEV-CK-CONSISTENCY-01-01 — Source code, public types, and runtime schemas agree after the change.
- [ ] ELECDEV-CK-CONSISTENCY-01-02 — Configuration, build entries, target resources, and resolved paths agree after the change.
- [ ] ELECDEV-CK-CONSISTENCY-01-03 — Emitted module formats and process build targets agree with current runtime facts.
- [ ] ELECDEV-CK-CONSISTENCY-01-04 — Documentation, callers, and cleanup paths agree with the final source result.

### ELECDEV-SC-CONSISTENCY-02 — Rule violation: development claims a higher owner's work

Construction work may make later behavior or artifact needs visible. It succeeds by recording dynamic
handoffs while leaving those outcomes with their owners; performing or accepting that work in development is
the Rule violation.

#### Checklist

- [ ] ELECDEV-CK-CONSISTENCY-02-01 — Development performs no package construction, candidate acceptance, release, publication, or rollout work.
- [ ] ELECDEV-CK-CONSISTENCY-02-03 — Development performs no test design, execution, interpretation, environment classification, evidence creation, or evidence acceptance.
- [ ] ELECDEV-CK-CONSISTENCY-02-04 — Development claims no diagnostic-emission outcome or complete-delivery outcome.
- [ ] ELECDEV-CK-CONSISTENCY-02-05 — Static sibling references are limited to `electron-contract`, `electron-interface`, `electron-design`, and `electron-runtime`.

## Risk

### ELECDEV-SC-RISK-02 — Adversarial: a construction failure is hidden to make the source pass

A security decision, required target, or reported error blocks local construction. It succeeds when those
constraints remain visible; weakening, skipping, or silencing one to obtain a passing result is the
adversarial failure.

#### Checklist

- [ ] ELECDEV-CK-RISK-02-03 — No accepted security decision is weakened to make a construction check pass.
- [ ] ELECDEV-CK-RISK-02-04 — No required target is skipped to make a construction check pass.
- [ ] ELECDEV-CK-RISK-02-05 — No construction error is silenced to make a construction check pass.

### ELECDEV-SC-RISK-03 — Expected failure: a bounded construction check fails

A formatting, lint, type, build, emitted-entry, or static consistency check fails. It succeeds when the
earliest bounded cause is repaired or returned as an exact review finding; treating the symptom or an unrun
check as complete is the failure.

#### Checklist

- [ ] ELECDEV-CK-RISK-03-01 — The diagnosis identifies the earliest source, process, loader, lifecycle, configuration, or build boundary that explains the failure.
- [ ] ELECDEV-CK-RISK-03-02 — An implementation repair changes only the bounded source cause.
- [ ] ELECDEV-CK-RISK-03-03 — A failed or unrun construction check is not reported as complete.
- [ ] ELECDEV-CK-RISK-03-04 — An implementation repair repeats every affected construction check.

## Overall

### ELECDEV-SC-OVERALL-01 — Normal case: completion stops at a construction-verified source result

The affected source and required construction checks are complete. It succeeds when development closes at
that exact state with complete dynamic records; a missing in-scope path, failure case, or handoff is the
failure.

#### Checklist

- [ ] ELECDEV-CK-OVERALL-01-03 — Completion is not claimed while an in-scope path, process-chain link, failure case, construction check, or required handoff remains incomplete.
- [ ] ELECDEV-CK-OVERALL-01-04 — The terminal development state is exactly `construction-verified`.
- [ ] ELECDEV-CK-OVERALL-01-05 — The dynamic Development → testing record contains the source commit or digest, accepted behavior claims, process and entry map, targets, invalid and failure cases, required environments, local construction results, and the request for the lowest-cost test layer that can observe each behavior.
- [ ] ELECDEV-CK-OVERALL-01-06 — When artifact claims may change, the dynamic verified source outcome → packaging record contains the source commit or digest, build inputs, targets, process entries, resources, compiled-module assumptions, preload assumptions, path assumptions, and requested artifact claims.
- Also applies: ELECDEV-CK-STRUCTURE-01-01 (dependency order).
- Also applies: ELECDEV-CK-PROJECT-02-03 (later failure returns to the earliest owner).

### ELECDEV-SC-OVERALL-02 — Adversarial: construction success is presented as later proof

A clean static result is offered as proof of runtime behavior or an artifact claim. It succeeds when every
result stays inside the state it establishes; advancing to behavior, package, candidate, or release state is
the adversarial failure.

#### Checklist

- [ ] ELECDEV-CK-OVERALL-02-01 — No construction result is treated as proof of runtime behavior.
- [ ] ELECDEV-CK-OVERALL-02-03 — A build or emitted-entry inspection is not treated as proof of packaged behavior, candidate acceptance, or release readiness.
- Also applies: ELECDEV-CK-CONSISTENCY-02-03 (Testing-owned evidence creation and acceptance remain outside Development).
