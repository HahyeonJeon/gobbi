# Cleansing Map — {subject}

## Levels

| Action | Depth | Intensity |
|---|---|---|
| Restructuring | {Set, Document, Passage, or Skip} | {Aggressive, Moderate, or Conservative} |
| Renaming | {…} | {…} |
| Removing | {…} | {…} |

**Commit authority:** {per-change commits on the change list's paths, or none}

**Baseline checks:** {each check and its result before any edit}

**Baseline counts:** {Sets, documents, sections, and words before any edit}

**Map location:** {the run's Ideation output root, or the path the user named outside the subject}

## Units

{One record for each document, each larger unit within the chosen depths, and each marked Passage. The first
six fields are the Ontology unit definition; Depth, Kind, Reader, Job, Dependents, and Marks are the docs fields.}

### {Unit: path, heading, or name}

- **Definition:** {the kind of thing it is and what sets it apart from its siblings, in one sentence with no "and"}
- **Responsibility:** {the facts or policy only it holds}
- **Boundary:** {what it includes, and what it leaves to other units}
- **Relations:** {each unit it links or routes to, outward, with the kind: prerequisite, optional link, or load}
- **Dependencies:** {what it needs, such as a prerequisite, a term it uses, or the source it is generated from,
  and what breaks if that fails, changes, or goes away}
- **Properties:** {its address forms (path, `name:`, title, anchors), its frontmatter, and its read-only reason
  from the Leave-records Rule or the standard that owns it, or none}
- **Depth:** {Set, Document, or Passage}
- **Kind:** {tutorial, how-to, reference, explanation, index, or record; a Set lists the kinds it holds}
- **Reader:** {who reads it: a person's role, or the agent or router that loads it}
- **Job:** {what that reader must be able to do or know after reading it}
- **Dependents:** {each link, loader, setting, or name that relies on its address, inside the subject; then each
  dependent and reader outside the subject}
- **Marks:** {each mark from the skill's Marks table, or none}

## Commonality and Variability

- {What documents share or copy, and what really varies between them now.}

## Vocabulary

| Concept | Names found | Term to use | Defined in |
|---|---|---|---|
| {concept} | {every name used for it in live documents} | {the project's term, then the field's} | {the one unit that defines the term} |

## Change List

| # | Change | Action | Depth | Evidence |
|---|---|---|---|---|
| 1 | {what changes} | {remove, restructure, or rename} | {level} | {the mark, the search that shows an orphan has no dependent, or the live document that keeps a copy's content} |

{List removals first, then restructures, then renames. Each changed address names its dependents and readers
outside the subject and its stub, redirect, or upgrade note.}

## Pinned Lists

{One row for each item the Keep-what-readers-get Rule keeps, in each document the change list touches, written
before any edit.}

| # | Document | Item kind | Item | Condition, order, and strength | Found after the change |
|---|---|---|---|---|---|
| 1 | {document or section} | {fact, instruction, upgrade note, trigger or permission, address, reader's job, or output format} | {the text, value, or template field; for the reader's job, where the fresh agent would stop} | {for an instruction: its condition, its place in the order, and any `MUST` or `NEVER`; otherwise none} | {where the item is after each change, or the approved change that alters it} |

## Separate Decisions

- {Changes to what readers get, such as merging drifted copies or fixing an outdated claim, for the user to
  decide, each with its evidence.}

## Suggestions

- {Changes outside the chosen levels or found during the work, for the user to decide later.}
