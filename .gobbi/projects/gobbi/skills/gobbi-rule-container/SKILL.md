---
name: gobbi-rule-container
description: Container for gobbi-rule behavioral rule files. Symlinked into .claude/rules/ at session start.
---

# Gobbi Rule Container

Container for the `gobbi-rule` behavioral rule file. The source file lives here; a symlink in `.claude/rules/` points back to this skill directory. When the gobbi plugin is updated, the rule content updates automatically because the symlink follows the source.

This skill is not loaded by agents during workflow. It exists solely to hold the rule files in a plugin-distributable location.



---

## Files

| File | Purpose |
|---|---|
| `gobbi-rule.md` | Core behavioral rule — always-active invariants for all agents |

---

## Symlink Mechanism

At session start, the gobbi skill checks whether `.claude/rules/gobbi-rule.md` exists in `$CLAUDE_PROJECT_DIR`. If it is missing, it creates a symlink from `.claude/rules/` pointing to `gobbi-rule.md` in this skill directory. The plugin installation path varies per user, so the orchestrator resolves the correct path at runtime.
