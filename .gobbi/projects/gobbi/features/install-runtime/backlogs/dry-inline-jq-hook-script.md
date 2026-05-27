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
---

# DRY inline jq extraction logic — hook and reconstructor share snippets without a sourced helper

## Context

The hook (`post-tool-use-agents.sh`) and reconstructor (`reconstruct-agents.sh`) both contain inline copies of the same field-extraction `jq` snippets. The implementation note states: "keep them inline for simplicity, factor to a sourced helper only if evaluation demands." Subsequent evaluations passed without demanding the refactor. The inline duplication remains.

## Decision

Deferred. The inline jq snippets in `.claude/hooks/post-tool-use-agents.sh` and `.claude/scripts/reconstruct-agents.sh` are independent copies; divergent edits to one but not the other would silently introduce a schema-drift bug. The deferred discipline was Goodhart-flagged at the time to avoid "only factor if demanded" becoming a self-fulfilling pass condition.

## Rationale

Factoring into `.claude/scripts/lib/extract-agent-fields.sh` is the cleaner solution but adds a third file and a `source` dependency. The decision to keep inline was made for simplicity; evaluations did not force the refactor.

## Consequences

If the executor implements the hook and reconstructor, they MUST apply the same field-extraction `jq` snippets to both files. Any jq change to one must be mirrored to the other. Add a comment to both scripts: `# SYNC: jq extraction logic must match reconstruct-agents.sh / post-tool-use-agents.sh`.

If jq extraction changes (e.g., new schema fields), a sourced-helper refactor is the recommended next step.

## When to pick up

When the next jq schema change requires touching both files, factor the shared extraction into a sourced helper at that time.
