---
name: posttooluse-failure-webfetch-verification-gap
description: Deferred verification gap — PostToolUseFailure verbatim quote was accepted on Confidence-50 at Ideation; must be empirically re-verified when authoring the hook registration.
type: backlogs
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [posttooluse-failure, webfetch, verification-gap, deferred]
priority: medium
disposition: open
project-scope: false
shipped_in: null
---

# Assume PostToolUseFailure verbatim quote was correctly retrieved via WebFetch

## Context

During guardrails Ideation, the session leader ran WebFetch of `https://code.claude.com/docs/en/hooks` and preserved verbatim quotes: lifecycle-table `| PostToolUseFailure | After a tool call fails |` and exit-code-behavior `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. The leader cited 31 hook events on the page; a Codex evaluator independently fetched the URL and confirmed PostToolUseFailure exists, though the actual enumerable count was 29.

The Claude evaluator's sandbox did not include WebFetch tooling, so independent re-verification of the verbatim quotes was not possible at Ideation evaluation. The Codex evaluator independently verified the event exists and is supported via command hooks.

## Why deferred

Accepted at Ideation exit per the brief's escape-hatch: Confidence-50 downgrade authorized when independent WebFetch is unavailable. The verbatim quotes are preserved in `features/guardrails/references/claude-code-posttooluse-hook-schema.md`. Deferred empirical re-verification to Execution time when the executor authors `.claude/settings.json` PostToolUseFailure hook registration.

If the hook registration fails at runtime, the failure is loud and immediate; the reconstructor remains the recovery mechanism for failed-spawn audit trail.

## When to pick up

When authoring `.claude/settings.json` hook registration for PostToolUseFailure. At that time, test the registration empirically.

## Suggested approach

- Author the PostToolUseFailure registration in `.claude/settings.json`.
- Run Claude Code and verify the hook fires on a tool call failure.
- If the event name is wrong, Claude Code will silently no-op the registration or error at startup — both are detectable.
- Fallback: collapse to PostToolUse-only if runtime registration fails.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/` — surfaced during the guardrails Ideation evaluation as a Project-perspective verification-gap finding.

## Related

- `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (the verbatim hook-contract quotes are preserved here)
- The same gap was independently flagged by both the Project-perspective and Risk-perspective evaluators at Ideation (provenance in that session's evaluation artifacts).
