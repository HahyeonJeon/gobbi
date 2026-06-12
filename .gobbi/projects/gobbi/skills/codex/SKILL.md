---
name: codex
description: Use for native Codex Gobbi work or Claude Code to Codex bridge. Covers entry points, plugin packaging, identity, and `codex exec`.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Codex

This skill defines how Gobbi works with Codex. It covers two different cases:

- **Native Codex runtime** — Gobbi is running inside Codex. Use repo-local `.agents/skills` and `.codex/agents`.
- **Claude Code bridge to Codex** — Gobbi is running inside Claude Code and starts Codex with `codex exec` for an independent review or rescue task.

Keep those cases separate. A rule about Claude Code spawning Codex is not automatically a rule about native Codex sessions.

---

## Runtime Matrix

| Surface | Claude Code | Codex |
|---|---|---|
| Session id | `CLAUDE_CODE_SESSION_ID` | `CODEX_THREAD_ID` |
| Transcript / audit source | `CLAUDE_TRANSCRIPT_PATH` JSONL | Codex rollout path from `~/.codex/state_5.sqlite` when available |
| Repo skills | `.claude/skills` symlinks to canonical skills | `.agents/skills` symlinks to canonical skills |
| Custom agents | `.claude/agents` role prompts | `.codex/agents/*.toml` wrappers that point at canonical role prompts |
| User decisions | `AskUserQuestion` | parent-thread question or `request_user_input` when available |
| Subagent spawn | `Task` / `Agent` tool | Codex subagent workflow with project custom agents |
| Plugin env | `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA` | `PLUGIN_ROOT`, `PLUGIN_DATA`; Codex also sets Claude-compatible plugin vars |
| Hook status | Gobbi hook scripts actively update Claude session metadata | Gobbi hook scripts are Codex-safe but do not yet provide full Codex metadata parity |

Native Codex sessions MUST NOT fail only because Claude Code variables are absent. Claude Code sessions MUST keep the existing Claude-specific checks.

---

## Native Codex

Use this section when the current Gobbi session is already running in Codex.

### Entry Points

- Load Gobbi skills from `.agents/skills/<skill-name>/SKILL.md`.
- Spawn or request custom agents from `.codex/agents/{manager,leader,executor,evaluator,assistant}.toml`.
- Read canonical role prompts from `.gobbi/projects/gobbi/agents/{role}.md`.
- Read canonical skill sources from `.gobbi/projects/gobbi/skills/{skill-name}/SKILL.md`.

Codex custom agents are project-scoped TOML files. They are not currently packaged as top-level plugin components in Gobbi. The Codex plugin package distributes skills and hooks; repo-local custom agents remain under `.codex/agents`.

### Session Identity

Use `CODEX_THREAD_ID` as the Codex session id. If it is missing, warn the user that the Codex runtime did not expose a thread id and continue only after the user acknowledges the degraded audit trail.

When a rollout path is needed, look it up read-only:

```bash
sqlite3 -noheader ~/.codex/state_5.sqlite \
  "select rollout_path from threads where id = '$CODEX_THREAD_ID'"
```

If the database or row is missing, leave `session.json.transcriptPath` null and record the warning. Do not block the workflow when `CODEX_THREAD_ID` is present but rollout lookup fails.

### Subagents

Codex supports project custom agents from `.codex/agents`. When Gobbi asks for specialist work:

- Use `leader` for ideation, preparation, research, and planning.
- Use `executor` for implementation.
- Use `evaluator` for adversarial review; keep it read-only.
- Use `assistant` for narrow lookup and memorization support.

Fresh Codex subagents still need explicit load directives. They do not inherit skills the manager already read.

### Models and Sandbox

Do not hard-code model names in Gobbi Codex agent TOML unless the user explicitly asks. Let Codex inherit the parent session model and reasoning effort.

Subagents inherit the parent sandbox policy. Use `sandbox_mode = "read-only"` only for agents that must never write, such as `evaluator`.

### Plugin Packaging

Gobbi keeps the source plugin package symlinked:

- `plugins/gobbi/.codex-plugin/plugin.json`
- `plugins/gobbi/skills/` -> `.gobbi/projects/gobbi/skills/`
- `plugins/gobbi/hooks/` -> `.gobbi/projects/gobbi/hooks/`
- `plugins/gobbi/agents/` -> `.gobbi/projects/gobbi/agents/` (informational for the package; native Codex custom agents stay repo-local under `.codex/agents`)

The Codex plugin package exposes skills and hooks. It does not install custom agents as plugin components; native Codex discovers Gobbi role wrappers from repo-local `.codex/agents`.

Codex source-package support and installed-cache behavior are separate. Do not assume an installed Codex plugin cache dereferences every symlinked component directory. Verify that behavior in an isolated Codex home:

```bash
bash scripts/sync-plugin-package.sh --check
bash scripts/check-codex-plugin-smoke.sh
```

For a real local install, register the repository root as the marketplace source, then add the Gobbi plugin and start a new thread:

```bash
codex plugin marketplace add <repo-root>
codex plugin add gobbi@gobbi-workspace
```

If the smoke check reports missing installed-cache skills or hooks, document that as a Codex plugin-install limitation. Do not materialize `plugins/gobbi/{skills,agents,hooks}` to work around it unless the user explicitly changes the symlink decision.

---

## Claude Code Bridge

Use this section when Gobbi is running in Claude Code and needs an independent Codex process.

### `codex exec`

The reliable bridge is foreground `codex exec` through Bash:

```bash
timeout 600 codex exec \
  --sandbox workspace-write \
  --cd <main-tree> \
  --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/<session-id> \
  "<inline prompt or @prompt-file>"
```

Rules:

- Use `read-only` for evaluation-only work.
- Use `workspace-write` only when Codex must write files.
- Pass `--cd <main-tree>` when a worktree is active and output paths live in the main tree.
- Pass `--add-dir <session-path>` for cross-tree session writes.
- Wrap every call with `timeout 600`, unless the user explicitly approves a different cap.
- Do not pass `--model` or `--effort` unless the user explicitly requests it.

### Dual-System Evaluation

For Claude Code dual-system evaluation, use the assistant-wrapper pattern:

1. Manager spawns two assistant subagents in parallel.
2. Claude-side assistant evaluates directly with read/search tools.
3. Codex-side assistant runs `codex exec` foreground.
4. Codex-side assistant verifies output files and required content before reporting `DONE`.
5. Manager reads the actual per-perspective files before acting on findings.

Do not use `codex:codex-rescue` for required evaluator output. It has a documented fire-and-forget failure mode.

### User-Only Slash Commands

If deep Codex adversarial review requires `/codex:adversarial-review`, ask the user to type it. Do not try to invoke user-only slash commands programmatically.

---

## Metadata Lookup

Codex local metadata is observational, not a stable public API. Use it read-only and tolerate missing fields.

Preferred token and transcript sources:

1. `codex exec --json` `turn.completed.usage`, for direct bridge calls.
2. Rollout JSONL `event_msg` token-count payload.
3. SQLite `threads.tokens_used`, as an aggregate fallback.

Lookup current thread metadata:

```bash
sqlite3 -header -json ~/.codex/state_5.sqlite \
  "select id, cwd, rollout_path, model, reasoning_effort, tokens_used from threads where id = '$CODEX_THREAD_ID'"
```

Treat rollout JSONL like Claude Code transcripts. Do not paste long excerpts into reports.

---

## Anti-Patterns

- Blocking a native Codex Gobbi bootstrap because `CLAUDE_CODE_SESSION_ID` or `CLAUDE_TRANSCRIPT_PATH` is unset.
- Telling Codex users to load skills from `.claude/skills`.
- Assuming plugin-distributed custom-agent TOMLs exist when Codex currently discovers project custom agents from `.codex/agents`.
- Relying on symlinked plugin component directories for installed-cache behavior.
- Running `codex exec` without a timeout.
- Letting Codex write session files from a worktree-relative or `pwd`-derived path.
- Trusting Codex stdout or broker state instead of verifying contracted output files.
- Setting Codex model or effort without user direction.
- Using `danger-full-access` as a default sandbox.

---

## Constraints

- MUST load this skill before any Gobbi task that invokes Codex, changes Codex entry points, changes Codex plugin packaging, or interprets Codex metadata.
- MUST choose the correct runtime column before applying any rule.
- MUST use `CODEX_THREAD_ID` as the native Codex session id.
- MUST leave `session.json.transcriptPath` null, with a warning, when Codex rollout lookup fails.
- MUST keep `.agents/skills` as the repo-local Codex skill entry point.
- MUST keep `.codex/agents` as the repo-local Codex custom-agent entry point.
- MUST keep `plugins/gobbi/{skills,agents,hooks}` as symlinks unless the user explicitly changes that packaging decision.
- MUST verify the Codex plugin path with an isolated `CODEX_HOME` smoke check before claiming installed-plugin readiness.
- MUST keep Claude Code bridge rules isolated from native Codex rules.
