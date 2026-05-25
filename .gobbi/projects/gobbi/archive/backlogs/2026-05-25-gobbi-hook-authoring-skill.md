---
archived_at: 2026-05-25
archive_reason: closed
title: gobbi-hook-authoring project skill — codify bash + jq + flock + strict-mode + guards pattern
status: closed
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
---

# gobbi-hook-authoring project skill

## Context

Bundle B's T3 implementation produces the project's 2nd shell hook (`.claude/hooks/post-tool-use-agents.sh`) after `.claude/hooks/session-start.sh` (shipped 2026-05-22 in env-var-audit). The two hooks share a non-trivial pattern stack:

- `#!/usr/bin/env bash` + `set -euo pipefail` (strict mode)
- `$CLAUDE_ENV_FILE` guard (no-op when absent — bypass for non-Claude-Code invocations)
- `jq -r @sh` for safe POSIX-shell quoting of JSON values
- REQUIRED / OPTIONAL / PASSTHROUGH partitioning when transforming JSON input
- `flock -x` serialization on shared write surfaces (T3 introduces this for `session.json`)
- Two-tier extraction (prefer rich `toolUseResult`; fallback to `tool_result`) — T3 introduces
- `tool_use_id` correlation key — T3 introduces

After T3 ships, N=2 working witnesses exist. A `gobbi-hook-authoring` project skill at `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` codifying this pattern would prevent future hook authors from reinventing or under-engineering the discipline.

Sub-step C's candidate-skill analysis (`rawdata/sub-steps-a-d-iter1.md` § Candidate skill 1) and D-7 settle on **defer-to-this-backlog** rather than generate-now: pre-emptive codification from N=1 (`session-start.sh` only) would be speculative; the right witness count is N=2, which arrives only after T3 ships. This matches the witness-accumulation cadence locked in Bundle A's design-item-e.

## Why deferred

- **Witness count is currently N=1.** Generating a skill from a single working example risks codifying idiosyncrasies of `session-start.sh` rather than a genuine pattern. Per Principle 10 — Witness-bound Work — pattern extraction needs ≥2 independent witnesses to filter accidental from essential.
- **T3 introduces the richer pattern half** (flock + dual-event registration + two-tier extraction + correlation key). The skill written from N=2 will be substantively better than one written from N=1.
- **Hook authoring is not currently a frequent activity.** No third hook is in any near-term backlog — deferring extraction does not block downstream work.

## When to pick up

- **T3 ships AND `post-tool-use-agents.sh` is exercised by ≥1 real session** (i.e., we've observed the script's behavior under actual Task spawns, not just smoke tests).
- AND optionally, after `backlogs/project/hooks-domain-mistakes-watchlist.md` (paired backlog) has produced ≥1 captured mistake — that captured mistake is the third witness (real failure shape) and tightens the skill's anti-rationalization section meaningfully.

Earliest viable trigger: ~1 session after Bundle B's Wrap-up merges.

## Suggested approach

When picked up, follow the canonical project-skill stamping flow:

1. Run the `interview` skill's wave-codification flow (per `interview/templates/project-skill.md`).
2. Slug: `gobbi-hook-authoring` (kebab-case, prefixed `gobbi-` for project-scope namespacing).
3. Stage at `sessions/{date}-{session-id}/preparation/staging/skills/gobbi-hook-authoring/SKILL.md` via a Preparation generate-now decision in the picking-up session.
4. Body sections (suggested):
   - **Strict-mode preamble** — `#!/usr/bin/env bash` + `set -euo pipefail`
   - **CLAUDE_ENV_FILE guard pattern** — no-op when absent
   - **jq quoting discipline** — `@sh` for shell-safe; `@json` for JSON-string interpolation
   - **REQUIRED / OPTIONAL / PASSTHROUGH partitioning** — when transforming JSON input
   - **flock serialization** — `flock -x` on a per-file lock when read-modify-write on a shared JSON file
   - **Two-tier extraction** — prefer `toolUseResult` (rich); fallback to `tool_result` (canonical)
   - **Correlation keys** — `tool_use_id` for cross-event correlation
   - **Settings registration shape** — `.claude/settings.json` `hooks.{Event}.matcher` + `hooks[].command` triple
   - **Mistakes / anti-rationalizations** — populated from `hooks-domain-mistakes-watchlist.md` captures
5. Promotion path: per `preparation/SKILL.md` narrow exception, promote to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` before Planning of the next hook-touching feature.

Effort estimate: **medium** (one focused session — slug + interview wave + stamp + mirror sync). Most of the wave work is mechanical because both witness scripts already encode the pattern.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

Pointer: Preparation iter1 Sub-step C Candidate skill 1, Sub-step D gap D-7, AskUserQuestion Card 3. User chose "Recommended: Defer to backlog — generate after T3 ships (N=2 witness pattern)."

## Closure

Closed in session `2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f` (Bundle C / T04 / CL-2). Skill authored at `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` from N=2 witnesses (`session-start.sh` + `post-tool-use-agents.sh`), M2-compliant from creation.
