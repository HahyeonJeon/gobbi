---
name: plugin-cache-symlink-dereferencing-and-path-traversal
title: "Claude Code plugin caching — symlink dereferencing + path-traversal limits"
source: "https://code.claude.com/docs/en/plugins-reference#plugin-caching-and-file-resolution"
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-cache, symlinks, path-traversal, marketplace]
accessed: 2026-05-30
ref_type: documentation
---

# Plugin caching: symlinks are dereferenced/skipped on install; no `../` traversal

## Insight

Marketplace plugins are COPIED into `~/.claude/plugins/cache` on install (not used in place). This has two
load-bearing consequences for gobbi, whose `.claude/skills/*` and `.claude/agents/*` are symlinks into
`.gobbi/projects/gobbi/`:

1. **Path traversal forbidden**: "Installed plugins cannot reference files outside their directory. Paths
   that traverse outside the plugin root (such as `../shared-utils`) will not work after installation."
2. **Symlink resolution depends on target location** when copying into cache:
   - target **within the plugin's own dir** → preserved as relative symlink (works);
   - target **elsewhere within the same marketplace** → dereferenced (content copied in);
   - target **outside the marketplace** → skipped for security.
   - For `--plugin-dir` / local-path installs: ONLY symlinks resolving within the plugin's own dir are
     preserved; all others skipped.

This means gobbi's current `.claude/skills/<skill>/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/...`
symlinks point OUTSIDE a hypothetical plugin rooted at `.claude/` (they escape into `.gobbi/`), so a plugin
that simply pointed `skills` at `.claude/skills/` would have its skill content SKIPPED on a real
marketplace/local install. **The ratified solution (DD-2 + DD-2a):** use a dedicated bounded package
directory whose `skills/`, `agents/`, and `hooks/` contain MATERIALIZED real file copies — no
escaping symlinks. This is the only approach proven to survive the install-time copy (prior art c79d28e, #251).

## Why it applies

Establishes why escaping symlinks cannot be used in the plugin package and why component files must be
MATERIALIZED real copies inside the package. This is the constraint that drove the ratified bounded-package
+ materialization approach. Any future proposal to use symlinks from the plugin package must address this
constraint first.

## Source

https://code.claude.com/docs/en/plugins-reference#plugin-caching-and-file-resolution — "Path traversal
limitations" + "Share files within a marketplace with symlinks".

## Excerpt

"Installed plugins cannot reference files outside their directory. Paths that traverse outside the plugin
root (such as ../shared-utils) will not work after installation because those external files are not copied
to the cache." … "Outside the marketplace: the symlink is skipped for security."
