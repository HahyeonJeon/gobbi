---
name: probe-data-source-reliability
description: The runtime-posture probe assumption that sandbox-mode and approval-policy are introspectable via env or CLI is not proven; only network state is reliably detectable
type: decisions
scope: feature
feature: git-workflow
status: accepted
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: []
keywords: [codex-runtime, probe, reliability, planning-prerequisite]
author: claude
supersedes: null
superseded_by: null
---

# Probe script must report sandbox-mode and approval-policy as best-effort with explicit "unknown" states

## Context

Ideation iter1 DD-3 described a probe that reports effective sandbox mode, network state, and
approval policy. Codex evaluator finding U1 (High/75) flagged that the artifact did not prove a
reliable source of truth for each probe field: empirical testing showed `CODEX_SANDBOX_NETWORK_DISABLED=1`
is available in the environment, but no env var or `codex sandbox --help` introspection exposes
sandbox-mode or approval-policy at runtime.

## Decision

The probe is narrowed to per-field reliability:
- **Network state — RELIABLE**: detectable via `CODEX_SANDBOX_NETWORK_DISABLED=1` on Codex (and
  CC equivalents). The probe reports network on/off with confidence.
- **Sandbox-mode + approval-policy — BEST-EFFORT**: NOT exposed via any env var or
  `codex sandbox --help` introspection. The probe reports these with explicit **"unknown"** states
  rather than guessing.

The manager treats "unknown" as "ask before assuming push will work." The probe never mutates state.

Choosing + verifying each field's data source is a **Planning prerequisite (PIN-1)** BEFORE the
script shape is fixed in Execution.

## Rationale

A script that infers from partial config or partial environment state could give false readiness
before push/PR operations — a potentially silent failure. Better to emit "unknown" explicitly than
to return a guess. The probe's value comes from the network field; the other fields can only be
surfaced via config inspection or user input at this time.

## Alternatives considered

- Full introspection of all three fields: rejected — not possible given current Codex env exposure.
- Skip the probe if not all fields are reliable: rejected — the network field alone is high-value
  (it's the single biggest PR-block on Codex).
- Infer sandbox-mode from heuristics (checking if writes succeed): rejected — side-effecting and
  unreliable.

## Consequences

- DD-3 carries the per-field reliability note.
- PIN-1 is a Planning prerequisite: Planning must choose + verify each field's data source before
  fixing the script shape.
- The probe emits "unknown" for sandbox-mode/approval-policy when not introspectable.

## Related

- `working/draft-iter2.md` § R2, DD-3, PIN-1
- `staging/references/codex-default-workspace-write-on-request.md`
