---
title: "Claude Code plugin caching — symlink dereferencing + path-traversal limits"
source: "https://code.claude.com/docs/en/plugins-reference#plugin-caching-and-file-resolution"
type: reference
accessed: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-cache, symlinks, path-traversal, marketplace]
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
   - target **elsewhere within the same marketplace** → dereferenced (content copied in) — "lets a
     meta-plugin's skills/ directory link to skills defined by other plugins in the marketplace";
   - target **outside the marketplace** → skipped for security.
   - For `--plugin-dir` / local-path installs: ONLY symlinks resolving within the plugin's own dir are
     preserved; all others skipped.

This means gobbi's current `.claude/skills/<skill>/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/...`
symlinks point OUTSIDE a hypothetical plugin rooted at `.claude/` (they escape into `.gobbi/`), so a plugin
that simply pointed `skills` at `.claude/skills/` would have its skill content SKIPPED on a real
marketplace/local install. **The correct solution (iter-2 ratified DD-2 + DD-2a):** use a dedicated bounded
package directory whose `skills/`, `agents/`, and `hooks/` contain MATERIALIZED real file copies — no
escaping symlinks. This is the only approach proven to survive the install-time copy (prior art c79d28e
#251). The repo-root option (a) and the `@skills-dir` in-place-discovery option (b) from the iter-1
framing are both SUPERSEDED by the iter-2 user decision. Do not use either; the bounded-package
materialization path is the ratified approach.

## Why it applies
Establishes why escaping symlinks cannot be used in the plugin package and why component files must be
MATERIALIZED real copies inside the package. This is the constraint that drove the iter-2 ratified DD-2
(bounded self-contained package) and DD-2a (materialize real copies). The iter-1 framing ("root at repo
root" or "@skills-dir") is superseded; this reference now serves as the explanation for WHY the
bounded-package + materialization approach is mandatory, not as a guide for choosing between repo-root and
bounded-package. (Note: the verbatim doc excerpts below remain factually accurate — only the interpretive
conclusion above has been updated to reflect the iter-2 ratified decision.)

## Source
https://code.claude.com/docs/en/plugins-reference#plugin-caching-and-file-resolution — "Path traversal
limitations" + "Share files within a marketplace with symlinks".

## Excerpt
"Installed plugins cannot reference files outside their directory. Paths that traverse outside the plugin
root (such as ../shared-utils) will not work after installation because those external files are not copied
to the cache." … "Outside the marketplace: the symlink is skipped for security."
