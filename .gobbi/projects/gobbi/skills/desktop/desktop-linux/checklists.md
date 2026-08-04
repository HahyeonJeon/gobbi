# Desktop Linux Evaluation Checklist

This reusable unchecked source evaluates one current Linux fact result for the complete compatibility tuple
and Linux-specific fields defined by the [`desktop-linux`](SKILL.md) Manual. It checks bounded lookup and
diagnosis, not product policy, implementation, test execution, credential use, mutation, publication, or an
end-to-end development or release outcome. Its stable owner prefix is `DTLNX`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### DTLNX-SC-PROJECT-01 — Normal case: the question binds the complete common tuple

An ordinary Linux lookup names the question and every common identity or environment field that can change
the answer. The expected outcome has one exact subject; a missing application build, distribution release,
artifact, architecture, installation, runtime, or authority field is the failure.

#### Checklist

- [ ] DTLNX-CK-PROJECT-01-01 — The tuple records the exact question and native integration or input involved.
- [ ] DTLNX-CK-PROJECT-01-02 — The tuple records the application identity, version, and build and the Electron version and build.
- [ ] DTLNX-CK-PROJECT-01-03 — The tuple records the artifact or package identity, version or digest, distribution channel, and installed state.
- [ ] DTLNX-CK-PROJECT-01-04 — The tuple records the Linux family, exact distribution and release, answer-changing build or image, application architecture, and operating-system architecture.
- [ ] DTLNX-CK-PROJECT-01-05 — The tuple records the install form, scope, resolved location, current installed version, answer-changing runtime or session, and relevant user, privilege, policy, trust, signing, sandbox, or container context.

### DTLNX-SC-PROJECT-02 — Edge case: one Linux discriminator changes the answer

The distribution, package, desktop, session, portal, keyring, security, architecture, kernel, C library, or
Electron conditions differ while the application appears unchanged. The expected outcome records every
applicable discriminator and explains each inapplicable one; an implicit Linux variant is the failure.

#### Checklist

- [ ] DTLNX-CK-PROJECT-02-01 — The Linux-specific fields record the distribution name, exact release or version, build or image, and official support source.
- [ ] DTLNX-CK-PROJECT-02-02 — The Linux-specific fields record the distribution path, package or application ID, version or revision, digest when available, install scope and location, repository or remote, channel or branch, installed state, and update owner.
- [ ] DTLNX-CK-PROJECT-02-03 — The Linux-specific fields record the desktop environment and version, X11 or Wayland display protocol, exact X display server or Wayland compositor and version, login or user session kind, and relevant session state.
- [ ] DTLNX-CK-PROJECT-02-04 — The Linux-specific fields record XDG Desktop Portal use, version, selected backend, interface and interface version, permission and result, plus keyring or Secret Service implementation, session availability, Electron `safeStorage` provider or backend, and protection result.
- [ ] DTLNX-CK-PROJECT-02-05 — The Linux-specific fields record the sandbox, container, confinement, permissions, interfaces, exact security profile or policy, application/package/operating-system architectures, emulation or translation, kernel release, C library implementation and version, and answer-changing Electron Linux behavior.

## Structure

### DTLNX-SC-STRUCTURE-01 — Normal case: the result carries the complete answer record

A completed lookup must be inspectable without private context. The expected outcome records the evidence,
one status, bounded behavior, diagnosis, next probe, limits, routes, freshness, and non-decisions; an omitted
result field is the failure.

#### Checklist

- [ ] DTLNX-CK-STRUCTURE-01-01 — The result records every source, version or release bound, date, evidence class, collection ordinal, and exact observation that occurred.
- [ ] DTLNX-CK-STRUCTURE-01-02 — The result contains exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- [ ] DTLNX-CK-STRUCTURE-01-03 — The result states the exact behavior established and every bound on that behavior.
- [ ] DTLNX-CK-STRUCTURE-01-04 — The result records each relevant success, failure, rejection, absence, error, event, log, and state signal.
- [ ] DTLNX-CK-STRUCTURE-01-05 — The result names the smallest next diagnostic probe with its required authority and owner.
- [ ] DTLNX-CK-STRUCTURE-01-06 — The result records evidence limits, visible conflicts, exact owner routes, freshness or refresh conditions, and explicit non-decisions.

### DTLNX-SC-STRUCTURE-02 — Expected failure: the complete answer is unknown

An answer-changing tuple field, Linux discriminator, current primary source, or conflict cannot be resolved.
The expected outcome is an explicit unknown with enough retained context to resume; a probable answer, hidden
gap, or broadened claim is the failure.

#### Checklist

- [ ] DTLNX-CK-STRUCTURE-02-01 — Every common and applicable Linux-specific field is recorded as exact, `Unknown`, or `Not applicable: <exact reason>`.
- [ ] DTLNX-CK-STRUCTURE-02-02 — Every answer-changing `Unknown` forces `Unknown for this compatibility tuple`.
- [ ] DTLNX-CK-STRUCTURE-02-03 — An unknown result preserves every competing claim and missing, inaccessible, or insufficient evidence item.
- [ ] DTLNX-CK-STRUCTURE-02-04 — An unknown result records the narrower established bounds, required next proof, owner, and exact resume condition.
- [ ] DTLNX-CK-STRUCTURE-02-05 — Every common-field or Linux-discriminator change starts a new evidence subject instead of altering or extending the prior result.

## Performance

Not applicable: this source assigns no latency, throughput, capacity, or resource target. It evaluates the
currency and bounds of one Linux fact result; application performance or resource behavior needs exact-tuple
evidence from its implementation and testing owners.

## Aesthetics

### DTLNX-SC-AESTHETICS-01 — Poor quality: vague words hide the Linux subject or result

The lookup uses broad words such as platform, environment, package, works, supported, installed, secure, or
sandboxed without the exact object and condition. The expected outcome uses mainstream Linux and developer
terms with one defined compatibility tuple; prose that a cold developer can interpret several ways is the
failure.

#### Checklist

- [ ] DTLNX-CK-AESTHETICS-01-01 — `Compatibility tuple` is defined at first use as the exact application, artifact, Linux distribution, and environment record that bounds one lookup.
- [ ] DTLNX-CK-AESTHETICS-01-02 — The result distinguishes distribution, repository, package, bundle, container, installer, package manager, desktop environment, display protocol, display server, compositor, session, portal, keyring, sandbox, confinement, security profile, kernel, and C library.
- [ ] DTLNX-CK-AESTHETICS-01-03 — Every use of `platform`, `environment`, `package`, `works`, `supported`, `installed`, `secure`, or `sandboxed` names its exact object, state, condition, or owner.
- Also applies: DTLNX-CK-STRUCTURE-02-01 (exact field states).
- Also applies: DTLNX-CK-STRUCTURE-01-02 (exact outcome terms).

## Usage

### DTLNX-SC-USAGE-01 — Normal case: direct lookup covers the Linux question inventory

A developer enters with one compatibility, installed-application, runtime, integration, location, trust, or
failure question. The expected outcome has a direct place to look and an exact interpretation limit; a
route-only answer or missing applicable question group is the failure.

#### Checklist

- [ ] DTLNX-CK-USAGE-01-01 — The Manual directly covers target and compatibility inputs plus application, Electron, artifact, repository, package, bundle, container, and installed identities.
- [ ] DTLNX-CK-USAGE-01-02 — The Manual directly covers installation, first launch, update, repair, rollback facts, uninstall, residual state, and recovery facts.
- [ ] DTLNX-CK-USAGE-01-03 — The Manual directly covers launch and activation input, process and window lifetime, background state, close and quit facts, power and session events, and native integration.
- [ ] DTLNX-CK-USAGE-01-04 — The Manual directly covers resolved XDG and Electron data, configuration, cache, state, runtime, log, temporary, document, package, resource, portal-document, keyring, and credential-store locations.
- [ ] DTLNX-CK-USAGE-01-05 — The Manual directly covers named distribution repositories and package managers, Flatpak, Snap, AppImage, other exact bundles, containers, archives, or installers, plus portal, keyring, signature, trust, sandbox, confinement, permission, security-profile, identity, privilege, and policy facts.
- [ ] DTLNX-CK-USAGE-01-06 — The Manual directly covers process, resource, native, repository, package-manager, installer, updater, portal, keyring, trust, sandbox, security-profile, architecture, kernel, C-library, Electron, and session failure signals and diagnostics.

### DTLNX-SC-USAGE-02 — Expected failure: one observed failure has several possible causes

An installation, activation, native integration, power/session, path, portal, keyring, security, or process
result differs from expectation. The expected outcome preserves the exact signal and chooses a bounded next
probe; calling the tuple unsupported or changing state before distinguishing a defect, prerequisite, and
environment gap is the failure.

#### Checklist

- [ ] DTLNX-CK-USAGE-02-01 — The diagnosis preserves the exact error, event, log, absence, or state signal with its identity and timestamp.
- [ ] DTLNX-CK-USAGE-02-02 — The diagnosis compares documented prerequisites and observed state only within the same compatibility tuple.
- [ ] DTLNX-CK-USAGE-02-03 — One failed attempt, missing prerequisite, package defect, product defect, or environment gap is not reported as `Not supported` without exact evidence of unavailability.
- [ ] DTLNX-CK-USAGE-02-04 — The next probe distinguishes the remaining causes.
- Also applies: DTLNX-CK-STRUCTURE-01-05 (smallest probe, authority, and owner).

## Consistency

### DTLNX-SC-CONSISTENCY-01 — Normal case: evidence follows the fixed collection order

Several evidence classes are available for the same question. The expected outcome collects them in the
Manual's order and records each class; skipping a stronger available class or silently changing the order is
the failure.

#### Checklist

- [ ] DTLNX-CK-CONSISTENCY-01-01 — Exact-version official Linux distribution or project, or Electron, documentation, schema, source, or release notes are collected first.
- [ ] DTLNX-CK-CONSISTENCY-01-02 — Exact repository, package-manager, package, bundle or container, artifact, signature, and trust metadata is collected second.
- [ ] DTLNX-CK-CONSISTENCY-01-03 — A reproducible exact-tuple observation or probe is collected third when available and authorized.
- [ ] DTLNX-CK-CONSISTENCY-01-04 — Exact project artifacts and logs are collected fourth.
- [ ] DTLNX-CK-CONSISTENCY-01-05 — Qualified secondary material is collected fifth.

### DTLNX-SC-CONSISTENCY-02 — Rule violation: weaker or stale evidence is made conclusive

Primary evidence is absent, inaccessible, or insufficient, sources conflict, or a nearby Linux variant was
observed, so weaker material is promoted to a conclusion. The expected outcome keeps the gap or conflict
visible and refreshes answer-changing stale evidence; hiding it behind a confident status is the failure.

#### Checklist

- [ ] DTLNX-CK-CONSISTENCY-02-01 — Secondary material has no conclusive role beyond stating uncertainty or identifying the next probe.
- [ ] DTLNX-CK-CONSISTENCY-02-02 — Every conflict remains visible in the result.
- [ ] DTLNX-CK-CONSISTENCY-02-03 — Every conflict produces narrower established bounds or `Unknown for this compatibility tuple`.
- [ ] DTLNX-CK-CONSISTENCY-02-04 — Each observation and result is bounded to its exact compatibility tuple, including that tuple's distribution, release, repository, package, bundle, container, desktop, display protocol, display server, compositor, session, portal, keyring, sandbox, security profile, architecture, kernel, C library, Electron build, user, policy, trust state, and installed state.
- [ ] DTLNX-CK-CONSISTENCY-02-05 — Every source and observation has a date and an exact refresh condition.
- [ ] DTLNX-CK-CONSISTENCY-02-06 — Answer-changing stale evidence forces a refreshed lookup or `Unknown for this compatibility tuple`.

## Risk

### DTLNX-SC-RISK-01 — Adversarial: proxy evidence is presented as real Linux execution

Documentation, repository content, package metadata, or artifact inspection is described as if an
application, installer, package manager, updater, uninstaller, native integration, runtime transition, or
Linux system ran. The expected outcome names the evidence class and every unrun probe; cosmetic compliance,
proxy-execution claims, or unauthorized action is the failure.

#### Checklist

- [ ] DTLNX-CK-RISK-01-01 — Documentation, repository, metadata, package, bundle, container, and artifact evidence is never described as application, installer, package-manager, runtime, or Linux execution.
- [ ] DTLNX-CK-RISK-01-02 — A development run, unpacked build, source inspection, non-throwing call, or observation on another Linux variant never proves installed or native behavior for this tuple.
- [ ] DTLNX-CK-RISK-01-03 — The result makes no product behavior, product support, implementation, software-testing, verification, or release-readiness decision, including when every tuple field is exact.
- [ ] DTLNX-CK-RISK-01-05 — The lookup performs no credential use, install, update, repair, uninstall, signing, trust-store, repository, package-manager, portal, keyring, sandbox, security-profile, policy, publication, or other mutation.

### DTLNX-SC-RISK-02 — Rule violation: an adjacent result is assigned to the fact investigator

A Linux fact is used to choose product behavior, release policy, Electron implementation, or test validity.
The expected outcome routes each result to its semantic owner; the Manual deciding it or sending every concern
to one broad owner is the failure.

#### Checklist

- [ ] DTLNX-CK-RISK-02-01 — Window, activation, state, and restoration outcomes route to `desktop-architecture`; interface intent routes to `desktop-interface`; and target, artifact, update, recovery, rollback, and release judgments route to `desktop-release`.
- [ ] DTLNX-CK-RISK-02-02 — Scoped coordination routes to `desktop-development`, and trust-boundary or sensitive-data policy routes to `web-security`.
- [ ] DTLNX-CK-RISK-02-03 — Electron semantics route to `electron-runtime`, implementation to `electron-development`, evidence to `electron-testing`, and packaging, signing, install, update, uninstall, and release procedures to `electron-release`.

## Overall

### DTLNX-SC-OVERALL-01 — Normal case: one bounded result closes the lookup without overclaim

The complete tuple, Linux discriminators, evidence, outcome, diagnosis, and routes describe one current Linux
fact consistently. The expected outcome is no broader than its strongest current evidence and keeps every
unproved fact visible; an internally contradictory, Linux-wide, or adjacent-owner claim is the failure.

#### Checklist

- [ ] DTLNX-CK-OVERALL-01-01 — The tuple, Linux discriminators, evidence, outcome, behavior, diagnostic signals, next probe, limits, conflicts, routes, freshness, and non-decisions describe the same exact subject without contradiction.
- [ ] DTLNX-CK-OVERALL-01-02 — The outcome is no broader than the complete tuple and the strongest current evidence that directly applies to it.
- [ ] DTLNX-CK-OVERALL-01-03 — No Linux-wide claim is presented as a Linux fact result.
- Also applies: DTLNX-CK-STRUCTURE-02-03 (explicit unknown evidence).
- Also applies: DTLNX-CK-CONSISTENCY-02-04 (cross-variant inference).
- Also applies: DTLNX-CK-RISK-01-01 (proxy execution).
- Also applies: DTLNX-CK-RISK-02-01 (desktop behavior and release owner routes).
- Also applies: DTLNX-CK-RISK-02-02 (coordination and security owner routes).
- Also applies: DTLNX-CK-RISK-02-03 (Electron owner routes).
