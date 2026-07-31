# Web Configuration Evaluation Checklist

This reusable unchecked source evaluates one set of configuration-supply choices for a web or Electron
surface, against the classification, client-bundle-boundary, declared-shape, secret-supply, flag-lifetime, and
authorization-separation obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-configuration`](SKILL.md) preferences, with [`web-security`](../web-security/SKILL.md) owning
enforcement, [`web-deployment`](../web-deployment/SKILL.md) owning environment identity and the frozen build
inputs, [`web-observability`](../web-observability/SKILL.md) owning redaction of a value that legitimately
reaches a log, and [`web-topology`](../web-topology/SKILL.md) owning where a configuration file sits. The
source commit that contains this file identifies the checklist version. Its stable owner prefix is `WEBCFG`.

This source tests the supply boundary — how a value reaches the process that enforces a decision — and not the
enforcement rules `web-security` owns. A secret inlined into a client bundle is a supply defect, so no
enforcement row can substitute for a supply row.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBCFG-SC-PROJECT-01 — Normal case: the decision stays on the supply boundary

A configuration question is answered for a surface with several nearby owners. The expected outcome decides
only supply — which values differ, when each is fixed, how it reaches its process, how long a flag lives — and
routes the rest; an enforcement or placement rule restated here is the failure.

#### Checklist

- [ ] WEBCFG-CK-PROJECT-01-01 — Every decision made here is a supply decision: which values differ per environment, whether each is fixed at build time or read at runtime, how a secret reaches the process that needs it, and how long a feature flag lives.
- [ ] WEBCFG-CK-PROJECT-01-02 — Every adjacent question is routed to its owner: which decisions are protected and where they are authorized to `web-security`, environment identity and the frozen build inputs to `web-deployment`, file placement to `web-topology`, the authoritative behavior a value drives to `web-backend`, client-server state placement to `web-architecture`, and redaction of a value that legitimately reaches a log to `web-observability`.
- [ ] WEBCFG-CK-PROJECT-01-03 — No enforcement rule `web-security` owns is restated or overridden here.

### WEBCFG-SC-PROJECT-02 — Rule violation: a value is used before it is classified

A new environment variable is read by code that ships. The expected outcome classifies it public or secret and
build-time or runtime before first use and records that beside the value; a value whose exposure nobody
decided is the failure.

#### Checklist

- [ ] WEBCFG-CK-PROJECT-02-01 — Every configuration value is classified public or secret and build-time or runtime before it is used.
- [ ] WEBCFG-CK-PROJECT-02-02 — The classification is recorded beside the value.
- [ ] WEBCFG-CK-PROJECT-02-03 — An unclassified value is treated as secret and runtime until someone decides otherwise.

## Structure

### WEBCFG-SC-STRUCTURE-01 — Normal case: configuration is a declared input read once

A process needs per-environment values in several modules. The expected outcome reads and parses the
environment once and exports typed values every consumer imports; an ad hoc read deep in the code, failing far
from its cause, is the failure.

#### Checklist

- [ ] WEBCFG-CK-STRUCTURE-01-01 — The process reads its environment once, parses it against a declared shape, and exports the typed values from one module.
- [ ] WEBCFG-CK-STRUCTURE-01-02 — Consumers import an already-parsed value rather than reading the environment at the call site.
- [ ] WEBCFG-CK-STRUCTURE-01-03 — A literal `process.env.NAME` reference required for a tool's static replacement stays at the module boundary.

### WEBCFG-SC-STRUCTURE-02 — Normal case: exposure is visible where the value is used

Some values are meant to ship to the browser and some are not, and a reviewer must tell them apart at a
glance. The expected outcome makes exposure visible in the variable's own name or in one reviewed list; an
exposure a reviewer must reconstruct from build configuration is the failure.

#### Checklist

- [ ] WEBCFG-CK-STRUCTURE-02-01 — Every exposed client value carries the bundler's declared public prefix, or the project keeps one reviewed allowlist of exposed keys because the tool has no prefix mechanism.
- [ ] WEBCFG-CK-STRUCTURE-02-02 — Adding an exposed key, whether by allowlist entry or by renaming a variable to the public prefix, is treated as a security review rather than a configuration edit.

### WEBCFG-SC-STRUCTURE-03 — Poor quality: a flag has no end

A feature flag ships, the feature launches, and the flag stays. The expected outcome gives every flag an
owner, a default, and a recorded removal or promotion condition and then removes it with the path it disabled;
a flag nobody can safely delete is the failure.

#### Checklist

- [ ] WEBCFG-CK-STRUCTURE-03-01 — Every feature flag records one owner, one default, and one removal or promotion condition when it is created.
- [ ] WEBCFG-CK-STRUCTURE-03-02 — A flag whose condition has been met is removed together with the path it disabled.
- [ ] WEBCFG-CK-STRUCTURE-03-03 — A genuinely long-lived setting is recorded as configuration with an owner rather than as a flag awaiting removal.

## Performance

### WEBCFG-SC-PERFORMANCE-01 — Normal case: the cost of changing a value matches its classification

Someone will need to change this value in a running environment. The expected outcome reads it at runtime so
one artifact promotes unchanged, or accepts a rebuild and a redeploy where the bundle must inline it; an
inlined value nobody realised costs a full release is the failure.

#### Checklist

- [ ] WEBCFG-CK-PERFORMANCE-01-01 — Every per-environment value is read at runtime so one artifact promotes across environments unchanged, or the record names the reason the bundle must inline it.
- [ ] WEBCFG-CK-PERFORMANCE-01-02 — Every build-time value's record accepts that changing it requires a rebuild and a redeploy.
- [ ] WEBCFG-CK-PERFORMANCE-01-03 — Browser runtime values are delivered through the entry document or one small server-rendered configuration response, or the record names the absent server that forces a per-environment build.

## Aesthetics

### WEBCFG-SC-AESTHETICS-01 — Poor quality: the configuration surface cannot be reviewed

A reviewer opens the project to judge what ships to the browser. The expected outcome lets them answer that
from names and one declared shape; an answer requiring a trace through call sites and build configuration is
the failure.

#### Checklist

- [ ] WEBCFG-CK-AESTHETICS-01-01 — A reviewer can determine every value's public-or-secret classification from the variable's own name or one reviewed list, without tracing call sites.
- [ ] WEBCFG-CK-AESTHETICS-01-02 — The declared shape names every required value and, for each optional value, its defined degraded mode.

## Usage

### WEBCFG-SC-USAGE-01 — Expected failure: a required value is absent or malformed at startup

The process starts in an environment missing a required value. The expected outcome refuses to start and names
the value; starting and then failing on the first request, after traffic has already been accepted, is the
failure.

#### Checklist

- [ ] WEBCFG-CK-USAGE-01-01 — The process refuses to start and names the absent or invalid required value.
- [ ] WEBCFG-CK-USAGE-01-02 — No fallback default silently stands in for a missing required value.
- Also applies: WEBCFG-CK-RISK-01-02 (no secret is emitted to a log, error, diagnostic, or crash report).

### WEBCFG-SC-USAGE-02 — Edge case: an optional capability's value is absent

A value drives a capability the product can run without. The expected outcome enters a defined and observable
degraded mode stated explicitly; a feature that quietly stops working is the failure.

#### Checklist

- [ ] WEBCFG-CK-USAGE-02-01 — An absent optional value produces a defined and observable degraded mode stated explicitly rather than a quiet feature failure.

### WEBCFG-SC-USAGE-03 — Normal case: secrets reach each environment through the right supply path

The same secret is needed locally and in every deployed environment. The expected outcome takes it from the
platform's secret store outside local development and from a git-ignored file locally; a checked-in file
serving both is the failure.

#### Checklist

- [ ] WEBCFG-CK-USAGE-03-01 — Every non-local environment takes its secrets from the deployment platform's secret store or a dedicated secret manager.
- [ ] WEBCFG-CK-USAGE-03-02 — Any local development file holding values is git-ignored.

## Consistency

### WEBCFG-SC-CONSISTENCY-01 — Normal case: the declared shape and the supplied values agree

Code consumes values, the shape declares them, and environments supply them. The expected outcome keeps the
three in agreement; a value consumed but never declared, or declared but never supplied, is the failure.

#### Checklist

- [ ] WEBCFG-CK-CONSISTENCY-01-01 — Every value the code consumes appears in the declared shape.
- [ ] WEBCFG-CK-CONSISTENCY-01-02 — Every value in the declared shape is supplied in every environment that requires it, or is marked optional with its degraded mode.
- [ ] WEBCFG-CK-CONSISTENCY-01-03 — The recorded classification of a value agrees with how it is actually supplied and where it is actually read.

## Risk

### WEBCFG-SC-RISK-01 — Rule violation: a secret crosses the supply boundary

A credential is placed where the client, the repository, or a log can read it. The expected outcome keeps it in
a server, a main process, or a build step that does not emit it; a secret readable by anyone who fetches the
bundle or the log is the failure.

#### Checklist

- [ ] WEBCFG-CK-RISK-01-01 — No secret reaches a client bundle, a browser-readable response, or a committed file.
- [ ] WEBCFG-CK-RISK-01-02 — No secret is emitted to a build log, an error message, a diagnostic payload, or a crash report.
- [ ] WEBCFG-CK-RISK-01-03 — Every secret reaches only a server, a main process, or a build step that does not emit it.

### WEBCFG-SC-RISK-02 — Rule violation: a flag decides authority

A surface is hidden behind a configuration switch and the action behind it is treated as protected. The
expected outcome still requires the authoritative check; a flag counted as authorization is the failure.

#### Checklist

- [ ] WEBCFG-CK-RISK-02-01 — No configuration value or feature flag permits an action by itself.
- [ ] WEBCFG-CK-RISK-02-02 — Every action behind a hidden surface is permitted only by the authoritative check `web-security` and `web-backend` own.

### WEBCFG-SC-RISK-03 — Adversarial: a reader extracts a value the project assumed was private

Someone reads the shipped bundle and finds a value that was never meant to be public. The expected outcome
treats everything a bundler substitutes into client code as published text; privacy claimed from
minification, a private repository, or an environment named `production` is the failure.

#### Checklist

- [ ] WEBCFG-CK-RISK-03-01 — Every value a bundler substitutes into client code is treated as published text regardless of minification, repository privacy, or an environment named `production`.
- [ ] WEBCFG-CK-RISK-03-02 — No value is classified public on the grounds that reaching it requires reading the shipped bundle.
- Also applies: WEBCFG-CK-STRUCTURE-02-02 (adding an exposed key is a security review).

## Overall

### WEBCFG-SC-OVERALL-01 — Normal case: the configuration decision set is complete

A complete configuration judgment answers, for every value, its classification, its supply path, and its
validation, and for every flag its owner, default, and removal condition. The scenario fails when one of those
is unanswered, or when a supply decision is described as providing a protection only enforcement can provide.

#### Checklist

- [ ] WEBCFG-CK-OVERALL-01-01 — The record answers, for every value, its classification, its supply path, and its validation, and for every flag its owner, default, and removal or promotion condition.
- [ ] WEBCFG-CK-OVERALL-01-02 — No supply decision claims to provide a protection that only enforcement can provide.
