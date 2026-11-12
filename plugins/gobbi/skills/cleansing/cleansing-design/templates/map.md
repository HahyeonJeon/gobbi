# Design Cleansing Map — {subject}

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Restructuring | {System, Component, Element, or Skip} | {Conservative, Moderate, or Aggressive} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Map location:** {the mode's Ideation output root, or a path the user named outside the subject}

**Restore point:** {the commit the run starts from for git-tracked files, and the named saved version or
user-confirmed copy for files outside git}

**Checkpoint authority:** {granted for each passing step on the plan's paths, or none}

| Files | File kind | Checkpoint |
|---|---|---|
| {paths or design files} | {git-tracked, or outside git} | {a commit, or a named saved version or file copy and where it is kept} |

## Baseline

| Ontology unit group | Pin | What it covers |
|---|---|---|
| {the Ontology units one kind of check pins together} | {the check, and where its baseline result is kept} | {the viewports, states, modes, and Ontology units it compares} |

**Unverified groups:** {each Ontology unit group no check can pin, or none}

## Ontology units

Write one record per Ontology unit. The first six fields are the Ontology unit definition;
the rest are the fields visual work adds.

### {Ontology unit name}

- **Definition:** {the kind of Ontology unit and what sets it apart from its siblings, in one sentence with no
  "and"}
- **Responsibility:** {what only it decides}
- **Boundary:** {what it includes and hides, and what it leaves to other Ontology units}
- **Relations:** {the Ontology units it connects to, each with a kind and a direction, such as contains, aliases,
  or triggers}
- **Dependencies:** {what it needs, and what breaks if that fails, changes, or goes away}
- **Properties:** {its attributes and values, such as the resolved value in each mode}
- **Where seen:** {path, frame or node, slide number, or URL, with a render or thumbnail}
- **Dependents:** {who relies on it, inside the subject and then outside it}
- **Role:** {the job it does for the viewer or the system, which its name should state}
- **Exposes:** {by kind: a value, the properties it sets, variants and states, slots or placeholders, regions or
  a route, a spec, or a file and format}
- **Renders in:** {the states, modes, and viewports it appears in}
- **Flags:** {each flag from the list below, or none}

{Flags to check:
- a definition that needs "and", or a responsibility that overlaps another Ontology unit's;
- a leak: an Ontology unit reaching into another's internals, such as `!important`, a deep selector, a detached
  instance, or an overridden child layer;
- a wrong-way dependency: a component using a primitive token directly, or a primitive aliasing a semantic token,
  by the project's own token tiers;
- an alias cycle: tokens that alias each other in a loop;
- a name by value or look instead of role, such as `blue-500` as a semantic token or `Heading 2 Blue`, or a name
  that contradicts the role;
- unused, superseded, or with no present need;
- an exact duplicate, as the Removing action defines it;
- a near-duplicate: a value or Ontology unit that differs by accident, such as `#3B82F6` beside `#3B83F6`;
- direct formatting or a per-instance override over a style, or a text box in place of a placeholder;
- a hard-coded value beside a token, or an off-scale value on no token and no step of the type or spacing scale;
- mode drift: light and dark values that diverged;
- a variant used once.}

## Commonality and Variability

| Ontology units | Exact duplicate | Varies by | Verdict |
|---|---|---|---|
| {Ontology units} | {yes or no, by the Removing action's test} | {the variants, modes or themes, densities, or viewports that truly differ now, or none} | {merge, keep, alias, or separate decision} |

{Merge only an exact duplicate, as the Removing action defines it. The same role with a value that differs by
accident is a separate decision, because the merge is visible.}

## Vocabulary

| Concept | Names found | Term to use |
|---|---|---|
| {concept} | {every name used for it in design files, code, and docs} | {the project's design-system term, else the platform's or field's} |

## Plan

| # | Change | Action | Depth | Role | Flag or usage evidence, and its scope |
|---|---|---|---|---|---|
| 1 | {what changes} | {remove, restructure, or rename} | {level} | {`designer`, `developer`, or `author`} | {the flag; for a removal, each check and where it looked} |

{List removals first, then restructuring, then renames. Name in each change every dependent a token or style
change reaches, and each dependent outside the subject.}

## Separate Decisions

- {A change a viewer would see, such as merging near-identical colors or changing a label's text, for the user.}

## Suggestions

- {A change outside the chosen levels or found during the work, for the user to decide later.}
