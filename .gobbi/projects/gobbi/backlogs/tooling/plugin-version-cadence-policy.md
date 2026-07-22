---
name: plugin-version-cadence-policy
description: Choose when meaningful Gobbi plugin changes require a user-approved manifest version bump.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-21
session: 37d3c8ef-57dd-477a-b10c-dcbbc1c2327d
tags: [process]
keywords: [plugin-version, release-cadence, semver, update-distribution]
author: codex
priority: medium
project-scope: true
shipped_in: null
---

# Choose the Gobbi plugin version cadence

## Context

The shared Gobbi package keeps the Claude manifest, Codex manifest, and Claude marketplace entry on one aligned version. The current plugin owner changes that version only when a user-approved release task requires it.

This redesign intentionally keeps version `0.5.3` even though it is a breaking workflow change. That is an explicit decision for this implementation, not a general rule for when future meaningful package changes should create a release task. D6-006 identified this unresolved cadence question; the other D6 queue items were addressed or invalidated by the link, mirror, and hookless redesign.

## Why deferred

The locked implementation scope explicitly forbids a version change. It also does not authorize a durable automatic bump policy. Choosing patch, minor, scheduled, or manually triggered cadence changes how users receive updates and therefore remains a separate user-owned release decision.

## When to pick up

Pick this up before the next Gobbi plugin release, or when a package change must be distributed through either ecosystem's update path and the current version trigger is ambiguous.

## Suggested approach

Verify the current Claude Code and Codex plugin update behavior, list which source changes users receive only through a new version, and compare explicit release-task, bump-on-meaningful-package-change, and scheduled-release policies. Decide the cadence with the user, then encode only the selected policy in the plugin owner and source checks while keeping all version-bearing files aligned.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d/`

## Related

- [[fix-d6-review-findings]] — archived mixed queue from which D6-006 was split
- [[reconcile-obsolete-backlogs]] — lifecycle decision authorizing the split
