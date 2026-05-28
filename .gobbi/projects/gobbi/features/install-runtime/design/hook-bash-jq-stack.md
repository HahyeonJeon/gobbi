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
---

# Hook authoring stack: bash + jq, two-tier extraction

## Context

The `post-tool-use-agents.sh` hook must extract subagent telemetry and write it into `session.json.agents[]`. The question was which language stack to author it in, and how to read the payload robustly against schema drift in the transcript format. The repo already has one hook precedent (`session-start.sh`) authored in bash + jq, and jq is already a hard dependency.

## Decision

The `.claude/hooks/post-tool-use-agents.sh` hook is authored in bash + jq, modeled on `.claude/hooks/session-start.sh` (the existing precedent):
- Strict mode: `set -euo pipefail`
- Writability + nonempty guards
- `@sh` shell-safe quoting for jq string interpolation
- Defensive `// "fallback"` for forward-compat on every field extraction

**Two-tier extraction strategy**:
1. Prefer rich `toolUseResult` payload from the transcript JSONL (full telemetry: `agentId`, `usage.*`, `totalDurationMs`, `toolStats`)
2. Fall back to documented `tool_result` from hook stdin (minimal but stable public surface)

The `flock` serialization step (see `flock-serialization-on-session-json.md`) is a mandatory step before any read in both hook and reconstructor.

## Rationale

`session-start.sh` is the established bash+jq precedent; jq is already a hard dependency. Two-tier extraction mitigates forward-compat risk (schema drift) without leaving the bash+jq layer. No new runtime dependency; flock(1) is available on every Linux/macOS host.

Supporting evidence anchored at decision time: the `session-start.sh` precedent (bash+jq established), the schema-drift forward-compat rationale, the two-tier extraction rationale, and the companion flock serialization design (`flock-serialization-on-session-json.md`).

## Alternatives considered

- Node / Python — rejected: new runtime deps; break precedent.

## Consequences

- The hook script (`post-tool-use-agents.sh`) is authored in bash + jq with the strict-mode + guards + `@sh` quoting + defensive-fallback contract above.
- Validation obligations: an evaluator Consistency check (matching shebang + `set -euo pipefail`); a single-script verifier on a fixture transcript; a concurrent-fire smoke test (shared with the flock serialization design).
- No new runtime dependency is introduced; future hook authors follow the same bash + jq stack.

## Related

- `flock-serialization-on-session-json.md` — the mandatory serialization step before any read.
- `metadata-extraction-input-vs-result.md` — the input-vs-result extraction split this stack feeds.
- `tool-use-id-correlation-key.md` — the correlation key for the transcript walk.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
