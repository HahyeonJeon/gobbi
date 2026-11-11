# Design Cleansing Map — {subject}

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Refactoring | {Module, Class, Function, or Skip} | {Conservative, Moderate, or Aggressive} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Map location:** {the mode's Ideation output root, or a path the user named outside the subject}

**Restore point:** {the commit the run starts from, or the user-confirmed copy of files git cannot diff}

**Commit authority:** {granted for each passing step on the plan's paths, or none}

## Baseline

| Unit group | Pin | What it covers |
|---|---|---|
| {group of units} | {the check, and where its baseline result is kept} | {the viewports, states, and units it compares} |

**Unverified groups:** {each unit group no check can pin, or none}

## Units

| Unit | Group | Definition | Responsibility | Boundary | Relation | Dependency | Mark |
|---|---|---|---|---|---|---|---|
| {path or name} | {unit group} | {its role, in one sentence} | {what only it decides} | {the props, variants, and slots it exposes} | {what it contains or triggers} | {what it needs and what uses it, each inside or outside the subject} | {each mark, or none} |

{Marks to verify: needs "and", overlap, leak, cycle, wrong-way dependency, contradicting name, unused, superseded,
exact copy, drifted copy, hard-coded value beside a token, one-use variant, or no present need.}

## Commonality and Variability

- {What units share or copy, and what truly varies between them now.}

## Vocabulary

| Concept | Names found | Term to use |
|---|---|---|
| {concept} | {every name used for it in design files, code, and docs} | {the project's design-system term, else the platform's or field's} |

## Plan

| # | Change | Kind | Depth | Role | Evidence and search scope |
|---|---|---|---|---|---|
| 1 | {what changes} | {remove, refactor, or rename} | {level} | {`designer`, `developer`, or `author`} | {the mark, or the search and where it looked} |

{List removals first, then refactors, then renames. Name each consumer outside the subject in its change.}

## Separate Decisions

- {A change users would see, such as merging near-identical colors or changing a label's text, for the user.}

## Suggestions

- {A change outside the chosen levels or found during the work, for the user to decide later.}
