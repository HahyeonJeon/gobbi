# Identity-and-load role contracts

## Intent

Each Gobbi role file is a load map, not a second procedure owner. Skills own shared procedure. Role files
keep who the role is, how it behaves, what it loads, what it never does, and which status it returns.

## File set

- Canonical source: 56 contracts, fourteen roles in each of four runtimes, under
  `.gobbi/projects/gobbi/agents/{claude,grok,codex,cursor}/`.
- Plugin projection: fourteen Claude-fronted Markdown files at `plugins/gobbi/agents/{role}.md`, flattened from
  `agents/claude/`, plus the other runtimes at `plugins/gobbi/runtimes/{codex,cursor,grok}/{role}.*`. The
  package cannot nest them under `agents/`, because a plugin's `agents/` directory is scanned recursively and
  each subfolder becomes part of the agent's scoped identifier. Grok and Cursor declare their own paths in
  their manifests; Codex custom agents are still not a plugin component and are written into a consumer's
  `.codex/agents/` by setup scripts.
- Follow surfaces: `.claude/agents`, `.grok/agents`, `.codex/agents`, `.cursor/agents`, and Grok-shaped
  `.agents/agents`.

The fourteen roles are manager, assistant, and, for coding, authoring, and design, a leader, a planner, an
executor, and a reviewer. Developer, designer, author, code-reviewer, and docs-reviewer are not live roles.
`design-reviewer` is the design-domain review role. A role change reaches all four runtimes, the follow
surfaces, the plugin package, setup, and docs. Do not create a role skill.

## Role-file shape

Order: runtime frontmatter; H1 with the role name and a short title; one identity paragraph;
`## Responsibility`; `## In scope`; `## Out of scope`. No Lifecycle, Before You Start protocol, Continuation,
Red Flags, Quality Expectations, Decision Discipline, or TypeScript / Codebase Constraints section.

Specialists load Delegation first and validate the supplied or derived root pair. Manager is never briefed.
Manager roots come from Gobbi 1.1. Specialist Codex wrappers name Delegation. `codex/manager.toml` keeps
Gobbi 1.1 and does not run `NO_GOBBI_ROOT`.

Status stays role-owned: manager `PROCEED` / `PROCEED_WITH_CONCERNS` / `NEEDS_DECISION` / `BLOCKED`; other
roles `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`. A reviewer adds `VERDICT` on complete work.

## Conditional domain load map

The named role matches the subject domain and the phase. Software is coding. Durable writing is authoring.
Visual work is design. Ideate is leader. Plan is planner. Implement is executor. Review is reviewer.

| Role | Conditional load | Boundary |
|---|---|---|
| Manager | Load the matching domain root — [Coding](../../../skills/coding/SKILL.md), [Authoring](../../../skills/authoring/SKILL.md), or [Design](../../../skills/design/SKILL.md) — when any direct child may apply to the current bounded unit, and use the root only to discover every matching child. In Cowork or Workflow, keep the mode primary and select matching children inside existing stages. | The root owns no sequence, state, or conduct. Each mode retains its paths, gates, policies, and handoff. |
| Leader | `coding-leader`, `authoring-leader`, or `design-leader` loads the matching domain ideation skill for an unresolved material design choice: [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md), [Authoring Ideation](../../../skills/authoring/authoring-ideation/SKILL.md), or [Design Ideation](../../../skills/design/design-ideation/SKILL.md). | The leader writes the ideation result and does not change the product or review it. |
| Planner | `coding-planner`, `authoring-planner`, or `design-planner` loads the matching domain planning skill: [Coding Planning](../../../skills/coding/coding-planning/SKILL.md), [Authoring Planning](../../../skills/authoring/authoring-planning/SKILL.md), or [Design Planning](../../../skills/design/design-planning/SKILL.md). | The planner writes the plan and does not change the product. |
| Executor | `coding-executor`, `authoring-executor`, or `design-executor` loads the matching domain execution skill: [Coding Execution](../../../skills/coding/coding-execution/SKILL.md), [Authoring Execution](../../../skills/authoring/authoring-execution/SKILL.md), or [Design Execution](../../../skills/design/design-execution/SKILL.md). | The executor changes the product. In-stage self-review stays with that work. Independent review is a reviewer. |
| Reviewer | `coding-reviewer` loads [Coding Review](../../../skills/coding/coding-review/SKILL.md), `authoring-reviewer` loads [Authoring Review](../../../skills/authoring/authoring-review/SKILL.md), and `design-reviewer` loads [Design Review](../../../skills/design/design-review/SKILL.md). | The reviewer reads another agent's work in that domain and does not change it. Domain Review writes `report.md` and working `checklist.md`. Cowork owns the user-called `review` call. Workflow owns stage REVIEW. |
| Assistant | No domain-family load change. | Narrow lookup and authorized Memory assistance do not become lifecycle implementation or review. |

The phase reviewer owns independent review, and no reviewer reviews work it produced. The manager accepts.
See the [Coding skill family](../feature/coding-skill-family.md), [Authoring skill family](../feature/authoring-skill-family.md),
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
