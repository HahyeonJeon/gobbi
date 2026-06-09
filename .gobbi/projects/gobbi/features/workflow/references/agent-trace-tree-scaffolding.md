---
name: agent-trace-tree-scaffolding
description: Agent trace/span trees mirror the workflow graph for debuggability; Cookiecutter-class scaffolding generators prove the template + idempotent hook pattern.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [agent-observability, scaffolding, directory-structure, debuggability]
title: Agent trace/span trees and scaffolding-generator idempotency
source: https://www.braintrust.dev/articles/agent-observability-complete-guide-2026
accessed: 2026-06-08
ref_type: blog
---

# Agent trace/span trees and scaffolding-generator idempotency

## Insight

Mature agent frameworks model a run as a trace-to-spans hierarchy that mirrors the execution graph — each node is a typed span with parent-child links and timestamps so the full execution graph is reconstructable by navigating the tree. Scaffolding generators (Cookiecutter, Scaffold) treat directory creation as a template + deterministic hook: the template fully specifies the tree, and pre/post hooks ensure idempotency.

## Related

- decisions/2026-06-08-number-prefixed-loop-dirs.md
- decisions/2026-06-08-scaffold-script-mechanism.md
- design/session-memory-tree.md

## Why it applies

For D4 (debuggability): gobbi's workflow is a graph (6 steps × 4 phases × N iters), so a session tree that mirrors that graph makes step-to-phase-to-output legible as a path — the same proven pattern as trace-to-span trees. The number-prefixed loop dirs (`1-ideation/` … `5-wrap-up/`) implement this: a `ls` of the session dir reads as the workflow in order. For D1 (deterministic init): Cookiecutter-class tools prove the template + idempotent `mkdir -p` hook pattern — gobbi's scaffold-session-dir.sh copies this model exactly.

## Source

- https://www.braintrust.dev/articles/agent-observability-complete-guide-2026
- https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-framework
- https://pypi.org/project/cookiecutter/
- https://www.kimanimbugua.com/post/using-cookiecutter-hooks-to-enhance-code-scaffolding/

## Excerpt

> Mature agent frameworks model a run as trace→span trees that mirror the execution graph. Scaffolding generators (Cookiecutter) materialize a fully-specified template tree via an idempotent hook — re-running the generator does not corrupt an existing tree.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Grounded the number-prefixed loop dir design (EXT-3) and the idempotent scaffold-script approach |
