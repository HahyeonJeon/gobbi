---
name: gobbi-dev-conventions
description: "MUST load when choosing Gobbi development lifecycle names, topology, branch roles, handoff vocabulary, or evidence forms."
allowed-tools: Read
skill-type: preference
---

# Gobbi Development Conventions

Use this skill to choose consistent names, topology, branch roles, handoff terms, and evidence forms for Gobbi
development. It gives maintainers and agents project-overridable defaults inside fixed ownership and authority
boundaries.

This skill owns judgment only. The applicable operation owns ordered work, and its mechanism owners retain
mutation, Evaluation, Git, mode, and acceptance authority.

## Principles

### Make identity visible

Names should show the domain, capability, revision, and role that readers need to distinguish. An alias that
hides those facts increases routing and recovery risk.

### Separate owners from views

Canonical files own meaning. Generated discovery, packages, installed caches, reports, and handoffs are views
whose identity and bytes must remain traceable to their owner.

### Let evidence travel with the claim

A handoff is useful only when it names the exact subject, observation, limit, and next owner. Shorter wording
does not justify dropping facts needed to verify or recover the work.

### Make departures explicit

A local convention may change when current project evidence requires it. The departure must preserve binding
rules and state its scope, reason, owner, and effect.

## Rules

- **MUST use the exact globally prefixed names owned by the `gobbi-dev` family.** Do not create short aliases,
  alternate names, or a second meaning for development, testing, review, release, deployment, toolchain, or
  conventions.
- **MUST keep canonical, generated, repository-local, packaged, and installed surfaces distinct.** A view
  never becomes an editable owner, and the repository-local family never becomes plugin content.
- **MUST use `develop` for candidate integration and `main` for accepted release promotion in this project.**
  A different branch role requires an explicit accepted project contract before work starts.
- **MUST bind every handoff and evidence claim to its exact mode or caller, revision or release identity,
  scope, observations, limits, authority, and next owner.** A changed identity invalidates dependent evidence.
- **MUST keep review findings, Evaluation verdicts, and manager or user acceptance as separate terms and
  records.** None implies either of the others.
- **NEVER treat a naming or format preference, a prior approval, or a recorded departure as mutation or
  external authority.** The current mechanism owner and caller contract decide each effect.

## Preferences

### Names

**PREFER** lowercase kebab-case names that include the domain prefix and reserved capability word. Depart only
when an existing authoritative project or runtime identifier must be quoted exactly, and label that borrowed
identity instead of creating an alias.

### Canonical, Generated, and Local-Only Topology

**PREFER** one canonical owner and mechanically derived views with byte or resolved-target checks. Depart from
byte equality only when an accepted projection contract defines the exact transformation and proves both the
included and excluded inventories.

### Branch Roles and Handoffs

**PREFER** role terms such as candidate, accepted release, source branch, target branch, findings, verdict,
and acceptance over broad status words. Depart when an owning runtime or Git surface has a fixed term, and map
that term to the project role in the handoff.

### Evidence Forms and Departures

**PREFER** compact tables or receipts for exact identities, checks, effects, limits, and recovery actions.
Depart when a direct diagnostic or short prose record is clearer, provided every required fact and the reason
for the format change remain explicit.

## References
