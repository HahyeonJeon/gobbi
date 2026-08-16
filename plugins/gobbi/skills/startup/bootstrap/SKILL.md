---
name: bootstrap
description: "Bootstrap is an operation that creates the smallest local repository that can pass a first-check."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
skill-type: operation
---

# Bootstrap

Bootstrap creates the smallest local repository that can pass a first-check.
Use it when a caller has accepted local-stack rows and needs git, a stack
`.gitignore`, a stack manifest, an optional env example, and a README
first-check created only when missing.

## Principles

### Create if missing

Bootstrap creates a missing stack-root file. It never overwrites an existing
README, root `.gitignore`, or stack manifest.

### Do not choose a stack

Bootstrap reads local-stack rows from the accepted platform draft. It stops
when those rows are missing or conflicting.

### First-check is completion

The README first-check command is the only completion evidence. Nothing
weaker counts.

### Stay inside the locked set

Write only the listed target-root files plus extras an official init must
create for that check. Do not write feature code, CI, cloud, directory
theater, Memory, or `.gobbi/.gitignore`.

## Rules

- **MUST stop if session root, target root, or project key is missing.** Do
  not derive a replacement identity.

- **MUST read accepted local-stack rows from
  `{session-root}/tmp/startup/design/architecture/platform.md` and stop if
  they are missing or conflicting.** Do not choose a stack.

- **MUST run `git init` only when `{target}` is not a repository, create
  `{target}/.gitignore` and the stack manifest only if missing, and create
  `{target}/.env.example` only when platform or interview says configuration
  is required and that file is missing.**

- **MUST create `{target}/README.md` with project purpose and one first-check
  command only if it is missing, and treat an existing README with no
  first-check as a conflict.**

- **NEVER overwrite an existing README, root `.gitignore`, or stack
  manifest.** If an existing file would make the first-check fail, stop and
  name the file, the command, and the failure.

- **NEVER write feature code, CI, cloud, directory theater, secrets, Memory,
  `{target}/.gobbi/.gitignore`, or empty `src/`, `lib/`, `app/`, or `tests/`
  trees, and never push, create a remote, or merge.**

## Procedure

### Phase 1 — Confirm sources

#### 1.1 Confirm identity

- Require session root, target root, and project key from the caller.
- Stop and name the missing value if any is absent, including when this skill
  is loaded directly.

#### 1.2 Require the local stack

- Require accepted
  `{session-root}/tmp/startup/design/architecture/platform.md` and read only
  its local-stack rows.
- Stop and name the missing path, missing local row, or conflict if the local
  stack is absent or conflicting.
- Do not choose a stack.

#### 1.3 Inspect the target

- Inspect whether `{target}` is a git repository and whether
  `{target}/README.md`, `{target}/.gitignore`, the stack manifest, and
  `{target}/.env.example` exist.
- Read `{session-root}/interview.md` and the platform draft to see whether
  configuration or secrets are required.
- If `{target}/README.md` exists and does not name a first-check command,
  stop and name that conflict.

### Phase 2 — Create missing files

#### 2.1 Initialize git if needed

- If `{target}` is not a git repository, run `git -C {target} init`.
- If it already is a repository, do not run `git init`.
- Confirm `{target}` is a repository before continuing.

#### 2.2 Create ignore and manifest if missing

- If `{target}/.gitignore` is missing, create it matched to the local stack.
- If the official stack manifest is missing, write the smallest file the
  first-check needs.
- Do not run an official init that would add CI or sample app code; stop and
  ask through AskUserQuestion if that generator cannot be constrained.

#### 2.3 Create env example and README if needed

- Create `{target}/.env.example` with names only, never secrets, only when
  platform or interview says configuration or secrets are required and that
  file is missing.
- If `{target}/README.md` is missing, create it with project purpose and one
  exact first-check command derived from the local stack.
- Allow only extra files an official init or manifest command must create for
  that check, and do not hand-author empty `src/`, `lib/`, `app/`, or
  `tests/` trees.

### Phase 3 — Prove the first-check and return

#### 3.1 Run the first-check

- Run the README first-check command from a clean supported environment.
- If an existing README, root `.gitignore`, or manifest made that check fail,
  stop and name the file, the command, and the failure.
- If a bootstrap-owned file made it fail, fix only those files and retry
  once; after two failures, stop and report the command and error.

#### 3.2 Commit when history is empty

- If `{target}` has no commits, create one local commit of bootstrap-owned
  files only, using [Git](../../git/SKILL.md).
- If history already exists, do not invent a commit.
- Never push, create a remote, open a pull request, or merge.

#### 3.3 Return the result

- Return the absolute paths created or left unchanged and the successful
  first-check command.
- State that Bootstrap is complete only when that command succeeds.
- Do not write Memory, `{target}/.gobbi/.gitignore`, start planning, publish,
  or merge.

## References

| Name | Description |
|---|---|
| [Platform template](../project-design/templates/platform.md) | Stack table whose local rows are Bootstrap's only design input. |
| [Git](../../git/SKILL.md) | Conventions for `git init` and the optional local bootstrap commit. |
