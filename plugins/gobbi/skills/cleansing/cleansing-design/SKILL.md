---
name: cleansing-design
description: "Design Cleansing reorganizes, renames, and removes parts of visual work, such as UI and HTML, a design system, or slides, so it stays simple and clearly defined without changing what users see or can do. Use it when the user asks to cleanse visual work."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Design Cleansing

Design Cleansing turns visual work that grew without a plan, such as a UI, a design system, or a slide deck built
up by many agent changes, back into a small set of clearly defined units. It defines what exists, then refactors,
renames, and removes within the levels the user chose, while a recorded baseline shows the experience stays the
same. Only the user starts it. The manager talks to the user and launches agents, a `leader` writes the map and
plan, and the role of each part applies the plan.

## Principles

### Define first, then restructure

Each unit gets a definition, a responsibility, a boundary, its relations, and its dependencies before anything
moves. A design built from clear roles stays consistent; a design without them drifts again.

### Systematic means simple

A clean design has fewer, clearer components, variants, and tokens. Each change removes one or makes a definition
true, and a variant or token stays only for a difference that exists now.

### Change the shape, keep the experience

What users see, can do, and can perceive, including contrast, focus, and reading order, stays the same. A
baseline recorded before the first edit shows that it did.

## Rules

- **MUST ask the user the depth and intensity of each action before mapping.** The levels bound how much of the
  user's work may change, so a default or a guess cannot stand in for them.
- **MUST get the user's approval of the plan before changing a file.** The plan can move, rename, and delete much
  of the user's work, and a wrong plan is costly to undo.
- **Stay within the chosen levels.** A change deeper or bolder than the user allowed goes to Suggestions, not into
  the work.
- **Keep the experience exactly.** Resolved token values stay identical, and any change users could see, such as
  merging two near-identical colors or changing a label's text, is a separate decision for the user. No tolerance
  is set, because a screenshot tolerance can hide a one-step color change.
- **Remove only with evidence.** Record the evidence and the search scope beside each removal, and count a
  dynamic, external, or unreached-state reference as a use until it is ruled out, because a plain search misses
  them. A public token, route, or asset URL goes only with a deprecation or redirect kept for its outside users.

## Procedure

### Phase 1 — Set the Subject and Levels

Agree what is cleansed, how far, and how a failed step is undone. Done when the subject, the restore point, the map
location, each action's levels, and the commit authority are recorded in the [cleansing map](templates/map.md).

#### 1.1 Confirm the subject

- The manager confirms the paths and design files with the user. The child of the main result takes the whole
  subject, as in [Gobbi Step 2.5](../../gobbi/SKILL.md#25-spawn-each-specialist-as-its-role): when the main
  result is not visual, name [Code Cleansing](../cleansing-code/SKILL.md) or
  [Docs Cleansing](../cleansing-docs/SKILL.md) and stop.
- Start from committed work, or from a copy the user confirms for files git cannot diff, and record it as the
  restore point.
- The map and plan are the run's Ideation result: in a Gobbi session, at the mode's Ideation output root;
  otherwise at a path the user names outside the subject.

#### 1.2 Ask the levels and the commit authority

- With the runtime's structured question tool, ask the depth of refactoring, renaming, and removing, then the
  intensity of each action not skipped. The [Levels](#levels) define each.
- Ask whether each apply step that passes its checks may be committed, on the plan's paths only, because that
  commit is what lets a later failed step be undone.
- Record the answers in the map.

### Phase 2 — Define What Exists

Describe the visual work as it is. Done when the map covers every unit from the largest chosen depth down, with
its marks, its commonality and variability, and its vocabulary.

#### 2.1 Map the units, commonality, and vocabulary

- The manager briefs one `leader` through [Delegation](../../delegation/SKILL.md), with this skill's path in
  Materials, because a user-only skill is not loaded into a subagent on its own. A large subject is mapped by area.
- The `leader` fills a unit card for each unit with the template's fields and marks, and records what units share
  and what truly varies between them now.
- It lists one term per concept: the project's design-system term first, then the platform's or field's. A
  disagreement goes back to the manager, who asks the user.

### Phase 3 — Design the Clean Target

Derive the simpler structure from the map. Done when the user approves the plan.

#### 3.1 Derive the changes

- The `leader` writes one change per mark within the chosen levels, and keeps it only if it makes the design
  simpler or a definition true. A change outside the levels goes to Suggestions.
- A change users would see goes to Separate Decisions. Each unit group gets the check that will pin it, and a
  group no check can pin is listed as unverified.

#### 3.2 Approve the plan

- The manager shows the user the current structure beside the target, the changes in order, each removal with its
  evidence, the consumers outside the subject, the separate decisions, and the unverified groups.
- Apply the user's edits by returning the `leader` to the earliest affected Step, then ask for approval with the
  runtime's structured question tool.

### Phase 4 — Apply in Small Verified Steps

Carry out the approved plan without changing the experience. Done when every approved change is applied and the
final checks match the baseline.

#### 4.1 Record the baseline

- The manager gives each apply task to the role of its part, with this skill and that role's Execution skill in
  Materials: the `designer` for a part with a visual surface, the `developer` for code with none, and the `author`
  for docs.
- The first apply task records one baseline of the whole subject before any edit, from the plan's pins and
  [Design Execution](../../design/design-execution/SKILL.md#12-record-the-baseline-before-the-first-edit).
  Later tasks compare with it and do not record a new one.

#### 4.2 Remove, then refactor, then rename, checking each step

- Apply removals first, then structure changes, then renames, so each name changes once on the final structure.
  Update every user of a changed unit in the same step.
- After each step, compare with the baseline. With commit authority, commit each step that matches, and undo a
  failed step to the last step commit; without it, fix the failure in that step or stop the run.
- On a stop, the manager asks the user to restore the restore point or keep the tree. A change the plan lacks goes
  to Suggestions instead of the work.

### Phase 5 — Report the Result

Tell the user what changed and what remains. Done when the user has the report.

#### 5.1 Report

- From the returned handoffs, the manager reports the structure before and after, the changes applied, each
  removal with its evidence, the checks against the baseline, the unverified groups, and the Suggestions.
- Leave any commit beyond the granted step commits to the user or the mode, and suggest an independent
  [Review](../../review/SKILL.md) against [Design Review](../../design/design-review/SKILL.md), with the
  approved plan and baseline as its Goal.

## Levels

| Action | What it changes in visual work |
|---|---|
| Refactoring | Structure: merge, split, or move units so each has one role and each value has one source. |
| Renaming | Internal names of components, variants, tokens, styles, assets, and files, by role, in the project's and then the field's vocabulary. A visible label is a separate decision. |
| Removing | Parts: what nothing uses, an exact duplicate, a superseded part, or complexity with no present need. |

| Depth | Largest unit the action may change |
|---|---|
| Module | A set or system of units: a design system, token sets, a template, a page or slide family, a folder layout |
| Class | One composed unit: a component, screen, page, slide, chart, or composition |
| Function | One part: a token, style, variant, state, placeholder, asset, or mark |

Module includes Class and Function, Class includes Function, and Skip leaves the action out.

| Intensity | How far the action goes |
|---|---|
| Conservative | Only clear defects: unused parts, exact duplicates with no consumer outside the subject, and names that contradict their role. Shared components and tokens stay. |
| Moderate | Also the merges, splits, collapses, renames, and removals the map marks. A shared part changes only when all its consumers are inside the subject. |
| Aggressive | Rebuild toward the simplest structure the roles allow. A shared part may change, and its consumers outside the subject are listed in the plan. |

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The run's Ideation result: levels, baseline, unit map, plan, and decisions. |
| [Design Execution](../../design/design-execution/SKILL.md) | The baseline and check steps the `designer` applies. |
| [Design Review](../../design/design-review/SKILL.md) | The review bar for the cleansed visual work. |
| [Code Cleansing](../cleansing-code/SKILL.md) | The cleansing for a subject whose main result is code with no visual surface. |
| [Docs Cleansing](../cleansing-docs/SKILL.md) | The cleansing for a subject whose main result is docs, skills, or the changelog. |
| [Gobbi](../../gobbi/SKILL.md) | Step 2.5 decides the child by the subject's main result. |
| [Delegation](../../delegation/SKILL.md) | Briefs for the `leader` and each applying role. |
| [Review](../../review/SKILL.md) | The independent review suggested after cleansing. |
