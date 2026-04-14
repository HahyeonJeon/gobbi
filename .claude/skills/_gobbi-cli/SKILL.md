---
name: _gobbi-cli
description: Intent-first CLI guide. Load when an agent needs a gobbi command but does not know which one.
allowed-tools: Read, Bash
---

# Gobbi CLI

Intent-first reference for the `gobbi` CLI. Start from what you need to accomplish, find the command, then follow the cross-reference to the domain skill that teaches the full workflow context. This skill is loaded on-demand when agents need CLI command guidance, not proactively at session start.

This skill answers "which command?" — domain skills answer "when and why?"

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [commands.md](commands.md) | Complete CLI syntax reference by command group |
| [gotchas.md](gotchas.md) | Known CLI usage mistakes and corrections |

---

## Core Principle

> **CLI is the interface to gobbi's runtime. Always use CLI commands, never manual alternatives.**

Manual `mkdir` instead of `gobbi note init`, checking directory existence instead of running `gobbi note collect` — these are the most common mistakes agents make. The CLI handles naming conventions, directory structure, metadata generation, and format consistency. Manual alternatives bypass all of that.

> **Come with an intent, leave with a command.**

The intent map below is organized by what agents need to do, not by command group. If you already know the command group, use the child doc `commands.md` for the full syntax reference.

> **This skill routes to commands. Domain skills teach when and why.**

Each intent map section cross-references the domain skill that owns the workflow context. `_gobbi-cli` tells you the command exists and what arguments it takes. `_note`, `_claude`, and `_notification` tell you the full workflow around that command.

---

## Start a Workflow

Commands for initializing a work session: creating note directories, loading configuration, setting up session environment, and checking documentation health before starting.

| Intent | Command |
|---|---|
| Create a note directory for a new task | `gobbi note init <project-name> <task-slug>` |
| Read a session config value | `gobbi config get <session-id> [key]` |
| Write a session config value | `gobbi config set <session-id> <key> <val>` |
| Create or migrate config file | `gobbi config init` |
| Output session metadata to stdout | `gobbi note metadata` |
| Load session metadata into env | `gobbi session metadata` |
| Load `.claude/.env` into session | `gobbi session load-env` |

Cross-reference: `_orchestration`, `_note` for workflow setup context. `gobbi` skill for session setup questions.

---

## Capture Subagent Output

After every subagent completes, extract its delegation prompt and final result from the JSONL transcript into the note directory.

| Intent | Command |
|---|---|
| Extract subagent result to note | `gobbi note collect <agent-id> <n> <slug> <note-dir> [--phase <phase>]` |
| Extract plan from session transcript | `gobbi note plan <note-dir>` |

Preconditions for `gobbi note collect`: you must have the `agent-id` from the Agent tool result, the subtask number (`n`) for ordering, a descriptive slug, the note directory path from `gobbi note init`, and the `--phase` flag (`ideation`, `plan`, `research`, `execution`, or `review`) to route output to the correct step's `subtasks/` subdirectory.

Cross-reference: `_note` for the full note-writing workflow and subtask JSON format.

---

## Validate Documentation

Commands for validating individual documentation files against their expected structure.

| Intent | Command |
|---|---|
| Validate an agent definition | `gobbi validate agent <file.md>` |
| Validate a skill definition | `gobbi validate skill <SKILL.md>` |
| Validate gotcha entries | `gobbi validate gotcha <file.md>` |
| Lint for documentation anti-patterns | `gobbi validate lint <file.md>` |

Cross-reference: `_claude` for the documentation standard and writing guidelines.

---

## Send Notifications

Commands for sending messages through configured notification channels (Slack, Telegram, Desktop). Most notification commands are invoked by hooks, not directly by agents.

| Intent | Command |
|---|---|
| Send a plain-text message | `gobbi notify send [--title "Title"]` |
| Send attention-needed notification | `gobbi notify attention` |
| Send error notification | `gobbi notify error` |
| Send completion notification | `gobbi notify completion` |
| Send session lifecycle notification | `gobbi notify session` |
| Send subagent completion notification | `gobbi notify subagent` |

`gobbi notify send` reads message body from stdin. The event-specific commands (`attention`, `error`, `completion`, `session`, `subagent`) read hook event payloads from stdin and map them to formatted messages.

Cross-reference: `_notification` for channel configuration and credentials setup.

---

## Analyze Media

Commands for image analysis, video frame extraction, and web page capture. These are standalone utilities without a dedicated domain skill.

| Intent | Command |
|---|---|
| Analyze an image (metadata + resize) | `gobbi image analyze <path>` |
| Compare images side-by-side | `gobbi image compare <paths...>` |
| Analyze a video (extract frames) | `gobbi video analyze <path>` |
| Take a screenshot of a web page | `gobbi web screenshot <url>` |
| Download images from a web page | `gobbi web capture <url>` |

No dedicated domain skill — run `gobbi <command> --help` for detailed options.

---

## Common Mistakes

- Not running `gobbi note collect` after a subagent completes -- directory existence is not collection, only the command parses the transcript and populates subtask files
- Using `mkdir` to create note directories instead of `gobbi note init` -- manual creation misses `metadata.json`, session ID embedding, and the full subdirectory structure
- Checking whether a directory exists as proof that collection happened -- the directory is created by `gobbi note init`, but the subtask files inside it are only created by `gobbi note collect`

---

## Constraints

- This skill documents what commands exist and when to use them; domain skills (`_claude`, `_note`, `_notification`) teach the full workflow context
- Installation and troubleshooting are in `skills/gobbi/cli-setup.md`, not here
- Run `gobbi <command> --help` for the most current synopsis if this reference and the CLI disagree -- the CLI is the source of truth
