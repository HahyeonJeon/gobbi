---
name: web-configuration
description: "MUST load when choosing or reviewing how a web or Electron surface is supplied with per-environment values, covering build-time versus runtime configuration, secret supply and the client-bundle boundary, feature-flag lifetime, and startup validation."
allowed-tools: Read, Grep, Glob, WebFetch
skill-type: preference
---

# Web Configuration

Use this preference skill when a value's source needs a judgment rather than a step: which values differ per
environment, whether each is fixed at build time or read at runtime, how a secret reaches the process that
needs it, and how long a feature flag lives. It holds for any browser surface, including an Electron renderer,
and for the Node processes that build and serve it.

`web-security` owns enforcement — which decisions are protected, where they are authorized, and what the
threat model requires. This skill owns supply — how a value reaches the process that enforces them. A secret
inlined into a client bundle is a supply defect, so enforcement cannot prevent it. `web-deployment` owns
environment identity, the frozen build inputs, and the release itself, and does not claim per-environment
values or secret supply; this skill decides what those inputs contain.

`web-topology` owns where a configuration file sits in the repository, `web-backend` owns the authoritative
behavior a value drives, `web-architecture` owns which side of the client-server boundary state lives on, and
`web-observability` owns redacting a value that legitimately reaches a log. Rules define the boundary,
Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### A build-time value is a published value

Anything a bundler substitutes into client code ships to every visitor as readable text, and minification, a
private repository, and an environment named `production` change none of that. The only question a build-time
value raises is whether you are willing to publish it.

### Configuration is a declared input, not ambient state

A process should read its configuration once, against a declared shape, and know at startup whether that shape
is satisfied. Values read ad hoc deep in the code turn an absent variable into a failure far from its cause,
usually under load.

### Supply and enforcement fail differently

A leaked credential and a missing authorization check are both security incidents, with different causes and
different owners. Supply decides what a process holds; enforcement decides what holding it permits, and
neither substitutes for the other.

### A flag is code with two live paths

Every feature flag doubles the states the system can reach and keeps the unselected path compiling but
unexercised. A flag with no removal condition becomes permanent configuration that nobody can safely delete.

## Rules

- **NEVER let a secret reach a client bundle, a browser-readable response, or a committed file.** A bundler
  inlines its public variables verbatim — [Vite](https://vite.dev/guide/env-and-mode) states that `VITE_*`
  values "are bundled into your source code at build time" and must not contain sensitive information — so a
  secret reaches only a server, a main process, or a build step that does not emit it.

- **MUST classify every configuration value as public or secret and as build-time or runtime before it is
  used.** Record the classification beside the value, and treat an unclassified value as secret and runtime
  until someone decides otherwise.

- **MUST validate the complete configuration against a declared shape when the process starts, and fail closed
  on an absent or invalid required value.** A fallback default that silently stands in for a missing
  production value hides the failure until the value matters.

- **NEVER commit a secret, and NEVER emit one to a build log, an error message, a diagnostic payload, or a
  crash report.** Supply it through the environment or the platform's secret store, and route redaction of a
  value that legitimately reaches a log to `web-observability`.

- **MUST give every feature flag one owner, one default, and one recorded removal or promotion condition when
  it is created.** Remove a flag whose condition has been met together with the path it disabled.

- **NEVER let a configuration value or a feature flag stand in for an authorization decision.** A flag may
  hide a surface, but only the authoritative check that `web-security` and `web-backend` own may permit the
  action behind it.

## Preferences

### Prefer runtime configuration and reserve build-time for what must be inlined

**PREFER** reading a per-environment value at runtime, so one artifact promotes across environments unchanged
and a change costs a restart instead of a rebuild. Depart for a value the bundle genuinely must inline, such
as a public endpoint a static document needs before any request, a build identity, or a compile-time switch,
and accept that changing it then requires a rebuild and a redeploy.

### Prefer one validated configuration module over scattered environment reads

**PREFER** a single module that reads the environment once, parses it into typed values, and exports them, so
every consumer imports a value already known to exist. Depart only for a tool that requires a literal
`process.env.NAME` reference to perform static replacement, and keep that literal at the module boundary
rather than at the call site.

### Prefer the bundler's declared public prefix over an allowlist you maintain

**PREFER** the tool's public prefix, such as `VITE_` with its `envPrefix` option, so exposure is visible in
the variable's own name at every call site and a reviewer needs no separate list. Depart when the tool has no
prefix mechanism, then keep one reviewed allowlist of exposed keys and treat each addition as a security
review rather than a configuration edit.

### Prefer the platform secret store outside local development

**PREFER** the deployment platform's secret store or a dedicated secret manager for every non-local
environment, so rotating a credential does not mean editing and redeploying a file. Depart for local
development, where a git-ignored file loaded by
[`node --env-file`](https://nodejs.org/api/cli.html#--env-fileconfig) (available since Node.js 20.6.0, and no
longer experimental as of 22.21.0 and 24.10.0) avoids adding a dependency; use `--env-file-if-exists` when the
file may be absent.

### Prefer a short-lived release flag over a durable configuration switch

**PREFER** a flag that exists to separate deploying from releasing and is removed within a release cycle or
two, because that flag has a known end. Depart for a genuinely long-lived setting such as a plan tier, a
regional rule, or a kill switch for a third-party dependency, and record it as configuration with an owner
rather than as a flag awaiting removal.

### Prefer failing at startup over degrading at first use

**PREFER** refusing to start when a required value is absent or malformed, because a process that starts and
then fails on its first request has already accepted traffic. Depart for an optional capability whose absence
is a defined and observable degraded mode, and state that mode explicitly instead of letting the feature fail
quietly.

### Prefer serving browser runtime values from the server that already knows the environment

**PREFER** delivering per-environment browser values through the entry document or one small configuration
response the server renders, so the bundle stays environment-independent. Depart when no server exists, as on
a purely static host, and then accept a per-environment build in which every included value is public by
definition.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
