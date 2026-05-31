# Usage Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The usage lens is the install/test operator, the Planner, the Executor, and a future maintainer using the `claude-plugin` skill. I checked the revised worktree scenario, the permissions scenario, current `.claude/settings.json`, and official marketplace behavior around relative paths and worktree/main-checkout resolution.

## Locked Frame (Stage 1)

- Scenario: a user running from this worktree validates the current worktree plugin, not stale main checkout content.
- Scenario: installed plugin skills and agents are invocable under the intended permission mode.
- Scenario (adversarial): installation succeeds but the user cannot operate gobbi because namespacing, permissions, or hook registration were not validated.

## Per-scenario per-check results

- The worktree-faithful scenario now appears in Success Criteria, Scenarios, Implementation Checklist, and DD-7.
- The permissions question now appears in Scenarios, Implementation Checklist, and DD-9 with an invocability check.
- Both items are left for Planning as decisions/tests, which is acceptable for an Ideation artifact because the user asked for directional design rather than implementation.

## Iter-1 Finding Status

### U1 - Worktree-local install scenario is missing: RESOLVED

- Evidence: `draft-iter2.md:84-88` requires install from a worktree-faithful path and hook/agent/skill validation; `draft-iter2.md:200-206` records the main-checkout footgun; `draft-iter2.md:361-367` makes DD-7 a Planning input with a worktree-only sentinel. Official docs confirm relative paths resolve from the marketplace root, and the staged reference records the worktree/main-checkout caveat.
- Assessment: The exact mechanism is deferred, but the artifact now forces Planning to choose and prove a worktree-faithful test path.

### U2 - Permissions disposition is identified but not made user-operable: RESOLVED

- Evidence: `draft-iter2.md:264-266` adds a permissions scenario; `draft-iter2.md:286-287` adds the implementation checklist item; `draft-iter2.md:384-389` makes DD-9 a decision with a post-install skill-plus-agent invocability check and a requirement to state which project-local entries remain needed. Current `.claude/settings.json` has 16 `Skill(...)` and 5 `Agent(...)` allow entries, matching the surface the draft names.
- Assessment: This is now user-operable at the Ideation level: Planning must decide the disposition and validate actual invocation.

## Typed findings

None.

## Low-confidence appendix

None.
