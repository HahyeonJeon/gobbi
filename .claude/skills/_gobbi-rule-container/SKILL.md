---
name: _gobbi-rule-container
description: Container skill for _gobbi-rule. Holds the rule JSON and MD source files that get symlinked into .claude/rules/ at session start. Plugin updates automatically propagate to the rule via symlinks.
---

# Gobbi Rule Container

Container for the `_gobbi-rule` behavioral rule file. The source files live here; symlinks in `.claude/rules/` point back to this skill directory. When the gobbi plugin is updated, the rule content updates automatically because the symlinks follow the source.

This skill is not loaded by agents during workflow. It exists solely to hold the rule files in a plugin-distributable location.



---

## Files

| File | Purpose |
|---|---|
| `_gobbi-rule.json` | JSON source for the core behavioral rule |
| `_gobbi-rule.md` | Generated markdown from the JSON source |

---

## Symlink Mechanism

At session start, the gobbi skill checks whether `.claude/rules/_gobbi-rule.json` and `.claude/rules/_gobbi-rule.md` exist in `$CLAUDE_PROJECT_DIR`. If either is missing, it creates symlinks from `.claude/rules/` pointing to the files in this skill directory. The plugin installation path varies per user, so the orchestrator resolves the correct path at runtime.
