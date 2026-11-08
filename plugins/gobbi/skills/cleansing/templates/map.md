# Cleansing Map — {subject}

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Refactoring | {Module, Class, Function, or Skip} | {Aggressive, Moderate, or Conservative} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Baseline checks:** {each check and its result before cleansing}

## Units

| Unit | Definition | Responsibility | Boundary | Uses | Used by | Mark |
|---|---|---|---|---|---|---|
| {path or name} | {one sentence} | {what only it decides} | {what it hides} | {units} | {units} | {"and", overlap, leak, cycle, or none} |

## Commonality and Variability

- {What units share or copy, and what really varies between them now.}

## Vocabulary

| Concept | Names found | Field term |
|---|---|---|
| {concept} | {every name used for it} | {the term to use} |

## Plan

| # | Change | Kind | Depth | Reason or evidence |
|---|---|---|---|---|
| 1 | {what changes} | {remove, refactor, or rename} | {level} | {the mark, or the search that shows it is unused} |

{List removals first, then refactors, then renames. Public interfaces that change are named in the change.}

## Suggestions

- {Changes outside the chosen levels or found during the work, for the user to decide later.}
