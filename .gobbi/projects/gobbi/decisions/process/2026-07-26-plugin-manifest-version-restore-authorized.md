---
name: plugin-manifest-version-restore-authorized
description: The user authorized restoring the two plugin manifests to 0.5.4 outside the plan's declared change-set boundary, repairing a live develop breakage that blocked T06's sync gate.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process, docs-sync]
keywords: [plugin-manifest, version-restore, change-set-boundary, sync-gate, RX-13]
author: claude
supersedes: null
superseded_by: null
---

# The plugin manifest version restore was authorized, and why it was necessary

## Context

Planning §6 declares the change set as "the `react/` directory plus exactly four registration
sites — and nothing else", and says a task proposing a fifth site is "out of contract and must be
raised, not absorbed". `scripts/sync-plugin-package.sh` fails its topology check unless the Codex
manifest, the Claude manifest, and `.claude-plugin/marketplace.json` all carry a non-empty and
equal version. The three values had diverged on `develop` before this session:

| Commit | Claude manifest | Codex manifest | Marketplace |
|---|---|---|---|
| `2aa5f5a7` — feat(ui-ux): add cross-surface design skills (#360) | 0.5.4 | 0.5.4 | 0.5.4 |
| `dc5fd3c4` — docs(memory): close workflow redesign session | **0.5.3** | **0.5.3** | 0.5.4 |

`dc5fd3c4` regressed the two plugin manifests while leaving the marketplace at 0.5.4, breaking the
three-way equality on `develop` before this session began. T06's verification clause requires
`sync-plugin-package.sh --check` to exit 0, which was unreachable while the mismatch stood.

## Decision

The user authorized commit `5421faca` — "fix(plugin): restore plugin manifest version to 0.5.4" —
which changes `plugins/gobbi/.claude-plugin/plugin.json` and `plugins/gobbi/.codex-plugin/plugin.json`
from `0.5.3` to `0.5.4`. The authorization was given verbally during Execution and was never
written into the session record at the time. The Execution iteration-1 evaluation found the gap
(`RX-13`, Low, confidence 75, filed by the Claude evaluator, which correctly noted it could not
rule out an unrecorded verbal approval). This record closes it, verified against the repository on
2026-07-26 rather than from memory.

## Rationale

The edit **restores** a version that already existed at `2aa5f5a7` and that the marketplace still
declared — it repairs pre-existing debt on `develop` rather than introducing a new version. Without
it, T06's mandatory `sync-plugin-package.sh --check` gate could not exit 0, blocking Execution on a
condition the session's own change set did not create and could not otherwise repair from inside
the declared four-site boundary.

## Alternatives considered

Leaving the manifests at `0.5.3` and treating T06's gate as blocked pending a separate,
out-of-session fix was rejected: the gate is mandatory for this session's own verification clause,
and the breakage predates and is unrelated to the `react` skill content, so deferring it would have
stalled Execution on an orthogonal, pre-existing regression. Waiting for the manifest fix to land
via `develop` first was not workable in-session because the drift was discovered mid-Execution and
the fix was small, mechanical, and verifiable against the repository directly.

## Consequences

It is **not** a new version bump: nothing in this session released anything, and the session's own
no-version-bump binding remains intact — the `react` skill pins only React and the compiler-stable
date, and no file in it names a plugin version. Any future audit comparing the session's commits
against Planning §6's boundary should read this record alongside commit `5421faca`.
