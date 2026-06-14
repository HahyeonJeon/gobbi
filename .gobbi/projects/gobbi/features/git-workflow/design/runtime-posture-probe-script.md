---
name: runtime-posture-probe-script
description: DD-3 — A new read-only probe script reports runtime git posture with per-field reliability; network is reliable, sandbox-mode and approval-policy are best-effort
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, probe, runtime-posture, network, sandbox]
supersedes: null
superseded_by: null
related: []
---

# DD-3 — Add a read-only runtime-posture probe script with per-field reliability

## Problem

The manager cannot currently determine push-readiness before attempting a push. P1 checks
`gh` availability and authentication but not network access or sandbox posture. On default Codex a
push attempt will hit a network wall silently.

## Scope

In-scope: a new, read-only script that reports runtime posture (network, sandbox-mode,
approval-policy). Never mutates state. Referenced by P1 and the manager before push is attempted.

Out-of-scope: fixing sandbox mode or enabling network (that is always a user decision per DD-2).

## Approach

**Per-field reliability (narrowed from iter1 per R2, Codex U1 finding):**
- **Network state — RELIABLE.** Detectable via `CODEX_SANDBOX_NETWORK_DISABLED=1` on Codex (and CC
  equivalents). The probe reports network on/off with confidence.
- **Sandbox-mode + approval-policy — BEST-EFFORT.** NOT exposed via any env var or
  `codex sandbox --help` introspection. The probe reports these with explicit **"unknown"** states
  rather than guessing. The manager treats "unknown" as "ask before assuming push will work."

**Planning prerequisite (PIN-1):** choose + verify the probe's data source PER FIELD before fixing
the script shape. The network field's data source is confirmed (`CODEX_SANDBOX_NETWORK_DISABLED`);
the other fields must be verified in Planning before the script shape is fixed in Execution.

## Scenarios

Resolves C11 (P1 probe), C18 (new-script decision). Anchors S16/S21/S26.

## Validation

- Probe present; cited by P1/manager; runs read-only (no writes, no network mutation).
- Network field detected from env.
- Sandbox-mode/approval fields emit "unknown" when not introspectable.
- Exercised against a Codex workspace-write session and a CC sandbox session.

## Trade-offs

A partial probe (network-only reliable) is better than no probe. The "unknown" state for other
fields pushes the decision to the user, which is the correct behavior given the security
implications of sandbox loosening.

## Open issues

PIN-1 (Planning prerequisite): verify each field's data source before the script shape is fixed.
