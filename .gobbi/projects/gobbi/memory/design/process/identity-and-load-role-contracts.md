# Identity-and-load role contracts

## Intent

Each Gobbi role file is a load map, not a second procedure owner. Skills own shared procedure. Role files
keep who the role is, how it behaves, what it loads, what it never does, and which status it returns.

## File set

- Canonical source: 20 contracts under `.gobbi/projects/gobbi/agents/{claude,grok,codex,cursor}/`.
- Plugin projection: five Claude-fronted Markdown files at `plugins/gobbi/agents/{role}.md`, flattened from
  `agents/claude/`, plus the other runtimes at `plugins/gobbi/runtimes/{codex,cursor,grok}/{role}.*`. The
  package cannot nest them under `agents/`, because a plugin's `agents/` directory is scanned recursively and
  each subfolder becomes part of the agent's scoped identifier. Grok and Cursor declare their own paths in
  their manifests; Codex custom agents are still not a plugin component and are written into a consumer's
  `.codex/agents/` by `gobbi/setup`.
- Follow surfaces: `.claude/agents`, `.grok/agents`, `.codex/agents`, `.cursor/agents`, and Grok-shaped
  `.agents/agents`.

Do not add a role, remove a role, or create a new role skill.

## Role-file shape

Order: runtime frontmatter; H1 and identity; one runtime-metadata sentence; characteristics; skills to load;
out of scope; status. No Lifecycle, Before You Start protocol, Continuation, Red Flags, Quality Expectations,
Decision Discipline, or TypeScript / Codebase Constraints section.

Specialists load Delegation first and validate the supplied or derived root pair. Manager is never briefed.
Manager roots come from Gobbi 1.1. Specialist Codex wrappers name Delegation. `codex/manager.toml` keeps
Gobbi 1.1 and does not run `NO_GOBBI_ROOT`.

Status stays role-owned: manager `PROCEED` / `PROCEED_WITH_CONCERNS` / `NEEDS_DECISION` / `BLOCKED`; other
roles `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`. Evaluator adds `VERDICT` on complete work.

## Ownership

| Subject | Owner |
|---|---|
| Manager entry and manager root resolution | [Gobbi](../../../skills/gobbi/SKILL.md) 1.1 |
| Specialist root-pair protocol and `NO_GOBBI_ROOT` | [Delegation](../../../skills/delegation/SKILL.md) |
| Continuation write-safety | [Git](../../../skills/git/SKILL.md) |
| Locator acquire/derive/validate at entry | [Plugin skill and agent locator](../architecture/plugin-skill-locator.md) |

## References

- Canonical Delegation and Git skills, and their plugin copies, hold the moved protocol.
- [2026-08-16 session history](../../history/2026-08-16-gobbi-v1-2-0.md)
