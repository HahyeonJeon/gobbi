# Usage Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The user-facing lifecycle is local marketplace add/install/update/uninstall, plus future use of the `claude-plugin` skill. I checked official marketplace behavior, the current worktree context, and the existing `.claude/settings.json` permissions/hooks shape.

## Locked Frame (Stage 1)

- Scenario: a user running from the current worktree installs and validates the plugin built by this session, not a stale main-checkout copy.
- Scenario: installed skills and agents are invocable under the expected Claude permission mode.
- Scenario (adversarial): the plugin appears installed but the user cannot load its components because namespacing or permissions were not handled.

## Per-scenario per-check results

- The artifact includes a local install path but does not include a worktree-specific install/test scenario.
- The artifact identifies permissions as an issue in the internal insight and checklist, but it does not turn that into a success criterion or scenario.

## Typed findings

### U1 - Worktree-local install scenario is missing

- Type: scenario_gap
- Severity: High
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:249-256` recommends in-repo `marketplace.json` plus `/plugin marketplace add ./`. Official Claude marketplace docs state that for local-directory/file sources with relative paths, the path resolves against the repository's main checkout when running from a git worktree (`https://code.claude.com/docs/en/plugin-marketplaces`, local directories and files / git worktrees). This session's workspace path is itself under `.../worktrees/chore/session-2026-05-30-0fd65721`.
- Why-it-matters: Execution will likely validate from this worktree. If Claude resolves the local marketplace source to the main checkout, the install can test stale files or omit uncommitted worktree changes. That produces a false positive install result from the user's point of view.
- Suggested-direction: Add an explicit worktree install/validation scenario and require Planning to choose a test path that proves the installed plugin came from the current worktree content, not from the main checkout.

### U2 - Permissions disposition is identified but not made user-operable

- Type: checklist_gap
- Severity: Medium
- Confidence: 75
- Evidence: `.claude/settings.json:2-26` allows current unnamespaced `Skill(...)` and `Agent(...)` entries. `ideation/rawdata/draft-iter1.md:144-149` says the breadth decision must account for whether settings permissions are part of the plugin or stay project-local. The implementation checklist only says "Decide settings.json permissions disposition" at `draft-iter1.md:206`, with no matching scenario or success criterion.
- Why-it-matters: A plugin that installs but leaves users unable or unauthorised to invoke `gobbi:<skill>` and role agents is not a working gobbi install. The user needs a coherent lifecycle: what the plugin provides, what project settings still must provide, and what validation proves the answer.
- Suggested-direction: Add a permissions scenario with an observable validation target: after install, confirm the namespaced plugin skills and five agents are invocable under the intended permission mode, and state whether any project-local `.claude/settings.json` entries remain required.

## Low-confidence appendix

None.
