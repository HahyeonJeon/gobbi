# CLI Commands

Complete syntax reference for all `gobbi` CLI commands, organized by command group. For intent-based lookup ("which command do I need?"), see the parent SKILL.md.



---

## note

Workflow note management and transcript extraction. Every task gets a note directory; every subagent's output gets collected into it.

| Command | Synopsis | Description |
|---|---|---|
| `gobbi note metadata` | `gobbi note metadata` | Output session metadata as key=value pairs to stdout |
| `gobbi note init` | `gobbi note init <project-name> <task-slug>` | Create note directory structure with all step subdirectories and `metadata.json` |
| `gobbi note collect` | `gobbi note collect <agent-id> <n> <slug> <note-dir> [--phase <phase>]` | Extract subagent delegation prompt and final result from JSONL transcript into `{phase}/subtasks/{n}-{slug}.json` |
| `gobbi note plan` | `gobbi note plan <note-dir>` | Extract plan from session transcript and write `plan.json` |

### note collect options

| Option | Values | Description |
|---|---|---|
| `--phase` | `ideation`, `plan`, `research`, `execution`, `review` | Route output to the correct step's `subtasks/` subdirectory. Determines where the extracted JSON file is written. |

Cross-reference: `_note` for note directory structure, subtask JSON format, and when to write at each workflow step.

---

## config

Read and write gobbi settings across the three-level cascade: workspace (`.gobbi/settings.json`), project (`.gobbi/projects/<name>/settings.json`), and session (`.gobbi/projects/<name>/sessions/{id}/settings.json`). Two verbs only — `get` and `set`. Keys use dot-path notation (e.g. `git.workflow.mode`, `notify.slack.enabled`).

| Command | Synopsis | Description |
|---|---|---|
| `gobbi config get` | `gobbi config get <key> [--level workspace\|project\|session] [--session-id <id>]` | Read a config value. Without `--level`, returns the cascade-resolved value (session overrides project overrides workspace). With `--level`, reads only that level's file — exits 1 if key absent at that level. |
| `gobbi config set` | `gobbi config set <key> <value> [--level workspace\|project\|session] [--session-id <id>]` | Write a config value. Without `--level`, defaults to session. Deep-path writes create intermediate objects as needed and validate against the AJV schema before writing. |

### config options

| Option | Values | Description |
|---|---|---|
| `--level` | `workspace`, `project`, `session` | Target a specific level for reads or writes. Omit to use cascade-resolved (get) or session (set). |
| `--session-id` | string | Override the session id. CLI falls back to `$CLAUDE_SESSION_ID` env when absent. The `/gobbi` orchestrator supplies this via flag; the CLI is plugin-neutral. |

### config exit codes

| Code | Meaning |
|---|---|
| `0` | Success — `get`: value found, JSON on stdout; `set`: written |
| `1` | `get` only — key absent at the selected level; silent stdout |
| `2` | Parse, validation, I/O, or invalid-argument error; diagnostic on stderr |

### config value coercion

`set` coerces the string argument: `"true"` / `"false"` → boolean; `"null"` → null; leading `[` or `{` → `JSON.parse`; integer / decimal string → number; anything else passes through as string.

Cross-reference: `gobbi` skill for session setup questions. `v050-features/gobbi-config/README.md` for cascade semantics, schema shape, and migration details.

---

## validate

Validate individual documentation files against their expected structure. Each command checks one file at a time.

| Command | Synopsis | Description |
|---|---|---|
| `gobbi validate agent` | `gobbi validate agent <file.md>` | Validate an agent definition file |
| `gobbi validate skill` | `gobbi validate skill <SKILL.md>` | Validate a skill definition file |
| `gobbi validate gotcha` | `gobbi validate gotcha <file.md>` | Validate gotcha entries |
| `gobbi validate lint` | `gobbi validate lint <file.md>` | Lint a documentation file for anti-patterns |

Cross-reference: `_skills` for skill structure requirements, `_agents` for agent definition requirements, `_gotcha` for gotcha entry format.

---

## notify

Send notifications through configured channels (Slack, Telegram, Desktop). The `send` command is for direct use; the event-specific commands are designed for hook payloads.

| Command | Synopsis | Description |
|---|---|---|
| `gobbi notify send` | `gobbi notify send [--title "Title"]` | Send a plain-text message. Reads message body from stdin. |
| `gobbi notify attention` | `gobbi notify attention` | Map NotificationEvent hook payload (stdin) to an attention message |
| `gobbi notify error` | `gobbi notify error` | Map StopFailure hook payload (stdin) to an error message |
| `gobbi notify completion` | `gobbi notify completion` | Map Stop hook payload (stdin) to a completion message (with loop guard) |
| `gobbi notify session` | `gobbi notify session` | Map SessionStart/SessionEnd hook payload (stdin) to a lifecycle message |
| `gobbi notify subagent` | `gobbi notify subagent` | Map SubagentStop hook payload (stdin) to a subagent completion message |

Cross-reference: `_notification` for channel configuration, credentials setup in `.claude/.env`, and hook integration.

---

## session

Session environment setup commands invoked by hooks at session start. These populate `CLAUDE_ENV_FILE` with session metadata and project environment variables.

| Command | Synopsis | Description |
|---|---|---|
| `gobbi session metadata` | `gobbi session metadata` | Extract session metadata from stdin JSON and write key=value pairs to `CLAUDE_ENV_FILE` |
| `gobbi session load-env` | `gobbi session load-env` | Load `.claude/.env` file and write exports to `CLAUDE_ENV_FILE` |

Cross-reference: `gobbi` skill for session setup questions and the SessionStart hook configuration.

---

## Media Commands

Image analysis, video frame extraction, and web page capture. Standalone utilities without a dedicated domain skill.

### image

| Command | Synopsis | Description |
|---|---|---|
| `gobbi image analyze` | `gobbi image analyze <path>` | Analyze an image: extract metadata and resize for inspection |
| `gobbi image compare` | `gobbi image compare <paths...>` | Compare multiple images side-by-side via contact sheet |

### video

| Command | Synopsis | Description |
|---|---|---|
| `gobbi video analyze` | `gobbi video analyze <path>` | Analyze a video: extract frames and generate contact sheet |

### web

| Command | Synopsis | Description |
|---|---|---|
| `gobbi web screenshot` | `gobbi web screenshot <url>` | Take a screenshot of a web page |
| `gobbi web capture` | `gobbi web capture <url>` | Download images from a web page |

