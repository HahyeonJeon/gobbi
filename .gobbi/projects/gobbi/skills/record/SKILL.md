---
name: record
description: "MUST load when a session's evidence must be captured at its durable strength. Record is an operation skill for judging which evidence is durable, writing it into the session's nested memory directories, and proving what was captured."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Record

Use this skill when a closed unit of work — one step, one task, or a whole session — has produced evidence that
may outlive it. The operation judges each piece of evidence at its durable strength, writes only what survives
that test into the session's nested `memory/` shape, and proves what it wrote.

The operation names the shape of that tree and what each directory receives. It does not name where the tree
lives: the caller supplies the session location and roots the shape there. Every write stays inside that
location.

Recording is not memorizing. A file under `memory/` declares that its content will be memorized later; this
operation never writes the project's durable memory itself. An honest empty result is a complete result.

## Principles

### Record at evidentiary strength

A verified result, an approved decision, a reproduced finding, or a shipped change can justify a record. A
plausible thought, an intention, or a wish to fill a directory cannot, and an empty result is valid.

### Write durable content only at closure

While work is open its conclusions still move, so a record written early states a result that may never hold.
Capture when the unit closes and its evidence is settled.

### Keep earlier evidence immutable

A later record supersedes an earlier one by standing beside it and naming what it replaces. Rewriting the
earlier record to match the newer conclusion destroys the trail that made the newer one credible.

### Placement declares intent

A file placed under `memory/` declares that it will be memorized; a file placed outside it does not.
Session-only material therefore stays outside `memory/`, whatever its value inside the session.

## Rules

- **MUST record only evidence that is both verified and useful after the session.** Cite the exact source for
  every record, and record nothing whose only support is a plausible thought or an unverified claim.
- **MUST write durable records only after the unit that produced their evidence has closed.** An open step,
  task, or session produces no durable record.
- **NEVER rewrite, overwrite, or delete an earlier record.** Add a new record that names what it supersedes and
  leave the earlier one unchanged.
- **NEVER record operational exhaust, secrets, or private capture.** This excludes agent turns, usage, token or
  cache counts, transcripts, raw conversation, and transient task state; reference or redact a protected value
  instead of copying it.
- **MUST place every record in the one directory its content matches and keep session-only material outside
  `memory/`.** Create a directory only when its first record needs it, and never place one record in two
  directories.
- **MUST prove the result before returning.** Reread every written path and confirm its content, or report the
  empty result explicitly, because a status line alone is not proof.

## Procedure

### Phase 1 — Establish the Closing Unit and Freeze Its Evidence

#### 1.1 Confirm closure and the session location

- Take the unit that is closing — one step, one task, or the whole session — the caller-supplied session
  location, and the caller's name for the session-only sibling directory as the input.
- Confirm the unit is closed: its work is finished, its result is accepted by whoever owns that acceptance, and
  no open question could still change it.
- Confirm the session location exists and resolves inside the working tree, with no symbolic link and no
  parent-traversal component on the path.
- Record the unit identity and the resolved location. If the unit is still open, or the location is missing,
  relative, or ambiguous, stop and report the exact blocker without writing.

#### 1.2 Freeze and inventory the evidence

- Read the unit's complete evidence: the work produced, the decisions taken and who took them, the findings and
  their disposition, the checks run and their results, the sources consulted, the deferred items, and the
  change actually shipped.
- Freeze that set. From here the inventory does not grow; new work belongs to a later unit and a later record.
- Read the records already present under the session shape, so a later record can name what it supersedes and a
  duplicate is not created.
- Record the frozen inventory. If required evidence is missing, or two pieces of it disagree, stop and report
  which, rather than recording the more convenient one.

### Phase 2 — Judge Durable Strength and Route

#### 2.1 Test each candidate at its evidentiary strength

- Take one item from the frozen inventory.
- Keep it only when both hold: it is supported by a verified result, an explicit decision, or a direct
  observation; and a reader in a later session, without this session's context, would act differently for
  knowing it.
- Discard operational exhaust, secrets, private capture, and transient state outright. Reference or redact
  protected evidence instead of copying it.
- When two items carry the same durable fact, keep one record and cite the other evidence from it.
- The result is a candidate set that may be empty. An empty set is the correct outcome for a unit that produced
  no durable change; continue to Step 3.2 and report it as such. Never invent a candidate to fill a directory.

#### 2.2 Route each candidate to one directory

- The session's durable shape is:

```text
memory/
├── design/
│   ├── architecture/
│   ├── feature/
│   ├── process/
│   └── roadmap/
├── learnings/
│   ├── design/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── work/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── memory/
│   │   ├── tips.md
│   │   └── mistakes.md
│   ├── dev/
│   │   ├── tips.md
│   │   └── mistakes.md
│   └── {domain}/
│       ├── tips.md
│       └── mistakes.md
├── reports/
│   ├── note/
│   ├── review/
│   └── analysis/
├── history/
├── materials/
│   ├── references/
│   ├── assets/
│   ├── docs/
│   └── data/
└── backlogs/
```

- Create each directory when its first record needs it. Do not scaffold the tree in advance: `{domain}` is
  open-ended, and an empty directory asserts a record that does not exist.
- Route each candidate by its content:

| Directory | Receives |
|---|---|
| `design/architecture/` | the project's technical foundation and how its parts fit |
| `design/feature/` | the design of one named capability |
| `design/process/` | the design of one way of working |
| `design/roadmap/` | direction over time for one subject |
| `learnings/{domain}/` | reusable knowledge in `tips.md` and repeatable failure patterns in `mistakes.md`, for `design/`, `work/`, `memory/`, `dev/`, or another stable subject |
| `reports/note/` | one completed piece of work, including the outcome of a discussion and the record of a shipped change |
| `reports/review/` | one review's subject, criteria, findings, and conclusion |
| `reports/analysis/` | one question, its method, and its interpreted result |
| `history/` | one completed session's durable change |
| `materials/references/` | external prior art consulted |
| `materials/assets/` | reusable non-document inputs |
| `materials/docs/` | supplied or imported context documents |
| `materials/data/` | durable machine-readable evidence |
| `backlogs/` | deferred outcomes and why they were deferred |

- Plans, scenarios, and checklists are session-only: they direct this session's work and are not memorized.
  Write them in the sibling directory the caller names beside `memory/`, never inside it.
- Beyond the file names this shape already fixes, each directory's interior conventions — file shape, naming,
  and index — belong to the operation that later memorizes the tree. Route the candidate to its directory; do
  not invent those conventions here.
- If a candidate matches two directories, split it into distinct facts or choose the directory a later reader
  would search first. If it matches none, keep it outside `memory/` and report it.

### Phase 3 — Write the Records and Prove the Result

#### 3.1 Write each routed record

- Take one routed candidate and its target directory.
- Write one file for one durable subject, named for that subject so a later reader finds it without this
  session's context.
- State the durable content, the evidence supporting it, and the decision authority when a person decided it.
  Write it to be read cold, with no session-relative pronoun and no unexplained identifier.
- When the record supersedes an existing one, name the superseded record and what changed, and leave that
  record unchanged.
- Repeat until every routed candidate is written, then continue to Step 3.2.

#### 3.2 Verify the record and return the result

- Reread every written path. Confirm the file exists, holds the intended content, and sits in the intended
  directory inside the session location.
- Confirm that no earlier record changed, no file landed outside the session location, no session-only kind
  landed under `memory/`, and no directory was created without a record in it.
- Return the unit identity, every written path with its directory, the superseded records, the evidence
  deliberately not recorded and why, and any blocker. Report an empty result explicitly as an empty result.
- If any check fails, repair that exact failure and run this step again. The record is complete only when every
  returned path is proved and the caller can reproduce the proof.

## References
