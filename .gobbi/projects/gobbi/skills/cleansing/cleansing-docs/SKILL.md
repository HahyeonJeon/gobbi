---
name: cleansing-docs
description: "Docs Cleansing restructures, renames, and removes Ontology units of a document set so it stays simple and clearly defined. Use it when the user asks to cleanse docs, prose reports, in-repo API reference pages, skills, or a changelog."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Docs Cleansing

Docs Cleansing turns documents that grew without a plan back into a small set of clearly defined Ontology units.
Use it when the user asks to cleanse docs, prose reports, in-repo API reference pages, skills, or a changelog. The
manager runs it with the user, a `leader` writes the map and change list, and the role that owns each Ontology unit
applies the approved changes. Only the user starts it.

## Principles

### Define first, then restructure

An Ontology unit is a Set, Document, or Passage, as the [Levels](#levels) define them. Before anything moves, each
Ontology unit gets the six fields of [Ontology](../../ontology/SKILL.md#give-each-ontology-unit-six-fields) and the
docs fields: who reads it, the job it serves that reader, and its kind of writing. A structure built from clear
definitions needs little explanation; one without them decays again.

### Systematic means simple

Each change removes a concept, a document, a link hop, or a term, or makes an Ontology unit do what its definition
says. Agents add far more text than they remove, so most of the work is removing.

### Change the shape, keep what the reader gets

Cleansing changes structure, names, and Ontology units nothing needs. What a document tells its reader, and what an
agent does when it loads the document, stays the same.

## Rules

- **MUST ask the depth and intensity of restructuring, renaming, and removing separately, and stay within the
  answers.** The levels decide how much of the user's work may change, so a change beyond them goes to
  Suggestions.
- **MUST get the user's approval of the change list before any file in the subject changes.** The list can
  move, rename, and delete much of the user's work, and a wrong list is costly to undo.
- **Keep what readers get: facts, instructions with their conditions, upgrade notes, triggers and permissions
  (`description`, `allowed-tools`, `disable-model-invocation`, `paths`), addresses, the reader's job, and output
  formats.** Agents act on what they load, so a rename can change what an agent does, and a change to one of
  these, such as merging copies that drifted apart, is a separate decision for the user.
- **Remove an Ontology unit only with recorded evidence, and leave a stub or redirect where its address was
  published.** A search cannot see loads that leave no link or readers outside the repository, so the evidence
  covers every address form and loader that Step 2.2 lists.
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

- With the runtime's structured question tool, ask the depth of restructuring, renaming, and removing (Set,
  Document, Passage, or Skip), then the intensity of each action not skipped, as the [Levels](#levels) define
  them. An Ontology unit of another domain inside the subject, such as a script in a skill, takes the same answers.
- In the same question, ask whether each applied change may be committed, limited to the paths the change list
  touches. Without that authority, a failed change is fixed in that change, or the run stops and the user
  chooses to restore or keep the changes.
- Record the answers and the baseline in the map: the result of each check before any edit (the skill checker
  when the subject has skills, a link check, and any other check the subject has) and the counts of Sets,
  documents, sections, and words.

### Phase 2 — Define and Design

Describe the subject as it is, then derive the simpler target. The manager briefs one `leader` through
[Delegation](../../delegation/SKILL.md) to write the map and change list, and gives each area of a large subject to
a mapping subagent whose map that `leader` merges. Done when the map has an Ontology unit record for each document,
each larger Ontology unit within the chosen depths, and each marked Passage; each mark has a change, a Suggestion,
or a separate decision; every document the change list touches has its pinned lists; and the user approved the
list.

#### 2.1 Map the Ontology units, commonality, and vocabulary

- Write an Ontology unit record for each document and each larger Ontology unit within the chosen depths, and for
  a Passage only when it carries a mark, with the fields the map gives. Mark each Ontology unit with every
  [Mark](#marks) that applies.
- Compare each copy with its original. An exact copy is a removal candidate and a drifted copy is a separate
  decision; share text only when it is identical now and must stay so.
- In live documents, list each concept's names and each name's concepts beside the term to use and where that
  term is defined: the project's own term first, then the field's. Ask the user when these disagree or none
  exists.

#### 2.2 Derive the change list

- Write one change per mark, inside the levels, ordered removals, then restructures, then renames. Put the rest
  in Suggestions, and any change to what the Keep-what-readers-get Rule keeps in Separate Decisions.
- Give each removal its evidence. For an orphan, search the path, directory name, `name:`, title, anchor,
  generated copies, loaders that leave no link (user-only skills, `paths` rules, domain-root routing), and
  published links; for a copy, name the live document that keeps every instruction and fact in it.
- For each address that changes, list its dependents and readers outside the subject and its stub, redirect, or
  upgrade note. For a skill, also search what
  [Gobbi Skill Step 3.1](../../gobbi-skill/SKILL.md#31-improve-the-structure) lists.

#### 2.3 Pin what readers get

- For each document the change list touches, the `leader` writes its pinned lists in the map from committed
  work: one row for each item the Keep-what-readers-get Rule keeps, and for an instruction also its condition,
  its order, and any `MUST` or `NEVER`.
- For each touched document, the manager launches a fresh agent through Delegation that does the document's job
  as its reader from the document alone, as
  [A cold reader can act on it](../../authoring/authoring-review/SKILL.md#a-cold-reader-can-act-on-it) asks,
  running a skill's task with the skill loaded. Record where it would stop as the document's reader's-job row.

#### 2.4 Approve the change list

- Show the user the target beside the current structure, the changes in order, each removal with its evidence,
  each address change, the separate decisions, and the two defaults under [Levels](#levels): what counts as a
  published address, and padding as a Moderate removal.
- Have the `leader` apply the user's edits from the earliest Step they affect, then ask for approval with the
  runtime's structured question tool.

### Phase 3 — Apply One Checked Change at a Time

Carry out the approved change list without changing what readers get. The manager gives each apply task to the role
that owns its Ontology unit, as Gobbi Step 2.5 assigns, such as the `developer` for a script in a skill. Done when
every approved change is applied, the baseline checks and the pinned lists match except for approved changes, and
each touched document's reader can still do its job.

#### 3.1 Apply

- Apply removals, then restructures, then renames, so each name changes once on the final structure.
- A change is one row of the change list, applied to its Ontology unit and to every dependent in the same change:
  links, loaders, settings, and a generated copy through its source.
- Commit a change only with the per-change authority from Step 1.2, on the paths the change list touches.

#### 3.2 Check each change

- Find each pinned item in the changed text, item by item, not from the diff. A missing item, an instruction
  moved out of order, or a changed condition fails the change; for an approved change, update the item to the
  approved result.
- Run the baseline checks, then check what they miss: each remaining Ontology unit is still listed from its index
  or router, a reader meets each prerequisite first, position words such as "above" and relative paths in moved
  text still point right, and the commands and paths that moved text names still run and open.
- Fix a new failure in that change; when it cannot be fixed, undo the change to the last change commit, or
  without commit authority stop the run and let the user choose to restore or keep the changes. A change the
  list does not include goes to Suggestions instead of being applied.

#### 3.3 Check the reader's job

- After the last change to a document, a fresh agent that did not edit it repeats the walk from Step 2.3.
- A stop the first walk did not have fails like a check in Step 3.2.

### Phase 4 — Report the Result

Tell the user what changed and what remains. Done when the user has the report.

#### 4.1 Report

- Report the structure before and after with its final definitions and vocabulary, the changes applied, the
  removals with their evidence, the checks against the baseline, the reader's-job walks before and after, what
  stays unverified, and the Suggestions.
- Give the counts of Sets, documents, sections, and words before and after, with no score.
- Leave any commit the run had no authority for to the user, and suggest an independent
  [Review](../../review/SKILL.md) against [Authoring Review](../../authoring/authoring-review/SKILL.md).

## Levels

| Action | What it changes |
|---|---|
| Restructuring | Structure: merge, split, or move documents and sections, or replace a link with the text it points to, so each Ontology unit does one job for one reader and steps stay apart from background. |
| Renaming | Names: terms, headings, and document and skill names, aligned to the project's and then the field's vocabulary, one term per concept. |
| Removing | Ontology units nothing needs: orphans, exact copies, superseded Ontology units, padding, and Ontology units with no present need. |

| Depth | Largest Ontology unit the action may change |
|---|---|
| Set | Document families, skill families, folders, and the indexes that route them |
| Document | Documents and sections |
| Passage | Paragraphs, list items, table rows, and terms |

Set includes Document and Passage, Document includes Passage, and Skip leaves the action out. A term rename at
any depth still updates every use of the term.

| Intensity | Restructuring | Renaming | Removing |
|---|---|---|---|
| Conservative | Only a stated defect, such as a circular "see X" chain or a fact moved to its owner. Addresses stay. | Names that contradict their definition. Published addresses stay. | Orphans whose evidence covers every address form and loader, exact copies with their keeper named, and superseded Ontology units. Published addresses stay. |
| Moderate | Also merges of Ontology units that do the same job for the same reader, splits of Ontology units that do two jobs, and replacing a link with its text when the text is shorter than the link. An address changes only when all its dependents are inside the subject. | Also names that differ from the chosen term. A published address changes only when all its dependents are inside the subject. | Also Ontology units with no reader job, Ontology units with no present need, and padding, such as restatement, a hedge that states no condition, generic advice, or a stock transition, when a live document keeps every instruction and fact in it. |
| Aggressive | Rebuild toward the simplest structure the definitions allow, with outside dependents listed and a stub left. | Also published addresses, with an alias or an upgrade note. | Also a published address, with a stub or redirect. |

A published address is a skill or role name, or any name or path that `README.md`, `CHANGELOG.md`, or a skill index
names. A dependent is an Ontology unit, loader, or setting that relies on another Ontology unit, such as by a link
to it or a load by its name.

## Marks

| Mark | The Ontology unit | Usual route |
|---|---|---|
| Two jobs | Does two jobs, such as steps mixed with background. | Restructuring |
| Overlap | Explains, restates, or owns what another Ontology unit owns. | Restructuring or Removing |
| See-X cycle | Sits in a circular chain of "see X" links. | Restructuring |
| Prerequisite after use | Comes before its own prerequisite, or cannot be read without its index. | Restructuring |
| Contradicting name | Has a name that contradicts its definition. | Renaming |
| Orphan | Has no dependent found; a candidate until the Step 2.2 evidence covers every address form and loader. | Removing |
| No reader job | Serves no reader's job. | Removing |
| Superseded | Is replaced by a newer live Ontology unit. | Removing |
| Exact copy | Matches another live Ontology unit, its keeper, word for word. | Removing |
| Drifted copy | Is a copy that differs from its original. | Separate Decisions |
| Padding | Fails [Every line earns its place](../../authoring/authoring-review/SKILL.md#every-line-earns-its-place). | Removing |
| No present need | Is a shared block with per-reader variants or conditions, a link chain deeper than one hop, or an option no reader chooses. | Restructuring or Removing |
| Outdated claim | States a claim that is no longer true. | Separate Decisions |
| Broken reference | Holds a link, path, or name that does not resolve. | Separate Decisions |
| Contradicts another document | Contradicts another live document. | Separate Decisions |

## References

| Name | Description |
|---|---|
| [Cleansing map](templates/map.md) | The one document that holds the levels, the baseline, the Ontology unit records, the pinned lists, and the change list. |
| [Ontology](../../ontology/SKILL.md) | The six fields of an Ontology unit record and their tests. |
| [Authoring Review](../../authoring/authoring-review/SKILL.md) | The bar for structure, shared text, vocabulary, padding, and the cold reader. |
| [Gobbi Skill](../../gobbi-skill/SKILL.md) | The standard and checker for skills, and what to search when a skill is renamed, merged, or removed. |
| [Gobbi](../../gobbi/SKILL.md) | Step 2.5 assigns each Ontology unit's work to its role. |
| [Code Cleansing](../cleansing-code/SKILL.md) | The cleansing for a subject whose main result is code. |
| [Design Cleansing](../cleansing-design/SKILL.md) | The cleansing for a subject whose main result is visual. |
| [Delegation](../../delegation/SKILL.md) | Briefs for the `leader`, the mapping subagents, and the reader's-job agents. |
| [Review](../../review/SKILL.md) | The independent review suggested after the run. |
