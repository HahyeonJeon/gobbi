---
name: hook-bash-jq-stack
description: Hook authoring stack is bash + jq with two-tier extraction strategy — prefer rich transcript toolUseResult payload, fall back to stdin tool_result.
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, bash, jq, authoring-stack]
design-id: D-3-1
slug: hook-bash-jq-stack
iter: 2
---

# Hook authoring stack: bash + jq, two-tier extraction (D-3-1)

## Decision

The `.claude/hooks/post-tool-use-agents.sh` hook is authored in bash + jq, modeled on `.claude/hooks/session-start.sh` (the existing precedent):
- Strict mode: `set -euo pipefail`
- Writability + nonempty guards
- `@sh` shell-safe quoting for jq string interpolation
- Defensive `// "fallback"` for forward-compat on every field extraction

**Two-tier extraction strategy**:
1. Prefer rich `toolUseResult` payload from the transcript JSONL (full telemetry: `agentId`, `usage.*`, `totalDurationMs`, `toolStats`)
2. Fall back to documented `tool_result` from hook stdin (minimal but stable public surface)

D-3-5 flock serialization is a mandatory step before any read in both hook and reconstructor.

## Rationale

`session-start.sh` is the established bash+jq precedent; jq is already a hard dependency. Two-tier extraction mitigates forward-compat risk (schema drift) without leaving the bash+jq layer. No new runtime dependency; flock(1) is available on every Linux/macOS host.

## Anchored insights

`session-start.sh` precedent (bash+jq established); schema drift forward-compat rationale; two-tier DQ rationale; flock serialization design (`flock-serialization-on-session-json.md`).

## Trade-offs considered

- Node / Python — rejected: new runtime deps; break precedent

## Validation

Evaluator Consistency check (matching shebang + `set -euo pipefail`); single-script verifier on fixture transcript; concurrent-fire smoke test (D-3-5 validation).

## Implementation checklist anchor

Hook script authoring (post-tool-use-agents.sh)

## Source

`rawdata/draft-iter3.md:344-351` (D-3-1 narrative)
