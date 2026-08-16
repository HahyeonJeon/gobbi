---
name: startup
description: "Startup is an operation that conducts Interview, Project Design, Roadmap, and Bootstrap, then Memory Wrap-up."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
skill-type: operation
---

# Startup

Startup conducts Interview, Project Design, Roadmap, and Bootstrap, then Memory
Wrap-up. Use it when a caller needs that pipeline and locked Design Memory from
session drafts.

## Principles

### Conduct children, do not copy them

The conductor owns order, identity, and gates. Each child owns its own SOP.

### Derive the project key once

The conductor derives the project key and passes session root, target root, and
that key. Children never invent identity.

### Gate the next phase

A later child starts only after the previous child's acceptance evidence exists.

### Memorize after Bootstrap

Memory Wrap-up loads Memory Memorize and makes one Memory-only commit. It is
not the Wrap-up skill.

## Rules

- **MUST stop if session root or target root is missing.** The conductor is the
  only owner of project-key derivation.
- **MUST start a later child only after the previous child's acceptance
  evidence exists.**
- **MUST confine durable Memory writes to Memory Wrap-up:** the locked Design
  Memory paths, the design README including the Roadmap heading, and one
  Memory-only commit.
- **NEVER load Wrap-up, Planning, or feature Execution, and never add a fifth
  child.**
- **NEVER publish, push, open a pull request, or merge.**
- **NEVER copy `{session-root}/interview.md` into Memory.**

## Procedure

### Phase 1 — Establish identity

#### 1.1 Require session and target

- Require the active Gobbi session root. Stop and name it if missing.
- Require the target root: the existing worktree or a user-named empty
  directory. Ask through AskUserQuestion if the target is missing.
- Do not invent a session or write the interview into the target as a fallback.

#### 1.2 Derive the project key

- If `{target}` is a git repository, derive the key with
  `basename(dirname(git -C {target} rev-parse --path-format=absolute --git-common-dir))`.
- If it is not a repository, use the target directory basename. Accept at most
  64 characters matching `^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$`.
- Stop and name the failed value if the key is invalid. Pass session root,
  target root, and project key to every child.

#### 1.3 Choose full run or re-entry

- Read existing `{target}/.gobbi/projects/<key>/memory/design/` and session
  drafts under `{session-root}`.
- Ask full run or a named re-entry into Interview, Project Design, Roadmap,
  Bootstrap, or Memory Wrap-up. Start a named re-entry only when that phase's
  start gate exists; otherwise stop and name the missing gate.
- If a new accepted Interview draft makes later session drafts or Memory files
  stale, list those paths and start from Project Design. Do not delete them.

### Phase 2 — Run the children

#### 2.1 Load Interview

- Skip when re-entering a later phase and accepted `{session-root}/interview.md`
  already exists.
- Otherwise load [Interview](interview/SKILL.md) and pass session root, target
  root, and project key.
- Continue only after the user accepts `{session-root}/interview.md`. Stop if
  Interview names a blocking open topic.

#### 2.2 Load Project Design

- Skip when re-entering Roadmap, Bootstrap, or Memory Wrap-up and accepted
  Project Design session drafts already exist.
- Otherwise load [Project Design](project-design/SKILL.md) and pass the same
  identity. Start only after accepted `{session-root}/interview.md` exists.
- Continue only after `{session-root}/tmp/startup/design/` holds overview,
  platform, product, and the feature set or an explicit zero-feature statement.
  The user must accept those drafts.

#### 2.3 Load Roadmap

- Skip when re-entering Bootstrap or Memory Wrap-up and accepted
  `{session-root}/tmp/startup/design/roadmap/project.md` already exists.
- Otherwise load [Roadmap](roadmap/SKILL.md) and pass the same identity. Start
  only after those accepted Project Design drafts exist.
- Continue only after the user accepts
  `{session-root}/tmp/startup/design/roadmap/project.md`.

#### 2.4 Load Bootstrap

- Skip when re-entering Memory Wrap-up and the README first-check already
  succeeded.
- Otherwise load [Bootstrap](bootstrap/SKILL.md) and pass the same identity.
  Start only after accepted
  `{session-root}/tmp/startup/design/architecture/platform.md` records the
  local stack.
- Continue only after that first-check succeeds.

### Phase 3 — Memory Wrap-up

#### 3.1 Memorize session design

- Load [Memory](../memory/SKILL.md) and
  [Design Memory](../memory/design/SKILL.md). This named Memory stage
  authorizes `Memorize` with write boundary
  `{target}/.gobbi/projects/<key>/memory/design/`.
- Memorize from `{session-root}/tmp/startup/design/` into
  `architecture/overview.md`, `architecture/platform.md`,
  `process/product.md`, each listed `feature/<feature>.md` or none, and
  `roadmap/project.md`.
- Stop and name a missing required session draft.

#### 3.2 Update design README

- Update `{target}/.gobbi/projects/<key>/memory/design/README.md` in place, or
  create it with title `Design Memory` and the role "Recursive navigation
  across design memory, grouped by category."
- Add or refresh `[Overview](architecture/overview.md)`,
  `[Platform](architecture/platform.md)`, `[Product](process/product.md)`,
  one Feature bullet per feature file, and `## Roadmap` with
  `[Project](roadmap/project.md)` from the session README or the
  session roadmap draft. Keep unrelated bullets.
- Do not duplicate those bullets on a second run.

#### 3.3 Commit Memory and return

- Load [Git](../git/SKILL.md), stage only paths under
  `{target}/.gobbi/projects/<key>/memory/design/`, and create one Memory-only
  local commit. If Memorize reports a verified no-change result, do not invent
  a commit.
- Return the Memory paths, the commit hash or no-change result, and remaining
  Open items. Startup is complete only when Memorize succeeded and that commit
  or no-change result exists.

## References

| Name | Description |
|---|---|
| [Interview](interview/SKILL.md) | Walks 24 topics and writes `{session-root}/interview.md`. |
| [Project Design](project-design/SKILL.md) | Writes session design drafts and creates the Gobbi namespace. |
| [Roadmap](roadmap/SKILL.md) | Writes the session project-horizon draft. |
| [Bootstrap](bootstrap/SKILL.md) | Creates the smallest local repository that can pass a first-check. |
| [Memory](../memory/SKILL.md) | Owns Memorize from session Temporary Records into durable design. |
| [Design Memory](../memory/design/SKILL.md) | Owns design path names and category structure. |
| [Git](../git/SKILL.md) | Conventions for the Memory-only local commit. |
