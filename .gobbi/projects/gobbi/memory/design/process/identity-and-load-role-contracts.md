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
  `.codex/agents/` by `gobbi-setup`.
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
roles `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`. A reviewer adds `VERDICT` on complete work.

## Conditional domain load map

Domain families change conditional loads, not the five-role set or role procedures. Leader, Executor, and
Reviewer below name the load map, not a requirement to restore those pipeline files. The same semantic map
appears in all four canonical runtime variants.

| Role | Conditional load | Boundary |
|---|---|---|
| Manager | Load the matching domain root — [Coding](../../../skills/coding/SKILL.md), [Authoring](../../../skills/authoring/SKILL.md), or [Design](../../../skills/design/SKILL.md) — when any direct child may apply to the current bounded unit, and use the root only to discover every matching child. In General, sequence matching children as dependencies become current. In Cowork or Workflow, keep the mode primary and select matching children inside existing stages. | The root owns no sequence, state, or conduct. General retains sequencing, re-entry, and acceptance; each mode retains its paths, gates, policies, and handoff. |
| Leader | Load the matching domain ideation skill for an unresolved material design choice: [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md), [Authoring Ideation](../../../skills/authoring/authoring-ideation/SKILL.md), or [Design Ideation](../../../skills/design/design-ideation/SKILL.md). Load the matching domain planning skill when decomposition is needed: [Coding Planning](../../../skills/coding/coding-planning/SKILL.md), [Authoring Planning](../../../skills/authoring/authoring-planning/SKILL.md), or [Design Planning](../../../skills/design/design-planning/SKILL.md). | Generic Ideation and Generic Planning are gone. The leader does not implement or review. |
| Executor | Load the matching domain execution skill when the settled writer frontier matches that domain: [Coding Execution](../../../skills/coding/coding-execution/SKILL.md), [Authoring Execution](../../../skills/authoring/authoring-execution/SKILL.md), or [Design Execution](../../../skills/design/design-execution/SKILL.md). In explicit review-only mode, load the matching domain review skill instead. | Generic Execution is gone. Implementation and review-only modes are mutually exclusive. Review-only writes only the caller-bound report, changes no subject, never stages or commits, and issues no verdict. |
| Reviewer | Load the matching domain review skill for independent review: [Coding Review](../../../skills/coding/coding-review/SKILL.md), [Authoring Review](../../../skills/authoring/authoring-review/SKILL.md), or [Design Review](../../../skills/design/design-review/SKILL.md). | Generic Evaluation is gone. Domain Review writes `report.md` and working `checklist.md`. Cowork owns the user-called `review` call. Workflow owns stage REVIEW. |
| Assistant | No domain-family load change. | Narrow lookup and authorized Memory assistance do not become lifecycle implementation or review. |

An executor in review-only mode may provide independent review when not the author. An author may provide only
caller-permitted disclosed self-review. The report remains non-gating in either case. See the
[Coding skill family](../feature/coding-skill-family.md), [Authoring skill family](../feature/authoring-skill-family.md),
and [Design skill family](../feature/design-skill-family.md).

Former evaluator loads of Generic Evaluation and both evaluation templates are gone. Cowork still
names `review`, `report.md`, working `checklist.md`, and `review-depth`. Domain Review is the
independent-review writer, not a second mode owner.

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
