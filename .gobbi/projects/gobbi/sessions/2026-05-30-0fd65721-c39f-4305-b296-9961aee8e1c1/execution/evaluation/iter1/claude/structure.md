# Structure Perspective — claude iter1

VERDICT: PASS

## Frame
Is the package layout, manifest schema, and file organization structurally correct per the Claude Code plugin contract and the bounded-package decision?

## Checks
- Package root `plugins/gobbi/` top level is EXACTLY {.claude-plugin, skills, agents, hooks} — verified via `find -mindepth1 -maxdepth1`: 4 entries, nothing else. PASS.
- `.claude-plugin/plugin.json` sits in the manifest subdir (not at plugin root) — correct; component path "./skills/" points to plugin-root/skills not into .claude-plugin. PASS.
- skills key = string dir-pointer "./skills/" (ADDS-to). agents key = array of 5 relative .md paths (REPLACES). hooks key = "./hooks/hooks.json". Matches schema asymmetry documented in claude-plugin skill. PASS.
- marketplace.json at REPO ROOT `.claude-plugin/` (not inside plugin dir). plugins[0].source "./plugins/gobbi" (no trailing slash, bare relative). PASS.
- hooks.json top-level "hooks" key with event arrays of matcher-objects each holding a "hooks" array of command objects. Structurally schema-correct. PASS.
- Mirror symlink `.claude/skills/claude-plugin/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` — depth (`../../../`) matches sibling `git` mirror exactly. No depth error (cf. symlink-restore-depth-wrong). PASS.
- Materialized files are REAL (find -type l empty across skills/agents/hooks). PASS.

## Findings
None.

The structure is byte-faithful to canonical and schema-faithful to the Claude plugin contract. The 4-entry allow-set is the structural invariant and it holds; the guard enforces it mechanically.

## Must-preserve
- 4-entry bounded top level.
- Mirror symlink relative depth parity with siblings.
- plugin.json component-path semantics (dir-pointer for skills, file-array for agents).
