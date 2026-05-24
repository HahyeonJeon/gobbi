---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: session-foundations-bundle-b
finding-id: F-PROJ-iter3-2
type: assumption_risk
domain: verification
disposition: open
confidence: 50
severity: Medium
supersedes: null
superseded_by: null
---

# Assume PostToolUseFailure verbatim quote was correctly retrieved via WebFetch

## Context

iter3 leader re-ran WebFetch of `https://code.claude.com/docs/en/hooks` and preserved verbatim quotes: lifecycle-table `| PostToolUseFailure | After a tool call fails |` and exit-code-behavior `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`. The leader cited 31 hook events on the page; Codex independently fetched the URL and confirmed PostToolUseFailure exists, though the actual enumerable count was 29.

Claude evaluator's sandbox (auto-mode bash) does not include WebFetch tooling, so independent re-verification of the quotes was not possible at Ideation EVALUATION. Codex evaluator independently verified the event exists and is supported via command hooks.

## Decision

Accept this assumption at Ideation exit per the brief's escape-hatch (Confidence-50 downgrade authorized when independent WebFetch is unavailable). Defer empirical re-verification to Execution time when the executor authors `.claude/settings.json` PostToolUseFailure hook registration.

## Rationale

The verbatim quotes are preserved in the staged reference file (`staging/references/claude-code-posttooluse-hook-schema.md` lines 33, 39) and in `draft-iter3.md` at T3-E-5, D-3-3, T3-I-T3.c, and F-Fix-B. The Codex evaluator independently confirmed the event exists. If the hook registration fails at runtime, the failure is loud and immediate; the reconstructor remains the recovery mechanism for failed-spawn audit trail.

## Alternatives considered

- Halt Ideation and force WebFetch re-verification: rejected — the escape-hatch explicitly covers this case.
- Collapse to PostToolUse-only: deferred as an explicit fallback only if runtime registration fails.

## Consequences

The executor authoring `.claude/settings.json` MUST test the PostToolUseFailure registration at Execution time. If the event name is wrong, Claude Code will silently no-op the registration or error at startup — both are detectable.

## Related

- `staging/references/claude-code-posttooluse-hook-schema.md` (verbatim quotes)
- `rawdata/draft-iter3.md` T3-E-5 (line 205), D-3-3 (line 366)
- `evaluation/iter3/claude/project.md` F-PROJ-iter3-2
- `evaluation/iter3/claude/risk.md` F-RISK-iter3-2
