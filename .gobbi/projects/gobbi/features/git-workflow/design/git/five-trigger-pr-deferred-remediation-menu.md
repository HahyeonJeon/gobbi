---
name: five-trigger-pr-deferred-remediation-menu
description: DD-2 — Generalize PR-deferred to five triggers and add a per-runtime remediation menu; safe-by-default with an Always-Ask guard on every remediation
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git]
keywords: [pr-deferred, remediation, safe-by-default, always-ask]
author: claude
supersedes: null
superseded_by: null
related: []
---

# DD-2 — Generalize "PR deferred" to five triggers + a per-runtime remediation menu, safe-by-default

## Problem

The current "PR deferred" concept fires on {gh-missing, unauthenticated, no-remote}. Two additional
triggers on both runtimes — network blocked by sandbox and approval not granted — are never named.
The skill defers silently without offering any remediation path first.

## Scope

In-scope: generalize the deferral trigger set; add a manager-surfaced remediation menu before
deferring. Out-of-scope: auto-applying any remediation (user must approve every config change).

## Approach

The deferral mechanism is reused unchanged; the trigger set expands to five:
- {gh-missing, unauthenticated, no-remote} — existing three
- {network-blocked} — new (CC: `allowedDomains` not set / `allowManagedDomainsOnly` blocks;
  Codex: `network_access=false`)
- {approval-not-granted} — new (Codex `approval_policy=never` or on-request escalation not approved)

BEFORE deferring, the manager surfaces a runtime-specific remediation menu:
- CC: add github.com to `allowedDomains`; add `gh` to `excludedCommands` for TLS.
- Codex: opt into `[sandbox_workspace_write] network_access=true` OR approve the on-request
  escalation.

**ASK-ONLY GUARD (R3, security):** every sandbox/network remediation is a user-owned Always-Ask
decision. The manager OFFERS the menu and NEVER auto-edits `.codex/config.toml` or CC settings.
gobbi ships no default network enablement. The menu is offered, never auto-applied (C19).

## Scenarios

Resolves C09 (generalized triggers), C13 (remediation menu), C19 (ask-only guard).
Anchors S13/S16/S17/S20/S22/S32.

## Validation

- Skill text + manager-prompt text enumerate all five triggers and both remediation menus.
- The remediation text states "offer, do not auto-apply."
- No gobbi default enables network.
- S32 scenario: manager offers menu, does not auto-edit.

## Trade-offs

Adding a remediation step before deferral adds one interaction round for the user. The benefit is
that the user is never left wondering why the PR wasn't opened — they get actionable options.
