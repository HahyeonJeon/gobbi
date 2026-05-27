---
name: dry-inline-jq-hook-script
description: DRY violation — hook and reconstructor share inline jq snippets without a sourced helper
type: backlogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [jq, dry, hook, reconstructor, design-flaw]
disposition: deferred
supersedes: null
superseded_by: null
---

# DRY inline jq extraction logic — hook and reconstructor share snippets without a sourced helper

## Context

The PostToolUse hook (`.claude/hooks/post-tool-use-agents.sh`) and the reconstructor (`.claude/scripts/reconstruct-agents.sh`) both contain inline copies of the same field-extraction `jq` snippets. The two copies are independent: a `jq` change applied to one but not the other would silently introduce a schema-drift bug, since both scripts populate the same `agents[]` shape from the same transcript payload. The implementation note chose to keep the snippets inline "for simplicity, factor to a sourced helper only if evaluation demands."

## Why deferred

Factoring the shared extraction into a sourced helper (e.g. `.claude/scripts/lib/extract-agent-fields.sh`) is the cleaner solution but adds a third file and a `source` dependency, so the inline-for-simplicity choice was made initially and later evaluation rounds did not force the refactor. The "only factor if demanded" framing was flagged as a Goodhart risk at the time — it can become a self-fulfilling pass condition — so the duplication is carried explicitly as a known debt rather than treated as settled.

## When to pick up

When the next `jq` schema change (e.g. new `agents[]` fields) requires touching both scripts. At that point, factor the shared extraction into a sourced helper rather than editing two copies.

## Suggested approach

Until the refactor lands, treat the two copies as a synchronized pair: any `jq` change to one MUST be mirrored to the other, and both scripts should carry a sync comment, e.g. `# SYNC: jq extraction logic must match reconstruct-agents.sh / post-tool-use-agents.sh`. When picked up, extract the snippets into `.claude/scripts/lib/extract-agent-fields.sh` and `source` it from both scripts so there is a single definition.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Source

Surfaced as a structure/risk finding during install-runtime design evaluation (session 1b26cf20); the deferral was Goodhart-flagged at the time.
