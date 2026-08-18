---
name: partner
description: "Partner is a Tool Manual for invoking one named runtime as a delegated, write-capable external agent."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: tool
user-invocable: false
---

# Partner

Partner is a Tool Manual for invoking one named runtime from `{claude-code, codex, cursor, grok}` through Delegation.
Use it when the recorded policy names that runtime and the launch set includes it.

## Principles

### Keep the caller in control

The caller selects the participant, freezes the assignment, and accepts or rejects the result. Partner owns
one named-runtime invocation, not the round or next action.

### Bind writes to the worktree

The writable sandbox is the absolute worktree, not the session directory. The assignment write set is
`writing-path-only` or `worktree`; a missing write set means `writing-path-only`.

### Preserve independent judgment

A fresh process receives the complete neutral brief and no output it must independently draft or assess.
Independence is fixed before launch and cannot be repaired afterward.

### Return evidence, not a substitute

The saved result and the final Handoff must agree. A failed launch, unexpected write, denied required tool, or
invalid result remains a visible failure rather than transformed or relabeled content.

## Rules

- **MUST launch only a recorded named runtime that is not the active runtime.** Accept `claude-code`, `codex`,
  `cursor`, and `grok` as `disabled` or one or two names in lexicographic order (`claude-code,codex`,
  `claude-code,cursor`, `claude-code,grok`, `codex,cursor`, `codex,grok`, `cursor,grok`); `disabled` or an
  empty launch set after skip launches nothing and is not rewritten to `disabled`.
- **MUST start each remaining-runtime launch through one local wrapper subagent.** The wrapper only runs the
  named command, captures stdout and stderr, and returns the Handoff; it is not Partner, not a teammate, and
  not a reused process.
- **MUST build every partner prompt through Delegation with required `worktree`, `session-directory`, and
  `writing-path`.** `worktree` is the exact absolute worktree, `session-directory` is the exact absolute session
  directory inside it, and `writing-path` is the exact absolute result file under the worktree.
- **MUST use one fresh named-runtime process with help-backed flags, workspace-bounded Bash, and no bypass
  flags.** One invocation produces one saved result and one compact final Handoff; do not pass `--session-id`,
  `--resume`, `--continue`, `--worktree`, `--yolo`, `--always-approve`, `danger-full-access`, skip-permissions,
  or `bypassPermissions`.
- **MUST validate the process, listed write set, unchanged main checkout, worktree git semantic state, saved
  result, and Handoff before acceptance.** Runtime status or a plausible stdout summary is not completion
  evidence.
- **NEVER invoke bare `agent` or broaden, move, repair, extract, relabel, or automatically retry a partner
  result.** Cursor Partner is `cursor-agent` only; return the exact failure and let the caller authorize any
  new invocation.

## Manual

### Contract

#### Build the Delegation prompt

- Start from [Delegation](../../delegation/SKILL.md), add every required Partner field, and give one bounded
  assignment with one `expected-partner`. The caller launches the recorded set minus the active runtime once
  per remaining runtime, or launches nothing when that set is empty without rewriting the policy to
  `disabled`.
- Use this prompt shape:

  ```markdown
  ## Metadata
  **Required**

  - agent: partner
  - assignment: <stable one-use assignment>
  - active-runtime: <claude-code, codex, cursor, or grok>
  - expected-partner: <claude-code, codex, cursor, or grok>
  - worktree: <exact absolute worktree>
  - session-directory: <exact absolute session directory>
  - writing-path: <exact absolute result file under worktree>

  **Optional**

  - stage: <caller stage>
  - iteration: <caller iteration>

  ## Context
  <State working state and accepted decisions.>

  ## Task
  <Command one result, its purpose, scope, exclusions, and acceptance evidence.>

  ## Instructions
  <State write set writing-path-only or worktree. Missing write set means writing-path-only. Require named
  verification, independence, and a Handoff that lists every changed worktree path.>

  ## Materials
  <List required skills-to-load with exact paths and read order, remaining sources, purpose, and conflict precedence.>

  ## Return
  <Require one compact final Handoff on stdout for every status. It names writing-path, every changed
  worktree path, any denied required Read or Bash, verification, concerns, remaining work, and next action
  without reproducing the saved result.>
  ```

- The saved file is the authoritative result and stdout is only its final Handoff; review, ideation, and eval
  still place `writing-path` in the session, while implementation may name another worktree file. Stop before
  writing when the brief, material, boundary, or authority is incomplete.

#### Bind the write surface

- Require an existing absolute `worktree`, an existing absolute `session-directory` inside it, and an absolute
  `writing-path` under it. Resolve the `writing-path` parent without following a symlink out of the worktree;
  the target is absent or an approved regular non-symbolic-link file.
- Record worktree inventory enough to detect created, changed, and deleted paths. Record main-checkout branch,
  `HEAD`, and porcelain, plus worktree `HEAD`, current branch, and `git worktree list` registration, and name
  any approved pre-existing target hash.
- Keep `prompt_file`, `handoff_file`, and `stderr_file` in one private temporary capture directory outside the
  project and session roots. Remove the captures after their required evidence is read.

### Route

#### Spawn the wrapper

- After the Partner prompt and write surface are bound, spawn one ordinary execute-capable subagent through
  the active runtime. Do not run the Partner command in the caller process when a subagent spawn is available.
- Give the wrapper a complete Delegation brief with `agent: partner-wrapper`, the frozen `expected-partner`,
  the exact command from this manual, `worktree`, `session-directory`, `writing-path`, and the three capture
  paths. The brief that the Partner process receives remains `agent: partner`.
- Remaining-runtime wrappers may run together only when every assignment is `writing-path-only`, writing-paths
  are disjoint, and each brief forbids other worktree writes. A `worktree` write-set assignment is serial, and
  two `worktree` assignments never overlap.

#### Limit the wrapper

- The wrapper's only work is to run the exact command, write stdout to `handoff_file` and stderr to
  `stderr_file`, and return that Handoff to the caller. It does not change the Partner prompt, invent flags,
  or write the authoritative result; the Partner process writes the authorized worktree set.
- The wrapper does not message other subagents, teammates, or the user. Communication with the caller is the
  returned Handoff only.
- The wrapper is one-shot and is not resumed for another Partner run. During the run that Partner is the sole
  worktree writer; the caller does not write the worktree until acceptance.

### Availability

#### Select the named runtime

- Confirm `timeout` and the expected binary with `command -v`; a missing dependency ends the invocation before
  any target write. A named partner with no verified command row is Unavailable; do not invent a command.
- The command forms below were verified against installed Codex CLI 0.147.0, Claude Code 2.1.234, and Grok
  1.0.5 (5115b46bc9). `--always-approve` is not the restricting flag.

  | Partner | Write-capable command shape |
  |---|---|
  | Codex | `codex exec -C WORKTREE --ephemeral --sandbox workspace-write -c 'sandbox_permissions=["disk-full-read-access"]' -` |
  | Claude Code | `claude -p --permission-mode acceptEdits --no-session-persistence --safe-mode --add-dir MAIN_CHECKOUT --tools "Read,Grep,Glob,Write,Edit,Bash"` |
  | Grok | `grok -p --cwd WORKTREE --sandbox workspace --permission-mode acceptEdits` |

- Re-run `codex exec --help`, `claude --help`, or `grok --help` before changing a flag or relying on another
  installed version. Installed help is the command authority.

#### Grant outside-worktree reads

- Grok `--sandbox workspace` reads everywhere (official Grok Sandbox Mode table). Do not add a Grok extra-read
  flag.
- Codex outside-worktree read is `-c 'sandbox_permissions=["disk-full-read-access"]'`. Codex `--add-dir` adds
  a writable root, so do not give Codex a second writable directory.
- Claude cwd already covers the worktree. Add `--add-dir` of the recorded main checkout, which holds the live
  Gobbi skills root. `--safe-mode` does not remove built-in Read.

#### Cursor availability

- Cursor is a named partner and Unavailable. The measured binary is `cursor-agent` `2026.08.11-e8db854`; do
  not invent a command row.
- Installed `cursor-agent --help` starts with `Usage: agent [options] [command] [prompt...]` and takes the
  prompt as an argv argument. It names `-p`, `--force`, `--sandbox` (`enabled` or `disabled`), `--workspace`,
  `--trust`, `--resume`, `--continue`, `--yolo`, and `--worktree`; `--session-id` is absent.
- A write-test with `--sandbox enabled` failed to start (AppArmor) and did not create the target.
  `--sandbox disabled` was not run and is not the bound; `--force` is not the bound.

### Launch

#### Launch Codex

- Run one bounded process with the worktree as its writable sandbox root:

  ```bash
  timeout "$partner_timeout" codex exec \
    -C "$worktree" \
    --ephemeral \
    --sandbox workspace-write \
    -c 'sandbox_permissions=["disk-full-read-access"]' \
    - < "$prompt_file" > "$handoff_file" 2> "$stderr_file"
  ```

- `--ephemeral` prevents session persistence, `workspace-write` permits the contracted worktree writes, and
  standard input carries the complete prompt. Do not use `danger-full-access` or `--yolo`.
- Capture the exit status before reading content. Status `124` is a timeout; every other nonzero status is a
  process failure.

#### Launch Claude Code

- Run one bounded process from the worktree:

  ```bash
  (
    cd "$worktree" || exit 1
    timeout "$partner_timeout" claude \
      -p \
      --permission-mode acceptEdits \
      --no-session-persistence \
      --safe-mode \
      --add-dir "$main_checkout" \
      --tools "Read,Grep,Glob,Write,Edit,Bash" \
      < "$prompt_file" > "$handoff_file" 2> "$stderr_file"
  )
  ```

- `acceptEdits` permits the contracted file write; `--no-session-persistence` and `--safe-mode` isolate the
  run. Workspace-bounded Bash is allowed; do not add skip-permissions, `bypassPermissions`, background agents,
  or persistence.
- Capture and classify the exit status as for Codex.

#### Launch Grok

- Run one bounded process with the worktree as its working directory:

  ```bash
  timeout "$partner_timeout" grok \
    -p "$(cat "$prompt_file")" \
    --cwd "$worktree" \
    --sandbox workspace \
    --permission-mode acceptEdits \
    > "$handoff_file" 2> "$stderr_file"
  ```

- `--sandbox workspace` is the measured restricting flag, and `--always-approve` is not a substitute. Do not
  pass `--session-id`, `--resume`, or `--continue`.
- Capture the exit status before reading content. Status `124` is a timeout; every other nonzero status is a
  process failure.

#### Bound the shell

- Workspace-bounded Bash means the process may run a shell whose filesystem writes are limited to the worktree
  plus documented extras. Claude uses the Bash tool from the worktree without skip-permissions; Codex keeps
  its exec shell under `workspace-write`; Grok child bash inherits the workspace profile.
- The contract forbids using the shell on the main checkout and forbids commit, checkout, reset, stash, and
  clean. `git status` and `git diff` are allowed for verification.
- A required Read or Bash blocked in print or exec mode fails the run. There is no human to approve the tool.

### Acceptance

#### Validate the result and Handoff

- Wait for the wrapper to return with a zero exit status, no timeout, one non-empty regular result at the
  exact writing path when the assignment requires that file, and one non-empty final Handoff on stdout. Read
  stderr only as an immediate diagnostic.
- Compare the worktree preimage with the post-run inventory and require the Handoff changed-path list to match
  that list. Then apply the assignment write set.
- Compare main-checkout branch, `HEAD`, and porcelain, plus worktree `HEAD`, current branch, and
  `git worktree list` registration, with the preimage. Reread the saved result, reproduce its verification,
  and compare the Handoff with direct evidence; only the caller accepts.

#### Apply write-set and extras

- `writing-path-only`, including a missing write set, may change only `writing-path`. `worktree` may change any
  path under the worktree, the Handoff must list every changed worktree path, and `writing-path` still holds
  the named result when the assignment has one.
- Documented extras are incidental runtime writes, not results: Grok `~/.grok/`, `/tmp`, `/var/tmp`, and
  official macOS temp dirs from the Grok Sandbox Mode table; incidental Codex `/tmp`; and the wrapper capture
  directory. Do not add a custom Grok profile.
- Fail a main-checkout identity change, any non-extra outside-worktree path, an extra path used as the result,
  an unlisted worktree change, an extra worktree change under `writing-path-only`, and any commit, checkout,
  reset, stash, clean, or moved worktree `HEAD`, branch, or `git worktree list` registration.

#### Handle failure and retry

- Classify the first failed condition:

  | Failure | Required evidence | Prohibited response |
  |---|---|---|
  | Unavailable | Missing binary or dependency and `command -v` result; or a named runtime whose write-bound measurement failed, with version, help excerpt, and write-test result | Launch or substitute output |
  | Timeout or process error | Exit status, bound, and immediate diagnostic | Partial-result acceptance |
  | Missing or invalid result | Exact path and observed file state | Extraction or repair |
  | Unexpected write | Preimage and changed-path inventory, including main checkout and worktree git semantic state | Silent cleanup or acceptance |
  | Tool denial | Required Read or Bash blocked in print or exec mode, with the path or command | Treating the run as partial success |
  | Handoff mismatch | Expected and observed field, including omitted worktree paths | Relabeling or inferred completion |

- Preserve the exact saved state needed for recovery and remove only private capture files after their evidence
  is surfaced. Never delete or rewrite an unexpected worktree or main-checkout change automatically.
- Return the failure to the caller. A retry is a new invocation with a new assignment identity and a freshly
  validated boundary; only the caller authorizes it.

## References

| Name | Description |
|---|---|
| [Delegation](../../delegation/SKILL.md) | Defines the base prompt and final Handoff contract. |
| [Gobbi](../SKILL.md) | Owns the session-wide Partner policy and route. |
| [Memory](../../memory/SKILL.md) | Owns validation and retention of ignored session results. |
| [Agent Teams](../agent-teams/SKILL.md) | Distinguishes reusable Claude teammates from fresh Partner processes. |
