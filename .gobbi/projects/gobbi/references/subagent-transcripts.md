# Subagent Transcript Recovery

Claude Code persists every subagent's full conversation to disk automatically. This enables recovery of delegation prompts, intermediate reasoning, tool calls, plan content, and final results — independent of conversation context, which is lost after compaction or session end.

## Transcript Location

```
~/.claude/projects/{project-path}/{session-id}/subagents/
```

The `{session-id}` matches `$CLAUDE_SESSION_ID`. Each subagent produces two files:

| File | Format | Contains |
|------|--------|----------|
| `agent-{id}.meta.json` | JSON | `agentType`, `description` |
| `agent-{id}.jsonl` | JSON Lines | Full conversation — one JSON object per line |

## Identifying Subagents

The `agent-{id}.meta.json` file maps agents to their purpose without needing to track IDs during delegation:

```json
{
  "agentType": "gobbi:gobbi-agent",
  "description": "Create playviz entry skill"
}
```

The `agentId` is returned in the Agent tool result after completion but is not available at spawn time. The `description` field matches the short description passed to the Agent tool.

## JSONL Line Schema

Each line is a JSON object:

```json
{
  "type": "user | assistant",
  "agentId": "string",
  "message": {
    "role": "user | assistant",
    "content": "string | array of blocks"
  }
}
```

When `content` is an array, each block has a `type` field:

| Block type | Found in | Fields |
|------------|----------|--------|
| `text` | `assistant` | `text` |
| `tool_use` | `assistant` | `name`, `input`, `id` |
| `tool_result` | `user` | `tool_use_id`, `content` |

## What Is Recoverable

| Target | Line selection | Field path |
|--------|---------------|------------|
| Delegation prompt | First line | `.message.content` (string) |
| Final result | Last line | Last `text` block in `.message.content` |
| Plan content | Line with `ExitPlanMode` tool_use | `.message.content[N].input.plan` |
| Plan file path | Same line | `.message.content[N].input.planFilePath` |
| Files written | Line with `Write` tool_use | `.input.file_path`, `.input.content` |
| Files edited | Line with `Edit` tool_use | `.input.file_path`, `.input.old_string`, `.input.new_string` |
| Files read | Line with `Read` tool_use | `.input.file_path`; content in next `tool_result` |
| Shell commands | Line with `Bash` tool_use | `.input.command`; output in next `tool_result` |

## Plan Data

Plan content is stored in `ExitPlanMode` tool_use blocks. The `input` object contains:

| Field | Type | Contains |
|-------|------|----------|
| `plan` | string | Full plan text (markdown) |
| `planFilePath` | string | Disk path (e.g., `~/.claude/plans/{slug}.md`) |

`EnterPlanMode` has empty input — it is only a mode switch. A subagent may call `EnterPlanMode`/`ExitPlanMode` multiple times (plan revisions). Each `ExitPlanMode` captures the plan state at that point.

The plan file at `planFilePath` on disk gets overwritten by subsequent plans. The JSONL transcript is the permanent per-session record. When a subagent revises a plan, each version is preserved as a separate line in the JSONL.

## Relevance to Note Writing

When writing subtask files during collection, the orchestrator can extract delegation prompts and results directly from the JSONL transcripts. This is especially valuable in two scenarios:

- **After compaction** — conversation context is lost but disk transcripts remain intact
- **After long sessions** — early subagent outputs may have been compressed out of the conversation window

The JSONL transcripts are the authoritative source for what was delegated and what was returned. Conversation context is a convenience; the transcript is the record.

## Persistence Note

Transcript files persist across sessions in the `~/.claude/projects/` directory. They are not cleaned up automatically. The `{session-id}` in the path ties each set of transcripts to a specific conversation, making cross-session analysis possible.
