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
roles `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`. Evaluator adds `VERDICT` on complete work.

## Conditional coding load map

The Coding domain changes conditional loads, not the five-role set or role procedures. The same semantic map
appears in all four canonical runtime variants.

| Role | Conditional load | Boundary |
|---|---|---|
| Manager | Load [Coding](../../../skills/coding/SKILL.md) when any direct child may apply to the current bounded unit, and use the root only to discover every matching child. In General, sequence matching children as dependencies become current. In Cowork or Workflow, keep the mode primary and select matching children inside existing stages. | The root owns no sequence, state, or conduct. General retains sequencing, re-entry, and acceptance; each mode retains its paths, gates, policies, and handoff. |
| Leader | Load [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md) with Generic Ideation for an unresolved material code-design choice. | Generic Planning remains the only decomposition operation. The leader does not implement or evaluate. |
| Executor | In implementation mode, load [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) with Generic Execution when the settled writer frontier includes code. In explicit review-only mode, load [Coding Review](../../../skills/coding/coding-review/SKILL.md) instead. | Implementation and review-only modes are mutually exclusive. Review-only writes only the caller-bound report, changes no subject, never stages or commits, and issues no verdict. |
| Evaluator | Load no Coding child. Always load Generic Evaluation and both templates. When the target or owned slice has an in-contract code judgment, load the [Coding Review checklist](../../../skills/coding/coding-review/checklist.md) as Evaluation's code baseline after unaided critique. | Generic Evaluation remains the only formal gate. Under `by-owning-stage`, apply the code baseline only to matching implementation slices. Never run Coding Review as Evaluation; read its report only as delayed prepared evidence. |
| Assistant | No coding-family load change. | Narrow lookup and authorized Memory assistance do not become lifecycle implementation, review, or evaluation. |

An executor in review-only mode may provide independent review when not the author. An author may provide only
caller-permitted disclosed self-review. The report remains non-gating in either case. See the
[Coding skill family](../feature/coding-skill-family.md).

Evaluator roles load Evaluation and both evaluation templates every assignment. They load Checklist
only when authoring a new working item or when the assignment requests a reusable checklist. They
write `report.md` and working `checklist.md` only, never `gate.md`, and they do not read a peer
runtime's pair in the same iteration. `VERDICT` is the contract-gate verdict; criteria-free
completion is `DONE_WITH_CONCERNS` with `VERDICT: Not issued`. The Cursor evaluator is not
`readonly`; the Cursor leader stays `readonly`.

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
