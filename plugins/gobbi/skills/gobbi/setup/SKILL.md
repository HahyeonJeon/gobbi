---
name: setup
description: "Setup is the operation that creates a consumer project's missing Gobbi layout, instruction placeholders, runtime settings, and role contracts, and reports the rest."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Setup

Setup creates a consumer project's missing Gobbi layout, instruction placeholders, Claude Code settings, and
Codex role contracts, then reports every condition it may not change. Use it when the user invokes it in a
project that has the Gobbi plugin installed; Gobbi entry never loads it.

## Principles

### Check first, write only what is absent

Setup reads the project, classifies every target, and creates only a path it owns and finds absent. Nothing
that already exists is opened for write.

### Leave every skill to the plugin

The plugin supplies skills on all four runtimes, and the Claude Code, Grok, and Cursor role contracts. Setup
creates no skill and no `skills/` directory.

### Copy known bytes, never generate them

Every role contract is a byte copy of a named source, and every other written file uses bytes this skill
states. A missing source is reported, never synthesized.

### Write inside the project, report outside it

Every project write goes through the write script, so `git status --porcelain` is the complete inventory of
what setup did. Everything outside the project root is the user's action, printed as an exact command.

## Rules

- **MUST run** the [prerequisite checker](../scripts/check-prerequisites.sh) before the first write and after
  the last, and **NEVER** use its output for control flow. A green checker is not setup's success signal.
- **MUST derive** the project key as
  `basename(dirname(git rev-parse --path-format=absolute --git-common-dir))`, and ask the user when it fails
  its pattern. Pass the answer as `--project-key`; never invent a key.
- **NEVER create or copy** a skill, a `skills/` directory, or any `.agents/` path, and **NEVER** run
  `link-project-skills.sh`.
- **MUST write** every file from bytes this skill names: the canonical ignore file, the minimum settings
  object, an empty placeholder, or a byte copy of a role source. **NEVER** generate, convert, or overwrite
  content, and leave an existing `CLAUDE.md`, `AGENTS.md`, `settings.json`, or role contract exactly as it is.
- **NEVER write** the consumer root `.gitignore`, `rules/`, a `memory/` category directory, a hook
  registration on any runtime, or any path outside the resolved project root, and **NEVER create** a commit.
  Print the exact command for a user-level action instead.
- **MUST stop** on any condition in the stop table, and **MUST report** the residual checker failures rather
  than repairing them.

## Procedure

### Phase 1 — Check the Project

#### 1.1 Resolve the worktree, the project key, and the root pair

- Take the project root from `git rev-parse --show-toplevel`. Setup writes nothing when Git is unavailable or
  the current directory is not inside a Git worktree.
- Derive the project key and accept at most 64 characters matching `^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$`. Ask
  the user for a key when the derived one fails, then pass it as `--project-key`.
- Validate the Gobbi root pair against its three [Delegation](../../delegation/SKILL.md) sentinels, then pass
  it as `--skills-root` and `--agents-root`. A partial, relative, unexpanded, or unreadable pair stops the run
  with the exact `NO_GOBBI_ROOT:` token.

#### 1.2 Run the checker and keep its output as the baseline

- Run the read-only [prerequisite checker](../scripts/check-prerequisites.sh) from the project worktree and
  keep its complete output as the baseline report.
- Use the baseline for reporting only. Never parse a `FAIL` label, because those labels are human text with no
  stability contract.
- Add no probe for a condition the checker already owns. Setup probes only a path it may create.

#### 1.3 Build the target list and classify every entry

- Classify every entry as `write-if-missing`, `report-only`, `never`, or `stop`. A `never` path stays uncreated
  even when the checker fails on it.
- Setup owns twelve rows in write order, and row 12 expands per role, so a full run creates up to seventeen
  filesystem objects. Row 12 resolves `{gobbi-agents-root}/codex/` in a Gobbi checkout or
  `<plugin>/role-variants/codex/` in a plugin install:

  | # | Path | Created as |
  |---|---|---|
  | 1 | `.gobbi/` | real directory |
  | 2 | `.gobbi/.gitignore` | the canonical bytes from [Gobbi](../SKILL.md) Step 1.2 |
  | 3 | `.gobbi/projects/` | real directory |
  | 4 | `.gobbi/projects/<project>/` | real directory |
  | 5 | `.gobbi/projects/<project>/memory/` | real directory, no category child and no marker |
  | 6 | `.claude/` | real directory |
  | 7 | `.claude/CLAUDE.md` | empty file, 0 bytes |
  | 8 | `.claude/settings.json` | the minimum namespaced object, only when the file is absent |
  | 9 | `AGENTS.md` at the project root | empty file, 0 bytes |
  | 10 | `.codex/` | real directory |
  | 11 | `.codex/AGENTS.md` | empty file, 0 bytes |
  | 12 | `.codex/agents/` and five `<role>.toml` | byte copy of the resolved Codex source |

- Never write the paths below, and never repair one because the checker fails on it:

  | Never written | Why |
  |---|---|
  | any path with a `skills` component, on any runtime, and `link-project-skills.sh` | The plugin owns skills. On Codex a collision is not merged and both entries appear in selectors, and on Grok a copy wins only the bare slash form |
  | `.claude/agents/`, anything under `.grok/`, anything under `.cursor/`, and `.agents/` | The plugin supplies the Claude Code, Grok, and Cursor role contracts; `.agents/` has no reader among the four runtimes |
  | the consumer root `.gitignore`, `rules/`, and any `memory/<category>/` | `.gobbi/.gitignore` is the only ignore file Gobbi owns, and rules and memory categories come from their own owners |
  | content inside an existing `CLAUDE.md`, `AGENTS.md`, `settings.json`, or role contract | Nothing existing is opened for write |
  | the project root `CLAUDE.md`, and `.codex/config.toml` | The checker asserts `.claude/CLAUDE.md`, so one placeholder suffices; Codex loads only `$CODEX_HOME/config.toml`, so a project copy is inert |
  | any hook registration, on any runtime | The plugin delivers all four, and a second source compounds rather than replaces the injected context |
  | a generated or converted role contract | Bytes are copied from a named source, or the row is skipped |
  | any path outside the resolved project root, and any commit | The user owns every action outside the project and all history |

### Phase 2 — Write Only What Is Missing

#### 2.1 Apply the stop conditions and the refusals

- Clear every run-level stop before the first write, which prints `STOP <name>` on stderr with the detecting
  probe and `created: 0 filesystem objects`, then exits 1. A row-level stop ends only its own row, and the
  remaining rows still run before the script exits 1.

  | # | Condition | Class |
  |---|---|---|
  | S1 | An ancestor ignores `.gobbi/` | run stop |
  | S2 | Runtime state is tracked where the layout requires ignored state | run stop |
  | S3 | `.gobbi/.gitignore` exists with other bytes | row stop; never rewritten |
  | S4 | A required component is a file or a symbolic link, not a directory | row stop |
  | S5 | Git is unavailable, or the directory is not inside a Git worktree | run stop |
  | S6 | The project key exceeds 64 characters or fails its pattern | run stop; ask, then pass `--project-key` |
  | S7 | The root pair is partial, relative, unexpanded, or fails a sentinel | run stop with the `NO_GOBBI_ROOT:` token |
  | S8 | `.claude/settings.json` exists and is not a JSON object | row stop; never overwritten |
  | S9 | A computed target carries a `skills` component | refusal, before any write |
  | S10 | `jq` is unavailable and a JSON row needs it | row stop |
  | S11 | A role source declares a `name` other than its filename | row stop |

- Three refusals end the run before anything is created: `refusal-1` for a target that leaves the project
  root, `refusal-2 (S9)` for a `skills` component, and `refusal-5` for a `$HOME` or unexpanded target. Each
  prints `REFUSED <name>` with its probe and exits 1.
- Two further refusals need no message. The shell's noclobber setting reports `refusal-3` as a row-level
  `stopped` if a path already exists, and the script contains no mutating Git command at all.

#### 2.2 Run the write script over the target list

- Run [`apply-setup.sh`](../scripts/apply-setup.sh) once. It performs every project write, applies every
  refusal, and prints one ledger row per target:

  ```text
  apply-setup.sh [--project-key <key>] [--skills-root <absolute> --agents-root <absolute>]
  ```

- Supply both roots or neither, because the pair is validated as one unit. With neither, the script derives
  the Codex source from its own location.
- Read the exit status: 0 when no row stopped, 1 on a stop or a refusal, and 2 on an argument error.

#### 2.3 Record the ledger row the script emitted for each target

- Keep the three `gobbi setup:` header lines, which name the project root, the project key, and the resolved
  Codex role source or `unresolved, which indicates a mis-packaged plugin`.
- Keep every row under the `path action evidence` header, printed as `%-43s %-10s %s` with a trailing slash on
  a directory row:

  ```text
  path                                        action     evidence
  .gobbi/.gitignore                           created    3 canonical lines; cmp equal
  .codex/agents/leader.toml                   created    byte copy of role-variants/codex/leader.toml; name="leader"
  .claude/skills/                             not-mine   plugin owns skills; never created
  ```

  | Action | Meaning |
  |---|---|
  | `created` | The path was absent, and setup created it. |
  | `exists` | The path was present and byte-acceptable, and was left untouched. |
  | `skipped` | A named reason, `source-missing; never generated` or `drift` with both checksums, and no byte changed. |
  | `stopped` | A named row condition; that row wrote nothing, and the run exits 1. |
  | `not-mine` | The path has another owner, asserted as a row so its absence is reviewable. |

- Keep the closing `gobbi setup: N created, N exists, N skipped, N stopped, N not-mine` summary and the
  user-actions block. A second run creates nothing, changes no byte, and reports every owned target `exists`.

### Phase 3 — Report and Prove

#### 3.1 Re-run the checker and report the baseline and the delta

- Run the same checker again from the same worktree, and report the Step 1.2 baseline and this result
  verbatim as baseline and delta.
- Never present the checker as green, and never repair a failure to make it pass. Setup's success is the
  ledger, not the checker's counts.

#### 3.2 Prove that no skill and no skills directory was created

- Assert `test ! -e` on `.claude/skills`, `.codex/skills`, `.grok/skills`, `.cursor/skills`, and
  `.agents/skills`, for each one absent before the run. A pre-existing tree must have an unchanged recursive
  checksum.
- Compare `find . -path ./.git -prune -o -type d -name skills -print` against the pre-run inventory. The
  after-set must be a subset of it.
- Confirm the positive checks: `git status --porcelain` lists exactly the ledger's `created` paths, `git log`
  shows no new commit, and every written role file is byte-identical to its named source.

#### 3.3 Report the per-runtime state, the residual, and every user action

- Report each runtime's hook as `active`, `needs-user-action`, or `deviation`. Installed is not active, so
  never report Codex as covered merely because the plugin installed, and name any pre-existing project
  registration that would duplicate the plugin's without editing it:

  | Runtime | Hook file and event | Hook state | Role contracts |
  |---|---|---|---|
  | Claude Code | `hooks/hooks.json`, `UserPromptSubmit`, found by default discovery | `active` | plugin, flat `agents/` |
  | Codex | `hooks/codex-hooks.json`, `UserPromptSubmit`, declared by `.codex-plugin` `hooks` | `needs-user-action`: review and trust the current definition in `/hooks`, and re-trust after any edit | **written by setup** from `role-variants/codex/` |
  | Grok | `hooks/grok-hooks.json`, `Stop`, declared by `.grok-plugin` `hooks` | `deviation`: fires at turn end and costs one extra model round | plugin, declared `role-variants/grok` |
  | Cursor | `hooks/cursor-hooks.json`, `sessionStart`, declared by `.cursor-plugin` `hooks` | `deviation`: once per conversation, not once per turn | plugin, declared `role-variants/cursor` |

- Enumerate the residual checker failures and mark them expected:

  | Group | Count | Why setup must not fix it |
  |---|---|---|
  | Skill files, plus the `.grok/skills` directory | 8 | The plugin owns skills: seven file assertions and one directory assertion |
  | Role files for Claude Code, Grok, Cursor, and `.agents/` | 20 | Plugin-supplied or decided out, so a project copy duplicates and drifts |
  | The `.grok/agents` and `.agents/agents` directories | 2 | A directory appears only when a file goes inside it |
  | The `.grok` and `.cursor` directories | 2 | Setup writes nothing under either |
  | `.codex/config.toml` | 1 | Measured inert, and its disposition is backlog-deferred |
  | **Total** | **33** | Plus one per missing CLI, which the user installs |

- Report a run whose Codex source did not resolve as a separate case: its five role rows and `.codex/agents/`
  read `skipped source-missing`, the residual becomes 39, and those six rows are a packaging defect rather
  than expected residual. Print every user-owned action as an exact command, such as removing a stale
  `~/.grok/hooks/hooks.json`, or adding a missing Agent Teams flag or permission to a pre-existing
  `.claude/settings.json`.

## References

| Name | Description |
|---|---|
| [`apply-setup.sh`](../scripts/apply-setup.sh) | Performs every project write, applies the refusals, and prints one ledger row per target. |
| [Prerequisite checker](../scripts/check-prerequisites.sh) | Reports project-local `PASS`, `WARN`, and `FAIL` without mutation, as the baseline and the delta. |
| [Gobbi](../SKILL.md) | Owns entry, the project layout this operation writes, and the namespaced permission forms. |
| [Delegation](../../delegation/SKILL.md) | Defines the root-pair protocol and the exact `NO_GOBBI_ROOT:` stop tokens. |
