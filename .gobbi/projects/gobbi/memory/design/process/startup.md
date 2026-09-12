# Startup

## Intent

Startup is a conductor plus four children: Interview, Project Design, Roadmap, and
Bootstrap. It writes session drafts, then durable design memory. It does not load Planning,
the Wrap-up skill, or feature Execution. It does not publish, push, open a pull
request, or merge.

The canonical [Startup](../../../skills/startup/SKILL.md) skill owns this contract.

## Family

| Role | Owner | Current responsibility |
|---|---|---|
| Conductor | [Startup](../../../skills/startup/SKILL.md) | Order, identity, gates, and Memory Wrap-up |
| Interview | [Interview](../../../skills/startup/interview/SKILL.md) | Walks 42 cores and 19 triggered children into `{session-root}/interview.md` |
| Project Design | [Project Design](../../../skills/startup/project-design/SKILL.md) | Writes session drafts under `{session-root}/tmp/startup/design/` and creates the Gobbi namespace |
| Roadmap | [Roadmap](../../../skills/startup/roadmap/SKILL.md) | Writes the session project-horizon draft |
| Bootstrap | [Bootstrap](../../../skills/startup/bootstrap/SKILL.md) | Creates the smallest local repository that can pass First check |

## Interview

Interview uses three branches of 14 cores each: Project, Design / Development, and
Product. Named tasks are subject nodes under Product for `task-actors`,
`task-scope`, and `task-behavior`. They are not a fourth branch.

Nineteen named children fire only when their trigger is true. Ordinary-project
budget: at most three children at project level, six per product, and two per
named task. Over budget, mark the extra child `open`.

Blocking missing answers: `products`, `core-tasks`, `stack`, `first-check`, and,
when `core-tasks` is not none, `task-actors`, `task-scope`, and `task-behavior`.
Never copy `{session-root}/interview.md` into Memory.

## Session drafts then durable design

Project Design and Roadmap write ignored session drafts that use Memory design
path names. Session drafts carry `## Acceptance`. File existence is not acceptance.
Durable writes copy every other heading and omit `## Acceptance`.

Durable destinations stay in the existing design memory categories:

- `architecture/overview.md`
- `architecture/system.md` — composition, stack, and First check. Not `platform.md`.
- `process/product.md`
- `feature/<feature>.md`, or none when `core-tasks` is none
- `roadmap/project.md`

Do not add a fifth Memory category.

## Boundaries

- Planning, not Startup, turns one horizon into a task hierarchy.
- Startup Memory Wrap-up applies Memory preferences and makes one Memory-only
  commit. It is not the Wrap-up skill.
- Startup itself does not merge.
