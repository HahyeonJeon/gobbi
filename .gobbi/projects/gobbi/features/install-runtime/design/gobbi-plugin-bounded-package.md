---
name: gobbi-plugin-bounded-package
description: Design for a self-contained shared gobbi Claude Code and Codex plugin package with symlinked skills, agents, and hook scripts
type: design
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, codex-plugin, plugin-package, bounded-package, symlinks]
supersedes: null
superseded_by: null
related:
  - features/install-runtime/decisions/bounded-package-root-and-marketplace-source-resolved.md
  - features/install-runtime/decisions/2026-05-30-bounded-package-root-path-unnamed.md
  - features/install-runtime/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md
---

# gobbi Plugin — Bounded Package Design

## Problem

gobbi's value (workflow skills, 5-role agent taxonomy, two runtime hooks) is installable only by manual `.claude/` mirror-sync. The prior `gobbi-core` plugin package (62b95a0, PR #6) was wiped in the v0.5 reset (`e083fad`, PR #264). A new Claude-plugin manifest is needed that correctly packages the v0.5 component tree and provides a clean install/update/uninstall story.

The iter-1 design proposed pointing the plugin at the repo root and the canonical `.gobbi/` dirs. This was overturned at iter-2 because: (1) a repo-root plugin would copy the 77M `.gobbi/.../sessions` tree into the global plugin cache (R1); (2) escaping symlinks (the `.claude/skills/*` mirrors) are SKIPPED on install-time copy (security rule per docs).

## Scope

**In:** A dedicated, self-contained package directory containing `.claude-plugin/plugin.json` + `.codex-plugin/plugin.json` + `skills/` + `agents/` + `hooks/` — nothing else. A Claude-schema `marketplace.json`. A Codex-schema `.agents/plugins/marketplace.json`. A `claude-plugin` skill with general guide + layered gobbi section.

**Out:** Session memory, `.gobbi/` project tree, repo content outside plugin entrypoint docs, README, settings.json, public marketplace hosting.

## Approach

### Package layout

Package root = `plugins/gobbi/` (resolved in Preparation — see `decisions/bounded-package-root-and-marketplace-source-resolved.md`):

```
plugins/gobbi/
  .claude-plugin/
    plugin.json          # Claude manifest (metadata-only for conventional dirs)
  .codex-plugin/
    plugin.json          # Codex manifest (skills: "./skills/")
  skills/                # symlink to ../../.gobbi/projects/gobbi/skills
    gobbi/SKILL.md
    ... (all current skills — 19 after T7)
  agents/                # symlink to ../../.gobbi/projects/gobbi/agents
  hooks/                 # symlink to ../../.gobbi/projects/gobbi/hooks

.claude-plugin/           # at REPO ROOT (not inside plugins/gobbi/)
  marketplace.json        # Claude-schema marketplace; source: "./plugins/gobbi"
.agents/plugins/          # at REPO ROOT (not inside plugins/gobbi/)
  marketplace.json        # Codex-schema marketplace; source.path: "./plugins/gobbi"
```

### Claude manifest shape (`plugins/gobbi/.claude-plugin/plugin.json`)

- `name: gobbi` (only required field)
- Metadata fields: version, description, author, license, keywords
- Do not list `skills`, `agents`, or `hooks` for conventional paths. Claude Code auto-loads `skills/`, `agents/`, and `hooks/hooks.json`.

### Codex manifest shape (`plugins/gobbi/.codex-plugin/plugin.json`)

- `name: gobbi`
- `skills: "./skills/"`
- Metadata fields and `interface` block for Codex presentation

### Hooks: 2 scripts / 3 event registrations

The `hooks/hooks.json` reproduces all three event registrations from the current `.claude/settings.json`:
1. `SessionStart` (matcher: `startup|resume|clear|compact`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh`
2. `PostToolUse` (matcher: `Task|Agent`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
3. `PostToolUseFailure` (matcher: `Task|Agent`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`

The #256 lesson applies: do NOT over-narrow matchers. The `PostToolUseFailure` block must NOT be dropped.

### Symlinked source-of-truth entries

The package's `skills/`, `agents/`, and `hooks/` entries are symlinks to Gobbi's canonical sources. This keeps one source of truth and avoids a package-copy drift surface.

`hooks/hooks.json` is a real file inside `.gobbi/projects/gobbi/hooks/` because it is plugin-specific installed-hook registration. `scripts/sync-plugin-package.sh --check` verifies the symlink topology, and `scripts/sync-plugin-package.sh` restores it if a package entry is replaced by a real file.

### Install path

In-repo Claude-schema `marketplace.json` + `/plugin marketplace add <path>` + `/plugin install`. The worktree-faithful test path (DD-7) uses a positional-arg marketplace source pointing at the worktree directory (relative marketplace sources resolve to the main checkout from a worktree).

### Hook double-registration (DD-8 — Option C ratified)

Dev-vs-installed split (Option C): `.claude/settings.json` keeps dev registration; `plugins/gobbi/hooks/hooks.json` serves installed users. Both must stay coherent. See `decisions/hook-double-registration-steady-state-dev-vs-installed-split.md`.

## Validation

| Criterion | Verification method |
|---|---|
| Manifest validity | `claude plugin validate --strict ./plugins/gobbi` |
| Package symlink gate | `scripts/sync-plugin-package.sh --check` |
| Claude manifest validity | `claude plugin validate --strict ./plugins/gobbi` |
| Claude marketplace validity | `claude plugin validate --strict .` |
| Codex manifest validity | `python3 /home/jeonhh0061/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/gobbi` |
| Codex install smoke | `CODEX_HOME=<tmp> codex plugin marketplace add <repo>` then `codex plugin add gobbi@gobbi-workspace` |
| Cache-contents gate | Enumerate installed cache; for Codex, expect symlinked component content to be skipped under current CLI behavior |
| Worktree-faithful install | Claude marketplace install only: sentinel assertion that a worktree-only symlink target is copied into cache; not expected for Codex under current symlink handling |
| Hook fire-once | Instrument/observe each of 3 registrations fires exactly once post-install |
| Skill exists + symlink resolves | `readlink` on `.claude/skills/claude-plugin/SKILL.md`; section-presence check |
| Agents invocable | Invoke a `gobbi:<skill>` and one agent post-install |

## Trade-offs

**Optimizes for:** single source of truth, bounded payload, and package layout consistency across Claude Code and Codex.

**Sacrifices:** Codex installed-cache completeness under current CLI behavior. Fresh verification on 2026-06-02 showed Codex installs the plugin as enabled but skips symlinked `skills`, `agents`, and hook scripts from the cache.
