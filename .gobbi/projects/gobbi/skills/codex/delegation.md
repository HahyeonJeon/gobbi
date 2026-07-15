# Codex Bridge Delegation

This child doc defines the prompt-file contract for Claude Code wrapper agents that invoke
Codex with `codex exec`. Use it with [`SKILL.md`](SKILL.md) whenever Gobbi asks a Claude-side
assistant wrapper to run a Codex proposer or evaluator.

The problem this doc prevents: the Claude wrapper and the Codex run cannot hold a live
back-and-forth. Codex receives one initial prompt, then works independently. If that prompt is
thin, ambiguous, missing paths, or missing failure rules, Codex cannot ask the wrapper to fill
the gap. It will guess, write in the wrong place, or return a plausible but unusable result.

This doc owns only the Codex prompt-file contract. Gobbi manager-to-specialist dispatch stays in
[`orchestration/delegation.md`](../orchestration/delegation.md); workflow-agnostic brief semantics
stay in the [`delegation` skill](../delegation/SKILL.md). WORK orchestration stays in
[`orchestration/workflow/production.md`](../orchestration/workflow/production.md). Evaluation
orchestration stays in [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md).

---

## When to read

Read this doc when any task:

- invokes `codex exec` from Claude Code;
- writes a Codex proposer prompt;
- writes a Codex evaluator prompt;
- verifies Codex output files;
- changes timeout, sandbox, prompt transport, stdout capture, or failure handling for bridge runs.

Do not use this doc for native Codex custom-agent dispatch. Native Codex dispatch uses
`.codex/agents/{role}.toml` plus the normal Gobbi delegation templates.

---

## Core principles

> **The prompt file is the contract.**

The prompt file must contain the full task, full output contract, exact paths, load directives,
scope limits, and failure behavior. Do not rely on wrapper memory, parent transcript context, or
interactive clarification after `codex exec` starts.

> **Use official stdin prompt transport for full prompt files.**

For Gobbi bridge prompt files, invoke Codex with `codex exec ... - < "$prompt_file"`. The `-`
argument tells Codex to read the full prompt from stdin. Do not standardize `@prompt-file` as a
Gobbi contract unless a local Codex version explicitly documents and verifies it.

> **Contracted files are truth.**

Stdout, JSONL events, last-message files, and process exit codes are evidence. The contracted
output files are the truth. The wrapper reports success only after those files exist at the
exact contracted paths and pass structural checks.

> **The wrapper never authors Codex output.**

If Codex times out, errors, returns empty output, or writes malformed files, the wrapper reports
`BLOCKED`. It may copy Codex-authored bytes verbatim from stdout or a wrong output root into the
contracted path only when the bytes are complete and the report clearly marks the recovery. It
never evaluates, proposes, summarizes, or fills missing content under a Codex label.

> **Prefer bounded writes over broad trust.**

Use the least sandbox that can complete the run. When a run must write files, pass the narrowest
`--add-dir` that contains the contracted output surface, and verify before/after that source
files did not change.

---

## Prompt-file lifecycle

### P1 - Choose the run shape

Pick the run shape before writing the prompt.

| Run shape | Use for | Sandbox | Output writer |
|---|---|---|---|
| `file-writing` | Proposer output, evaluator files, any run where Codex writes contracted files | `workspace-write` | Codex writes files directly |
| `stdout-proxy` | Strict source-read-only review where Codex must not be able to edit source | `read-only` | Codex returns complete content; wrapper writes it verbatim |

`file-writing` is the default Gobbi bridge shape because proposers and evaluators produce
multiple files. `stdout-proxy` is the stricter fallback when a task's source-read-only property
must be enforced by the sandbox itself.

Important sandbox caveat: `workspace-write --cd "$main_tree"` lets Codex write inside the main
tree. The prompt must forbid source edits, and the wrapper must verify source paths before and
after the run. If source-read-only must be enforced technically rather than semantically, use the
`stdout-proxy` shape with `--sandbox read-only`.

### P2 - Render the prompt file

Render the prompt file in a foreground wrapper step, then verify it before invoking Codex.

Standard prompt-file location:

```text
<session-root>/{N}-{loop}/working/proposals/codex/{purpose}-prompt.md
```

Execution per-task variant:

```text
<session-root>/4-execution/task-{NN}-{slug}/working/proposals/codex/{purpose}-prompt.md
```

Evaluation prompts may live beside the evaluator output directory when the loop already has a
more specific staging location. The key rule is simpler than the exact filename: the prompt file
is session-scoped, pre-written, and verified before `codex exec` starts.

The wrapper must verify:

```bash
test -s "$prompt_file"
rg -F -x -q "## Mission" "$prompt_file"
rg -F -x -q "## Load Directives" "$prompt_file"
rg -F -x -q "## Output Contract" "$prompt_file"
rg -F -x -q "## Failure Contract" "$prompt_file"
```

Use fixed-string checks (`rg -F`) for literal headings. Do not use interpolated regex patterns
for Markdown headings or shell snippets.

### P3 - Invoke Codex

Standard file-writing invocation for proposer runs and file-writing evaluator runs. Launch it per
the [`codex/SKILL.md` § codex exec launch runtime matrix](SKILL.md#codex-exec-launch-runtime-matrix):
in Claude Code a run that may exceed ~540s (proposers and full evaluations routinely do) launches in
the **background** with a captured PID, and the `timeout 1200` below is the detached cap — not a
foreground budget. A foreground `timeout 1200` is valid only in a native-Codex host that grants the
full budget, or for a short run under the ~600s Bash cap.

```bash
timeout 1200 codex exec \
  -m gpt-5.6-sol \
  -c 'model_reasoning_effort="xhigh"' \
  --sandbox workspace-write \
  --cd "$main_tree" \
  --add-dir "$write_dir" \
  --json \
  --output-last-message "$last_message_file" \
  - < "$prompt_file" > "$events_jsonl" 2> "$stderr_log"
```

Set `write_dir` to the narrowest contracted output directory:

- Proposer: `working/proposals/codex/` for the current loop or execution task.
- Evaluator: `evaluation/iter{n}/codex/` for the current loop or execution task.

Evaluation-only runs may use a shorter timeout when the prompt is intentionally small. Proposer
runs use at least `1200s` unless the user explicitly approves a different cap. A foreground
`timeout 1200` in Claude Code is killed at the ~600s Bash cap (recorded mistake
`codex-exec-timeout-exceeds-bash-cap.md`), so a run that may exceed it launches in the background
per the matrix above, with an explicit PID and file validation.

Every Gobbi bridge invocation carries the exact `gpt-5.6-sol` model and `xhigh` reasoning pair
shown above. A user-requested per-run override may replace the relevant value, but the wrapper must
record that override instead of silently dropping the current policy.

Strict source-read-only invocation — same launch rule per the [`codex/SKILL.md` § codex exec launch
runtime matrix](SKILL.md#codex-exec-launch-runtime-matrix): foreground only under the host budget,
**background** in Claude Code when the review may exceed ~540s (the `timeout 1200` is then the
detached cap):

```bash
timeout 1200 codex exec \
  -m gpt-5.6-sol \
  -c 'model_reasoning_effort="xhigh"' \
  --sandbox read-only \
  --cd "$main_tree" \
  --json \
  --output-last-message "$last_message_file" \
  - < "$prompt_file" > "$events_jsonl" 2> "$stderr_log"
```

For `stdout-proxy`, the prompt must instruct Codex to put every required file body in the final
message under unambiguous fenced sections. The wrapper then writes those bytes verbatim to the
contracted paths. The wrapper must not improve or complete the content.

Foreground/background selection:

- Use foreground when the host will allow the full timeout budget. The wrapper receives the real
  exit status and can verify files immediately.
- Use background when a Claude Code job may exceed the Bash tool cap. Capture `$!` as the exact
  PID, poll or wait for that PID, and kill only that PID on timeout. Never use `pkill -f`.
- For the standard stdin prompt-file form, `- < "$prompt_file"` gives Codex deterministic EOF.
  If a non-standard prompt-argument form is explicitly verified and backgrounded, redirect stdin
  from `/dev/null` so Codex cannot hang waiting for inherited stdin.
- A background exit status is evidence only. The success gate is still the contracted files.

### P4 - Verify contracted output

The wrapper verifies Codex output before reporting `DONE`.

Required checks:

1. Process evidence exists: event log or stdout capture, stderr log, and last-message file if
   requested.
2. Every contracted output path exists.
3. Every contracted output file is non-empty.
4. Required structural markers are present.
5. Output paths are under the contracted write directory.
6. Source files are unchanged, unless this task explicitly authorized source edits.
7. No wrapper-authored fallback content exists under a Codex label.

For evaluators, structural markers are:

```text
SYSTEM_LABEL: codex
ACTUAL_RUNTIME: codex-exec
VERDICT: <PASS|REVISE|FAIL>
```

For native-Codex stand-ins that intentionally write a Claude-labeled directory, use:

```text
SYSTEM_LABEL: claude
ACTUAL_RUNTIME: native-codex-stand-in
DEGRADED_SYSTEM_NOTE:
VERDICT: <PASS|REVISE|FAIL>
```

For proposers, structural markers are:

```text
PROPOSAL:
STATUS:
```

Never require task-specific vocabulary as a success gate. Vocabulary greps are advisory only.
A valid clean PASS may contain no typed findings.

### P5 - Report wrapper status

The wrapper's final response begins with:

```text
STATUS: <DONE|DONE_WITH_CONCERNS|BLOCKED>
ARTIFACT: <contracted output path or directory>
CODEX_EXIT: <exit code or signal>
CODEX_EVENTS: <events_jsonl path, if used>
CODEX_LAST_MESSAGE: <last_message_file path, if used>
```

Use `DONE` only when the process and file gates passed. Use `DONE_WITH_CONCERNS` only when the
contracted files are valid but the wrapper had to perform a disclosed verbatim recovery, such as
copying Codex-authored output from a wrong output root. Use `BLOCKED` for every failure class
below.

---

## Prompt file sections

Every Codex bridge prompt file uses these sections, in this order.

### 1. Mission

State the exact task in one paragraph. Include whether the run is a proposer or evaluator, and
name the loop, iteration, system label, and artifact path.

Template:

```markdown
## Mission

You are Codex running through the Gobbi Claude Code bridge.

Role: <proposer|evaluator>
Loop: <ideation|preparation|planning|execution|wrap-up>
Iteration: <n>
System label to write: <codex|claude>
Actual runtime label: <codex-exec|native-codex-stand-in>

Your job is <one concrete task>. You cannot ask the Claude wrapper follow-up questions during
the run. If required context is missing, write no substitute output and report BLOCKED.
```

### 2. Load Directives

Codex must read exact files first. Include paths, not skill names.

Minimum for every bridge run:

```markdown
## Load Directives

Read these files before doing task work:

1. `<main-tree>/.gobbi/projects/gobbi/skills/principles/SKILL.md`
2. `<main-tree>/.gobbi/projects/gobbi/skills/mistake/SKILL.md`
3. `<main-tree>/.gobbi/projects/gobbi/skills/codex/SKILL.md`
4. `<main-tree>/.gobbi/projects/gobbi/skills/codex/delegation.md`
5. `<main-tree>/.gobbi/projects/gobbi/skills/codex/mistakes.md`
```

Add phase and role docs as needed:

- Proposer in WORK: `orchestration/workflow/production.md` plus the loop skill.
- Evaluator: `evaluation/SKILL.md` plus `orchestration/workflow/evaluation.md`.
- RECORD support: `record/SKILL.md` plus `orchestration/workflow/record.md`.

If any required file is missing, report `BLOCKED` with `failure_kind: missing_load_directive`.

### 3. Absolute Paths

List every path Codex needs. Do not ask Codex to derive paths from `pwd`.

Template:

```markdown
## Absolute Paths

Main tree: `<main-tree>`
Worktree: `<worktree-path>`
Session root: `<session-root>`
Contracted write directory: `<write-dir>`
Prompt file: `<prompt-file>`
Target artifact: `<artifact-under-review-or-input>`
Output files:
- `<path-1>`
- `<path-2>`
```

State the root rule:

```markdown
All session writes MUST use the absolute contracted paths above.
Do NOT use relative paths.
Do NOT derive output paths from `pwd`.
The worktree CWD is not the session-write root.
```

### 4. Scope

State write permissions in plain language.

For proposer:

```markdown
## Scope

You may read source and session files needed to understand the task.
You may write only the proposal file under the contracted write directory.
You must not write the canonical draft.
You must not edit source files, skill files, memory files, plugin files, or git metadata.
```

For evaluator:

```markdown
## Scope

You may read the target artifact, source files, session outputs, memory, and required skills.
You may write only the contracted evaluation files.
You must not edit the target artifact, source files, memory files, skill files, plugin files,
or other systems' evaluation directories.
```

### 5. Inputs

Inline the small binding inputs. Cite large references by path.

Inline:

- Scope Contract clauses that bind the run.
- User-approved design decisions that must not reopen.
- The exact output filenames and required headers.
- Any degraded-system label, if this is a stand-in run.

Reference by path:

- Large drafts.
- Prior evaluation files.
- Research packages.
- Long diffs.

### 6. Output Contract

For a proposer:

```markdown
## Output Contract

Write exactly one proposal file:

`<proposal-path>`

The file must start with:

PROPOSAL:
STATUS: complete

Include:
- Summary
- Proposed content
- Assumptions
- Verification notes
- Open risks
```

For an evaluator:

```markdown
## Output Contract

Write exactly these 8 files:

- `<eval-dir>/project.md`
- `<eval-dir>/structure.md`
- `<eval-dir>/performance.md`
- `<eval-dir>/aesthetics.md`
- `<eval-dir>/usage.md`
- `<eval-dir>/consistency.md`
- `<eval-dir>/risk.md`
- `<eval-dir>/overall.md`

Every file must include:

SYSTEM_LABEL: <codex|claude>
ACTUAL_RUNTIME: <codex-exec|native-codex-stand-in>
VERDICT: <PASS|REVISE|FAIL>
```

When `SYSTEM_LABEL` and `ACTUAL_RUNTIME` differ, every file must also include
`DEGRADED_SYSTEM_NOTE:`.

### 7. Failure Contract

Use the exact failure behavior table below. The prompt must tell Codex and the wrapper the same
thing so the final report is deterministic.

| Failure kind | Trigger | Required behavior |
|---|---|---|
| `timeout` | `timeout` kills `codex exec`, or exit code `124` | Report `BLOCKED`; do not use partial files as success |
| `missing_prompt` | `test -s "$prompt_file"` fails before invocation | Report `BLOCKED`; do not run Codex with an inline replacement prompt |
| `missing_output` | Any contracted output path is absent after Codex exits | Report `BLOCKED`; do not accept stdout, wrapper prose, or wrong-root residue as success |
| `empty` | No final message and no contracted output files | Report `BLOCKED`; do not self-author |
| `error` | Non-zero exit, tool error, auth error, sandbox denial, missing required load path | Report `BLOCKED` with stderr tail and exit code |
| `malformed` | Files exist but required names, headers, verdicts, or proposal marker are missing | Report `BLOCKED`; do not patch the files |
| `wrong_root` | Output is written outside the contracted write directory | If complete Codex-authored bytes can be copied verbatim, report `DONE_WITH_CONCERNS`; otherwise `BLOCKED` |
| `source_write` | Git/source diff appears and source writes were not authorized | Report `BLOCKED` with changed paths; do not hide or rewrite the diff |
| `self_authoring` | Wrapper authors missing Codex content | Invalid run; discard the output and report `BLOCKED` |
| `process_status_unknown` | Exit status cannot be determined | Treat as `BLOCKED` unless every contracted file passes and logs prove completion |

Codex may ask for missing context only by writing `STATUS: BLOCKED` in its final response. It
cannot pause the wrapper for live clarification.

### 8. Self-Verification

Prompt Codex to run its own file checks before final response when the sandbox allows it.

```markdown
## Self-Verification

Before your final response:

1. Verify every contracted output file exists.
2. Verify every output file is non-empty.
3. Verify required headers are present with fixed-string checks.
4. Verify you did not modify source files.

If any check fails, report BLOCKED.
```

### 9. Final Response Format

Codex's final response must be short because the files are the artifact.

```text
STATUS: <DONE|BLOCKED>
ARTIFACT: <path or directory>
FAILURE_KIND: <omit on DONE>
VERIFICATION:
  - <check>: <pass|fail>
NOTES:
  - <short note>
```

---

## Proposer prompt contract

A proposer prompt creates an independent Codex proposal for the Claude producer to consider
during dual-system production. It must preserve independence.

Required properties:

- Codex writes only `working/proposals/codex/draft-iter{n}.md`.
- Codex does not read the Claude producer's draft while both are generating.
- Codex does not write the canonical `working/draft-iter{n}.md`.
- Codex does not write the Integration Log.
- Codex does not edit source files.
- The proposal starts with `PROPOSAL:`.
- Empty, timeout, error, and malformed output are `BLOCKED`, never wrapper-authored.

The prompt must include:

- The locked Scope Contract, inline or quoted in the prompt.
- The loop-specific task: ideation design, preparation readiness, planning task decomposition,
  execution implementation proposal, or wrap-up synthesis proposal.
- The expected proposal shape.
- The exact proposal path.
- The timeout budget and degraded-mode consequence.

Degraded consequence text:

```markdown
If you cannot produce the proposal, report BLOCKED. The Claude producer will proceed in
Claude-only degraded mode and label the canonical artifact. Do not write a placeholder proposal.
```

---

## Evaluator prompt contract

An evaluator prompt creates Codex-labeled evaluation files for dual-system evaluation.

Required properties:

- Codex reviews the canonical artifact, not the Codex proposal.
- Codex does not receive the Codex proposal transcript.
- Codex writes exactly the 7 perspective files plus `overall.md`.
- Codex uses the same perspective filenames as Claude: `project`, `structure`, `performance`,
  `aesthetics`, `usage`, `consistency`, `risk`, and `overall`.
- Codex writes no source files and does not edit the artifact under review.
- Every file has `SYSTEM_LABEL`, `ACTUAL_RUNTIME`, and `VERDICT`.

The prompt must include the anti-trust block from [`orchestration/templates/evaluator.md`](../orchestration/templates/evaluator.md)
or a path to the template plus the exact text pasted inline. The evaluator must verify claims
against files, not trust the producer's summary.

Do not ask Codex to produce one file per finding. The Gobbi evaluation shape is one file per
perspective plus overall. RECORD handles finding staging later.

---

## Wrapper verification gates

The Claude wrapper verifies these gates in order.

### Gate 1 - Prompt file

- Prompt file exists and is non-empty.
- Required section headings exist.
- No unresolved template placeholders remain, such as `<<slot>>`, `<TODO>`, or `TBD`.
- The prompt names exact output files.

### Gate 2 - Process

- `codex exec` was invoked with `- < "$prompt_file"`.
- `timeout` wrapped the invocation.
- `--cd` was explicit.
- `--add-dir` was present for file-writing runs.
- The invocation carries adjacent `-m gpt-5.6-sol` and
  `-c 'model_reasoning_effort="xhigh"'` options, unless the user requested a documented per-run
  replacement.
- Foreground/background choice matches the host budget; background runs use deterministic stdin
  EOF, captured PID, and exact-PID cleanup.
- The exit code was captured.
- stdout/events, stderr, and optional last-message files were captured.

### Gate 3 - Files

- Contracted files exist.
- Contracted files are non-empty.
- File count exactly matches the contract.
- Required headers are present.
- No extra files appear in the output directory unless the prompt explicitly allowed them.

### Gate 4 - Root and source

- Every output file is under the contracted write directory.
- No output was written into a worktree-nested session path.
- `git status --short` for source and memory paths is unchanged unless source writes were
  explicitly in scope.

### Gate 5 - Semantic spot-check

- Proposer file starts with `PROPOSAL:` and is not a wrapper summary.
- Evaluator files review the target artifact and are not copied from producer text.
- Stand-in labels, when used, are explicit and repeated in every file.

---

## Shell patterns

Use this **foreground** pattern for bridge runs that write files only when the host grants the full
budget — a native-Codex host under the cap, or a short sub-cap run. Launch mode is governed by the
[`codex/SKILL.md` § codex exec launch runtime matrix](SKILL.md#codex-exec-launch-runtime-matrix): a
Claude Code proposer / full-eval run that may exceed ~540s must use the **background** variant below
instead — a foreground `timeout 1200` in Claude Code is killed at the ~600s Bash cap.

```bash
prompt_file="<absolute-prompt-file>"
write_dir="<absolute-contracted-write-dir>"
events_jsonl="$write_dir/codex-events.jsonl"
stderr_log="$write_dir/codex-stderr.log"
last_message_file="$write_dir/codex-last-message.md"

test -s "$prompt_file"

set +e
timeout 1200 codex exec \
  -m gpt-5.6-sol \
  -c 'model_reasoning_effort="xhigh"' \
  --sandbox workspace-write \
  --cd "$main_tree" \
  --add-dir "$write_dir" \
  --json \
  --output-last-message "$last_message_file" \
  - < "$prompt_file" > "$events_jsonl" 2> "$stderr_log"
codex_status=$?
set -e
```

After that, run explicit checks. Do not treat `codex_status=0` as success by itself.

For a Claude Code run that may exceed ~540s, use the **background** form per the [`codex/SKILL.md` §
codex exec launch runtime matrix](SKILL.md#codex-exec-launch-runtime-matrix) — keep the same
prompt-file transport and capture the exact PID (the `timeout 1200` is then the detached cap):

```bash
set +e
timeout 1200 codex exec \
  -m gpt-5.6-sol \
  -c 'model_reasoning_effort="xhigh"' \
  --sandbox workspace-write \
  --cd "$main_tree" \
  --add-dir "$write_dir" \
  --json \
  --output-last-message "$last_message_file" \
  - < "$prompt_file" > "$events_jsonl" 2> "$stderr_log" &
codex_pid=$!
set -e
```

Track only `codex_pid`. If the run hangs, kill that PID and then validate the contracted files.
Never clean up with `pkill -f`.

---

## Parent-doc routing

The parent docs route here as follows:

- [`codex/SKILL.md`](SKILL.md) owns Codex runtime selection, model and effort policy, launch
  selection, metadata lookup, and high-level bridge use cases. It links here for the exact
  prompt-file invocations, lifecycle, verification gates, and wrapper failure behavior.
- [`orchestration/delegation.md`](../orchestration/delegation.md) owns Gobbi manager-to-specialist
  dispatch, while the [`delegation` skill](../delegation/SKILL.md) owns workflow-agnostic brief
  semantics. The orchestration protocol links here only when the delegated specialist is a Claude
  wrapper that will invoke Codex.
- [`orchestration/workflow/production.md`](../orchestration/workflow/production.md) owns producer
  spawn, freeze, and integration. It links here for the Codex proposer prompt-file contract.
- [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) owns evaluator
  spawn and verdict reconciliation. It links here for the Codex evaluator prompt-file contract.

Do not duplicate this contract in those parent docs. Parent docs may summarize the rule in one
or two sentences, then link here.

---

## References

- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex CLI reference: https://developers.openai.com/codex/cli/reference
- OpenAI Codex sandboxing: https://developers.openai.com/codex/concepts/sandboxing
- OpenAI Codex prompting: https://developers.openai.com/codex/prompting
