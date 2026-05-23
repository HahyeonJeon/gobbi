---
title: "Specify shell-safe quoting mechanism for env-passthrough re-exports in session-start.sh"
name: f-struct-01-jq-sh-env-passthrough
type: backlog
severity: medium
confidence: 75
scope: project
source: ideation-iter3-claude-eval
disposition: open
created: 2026-05-22
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
status: deferred
project: gobbi
feature: env-var-audit
task: null
anchor_session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
---

# Specify shell-safe quoting mechanism for env-passthrough re-exports in session-start.sh

## Context

The `session-start.sh` hook contract (P2, iter3) mandates `jq -r @sh` for shell-safe serialization of all `export VAR=value` lines written to `$CLAUDE_ENV_FILE`. The canonical pattern illustrated in the hook contract applies to stdin-JSON-derived fields using jq's `.field` syntax:

```bash
jq -r '@sh "export CLAUDE_TRANSCRIPT_PATH=\(.transcript_path)"' <<<"$payload" >> "$CLAUDE_ENV_FILE"
```

This pattern requires the value to be present in the jq input stream (parsed stdin JSON). It correctly handles the 8 stdin-JSON-sourced exports (`CLAUDE_CODE_SESSION_ID`, `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_CWD`, `CLAUDE_HOOK_EVENT_NAME`, `CLAUDE_HOOK_SOURCE`, `CLAUDE_AGENT_ID`, `CLAUDE_AGENT_TYPE`, `CLAUDE_PERMISSION_MODE`).

The hook also re-exports 3 passthrough env vars (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) if they are already present in env at hook-fire time. These values are **not** in the jq input stream — they are sourced from shell env variables. The `jq -r @sh` pattern using `.field` syntax does not apply directly to env-sourced values. The hook contract's note "The same @sh pattern applies to every exported field above" (idea.md line 252) may be misread by an Executor as applying the identical jq invocation to env-sourced values, which would silently fail or produce incorrect output.

The Idea artifact's "equivalent POSIX-shell-safe quoting" escape clause permits alternatives but provides no example for the env-sourced case, leaving the Executor without a concrete reference.

## Why

An Executor following the canonical jq pattern literally for env-sourced values would need to pipe the env value through jq's input mechanism differently (e.g., `printf '%s' "$CLAUDE_PROJECT_DIR" | jq -Rs @sh` or `jq -rn --arg val "$CLAUDE_PROJECT_DIR" '$val | @sh'`). Without a clear illustration, the implementation risk is that env-sourced values are written without shell-safe quoting, creating injection vulnerabilities if those values contain spaces, single quotes, or shell metacharacters.

The risk is currently bounded to Medium because:
- The 3 passthrough vars (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) are documented as potentially unset in empirical Bash subshells (they are re-exported only if present in env, which may be rare).
- When present, they come from Claude's own runtime and are likely well-formed paths.
- The security requirement for shell-safety is stated; the gap is in the mechanism guidance, not the requirement itself.

## Suggested resolution

In the Planning task that authors `.claude/hooks/session-start.sh` (Task A in the candidate decomposition), add a second illustrative snippet for the passthrough env-var case alongside the stdin-JSON example. Recommended patterns:

```bash
# Pattern for env-sourced passthrough re-exports (not in jq input stream):
# Option A: printf '%q' (bash built-in, produces bash-safe quoting)
printf 'export CLAUDE_PROJECT_DIR=%q\n' "$CLAUDE_PROJECT_DIR" >> "$CLAUDE_ENV_FILE"

# Option B: pipe value through jq's raw-string input
printf '%s' "$CLAUDE_PROJECT_DIR" | jq -Rs '@sh "export CLAUDE_PROJECT_DIR=\(.)' >> "$CLAUDE_ENV_FILE"
```

Either pattern is POSIX-shell-safe for the passthrough re-export case. The Idea's "equivalent POSIX-shell-safe quoting" clause already permits both; the fix is adding the concrete example so the Executor is not left to improvise.

## Where to address

Planning task that authors `.claude/hooks/session-start.sh` (Task A in the candidate decomposition in `idea.md § How → Execution shape`). The task spec should include a sub-note distinguishing the two quoting patterns (stdin-JSON fields via `jq -r @sh` with `.field` syntax; env-sourced fields via `printf '%q'` or equivalent). This does not change the hook's required security property — only the illustration for the env-sourced case.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/`

Finding source: `evaluation/iter3/claude/overall.md` finding F-STRUCT-01 (struct-01-atsh-passthrough-env-gap), type checklist_gap, domain security, confidence 75, severity Medium.
