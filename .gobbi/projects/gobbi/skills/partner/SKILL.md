---
name: partner
description: "Partner runs a Codex, Claude Code, or Grok CLI as a background partner agent. Use it when the manager or the user wants another runtime's independent work or opinion."
allowed-tools: Read, Bash
skill-type: tool
---

# Partner

Partner is a manual for a manager agent that runs another runtime's CLI as a partner: Codex, Claude Code, or
Grok. Use it to launch a partner in the background, know when the run ends, read its output, and follow up.
When a user invokes it directly, run the runtime the user names, or ask which one when none is named.

## Principles

### Launch it yourself in the background

The manager starts the partner process, so it alone controls the brief, the access, and the timeout.

### Know the moment it ends

The manager runtime reports when the command exits, and `$cap/status` records how it ended. Never judge
completion from elapsed time or partial output.

### Read the output before deciding

The final message is the partner's opinion or report, and changed files are its work. Neither counts until
the manager has read it.

### Grant only the access the work needs

Read-only fits opinions, reviews, and research; workspace-write fits edits in one directory. Full-access
removes every safeguard.

## Rules

- **Launch the partner CLI yourself, in the background, under `timeout` (default 3600 seconds).** An agent in
  between would hold the brief, the access, and the run time instead of you.
- **MUST use full-access only when the user authorized it for that run.** It removes every sandbox and
  approval, so otherwise pick the lowest level the work needs, read-only when it only reads.
- **Give the partner one complete brief written with [Delegation](../delegation/SKILL.md).** No one answers
  its questions, so the brief says it runs non-interactively and must name any denied tool or path at the end.
- **Capture each run's final message, session id, exit status, and stderr in a private directory, and keep it
  until you have read the run.** The captures are the only record of the run and the only way to resume it.
- **Read the final message, and for a write run the changed files, before acting on a run.** Exit status 0
  alone does not show that the work is right.
- **Do not edit, relabel, or automatically retry a partner result.** An edited result no longer shows the
  partner's view and a retry is a new decision, so follow up by resuming the session or report the failure.

## Manual

### Run lifecycle

#### Steps of one run

- Every run follows these steps; the runtime sections give the exact commands.

  | Step | Action |
  |---|---|
  | Brief | Write one complete Delegation brief. Say that no one answers questions or approves tools, that a denied tool or path must be named in the final message, and what that message must hold: the full opinion or report, or the changed files and their verification. Callers add the work, paths, and result shape. |
  | Capture directory | `cap=$(mktemp -d)`, save the brief as `$cap/prompt.md`, and set `repo` to the absolute working directory. |
  | Launch | Start the runtime's command for the chosen access level in the background (see Manager runtimes). |
  | Completion | Wait for the manager runtime's exit report, then read `$cap/status`. |
  | Read | Read the final message and stderr; after a write run, also read `git -C "$repo" status --porcelain` and the diff. |
  | Follow up | Resume the captured session id with one more prompt, or report the result. |

#### Check availability

- Run `command -v timeout codex claude grok`; a missing name means that partner is unavailable on this host.
- Authentication shows only at launch, as a login error on stderr with a nonzero status (see Failures).
- Measured means a manager canary on 2026-11-06 with codex-cli 0.167.0, Claude Code 2.1.319, and grok 1.0.70;
  help-backed means installed `--help` only. After an upgrade, recheck help before relying on a flag.

### Access levels

#### Choose the level

- Pick one row; each runtime section gives the full command for each level.

  | Level | Partner may | Codex | Claude Code | Grok |
  |---|---|---|---|---|
  | read-only | Read and report; no file changes | `--sandbox read-only` | `--permission-prompts none --tools "Read,Grep,Glob"` | `--sandbox read-only --permission-mode dontAsk` |
  | workspace-write | Edit files in the working directory | `--sandbox workspace-write` | `--permission-mode acceptEdits --permission-prompts none --tools "Read,Grep,Glob,Write,Edit"` | `--sandbox workspace --permission-mode acceptEdits` |
  | full-access | Run anything; no sandbox or approvals | `--sandbox danger-full-access` | `--dangerously-skip-permissions` | `--sandbox off --permission-mode bypassPermissions` |
  | One-shot (no resume) | Keep no session on disk | `--ephemeral` | `--no-session-persistence` | none |

- The read-only and workspace-write flags are measured; full-access is help-backed and was not run. Grok's
  profile name `off` comes from the [xAI Sandbox page](https://docs.x.ai/build/features/sandbox), not help.
- Add the one-shot flag only when no follow-up will be needed; a one-shot run cannot be resumed.

#### Flags to leave out

- Leave out `--worktree` (all three create a new Git worktree), `--continue`, `--fork-session`, and Codex
  `resume --last` or `fork`; a follow-up must name the captured session id.
- Leave out Codex `--add-dir` (help: adds a writable directory) and Claude `--add-dir` (grants tool access,
  including edits under `acceptEdits`, to that directory).
- Leave out Claude `--bg`; it starts a session that Claude manages, not a process you can wait on.

### Codex

#### Launch

- `-C` sets the working root, so the command runs from any directory.

  ```bash
  # read-only
  timeout -k 10 3600 codex -a never exec -C "$repo" --sandbox read-only --json -o "$cap/last.md" - \
    < "$cap/prompt.md" > "$cap/events.jsonl" 2> "$cap/err.txt"; echo $? > "$cap/status"
  # workspace-write
  timeout -k 10 3600 codex -a never exec -C "$repo" --sandbox workspace-write --json -o "$cap/last.md" - \
    < "$cap/prompt.md" > "$cap/events.jsonl" 2> "$cap/err.txt"; echo $? > "$cap/status"
  # full-access: only with user authorization (help-backed, not run)
  timeout -k 10 3600 codex -a never exec -C "$repo" --sandbox danger-full-access --json -o "$cap/last.md" - \
    < "$cap/prompt.md" > "$cap/events.jsonl" 2> "$cap/err.txt"; echo $? > "$cap/status"
  ```

#### Options

- Every option is backed by installed help.

  | Option | Meaning |
  |---|---|
  | `-a never exec` | Run non-interactively and never ask for approval; `-a` is global, so it goes before `exec`. |
  | `-C DIR` | Use `DIR` as the working root. |
  | `--sandbox MODE` | Sandbox for model shell commands: `read-only`, `workspace-write`, or `danger-full-access`. |
  | `--json` | Print events to stdout as JSONL; this is where the session id appears. |
  | `-o FILE` / `-` | Write the last agent message to `FILE` / read the prompt from stdin. |
  | `--ephemeral` | Persist no session files; the run cannot be resumed. |

#### Output and session id

- The final message is `$cap/last.md`; progress goes to `$cap/err.txt`.
- Read the session id with `jq -r 'select(.type=="thread.started").thread_id' "$cap/events.jsonl"`.

#### Follow up

- Resume from the same working directory with the captured id (measured with the prompt as an argument).

  ```bash
  ( cd "$repo" && timeout -k 10 3600 codex -a never exec resume "$sid" -c 'sandbox_mode="read-only"' \
    -o "$cap/last-2.md" "$followup" < /dev/null > "$cap/out-2.txt" 2> "$cap/err-2.txt" ); echo $? > "$cap/status-2"
  ```

- `exec resume` has no `--sandbox`, so repeat the first run's level with
  `-c sandbox_mode="<read-only|workspace-write|danger-full-access>"`. `read-only` is measured: the stderr
  header showed `sandbox: read-only` and a file write was denied. The other two values come from the
  `--sandbox` help and were not run with `-c`.

#### Limits

- A prompt passed as an argument with stdin open makes Codex also read stdin ("Reading additional input from
  stdin..."); use `-` with the prompt file, or `< /dev/null` with an argument.
- `workspace-write` also lets shell commands write `/tmp` and `$TMPDIR`, per the measured run's stderr header.

### Claude Code

#### Launch

- Claude Code has no working-directory flag, so each command changes directory in a subshell.

  ```bash
  # read-only
  ( cd "$repo" && timeout -k 10 3600 claude -p --safe-mode --permission-prompts none --tools "Read,Grep,Glob" \
    --output-format json < "$cap/prompt.md" > "$cap/out.json" 2> "$cap/err.txt" ); echo $? > "$cap/status"
  # workspace-write
  ( cd "$repo" && timeout -k 10 3600 claude -p --safe-mode --permission-mode acceptEdits --permission-prompts none \
    --tools "Read,Grep,Glob,Write,Edit" --output-format json \
    < "$cap/prompt.md" > "$cap/out.json" 2> "$cap/err.txt" ); echo $? > "$cap/status"
  # full-access: only with user authorization (help-backed, not run)
  ( cd "$repo" && timeout -k 10 3600 claude -p --safe-mode --dangerously-skip-permissions --output-format json \
    < "$cap/prompt.md" > "$cap/out.json" 2> "$cap/err.txt" ); echo $? > "$cap/status"
  ```

#### Options

- Every option is backed by installed help; `--safe-mode` was measured on read-only and resumed runs.

  | Option | Meaning |
  |---|---|
  | `-p` | Print the response and exit, reading the prompt from stdin; skips the workspace trust dialog. |
  | `--safe-mode` | Disable CLAUDE.md, skills, installed plugins, hooks, and MCP servers; admin policy still applies. |
  | `--permission-prompts none` | Deny anything that would prompt, so the run never waits for a person. |
  | `--tools LIST` | Limit the run to these built-in tools. |
  | `--permission-mode acceptEdits` | Allow file edits without asking. |
  | `--dangerously-skip-permissions` | Bypass all permission checks. |
  | `--output-format json` | Print one JSON result object. |
  | `--no-session-persistence` | Save no session; the run cannot be resumed. |

#### Output and session id

- Read the final message with `jq -r .result "$cap/out.json"` and the session id with `jq -r .session_id`.
- Check `jq '.is_error, .permission_denials'`; a non-empty denial list means a needed tool was refused.

#### Follow up

- Repeat the first run's access flags and add `--resume` (measured with the prompt as an argument).

  ```bash
  ( cd "$repo" && timeout -k 10 3600 claude -p --safe-mode --resume "$sid" --permission-prompts none \
    --tools "Read,Grep,Glob" --output-format json "$followup" \
    < /dev/null > "$cap/out-2.json" 2> "$cap/err-2.txt" ); echo $? > "$cap/status-2"
  ```

#### Limits

- workspace-write has no Bash: on Linux, Claude's Bash sandbox needs `socat`, which the measured host lacks,
  so the manager runs verification commands itself.
- `-p` skips the trust dialog; run it only in a directory you trust.

### Grok

#### Launch

- `-s` pre-assigns the session id, which must be a new UUID.

  ```bash
  sid=$(uuidgen)
  # read-only
  timeout -k 10 3600 grok --prompt-file "$cap/prompt.md" --cwd "$repo" -s "$sid" --sandbox read-only \
    --permission-mode dontAsk --output-format json < /dev/null > "$cap/out.json" 2> "$cap/err.txt"; echo $? > "$cap/status"
  # workspace-write
  timeout -k 10 3600 grok --prompt-file "$cap/prompt.md" --cwd "$repo" -s "$sid" --sandbox workspace \
    --permission-mode acceptEdits --output-format json < /dev/null > "$cap/out.json" 2> "$cap/err.txt"; echo $? > "$cap/status"
  # full-access: only with user authorization (help-backed, not run)
  timeout -k 10 3600 grok --prompt-file "$cap/prompt.md" --cwd "$repo" -s "$sid" --sandbox off \
    --permission-mode bypassPermissions --output-format json < /dev/null > "$cap/out.json" 2> "$cap/err.txt"; echo $? > "$cap/status"
  ```

#### Options

- Every option is backed by installed help; profile meanings come from the xAI Sandbox page.

  | Option | Meaning |
  |---|---|
  | `--prompt-file PATH` | Single-turn prompt from a file; the run prints and exits. |
  | `--cwd DIR` / `-s UUID` | Working directory / session id for a new conversation. |
  | `--sandbox PROFILE` | `read-only` writes only `~/.grok/` and temp; `workspace` adds the working directory; `off` has no sandbox. |
  | `--permission-mode MODE` | `dontAsk`, `acceptEdits`, or `bypassPermissions`. |
  | `--output-format json` | Print one JSON object. |

#### Output and session id

- JSON keys are `cwd`, `modelUsage`, `num_turns`, `requestId`, `sessionId`, `stopReason`, `text`, `thought`,
  `total_cost_usd`, `total_cost_usd_ticks`, and `usage`; read `jq -r '.text, .stopReason' "$cap/out.json"`.
- `text` joins every assistant message with no separator, so find the answer inside it rather than taking the
  last line.

#### Follow up

- Repeat the first run's access flags with `-r` and the same id (measured with `--output-format plain`).

  ```bash
  timeout -k 10 3600 grok -p "$followup" --cwd "$repo" -r "$sid" --sandbox read-only \
    --permission-mode dontAsk --output-format json < /dev/null > "$cap/out-2.json" 2> "$cap/err-2.txt"; echo $? > "$cap/status-2"
  ```

#### Limits

- Installed Grok plugins and hooks load in partner runs; in the canary a plugin's SessionStart hook added
  unrelated text after the answer. Help shows no per-run switch, and `grok plugin disable` changes user config.
- Grok has no no-persistence flag, and each measured run took about 100 to 120 seconds.

### Manager runtimes

#### Claude Code manager

- Start the command with the Bash tool and `run_in_background: true` (measured).
- A task notification arrives when the command exits; do not poll or sleep. Then read `$cap/status` and the
  captures.

#### Codex manager

- Start the command with `exec_command` and a short `yield_time_ms`, such as 1000; it returns a `session_id`
  while the process runs. Call `write_stdin` with that id and empty input until it reports the exit.
- Unmeasured: taken from the Codex participant's live tool schema, not from a manager canary.

#### Grok manager

- Start the command with `run_terminal_command` and `background: true`; it returns a `task_id`, and a
  notification appears when the command completes.
- Read with `get_command_or_subagent_output` and `task_ids`; a positive `timeout_ms` waits. Unmeasured: from
  the [Grok background tasks guide](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/20-background-tasks.md).

#### Cursor manager

- Run each command as a shell job and wait for it in the same shell call, for example
  `( first ) & a=$!; ( second ) & b=$!; wait "$a" "$b"`. The call blocks until every run ends, so the shell
  tool must allow the full timeout.
- Unmeasured: the [Cursor terminal docs](https://cursor.com/docs/agent/tools/terminal) describe shell
  execution and no background mode.
- Cursor Agent is not a partner: on the measured host `cursor-agent -p` failed with
  `Error: Authentication required` while `cursor-agent status` reported logged in.

#### Two partners at once

- Give each run its own capture directory and launch both before waiting on either.
- Read-only runs may overlap. Write runs in the same directory run one at a time, and the manager does not
  edit that directory while a write run is active.

### Failures

#### Recognize and act

- Match the first row that fits, keep the captures, and report it; a new run is a decision, never an
  automatic retry.

  | Failure | Evidence | Action |
  |---|---|---|
  | Timeout | `$cap/status` is `124`, or `137` after the `-k` kill | Discard partial output; rerun only with a smaller brief or a longer timeout. |
  | Not found | `$cap/status` is `127`; `command -v` prints nothing | Mark the partner unavailable on this host. |
  | Authentication required | Nonzero status; stderr asks for a login or API key | Mark the partner unavailable; the user must log in. |
  | Required tool denied | Claude `permission_denials` is non-empty, or the final message names a denied tool or path | Follow up with a narrower request, or rerun at the level the work needs; full-access needs user authorization. |
  | Empty or off-task output | Final message is empty or answers something else, such as Grok hook text | Follow up by resuming the session; do not rewrite the output. |
  | Unexpected file change | `git -C "$repo" status --porcelain` shows a path the brief did not name, or any change after read-only | Stop, leave the change in place, and report it to the user. |

## References

| Name | Description |
|---|---|
| [Delegation](../delegation/SKILL.md) | Defines the brief shape and the final Handoff a partner returns. |
