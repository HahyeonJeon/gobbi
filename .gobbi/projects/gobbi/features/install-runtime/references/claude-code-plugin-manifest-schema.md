---
name: claude-code-plugin-manifest-schema
title: "Claude Code Plugins reference — plugin.json manifest schema + component conventions"
source: "https://code.claude.com/docs/en/plugins-reference"
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-json, schema, hooks, skills, agents, CLAUDE_PLUGIN_ROOT]
accessed: 2026-05-30
ref_type: documentation
---

# Claude Code plugin.json manifest schema (authoritative)

## Insight

The `.claude-plugin/plugin.json` manifest's ONLY required field is `name` (kebab-case). All component
directories (`skills/`, `agents/`, `commands/`, `hooks/`, `.mcp.json`) live at the **plugin root**, NOT
inside `.claude-plugin/` — only `plugin.json` goes in `.claude-plugin/`. Components in default dirs are
auto-discovered with NO manifest keys needed; manifest keys are only for custom/extra paths.

Key field behaviors:
- `skills`: string|array, **ADDS to** the default `skills/` dir (default always scanned). Can be a
  directory pointer like `"./custom/skills/"` — this is exactly the Codex `.codex-plugin` shape.
- `agents`/`commands`/`outputStyles`: **REPLACE** the default dir when set (footgun: differs from `skills`
  which ADDS-to). `agents` is `string|array` and the schema example is an ARRAY of FILE PATHS —
  `"agents": ["./custom/agents/reviewer.md"]` — NOT a directory pointer. So enumerate the exact agent `.md`
  files; do not pass a directory (a directory mixes in non-agent files and is the wrong shape vs the example).
- `hooks`: string|array|object — path to a `hooks/hooks.json` or inline config. Default location
  `hooks/hooks.json`. For **plugin-shipped agents**, `hooks`, `mcpServers`, `permissionMode` are NOT
  supported in agent frontmatter (security). Wrong-TYPE fields are a load error; `claude plugin validate
  --strict` also fails on unrecognized/misspelled fields (warnings → errors).
- `version`: optional; if set you MUST bump it for users to get updates; if omitted, git commit SHA is
  the version (every commit = new version) — best for fast-iterating internal/team plugins.
- `${CLAUDE_PLUGIN_ROOT}` resolves to the installed plugin dir; hook/MCP/monitor commands and even skill
  & agent CONTENT substitute it inline. Hooks reference scripts as
  `"\"${CLAUDE_PLUGIN_ROOT}\"/scripts/foo.sh"`.
- A `CLAUDE.md` at plugin root is NOT loaded as context — plugins contribute context via skills/agents/hooks.

## Why it applies

This is the exact schema the `plugins/gobbi/.claude-plugin/plugin.json` deliverable must conform to. It settles the `agents` key shape (a file-path array, so the plugin enumerates exactly the 5 role `.md` files and excludes the `.toml` Codex wrappers) and the ADDS-to vs REPLACES asymmetry the `claude-plugin` skill must teach.

## Source

https://code.claude.com/docs/en/plugins-reference — "Plugin manifest schema" → "Complete schema",
"Required fields", "Component path fields", "Path behavior rules", "Environment variables".

## Excerpt

"If you include a manifest, `name` is the only required field." …
Complete-schema example: `"skills": "./custom/skills/"`, `"agents": ["./custom/agents/reviewer.md"]`,
`"hooks": "./config/hooks.json"`. …
"Adds to the default: `skills`. The default `skills/` directory is always scanned, and directories listed in
`skills` are loaded alongside it." …
"Replaces the default: `commands`, `agents`, `outputStyles` … For example, when the manifest specifies
`commands`, the default `commands/` directory is not scanned." …
"Fields with the wrong type still fail. … `claude plugin validate` reports it as one." …
"`${CLAUDE_PLUGIN_ROOT}`: the absolute path to your plugin's installation directory."
