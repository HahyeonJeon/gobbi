# Codex Task Metadata

This document describes where the Codex CLI stores local task data and metadata, and how a Claude Code or Gobbi agent can retrieve it. It does not define a Gobbi-side storage format.

Use this doc with [`SKILL.md`](SKILL.md).

---

## Storage surfaces

Codex local state lives under `~/.codex` by default.

| Surface | Purpose |
|---|---|
| `~/.codex/state_5.sqlite` | SQLite database indexing Codex threads and jobs. The `threads` table is the main lookup surface for CLI sessions. |
| `~/.codex/session_index.jsonl` | Lightweight JSONL index of recent sessions: id, thread name, updated timestamp. |
| `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` | Transcript-like rollout JSONL files. These contain session metadata, messages, reasoning summaries, tool calls, tool outputs, and token-count events. |
| `~/.codex/history.jsonl` | CLI history index. Useful for recovery, but less direct than the sqlite `threads` table. |

The exact sqlite schema is an internal Codex implementation detail and may change. Prefer read-only queries and tolerate missing columns across Codex versions.

---

## SQLite lookup

The `threads` table currently contains useful metadata such as:

- `id`
- `rollout_path`
- `created_at`, `updated_at`
- `source`
- `cwd`
- `title`
- `sandbox_policy`
- `approval_mode`
- `tokens_used`
- `git_sha`, `git_branch`, `git_origin_url`
- `cli_version`
- `first_user_message`
- `model`
- `reasoning_effort`
- `thread_source`
- `preview`

Lookup a thread by id:

```bash
sqlite3 -header -json ~/.codex/state_5.sqlite \
  "select id, source, cwd, model, reasoning_effort, tokens_used, rollout_path from threads where id = '<thread-id>'"
```

List recent threads for the current repo:

```bash
sqlite3 -header -column ~/.codex/state_5.sqlite \
  "select id, source, cwd, model, reasoning_effort, tokens_used, rollout_path from threads where cwd like '%/playinganalytics/git/gobbi%' order by updated_at desc limit 10"
```

Use `thread_spawn_edges` when inspecting Codex subagent relationships:

```bash
sqlite3 -header -column ~/.codex/state_5.sqlite \
  "select parent_thread_id, child_thread_id, status from thread_spawn_edges where parent_thread_id = '<thread-id>'"
```

---

## JSONL event lookup

When `codex exec --json` is used, stdout is a JSONL event stream. Useful events include:

```json
{"type":"thread.started","thread_id":"<thread-id>"}
{"type":"turn.completed","usage":{"input_tokens":24763,"cached_input_tokens":24448,"output_tokens":122,"reasoning_output_tokens":0}}
```

Use the `thread.started` event to identify the Codex thread created by an invocation. Use `turn.completed.usage` for per-turn token usage when available.

`--output-last-message <path>` writes the final assistant message to a file chosen by the caller. That file is caller-managed, not a Codex global metadata store.

---

## Rollout lookup

Rollout JSONL files are the closest Codex equivalent to a transcript file.

A rollout path is discoverable from sqlite:

```bash
sqlite3 -noheader ~/.codex/state_5.sqlite \
  "select rollout_path from threads where id = '<thread-id>'"
```

Common rollout event types observed locally:

- `session_meta`
- `response_item`
- `event_msg`
- `turn_context`

`session_meta` can include the thread id, timestamp, cwd, originator, CLI version, source, thread source, model provider, and git metadata.

`response_item` can include assistant messages, reasoning summaries, function/tool calls, and function/tool outputs.

`event_msg` with payload type `token_count` can include:

```json
{
  "total_token_usage": {
    "input_tokens": 27000,
    "cached_input_tokens": 21888,
    "output_tokens": 387,
    "reasoning_output_tokens": 279,
    "total_tokens": 27387
  },
  "last_token_usage": {
    "input_tokens": 27000,
    "cached_input_tokens": 21888,
    "output_tokens": 387,
    "reasoning_output_tokens": 279,
    "total_tokens": 27387
  }
}
```

Treat these shapes as observational, not a stable public API.

---

## Token usage

Prefer token usage sources in this order:

1. `codex exec --json` `turn.completed.usage` - best per-turn source for direct CLI invocations.
2. Rollout JSONL `event_msg` token-count payload - useful for transcript-style audit and recovery.
3. SQLite `threads.tokens_used` - aggregate thread counter.

If the three disagree, cite which source you used. For Gobbi reporting, prefer the source closest to the invocation being summarized.

---

## Prompt and output recovery

Prompt and output recovery depends on how Codex was launched.

- For direct `codex exec --json`, prompt text may be visible in rollout events and the final assistant message may be captured by `--output-last-message` if the caller requested it.
- For interactive Codex CLI sessions, inspect the rollout JSONL for user and assistant `response_item` records.
- For Claude Code plugin companion runs, plugin state may contain job ids and rendered summaries, but Gobbi should still use Codex thread ids and rollout paths for deeper audit when available.

Do not assume `~/.codex/session_index.jsonl` contains full prompts or full outputs. It is an index, not the transcript.

---

## Privacy

Treat Codex rollout JSONL like Claude Code `transcript.jsonl`.

It may include:

- user prompts and hidden instructions;
- repo paths and file contents;
- tool calls and tool outputs;
- command stderr/stdout;
- token and rate-limit information.

Do not paste long rollout excerpts into reports. Summarize and cite local paths when possible.

---

## References

- OpenAI Codex CLI reference: https://developers.openai.com/codex/cli/reference
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex CLI features: https://developers.openai.com/codex/cli/features
