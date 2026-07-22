# Memory Map

This document owns the thin mapping from authorized typed staging sources to durable memory homes. It does not own the session tree, candidate policy, durable file schema, or promotion mechanics.

For the complete session filesystem and every authorized staging directory, use [Record map](../record/record-map.md). For candidate selection and lifecycle policy, use [Memory](SKILL.md). For durable type, scope, area, naming, and frontmatter constraints, use [Memory rules](rules.md). For inventory, destination preimages, apply, and handoff mechanics, use [Wrap-up](../wrap-up/SKILL.md).

## Typed source to durable home

All sources below are regular files beneath an authorized `staging/` directory. `{area}` is resolved under [Memory rules](rules.md); `{date}` is the durable filename date required by the type.

| Typed staging source | Durable home | Scope and routing |
|---|---|---|
| `staging/scenarios/{slug}.md` | `features/{feature}/scenarios/{area}/{slug}.md` | Feature only |
| `staging/checklists/{slug}.md` | `features/{feature}/checklists/{area}/{slug}.md` | Feature only |
| `staging/decisions/{slug}.md` | `features/{feature}/decisions/{area}/{date}-{slug}.md` or `decisions/{area}/{date}-{slug}.md` | Feature by default; project when the decision is cross-feature |
| `staging/decisions/{slug}.md` carrying the authorized mistake routing marker | `features/{feature}/mistakes/{area}/{slug}.md`, `mistakes/{area}/{slug}.md`, or one owning skill's `mistakes.md` section | One user-authorized home; the routing marker is not durable |
| `staging/references/{slug}.md` | `features/{feature}/references/{area}/{slug}.md` or `references/{area}/{slug}.md` | Feature by default; project when cross-feature |
| `staging/design/{slug}.md` | `features/{feature}/design/{area}/{slug}.md` or `design/{area}/{slug}.md` | Feature by default; project when cross-feature |
| `staging/discussions/{slug}.md` | `features/{feature}/discussions/{area}/{date}-{slug}.md` | Feature only |
| `staging/reviews/{slug}.md` | `features/{feature}/reviews/{area}/{date}-{slug}.md` or `reviews/{area}/{date}-{slug}.md` | Feature by default; project when cross-feature |
| `staging/reports/{slug}.md` | `features/{feature}/reports/{area}/{date}-{slug}.md` or `reports/{area}/{date}-{slug}.md` | Feature by default; project when cross-feature |
| `staging/changelogs/{slug}.md` | `features/{feature}/changelogs/{area}/{date}-{slug}.md` | Feature only |
| `staging/learnings/{slug}.md` | `features/{feature}/learnings/{area}/{slug}.md` or `learnings/{area}/{slug}.md` | Feature by default; project when cross-feature |
| `staging/notes/{slug}.md` | `notes/{area}/{date}-{slug}.md` | Project only |
| `staging/backlogs/feature/{slug}.md` | `features/{feature}/backlogs/{area}/{slug}.md` | Feature only |
| `staging/backlogs/project/{slug}.md` | `backlogs/{area}/{slug}.md` | Project only |
| `2-planning/staging/plans/{slug}.md` | `features/{feature}/plans/{area}/{date}-{slug}.md` | Feature only and Planning-owned |

The authorized staging vocabulary has no direct source for a feature identity file or a durable rule. A workflow that needs a new route must first change the Record-owned staging contract and its validators; Memory does not invent a destination.

## Handoff mapping

One accepted session close uses one typed notes source:

| Typed source | Session result | Durable result |
|---|---|---|
| `4-wrap-up/staging/notes/{slug}.md` | `4-wrap-up/outputs/handoff.md` | `notes/{area}/{YYYY-MM-DD}-{slug}.md` |

The session and durable bodies are identical. The durable file adds only its notes frontmatter wrapper. [Wrap-up](../wrap-up/SKILL.md) owns the comparison and PASS-only output mechanics.

## Lifecycle destinations

True one-record supersession keeps both directions: the new record carries `supersedes: {old-slug}`
and the old record carries `status: superseded` plus non-null
`superseded_by: {new-slug}`. A retired design, completed or abandoned plan, or retired checklist has no
successor and keeps `superseded_by` absent or null.

Every terminal move uses the sole project-root destination
`archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md`. It preserves original type, scope, feature, extensions,
and body. It adds the matching archive date and one status-compatible reason. There is no
`features/{feature}/archive/` route. Inbound path references follow the move; plain-slug lifecycle
references do not change. [Memory rules](rules.md) own the exact status/reason matrix and strict archive
form. [Wrap-up](../wrap-up/SKILL.md) owns the filesystem mutation set.

## Ownership boundaries

| Concern | Owner |
|---|---|
| Candidate identification, durable-value filtering, type and scope choice, lifecycle policy, final memory verification | [Memory](SKILL.md) |
| Complete session tree, authorized staging vocabulary, staging writes, prior-evidence preservation | [Record](../record/SKILL.md) and [Record map](../record/record-map.md) |
| Durable names, fields, type constraints, areas, templates, archive form | [Memory rules](rules.md) and [templates](templates/) |
| Typed-source inventory, source accounting, destination preimages, apply, idempotence, actual-tree proof, handoff equality | [Wrap-up](../wrap-up/SKILL.md) |
| Independent findings and acceptance result | [Evaluation](../evaluation/SKILL.md) |

Empty typed staging is valid. A source outside the authorized typed set is not a promotion input.
