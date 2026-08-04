# TypeScript Packaging Release Evaluation Checklist

This reusable unchecked source evaluates release readiness, authority, failure handling, and final archive
traceability for one package produced or validated under this operation. It is governed by the
[`typescript`](../SKILL.md) domain and [`typescript-packaging`](SKILL.md) operation. The
[base package checklist](checklists.md) separately evaluates package definition, structure, performance,
aesthetics, installed-consumer usage, and compatibility claims. The source commit that contains this file
identifies the checklist version. Its stable checklist prefix is `TSPKG`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

Not applicable: This source is bound to release readiness and traceability; task mode, supported consumers,
public entries, and publication authority identification remain in the [base package checklist](checklists.md).

## Structure

Not applicable: This source is bound to release readiness and traceability; export, declaration, dependency,
and archive-path structure remain in the [base package checklist](checklists.md).

## Performance

Not applicable: This source is bound to release readiness and traceability; duplicate-package identity and
archive-size scenarios remain in the [base package checklist](checklists.md).

## Aesthetics

Not applicable: This source is bound to release readiness and traceability; declaration readability remains
in the [base package checklist](checklists.md).

## Usage

### TSPKG-SC-USAGE-03 — Normal case: release authority receives the complete evidence bundle

The person or automation authorized to release decides from the proposed version, its compatibility effect,
the archive contents, current verification, and the method-specific recovery path. The expected outcome
presents that complete bundle to the authorized release actor. An omitted item or a different recipient is the
failure.

#### Checklist

- [ ] TSPKG-CK-USAGE-03-01 — The version, compatibility classification, archive contents, verification results, and method-specific recovery plan are presented to the person or automation authorized to release.

### TSPKG-SC-USAGE-04 — Normal case: method-specific recovery is prepared before publication

Registries, package managers, and release methods permit different recovery actions. The expected outcome
classifies an obligation as rehearsable only when an authorized isolated or staging boundary provides the
selected method and required capabilities without changing live registry or consumer state. It rehearses
every such obligation and records the exact block and operator path for the rest. A universal rollback claim
or a claimed rehearsal of an unrehearsable action is the failure.

#### Checklist

- [ ] TSPKG-CK-USAGE-04-01 — The selected registry, package manager, and release method are recorded.
- [ ] TSPKG-CK-USAGE-04-02 — The recovery plan records only actions the selected method actually permits.
- [ ] TSPKG-CK-USAGE-04-03 — A recovery obligation is classified as rehearsable only when an authorized isolated or staging boundary provides the selected method and required capabilities without changing live registry or consumer state.
- [ ] TSPKG-CK-USAGE-04-04 — Every recovery obligation classified as rehearsable is rehearsed before publication.
- [ ] TSPKG-CK-USAGE-04-05 — Recovery rehearsal verifies the recorded prior and intended consumer states.
- [ ] TSPKG-CK-USAGE-04-06 — Every unrehearsable or irreversible recovery action records its exact blocking condition and validated operator path without a rehearsal claim.

## Consistency

### TSPKG-SC-CONSISTENCY-02 — Normal case: the API change is classified and carried into the documents

A release changes the public exports, declarations, or runtime behavior, and consumers learn about it from the classification and the notes. The
expected outcome compares those public elements with the prior released API, classifies what changed, and updates
the consumer documents. An unclassified or undocumented change is the failure.

#### Checklist

- [ ] TSPKG-CK-CONSISTENCY-02-01 — The public exports and declarations are compared with the prior released API.
- [ ] TSPKG-CK-CONSISTENCY-02-02 — Additions, deprecations, removals, behavioral changes, and minimum-toolchain changes are classified.
- [ ] TSPKG-CK-CONSISTENCY-02-03 — Consumer documentation and release notes are updated for the classified change.

## Risk

### TSPKG-SC-RISK-01 — Rule violation: publication without classification and authority

Publishing is irreversible for consumers, and a compatibility statement changes what they may rely on. The
expected outcome classifies the change, obtains release authority, and publishes only through the authorized
workflow. Publishing outside that path, or without the classification, breaks the Rule.

#### Checklist

- [ ] TSPKG-CK-RISK-01-01 — Public API changes are classified before publishing or changing a compatibility statement.
- [ ] TSPKG-CK-RISK-01-02 — Release authority is obtained before publishing or changing a compatibility statement.
- [ ] TSPKG-CK-RISK-01-03 — Publication happens only through the repository's authorized release workflow.
- [ ] TSPKG-CK-RISK-01-04 — Registry metadata and installation are verified after publication, or the task stops at a publication-ready archive when publication is not authorized.

### TSPKG-SC-RISK-02 — Normal case: the archive contains exactly what it should

What is packed is what consumers receive, including anything the working tree left behind. The expected
outcome builds cleanly, inspects the inventory for missing generated files and unwanted source or secrets, and has
defined its checks before building. Discovering the contents after publication is the failure.

#### Checklist

- [ ] TSPKG-CK-RISK-02-01 — The build runs clean without relying on stale output.
- [ ] TSPKG-CK-RISK-02-02 — The archive inventory is inspected for missing generated files and for unwanted source or secrets.
- [ ] TSPKG-CK-RISK-02-03 — Archive-content, installation, runtime, and method-specific recovery checks are defined before building.

### TSPKG-SC-RISK-03 — Expected failure: a required package check fails

A pre-publication build, declaration, metadata, consumer, or final-check failure must keep the archive
unpublished. A publication or post-publication failure must become a release-authority incident. The expected
outcome repairs and recreates an unpublished archive or follows only the authorized recovery path permitted by
the selected release method after publication. Silent publication, universal rollback, or republishing is the
failure.

#### Checklist

- [ ] TSPKG-CK-RISK-03-01 — An archive with any failed pre-publication check remains unpublished.
- [ ] TSPKG-CK-RISK-03-02 — A repaired package returns to release authority only as a recreated archive that passes every affected final check.
- [ ] TSPKG-CK-RISK-03-03 — Failure evidence is preserved before a publication or post-publication recovery action changes registry state.
- [ ] TSPKG-CK-RISK-03-04 — Recovery executes only the authorized path permitted by the selected registry, package manager, and release method.
- [ ] TSPKG-CK-RISK-03-05 — Recovery verification confirms current registry metadata.
- [ ] TSPKG-CK-RISK-03-06 — Recovery verification confirms the applicable tag, deprecation, withdrawal, or corrective-version state.

### TSPKG-SC-RISK-04 — Expected failure: registry recovery does not restore a verified consumer path

A method-specific registry action can complete while fresh consumers still receive the failed version or
cannot install the intended version. The expected outcome verifies a fresh installation and keeps existing
consumer effects separate. Calling the incident recovered without those results is the failure.

#### Checklist

- [ ] TSPKG-CK-RISK-04-01 — A fresh consumer installation verifies the post-recovery registry state.
- [ ] TSPKG-CK-RISK-04-02 — Effects on existing consumers are recorded separately from the fresh consumer installation result.

## Overall

### TSPKG-SC-OVERALL-01 — Normal case: every result belongs to the package archive being proposed

Command results collected across a long package run can come from several builds. The expected outcome rebuilds from
the accepted tree, re-runs the required checks, and binds every result to the exact archive being proposed. A
result carried over from an earlier archive is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-01-01 — The build output is rebuilt from the accepted tree.
- [ ] TSPKG-CK-OVERALL-01-02 — The archive is recreated from that rebuilt output.
- [ ] TSPKG-CK-OVERALL-01-03 — The repository's required package metadata, declaration, consumer, license, provenance, and vulnerability checks are re-run.
- [ ] TSPKG-CK-OVERALL-01-04 — Every command result is bound to the exact archive digest or contents being proposed.

### TSPKG-SC-OVERALL-02 — Expected failure: a claimed named runtime, consumer, or check cannot be run here

An isolated consumer, a named runtime, or a required check is unavailable in this environment, so part of the
claimed behavior cannot be exercised. The expected outcome withdraws or marks the affected claim and reports the
limit. Presenting the remaining command results as complete is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-02-01 — Every claim whose required command could not be run is withdrawn or reported as unverified.
- [ ] TSPKG-CK-OVERALL-02-02 — Unavailable named runtimes, consumers, and checks are reported with the findings as limitations.

### TSPKG-SC-OVERALL-03 — Expected failure: method-specific recovery evidence remains incomplete

An operator action alone does not close a package incident. The expected outcome keeps the incident open until
the selected method's registry state and fresh consumer path both pass. Closing it from an action log is the
failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-03-01 — The release-authority incident remains open until every required method-specific recovery result passes.
