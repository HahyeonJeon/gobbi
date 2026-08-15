---
name: partner
description: "Partner is guidance for using a named runtime as one delegated, write-capable external agent."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: tool
user-invocable: false
---

# Partner

Partner is a Tool Manual for invoking one named runtime from `{claude-code, codex, grok}` through Delegation.
Use it when the recorded policy names that runtime and the launch set includes it.

## Principles

### Keep the caller in control

The caller selects the participant, freezes the assignment, and accepts or rejects the result. Partner owns
one named-runtime invocation, not the round or next action.

### Grant one exact write

The external agent writes one authoritative result at the caller's exact path. Session-directory permission
does not authorize any other file change.

### Preserve independent judgment

A fresh process receives the complete neutral brief and no output it must independently draft or assess.
Independence is fixed before launch and cannot be repaired afterward.

### Return evidence, not a substitute

The saved result and final Handoff must agree. A failed launch, unexpected write, or invalid result remains a
visible failure rather than transformed or relabeled content.

## Rules

- **MUST launch only a recorded named runtime that is not the active runtime.** Accept `claude-code`, `codex`,
  and `grok`; `disabled` or an empty launch set after skip launches nothing and is not rewritten to `disabled`.
- **MUST build every partner prompt through Delegation.** Include the exact absolute session directory and
  exact absolute writing path in the prompt's required Metadata.
- **MUST contain the writing path inside the session directory and grant no other write.** The caller records
  the preimage and rejects any unexpected file change.
- **MUST use one fresh, non-persistent named-runtime process with restricted write-capable tools.** One
  invocation produces one saved result and one compact final Handoff.
- **MUST validate the process, write set, saved result, and Handoff before acceptance.** Runtime status or a
  plausible stdout summary is not completion evidence.
- **NEVER broaden, move, repair, extract, relabel, or automatically retry a partner result.** Return the exact
  failure and let the caller decide the next action.

## Manual

### Contract

#### Build the Delegation prompt

- Start from [Delegation](../../delegation/SKILL.md) and add every required Partner field. Give the external
  agent one bounded assignment and one authoritative result. The caller computes launch set as the recorded
  set minus the active runtime and loops this manual once per remaining runtime. `{grok}` on Grok launches
  nothing; `{claude-code,grok}` on Grok launches Claude Code only; do not rewrite an empty launch set to
  `disabled`. One prompt names one `expected-partner`.
- Use this prompt shape:

  ```markdown
  ## Metadata
  **Required**

  - agent: partner
  - assignment: <stable one-use assignment>
  - active-runtime: <claude-code, codex, or grok>
  - expected-partner: <claude-code, codex, or grok>
  - session-directory: <exact absolute session directory>
  - writing-path: <exact absolute result file inside session-directory>

  **Optional**

  - stage: <caller stage>
  - iteration: <caller iteration>

  ## Task
  <Command one result, its purpose, scope, exclusions, and acceptance evidence.>

  ## Instructions
  <Require writing only writing-path, named verification, independence, and exact stop conditions.>

  ## Resources
  <List exact sources, read order, frozen inputs, and conflict precedence.>

  ## Return
  <Require one compact final Handoff on stdout for every status. It names writing-path, changed paths,
  verification, concerns, remaining work, and next action without reproducing the saved result.>
  ```

- State that the saved file is the authoritative result and stdout is only its final Handoff. Require the
  partner to stop before writing when the brief, resource, boundary, or authority is incomplete.

#### Bind the write surface

- Require an existing absolute session directory. Resolve the writing path's parent without following a
  symlink outside that directory; the target is absent or an approved regular non-symbolic-link file.
- Record the session directory inventory and hashes before launch. Name any approved pre-existing target hash,
  exact readable resources, timeout, expected result shape, and verification in the assignment.
- Keep `prompt_file`, `handoff_file`, and `stderr_file` in one private temporary capture directory outside the
  project and session roots. Remove the captures after their required evidence is read.

### Availability

#### Select the named runtime

- Confirm `timeout` and the expected binary with `command -v`. A missing dependency ends the invocation before
  any target write. A named partner with no verified command row is Unavailable; do not invent a command.
- The command forms below were verified against installed Codex CLI 0.147.0 and Claude Code 2.1.226:

  | Partner | Write-capable command shape |
  |---|---|
  | Codex | `codex exec -C SESSION --ephemeral --sandbox workspace-write -` |
  | Claude Code | `claude -p --permission-mode acceptEdits --no-session-persistence --safe-mode --tools "Read,Grep,Glob,Write,Edit"` |

- Re-run `codex exec --help` or `claude --help` before changing a flag or relying on another installed version.
  Installed help is the command authority.

### Launch

#### Launch Codex

- Run one bounded process with the session directory as its only writable sandbox root:

  ```bash
  timeout "$partner_timeout" codex exec \
    -C "$session_directory" \
    --ephemeral \
    --sandbox workspace-write \
    - < "$prompt_file" > "$handoff_file" 2> "$stderr_file"
  ```

- `--ephemeral` prevents session persistence, `workspace-write` permits the contracted result, and standard
  input carries the complete prompt. Do not add `--add-dir` or `danger-full-access`.
- Capture the exit status before reading content. Status `124` is a timeout; every other nonzero status is a
  process failure.

#### Launch Claude Code

- Run one bounded process from the session directory:

  ```bash
  (
    cd "$session_directory" || exit 1
    timeout "$partner_timeout" claude \
      -p \
      --permission-mode acceptEdits \
      --no-session-persistence \
      --safe-mode \
      --tools "Read,Grep,Glob,Write,Edit" \
      < "$prompt_file" > "$handoff_file" 2> "$stderr_file"
  )
  ```

- `acceptEdits` permits the contracted file write; `--no-session-persistence` and `--safe-mode` isolate the
  run. Excluding Bash prevents command-driven writes outside the supplied file tools.
- Do not add `--add-dir`, `Bash`, background agents, persistence, or bypass-permission flags. Capture and
  classify the exit status as for Codex.

### Acceptance

#### Validate the result and Handoff

- Require a zero exit status, no timeout, one non-empty regular result at the exact writing path, and one
  non-empty final Handoff on stdout. Read stderr only as an immediate diagnostic.
- Compare the session preimage with the post-run inventory. The writing path must be the only created or
  changed path; an unexpected write fails the run and remains for the caller's explicit recovery decision.
- Reread the saved result, reproduce its verification, and compare the Handoff's assignment, path, changes,
  and status with direct evidence. Only the caller accepts, assembles, or routes the result.

#### Handle failure and retry

- Classify the first failed condition:

  | Failure | Required evidence | Prohibited response |
  |---|---|---|
  | Unavailable | Binary or dependency and `command -v` result | Launch or substitute output |
  | Timeout or process error | Exit status, bound, and immediate diagnostic | Partial-result acceptance |
  | Missing or invalid result | Exact path and observed file state | Extraction or repair |
  | Unexpected write | Preimage and changed-path inventory | Silent cleanup or acceptance |
  | Handoff mismatch | Expected and observed field | Relabeling or inferred completion |

- Preserve the exact saved state needed for recovery and remove only private capture files after their evidence
  is surfaced. Never delete or rewrite an unexpected session change automatically.
- Return the failure to the caller. A retry is a new invocation with a new assignment identity and a freshly
  validated boundary; only the caller authorizes it.

## References

| Name | Description |
|---|---|
| [Delegation](../../delegation/SKILL.md) | Defines the base prompt and final Handoff contract. |
| [Gobbi](../SKILL.md) | Owns the session-wide Partner policy and route. |
| [Memory](../../memory/SKILL.md) | Owns validation and retention of ignored session results. |
| [Agent Teams](../agent-teams/SKILL.md) | Distinguishes reusable Claude teammates from fresh Partner processes. |
