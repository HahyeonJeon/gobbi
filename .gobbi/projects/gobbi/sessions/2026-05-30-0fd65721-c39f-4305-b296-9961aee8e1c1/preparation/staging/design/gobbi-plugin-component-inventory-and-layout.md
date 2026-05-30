---
name: gobbi-plugin-component-inventory-and-layout
description: Concrete component inventory (18 skills, 5 agent .md, 2 hook scripts / 3 registrations) and resolved package layout (plugins/gobbi/) for the gobbi Claude Code plugin.
type: design
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, inventory, layout, materialization]
supersedes: null
superseded_by: null
related:
  - ideation/staging/design/gobbi-plugin-bounded-package.md
  - preparation/staging/decisions/bounded-package-root-and-marketplace-source-resolved.md
---

# gobbi Claude Code Plugin — resolved layout + component inventory

Concretizes the Ideation bounded-package design (`ideation/staging/design/gobbi-plugin-bounded-package.md`) with the live-verified component inventory and the resolved root path. All counts verified against the worktree on 2026-05-30.

## Resolved layout

```
<repo-root>/
  .claude-plugin/
    marketplace.json          # Claude schema; plugins[].source = "./plugins/gobbi"
  plugins/gobbi/              # bounded package; allow-set = these 4 subtrees only
    .claude-plugin/
      plugin.json             # name: gobbi, skills "./skills/", agents [5 .md], hooks "./hooks/hooks.json"
    skills/                   # 18 real-copy skill dirs (DD-2a)
    agents/                   # 5 real-copy .md role agents (NO .toml)
    hooks/
      hooks.json              # 3 event registrations via ${CLAUDE_PLUGIN_ROOT}
      session-start.sh        # real copy, body unchanged, +x
      post-tool-use-agents.sh # real copy, body unchanged, +x
```

## Skills (18 — RATIFIED: package all)

`codex, delegation, discussion, evaluation, execution, git, gobbi, gobbi-hook-authoring, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up`

- Source of truth: `.gobbi/projects/gobbi/skills/` (18 dirs, verified).
- **RATIFIED (manager auto-decide 2026-05-30, completeness — not a trade-off): package all 18.**
- `gobbi-hook-authoring` is canonical-only (NOT in the `.claude/skills/` symlink mirror). It IS packaged — it is a load-bearing skill (the stack the 2 packaged hook scripts are built on). Mirror-coverage omission is a separate concern, not an exclusion signal.
- There is NO `claude` skill in the canonical tree (the `skills/claude/SKILL.md` link in `CLAUDE.md` is a known dangling reference, FLAG-2); the 18-skill inventory correctly excludes it.
- Materialize every file under each skill dir (SKILL.md + any child docs/templates) as REAL copies.

## Agents (5 .md only)

`manager.md, leader.md, executor.md, evaluator.md, assistant.md` — the `agents` manifest key is a FILE-PATH ARRAY that REPLACES the default; the 5 `.toml` Codex wrappers (also present in canonical `agents/`) are EXCLUDED.

## Hooks (2 scripts / 3 registrations)

- Scripts: `session-start.sh`, `post-tool-use-agents.sh` (real files in `.claude/hooks/`, verified, +x).
- `hooks.json` reproduces the LIVE `.claude/settings.json` shape (NOT the deprecated `gobbi-dev`-CLI 28-event `e083fad^` hooks.json):
  - `SessionStart` matcher `startup|resume|clear|compact` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh`
  - `PostToolUse` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
  - `PostToolUseFailure` matcher `Task|Agent` → `"${CLAUDE_PLUGIN_ROOT}"/hooks/post-tool-use-agents.sh`
- Bodies UNCHANGED; portability confirmed (scripts resolve targets from runtime `$cwd`/`$CLAUDE_ENV_FILE`, not own path).
- Per RATIFIED DD-8 Option C, this `hooks.json` (installed users) coexists with the in-repo `.claude/settings.json` block (dev) — the two MUST be kept coherent.

## Manifest fields (plugin.json)

`name: gobbi` (required) · version/description/author/license/keywords (e083fad^ template) · `skills: "./skills/"` (ADDS-to) · `agents: ["./agents/manager.md", "./agents/leader.md", "./agents/executor.md", "./agents/evaluator.md", "./agents/assistant.md"]` (REPLACES) · `hooks: "./hooks/hooks.json"`.

## Marketplace fields (.claude-plugin/marketplace.json)

`name` (kebab) · `owner` {name, email — e083fad^ owner block} · `plugins: [{ name: "gobbi", source: "./plugins/gobbi", description, version }]`.

## Validation hooks (carried from Ideation)

`claude plugin validate --strict ./plugins/gobbi`; cache-contents allow-set gate; worktree-sentinel assertion; fire-exactly-once (keyed on hook_event_name, with deterministic per-event triggers including a non-zero-exit agent for PostToolUseFailure); `readlink` on the claude-plugin mirror; auto-grant invocability check targeting the omitted `codex` + `gobbi-hook-authoring` skills + one agent.
