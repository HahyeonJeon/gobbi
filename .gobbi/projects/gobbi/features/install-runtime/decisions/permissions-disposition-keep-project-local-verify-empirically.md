---
name: permissions-disposition-keep-project-local-verify-empirically
description: DD-9 — do not ship permissions.allow in the package (settings.json out of package); keep project-local; verify auto-grant via post-install invocability check. RATIFIED by user.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, permissions, invocability, dd-9, fp1, assumption-risk]
supersedes: null
superseded_by: null
decision_status: ratified
related:
  - features/install-runtime/decisions/2026-05-30-permissions-auto-grant-assumption.md
---

# Permissions disposition (DD-9) — keep project-local, verify auto-grant empirically — RATIFIED by user 2026-05-30

## Context

DD-9: do the `Skill()` / `Agent()` `permissions.allow` entries ship with the plugin or stay project-local? Premise "the runtime auto-grants invocability for plugin-provided components" is UNVERIFIED (F-P1 assumption_risk). DD-2 already bars `settings.json` from the bounded package, so "ship the entries inside the package" is not structurally available without re-opening DD-2.

## Decision — RATIFIED by user via AskUserQuestion 2026-05-30

The leader's recommendation was accepted by the user as the ratified decision:

- **Tag the auto-grant premise as assumption_risk; resolve it empirically** via the post-install invocability check. The check MUST invoke the components that actually test the auto-grant premise — the 2 skills NOT in the live allow-list (`gobbi:codex` and `gobbi:gobbi-hook-authoring`) plus one of the 5 agents (e.g. `leader`). Invoking an already-allowed skill would not falsify the premise. If they load without an explicit allow entry → auto-grant TRUE; if refused → auto-grant FALSE.
- **Do NOT ship `permissions.allow` in the package** (settings.json is out of the package per DD-2). Keep the entries project-local in `.claude/settings.json`.
- **If auto-grant proves FALSE,** a follow-up re-opens the boundary; add `Skill(codex)` + `Skill(gobbi-hook-authoring)` project-local.
- **Inventory note:** the live allow-list names 16 `Skill()` + 5 `Agent()` and OMITS `Skill(codex)` and `Skill(gobbi-hook-authoring)`. Since all 18 skills are packaged (RATIFIED), the project-local allow-list may need 2 added entries for post-install invocability — pending the auto-grant finding.

## Trade-off (the user owned)

If auto-grant is TRUE, project-local entries are redundant friction; if FALSE, they are mandatory and the plugin cannot be fully self-contained for invocability. The conservative path (keep project-local) always works but may add friction. The user chose to keep project-local and verify empirically rather than wait or ship entries.

## Alternatives considered

- **Ship allow entries in the plugin:** Not structurally available — DD-2 excludes `settings.json` from the bounded package.
- **Assume auto-grant TRUE:** Risk — plugin install is non-functional if assumption is wrong.
- **Defer entirely:** Leaves the invocability question open without a falsifier. Rejected.

## Evidence

- Live `.claude/settings.json` allow-list (16 Skill + 5 Agent + WebSearch; omits codex + gobbi-hook-authoring).
- Plugin manifest reference: no auto-grant statement in Claude Code plugin docs.
- `scripts/check-plugin-invocability.sh` implements the operator-run falsifier test.
