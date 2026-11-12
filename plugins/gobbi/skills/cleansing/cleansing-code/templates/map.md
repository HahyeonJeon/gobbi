# Cleansing Map — {subject}

## Subject

**Paths:** {the paths in the subject}

**Kind:** {application, published library, or both}

| Root | How it was found |
|---|---|
| {entry point, registration, framework convention, config-referenced name, public interface, or kept test} | {the manifest, search, or tool that shows it} |

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Refactoring | {Module, Class, Function, or Skip} | {Conservative, Moderate, or Aggressive} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Commit authority:** {whether each applied step may be committed on the plan's paths}

## Units

| Unit | Definition | Responsibility | Boundary | Relations | Dependencies | Properties | Caller contract | Mark |
|---|---|---|---|---|---|---|---|---|
| {path or name} | {the kind of thing it is and what sets it apart from its siblings, in one sentence with no "and"} | {its secret: what only it decides or does} | {what it includes and hides, and what it leaves to other units} | {the units it uses and the units that use it} | {what it needs, and what breaks if that fails, changes, or goes away} | {the data it owns, or none} | {for a public class or function, what a caller must know; otherwise none} | {each mark from Step 2.1, or none} |

{Map every public unit within the chosen depths, and a private unit only when a tool or a read marks it. The
first six fields are the unit definition the Ontology skill defines; the caller contract is code's own field.}

## Copies and Abstractions

| Pair or abstraction | Same knowledge | Same reason to change | Verdict |
|---|---|---|---|
| {units or abstraction} | {yes or no} | {yes or no} | {merge candidate, keep, or inline back} |

## Vocabulary

| Concept | Context | Names found | Term to use |
|---|---|---|---|
| {concept} | {where the names are used} | {every name used for it there} | {the term to use} |

## Plan

| # | Change | Action | Depth | Reason or evidence | Approved |
|---|---|---|---|---|---|
| 1 | {what changes} | {remove, refactor, or rename} | {level} | {the mark; for a removal, the roots, search, tool, and its confidence} | {yes or no} |

{List removals first, then refactors, then renames. Name each public interface that changes and its outside
consumers in the change.}

## Separate Decisions

| Item | Why it is the user's |
|---|---|
| {change, consumer, or site} | {behavior change, live-copy merge, or string-bound, dynamic, or published name} |

## Suggestions

- {A change outside the chosen levels or found during the work, for the user to decide later.}
