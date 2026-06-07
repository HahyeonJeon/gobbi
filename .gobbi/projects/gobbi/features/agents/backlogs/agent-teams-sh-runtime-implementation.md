---
name: agent-teams-sh-runtime-implementation
description: Implement the actual post-tool-use-agents.sh / reconcile-session-metadata.sh code to populate turns[]/teammate token usage at runtime (the T2 documented but unimplemented sh runtime).
type: backlogs
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, continuation, agent-teams, metadata, shell, runtime]
priority: medium
disposition: open
project-scope: false
shipped_in: null
---

# Implement .sh Runtime Code for Teammate-Aware Metadata

## Context
The subagent-continuation redesign (2026-06-07 session, T1–T4) designed the teammate-aware metadata schema: `session.json.agents[]` extended with `turns[]`/`continuationOf`, teammate discovery via team config `members` array, teammate transcript location (separate session), and teammate token accounting in the cost rollup. This design was documented in `orchestration/SKILL.md` and `orchestration/templates/session.template.json` (commit ed286e8).

The actual `.sh` runtime code that would populate these fields at runtime was explicitly deferred:
- `post-tool-use-agents.sh` — needs fix for upsert-by-`agentId` clobber so per-turn routing survives
- `reconcile-session-metadata.sh` — needs teammate-aware token rollup (reads from teammate sessions via team config `members`, not only parent `subagents/`)

See change-summary note: "Out of scope: the actual `.sh` runtime code (`post-tool-use-agents.sh`, `reconcile-session-metadata.sh`) that would populate `turns[]`/teammate token usage at runtime — task 02 documented the requirement; implementation is a follow-up."

## Why deferred
T2's scope was documentation + schema design. Shell script changes were not required to ship a correct prompting-discipline redesign. The design is a prerequisite for the implementation; the design is now complete.

## What to implement
1. **`post-tool-use-agents.sh`** (at `.gobbi/projects/gobbi/skills/orchestration/scripts/`): fix the upsert-by-`agentId` clobber (lines 224-235) to append to a `turns[]` array instead of overwriting, so per-turn `step`/`phase`/`iter`/`sub_step` routing is preserved across continuation turns.
2. **`reconcile-session-metadata.sh`** (at `.gobbi/projects/gobbi/skills/orchestration/scripts/`): extend the rollup (lines 47-78) to also discover and include teammate-session token usage via the team config `members` array (`~/.claude/teams/{team-name}/config.json`), reading each teammate's own session for token data rather than only reading the parent transcript's `subagents/` directory.
3. Test with a simulated two-turn continuation: confirm N turns produce N entries in `turns[]`, not 1 last-write-wins entry.
4. Test the teammate-aware rollup: confirm that when a teammate session exists, its tokens are included in the parent session's cost accounting.

## Dependencies
- `features/agents/decisions/2026-06-07-teammate-aware-metadata-design.md` — the schema design this implements.
- `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md` — prior session's metadata recording decision.

## Originating session
`sessions/2026-06-07-a4e3b54d-3182-4193-8a42-69fce489a098/execution/artifacts/change-summary.md` § "Out of scope"
