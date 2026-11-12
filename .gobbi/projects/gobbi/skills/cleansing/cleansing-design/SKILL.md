---
name: cleansing-design
description: "Design Cleansing restructures, renames, and removes Ontology units of visual work, such as UI and HTML, a design system, slides, charts, images, or reports, so it stays simple and clearly defined without changing what viewers see or can do. Use it when the user asks to cleanse visual work."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Design Cleansing

Design Cleansing turns visual work that grew without a plan, such as a UI, a design system, a slide deck, a chart
set, or brand assets built up by many agent changes, back into a small set of clearly defined Ontology units. It
defines what exists, then restructures, renames, and removes within the levels the user chose, while a recorded
baseline shows the experience stays the same. Only the user starts it. The manager talks to the user and launches
agents, a `leader` writes the map and plan, and the role that matches each Ontology unit applies its changes.

## Principles

### Define first, then restructure

Each Ontology unit gets an [Ontology unit definition](../../ontology/SKILL.md), plus its role, what it exposes, and
where it renders, before anything moves. A design built from clear roles stays consistent; a design without them
drifts again.

### Systematic means simple

A clean design has fewer, clearer components, variants, and tokens. Each change removes one or makes a definition
true, and a variant or token stays only for a difference that exists now.

### Change the shape, keep the experience

What viewers see, can do, and can perceive, including contrast, focus, and reading order, stays the same. A
baseline recorded before the first edit shows that it did.

## Rules

- **MUST ask the user the depth and intensity of each action before mapping.** The levels bound how much of the
  user's work may change, so a default or a guess cannot stand in for them.
- **MUST get the user's approval of the plan before changing a file.** The plan can move, rename, and delete much
  of the user's work, and a wrong plan is costly to undo.
- **Stay within the chosen levels.** A change deeper or bolder than the user allowed goes to Suggestions, not into
  the work.
- **Keep the experience exactly, with no tolerance set by an agent.** Resolved token values stay identical, and
  any change a viewer could see, such as merging two near-identical colors or changing a label's text, is a
  separate decision for the user, because a screenshot tolerance can hide a one-step color change.
- **Remove only with usage evidence, and remove a public token, route, or asset URL only with a deprecation or
  redirect kept for its outside dependents, such as other files, products, exports, emails, or social cards.**
  Record each check and its scope beside each removal (a search for code and content, an in-use or instance check
  for design files, decks, and documents, and the outside references), and count a dynamic or external
  reference, or an unreached state, viewport, theme, locale, or print format, as a use until it is ruled out,
  because each check misses some uses.

## Procedure

### Phase 1 — Set the Subject and Levels

Agree what is cleansed, how far, and how a failed step is undone. Done when the subject, the restore point, the map
location, each action's levels, and the checkpoint authority and kinds are recorded in the
[cleansing map](templates/map.md).

#### 1.1 Confirm the subject

- The manager confirms the paths and design files with the user. The child of the main result takes the whole
  subject, as in [Gobbi Step 2.5](../../gobbi/SKILL.md#25-spawn-each-specialist-as-its-role): when the main
  result is not visual, name [Code Cleansing](../cleansing-code/SKILL.md) or
  [Docs Cleansing](../cleansing-docs/SKILL.md) and stop.
- Record the restore point by file kind: committed work for git-tracked files, and a named saved version or a
  copy the user confirms for files outside git.
- The map and plan are the run's Ideation result: in a Gobbi session, at the mode's Ideation output root;
  otherwise at a path the user names outside the subject.

#### 1.2 Ask the levels and the checkpoint authority

- With the runtime's structured question tool, ask the depth of restructuring, renaming, and removing (System,
  Component, Element, or Skip), then the intensity of each action not skipped. The [Levels](#levels) define each.
- Ask whether each apply step that passes its checks may be checkpointed on the plan's paths: a commit for
  git-tracked files, and a named saved version or a file copy for others. A checkpoint lets a later failed step
  be undone.
- Record the answers and the checkpoint kind of each file kind in the map.

### Phase 2 — Define What Exists

Describe the visual work as it is. Done when the map covers every Ontology unit from the largest chosen depth down,
with its Ontology unit definition, its flags, its commonality and variability, and its vocabulary.

#### 2.1 Map the Ontology units, commonality, and vocabulary

- The manager briefs one `leader` through [Delegation](../../delegation/SKILL.md), with this skill's path in
  Materials, because a user-only skill is not loaded into a subagent on its own. A large subject is mapped by area.
- The `leader` views the subject rendered in each state, mode, and viewport it ships in, writes each Ontology
  unit's definition with the template's fields and flags, and records which Ontology units share a role and what
  truly varies now.
- It lists one term per concept: the project's design-system term first, then the platform's or field's. A
  disagreement goes back to the manager, who asks the user.

### Phase 3 — Design the Clean Target

Derive the simpler structure from the map. Done when the user approves the plan.

#### 3.1 Derive the changes

- The `leader` writes one change per flag within the chosen levels, and keeps it only if it makes the design
  simpler or a definition true. A change outside the levels goes to Suggestions.
- A change a viewer would see goes to Separate Decisions.
- Each Ontology unit group gets the check that will pin it, and a group no check can pin is listed as unverified.
  An Ontology unit group is the Ontology units one kind of check pins together, such as tokens, rendered pages,
  charts, slides and documents, images and brand, or motion.

#### 3.2 Approve the plan

- The manager shows the user the current structure beside the target, with the map's renders beside each change,
  the changes in order, each removal with its evidence, the dependents outside the subject, the separate
  decisions, and the unverified groups.
- Apply the user's edits by returning the `leader` to the earliest affected Step, then ask for approval with the
  runtime's structured question tool.

### Phase 4 — Apply in Small Verified Steps

Carry out the approved plan without changing the experience. Done when every approved change is applied and the
final checks match the baseline.

#### 4.1 Record the baseline

- The manager gives each apply task to the role of its Ontology unit, with this skill and that role's Execution
  skill in Materials: the `designer` for an Ontology unit with a visual surface, the `developer` for code with
  none, and the `author` for docs.
- The first apply task records one baseline of the whole subject before any edit, from the plan's pins and
  [Design Execution](../../design/design-execution/SKILL.md#12-record-the-baseline-before-the-first-edit).
  Later tasks compare with it and do not record a new one.

#### 4.2 Remove, then restructure, then rename, checking each step

- Apply removals first, then restructuring, then renames, so each name changes once on the final structure.
  Update every dependent of a changed Ontology unit in the same step.
- After each step, compare with the baseline. With checkpoint authority, checkpoint each step that matches by the
  kind the map records, and undo a failed step to the last checkpoint; without it, fix the failure or stop.
- On a stop, the manager asks the user to restore the restore point or keep the work as it stands. A change the
  plan lacks goes to Suggestions instead of the work.

### Phase 5 — Report the Result

Tell the user what changed and what remains. Done when the user has the report.

#### 5.1 Report

- From the returned handoffs, the manager reports the structure before and after, the changes applied, each
  removal with its evidence, the checks against the baseline, the unverified groups, and the Suggestions.
- Leave any commit beyond the granted step checkpoints to the user or the mode, and suggest an independent
  [Review](../../review/SKILL.md) against [Design Review](../../design/design-review/SKILL.md), with the
  approved plan and baseline as its Goal.

## Levels

| Action | What it changes in visual work |
|---|---|
| Restructuring | Structure: merge, split, or move Ontology units so each has one role and each value has one source. |
| Renaming | Internal names of components, variants, tokens, styles, assets, and files, by role, in the project's and then the field's vocabulary. A visible label is a separate decision. |
| Removing | Ontology units: what nothing uses, an exact duplicate, a superseded Ontology unit, or complexity with no present need. An exact duplicate has the same role and the same value in every mode, theme, viewport, and state; an Ontology unit with the same value and a different role stays or becomes an alias. |

| Depth | Largest Ontology unit the action may target or create |
|---|---|
| System | A set or system of Ontology units: a design system, token sets, a template, a page or slide family, a folder layout |
| Component | One composed Ontology unit: a component, screen, page, slide, chart, or composition |
| Element | One small Ontology unit: a token, style, variant, state, placeholder, asset, or chart or brand mark |

Depth names a size, not a kind of Ontology unit. System depth allows Component and Element changes, Component depth
allows Element changes, and Skip leaves the action out. A change that targets or creates a larger Ontology unit
goes to Suggestions. A token or style sits under many components rather than inside one, so an Element change can
reach every dependent: the plan lists each one, and the step updates them all.

| Intensity | How far the action goes |
|---|---|
| Conservative | Only clear defects: unused Ontology units, exact duplicates with no dependent outside the subject, and names that contradict their role. A shared Ontology unit stays. |
| Moderate | Also the merges, splits, renames, and removals the map flags. A shared Ontology unit changes only when all its dependents are inside the subject. |
| Aggressive | Rebuild toward the simplest structure the roles allow. A shared Ontology unit may change, and its dependents outside the subject are listed in the plan. |

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The run's Ideation result: levels, checkpoints, baseline, Ontology unit definitions, plan, and decisions. |
| [Ontology](../../ontology/SKILL.md) | The six fields of each Ontology unit definition, and the tests for commonality and naming. |
| [Design Execution](../../design/design-execution/SKILL.md) | The baseline and check steps the `designer` applies. |
| [Design Review](../../design/design-review/SKILL.md) | The review bar for the cleansed visual work. |
| [Code Cleansing](../cleansing-code/SKILL.md) | The cleansing for a subject whose main result is code with no visual surface. |
| [Docs Cleansing](../cleansing-docs/SKILL.md) | The cleansing for a subject whose main result is docs, skills, or the changelog. |
| [Gobbi](../../gobbi/SKILL.md) | Step 2.5 decides the child by the subject's main result. |
| [Delegation](../../delegation/SKILL.md) | Briefs for the `leader` and each applying role. |
| [Review](../../review/SKILL.md) | The independent review suggested after cleansing. |
