# Subagent Transcript Recovery

Claude Code persists every subagent's full conversation to disk automatically. This enables recovery of delegation prompts, intermediate reasoning, tool calls, plan content, and final results — independent of conversation context, which is lost after compaction or session end.

---

## Transcript Location

Subagent transcripts live at `~/.claude/projects/{project-path}/{session-id}/subagents/`. The `{session-id}` matches `$CLAUDE_SESSION_ID`. Each subagent produces two files:

| File | Format | Contains |
|------|--------|----------|
| `agent-{id}.meta.json` | JSON | `agentType`, `description` |
| `agent-{id}.jsonl` | JSON Lines | Full conversation — one JSON object per line |

The path can be derived from environment variables: `$(dirname "$CLAUDE_TRANSCRIPT_PATH")/$CLAUDE_SESSION_ID/subagents/`

The main session transcript lives at `$CLAUDE_TRANSCRIPT_PATH` and has a broader set of line types than subagent transcripts.

---

## Identifying Subagents

The `agent-{id}.meta.json` maps agents to their purpose. The `description` field matches the short description passed to the Agent tool. The `agentId` is returned in the Agent tool result after completion but is not available at spawn time.

---

## JSONL Line Schema

Each line is a JSON object with two layers: **line-level metadata** and the **message** payload.

### Line-Level Metadata

Every line (both user and assistant) carries these fields:

| Field | Contains |
|-------|----------|
| `type` | `user` or `assistant` |
| `agentId` | The subagent's ID |
| `sessionId` | Session UUID (matches `$CLAUDE_SESSION_ID`) |
| `timestamp` | ISO 8601 timestamp |
| `slug` | Session plan slug (e.g., `swift-coalescing-torvalds`) |
| `version` | Claude Code version (e.g., `2.1.89`) |
| `cwd` | Working directory at message time |
| `gitBranch` | Git branch at message time |
| `uuid` | Unique ID for this line |
| `parentUuid` | Parent message UUID (for threading) |
| `isSidechain` | Always `true` for subagents |
| `entrypoint` | How Claude Code was started (e.g., `cli`) |

User lines additionally have `promptId`. Assistant lines additionally have `requestId`.

### Message Content

The `message.content` field varies by role:

| Role | `message.content` type | Structure |
|------|----------------------|-----------|
| `user` | string or array | When string: the delegation prompt text. When array: blocks with `type` field |
| `assistant` | array of blocks | Each block has a `type` field — `text`, `tool_use`, or others |

> **A single assistant message can contain multiple blocks of different types.**

For example, `["text", "tool_use", "tool_use", "tool_use"]` — one text block followed by several parallel tool calls. Extraction logic must iterate the array, not assume one block per message.

Content block types within arrays:

| Block type | Found in | Key fields |
|------------|----------|------------|
| `text` | `assistant` | `text` |
| `tool_use` | `assistant` | `name`, `input`, `id` |
| `tool_result` | `user` | `tool_use_id`, `content` (string) |

### Token Usage

Assistant messages include `message.usage` with token consumption data:

| Field | Contains |
|-------|----------|
| `input_tokens` | Input tokens for this turn |
| `output_tokens` | Output tokens for this turn |
| `cache_creation_input_tokens` | Tokens written to cache |
| `cache_read_input_tokens` | Tokens read from cache |
| `service_tier` | Service tier used (e.g., `standard`) |

Additional assistant message fields: `message.model` (exact model ID), `message.stop_reason` (e.g., `end_turn`), `message.id` (Anthropic message ID).

---

## What Is Recoverable

| Target | Line selection | Field path |
|--------|---------------|------------|
| Delegation prompt | First line | `.message.content` (string or array) |
| Final result | Last line | Last `text` block in `.message.content` |
| Plan content | Line with `ExitPlanMode` tool_use | `.message.content[N].input.plan` |
| Plan file path | Same line | `.message.content[N].input.planFilePath` |
| Files written | Line with `Write` tool_use | `.input.file_path`, `.input.content` |
| Files edited | Line with `Edit` tool_use | `.input.file_path`, `.input.old_string`, `.input.new_string` |
| Files read | Line with `Read` tool_use | `.input.file_path`; content in next `tool_result` |
| Shell commands | Line with `Bash` tool_use | `.input.command`; output in next `tool_result` |
| Token usage | Any assistant line | `.message.usage` |
| Model used | Any assistant line | `.message.model` |

> **Content type varies by role — always check before extracting.**

User messages may have `content` as a plain string. Assistant messages always have `content` as an array of blocks. Extraction logic must handle both cases to avoid silent failures.

---

## Plan Data

Plan content is stored in `ExitPlanMode` tool_use blocks. The `input` object contains `plan` (full plan text as markdown) and `planFilePath` (disk path to the plan file).

`EnterPlanMode` has empty input — it is only a mode switch. A subagent may call `EnterPlanMode`/`ExitPlanMode` multiple times (plan revisions). Each `ExitPlanMode` captures the plan state at that point.

The plan file at `planFilePath` on disk gets overwritten by subsequent plans. The JSONL transcript is the permanent per-session record.

---

## Main Session Transcript

The main transcript at `$CLAUDE_TRANSCRIPT_PATH` shares the same `user`/`assistant` line format as subagent transcripts, but also contains additional line types:

| Line type | Contains |
|-----------|----------|
| `system` | Hook info, stop reasons, tool use IDs |
| `file-history-snapshot` | File state snapshots (with `snapshot` and `messageId` fields) |
| `pr-link` | PR number, URL, repository |
| `agent-name` | Session name |
| `custom-title` | Custom session title |

When extracting from the main transcript, filter by `type == "user"` or `type == "assistant"` to skip these non-conversation lines.

---

## Extraction Scripts

Scripts in `_note/scripts/` automate transcript extraction:

| Script | Purpose | Input |
|--------|---------|-------|
| `subtask-collect.sh` | Extract delegation prompt + final result per subagent | `<agent-id> <subtask-number> <subtask-slug> <note-dir-path>` |
| `write-plan.sh` | Extract plan content from `ExitPlanMode` | `<note-dir-path>` |

Both scripts write JSON files to the note directory and require `$CLAUDE_SESSION_ID`, `$CLAUDE_TRANSCRIPT_PATH`, and `jq`.

---

## Persistence

Transcript files persist across sessions in `~/.claude/projects/`. They are not cleaned up automatically. The `{session-id}` in the path ties each set of transcripts to a specific conversation, enabling cross-session analysis.

The JSONL transcripts are the authoritative source for what was delegated and what was returned. Conversation context is a convenience; the transcript is the record.
