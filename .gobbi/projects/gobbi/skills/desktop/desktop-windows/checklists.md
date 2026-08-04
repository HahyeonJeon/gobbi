# Desktop Windows Evaluation Checklist

This reusable unchecked source evaluates one current Windows fact result for the complete compatibility tuple
and Windows-specific fields defined by the [`desktop-windows`](SKILL.md) Manual. It checks bounded lookup and
diagnosis, not product policy, implementation, test execution, credential use, mutation, publication, or an
end-to-end development or release outcome. Its stable owner prefix is `DTWIN`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### DTWIN-SC-PROJECT-01 — Normal case: the question binds the complete common tuple

An ordinary Windows lookup names the question and every common identity or environment field that can change
the answer. The expected outcome has one exact subject; a missing application build, Windows build, artifact,
architecture, or installation field is the failure.

#### Checklist

- [ ] DTWIN-CK-PROJECT-01-01 — The tuple records the exact question and native integration or input involved.
- [ ] DTWIN-CK-PROJECT-01-02 — The tuple records the application identity, version, and build and the Electron version and build.
- [ ] DTWIN-CK-PROJECT-01-03 — The tuple records the artifact or package identity, version or digest, distribution channel, and installed state.
- [ ] DTWIN-CK-PROJECT-01-04 — The tuple records the Windows family, release, edition, and build and both application and Windows architectures.
- [ ] DTWIN-CK-PROJECT-01-05 — The tuple records the install form, user or machine scope, resolved location, and current installed version.

### DTWIN-SC-PROJECT-02 — Edge case: conditional context can change the answer

Policy, trust, isolation, emulation, or session conditions differ while the application and Windows version
appear unchanged. The expected outcome records each applicable condition and explains each inapplicable one;
an implicit environment or unexplained omission is the failure.

#### Checklist

- [ ] DTWIN-CK-PROJECT-02-01 — The tuple records the exact runtime and session environment when either can change the answer.
- [ ] DTWIN-CK-PROJECT-02-02 — The tuple records the user or privilege, applied policy, signing or trust state, and sandbox or container context when relevant.
- [ ] DTWIN-CK-PROJECT-02-03 — The Windows-specific fields record packaged or unpackaged application identity and the exact Store, MSIX, installer, portable, or package-manager path.
- [ ] DTWIN-CK-PROJECT-02-04 — The Windows-specific fields record per-user or per-machine effect, elevation and policy, native or emulated execution, and interactive or remote session conditions.
- [ ] DTWIN-CK-PROJECT-02-05 — Every common field and applicable Windows-specific field is recorded as exact, `Unknown`, or `Not applicable: <exact reason>`.

## Structure

### DTWIN-SC-STRUCTURE-01 — Normal case: the result carries the complete answer record

A completed lookup must be inspectable without private context. The expected outcome records the evidence,
one status, bounded behavior, diagnosis, next probe, limits, routes, freshness, and non-decisions; an omitted
result field is the failure.

#### Checklist

- [ ] DTWIN-CK-STRUCTURE-01-01 — The result records every source, version or release bound, date, evidence class, and collection ordinal.
- [ ] DTWIN-CK-STRUCTURE-01-02 — The result contains exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- [ ] DTWIN-CK-STRUCTURE-01-03 — The result states the exact behavior established and every bound on that behavior.
- [ ] DTWIN-CK-STRUCTURE-01-04 — The result records each relevant success, failure, rejection, absence, error, event, log, and state signal.
- [ ] DTWIN-CK-STRUCTURE-01-05 — The result names the smallest next diagnostic probe with its required authority and owner.
- [ ] DTWIN-CK-STRUCTURE-01-06 — The result records evidence limits, visible conflicts, exact owner routes, freshness or refresh conditions, and explicit non-decisions.

### DTWIN-SC-STRUCTURE-02 — Expected failure: the complete answer is unknown

An answer-changing field, current primary source, or conflict cannot be resolved. The expected outcome is an
explicit unknown with enough retained context to resume; a probable answer, hidden gap, or broadened claim is
the failure.

#### Checklist

- [ ] DTWIN-CK-STRUCTURE-02-01 — Every answer-changing `Unknown` field forces the exact outcome `Unknown for this compatibility tuple`.
- [ ] DTWIN-CK-STRUCTURE-02-02 — An unknown result preserves every competing claim and missing evidence item.
- [ ] DTWIN-CK-STRUCTURE-02-03 — An unknown result records the narrower established bounds and the required next proof.
- [ ] DTWIN-CK-STRUCTURE-02-04 — An unknown result names the owner and exact resume condition.
- [ ] DTWIN-CK-STRUCTURE-02-05 — Every tuple change starts a new evidence subject instead of altering or extending the prior result.

## Performance

Not applicable: this source assigns no latency, throughput, capacity, or resource target. It evaluates the
currency and bounds of one Windows fact result; application performance or resource behavior needs exact-tuple
evidence from its implementation and testing owners.

## Aesthetics

### DTWIN-SC-AESTHETICS-01 — Poor quality: vague words hide the subject or result

The lookup uses broad words such as platform, works, supported, or installed without the exact object and
condition. The expected outcome uses mainstream Windows and developer terms with one defined compatibility
tuple; prose that a cold developer can interpret in several ways is the failure.

#### Checklist

- [ ] DTWIN-CK-AESTHETICS-01-01 — `Compatibility tuple` is defined at first use as the exact application, artifact, Windows, and environment record that bounds one lookup.
- [ ] DTWIN-CK-AESTHETICS-01-02 — Every use of platform, support, installation, runtime, update, restart, background, trust, or native integration names the exact object, state, condition, or owner intended.
- [ ] DTWIN-CK-AESTHETICS-01-03 — Field states and outcomes use the exact Manual terms rather than synonyms, likelihood labels, or silent defaults.

## Usage

### DTWIN-SC-USAGE-01 — Normal case: direct lookup covers the Windows question inventory

A developer enters with one compatibility, installed-application, runtime, integration, location, trust, or
failure question. The expected outcome has a direct place to look and an exact interpretation limit; a
route-only answer or missing applicable question group is the failure.

#### Checklist

- [ ] DTWIN-CK-USAGE-01-01 — The Manual directly covers target and compatibility inputs plus application, Electron, artifact, package, and installed identities.
- [ ] DTWIN-CK-USAGE-01-02 — The Manual directly covers installation, first launch, update, repair, rollback facts, uninstall, residual state, and recovery facts.
- [ ] DTWIN-CK-USAGE-01-03 — The Manual directly covers launch and activation delivery, process and window lifetime, background state, close and quit facts, power and session events, and native integration.
- [ ] DTWIN-CK-USAGE-01-04 — The Manual directly covers resolved data, configuration, cache, log, temporary, document, package, resource, and credential-store locations.
- [ ] DTWIN-CK-USAGE-01-05 — The Manual directly covers Store, MSIX, installer, portable, and package-manager paths plus identity, trust, sandbox, permission, privilege, and policy facts.
- [ ] DTWIN-CK-USAGE-01-06 — The Manual directly covers process, resource, native, installer, updater, package, trust, and session failure signals and diagnostics.

### DTWIN-SC-USAGE-02 — Expected failure: one observed failure has several possible causes

An installation, activation, native integration, power/session, path, trust, or process result differs from
expectation. The expected outcome preserves the exact signal and chooses a bounded next probe; calling the
tuple unsupported or changing state before distinguishing a defect, prerequisite, and environment gap is the
failure.

#### Checklist

- [ ] DTWIN-CK-USAGE-02-01 — The diagnosis preserves the exact error, event, log, absence, or state signal with its identity and timestamp.
- [ ] DTWIN-CK-USAGE-02-02 — The diagnosis compares documented prerequisites and observed state only within the same compatibility tuple.
- [ ] DTWIN-CK-USAGE-02-03 — One failed attempt, missing prerequisite, or product defect is not reported as `Not supported` without exact evidence of unavailability.
- [ ] DTWIN-CK-USAGE-02-04 — The next probe is the smallest exact check that can distinguish the remaining causes and names its authority and owner.

## Consistency

### DTWIN-SC-CONSISTENCY-01 — Normal case: evidence follows the fixed collection order

Several evidence classes are available for the same question. The expected outcome collects them in the
Manual's order and records each class; skipping a stronger available class or silently changing the order is
the failure.

#### Checklist

- [ ] DTWIN-CK-CONSISTENCY-01-01 — Exact-version official Microsoft Windows or Electron documentation, schema, source, or release notes are collected first.
- [ ] DTWIN-CK-CONSISTENCY-01-02 — Exact Store, package-manager, package, artifact, signature, and trust metadata are collected second.
- [ ] DTWIN-CK-CONSISTENCY-01-03 — A reproducible exact-tuple observation or probe is collected third when available and authorized.
- [ ] DTWIN-CK-CONSISTENCY-01-04 — Exact project artifacts and logs are collected fourth.
- [ ] DTWIN-CK-CONSISTENCY-01-05 — Qualified secondary material is collected only fifth and only to state uncertainty or identify the next probe.

### DTWIN-SC-CONSISTENCY-02 — Rule violation: weaker or stale evidence is made conclusive

Primary evidence is absent, sources conflict, or a nearby tuple was observed, so weaker material is promoted
to a conclusion. The expected outcome keeps the gap or conflict visible and refreshes answer-changing stale
evidence; hiding it behind a confident status is the failure.

#### Checklist

- [ ] DTWIN-CK-CONSISTENCY-02-01 — Secondary material never replaces missing primary evidence for `Supported` or `Not supported`.
- [ ] DTWIN-CK-CONSISTENCY-02-02 — Every conflict remains visible in the result.
- [ ] DTWIN-CK-CONSISTENCY-02-03 — Every conflict narrows the established bounds or forces `Unknown for this compatibility tuple`.
- [ ] DTWIN-CK-CONSISTENCY-02-04 — Every observation is bounded to its exact tuple and no Windows, version, architecture, artifact, state, user, policy, trust, emulation, or session result is inferred across tuples.
- [ ] DTWIN-CK-CONSISTENCY-02-05 — Every source and observation has a date and an exact refresh condition.
- [ ] DTWIN-CK-CONSISTENCY-02-06 — Answer-changing stale evidence forces a refreshed lookup or `Unknown for this compatibility tuple`.

## Risk

### DTWIN-SC-RISK-01 — Adversarial: proxy evidence is presented as real Windows execution

Documentation, repository content, or artifact inspection is described as if an application, installer,
updater, uninstaller, native integration, runtime transition, or Windows machine ran. The expected outcome
names the evidence class and every unrun probe; any proxy-execution claim or unauthorized action is the
failure.

#### Checklist

- [ ] DTWIN-CK-RISK-01-01 — Documentation, repository, metadata, package, and artifact evidence is never described as application, installer, runtime, or Windows execution.
- [ ] DTWIN-CK-RISK-01-02 — A development run, unpacked build, source inspection, or non-throwing call never proves installed or native behavior.
- [ ] DTWIN-CK-RISK-01-03 — The result makes no product behavior, product support, implementation, software-testing, verification, or release-readiness decision.
- [ ] DTWIN-CK-RISK-01-04 — The lookup uses no credential and performs no install, update, repair, uninstall, signing, trust-store, policy, publication, or other mutation without separate authority.

### DTWIN-SC-RISK-02 — Rule violation: an adjacent result is assigned to the fact investigator

A Windows fact is used to choose product behavior, release policy, Electron implementation, or test validity.
The expected outcome routes each result to its semantic owner; the Manual deciding it or sending every concern
to one broad owner is the failure.

#### Checklist

- [ ] DTWIN-CK-RISK-02-01 — Window, activation, state, and restoration outcomes route to `desktop-architecture`; interface intent routes to `desktop-interface`; and target, artifact, update, recovery, rollback, and release judgments route to `desktop-release`.
- [ ] DTWIN-CK-RISK-02-02 — Scoped coordination routes to `desktop-development`, and trust-boundary or sensitive-data policy routes to `web-security`.
- [ ] DTWIN-CK-RISK-02-03 — Electron semantics route to `electron-runtime`, implementation to `electron-development`, evidence to `electron-testing`, and packaging, signing, install, update, uninstall, and release procedures to `electron-release`.

## Overall

### DTWIN-SC-OVERALL-01 — Normal case: one bounded result closes the lookup without overclaim

The complete tuple, evidence, outcome, diagnosis, and routes describe one current Windows fact consistently.
The expected outcome is no broader than its strongest current evidence and keeps every unproved fact visible;
an internally contradictory or adjacent-owner claim is the failure.

#### Checklist

- [ ] DTWIN-CK-OVERALL-01-01 — The tuple, evidence, outcome, behavior, diagnostic signals, next probe, limits, conflicts, routes, freshness, and non-decisions describe the same exact subject without contradiction.
- [ ] DTWIN-CK-OVERALL-01-02 — The outcome is no broader than the complete tuple and the strongest current evidence that directly applies to it.
- [ ] DTWIN-CK-OVERALL-01-03 — Every unproved or unobserved fact remains explicit and no adjacent-owner decision is presented as a Windows fact result.
