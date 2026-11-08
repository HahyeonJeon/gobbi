---
name: cleansing
description: "Cleansing reorganizes, renames, and removes parts of a codebase or document set so it stays simple and clearly defined. Use it when the user asks to cleanse code or docs."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Cleansing

Cleansing turns code or docs that grew without a plan back into a small set of clearly defined parts. It
defines what exists, then refactors, renames, and removes within the levels the user chose. Only the user starts
it.

## Principles

### Define first, then restructure

Every part gets one definition, one responsibility, one boundary, and plain relations before anything moves. A
structure built from clear definitions needs little explanation; a structure without them decays again.

### Systematic means simple

A clean system has fewer, clearer parts, not more layers. Each change removes a concept, a file, an
indirection, or a term, or makes a definition true.

### Change the shape, keep the behavior

Cleansing changes structure, names, and dead parts. What the system does, and what a document tells its reader
to do, stays the same.

## Rules

- **MUST ask the user the depth and intensity of each action before mapping.** The levels decide how much of
  the user's work may change, so a default or a guess cannot stand in for them.
- **MUST get the user's approval of the plan before changing a file.** The plan can move, rename, and delete much
  of the user's work, and a wrong plan is costly to undo.
- **Stay within the chosen levels.** A change deeper or bolder than the user allowed goes into the report as a
  suggestion, not into the work.
- **Keep behavior.** A change that would alter what the code does or what a document instructs goes back to the
  user as a separate request, because cleansing is trusted not to change results.
- **Remove only with evidence.** A part is removed only when a search shows nothing uses it, it duplicates
  another part, or a newer part replaces it; record that evidence beside each removal.

## Procedure

### Phase 1 — Set the Subject and Levels

Agree what is cleansed and how far. Done when the subject, every action's depth and intensity, and the baseline
checks are recorded.

#### 1.1 Confirm the subject

- Ask the user which paths are in the subject, if the request does not name them. Start only from committed
  work, so every change can be undone.
- Run the subject's checks (tests, type checks, linters, build, and document or skill checkers such as
  Gobbi Skill's `scripts/check_skills.py`) and record the results as the baseline.

#### 1.2 Ask the levels

- With the runtime's structured question tool, ask the depth of refactoring, renaming, and removing (Module,
  Class, Function, or Skip), then the intensity of each action not skipped. The [Levels](#levels) define each.
- Record the answers in the [cleansing map](templates/map.md).

### Phase 2 — Define What Exists

Describe the subject as it is, at the chosen depth. Done when the map covers every unit in the subject.

#### 2.1 Map the units

- For each unit at the chosen depth, write its definition in one sentence, its responsibility, its boundary, and
  what it uses and what uses it.
- Mark each unit whose definition needs "and", whose responsibility overlaps another, whose boundary leaks, or
  whose dependencies form a cycle or point the wrong way.
- For a large subject, map separate areas with subagents through [Delegation](../delegation/SKILL.md), then
  merge their maps.

#### 2.2 Map commonality, variability, and vocabulary

- Name what units share and copy, and what really varies between them now. Mark copies that change together and
  abstractions with no present variation.
- List each concept's names across the subject next to the term the field uses for it, and mark synonyms and
  names that mean two things.

### Phase 3 — Design the Clean Target

Derive the simpler structure from the map and get the user's approval. Done when the user approves the plan.

#### 3.1 Derive the changes

- For each mark, write one change: refactor, rename, or remove, with its reason from the map and its depth and
  intensity. Drop any change outside the chosen levels into Suggestions.
- Keep a change only if it makes the subject simpler or a definition true. A new abstraction needs a variation
  that exists now.

#### 3.2 Approve the plan

- Show the user the target structure beside the current one, the changes in order, every removal with its
  evidence, and every public interface that changes.
- Apply the user's edits to the plan, then ask for approval with the runtime's structured question tool.

### Phase 4 — Apply in Small Verified Steps

Carry out the approved plan without changing behavior. Done when every approved change is applied and the
checks match the baseline.

#### 4.1 Remove, then refactor, then rename

- Apply removals first, then structure changes, then renames, so each name changes once on the final structure.
- Update every user of a changed part in the same step: callers, imports, tests, links, references, and
  generated copies.

#### 4.2 Check each step

- Run the baseline checks after each step. A new failure is fixed in that step or the step is undone.
- When the work reveals a change the plan did not include, add it to Suggestions instead of applying it.

### Phase 5 — Report the Result

Tell the user what changed and what remains. Done when the user has the report.

#### 5.1 Report

- Report the structure before and after, the changes applied, the removals with their evidence, the checks
  against the baseline, and the Suggestions.
- Leave commits to the user or the calling mode, and suggest an independent [Review](../review/SKILL.md) of the
  result.

## Levels

| Action | What it changes |
|---|---|
| Refactoring | Structure: merge, split, or move parts so each has one definition and dependencies point one way. |
| Renaming | Names: align each name with its definition and the field's vocabulary, one term per concept. |
| Removing | Parts: delete what is unused, duplicated, superseded, or adds complexity without a present need. |

| Depth | Largest unit the action may change, in code | In docs |
|---|---|---|
| Module | Modules, packages, and directory layout | Document families, skill families, and folder layout |
| Class | Classes, interfaces, and files | Documents and sections |
| Function | Functions, methods, and variables | Paragraphs, list items, and table rows |

| Intensity | How far the action goes |
|---|---|
| Conservative | Only clear defects: proven dead parts, names that contradict their definition, duplicates that already drifted. Public interfaces stay. |
| Moderate | Also simplifications the map makes obvious. A public interface may change when every user inside the subject is updated. |
| Aggressive | Rebuild toward the simplest structure the definitions allow. Public interfaces and layout may change, and users outside the subject are listed for the user. |

A deeper level includes the shallower ones, and Skip leaves an action out.

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The one document that holds the levels, the unit map, and the plan. |
| [Coding Principles](../coding/principles.md) | The modularization, naming, and simplicity bar for code. |
| [`coding-object-oriented-programming`](../coding/coding-object-oriented-programming/SKILL.md) | The bar for classes, interfaces, and patterns. |
| [Authoring Review](../authoring/authoring-review/SKILL.md) | The structure and vocabulary checks for docs. |
| [Gobbi Skill](../gobbi-skill/SKILL.md) | The standard for skills, when the subject contains them. |
| [Delegation](../delegation/SKILL.md) | Briefs for subagents that map large subjects. |
| [Review](../review/SKILL.md) | The independent review suggested after cleansing. |
