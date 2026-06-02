---
name: bounded-package-root-and-marketplace-source-resolved
description: Package root = plugins/gobbi/; marketplaces at .claude-plugin/marketplace.json and .agents/plugins/marketplace.json; both source ./plugins/gobbi — resolves STRUCT-1
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, codex-plugin, plugin-package, marketplace, layout, struct-1]
supersedes: null
superseded_by: null
decision_status: ratified
related:
  - features/install-runtime/decisions/2026-05-30-bounded-package-root-path-unnamed.md
---

# Bounded plugin package root + marketplace source — RESOLVED

## Context

STRUCT-1 (Codex Medium/75) left the package root path and marketplace `source` unnamed; the open Ideation decision `2026-05-30-bounded-package-root-path-unnamed.md` flagged it for Planning. The risk: an inferred `./` (repo-root) source would recreate the R1 77M-payload cache regression that DD-2 was designed to prevent.

## Decision (leader recommendation; accepted as-is — discussion-log "Resolved (leader recommendations accepted)" 2026-05-30)

1. **Package root:** `plugins/gobbi/` (repo-relative, top-level).
2. **Manifests:** `plugins/gobbi/.claude-plugin/plugin.json` and `plugins/gobbi/.codex-plugin/plugin.json`.
3. **Marketplace files:** repo-root `.claude-plugin/marketplace.json` (Claude schema) and `.agents/plugins/marketplace.json` (Codex schema).
4. **Claude `source` value:** bare string `"./plugins/gobbi"`, resolved relative to the marketplace root (the dir containing `.claude-plugin/` = repo root).
5. **Codex `source.path` value:** object source `{ "source": "local", "path": "./plugins/gobbi" }`, resolved relative to the marketplace root.
6. **Bounded-cache invariant attached to `plugins/gobbi/`:** allow-set = `{.claude-plugin/, .codex-plugin/, skills/, agents/, hooks/}` only; the source-package gate asserts this set and verifies `skills`, `agents`, and hook scripts are symlinks.

## Rationale

Proven prior art, verified live this loop: `e083fad^` (last-live) used `plugins/gobbi/` + `source: "./plugins/gobbi"`; `62b95a0` (#6) used `plugins/gobbi-core/` + `source: "./plugins/gobbi-core"`. Both placed the marketplace at repo-root `.claude-plugin/`. The current worktree had neither `plugins/` nor repo-root `.claude-plugin/` (both confirmed absent) — fresh build, no collision with the Codex `.agents/plugins/marketplace.json`.

## Evidence

- `git show e083fad^:.claude-plugin/marketplace.json` → `"source": "./plugins/gobbi"`.
- `git show 62b95a0:.claude-plugin/marketplace.json` → `"source": "./plugins/gobbi-core"`.
- Live `ls plugins/ .claude-plugin/` at worktree root → both ABSENT (confirmed fresh).
- Reference `features/install-runtime/references/marketplace-json-schema-and-skills-dir-plugins.md` (bare `"./..."` string; resolves to marketplace root).

## Alternatives considered

None seriously entertained: the prior-art shape (`plugins/{name}/`) was verified against two live commits and chosen without contest.

## Consequences

The source-package allow-set gate can be written against `plugins/gobbi/` with the 5-entry allow-set. Installed-cache checks must additionally verify whether the runtime copied symlink targets or preserved/skipped symlinks. Fresh Codex verification on 2026-06-02 showed Codex skips the symlinked component entries in the installed cache. The `source` resolution is auditable against each ecosystem's marketplace rule: Claude uses a bare relative string; Codex uses an object with `source: "local"` and `path`.
