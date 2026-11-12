# Identity-and-load role contracts

## Intent

Each Gobbi role file is a load map, not a second procedure owner. Skills own shared procedure. Role files
keep who the role is, what it owns, what it may change, and what it never does. The roles are classified by
phase and subject, not by domain.

## File set

- Canonical source: 28 contracts, seven roles in each of four runtimes, under
  `.gobbi/projects/gobbi/agents/{claude,grok,codex,cursor}/`. [`agents/README.md`](../../../agents/README.md)
  holds the role table and the per-runtime load paths.
- Plugin package: seven Claude-fronted Markdown files at `plugins/gobbi/agents/{role}.md`, flattened from
  `agents/claude/`, plus the other runtimes at `plugins/gobbi/runtimes/{codex,cursor,grok}/{role}.*`. The
  package cannot nest Claude agents under subfolders of `agents/`, because a plugin's `agents/` directory is
  scanned recursively and each subfolder becomes part of the agent's scoped identifier.
- `scripts/guard/guard.py sync` writes the package copies and `guard.py check` reports drift; the role bodies
  must stay identical across the four runtimes. See [Repository guard](../architecture/repository-guard.md).
- Claude has no `.claude/agents` or `.claude/skills`. Codex role files stay in `.codex/agents`, because Codex
  does not load plugin agents. Grok uses `.grok/plugins/gobbi`. Cursor agents stay as symlinks in
  `.cursor/agents` until a Cursor plugin load is proven.

## The seven roles

The roles are manager, assistant, leader, developer, designer, author, and reviewer. The twelve domain phase
roles, `{coding,authoring,design}-{leader,planner,executor,reviewer}`, and the planner are removed. Leader owns
Ideation and Planning in every domain. Execution is split by subject: the developer changes code with no
visual surface, the designer changes work with a visual element (including HTML and web UI and UX) and may use
the coding skills for it, and the author changes durable docs, skills, and the changelog. The reviewer reads
another agent's work, never changes it, and never reviews its own.

Leader and reviewer hold no domain. The brief's Role names the domain expert, and the Coding, Authoring, and
Design skills hold the domain standards that the brief's Materials index. A role change reaches all four
runtime contracts, the plugin package, the Cursor and Codex role copies this checkout keeps, setup, and docs.
Do not create a role skill.

## Role-file shape

Order: runtime frontmatter; H1 with the role name and a short title; a persona paragraph (the experience,
abilities, and character the role needs, shown as working habits); `## Responsibility` (the quality bar the
role owns); `## In scope` (CRUD and the role's subjects); `## Out of scope` (the Nevers). Role files carry no
backstory or method lines, no status-token vocabulary, and no `NO_GOBBI_ROOT` protocol.

The manager reads the manager contract through [Gobbi](../../../skills/gobbi/SKILL.md). A specialist receives
the root pair in its brief and checks it against the sentinels that Gobbi Step 1.2 names. The manager spawns each
specialist as its role by [Gobbi Step 2.5](../../../skills/gobbi/SKILL.md#25-spawn-each-specialist-as-its-role).

## Domain loads

| Role | Standards it applies | Boundary |
|---|---|---|
| Manager | Loads a domain root only to discover matching children; the mode keeps its own paths and gates. | Session authority: user, mode, routing, assignment, acceptance. |
| Leader | The matching Ideation and Planning skill of [Coding](../../../skills/coding/SKILL.md), [Authoring](../../../skills/authoring/SKILL.md), or [Design](../../../skills/design/SKILL.md). | Writes the ideation result and the plan result; never changes the product or reviews. |
| Developer | [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) | Changes code with no visual surface. |
| Designer | [Design Execution](../../../skills/design/design-execution/SKILL.md), and coding skills for the code behind it. | Changes work with a visual element. |
| Author | [Authoring Execution](../../../skills/authoring/authoring-execution/SKILL.md) | Changes durable docs, skills, and the changelog. |
| Reviewer | [Review](../../../skills/review/SKILL.md) and the domain bar the brief names. | Reads another agent's work and writes one report; never edits it. |
| Assistant | None. | Lookup and Memory or record work a brief names. |

The developer, designer, and author self-check but never formally review their own work. See the
[Coding](../feature/coding-skill-family.md), [Authoring](../feature/authoring-skill-family.md), and
[Design](../feature/design-skill-family.md) skill families, and [Review](evaluation.md).

## Ownership

| Subject | Owner |
|---|---|
| Manager entry, root resolution, role to spawn | [Gobbi](../../../skills/gobbi/SKILL.md) |
| Brief and handoff shape | [Delegation](../../../skills/delegation/SKILL.md) |
| Locator acquire/derive/validate at entry | [Plugin skill and agent locator](../architecture/plugin-skill-locator.md) |
| Model and effort per role | [Role model pins](role-model-pins.md) |

## References

- [2026-08-16 session history](../../history/2026-08-16-gobbi-v1-2-0.md)
