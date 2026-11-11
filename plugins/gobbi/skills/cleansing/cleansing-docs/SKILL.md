---
name: cleansing-docs
description: "Docs Cleansing reorganizes, renames, and removes parts of a document set so it stays simple and clearly defined. Use it when the user asks to cleanse docs, prose reports, in-repo API reference pages, skills, or a changelog."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Docs Cleansing

Docs Cleansing turns documents that grew without a plan back into a small set of clearly defined parts.
Use it when the user asks to cleanse docs, prose reports, in-repo API reference pages, skills, or a changelog.
The manager runs it with the user, a `leader` writes the map and change list, and the role that owns each part
applies the approved changes. Only the user starts it.

## Principles

### Define first, then restructure

Every document and section gets one definition, one responsibility, one boundary, and plain relations before
anything moves. A structure built from clear definitions needs little explanation; one without them decays again.

### Systematic means simple

Each change removes a concept, a document, an indirection, or a term, or makes a definition true. Agents add
far more text than they remove, so most of the work is removing.

### Change the shape, keep what the reader gets

Cleansing changes structure, names, and dead parts. What a document tells its reader, and what an agent does
when it loads the document, stays the same.

## Rules

- **MUST ask the depth and intensity of refactoring, renaming, and removing separately, and stay within the
  answers.** The levels decide how much of the user's work may change, so a change beyond them goes to
  Suggestions.
- **MUST get the user's approval of the change list before any file in the subject changes.** The list can
  move, rename, and delete much of the user's work, and a wrong list is costly to undo.
- **Keep what readers get: facts, instructions with their conditions, upgrade notes, triggers and permissions
  (`description`, `allowed-tools`, `disable-model-invocation`, `paths`), addresses, the reader's job, and output
  formats.** Agents act on what they load, so a rename can change behavior, and a change to one of these, such
  as merging copies that drifted apart, is a separate decision for the user.
- **Remove a part only with recorded evidence, and leave a stub or redirect where its address was published.**
  A search cannot see loads that leave no link or readers outside the repository, so the evidence covers every
  form of the address that Step 2.2 lists.
- **Leave records as written, except link fixes.** Released changelog entries, decision records, history files,
  session records, quoted text, and generated copies show what was true or come from a source that is edited
  instead; the changelog's Unreleased section stays live until release.

## Procedure

### Phase 1 — Set the Subject and Levels

Agree what is cleansed, how far, and what the run may commit. Done when the subject, each action's depth and
intensity, the commit authority, and the baseline are in the map.

#### 1.1 Confirm the subject

- Confirm the subject's paths with the user. This skill takes a subject whose main result is docs, prose
  reports, in-repo API reference pages, skills, or a changelog, as the roles in
  [Gobbi Step 2.5](../../gobbi/SKILL.md#25-spawn-each-specialist-as-its-role) split work; a subject whose main
  result is code or visual goes to [Code Cleansing](../cleansing-code/SKILL.md) or
  [Design Cleansing](../cleansing-design/SKILL.md).
- Leave agent instruction files, such as `CLAUDE.md`, `AGENTS.md`, and role files, outside the subject, and tell
  the user when the request names one.
- Start only from committed work. Write the [cleansing map](templates/map.md) as the run's Ideation result, at
  the Ideation output root the mode gives, or at a path the user names outside the subject.

#### 1.2 Ask the levels and commit authority

- With the runtime's structured question tool, ask the depth of refactoring, renaming, and removing (Module,
  Class, Function, or Skip), then the intensity of each action not skipped, as the [Levels](#levels) define
  them. A part of another domain inside the subject, such as a script in a skill, takes the same answers.
- In the same question, ask whether each applied step may be committed, limited to the paths the change list
  touches. Without that authority, a failed step is fixed in that step, or the run stops and the user chooses to
  restore or keep the changes.
- Record the answers and the baseline in the map: the skill checker's output when the subject has skills, a
  link check, and any other check the subject has.

### Phase 2 — Define and Design

Describe the subject as it is, then derive the simpler target. The manager briefs one `leader` through
[Delegation](../../delegation/SKILL.md) to write the map and change list, and gives each area of a large subject
to a mapping subagent whose map that `leader` merges. Done when the map covers every unit from the largest
chosen depth down, each mark has a change, a Suggestion, or a separate decision, and the user approved the
change list.

#### 2.1 Map the units, commonality, and vocabulary

- For each unit, write its kind, definition, responsibility, boundary, what it uses, what uses it, who uses its
  address, and any read-only reason from Rule 5 or the standard that owns it. Mark each unit that needs "and",
  overlaps, leaks, forms a cycle, depends the wrong way, has a contradicting name, is unused, is superseded, is
  a copy, or is padding that fails
  [Every line earns its place](../../authoring/authoring-review/SKILL.md#every-line-earns-its-place).
- Compare each copy with its original. An exact copy is a removal candidate and a drifted copy is a separate
  decision; share text only when it is identical now and must stay so.
- In live documents, list each concept's names and each name's concepts beside the term to use: the project's
  own term first, then the field's. Ask the user when these disagree or none exists.

#### 2.2 Derive the change list

- Write one change per mark, inside the levels, ordered removals, then refactors, then renames. Put the rest in
  Suggestions, and any change to what Rule 3 keeps in Separate Decisions.
- Give each removal its evidence. For non-use, search the path, directory name, `name:`, title, anchor,
  generated copies, loaders that leave no link (user-only skills, `paths` rules, domain-root routing), and
  published links; for a copy, name the live document that keeps every instruction and fact in it.
- For each address that changes, list its users outside the subject and its stub, redirect, or upgrade note.
  For a skill, also search what [Gobbi Skill Step 3.1](../../gobbi-skill/SKILL.md#31-improve-the-structure) lists.

#### 2.3 Approve the change list

- Show the user the target beside the current structure, the changes in order, each removal with its evidence,
  each address change, the separate decisions, and the two defaults under [Levels](#levels): what counts as a
  published address, and padding as a Moderate removal.
- Have the `leader` apply the user's edits from the earliest Step they affect, then ask for approval with the
  runtime's structured question tool.

### Phase 3 — Apply in Small Checked Steps

Carry out the approved change list without changing what readers get. The manager gives each apply task to the
role that owns its part, as Gobbi Step 2.5 assigns, such as the `developer` for a script in a skill. Done when
every approved change is applied and the baseline checks and the pinned lists match, except for approved
changes.

#### 3.1 Apply

- Apply removals, then refactors, then renames, so each name changes once on the final structure.
- Update every user of a changed part in the same step: links, loaders, settings, and a generated copy through
  its source.
- Commit a step only with the per-step authority from Step 1.2, on the paths the change list touches.

#### 3.2 Check each step

- Before editing a unit, list its instructions, facts, and frontmatter; after the edit, compare the two lists
  as sets, not the diff. For a change the user approved, update the list to the approved result.
- Run the baseline checks. Fix a new failure in that step; when it cannot be fixed, undo the step to the last
  step commit, or without commit authority stop the run and let the user choose to restore or keep the changes.
- When the work reveals a change the list does not include, add it to Suggestions instead of applying it.

### Phase 4 — Report the Result

Tell the user what changed and what remains. Done when the user has the report.

#### 4.1 Report

- Report the structure before and after with its final definitions and vocabulary, the changes applied, the
  removals with their evidence, the checks against the baseline, what stays unverified, and the Suggestions.
- Leave any commit the run had no authority for to the user, and suggest an independent
  [Review](../../review/SKILL.md) against [Authoring Review](../../authoring/authoring-review/SKILL.md).

## Levels

| Action | What it changes |
|---|---|
| Refactoring | Structure: merge, split, inline, or move documents and sections so each has one purpose and one owner, and steps stay apart from background. |
| Renaming | Names: terms, headings, and document and skill names, aligned to the project's and then the field's vocabulary, one term per concept. |
| Removing | Parts: what is unused, copied, superseded, or complexity with no present need. |

| Depth | Largest unit the action may change |
|---|---|
| Module | Document families, skill families, and folders |
| Class | Documents and sections |
| Function | Paragraphs, list items, table rows, and terms |

Module includes Class and Function, Class includes Function, and Skip leaves the action out. A term rename at
any depth still updates every use of the term.

| Intensity | Refactoring | Renaming | Removing |
|---|---|---|---|
| Conservative | Only a stated defect, such as a "see X" cycle or a fact moved to its owner. Addresses stay. | Names that contradict their definition. Published names stay. | Parts proved unused, exact copies, and superseded parts. Published addresses stay. |
| Moderate | Also merges of identical copies, splits of mixed-purpose documents, and inlines. An address changes only when all its users are inside the subject. | Also names that differ from the chosen term. A published name changes only when all its users are inside the subject. | Also padding, such as restatement, hedging, generic advice, or a stock transition, when a live document keeps every instruction and fact in it, and complexity with no present need. |
| Aggressive | Rebuild toward the simplest structure the definitions allow, with outside users listed and a stub left. | Also published names, with an alias or an upgrade note. | Also a published address, with a stub or redirect. |

A published address is a skill or role name, or any name or path that `README.md`, `CHANGELOG.md`, or a skill
index names.

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The one document that holds the levels, the baseline, the unit map, and the change list. |
| [Authoring Review](../../authoring/authoring-review/SKILL.md) | The bar for structure, shared text, vocabulary, and padding. |
| [Gobbi Skill](../../gobbi-skill/SKILL.md) | The standard and checker for skills, and what to search when a skill is renamed, merged, or removed. |
| [Gobbi](../../gobbi/SKILL.md) | Step 2.5 assigns each part's work to its role. |
| [Code Cleansing](../cleansing-code/SKILL.md) | The cleansing for a subject whose main result is code. |
| [Design Cleansing](../cleansing-design/SKILL.md) | The cleansing for a subject whose main result is visual. |
| [Delegation](../../delegation/SKILL.md) | Briefs for the `leader` and the mapping subagents. |
| [Review](../../review/SKILL.md) | The independent review suggested after the run. |
