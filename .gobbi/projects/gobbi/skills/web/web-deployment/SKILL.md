---
name: web-deployment
description: "MUST load when deploying an accepted web release to an authorized environment, verifying the production URL, advancing or stopping a rollout, or rolling back the environment."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebFetch
skill-type: operation
---

# Web Deployment

Use this operation to place one accepted, immutable web release into one authorized environment and prove
what the production URL serves. It owns the exact target and authority state, environment freeze and record,
migration, asset-upload, and entry-document order, retained predecessor assets, staged rollout, live
verification, immediate reversal, and authority-boundary stop.

[`web-release`](../web-release/SKILL.md) owns production inputs, build configuration, artifact bytes, names,
cache policy, build identity, manifest, digests, and source-map disposition. This operation accepts that
identified artifact and never rebuilds, renames, or modifies its bytes. `web-development` coordinates the
handoff and keeps release status, deployment authority, deployment state, live verification, and observed
health separate.

`web-backend` owns what a migration means to data; `web-observability` owns rollout signals;
`web-configuration` owns runtime values and secrets management; `web-security` owns protected-data exposure;
`web-testing` owns suite evidence; and `web-platform` owns disputed browser facts. Deployment changes and
verifies the environment, then ends; it does not claim indefinite support or ongoing service operation.

## Principles

### Accepted bytes enter; environment state changes

Deployment receives a verified artifact and changes only the named environment. Rebuilding or renaming makes
the deployed bytes a new, unevaluated release and breaks the manifest, identity, and reverse path.

### The reverse path precedes the forward path

A reverse designed during an incident is already late. Name and rehearse the previous artifact, restoration
method, retained assets, data limits, actor, duration, and stop conditions before the first forward action.

### Upload, deployment, verification, and health are separate claims

A completed upload says files moved. Only production-URL evidence proves what people receive, and observed
health remains a further claim based on live signals.

### The production URL is the live evidence boundary

Preview aliases, origin bypasses, and staging hosts cannot prove a deployment. Verification reads the entry
document, assets, lazy chunks, server-owned behavior, identity, and cache directives through the same URL
people use.

## Rules

- **MUST accept one identified release artifact with its manifest, digests, cache contract, source-map
  disposition, rollout and rollback intent, and exact deployment-authority state.** Never rebuild, rename, or
  modify accepted release bytes.

- **MUST freeze and record the environment identity and exact target before anything in that environment
  changes.** Keep the artifact identity and environment identity distinct.

- **MUST define and rehearse the reverse path before the first forward action, and retain and serve the
  previous build's assets throughout the rollback window.** An irreversible change requires explicit user
  authority.

- **MUST apply backward-compatible migrations before dependent code, upload every asset and chunk before the
  entry document, and publish the entry document last.** Prior and new entry documents must both remain
  servable during rollout overlap.

- **MUST advance staged rollout only on observed signals, stop when a stop condition is met, verify from the
  production URL, and reverse immediately on failed verification or a met stop condition.** Re-verify the
  restored release instead of assuming reversal succeeded.

- **NEVER use credentials, publish, promote, advance, reverse, or otherwise change an environment without
  explicit authority for that exact action.** Stop with the artifact, live evidence, reverse path, and first
  blocked action preserved and named.

## Procedure

### Phase 1 — Bind the Accepted Release and Environment

#### 1.1 Accept the release handoff and authority

- Start from an accepted `web-release` handoff that includes the immutable artifact, manifest and digests,
  build identity, cache and naming contract, source-map dispositions, release evidence, rollout and rollback
  intent, and exact deployment-authority state.
- Confirm the artifact file set and digests against the accepted manifest without rebuilding, renaming, or
  modifying any byte, and refuse a partial, mismatched, or unevaluated release handoff.
- Route migration meaning to `web-backend`; rollout signals to `web-observability`; runtime configuration to
  `web-configuration`; every protected-data exposure question arising from target configuration, migration,
  rollout, or served behavior to `web-security`; live suite evidence to `web-testing`; and disputed browser
  verification facts to `web-platform`.
- Continue with one accepted artifact and exact authority state; return an artifact mismatch to `web-release`
  and stop before the first action not covered by the granted authority.

#### 1.2 Freeze the target and rehearse reversal

- Take the accepted artifact plus the target's environment identity, production URL, origin, cache or edge
  layer, entry document, asset paths, currently deployed build, pending migrations, stop conditions, and
  reverse-path authority.
- Freeze and record the environment identity and target before anything changes, then define the exact prior
  artifact, restoration method, retained-asset window, reversible and irreversible data changes, authorized
  actor, expected duration, and stop conditions.
- Rehearse restoration of the named prior artifact in a pre-production target that mirrors production, or use
  the production target's documented dry run when no such target exists; record evidence, observed duration,
  and every unexercised step.
- Continue when a named person can execute the reverse path without further design; raise a change with no
  reverse path for explicit user authority instead of treating it as an ordinary deployment step.

### Phase 2 — Change the Environment in Reversible Order

#### 2.1 Order migrations, assets, and the entry document

- Take the accepted artifact, frozen target, reverse path, pending migrations, and the retained prior assets.
- Apply backward-compatible migrations before the code that needs them, upload every accepted asset and chunk
  before the entry document that names them, publish the entry document last, and retain and serve the prior
  asset names through the full rollback window.
- Record each step's completion time, the entry-document cutover, the accepted artifact identity at every
  destination, and confirmation that predecessor assets remain available to old documents and in-flight lazy
  chunks.
- Continue only while the prior and new entry documents can both be served correctly; stop and reverse when a
  migration is incompatible with the currently serving build.

#### 2.2 Advance under observed stop conditions

- Take the ordered deployment, recorded stop conditions, exact rollout authority, and the signals
  `web-observability` emits.
- Advance in the smallest stage the target supports, hold each stage long enough for error, latency, and
  outcome signals to move, and never advance while a stop condition is met.
- Record each stage boundary, traffic share, signals observed during the hold, and the advance, stop, or
  reverse decision taken at its end.
- Advance only on observed signals and exact authority; reverse immediately on a met stop condition, then
  diagnose from the restored state.

### Phase 3 — Verify, Reverse, or Stop

#### 3.1 Verify from the production URL

- Take the deployed release and the production URL people actually use, not a preview alias, origin bypass,
  or staging host.
- Fetch the entry document and match its served build identity to the accepted release identity; fetch at
  least one hashed asset and one lazily loaded chunk; exercise one server-owned round trip; and
  read asset names and cache directives as served for every release-defined file class and the entry document.
- Record the served identity, response headers, live-served asset names and cache directives, confirmed
  round-trip result, and every difference from the accepted artifact.
- Ask `web-testing` for suite evidence and `web-platform` for a disputed browser fact; return a served-byte
  mismatch to Step 2.1 when publication order caused it and to `web-release` when the accepted artifact or
  manifest itself is inconsistent.

#### 3.2 Reverse or stop at the authority boundary

- Take the production-URL verification, stop conditions, reverse path, and remaining authority state.
- Reverse immediately on failed verification or a met stop condition by restoring the prior entry document,
  confirming its assets remain served, and re-running Step 3.1 against the restored release before diagnosis.
- Record the deployed or reversed state, served build identity, deployment order and stages, verification and
  reverse evidence, retained artifacts and window, every irreversible data change, authority state, and
  remaining risk.
- When this deployment is evaluated, use the [evaluation checklist](checklists.md) and every checklist owned
  by an active `web` sibling; the general Evaluation operation resolves the applicable conditions and issues
  the verdict.
- Report deployment, live verification, and observed health as separate claims to `web-development` or the
  requesting caller. When the next action lacks exact authority, stop with everything preserved and name the
  first blocked action and the authority it requires; hand any ongoing-service need to its caller rather than
  claiming indefinite support.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
