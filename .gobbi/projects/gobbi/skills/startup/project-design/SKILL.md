---
name: project-design
description: "Project Design is an operation that derives session design drafts from an accepted interview and creates the Gobbi namespace."
allowed-tools: Read, Grep, Glob, Write, Edit, AskUserQuestion
skill-type: operation
---

# Project Design

Project Design derives session design drafts from an accepted interview and
creates the Gobbi namespace. Use it when a caller has an accepted
`{session-root}/interview.md` and needs Temporary Records under
`{session-root}/tmp/startup/design/`.

## Principles

### Derive from the accepted interview

Project Design restates accepted interview answers as design drafts. It does
not invent a lifecycle, stack, or feature.

### Write session Temporary Records

Write under `{session-root}/tmp/startup/design/` using Design Memory path names.
Durable Memory waits for the conductor.

### Keep every heading

Fill each required heading, mark it not applicable, or mark it open. Never
delete a heading.

### Create the namespace without Memorize

Create the Gobbi ignore file and memory directory only when they are missing.
Stop when the ignore file exists and its bytes conflict.

## Rules

- **MUST stop if session root, target root, or project key is missing.** Do
  not derive a replacement identity.

- **MUST derive every design statement from accepted `{session-root}/interview.md`
  and cited topic ids.** Ask one user question when a required lifecycle answer
  is missing; never invent it.

- **MUST write session Temporary Records at `{session-root}/tmp/startup/design/`
  using Memory path names `architecture/overview.md`, `architecture/platform.md`,
  `process/product.md`, and `feature/<feature>.md`.**

- **MUST fill every required heading with a derived statement,
  `Not applicable — {reason}`, or `Open — {what would resolve it}`.**

- **MUST create `{target}/.gobbi/.gitignore` only if missing, with the Gobbi
  comment plus `projects/*/sessions/` and `projects/*/worktrees/` only; stop if
  that file exists and its bytes conflict.** Create
  `{target}/.gobbi/projects/<key>/memory/` if missing.

- **NEVER write durable Memory design files, `{target}/.gitignore`, or
  `## Roadmap` in any README, and never call Memorize or use Bash.**

## Procedure

### Phase 1 — Confirm sources

#### 1.1 Confirm identity

- Require session root, target root, and project key from the caller.
- Stop and name the missing value if any is absent, including when this skill
  is loaded directly.

#### 1.2 Require the accepted interview

- Require `{session-root}/interview.md` to exist and record user acceptance.
- Stop and name the missing draft or acceptance if either is absent.

#### 1.3 Read the sources

- Read the accepted interview and cite topic ids without copying the whole
  draft.
- Read `{target}/.gobbi/projects/<key>/memory/design/` when that tree exists so
  a re-entry can update session drafts against current design.
- Stop and name a blocking open interview question that prevents a safe design
  statement.

### Phase 2 — Write session drafts

#### 2.1 Write overview

- Write `{session-root}/tmp/startup/design/architecture/overview.md` from the
  [overview template](templates/overview.md) using Branch 1.
- Fill every overview heading from the matching topic id, or mark it
  `Not applicable` or `Open`.

#### 2.2 Write platform

- Write `{session-root}/tmp/startup/design/architecture/platform.md` from the
  [platform template](templates/platform.md) using Branch 2.
- Fill the Stack table, treating local-stack rows as the only Bootstrap input
  from design.

#### 2.3 Write product

- Write `{session-root}/tmp/startup/design/process/product.md` from the
  [product template](templates/product.md) using Branch 3 except `core-tasks`
  detail, plus Branch 2 `experience-direction` for Audience and experience
  direction.
- Keep one product file. If several products exist, keep `## Products` as the
  inventory and add one subsection per product under the remaining product
  headings.
- Record `core-tasks` only in the Feature index. If `core-tasks` is explicitly
  none, write no feature files and say so there.

#### 2.4 Write feature files

- For each named `core-tasks` item, write
  `{session-root}/tmp/startup/design/feature/<feature>.md` from the
  [feature template](templates/feature.md). Skip a refused use; it is not a
  feature file.
- Name `<feature>` in kebab-case matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`. If two
  products share a task name, use `{product}-{task}`.
- Fill Behavior subheadings Normal, Alternate, Invalid, Failure, and Recovery.

#### 2.5 Complete every heading

- Confirm every required heading in the written drafts is filled,
  `Not applicable — {reason}`, or `Open — {what would resolve it}`.
- Ask one user question through AskUserQuestion when a lifecycle answer is
  missing and would otherwise be invented.
- List cited topic ids in each draft, including Interview sources on every
  feature file.

### Phase 3 — Create namespace and return

#### 3.1 Create `.gobbi/.gitignore` if missing

- If `{target}/.gobbi/.gitignore` is missing, create it with exactly these
  bytes:

```text
# Gobbi runtime state. Session evidence and linked worktrees are never tracked.
projects/*/sessions/
projects/*/worktrees/
```

- If that file exists and its bytes differ, stop and name the conflict. Do not
  overwrite it.
- If that file exists and matches, leave it unchanged.

#### 3.2 Create the memory directory

- Create `{target}/.gobbi/projects/<key>/memory/` if it is missing.
- Do not write durable Memory design files, `{target}/.gitignore`, `sessions/`,
  `worktrees/`, `rules/`, other Memory categories, or `## Roadmap` in any
  README.
- Do not call Memorize.

#### 3.3 Return the drafts

- Return the absolute session draft paths and remaining Open items.
- State that Project Design is complete only when every required heading is
  filled, marked not applicable, or marked open, and the namespace rule
  succeeded.
- Do not start Roadmap, Bootstrap, or planning.

## References

| Name | Description |
|---|---|
| [Overview template](templates/overview.md) | Session draft sections for `{session-root}/tmp/startup/design/architecture/overview.md`. |
| [Platform template](templates/platform.md) | Session draft sections and Stack table for `{session-root}/tmp/startup/design/architecture/platform.md`. |
| [Product template](templates/product.md) | Session draft sections and Feature index for `{session-root}/tmp/startup/design/process/product.md`. |
| [Feature template](templates/feature.md) | Per-feature specification for `{session-root}/tmp/startup/design/feature/<feature>.md`. |
| [Interview topics](../interview/topics.md) | The 24 topic ids Project Design cites as sources. |
