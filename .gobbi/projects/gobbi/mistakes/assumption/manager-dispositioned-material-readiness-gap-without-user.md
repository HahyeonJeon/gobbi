---
name: manager-dispositioned-material-readiness-gap-without-user
description: The manager resolved a material Planning-readiness gap without the user decision required by its scope or authority effect.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [planning-discussion, user-authority, readiness, material-gap, gap-disposition]
author: claude
priority: high
domain: process
---

# Manager dispositioned a material readiness gap without the user

## What happened

In the historical workflow, the manager resolved several readiness gaps without surfacing their material scope and authority consequences to the user. The evidence was then presented as if the gaps had been legitimately closed.

The independent Codex evaluator kept the gap open while the Claude report treated it as addressed. The cross-system divergence exposed that manager confidence was not user authority.

## Why it happens

The manager confused contract-preserving routine inference with authority to bind a material readiness gap. Planning DISCUSSION may advance on a clean, evidence-backed scan, but a gap that changes scope, design, success criteria, external-write authority, or another user-owned axis remains an Always-Ask decision.

## How to detect

Before closing a readiness disposition, inspect the current Planning iteration's synthesis and `open-decisions.md`. If evidence shows a material gap, missing authority, external-write choice, or scope effect, stop and surface the decision. A clean-scan advance is not permission to close a non-clean scan.

## Correct approach

Planning starts DISCUSSION by completing the readiness inventory defined in `planning/SKILL.md`. A clean scan may advance. For each material gap, the manager presents evidence and a recommended route, waits for the user decision, and records the resolution in the current creation package. An upstream Ideation omission routes back to Ideation or abort rather than being silently repaired. Missing workspace or domain evidence returns `NEEDS_CONTEXT`.

## Related

- [`planning/SKILL.md`](../../skills/planning/SKILL.md) — current readiness entry-gate owner
