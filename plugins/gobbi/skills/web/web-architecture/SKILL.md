---
name: web-architecture
description: "MUST load when choosing or reviewing client-server boundaries, rendering and delivery, navigation, state ownership, caching, progressive enhancement, or dependency strategy for a web application."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion, WebSearch, WebFetch
skill-type: preference
---

# Web Architecture

This preference skill guides structural web decisions: where authority and state live, how documents and code
are delivered, how navigation survives transitions, and which caches, services, and dependencies are accepted.

It recommends boundaries without redesigning a sound application. `web-app-lifecycle` owns user-visible browser
and PWA states and transitions; development, project structure, frontend, backend, platform, security,
testing, language, and framework owners keep their own policy and implementation.

## Principles

### Architecture follows the observable outcome and its constraints

Rendering mode, state placement, and dependencies are means, not goals. Start from verified outcomes and
constraints.

### Authority and ownership should be easy to locate

Each state, policy decision, side effect, cache, and invalidation path needs one clear source of truth and
lifecycle.

### The platform is the baseline

Add client machinery or abstraction only when capability, compatibility, delivery, or maintenance evidence
justifies it.

### Migration cost is part of every choice

Adoption, mixed versions, rollback, operations, and future removal belong in the decision.

## Rules

- **MUST inspect the current architecture and its evidence before proposing a structural change.** Preserve a
  sound shape or name the exact constraint it fails.
- **MUST assign authority, state ownership, data flow, cache invalidation, and failure recovery explicitly.**
  Client state may improve interaction but may not become an accidental authority for a protected action.
- **MUST compare material options against the same applicable constraints.** Include experience,
  accessibility, security, privacy, compatibility, performance, reliability, deployment, operations,
  migration, team capability, and removal cost.
- **MUST make URLs, history, refresh, deep links, multiple tabs, session changes, and degraded operation
  deliberate architectural behavior.** A framework default is evidence only after it is verified against the
  required browser journey.
- **NEVER introduce a dependency, cache, client-server split, rendering mode, or service boundary without an
  owner and exit path.** Record observability, upgrade, failure, rollback, and removal implications.
- **NEVER turn an architectural preference into an unapproved migration or global rewrite.** Keep each
  recommendation within authorized scope.

## Preferences

### PREFER a sound existing shape

PREFER established routing, delivery, state, and deployment when they satisfy the outcome. Depart when current
evidence shows a concrete failure in authority, accessibility, recovery, trust, performance, delivery,
operability, compatibility, or maintenance, and change the smallest boundary that fixes it.

### PREFER explicit authority, state, and cache ownership

PREFER trusted server boundaries for secrets, protected policy, authorization, and server-owned shared state
changes; URLs for navigable state; server data for shared facts; and local state for transient interaction.
Depart only when verified ownership or lifecycle needs require another placement, and give every cache a
freshness, isolation, invalidation, stale, capacity, and diagnostic contract. Set project-approved storage,
network, and processing limits for offline cache, queued-action, reconnect, service-worker, and update work;
`web-app-lifecycle` chooses the product state entered when measured work reaches those limits.

### PREFER durable navigation, progressive enhancement, and evidence-based delivery

PREFER meaningful URLs, standard links and forms, history, refresh safety, deep links, and server fallbacks
where the product supports them. Choose static, server, streaming, client, or hybrid rendering per route and
outcome, and define accurate offline or degraded behavior.

Depart only when verified framework, platform, deployment, compatibility, or project constraints determine
the mode; record the evidence, tradeoff, lifecycle cost, preserved semantic, accessibility, navigation,
refresh, recovery, trust, and completion obligations, and reopen condition.

### PREFER cohesive boundaries and dependencies that earn their lifecycle

PREFER standards, existing capabilities, and cohesive boundaries. Split or add machinery only when verified
ownership, isolation, scaling, release, data, failure, or capability needs outweigh network, consistency,
diagnostic, security, performance, maintenance, and removal costs.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
