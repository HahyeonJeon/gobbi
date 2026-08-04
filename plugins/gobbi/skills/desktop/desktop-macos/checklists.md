# Desktop macOS Evaluation Checklist

This reusable unchecked source evaluates one current macOS fact result for the complete compatibility tuple
and macOS-specific fields defined by the [`desktop-macos`](SKILL.md) Manual. It checks bounded lookup and
diagnosis, not product policy, implementation, test execution, credential use, mutation, publication, or an
end-to-end development or release outcome. Its stable owner prefix is `DTMAC`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### DTMAC-SC-PROJECT-01 — Normal case: the question binds the complete common tuple

An ordinary macOS lookup names the question and every common identity or environment field that can change
the answer. The expected outcome has one exact subject; a missing application build, macOS build, artifact,
architecture, or installation field is the failure.

#### Checklist

- [ ] DTMAC-CK-PROJECT-01-01 — The tuple records the exact question and native integration or input involved.
- [ ] DTMAC-CK-PROJECT-01-02 — The tuple records the application identity, version, and build and the Electron version and build.
- [ ] DTMAC-CK-PROJECT-01-03 — The tuple records the artifact or package identity, version or digest, distribution channel, and installed state.
- [ ] DTMAC-CK-PROJECT-01-04 — The tuple records the macOS family, exact release, build, application architecture, and macOS architecture.
- [ ] DTMAC-CK-PROJECT-01-05 — The tuple records the install form, user or managed scope, resolved location, and current installed version.

### DTMAC-SC-PROJECT-02 — Edge case: conditional context can change the answer

The macOS distribution, bundle, trust, isolation, architecture, Electron build, policy, or session conditions
differ while the application appears unchanged. The expected outcome records each applicable condition and
explains each inapplicable one; an implicit environment or unexplained omission is the failure.

#### Checklist

- [ ] DTMAC-CK-PROJECT-02-01 — The tuple records the exact runtime and login-session environment when either can change the answer.
- [ ] DTMAC-CK-PROJECT-02-02 — The tuple records the user or privilege, applied policy, signing or trust state, and sandbox or container context when relevant.
- [ ] DTMAC-CK-PROJECT-02-03 — The macOS-specific fields record the exact macOS build, distribution path, bundle identifier, short version, build version, installed application name, and resolved bundle location.
- [ ] DTMAC-CK-PROJECT-02-04 — The macOS-specific fields record code-signing, notarization, quarantine, Gatekeeper, App Sandbox, entitlements, app-container or app-group, native or Rosetta execution, universal-binary slices, and Electron `darwin` or `mas` conditions.
- [ ] DTMAC-CK-PROJECT-02-05 — Every common field and applicable macOS-specific field is recorded as exact, `Unknown`, or `Not applicable: <exact reason>`.

## Structure

### DTMAC-SC-STRUCTURE-01 — Normal case: the result carries the complete answer record

A completed lookup must be inspectable without private context. The expected outcome records the evidence,
one status, bounded behavior, diagnosis, next probe, limits, routes, freshness, and non-decisions; an omitted
result field is the failure.

#### Checklist

- [ ] DTMAC-CK-STRUCTURE-01-01 — The result records every source, version or release bound, date, evidence class, and collection ordinal.
- [ ] DTMAC-CK-STRUCTURE-01-02 — The result contains exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- [ ] DTMAC-CK-STRUCTURE-01-03 — The result states the exact behavior established and every bound on that behavior.
- [ ] DTMAC-CK-STRUCTURE-01-04 — The result records each relevant success, failure, rejection, absence, error, event, log, and state signal.
- [ ] DTMAC-CK-STRUCTURE-01-05 — The result names the smallest next diagnostic probe with its required authority and owner.
- [ ] DTMAC-CK-STRUCTURE-01-06 — The result records evidence limits, visible conflicts, exact owner routes, freshness or refresh conditions, and explicit non-decisions.

### DTMAC-SC-STRUCTURE-02 — Expected failure: the complete answer is unknown

An answer-changing field, current primary source, or conflict cannot be resolved. The expected outcome is an
explicit unknown with enough retained context to resume; a probable answer, hidden gap, or broadened claim is
the failure.

#### Checklist

- [ ] DTMAC-CK-STRUCTURE-02-01 — Every answer-changing `Unknown` field forces the exact outcome `Unknown for this compatibility tuple`.
- [ ] DTMAC-CK-STRUCTURE-02-02 — An unknown result preserves every competing claim and missing evidence item.
- [ ] DTMAC-CK-STRUCTURE-02-03 — An unknown result records the narrower established bounds and the required next proof.
- [ ] DTMAC-CK-STRUCTURE-02-04 — An unknown result names the owner and exact resume condition.
- [ ] DTMAC-CK-STRUCTURE-02-05 — Every tuple change starts a new evidence subject instead of altering or extending the prior result.

## Performance

Not applicable: this source assigns no latency, throughput, capacity, or resource target. It evaluates the
currency and bounds of one macOS fact result; application performance or resource behavior needs exact-tuple
evidence from its implementation and testing owners.

## Aesthetics

### DTMAC-SC-AESTHETICS-01 — Poor quality: vague words hide the subject or result

The lookup uses broad words such as platform, works, supported, installed, signed, or sandboxed without the
exact object and condition. The expected outcome uses mainstream macOS and developer terms with one defined
compatibility tuple; prose that a cold developer can interpret in several ways is the failure.

#### Checklist

- [ ] DTMAC-CK-AESTHETICS-01-01 — `Compatibility tuple` is defined at first use as the exact application, artifact, macOS, and environment record that bounds one lookup.
- [ ] DTMAC-CK-AESTHETICS-01-02 — Every use of platform, support, installation, runtime, update, restart, background, trust, sandbox, container, or native integration names the exact object, state, condition, or owner intended.
- [ ] DTMAC-CK-AESTHETICS-01-03 — Field states and outcomes use the exact Manual terms rather than synonyms, likelihood labels, or silent defaults.

## Usage

### DTMAC-SC-USAGE-01 — Normal case: direct lookup covers the macOS question inventory

A developer enters with one compatibility, installed-application, runtime, integration, location, trust, or
failure question. The expected outcome has a direct place to look and an exact interpretation limit; a
route-only answer or missing applicable question group is the failure.

#### Checklist

- [ ] DTMAC-CK-USAGE-01-01 — The Manual directly covers target and compatibility inputs plus application, Electron, artifact, package, bundle, and installed identities.
- [ ] DTMAC-CK-USAGE-01-02 — The Manual directly covers installation, first launch, update, repair, rollback facts, uninstall, residual state, and recovery facts.
- [ ] DTMAC-CK-USAGE-01-03 — The Manual directly covers launch and activation delivery, process and window lifetime, background state, close and quit facts, power and session events, and native integration.
- [ ] DTMAC-CK-USAGE-01-04 — The Manual directly covers resolved application, data, configuration, cache, log, temporary, document, bundle, package, resource, and Keychain locations.
- [ ] DTMAC-CK-USAGE-01-05 — The Manual directly covers application bundles, installer packages, disk images, archives, the Mac App Store, and named updater paths plus signing, notarization, quarantine, Gatekeeper, App Sandbox, entitlements, app containers, Rosetta, permission, privilege, and policy facts.
- [ ] DTMAC-CK-USAGE-01-06 — The Manual directly covers process, resource, native, installer, updater, package, signing, notarization, Gatekeeper, sandbox, entitlement, container, Rosetta, trust, and session failure signals and diagnostics.

### DTMAC-SC-USAGE-02 — Expected failure: one observed failure has several possible causes

An installation, activation, native integration, power/session, path, trust, sandbox, or process result differs
from expectation. The expected outcome preserves the exact signal and chooses a bounded next probe; calling
the tuple unsupported or changing state before distinguishing a defect, prerequisite, and environment gap is
the failure.

#### Checklist

- [ ] DTMAC-CK-USAGE-02-01 — The diagnosis preserves the exact error, event, log, absence, or state signal with its identity and timestamp.
- [ ] DTMAC-CK-USAGE-02-02 — The diagnosis compares documented prerequisites and observed state only within the same compatibility tuple.
- [ ] DTMAC-CK-USAGE-02-03 — One failed attempt, missing prerequisite, or product defect is not reported as `Not supported` without exact evidence of unavailability.
- [ ] DTMAC-CK-USAGE-02-05 — The next probe distinguishes the remaining causes.
- Also applies: DTMAC-CK-STRUCTURE-01-05 (smallest probe, authority, and owner).

## Consistency

### DTMAC-SC-CONSISTENCY-01 — Normal case: evidence follows the fixed collection order

Several evidence classes are available for the same question. The expected outcome collects them in the
Manual's order and records each class; skipping a stronger available class or silently changing the order is
the failure.

#### Checklist

- [ ] DTMAC-CK-CONSISTENCY-01-01 — Exact-version official Apple macOS or Electron documentation, schema, source, or release notes are collected first.
- [ ] DTMAC-CK-CONSISTENCY-01-02 — Exact Mac App Store, package, artifact, signature, notarization, and trust metadata is collected second.
- [ ] DTMAC-CK-CONSISTENCY-01-03 — A reproducible exact-tuple observation or probe is collected third when available and authorized.
- [ ] DTMAC-CK-CONSISTENCY-01-04 — Exact project artifacts and logs are collected fourth.
- [ ] DTMAC-CK-CONSISTENCY-01-05 — Qualified secondary material is collected only fifth and only to state uncertainty or identify the next probe.

### DTMAC-SC-CONSISTENCY-02 — Rule violation: weaker or stale evidence is made conclusive

Primary evidence is absent, inaccessible, or insufficient, sources conflict, or a nearby tuple was observed,
so weaker material is promoted to a conclusion. The expected outcome keeps the gap or conflict visible and
refreshes answer-changing stale evidence; hiding it behind a confident status is the failure.

#### Checklist

- [ ] DTMAC-CK-CONSISTENCY-02-01 — Secondary material never replaces missing, inaccessible, or insufficient primary evidence for `Supported` or `Not supported`.
- [ ] DTMAC-CK-CONSISTENCY-02-02 — Every conflict remains visible in the result.
- [ ] DTMAC-CK-CONSISTENCY-02-03 — Every conflict narrows the established bounds or forces `Unknown for this compatibility tuple`.
- [ ] DTMAC-CK-CONSISTENCY-02-04 — Every observation is bounded to its exact tuple and no macOS, version, build, architecture, artifact, distribution, state, user, policy, trust, sandbox, container, Rosetta, or session result is inferred across tuples.
- [ ] DTMAC-CK-CONSISTENCY-02-05 — Every source and observation has a date and an exact refresh condition.
- [ ] DTMAC-CK-CONSISTENCY-02-06 — Answer-changing stale evidence forces a refreshed lookup or `Unknown for this compatibility tuple`.

## Risk

### DTMAC-SC-RISK-01 — Adversarial: proxy evidence is presented as real macOS execution

Documentation, repository content, or artifact inspection is described as if an application, installer,
updater, uninstaller, native integration, runtime transition, or Mac ran. The expected outcome names the
evidence class and every unrun probe; any proxy-execution claim or unauthorized action is the failure.

#### Checklist

- [ ] DTMAC-CK-RISK-01-01 — Documentation, repository, metadata, bundle, package, and artifact evidence is never described as application, installer, runtime, or macOS execution.
- [ ] DTMAC-CK-RISK-01-02 — A development run, unpacked build, source inspection, or non-throwing call never proves installed or native behavior.
- [ ] DTMAC-CK-RISK-01-04 — The result states exactly `Exact-tuple probe not run` when no application, installer, updater, uninstaller, runtime transition, native integration, or macOS behavior was actually observed.
- [ ] DTMAC-CK-RISK-01-05 — The lookup uses no credential and performs no install, update, repair, uninstall, signing, notarization, trust-store, entitlement, policy, publication, or other mutation.

### DTMAC-SC-RISK-02 — Rule violation: an adjacent result is assigned to the fact investigator

A macOS fact is used to choose product behavior, release policy, Electron implementation, or test validity.
The expected outcome routes each result to its semantic owner; the Manual deciding it or sending every concern
to one broad owner is the failure.

#### Checklist

- [ ] DTMAC-CK-RISK-02-01 — Window, activation, state, and restoration outcomes route to `desktop-architecture`; interface intent routes to `desktop-interface`; and target, artifact, update, recovery, rollback, and release judgments route to `desktop-release`.
- [ ] DTMAC-CK-RISK-02-02 — Scoped coordination routes to `desktop-development`, and trust-boundary or sensitive-data policy routes to `web-security`.
- [ ] DTMAC-CK-RISK-02-03 — Electron semantics route to `electron-runtime`, implementation to `electron-development`, evidence to `electron-testing`, and packaging, signing, notarization, install, update, uninstall, and release procedures to `electron-release`.

## Overall

### DTMAC-SC-OVERALL-01 — Normal case: one bounded result closes the lookup without overclaim

The complete tuple, evidence, outcome, diagnosis, and routes describe one current macOS fact consistently.
The expected outcome is no broader than its strongest current evidence and keeps every unproved fact visible;
an internally contradictory or adjacent-owner claim is the failure.

#### Checklist

- [ ] DTMAC-CK-OVERALL-01-01 — The tuple, evidence, outcome, behavior, diagnostic signals, next probe, limits, conflicts, routes, freshness, and non-decisions describe the same exact subject without contradiction.
- [ ] DTMAC-CK-OVERALL-01-02 — The outcome is no broader than the complete tuple and the strongest current evidence that directly applies to it.
- [ ] DTMAC-CK-OVERALL-01-04 — Every unproved or unobserved fact remains explicit.
- Also applies: DTMAC-CK-STRUCTURE-01-06 (adjacent-owner decision boundary).
