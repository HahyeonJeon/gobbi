---
name: roadmap
description: "Roadmap is an operation that writes a session project-horizon draft from accepted design drafts."
allowed-tools: Read, Grep, Glob, Write, Edit, AskUserQuestion
skill-type: operation
---

# Roadmap

Roadmap writes one session project-horizon draft. Use it when a caller has
accepted Project Design session drafts and needs local-then-cloud feature order
without a plan.

## Principles

### Draft sequence, not a plan

Roadmap records project-level horizons and feature order. Planning, not Startup,
turns one horizon into a task hierarchy.

### Derive from accepted design drafts

Roadmap restates accepted Project Design session drafts as horizon order. It
does not invent features.

### Write session Temporary Records

Write `{session-root}/tmp/startup/design/roadmap/project.md`. Durable Memory
waits for the conductor.

### Place every feature once

Every feature file appears in exactly one horizon or in Not scheduled. That
check is mechanical.

## Rules

- **MUST stop if session root, target root, or project key is missing.** Do
  not derive a replacement identity.

- **MUST require accepted Project Design session drafts at
  `{session-root}/tmp/startup/design/` for overview, platform, product, and the
  feature set or an explicit zero-feature statement.**

- **MUST write the session Temporary Record
  `{session-root}/tmp/startup/design/roadmap/project.md` from the
  [project template](templates/project.md).** The only other allowed write is
  `## Roadmap` in `{session-root}/tmp/startup/design/README.md` when that draft
  exists.

- **MUST place every feature id in exactly one horizon or in Not scheduled,
  and put a local horizon first when cloud is later in scope unless Interview
  recorded a different rule.**

- **MUST own `## Roadmap` only in `{session-root}/tmp/startup/design/README.md`
  when that draft exists.** Do not create that README, and do not write durable
  Memory.

- **NEVER write dates, estimates, assignees, sprints, or tasks, and never use
  Bash, start Bootstrap, call Memorize, publish, or merge.**

## Procedure

### Phase 1 — Confirm sources

#### 1.1 Confirm identity

- Require session root, target root, and project key from the caller.
- Stop and name the missing value if any is absent, including when this skill
  is loaded directly.

#### 1.2 Require Project Design drafts

- Require `{session-root}/tmp/startup/design/architecture/overview.md`,
  `architecture/platform.md`, and `process/product.md` to exist.
- Require the product Feature index or an explicit zero-feature statement, plus
  each listed `{session-root}/tmp/startup/design/feature/<feature>.md`.
- Stop and name the missing draft or acceptance if the caller cannot confirm
  the drafts were accepted.

#### 1.3 Read the sources

- Read the session design drafts and collect every feature id from the Feature
  index and feature files.
- Read `{session-root}/interview.md` when the local-versus-cloud rule or
  Bootstrap state is still open.
- Stop and name a blocking open design item that prevents a safe horizon
  statement.

### Phase 2 — Write the session draft

#### 2.1 Create the session draft

- Write `{session-root}/tmp/startup/design/roadmap/project.md` from the
  [project template](templates/project.md).
- Keep every required heading. Fill it, mark `Not applicable — {reason}`, or
  mark `Open — {what would resolve it}`.
- Confirm the live path is that session tmp path and that no Memory path was
  written.

#### 2.2 Record direction and current position

- Write Direction in two to four sentences. Use local single-user or local
  first check before cloud or multi-user unless Interview recorded a different
  rule.
- Write Current position from what is true now: local versus cloud, and whether
  Bootstrap has already run, using target files and session drafts without Bash.

#### 2.3 Record horizons

- Write three to six horizon blocks in order. Put a local horizon first when
  cloud is later in scope.
- Fill each block's six fields: Name and outcome, Included feature ids, Entry
  condition, Exit evidence, Deliberately deferred, and Costly decision.
- Ask one AskUserQuestion at a time only to resolve feature-to-horizon
  placement or the local-versus-cloud rule when Interview left them open.

#### 2.4 Complete the remaining sections

- Place every feature id from the Feature index and `feature/<feature>.md`
  files in exactly one horizon or in Not scheduled. If the Feature index is
  explicitly none, write no feature ids.
- Fill Replan and stop with observations that require the horizon order to be
  revised or that require a horizon or the project to stop.
- Confirm the file has no dates, estimates, assignees, sprints, or tasks.

### Phase 3 — Navigate, accept, and return

#### 3.1 Own the session README heading

- If `{session-root}/tmp/startup/design/README.md` exists, add `## Roadmap` if
  missing and add or refresh one `[Project](roadmap/project.md)` bullet without
  duplicating the heading.
- If that draft is absent, do not create a README.
- Do not write durable Memory or any path under
  `{target}/.gobbi/projects/<key>/memory/`.

#### 3.2 Obtain acceptance

- Present `{session-root}/tmp/startup/design/roadmap/project.md` as a
  session-only draft. Planning, not Startup, turns one horizon into a task
  hierarchy.
- On rejection, return to the earliest disputed placement or rule and revise
  the draft in place.
- On acceptance, treat user acceptance of this file as completion, and do not
  copy it into Design Memory.

#### 3.3 Return the draft

- Return the absolute path
  `{session-root}/tmp/startup/design/roadmap/project.md` and remaining Open
  items.
- State that Roadmap is complete only when every feature id is placed, every
  required heading is filled or marked, and the user accepted the draft.
- Do not start Bootstrap, write durable Memory, or call Memorize. These session
  files are later Memorize inputs for `{memory}/design/roadmap/project.md` and
  the durable README `## Roadmap` heading.

## References

| Name | Description |
|---|---|
| [Project template](templates/project.md) | Session draft sections Roadmap fills at `{session-root}/tmp/startup/design/roadmap/project.md`. |
| [Product template](../project-design/templates/product.md) | Feature index and zero-feature statement Roadmap uses to place feature ids. |
