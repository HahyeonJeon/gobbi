---
name: claude-plugin
description: "Use when authoring or reviewing the Gobbi Claude Code plugin package, manifests, hooks, marketplace files, or install flow."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Claude Plugin

Skill for every agent authoring, reviewing, or packaging a Claude Code plugin. Load this skill when a task touches `.claude-plugin/`, plugin manifests, hook registration for an installed plugin, or the plugin symlink layout.

---

## General Claude Code plugin authoring guide

### What is a Claude Code plugin

A Claude Code plugin is a self-contained directory that ships skills, agents, and/or hooks to Claude Code. When a user installs a plugin, Claude Code copies the plugin contents into its local plugin store and registers the components. The plugin directory is identified by a `.claude-plugin/` subdirectory at its root that holds the `plugin.json` manifest.

### The plugin.json manifest

The manifest lives at `<plugin-root>/.claude-plugin/plugin.json`. Only `name` is required. All other keys are optional but strongly recommended.

**The manifest is metadata-only. Do NOT list component directories in it.** Components in the conventional directories — `skills/`, `agents/`, and `hooks/hooks.json` under the plugin root — are auto-loaded by convention (verified on CLI v2.1.159). Listing them in `plugin.json` is redundant at best and breaks loading at worst: on CLI v2.1.159, an explicit `"hooks"` key caused a `"Duplicate hooks file detected"` load failure; an explicit `"agents"` array produced `Agents (0)` instead of loading the agents. The `skills`, `agents`, and `hooks` manifest keys are only for non-conventional locations or additional files beyond the standard paths — and even then, verify the result empirically before shipping.

```json
{
  "name": "your-plugin",
  "version": "1.2.3",
  "description": "What this plugin does",
  "author": {
    "name": "YourName",
    "email": "you@example.com"
  },
  "license": "MIT",
  "keywords": ["tag1", "tag2"]
}
```

Key points about the manifest:

- **`name`** — required, must be unique. Identifies the plugin in install commands and the marketplace.
- **`version`** — when omitted, Claude Code uses the git SHA of the commit as the version. You MUST bump `version` explicitly in the manifest for installers to receive updates via `claude plugin update` — a SHA-only version never increments from the installer's perspective.
- **`author`** — an OBJECT with `name` (and optionally `email`, `url`) — NOT a bare string. A bare string is not the correct schema.
- **Do NOT add `skills`, `agents`, or `hooks` keys for conventional paths.** Place skills under `<plugin-root>/skills/`, agents under `<plugin-root>/agents/`, and hooks at `<plugin-root>/hooks/hooks.json` — the CLI auto-loads all three by convention. Adding manifest keys for these paths is not needed and has caused load failures in practice (CLI v2.1.159).

### Component auto-loading — conventional directories

> **Use conventional directories, not manifest keys, for components.**

Components in conventional directories are auto-loaded by the CLI without any manifest keys (verified on CLI v2.1.159):

| Directory / file | What it auto-loads |
|---|---|
| `<plugin-root>/skills/` | All skill subdirectories — ADDS-TO the user's existing skill set |
| `<plugin-root>/agents/` | All `.md` agent files — makes them available alongside existing agents |
| `<plugin-root>/hooks/hooks.json` | Hook registrations — auto-loaded by convention |

**Do NOT add `skills`, `agents`, or `hooks` keys to `plugin.json` for these conventional paths.** The auto-load behavior is the correct and verified path.

**Caveat — manifest `agents` key (if used for non-conventional paths):** the documented intent of the `agents` manifest key is to REPLACE the default agent set with an explicit list. However, empirical testing on CLI v2.1.159 showed that an explicit `agents` array of 5 file paths produced `Agents (0)` — the explicit array was mis-handled and loaded nothing. The conventional `agents/` directory (no manifest key) loaded all 5 agents correctly. If you must use the `agents` key for a non-conventional location, verify empirically that agents actually load before shipping.

### hooks — hooks.json structure

The `hooks/hooks.json` file under the plugin root is auto-loaded by convention — do NOT add a `"hooks"` key to `plugin.json` pointing at it. On CLI v2.1.159, adding `"hooks": "./hooks/hooks.json"` to the manifest caused a `"Duplicate hooks file detected: ./hooks/hooks.json resolves to already-loaded file"` error and a `Status: failed to load` for the whole plugin. The manifest `"hooks"` key is only for additional hook files at non-conventional paths — and only if you verify the result empirically.

The `hooks/hooks.json` file itself (the FILE structure, not the manifest key) must have a top-level `"hooks"` key:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          { "type": "command", "command": "bash \"${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.sh\"" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Task|Agent",
        "hooks": [
          { "type": "command", "command": "bash \"${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.sh\"" }
        ]
      }
    ]
  }
}
```

The `${CLAUDE_PLUGIN_ROOT}` variable expands to the plugin's installed root at runtime. Always use it for script paths — never hardcode an absolute path.

Event names follow the Claude Code hook event schema: `SessionStart`, `PostToolUse`, `PostToolUseFailure`, `PreToolUse`, `Notification`, `Stop`.

Each entry under an event name is a matcher object with:
- `matcher` — regex matched against `tool_name` (PostToolUse/PostToolUseFailure) or the top-level `source` field (SessionStart)
- `hooks` — array of command objects, each with `type: "command"` and `command` (the script invocation)

### marketplace.json — the Claude schema

The marketplace file lives at the **repo root** (not inside the plugin directory). It follows the Claude marketplace schema:

```json
{
  "name": "owner-or-org-name",
  "owner": {
    "name": "DisplayName",
    "email": "owner@example.com"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name"
    }
  ]
}
```

The `source` field is a **relative path** from the marketplace.json's location to the plugin root — a bare `"./..."` string (no trailing slash). This is the Claude marketplace schema. It differs from other plugin ecosystem marketplace schemas (such as Codex's) — do not conflate them.

The conventional pattern places `marketplace.json` at the repo root and the package at `./plugins/<name>/`. This is a convention, not a requirement — any bounded directory works as the package root as long as the `source` field points at it. The gobbi plugin uses the consensus package root `plugins/gobbi/`; the marketplace file is `.claude-plugin/marketplace.json` and its `source` is `"./plugins/gobbi"`.

### Install behavior — symlink rules (three cases)

When a user runs `claude plugin install`, Claude Code processes symlinks in the plugin directory according to three cases based on where the symlink target resolves:

| Case | Condition | Install behavior |
|---|---|---|
| **Within-plugin-dir** | Target resolves inside the plugin root directory | Preserved as a symlink in the installed plugin |
| **Within-marketplace** | Target resolves outside the plugin root but within the marketplace root (the directory containing `marketplace.json`) | **Dereferenced** — the pointed-to file is copied to the installed location |
| **Outside-marketplace** | Target resolves outside the marketplace root | **Skipped** — the symlink is not installed (security constraint: plugins cannot read arbitrary host files) |

The **marketplace boundary** is the directory containing `marketplace.json`. For a GitHub-hosted plugin, the marketplace boundary is the repo root (because `marketplace.json` is at the repo root). For a local marketplace (`claude plugin marketplace add ./marketplace.json`), the boundary is the directory of that local file.

**Practical consequence for within-marketplace symlinks:** if your plugin directory contains symlinks that escape the plugin root but stay within the marketplace root, the installer dereferences them — it copies the real content, not the symlink pointer. This means you can ship symlinks instead of materialized real copies, and the installed plugin receives the full content. Symlinks that escape the marketplace root are skipped unconditionally.

**Caveat — local-path vs. GitHub-hosted install.** The official Claude Code documentation states that `--plugin-dir` and local-path installs only preserve symlinks resolving within the plugin's own directory (all others skipped). However, CLI v2.1.159 dereferenced within-marketplace escaping symlinks on both local-path AND GitHub-hosted installs in empirical testing. The GitHub-hosted install path is documented to dereference within-marketplace symlinks unconditionally and is the verified distribution path. A future CLI version could enforce the stricter local-path behavior — if you rely on within-marketplace symlinks in a local-path install, re-verify empirically on any CLI upgrade.

### Version cadence

- Omitting `version` in `plugin.json` means the installed version is pinned to the git SHA of the commit at install time. Users running `claude plugin update` will NOT receive updates unless `version` changes.
- Bump `version` in `plugin.json` with every meaningful content change. Semantic versioning (`MAJOR.MINOR.PATCH`) is conventional.

### CLI flow — validate, install, update

```bash
# Validate a local plugin directory (strict mode recommended)
claude plugin validate --strict ./path/to/my-plugin

# Add a local or remote marketplace source
claude plugin marketplace add ./marketplace.json        # local
claude plugin marketplace add https://example.com/marketplace.json  # remote

# Install a plugin from the marketplace
claude plugin install plugin-name

# Update all installed plugins
claude plugin update

# Uninstall a plugin
claude plugin remove plugin-name
```

`claude plugin validate --strict ./path/to/my-plugin` is the gate check before publishing or committing. It validates `plugin.json`, component references, and hook schemas.

---

## gobbi

### Package layout

The gobbi plugin is a bounded package under `plugins/gobbi/`. The package carries both ecosystem manifests: `.claude-plugin/plugin.json` for Claude Code and `.codex-plugin/plugin.json` for Codex. The top-level marketplace files stay outside the package:

```
.claude-plugin/
  marketplace.json       ← Claude schema; source: "./plugins/gobbi"
.agents/plugins/
  marketplace.json       ← Codex schema; source.path: "./plugins/gobbi"
plugins/gobbi/
  .claude-plugin/
    plugin.json          ← Claude manifest (metadata-only)
  .codex-plugin/
    plugin.json          ← Codex manifest (skills + hooks)
  skills/                ← symlink to .gobbi/projects/gobbi/skills
  agents/                ← symlink to .gobbi/projects/gobbi/agents
  hooks/                 ← symlink to .gobbi/projects/gobbi/hooks
```

The canonical hook directory contains:

```
.gobbi/projects/gobbi/hooks/
    hooks.json           ← Claude hook registration (4 event groups)
    codex-hooks.json     ← Codex hook registration (Codex-supported events only)
    session-start.sh     ← SessionStart hook implementation
    post-tool-use-agents.sh  ← PostToolUse/PostToolUseFailure hook implementation
    session-end.sh       ← SessionEnd hook implementation for Claude Code
```

The `marketplace.json` file is NOT inside the plugin directory. Claude Code reads `.claude-plugin/marketplace.json`; Codex reads `.agents/plugins/marketplace.json`. Both point at `./plugins/gobbi`, but their schemas differ.

### Symlinked package layout

The canonical sources stay under `.gobbi/projects/gobbi/{skills,agents,hooks}`. The shared package under `plugins/gobbi/` links to those canonical directories instead of copying them. The development hook paths under `.claude/hooks/` also remain symlinks to `.gobbi/projects/gobbi/hooks/`. The workspace-visible skill mirror `.claude/skills/{name}/` is likewise script-owned: `sync-plugin-package.sh` builds it as a real directory of per-file symlinks DERIVED from each canonical skill's agent-exposed children (top-level files AND support subdirs `scripts/`/`templates/`/`workflow/`), and `--check` validates it as per-skill bidirectional parity. It is per-file (not a whole-dir symlink) because Claude Code skill discovery does not resolve a symlinked directory.

Historical note: verification on 2026-06-02 showed Claude marketplace install dereferenced repo-internal symlinks, while Codex install behavior around symlinked component directories needed separate smoke testing. Gobbi keeps the repo package symlinked; Codex installed-cache behavior is verified with `scripts/check-codex-plugin-smoke.sh`.

Run `scripts/sync-plugin-package.sh --check` before claiming the plugin package is current:

| Package entry | Source of truth |
|---|---|
| `plugins/gobbi/skills` | symlink to `.gobbi/projects/gobbi/skills/` |
| `plugins/gobbi/agents` | symlink to `.gobbi/projects/gobbi/agents/` |
| `plugins/gobbi/hooks` | symlink to `.gobbi/projects/gobbi/hooks/` |
| `.claude/hooks/session-start.sh` | `.gobbi/projects/gobbi/hooks/session-start.sh` |
| `.claude/hooks/post-tool-use-agents.sh` | `.gobbi/projects/gobbi/hooks/post-tool-use-agents.sh` |
| `.claude/hooks/session-end.sh` | `.gobbi/projects/gobbi/hooks/session-end.sh` |
| `.claude/skills/{name}/` | real dir of per-file symlinks, DERIVED per skill from `.gobbi/projects/gobbi/skills/{name}/` (top-level files AND support subdirs); built + parity-checked by `sync-plugin-package.sh --check` |

Use `scripts/sync-plugin-package.sh` after topology drift to restore the symlinks.

### DD-8 — dev-vs-installed hook split (Option C)

The gobbi hooks exist in two registrations:

| Registration | Location | Active when |
|---|---|---|
| Dev registration | `.claude/settings.json` (hooks key) | Developing in-repo (worktree or main tree); hooks fire directly from `.claude/hooks/*.sh` |
| Installed Claude registration | `plugins/gobbi/hooks/hooks.json` | Plugin installed via `claude plugin install`; hooks fire from `${CLAUDE_PLUGIN_ROOT}/hooks/*.sh` |
| Installed Codex registration | `plugins/gobbi/hooks/codex-hooks.json` | Plugin installed via Codex; hooks use Codex-supported events and skip Claude metadata work in native Codex |

This is **Option C** of the dev-vs-installed hook design: two separate registrations rather than a single unified path. The accepted trade-off is a **double-fire caveat**: on a machine that both develops in-repo AND has the plugin installed, both registrations are active and each hook fires twice per event. This is an accepted inconvenience for solo development; it does not corrupt state (the hook is idempotent on re-entry) but produces duplicate log entries.

Do not collapse the two registrations into one — the dev registration must use bare relative paths (`.claude/hooks/...`) to work from a checked-out worktree without the plugin installed.

### Component loading — applied to this package

The Claude Code manifest remains metadata-only. Claude Code auto-loads components from conventional directories:

- `plugins/gobbi/agents/` — 5 agent files (manager, leader, executor, evaluator, assistant) auto-loaded by convention
- `plugins/gobbi/skills/` — 22 skill directories auto-loaded by convention; merged with the user's existing skills (ADDS-TO semantics)
- `plugins/gobbi/hooks/hooks.json` — hook registrations (4 event groups) auto-loaded by convention

Verified on CLI v2.1.159: `claude plugin details gobbi` reports `Skills (19), Agents (5), Hooks (3)` (now 22 after the memory/record split + the skill-writing/agent-writing additions — re-verify on next CLI check) with no Claude manifest component keys. Adding `skills`/`agents`/`hooks` keys to the Claude manifest previously produced `Status: failed to load` and `Agents (0)` — those keys stay out of `plugins/gobbi/.claude-plugin/plugin.json`.

The Codex manifest is explicit where Codex needs it:

- `skills: "./skills/"`
- `hooks: "./hooks/codex-hooks.json"`

Codex custom agents remain repo-local under `.codex/agents/*.toml`; the plugin package includes `agents/` as a shared distribution snapshot, not as the native Codex custom-agent discovery path.

### Skills shipped by the package (22 total)

The package ships all 22 canonical skills:

`agent-writing`, `claude-plugin`, `codex`, `coding`, `delegation`, `discussion`, `evaluation`, `execution`, `git`, `gobbi`, `ideation`, `interview`, `memory`, `mistake`, `orchestration`, `planning`, `preparation`, `principles`, `record`, `research`, `skill-writing`, `wrap-up`

The `claude-plugin` skill (this file) is one of the 22. The canonical source lives at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md`; the workspace-visible mirror is `.claude/skills/claude-plugin/SKILL.md` (a symlink). The package path `plugins/gobbi/skills/claude-plugin/SKILL.md` resolves through the package symlink.

### Pointer to the claude-plugin skill

Skill: `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` (canonical)
Mirror: `.claude/skills/claude-plugin/SKILL.md` (symlink, workspace-visible)
Package: `plugins/gobbi/skills/claude-plugin/SKILL.md` (via package symlink)
