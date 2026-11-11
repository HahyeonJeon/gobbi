# Cleansing Map — {subject}

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Refactoring | {Module, Class, Function, or Skip} | {Aggressive, Moderate, or Conservative} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Commit authority:** {per-step commits on the change list's paths, or none}

**Baseline checks:** {each check and its result before cleansing}

**Map location:** {the run's Ideation output root, or the path the user named outside the subject}

## Units

| Unit | Kind | Definition | Responsibility | Boundary | Uses | Used by | Address users | Read-only reason | Mark |
|---|---|---|---|---|---|---|---|---|---|
| {path, heading, or name} | {doc, report, API reference page, skill, changelog, template, or record} | {one sentence} | {what only it owns} | {what it leaves to other documents} | {units} | {units} | {who links, loads, or names it, inside and outside the subject} | {the Rule or standard that keeps it as written, or none} | {each mark from Step 2.1, or none} |

{Marks: "and", overlap, leak, cycle, wrong-way dependency, contradicting name, unused, superseded, exact copy,
drifted copy, padding, or no present need.}

## Commonality and Variability

- {What documents share or copy, and what really varies between them now.}

## Vocabulary

| Concept | Names found | Term to use |
|---|---|---|
| {concept} | {every name used for it in live documents} | {the project's term, then the field's} |

## Change List

| # | Change | Action | Depth | Evidence |
|---|---|---|---|---|
| 1 | {what changes} | {remove, refactor, or rename} | {level} | {the mark, the search that shows non-use, or the live document that keeps a copy's content} |

{List removals first, then refactors, then renames. Each changed address names its users outside the subject and
its stub, redirect, or upgrade note.}

## Separate Decisions

- {Changes to what readers get, such as merging drifted copies, for the user to decide.}

## Suggestions

- {Changes outside the chosen levels or found during the work, for the user to decide later.}
