---
name: dual-hook-registration-resolver
description: PostToolUse and PostToolUseFailure dual registration with single script; session-dir resolver algorithm derives project name and session dir from hook stdin fields.
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, post-tool-use, session-dir, registration]
design-id: D-3-3
---

# Hook scope: PostToolUse + PostToolUseFailure dual registration with session-dir resolver

## Context

The PostToolUse hook that populates `session.json.agents[]` must capture both successful and failed subagent spawns, and it must locate the correct `session.json` from only the fields the hook receives on stdin (`session_id`, `transcript_path`, `cwd`). Two questions had to be resolved: which hook events to register, and how the hook resolves the session directory at runtime.

## Decision

Register both `PostToolUse` and `PostToolUseFailure` with matcher `"Task"` in `.claude/settings.json`; single script handles both (branches on `hook_event_name` / `status`). Failed-spawn entries get `status: "failed"` and synthetic `id` (= `tool_use_id`) when `agentId` is null.

**Session-dir resolver algorithm:**

The hook stdin contains `session_id`, `transcript_path`, and `cwd`. The session.json path is at `$cwd/.gobbi/projects/<project-name>/sessions/{date}-<session_id>/session.json`. Resolver derives `<project-name>` and `{date}`:

1. **Project name lookup precedence**:
   - **(i — preferred)**: Read `$cwd/.gobbi/project.json` and extract `name` field if file exists.
     - **DORMANT PRECONDITION**: this file does not exist today (verified 2026-05-23). The resolver always falls through to step (ii). Tracked in backlog: `dot-gobbi-project-json-bootstrap`.
   - **(ii — fallback, currently only working path)**: Enumerate `$cwd/.gobbi/projects/`; select single directory if exactly one exists. If zero or multiple: `exit 1` with stderr `"session-dir resolver: cannot disambiguate project name (n=<count>)"`.

2. **Date prefix lookup**: Scan `$cwd/.gobbi/projects/<name>/sessions/` for a directory ending in `-<session_id>`; take its full name. If zero or multiple: `exit 1` with stderr `"session-dir resolver: cannot disambiguate session dir (n=<count>)"`.

3. Resolved path: `$cwd/.gobbi/projects/<name>/sessions/<full-dir-name>/session.json`. If file absent: `exit 1`.

## Official documentation (verbatim)

`PostToolUseFailure` is officially documented at `https://code.claude.com/docs/en/hooks` (WebFetched 2026-05-23):
- Lifecycle table: `| PostToolUseFailure | After a tool call fails |`
- Exit-code-behavior table: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`

## Rationale

Failed spawns are part of the audit trail. `PostToolUseFailure` is officially supported (verbatim quote from official docs confirms this). Single script maintains DRY. Resolver using `project.json` preferred + dir-scan fallback: canonical when present; robust fallback for single-project repos.

Supporting evidence anchored at decision time: empirical verification of the PostToolUseFailure lifecycle; the official-docs verbatim quote (above); the project-resolver precedence rationale; and the PostToolUse hook schema reference under `references/`.

## Alternatives considered

- PostToolUse only — rejected: loses the failed-spawn audit trail.
- Two scripts — rejected: DRY violation.

## Consequences

- `.claude/settings.json` registers both `PostToolUse` and `PostToolUseFailure` with matcher `"Task"`, both pointing at the single script.
- The session-dir resolver carries a dormant `project.json` precondition: `$cwd/.gobbi/project.json` does not exist today, so the resolver always falls through to the single-directory enumeration path. Bootstrapping that file is tracked in backlog `dot-gobbi-project-json-bootstrap`.
- Validation obligations: a smoke test on an artificial spawn failure; an evaluator Risk-perspective review; and a verbatim-quote presence check in the staged reference file.

## Related

- `hook-bash-jq-stack.md` — the authoring stack this hook is built on.
- `tool-use-id-correlation-key.md` — the synthetic-id correlation key used for failed spawns.
- `references/claude-code-hooks-stdin-contract.md` — the hook stdin schema reference.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
