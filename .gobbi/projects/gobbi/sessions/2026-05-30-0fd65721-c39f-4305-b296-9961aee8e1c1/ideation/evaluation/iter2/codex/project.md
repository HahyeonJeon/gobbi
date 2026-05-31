# Project Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The iter-2 Ideation artifact proposes a fresh v0.5 Claude Code plugin named `gobbi`, not a `gobbi-core` resurrection, plus a reusable `claude-plugin` skill under `install-runtime`. I read the full iter-2 draft, discussion log, all iter-1 Codex findings, all six staged references, current `.codex-plugin/plugin.json`, `.claude/settings.json`, `.claude/hooks/*.sh`, `.gobbi/projects/gobbi/agents/`, relevant project mistakes/rules, official Claude plugin docs, and the requested git history (`62b95a0`, `ba8aa42`, `c79d28e`, `e083fad^`).

## Locked Frame (Stage 1)

- Scenario: the artifact reflects the user's binding iter-2 decisions without re-opening them.
- Scenario: the previous false-history premise is replaced by git-sha-cited prior-art analysis.
- Scenario (adversarial): the old `gobbi-core` package is mined for proven solutions without quietly resurrecting obsolete structure.

## Per-scenario per-check results

- The binding decisions are reflected: fresh `gobbi` plugin, bounded package containing only skills/agents/hooks plus manifest, marketplace in scope, and `claude-plugin` skill at canonical path with `.claude` mirror.
- The root-cause section now says the prior plugin existed and was wiped in the v0.5 reset.
- The draft uses prior `gobbi-core` history as reference material, while explicitly keeping the fresh-build direction.

## Iter-1 Finding Status

### P1 - Prior `.claude-plugin` package history was missed: RESOLVED

- Evidence: `draft-iter2.md:127-143` lists `plugins/gobbi-core` at `62b95a0`, `ba8aa42`, `c79d28e`, the hooks saga, and last-live `e083fad^`; `staging/references/prior-gobbi-core-plugin-package-history.md:16-31` records the bounded subtree and materialization lesson. Ground truth verified: `git show 62b95a0:.claude-plugin/marketplace.json` contains a `gobbi-core` entry, and `git show 62b95a0:plugins/gobbi-core/.claude-plugin/plugin.json` contains `name: gobbi-core`.
- Assessment: The false "no prior attempt" claim is gone, and Planning gets the relevant shas and lessons. The user-ratified fresh-build decision is preserved.

## Typed findings

None.

## Low-confidence appendix

None.
