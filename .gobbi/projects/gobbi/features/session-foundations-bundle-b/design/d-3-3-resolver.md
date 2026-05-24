---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
design-id: D-3-3
slug: d-3-3-resolver
status: locked
iter: 3
---

# D-3-3 — Hook scope: PostToolUse + PostToolUseFailure dual registration; session-dir resolver

## Decision

Register both `PostToolUse` and `PostToolUseFailure` with matcher `"Task"` in `.claude/settings.json`; single script handles both (branches on `hook_event_name` / `status`). Failed-spawn entries get `status: "failed"` and synthetic `id` (= `tool_use_id`) when `agentId` is null.

**Session-dir resolver algorithm** (D-3-3-resolver):

The hook stdin contains `session_id`, `transcript_path`, and `cwd`. The session.json path is at `$cwd/.gobbi/projects/<project-name>/sessions/{date}-<session_id>/session.json`. Resolver derives `<project-name>` and `{date}`:

1. **Project name lookup precedence**:
   - **(i — preferred)**: Read `$cwd/.gobbi/project.json` and extract `name` field if file exists.
     - **DORMANT PRECONDITION (iter3 Fix C)**: this file does not exist today (verified 2026-05-23). The resolver always falls through to step (ii). Backlog: `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`.
   - **(ii — fallback, currently only working path)**: Enumerate `$cwd/.gobbi/projects/`; select single directory if exactly one exists. If zero or multiple: `exit 1` with stderr `"session-dir resolver: cannot disambiguate project name (n=<count>)"`.

2. **Date prefix lookup**: Scan `$cwd/.gobbi/projects/<name>/sessions/` for a directory ending in `-<session_id>`; take its full name. If zero or multiple: `exit 1` with stderr `"session-dir resolver: cannot disambiguate session dir (n=<count>)"`.

3. Resolved path: `$cwd/.gobbi/projects/<name>/sessions/<full-dir-name>/session.json`. If file absent: `exit 1`.

## Official documentation (iter3 Fix B — verbatim)

`PostToolUseFailure` is officially documented at `https://code.claude.com/docs/en/hooks` (WebFetched 2026-05-23):
- Lifecycle table: `| PostToolUseFailure | After a tool call fails |`
- Exit-code-behavior table: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`

## Rationale

Failed spawns are part of the audit trail. `PostToolUseFailure` is officially supported (verbatim quote closes iter1 P2/O1 + iter2 Claude-evaluator gap). Single script maintains DRY. Resolver using `project.json` preferred + dir-scan fallback: canonical when present; robust fallback for single-project repos.

## Anchored insights

T3-E-4, T3-E-5 (iter3 verbatim), T3-DQ-3, E-1, `staging/references/claude-code-posttooluse-hook-schema.md`.

## Trade-offs considered

- PostToolUse only — rejected: loses failed-spawn audit trail
- Two scripts — rejected: DRY violation

## Validation

Smoke test on artificial spawn failure; evaluator Risk perspective; verbatim-quote presence in staged reference file.

## Implementation checklist anchor

T3-I-T3.c, T3-I-T3.h (dormant precondition acknowledgment)

## Source

`rawdata/draft-iter3.md:362-386` (D-3-3 + D-3-3-resolver narrative)
