---
name: permissions-auto-grant-assumption
description: DD-9 assumes plugin-provided components may be auto-granted invocability; this is an unverified load-bearing premise
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, permissions, invocability, assumption-risk]
supersedes: null
superseded_by: null
decision_status: proposed
---

# Verify whether plugin-provided components require explicit permissions.allow entries

## Context

DD-9 (Permissions disposition) frames the decision as: "whether the 16 `Skill()` + 5 `Agent()` `permissions.allow` entries ship with the plugin (if the schema/runtime auto-grants invocability for plugin-provided components) or stay project-local."

The conditional "if the schema/runtime auto-grants" is an unverified assumption. The Claude plugin documentation does not explicitly state whether plugin-provided `Skill()` and `Agent()` components are automatically invocable post-install or whether they still require project-local `permissions.allow` entries.

Claude evaluator (iter-2, Project perspective) flagged this as F-P1 (Low/50): the premise should be tagged as an explicit assumption_risk and its falsifier identified.

## Decision

**OPEN — Planning must verify.** The falsifier is the post-install invocability check (already in DD-9's success criteria): install the plugin, attempt to invoke a `gobbi:<skill>` and one of the 5 agents, and observe whether the runtime requires explicit allow entries.

If auto-grant is FALSE (project-local entries still required), the "ship with plugin" option collapses and the decision is: keep the 16+5 entries project-local, document which are required, and make that the only path.

## Rationale

This is Low severity because the post-install invocability check will empirically resolve the assumption at Planning/Execution time. However, the assumption should be in the explicit assumption ledger so a Planner reading the canonical artifact knows to verify rather than assuming either way.

## Alternatives considered

- **Assume auto-grant:** Risk — if wrong, the plugin install is non-functional without project-local allow entries, which the user would have to discover by failing.
- **Assume project-local required:** Conservative; always works but may add friction if auto-grant is actually supported.
- **Empirically test:** The correct approach. The DD-9 invocability check is already the specified falsifier.

## Consequences

If auto-grant is not supported, project-local `.claude/settings.json` `permissions.allow` entries remain required and the plugin cannot be fully self-contained for invocability. This changes the "ship with plugin" option in DD-9 and should be documented in the `claude-plugin` skill's gobbi section.

## Related

- `ideation/evaluation/iter2/claude/project.md` F-P1
- `ideation/rawdata/draft-iter2.md` DD-9 (lines 384–390)
- Current `.claude/settings.json` (16 Skill() + 5 Agent() permissions.allow entries)
