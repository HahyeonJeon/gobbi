---
name: claude-plugin
description: "Load when authoring, updating, or packaging a Claude Code plugin. Covers the plugin.json manifest schema, component key asymmetries (skills ADDS-to vs agents REPLACES), hooks.json structure, marketplace.json format, the install-copies-and-skips-symlinks security constraint, version cadence, and the CLI validate/install/update flow. Includes a gobbi-specific layer covering the bounded package layout, materialization via sync-plugin-package.sh, and the DD-8 dev-vs-installed hook split."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Claude Plugin

Skill for every agent authoring, reviewing, or packaging a Claude Code plugin. Load this skill when a task touches `plugins/`, `.claude-plugin/`, plugin manifests, hook registration for an installed plugin, or the `sync-plugin-package.sh` resync workflow.

---

## General Claude Code plugin authoring guide

### What is a Claude Code plugin

A Claude Code plugin is a self-contained directory that ships skills, agents, and/or hooks to Claude Code. When a user installs a plugin, Claude Code copies the plugin contents into its local plugin store and registers the components. The plugin directory is identified by a `.claude-plugin/` subdirectory at its root that holds the `plugin.json` manifest.

### The plugin.json manifest

The manifest lives at `<plugin-root>/.claude-plugin/plugin.json`. Only `name` is required. All other keys are optional but strongly recommended:

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
  "keywords": ["tag1", "tag2"],
  "skills": "./skills/",
  "agents": [
    "./agents/manager.md",
    "./agents/executor.md"
  ],
  "hooks": "./hooks/hooks.json"
}
```

Key points about the manifest:

- **`name`** — required, must be unique. Identifies the plugin in install commands and the marketplace.
- **`version`** — when omitted, Claude Code uses the git SHA of the commit as the version. You MUST bump `version` explicitly in the manifest for installers to receive updates via `claude plugin update` — a SHA-only version never increments from the installer's perspective.
- **`author`** — an OBJECT with `name` (and optionally `email`, `url`) — NOT a bare string. A bare string is not the correct schema.
- **Component paths are relative to the plugin ROOT** (the directory that contains `.claude-plugin/`). They do NOT point inside `.claude-plugin/`. For example, `"skills": "./skills/"` means `<plugin-root>/skills/` — the `.claude-plugin/` subdirectory only holds `plugin.json`.

### Component keys — skills vs agents (ADDS-to vs REPLACES asymmetry)

> **Critical footgun — read before authoring.**

The two main component keys have opposite default-override semantics:

| Key | Type | Semantic |
|---|---|---|
| `skills` | `string` (dir) or `string[]` (dirs) | **ADDS-TO** the default skill set. The installed plugin's skills are merged with whatever the user already has. |
| `agents` | `string[]` (array of file paths) | **REPLACES** the default agent set. If you supply `agents`, the user's default agents are entirely replaced with the plugin's list. |

**Consequence for plugin authors:** if you ship `agents`, every agent file you want available must be listed — the default agents are gone. If you only want to extend agents, you cannot: you must list all desired agents explicitly. Omitting `agents` entirely leaves the default agents intact.

An `agents` array with even one entry replaces all defaults. An `agents` array with zero entries is equivalent to removing all agents. Ship `agents` only when you intend to define the complete agent set for the user.

### hooks — hooks.json structure

The `hooks` key in `plugin.json` points to a `hooks.json` file (conventionally at `<plugin-root>/hooks/hooks.json`). The hooks.json must have a top-level `"hooks"` key:

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

### Install behavior — copies real files, skips symlinks (security constraint)

When a user runs `claude plugin install`, Claude Code:

1. Copies all files from the plugin directory into the user's local plugin store.
2. **Skips any symlink that escapes the plugin root** (i.e., a symlink whose target resolves outside the plugin directory). This is a security constraint: plugins cannot use symlinks to read arbitrary host files.

**Critical consequence:** the plugin package directory must contain **real files**, not symlinks pointing outside the plugin root. If your canonical skill files live at `.gobbi/projects/{name}/skills/` and your plugin directory only contains symlinks into that canonical tree, the installer will skip those symlinks and the installed plugin will have empty skill directories.

Use a materialization step (a script that copies real files into the plugin directory before publishing) to ensure the package ships only real files.

### Version cadence

- Omitting `version` in `plugin.json` means the installed version is pinned to the git SHA of the commit at install time. Users running `claude plugin update` will NOT receive updates unless `version` changes.
- Bump `version` in `plugin.json` with every meaningful content change. Semantic versioning (`MAJOR.MINOR.PATCH`) is conventional.

### CLI flow — validate, install, update

```bash
# Validate a local plugin directory (strict mode recommended)
claude plugin validate --strict ./plugins/my-plugin

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

`claude plugin validate --strict ./plugins/my-plugin` is the gate check before publishing or committing. It validates `plugin.json`, component references, and hook schemas.

---

## gobbi

### Package layout

The gobbi plugin is a bounded package under `plugins/gobbi/`. The package contains exactly these top-level entries:

```
plugins/gobbi/
  .claude-plugin/
    plugin.json          ← manifest (name, version, author, skills/agents/hooks keys)
  skills/                ← 19 materialized skill dirs (real files, no symlinks)
  agents/                ← 5 materialized agent .md files
  hooks/
    hooks.json           ← hook registration (3 events, ${CLAUDE_PLUGIN_ROOT} references)
    session-start.sh     ← SessionStart hook script (copied from .claude/hooks/)
    post-tool-use-agents.sh  ← PostToolUse/PostToolUseFailure hook script
```

The repo-root `.claude-plugin/marketplace.json` is NOT inside the plugin directory — it is the marketplace index pointing at `"source": "./plugins/gobbi"`.

### Materialization via sync-plugin-package.sh

The package is **materialized** — canonical source files are copied into `plugins/gobbi/` by `scripts/sync-plugin-package.sh`. Never edit files inside `plugins/gobbi/` directly; edit the canonical sources and re-sync.

Canonical sources:

| Component | Canonical source | Package target |
|---|---|---|
| Skills | `.gobbi/projects/gobbi/skills/*/` | `plugins/gobbi/skills/*/` |
| Agents | `.gobbi/projects/gobbi/agents/*.md` | `plugins/gobbi/agents/*.md` |
| Hooks | `.claude/hooks/{session-start,post-tool-use-agents}.sh` | `plugins/gobbi/hooks/` |

**Re-sync trigger:** any commit touching canonical `skills/`, `agents/*.md`, or `.claude/hooks/*.sh` must re-materialize the package in the same commit by running:

```bash
bash scripts/sync-plugin-package.sh
```

Then stage and commit the updated `plugins/gobbi/` contents together with the canonical change.

**Allow-set gate:** after re-syncing, run:

```bash
bash scripts/sync-plugin-package.sh --check
```

This verifies that `plugins/gobbi/` contains only the four allowed top-level entries (`.claude-plugin`, `skills`, `agents`, `hooks`), that all canonical sources match the package byte-for-byte, and that zero symlinks exist in the package. The `--check` must exit 0 before committing a re-sync.

The sync script uses `rsync --delete` so removed canonical skill dirs are also removed from the package (idempotent, safe to re-run).

### DD-8 — dev-vs-installed hook split (Option C)

The gobbi hooks exist in two registrations:

| Registration | Location | Active when |
|---|---|---|
| Dev registration | `.claude/settings.json` (hooks key) | Developing in-repo (worktree or main tree); hooks fire directly from `.claude/hooks/*.sh` |
| Installed registration | `plugins/gobbi/hooks/hooks.json` | Plugin installed via `claude plugin install`; hooks fire from `${CLAUDE_PLUGIN_ROOT}/hooks/*.sh` |

This is **Option C** of the dev-vs-installed hook design: two separate registrations rather than a single unified path. The accepted trade-off is a **double-fire caveat**: on a machine that both develops in-repo AND has the plugin installed, both registrations are active and each hook fires twice per event. This is an accepted inconvenience for solo development; it does not corrupt state (the hook is idempotent on re-entry) but produces duplicate log entries.

Do not collapse the two registrations into one — the dev registration must use bare relative paths (`.claude/hooks/...`) to work from a checked-out worktree without the plugin installed.

### agents REPLACES vs skills ADDS-to — applied to this package

The gobbi plugin ships `agents` as an explicit array of 5 file paths (manager, leader, executor, evaluator, assistant). This REPLACES the user's default agents when the plugin is installed. Every agent the user needs must be in this list — there is no partial merge.

The `skills` key uses a directory pointer (`"./skills/"`), which ADDS-TO the default skill set. The 19 gobbi skills are merged with whatever the user already has.

### Skills shipped by the package (19 total)

The package ships all 19 canonical skills:

`codex`, `delegation`, `discussion`, `evaluation`, `execution`, `git`, `gobbi`, `gobbi-hook-authoring`, `ideation`, `interview`, `memorization`, `mistake`, `orchestration`, `planning`, `preparation`, `principles`, `research`, `wrap-up`, `claude-plugin`

The `claude-plugin` skill (this file) is skill 19. The canonical source lives at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md`; the workspace-visible mirror is `.claude/skills/claude-plugin/SKILL.md` (a symlink). The package copy at `plugins/gobbi/skills/claude-plugin/SKILL.md` is a materialized real file produced by `sync-plugin-package.sh`.

### Pointer to the claude-plugin skill

Skill: `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` (canonical)
Mirror: `.claude/skills/claude-plugin/SKILL.md` (symlink, workspace-visible)
Package: `plugins/gobbi/skills/claude-plugin/SKILL.md` (materialized real file)
