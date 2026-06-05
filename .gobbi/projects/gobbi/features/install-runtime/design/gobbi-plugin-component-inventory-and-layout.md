---
name: gobbi-plugin-component-inventory-and-layout
description: Concrete component inventory (19 skills, 5 agent .md, 2 hook scripts / 3 registrations) and resolved shared symlink package layout (plugins/gobbi/) for the gobbi Claude Code and Codex plugins
type: design
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, codex-plugin, plugin-package, inventory, layout, symlinks]
supersedes: null
superseded_by: null
related:
  - features/install-runtime/design/gobbi-plugin-bounded-package.md
  - features/install-runtime/decisions/bounded-package-root-and-marketplace-source-resolved.md
---

# gobbi Plugin — resolved layout + component inventory

Concretizes the Ideation bounded-package design (`design/gobbi-plugin-bounded-package.md`) with the live-verified component inventory and the resolved root path. All counts verified against the worktree on 2026-05-30.

## Resolved layout

```
<repo-root>/
  .claude-plugin/
    marketplace.json          # Claude schema; plugins[].source = "./plugins/gobbi"
  .agents/plugins/
    marketplace.json          # Codex schema; plugins[].source.path = "./plugins/gobbi"
  plugins/gobbi/              # bounded package; allow-set = these 5 subtrees only
    .claude-plugin/
      plugin.json             # Claude manifest; metadata-only for conventional dirs
    .codex-plugin/
      plugin.json             # Codex manifest; skills "./skills/"
    skills/                   # symlink to ../../.gobbi/projects/gobbi/skills
    agents/                   # symlink to ../../.gobbi/projects/gobbi/agents
    hooks/                    # symlink to ../../.gobbi/projects/gobbi/hooks
```

## Skills (19 — after T7 resync)

`claude-plugin, codex, delegation, discussion, evaluation, execution, git, gobbi, gobbi-hook-authoring, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up`

- Source of truth: `.gobbi/projects/gobbi/skills/` (19 dirs after session T7).
- `gobbi-hook-authoring` is canonical-only (NOT in the `.claude/skills/` symlink mirror). It IS packaged through `plugins/gobbi/skills` — it is a load-bearing skill (the stack the 2 packaged hook scripts are built on).
- There is NO `claude` skill in the canonical tree (the `skills/claude/SKILL.md` link in `CLAUDE.md` is a known dangling reference, FLAG-2); the inventory correctly excludes it.
- Keep `plugins/gobbi/skills` as a symlink to the canonical skill tree; do not replace it with real copied files.
- `scripts/sync-plugin-package.sh --check` verifies the symlink topology.

## Agents (5 .md only)

`manager.md, leader.md, executor.md, evaluator.md, assistant.md` are available through the `plugins/gobbi/agents` symlink. The 5 `.toml` Codex wrappers (also present in canonical `agents/`) are not separate package entries.

## Hooks (2 scripts / 3 registrations)

- Scripts: `session-start.sh`, `post-tool-use-agents.sh` (source files in `.gobbi/projects/gobbi/hooks/`; `.claude/hooks/` and `plugins/gobbi/hooks/` entries are symlinks).
- `hooks.json` reproduces the LIVE `.claude/settings.json` shape:
  - `SessionStart` matcher `startup|resume|clear|compact` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh`
  - `PostToolUse` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
  - `PostToolUseFailure` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
- Bodies UNCHANGED; portability confirmed (scripts resolve targets from runtime `$cwd`/`$CLAUDE_ENV_FILE`, not own path).
- Per RATIFIED DD-8 Option C, this `hooks.json` (installed users) coexists with the in-repo `.claude/settings.json` block (dev) — the two MUST be kept coherent.

## Claude manifest fields (`plugins/gobbi/.claude-plugin/plugin.json`)

Metadata-only: `name: gobbi` (required) · version/description/author/license/keywords. Conventional `skills/`, `agents/`, and `hooks/hooks.json` auto-load; do not add `skills`, `agents`, or `hooks` keys for those conventional paths.

## Codex manifest fields (`plugins/gobbi/.codex-plugin/plugin.json`)

`name: gobbi` (required) · version/description/author/license/keywords · `skills: "./skills/"` · `interface` metadata.

## Marketplace fields (.claude-plugin/marketplace.json)

`name` (kebab) · `owner` {name, email — e083fad^ owner block} · `plugins: [{ name: "gobbi", source: "./plugins/gobbi", description, version }]`.

## Marketplace fields (`.agents/plugins/marketplace.json`)

Codex object-source schema: `plugins: [{ name: "gobbi", source: { source: "local", path: "./plugins/gobbi" }, policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" }]`.

## Validation hooks (carried from Ideation)

`scripts/sync-plugin-package.sh --check`; `claude plugin validate --strict ./plugins/gobbi`; `claude plugin validate --strict .`; Codex scaffold validator against `./plugins/gobbi`; Codex marketplace add/list/add smoke test; cache-contents gate; worktree-sentinel assertion; fire-exactly-once (keyed on hook_event_name, with deterministic per-event triggers including a non-zero-exit agent for PostToolUseFailure).

Codex caveat verified on 2026-06-02: the symlinked source package installs as `installed, enabled`, but the Codex cache skips symlinked `skills`, `agents`, and `hooks`, leaving only the two manifests. This is the accepted consequence of the single-source symlink topology unless Codex symlink handling changes.
