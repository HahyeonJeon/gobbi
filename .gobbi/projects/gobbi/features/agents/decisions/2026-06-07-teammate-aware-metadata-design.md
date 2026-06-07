---
name: teammate-aware-metadata-design
description: Extend session.json agents[] and the cost rollup to be teammate-aware, not parent-subagents/-only
type: decisions
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, metadata, agent-teams, token-accounting, session-json]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Extend session.json Agents[] and Cost Rollup to Be Teammate-Aware

## Context

The existing `session.json.agents[]` schema uses an upsert-by-`agentId` model (via `post-tool-use-agents.sh:224-235`) that clobbers per-turn routing fields (`step`/`phase`/`iter`/`sub_step`) on each continuation turn. Additionally, the existing cost rollup (`reconcile-session-metadata.sh:47-78`) reads only from the parent transcript's `subagents/` directory. Agent Teams teammates are SEPARATE Claude Code sessions — their turns and tokens are NOT under the parent's `subagents/` directory.

This gap was identified by Codex in iter2 as a High/75 finding (O1, the divergence driver). The user confirmed Codex's judgment was correct and directed iter3 to fold in the fix.

## Decision

Extend the metadata schema in two ways:

1. **Per-turn routing preservation:** Extend `session.json.agents[]` with a `turns[]` sub-array and/or `continuationOf` pointer so a continued agent's per-turn `step`/`phase`/`iter`/`sub_step` routing is preserved — not clobbered by the last-write-wins upsert.

2. **Teammate-aware discovery + accounting:** The metadata design must name:
   - **(a) Teammate discovery** — find teammates that participated via the team config `members` array (name/agentId/agentType), not via the parent's Task/Agent spawn list.
   - **(b) Teammate transcript ownership/location** — each teammate has its OWN session transcript; NOT under the parent's `${main_transcript%.jsonl}/subagents/`.
   - **(c) Teammate token accounting** — the session cost rollup must include teammate-session token usage; without this, the F4 cost gate measures the wrong thing.
   - **(d) Relation to the existing Task/Agent hook** — `post-tool-use-agents.sh` fires on Task/Agent tool results; a teammate continuation is not a Task/Agent tool result in the parent transcript; the design states how teammate metadata is captured instead.

In-process teammates do NOT survive `/resume`/`/rewind`; the metadata cannot promise resume-survival for a continued chain.

Exact JSON shape and the exact teammate-rollup mechanism are deferred to Execution. The direction is "extend the metadata; do not accept lossy continuation metadata" and "the rollup must be teammate-aware, not parent-`subagents/`-only."

## Rationale

Without the schema extension, every continuation turn collapses N turns into one lossy entry — the audit trail is incomplete. Without the teammate-aware rollup, a continued teammate chain's token cost is invisible to the session's cost accounting — making the F4 cost gate measure the wrong baseline and potentially giving a false win to a continued chain that actually costs more.

## Alternatives considered

- **Accept the clobber:** rejected — explicitly deciding "lossy" would leave the audit trail incomplete; the user direction (iter3 fold-in) was to "extend the metadata; do not accept lossy continuation metadata."
- **Ignore teammate tokens in the cost rollup:** rejected — Codex O1 identified this as a High finding; if teammate usage is invisible, the F4 cost gate may give a false win.

## Consequences

- T2 implementation must address both the clobber (schema extension) and the teammate-aware rollup (teammate discovery + accounting path).
- The F4 measurement source must explicitly include teammate-session usage; a measurement that counts only the parent `session.json.agents[]` Task/Agent sums is invalid.
- The exact JSON shape is Execution-level; the Planning task for T2 must leave room for the Executor to decide the schema details.
- `post-tool-use-agents.sh` behavior for teammates (which are NOT Task/Agent tool results) must be addressed — the design must state how teammate metadata is captured.
- The actual `.sh` runtime code that would populate `turns[]`/teammate token usage at runtime is deferred (see `features/agents/backlogs/agent-teams-sh-runtime-implementation.md`).
