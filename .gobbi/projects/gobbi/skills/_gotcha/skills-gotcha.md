# Skills Gotcha

Skill-specific gotchas live inside the skill directory they serve: `$CLAUDE_PROJECT_DIR/.claude/skills/{skill-name}/gotchas.md`, alongside the skill's `SKILL.md`.

---

## Core Principle

> **Gotchas belong to the skill they correct.**

A gotcha about `_plan` belongs in `$CLAUDE_PROJECT_DIR/.claude/skills/_plan/gotchas.md`. The agent loading `_plan` reads its own gotchas without loading a separate skill. Locality ensures the agent always checks gotchas — no extra loading step to forget.

> **Cross-cutting gotchas stay in `_gotcha/`.**

The `_gotcha` skill holds entries that span multiple skills or belong to no single skill — infrastructure, environment, security, system-level concerns. If a gotcha can be owned by one skill, it belongs in that skill's directory.

---

## What Goes Where

**Write to `$CLAUDE_PROJECT_DIR/.claude/skills/{skill-name}/gotchas.md`** when:
- The gotcha directly corrects behavior that happens while executing that skill
- The agent making the mistake was working within the skill's scope

**Write to `_gotcha/` central files** when:
- The gotcha cuts across multiple skills and cannot be owned by one
- No single skill exists yet for the domain (infrastructure, environment, security)

---

## Migration

Existing entries in `_gotcha/{skill}.md` central files are not automatically moved. They remain valid and readable. When you update or reference an entry from a central file, move it to the skill's own `gotchas.md` if it belongs there. Do not leave duplicates — delete the central entry after moving.

The `_gotcha/` central files for skill-specific gotchas (`_orchestration.md`, `_plan.md`, etc.) will gradually empty as entries migrate to their owning skills. Cross-cutting files (`__system.md`, `__security.md`) remain in `_gotcha/` permanently.
