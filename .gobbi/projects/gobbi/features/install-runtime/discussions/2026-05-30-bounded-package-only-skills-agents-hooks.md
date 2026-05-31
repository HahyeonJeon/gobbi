---
name: bounded-package-only-skills-agents-hooks
description: User ratified that the gobbi plugin ships ONLY skills + agents + hooks — nothing else; overturns iter-1 repo-root DD-2
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, bounded-package, layout, dd-2]
outcome: Plugin is a dedicated bounded package with ONLY skills+agents+hooks; overturns iter-1 repo-root DD-2
---

# Plugin Ships ONLY Skills + Agents + Hooks — Bounded Package (Overturns iter-1 DD-2)

## Context

The iter-1 design (DD-2) had the manager auto-decide: point the plugin at the repo root and have the manifest reference the canonical `.gobbi/projects/gobbi/skills|agents/` directories directly. This was forced by the discovery that escaping symlinks (from `.claude/skills/*` into `.gobbi/`) are SKIPPED on install-time copy.

However, Codex evaluation (iter-1) surfaced two additional issues with the repo-root approach:
- **R1 (High/75):** A repo-root plugin source would copy the full 77M `.gobbi/.../sessions` tree into the global plugin cache — every session's jsonl, state.json, and memory — because the marketplace copies the entire source dir.
- **S1 (High/75):** The `agents` key in the manifest takes file paths, not a directory; the canonical `.gobbi/.../agents/` dir mixes `.md` (Claude role agents) and `.toml` (Codex wrappers), so a directory pointer would expose the wrong files.

After the manager verified both issues, the user was asked to re-decide the plugin layout.

## Question

Given the R1 cache-payload risk and S1 agent-field shape constraint, should the plugin: (a) continue with the repo-root approach (accepting the payload risk + handling S1 via explicit file paths from the repo root), or (b) use a dedicated self-contained package directory containing ONLY the three component types (skills + agents + hooks)?

## Options considered

- **Option (a) — Repo-root with explicit file paths:** The manifest `skills`/`agents`/`hooks` fields point directly at canonical `.gobbi/` paths from the repo root. Pros: no duplication. Cons: the install-time copy of the entire repo root captures the 77M sessions tree; package is not self-contained; every path must be explicitly maintained.
- **Option (b) — Dedicated bounded package:** A new dedicated directory containing `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/` only — nothing else. Install copies ONLY what is in the package. Pros: no session memory in cache; explicitly bounded payload; matches the proven `plugins/gobbi-core` subtree shape. Cons: creates a materialize/drift surface.

## User decision

**Option (b) — Dedicated, self-contained package directory.** The plugin ships ONLY `skills/` + `agents/` + `hooks/` inside a bounded package. No session memory, no `.gobbi/` project tree, no repo content, no README or settings.json.

This overturns the iter-1 ratified DD-2 ("root at repo root, point at canonical .gobbi dirs"). The new decision is documented as DD-2 (REPLACED) in the iter-2 draft and the canonical Ideation artifact.

## Implication

The bounded package creates a materialize/drift surface (DD-2a): canonical-tree edits require re-syncing the package copies. The `claude-plugin` skill must document this obligation and a named re-sync trigger. Planning must name the concrete package root path and the marketplace `source` value (see `decisions/bounded-package-root-and-marketplace-source-resolved.md`).

The R1 risk is resolved: only skills/agents/hooks land in the global plugin cache. The S1 risk is resolved: the `agents` field enumerates exactly the 5 `.md` Claude role agent paths inside the package.
