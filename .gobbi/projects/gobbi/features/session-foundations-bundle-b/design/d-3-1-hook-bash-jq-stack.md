---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
design-id: D-3-1
slug: d-3-1-hook-bash-jq-stack
status: locked
iter: 2
---

# D-3-1 — Hook authoring stack: bash + jq, two-tier extraction

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

T3-I-4: `session-start.sh` is the established precedent; jq is already a hard dependency. Two-tier mitigates T3-E-3 forward-compat (schema drift) without leaving the bash+jq layer. No new runtime dependency; flock(1) is available on every Linux/macOS host.

## Anchored insights

T3-I-4, T3-E-3, T3-DQ-1, D-3-5.

## Trade-offs considered

- Node / Python — rejected: new runtime deps; break precedent

## Validation

Evaluator Consistency check (matching shebang + `set -euo pipefail`); single-script verifier on fixture transcript; concurrent-fire smoke test (D-3-5 validation).

## Implementation checklist anchor

T3-I-T3.a

## Source

`rawdata/draft-iter3.md:344-351` (D-3-1 narrative)
