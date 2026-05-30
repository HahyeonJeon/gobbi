---
title: "Claude Code marketplace.json schema + skills-directory in-place plugins"
source: "https://code.claude.com/docs/en/plugin-marketplaces"
type: reference
accessed: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, marketplace-json, skills-dir, local-source, install]
---

# marketplace.json schema + the no-install @skills-dir mode

## Insight
`marketplace.json` lives at `.claude-plugin/marketplace.json`. Required fields: `name` (kebab-case),
`owner` (object, `name` required), `plugins` (array). Each plugin entry requires `name` + `source`.
`source` for a same-repo plugin is a relative path string starting with `./`, resolved relative to the
**marketplace root** (the dir containing `.claude-plugin/`), and works only when the marketplace is added
via git. The repo's existing Codex `.agents/plugins/marketplace.json` uses an `{"source":"local","path":"./"}`
object shape — that is the OpenAI/Codex agents-marketplace schema, NOT the Claude Code schema; Claude Code's
relative-path source is a bare `"./..."` string. Install/update/uninstall CLI: `/plugin marketplace add`,
`/plugin install <name>@<marketplace>`, `/plugin marketplace update`, `/plugin uninstall`.

SEPARATELY, Claude Code supports a **skills-directory plugin** (`@skills-dir`): any folder under a skills
dir (`~/.claude/skills/` personal, or `<cwd>/.claude/skills/` project-trust-gated) that contains a
`.claude-plugin/plugin.json` loads in place as `<name>@skills-dir` with NO marketplace and NO copy —
"discovered in place rather than copied into the plugin cache." This is the ONLY mode that tolerates the
existing symlink mirror untouched, but it has constraints: project-scope `@skills-dir` plugins load only
from the `.claude/skills/` of the launch dir (no walk-up to repo root) and need workspace trust.

## Why it applies
Decides whether a `marketplace.json` is in scope this session and how it must be shaped (Claude schema, not
the Codex object schema already in the repo), and surfaces a genuine alternative (in-place @skills-dir) to
the marketplace-install model.

## Source
https://code.claude.com/docs/en/plugin-marketplaces — "Marketplace schema", "Plugin sources" →
"Relative paths"; and https://code.claude.com/docs/en/plugins-reference#skills-directory-plugins.

## Excerpt
"Each plugin entry needs at minimum a `name` and `source`." … "Relative path … Must start with `./`.
Resolved relative to the marketplace root, not the `.claude-plugin/` directory." … "Any folder under a
skills directory that contains a `.claude-plugin/plugin.json` manifest is loaded as a plugin named
`<name>@skills-dir` on the next session, with no marketplace and no install step."
