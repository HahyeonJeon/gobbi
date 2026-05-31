---
name: gobbi-plugin-bounded-package
description: Design for a self-contained gobbi Claude Code plugin package (skills + agents + hooks only, materialized real copies)
type: design
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, bounded-package, materialization, drift-sync]
supersedes: null
superseded_by: null
related:
  - features/install-runtime/decisions/bounded-package-root-and-marketplace-source-resolved.md
  - features/install-runtime/decisions/2026-05-30-bounded-package-root-path-unnamed.md
  - features/install-runtime/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md
---

# gobbi Claude Code Plugin — Bounded Package Design

## Problem

gobbi's value (workflow skills, 5-role agent taxonomy, two runtime hooks) is installable only by manual `.claude/` mirror-sync. The prior `gobbi-core` plugin package (62b95a0, PR #6) was wiped in the v0.5 reset (`e083fad`, PR #264). A new Claude-plugin manifest is needed that correctly packages the v0.5 component tree and provides a clean install/update/uninstall story.

The iter-1 design proposed pointing the plugin at the repo root and the canonical `.gobbi/` dirs. This was overturned at iter-2 because: (1) a repo-root plugin would copy the 77M `.gobbi/.../sessions` tree into the global plugin cache (R1); (2) escaping symlinks (the `.claude/skills/*` mirrors) are SKIPPED on install-time copy (security rule per docs).

## Scope

**In:** A dedicated, self-contained package directory containing `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/` — nothing else. A Claude-schema `marketplace.json`. A `claude-plugin` skill with general guide + layered gobbi section.

**Out:** Session memory, `.gobbi/` project tree, repo content, README, settings.json, public marketplace hosting, Codex manifest reconciliation.

## Approach

### Package layout

Package root = `plugins/gobbi/` (resolved in Preparation — see `decisions/bounded-package-root-and-marketplace-source-resolved.md`):

```
plugins/gobbi/
  .claude-plugin/
    plugin.json          # manifest (name: gobbi, metadata, skills, agents, hooks)
  skills/                # REAL copies of canonical skills (DD-2a)
    gobbi/SKILL.md
    ... (all current skills — 19 after T7)
  agents/                # REAL copies of the 5 Claude .md role agents (DD-2a)
    manager.md
    leader.md
    executor.md
    evaluator.md
    assistant.md
  hooks/
    hooks.json           # 3 event registrations (SessionStart, PostToolUse, PostToolUseFailure)
    session-start.sh     # REAL copy; body unchanged
    post-tool-use-agents.sh  # REAL copy; body unchanged

.claude-plugin/           # at REPO ROOT (not inside plugins/gobbi/)
  marketplace.json        # Claude-schema marketplace; source: "./plugins/gobbi"
```

### Manifest shape (plugin.json)

- `name: gobbi` (only required field)
- `skills`: directory pointer (string) — ADDS-to the default `skills/` dir
- `agents`: array of the 5 `.md` file paths — REPLACES default agents dir; excludes `.toml` Codex wrappers
- `hooks`: `"./hooks/hooks.json"` — hooks.json file, not a directory

### Hooks: 2 scripts / 3 event registrations

The `hooks/hooks.json` reproduces all three event registrations from the current `.claude/settings.json`:
1. `SessionStart` (matcher: `startup|resume|clear|compact`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh`
2. `PostToolUse` (matcher: `Task|Agent`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
3. `PostToolUseFailure` (matcher: `Task|Agent`) → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`

The #256 lesson applies: do NOT over-narrow matchers. The `PostToolUseFailure` block must NOT be dropped.

### Materialized real copies (DD-2a)

The package's `skills/`, `agents/`, and `hooks/` hold REAL file copies, not symlinks. This is the proven approach from prior art `c79d28e` (#251): escaping symlinks were dropped by the marketplace fetch → empty published installs. Real files survive the install-time copy.

**Trade-off named (from #251):** "Editing on main now requires editing in two places." This creates a canonical-tree↔package-copy drift surface. The `claude-plugin` skill MUST document: (a) the keep-in-sync obligation; (b) the named re-sync trigger condition; (c) the mechanical enforcement path (`scripts/sync-plugin-package.sh --check`).

### Install path

In-repo Claude-schema `marketplace.json` + `/plugin marketplace add <path>` + `/plugin install`. The worktree-faithful test path (DD-7) uses a positional-arg marketplace source pointing at the worktree directory (relative marketplace sources resolve to the main checkout from a worktree).

### Hook double-registration (DD-8 — Option C ratified)

Dev-vs-installed split (Option C): `.claude/settings.json` keeps dev registration; `plugins/gobbi/hooks/hooks.json` serves installed users. Both must stay coherent. See `decisions/hook-double-registration-steady-state-dev-vs-installed-split.md`.

## Validation

| Criterion | Verification method |
|---|---|
| Manifest validity | `claude plugin validate --strict ./plugins/gobbi` |
| Cache-contents gate | Enumerate `~/.claude/plugins/cache/<id>/`; assert allow-set = `{.claude-plugin/, skills/, agents/, hooks/}` only |
| Worktree-faithful install | Sentinel assertion: worktree-only file present in cache |
| Hook fire-once | Instrument/observe each of 3 registrations fires exactly once post-install |
| Skill exists + symlink resolves | `readlink` on `.claude/skills/claude-plugin/SKILL.md`; section-presence check |
| Agents invocable | Invoke a `gobbi:<skill>` and one agent post-install |

## Trade-offs

**Optimizes for:** correctness (real files survive install-time copy; bounded payload; proven shape); maintainability (skill documents the drift surface); independence (standalone plugin, not pointing at volatile session memory).

**Sacrifices:** single source of truth (canonical tree and package are two copies, not one). Mitigated by naming a re-sync trigger and the `scripts/sync-plugin-package.sh --check` mechanical gate.
