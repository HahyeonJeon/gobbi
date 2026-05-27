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
slug: dual-hook-registration-resolver
iter: 3
---

# D-3-3 — Hook scope: PostToolUse + PostToolUseFailure dual registration; session-dir resolver

## Decision

Register both `PostToolUse` and `PostToolUseFailure` with matcher `"Task"` in `.claude/settings.json`; single script handles both (branches on `hook_event_name` / `status`). Failed-spawn entries get `status: "failed"` and synthetic `id` (= `tool_use_id`) when `agentId` is null.

**Session-dir resolver algorithm** (D-3-3-resolver):

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

## Anchored insights

Empirical verification of PostToolUseFailure lifecycle; official docs verbatim quote; project-resolver DQ rationale; `references/` PostToolUse hook schema reference.

## Trade-offs considered

- PostToolUse only — rejected: loses failed-spawn audit trail
- Two scripts — rejected: DRY violation

## Validation

Smoke test on artificial spawn failure; evaluator Risk perspective; verbatim-quote presence in staged reference file.

## Implementation checklist anchor

Hook settings.json registration (dual event registration); dormant precondition acknowledgment for project.json bootstrap

## Source

`rawdata/draft-iter3.md:362-386` (D-3-3 + D-3-3-resolver narrative)
