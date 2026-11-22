---
name: cleansing-code
description: "Code Cleansing reorganizes, renames, and removes Ontology units of a codebase so it stays simple and clearly defined without changing what the code does. Use it when the user asks to cleanse code."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Code Cleansing

Code Cleansing turns code that grew without a plan back into clearly defined modules, classes, and functions.
It maps what exists, then refactors, renames, and removes within the depth and intensity the user chose, with
checks that show behavior stays the same. Only the user starts it: the manager talks to the user, a `leader`
writes the map and plan, and the role of each Ontology unit applies the plan.

## Principles

### Define first, then restructure

Every Ontology unit gets its [Ontology unit definition](../../ontology/SKILL.md) before it moves: definition,
responsibility, boundary, relations, dependencies, and properties, read for code as
[Modularization](../../coding/principles.md#modularization) states. A structure built from clear definitions needs
little explanation, and one without them decays again.

### Systematic means simple

A change stays only if it removes a concept, file, indirection, or name, or makes an Ontology unit match its
definition. That definition is approved in the plan or already recorded in an Ideation design, an Ontology unit
definition, or a spec, so "simpler" never rests on taste.

### Change the shape, keep the behavior

Cleansing is trusted not to change results. Refactoring changes the structure of code without changing its
observable behavior, so what a consumer outside the subject sees stays the same.

## Rules

- **MUST ask the user the depth and intensity of each action before mapping.** The levels decide how much of the
  user's code may change, so a default cannot stand in for them.
- **MUST get the user's approval of the plan before changing a file.** The plan can move, rename, and delete much
  of the user's code, and a wrong plan is costly to undo.
- **Stay within the chosen levels.** A change deeper or bolder than the user allowed goes to the report as a
  Suggestion, because the levels are the user's limit on the code.
- **Keep behavior, which is what a consumer outside the subject observes, and send what a search cannot see to
  the user.** Behavior covers return values, raised error types, writes and their order, persisted and wire
  formats, exported names, and CLI and config keys, and a change to it, a merge of live copies, or a change to a
  string-bound, dynamically reached, or published name goes to the user per item, because a search cannot see
  outside consumers and identical text is not always the same knowledge.
- **Remove only code that nothing reaches from the roots: entry points, registrations, framework conventions,
  names that config refers to, the public interface, and the tests the user keeps.** Record a name
  search over every file type plus a tool where one exists, with the roots checked and the tool's confidence,
  beside each removal, because one search misses config, dynamic, and entry-point uses.
- **Accept no claim that behavior is kept without a check that fails when the behavior changes.** Pin code no
  test covers through its public seam before changing it, change a test only in names, imports, and locations,
  and report the paths no check reaches, because agents endorse much of their own drifted output and about a
  fifth of non-equivalent refactorings pass the existing tests (arXiv 2602.15761, 2605.21537).

## Procedure

### Phase 1 — Set the Subject and Levels

The manager agrees with the user what is cleansed and how far. Done when the subject, its kind, each action's
depth and intensity, and the commit authority are recorded with the session's records, outside the subject.

#### 1.1 Confirm the subject and ask the levels

- Confirm the paths, that the work in them is committed, and that their main result is code; when it is a visual
  surface or prose, use [Design Cleansing](../cleansing-design/SKILL.md) or
  [Docs Cleansing](../cleansing-docs/SKILL.md) instead. An Ontology unit of another domain inside
  the subject, such as in-repo API reference pages, stays in this run, and code comments and docstrings are code.
- Read the subject's kind from its manifests (application, published library, or both) and confirm it with the
  user, because a published library has consumers no search can see.
- With the runtime's structured question tool, ask the depth (Module, Class, Function, or Skip) and then the
  intensity of each action not skipped, as the [Levels](#levels) define them. Ask also whether each applied step
  may be committed on the paths the plan names.

### Phase 2 — Map and Design the Clean Target

The map and plan are the run's Ideation result, which a `leader` writes from the [map template](templates/map.md).
Done when the user approves a plan whose every change has a mark, a level, and evidence, and the approved map is
listed from `ideation-index.md` at the Ideation output root. For a large subject, the manager launches one
`leader` per area through [Delegation](../../delegation/SKILL.md), and one `leader` merges their maps.

#### 2.1 Map what exists

- Record the roots and how each was found, then the Ontology unit definition and caller contract of each public
  Ontology unit within the chosen depths. Map a private Ontology unit only when a tool or a read marks it.
- Mark an Ontology unit whose definition needs "and", whose responsibility overlaps another's, whose boundary
  leaks, that sits in a dependency cycle, or whose name contradicts its definition. Also mark one that nothing
  reaches, that a newer Ontology unit replaces, that fails a [Coding Principles](../../coding/principles.md) limit,
  or that repeats another's job.
- For each pair of copies and each abstraction, record a verdict: same knowledge and same reason to change is a
  merge candidate, same text with a different reason is kept, and a flag or parameter with one caller is inlined
  back. List each concept's names per context beside the term [Naming](../../coding/principles.md#naming)
  gives, and send a disagreement between its sources to the user through the manager.

#### 2.2 Derive the plan

- Write one change per mark with its action, depth, intensity, and reason, and move a change outside the levels
  to Suggestions.
- Keep a change only if it passes [Systematic means simple](#systematic-means-simple). A new abstraction needs a
  variation that exists now.
- List each case that the Keep-behavior Rule sends to the user as a separate decision, naming its outside
  consumer or site.

#### 2.3 Approve the plan

- The manager shows the user the target beside the current structure, the changes in order, each removal's
  evidence, each interface change with its outside consumers, and the separate decisions. Approval binds these
  items, and inside a task the applier orders its own steps.
- The manager applies the user's edits by returning the leader to the earliest affected Step, then asks for
  approval with the structured question tool.
- After approval, the leader writes the map from its draft location to the Ideation output root and lists it
  from `ideation-index.md`, as [Coding Ideation](../../coding/coding-ideation/SKILL.md) locates its result.

### Phase 3 — Apply in Small Verified Steps

Carry out the approved plan without changing behavior. Done when every approved change is applied, each step's
checks are recorded, and the final tree's checks match the baseline. The manager gives each apply task to the role
of the Ontology unit it changes, as [Gobbi Step 2.5](../../gobbi/SKILL.md#25-spawn-each-specialist-as-its-role)
names: the `developer` for code under [Coding Execution](../../coding/coding-execution/SKILL.md), the `designer`
for a visual Ontology unit, and the `author` for docs, each with its domain's Execution skill. Each brief holds
this skill and the approved map in Materials, and grants commit authority on the plan's paths only when the user
gave it.

#### 3.1 Apply in order

- Remove, then refactor, then rename, so each name changes once, on the final structure.
- A step is one move applied to every place that uses it, as [Other Files](#other-files) sorts them, followed by
  the checks.
- With commit authority, commit each step that passes. Without it, a failed step is fixed in that step or the run
  stops with the tree kept, and the manager asks the user whether to restore the plan's paths or keep them.

#### 3.2 Check each step

- The first apply task records the run's one baseline before any edit, as Coding Execution Step 1.2 does, and
  every later step compares with it.
- Check each refactor and rename as the Rule on behavior claims asks, and diff the exported names before and
  after where a tool exists.
- A change the plan lacks goes to Suggestions. A behavior change or an assertion change stops the step and
  returns to the manager.

### Phase 4 — Report the Result

The manager reports from the handoffs. Done when the user has the report.

#### 4.1 Report

- Report the structure before and after with its final definitions and vocabulary, the changes applied, each
  removal's evidence, the checks against the baseline, the paths no check reached, and the Suggestions. Give the
  counts of Ontology units and files before and after from the map, with no score.
- Leave any other commit to the user or the calling mode, and suggest an independent
  [Review](../../review/SKILL.md) against [Coding Review](../../coding/coding-review/SKILL.md).

## Levels

| Action | What it changes |
|---|---|
| Refactoring | Moves code among Ontology units so callers change: merge, split, extract, move, or inline, including an Ontology unit that only forwards. The deletion that finishes a refactoring belongs to it. |
| Renaming | Identifiers and the text that describes them. A move with a rename is two changes. |
| Removing | What nothing reaches: unreachable code, a copy no live caller uses, and a parameter, flag, or layer no caller passes or reaches. |

| Depth | Largest Ontology unit the action may change |
|---|---|
| Module | Modules, packages, and directory layout |
| Class | Classes, interfaces, and files |
| Function | Functions, methods, and variables |

Module includes Class and Function, Class includes Function, and Skip leaves the action out. A change applies only
to Ontology units no larger than the depth, counting the Ontology units it creates; a larger one goes to
Suggestions.

| Intensity | Refactoring | Renaming | Removing |
|---|---|---|---|
| Conservative | A stated defect that needs no public-interface change, such as a cycle to break or a pure forwarder to inline | Identifiers that contradict their definition | Unreachable code and copies no live caller uses, but no public name |
| Moderate | Also merges of live copies shown with their verdict, splits, moves, extracts, and inlines; a public interface only when all its callers are inside the subject | Also names that differ from the vocabulary term in their context; a public name only when all its callers are inside the subject | Also a parameter, flag, or layer no caller reaches |
| Aggressive | Rebuild toward the simplest structure the definitions allow; outside callers move by a parallel change (expand, migrate, contract), or the user decides | Also public, file, and directory names; outside callers are listed or moved by a parallel change | Also a public name with no visible use, per item with the user's approval, and the contract step of a parallel change; a published library's public name goes only by a parallel change |

## Other Files

| Outcome | Files |
|---|---|
| Follows the Ontology unit it describes | Tests, where a dead test follows Removing; comments and docstrings, where one that contradicts its Ontology unit is fixed with Renaming and commented-out code goes at Moderate; config keys only that Ontology unit reads; manifests and entry points that name it; generated output, regenerated from its source |
| Left unchanged | Persisted data and migrations, vendored and lock files, and build and continuous-integration entry points, which are roots and never removed |
| The user decides per item | String-bound or persisted names, where a rename needs a migration; manifest dependencies and scripts; published names; Ontology units a dynamic site reaches |

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The map and plan the `leader` writes as the run's Ideation result. |
| [Ontology](../../ontology/SKILL.md) | The six fields of the Ontology unit definition the map records. |
| [Coding Principles](../../coding/principles.md) | How code reads the six fields, the caller contract, the Simplicity limits, and the Naming order the map applies. |
| [Coding Ideation](../../coding/coding-ideation/SKILL.md) | How an Ideation result is located from `ideation-index.md`. |
| [Coding Execution](../../coding/coding-execution/SKILL.md) | The baseline, stale reach, final-tree checks, and handoff of each code apply task. |
| [Coding Review](../../coding/coding-review/SKILL.md) | The review bar for the cleansed code. |
| [Design Cleansing](../cleansing-design/SKILL.md) | The cleansing for a subject whose main result is a visual surface, including HTML and web UI. |
| [Docs Cleansing](../cleansing-docs/SKILL.md) | The cleansing for a subject whose main result is prose. |
| [Gobbi](../../gobbi/SKILL.md) | Step 2.5 names the role that applies each Ontology unit. |
| [Delegation](../../delegation/SKILL.md) | Briefs for the area `leader`s that map a large subject. |
| [Review](../../review/SKILL.md) | The independent review suggested after cleansing. |
