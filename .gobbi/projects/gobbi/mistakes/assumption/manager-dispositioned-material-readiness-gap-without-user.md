---
name: manager-dispositioned-material-readiness-gap-without-user
description: The manager resolved a material Planning decision without the user authority its scope effect required.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [planning-discussion, user-authority, material-decision, scope]
author: claude
priority: high
domain: process
---

# Manager made a material Planning decision without the user

## What happened

Under the former workflow, the manager resolved several Planning-readiness gaps without surfacing their
material scope and authority consequences to the user. The resulting readiness evidence presented those gaps
as legitimately closed.

The independent Codex evaluator kept the gap open while the Claude report treated it as addressed. The cross-system divergence exposed that manager confidence was not user authority.

## Why it happens

The manager confused contract-preserving routine inference with authority to bind a material Planning
decision. A choice that changes scope, design, success criteria, external-write authority, or another
user-owned axis remains a user decision.

## How to detect

While decomposing work, inspect the current Planning synthesis and `open-decisions.md`. If the plan requires a
material choice, missing authority, external-write decision, or scope change, stop and surface that exact
decision to the user.

## Correct approach

Planning begins decomposition from the supplied Ideation contract. When decomposition exposes a material
decision, the manager presents the evidence and a recommended route, waits for the user, and records the
resolution in the current creation package. Planning does not silently repair an upstream Ideation omission.

## Related

- [`planning/SKILL.md`](../../skills/planning/SKILL.md) — current decomposition owner
