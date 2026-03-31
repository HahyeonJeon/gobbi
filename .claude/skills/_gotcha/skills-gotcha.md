# Skills Gotcha

The future direction for gotcha recording moves ownership to each skill: a `gotchas.md` file lives inside the skill directory it serves, alongside the skill's `SKILL.md`. This is a shift from the current model where all gotchas aggregate in a shared `_gotcha/` skill.

---

## Core Principle

> **Gotchas belong to the skill they correct.**

A gotcha about `_plan` belongs in `_plan/gotchas.md`. The agent loading `_plan` can read its own gotchas without loading a separate skill. Locality reduces the chance an agent skips the check because loading `_gotcha` feels like extra work.

> **Per-skill gotchas are self-contained. Central files are a historical record.**

The existing `_gotcha/{skill}.md` files remain as reference. They are not deleted or replaced during migration — they hold entries that have not yet been moved. New entries go to the skill's own directory; old entries stay in the central files until explicitly migrated.

---

## The Two Models

**Current (centralized):** All gotchas collect in `_gotcha/`. The file name matches the skill it covers — `_gotcha/_plan.md` holds plan gotchas. Loading gotchas requires loading a separate skill (`_gotcha`) and then reading the relevant file inside it.

**Future direction (per-skill):** Each skill directory contains its own `gotchas.md`. An agent loading `_plan` can immediately read `_plan/gotchas.md` without navigating to a different skill. The `_gotcha` skill becomes a router and a home for cross-cutting entries that do not belong to any single skill.

---

## What Goes Where

**Write to the skill's `gotchas.md`** when:
- The gotcha directly corrects behavior that happens while executing that skill
- The agent making the mistake was working within the skill's scope
- The entry would appear in the skill's existing central file (e.g., `_gotcha/_plan.md`)

**Write to `_gotcha/` central files** when:
- The gotcha cuts across multiple skills and cannot be owned by one
- No single skill exists yet for the domain (infrastructure, environment, security)
- The entry is cross-project and still under review before migration

---

## Migration Path

New gotchas go to the skill's own `gotchas.md`. Create the file if it does not exist yet — there is no ceremony required.

Existing entries in `_gotcha/{skill}.md` are not moved automatically. They remain valid and readable. When you update or reference an entry from a central file, consider whether that entry should now live in the skill's own directory instead. Move it when the opportunity arises; do not leave duplicates.

The transition is gradual by design. A partial migration — where some skills have their own `gotchas.md` and others still rely on the central file — is the expected state, not a problem to fix.
