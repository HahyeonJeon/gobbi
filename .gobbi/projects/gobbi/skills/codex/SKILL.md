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

Detailed Claude-wrapper-to-Codex prompt-file delegation lives in [`delegation.md`](delegation.md). This `SKILL.md` owns runtime selection, entry points, invocation posture, and high-level use cases; the child doc owns the precise prompt-file lifecycle, wrapper verification gates, and failure behavior.

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

- Load Gobbi skills from `.gobbi/projects/gobbi/skills/<skill-name>/SKILL.md`.
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
- Use `assistant` for narrow lookup and RECORD support.

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
prompt_file="<absolute-session-path>/codex-prompt.md"

timeout 600 codex exec \
  --sandbox workspace-write \
  --cd <main-tree> \
  --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id} \
  - < "$prompt_file"
```

Rules:

- Use `read-only` for evaluation-only work.
- Use `workspace-write` only when Codex must write files.
- Pass `--cd <main-tree>` when a worktree is active and output paths live in the main tree.
- Pass `--add-dir <session-path>` for cross-tree session writes.
- Wrap every bridge call with `timeout 600`, unless the user explicitly approves a different cap. Note: `600` sits AT the Claude Code Bash foreground cap (~600s) — foreground is safe only for SHORT bridge calls; background the call per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix) if it may approach the cap.
- Do not pass `--model` or `--effort` unless the user explicitly requests it.
- For full Gobbi prompt files, use official stdin transport: `codex exec ... - < "$prompt_file"`. Do not standardize `@prompt-file` as the bridge contract unless the local Codex version explicitly documents and verifies it.
- For prompt-file construction, required sections, wrapper checks, and failure behavior, read [`delegation.md`](delegation.md).

### `codex exec` launch runtime matrix

`codex exec` launch mode is not one-size-fits-all — it depends on the host runtime's per-call wall-clock cap and on whether the call may exceed it. This matrix is the single authority for HOW every `codex exec` run is launched; § Dual-System Evaluation, § Dual-System Production, [`orchestration/workflow/production.md`](../orchestration/workflow/production.md), and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) all defer here for launch mode and never restate it.

| Runtime / workload | Launch mode | Completion signal |
|---|---|---|
| Native Codex shell, under the host cap | foreground `timeout <cap>` | process exit + file validation |
| Claude Code Bash, fits under ~540s | foreground, `timeout` under ~540s | validate output files before reporting |
| Claude Code Bash, may exceed ~540s | **background** (`run_in_background`), explicit PID, deterministic stdin EOF (`- < "$prompt_file"` for standard prompt-file runs; `/dev/null` only for verified prompt-argument exceptions) | poll the output file for its closing marker; ignore the detached exit code |
| Assistant wrapper | ONLY if it blocks/polls until the contracted output files pass validation | files-as-truth, never "started" |

**The binding foreground limit in Claude Code is the Bash tool cap, not the `timeout` flag.** The Claude Code Bash tool caps a single foreground call at ~600s (10 min) — its documented max. Background any `codex exec` that may exceed ~540s (9 min) — a ~60s margin below the ~600s (10-min) Bash cap. A `timeout 1200` only governs a run that is ALREADY backgrounded in Claude Code (once detached, the `timeout` flag — not the Bash cap — is the binding limit), or a native-Codex context where the host grants that budget. A foreground `timeout 1200` in Claude Code is dead past ~600s: the harness kills the call first (recorded mistake `codex-exec-timeout-exceeds-bash-cap.md`).

**Re-verify the cap before relying on the number.** The ~600s foreground cap is a harness value that can change — confirm the current Claude Code Bash foreground cap before trusting the 600s figure.

### Dual-System Evaluation

For Claude Code dual-system evaluation, use the assistant-wrapper pattern:

1. Manager spawns two assistant subagents in parallel.
2. Claude-side assistant evaluates directly with read/search tools.
3. Codex-side assistant runs `codex exec` per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix) — foreground when the eval fits under the ~600s Claude Code Bash cap, background otherwise.
4. Codex-side assistant verifies output files and required content before reporting `DONE`.
5. Manager reads the actual per-perspective files before acting on findings.

Do not use `codex:codex-rescue` for required evaluator output. It has a documented fire-and-forget failure mode.

### Dual-System Production

The proposer analogue of § Dual-System Evaluation. A Codex co-worker independently produces a **proposal** in parallel with the Claude producer (leader / executor / assistant), so the canonical artifact is shaped by a second model family at creation time, not only at review. The manager orchestrates this through [`orchestration/workflow/production.md`](../orchestration/workflow/production.md); this section owns the `codex exec` wrapper discipline.

The Codex proposer NEVER writes the canonical `working/draft-iter{n}.md`. It writes only its proposal at `working/proposals/codex/draft-iter{n}.md` (Execution, per task: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`). The Claude producer reads the frozen proposal and selectively integrates it; Codex proposes, Claude writes.

1. Manager spawns the Claude producer and a Codex-side proposer assistant in parallel (parallel-independent — neither sees the other while generating).
2. The Codex-side assistant writes the proposer prompt to a file in a **foreground** step and verifies it on disk (`test -s`) BEFORE invoking codex — never a heredoc embedded in the same backgrounded command that runs Codex.
3. The Codex-side assistant runs `codex exec` per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix). A full proposer workload (large skill reads + a complete draft) routinely exceeds the ~600s Claude Code Bash foreground cap, so in Claude Code it launches as a **background** command (`run_in_background`) with deterministic prompt-file stdin (`- < "$prompt_file"`) — NOT foreground-blocking. Only a native-Codex host that grants the budget runs it foreground `timeout <cap>`.
4. Cap the proposer run with `timeout 1200`. Once a Claude Code run is detached, the `timeout` flag (not the Bash foreground cap) is the binding limit. `timeout 600` (the evaluation-bridge default) is too short for a full proposer workload; the proposer cap is `1200`. This `1200` governs a backgrounded run in Claude Code or a native-Codex context — never a Claude Code foreground call (the harness kills a foreground call at ~600s, per the matrix).
5. To clean up a hung proposer run, kill by explicit **PID** (`ps` / captured `$!`), never `pkill -f '<pattern>'` — a `-f` pattern that is a substring of the cleanup command kills the issuing shell.
6. Validate the proposal **structurally** before reporting `DONE`: the file exists, is > 0 bytes, and carries a `PROPOSAL:` header. Do NOT gate on a content-vocabulary grep — a valid proposal can lawfully omit any given token, so a vocab grep false-blocks a clean proposal.
7. Follow [`delegation.md`](delegation.md) for the full proposer prompt-file contract and failure table.

> **Superseded (runtime-matrix):** the earlier guidance to run the proposer **foreground-blocking with `timeout ≥ 1200s`** is superseded by the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix). In Claude Code the proposer runs **background** — its workload exceeds the ~600s foreground cap — and `timeout 1200` is the detached-run cap, not a foreground budget. Foreground `timeout <cap>` applies only in a native-Codex host that grants the budget.

**Proposer `codex exec` invocation — the proposer is NOT read-only; do NOT reuse the evaluator example.** The proposer MUST write its proposal file, so it runs with `--sandbox workspace-write` — never the `read-only` sandbox the § `codex exec` bridge rule reserves for evaluation-only work. A manager who copies a `read-only` evaluation invocation gets a proposer that cannot write its draft: every loop silently degrades to Claude-only and the feature appears to run while never invoking Codex. The proposer adds the session proposals dir to the writable set via `--add-dir` and writes its draft to `working/proposals/codex/draft-iter{n}.md`. Per-loop form (Ideation / Preparation / Planning / Wrap-up), **background-launched in Claude Code** per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix):

```bash
prompt_file="<main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/{N}-{loop}/working/proposals/codex/proposer-prompt.md"

timeout 1200 codex exec \
  --sandbox workspace-write \
  --cd <main-tree> \
  --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/{N}-{loop}/working/proposals/codex \
  - < "$prompt_file"
```

**Execution per-task variant.** The Execution quartet lives under the task dir, so swap the `--add-dir` writable set and the prompt path to the task's `working/proposals/codex` (draft → `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`):

```bash
prompt_file="<main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/working/proposals/codex/proposer-prompt.md"

timeout 1200 codex exec \
  --sandbox workspace-write \
  --cd <main-tree> \
  --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/working/proposals/codex \
  - < "$prompt_file"
```

Deltas from the evaluator example, all load-bearing: `--sandbox workspace-write` (the proposer writes; the evaluator is `read-only`), the `--add-dir` points at the session `working/proposals/codex/` dir (not an evaluation staging dir), and `timeout 1200` as the detached-run cap (per step 4 — the binding limit once backgrounded, not the `600` evaluation-bridge foreground default). Keep `--cd <main-tree>` so codex anchors on the main-tree root — the worktree CWD is NOT the write root — launch the run per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix): **background** in Claude Code (steps 3–4) with prompt-file stdin (`- < "$prompt_file"`), foreground only in a native-Codex host under the cap, with the explicit-PID kill discipline (step 5), and do NOT pass `--model` / `--effort` unless the user asked.

**Stdin hardening.** The standard bridge uses `- < "$prompt_file"` so stdin is the verified prompt file and reaches EOF. Do not run `codex exec` with no prompt argument and inherited open stdin. Do not combine prompt-file creation and `codex exec` in one backgrounded heredoc command. If an exceptional prompt-argument run is backgrounded, redirect stdin from `/dev/null`; kill a hung run by explicit PID (step 5), never `pkill -f`.

**Degraded mode (CRITICAL).** If the Codex proposal is empty, times out, or errors:

- The Codex-side wrapper reports `STATUS: BLOCKED` with the exact failure. It **never self-authors a proposal** to cover for the absent Codex output — a wrapper-authored proposal is a Claude-family draft wearing a Codex label, which defeats the cross-family independence the feature exists for.
- The producer proceeds **Claude-only** and stamps a durable label in the canonical artifact's frontmatter: `production_mode: claude-only` plus `codex_proposal_absent_reason: <timeout|empty|error>`. RECORD preserves these fields into the loop `outputs/` (see [`record/SKILL.md` § Artifact frontmatter schema](../record/SKILL.md)), so a degraded artifact can never look dual-system-produced.
- A missing Codex **proposer** is NOT a safety gate (production degrades silently to Claude-only with the label); contrast a missing Codex **evaluator**, which IS a safety gate.

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

## Operational discipline

### CWD inheritance

`codex exec` inherits the CWD from the calling shell. In Claude Code, each Bash tool call gets its CWD reset to the session start directory (typically the worktree root when running in a worktree context). This means:

- Relative paths inside the prompt resolve against the worktree root, not the main-tree root.
- Codex auto-detects the "project root" based on git context, which may be the worktree root rather than the main repository root.

This session (Planning iter1 attempt 2) observed a concrete failure: codex auto-detected the worktree root as the project boundary and rejected absolute session paths as "writing outside of the project". The workaround: `--cd <main-tree>` forces codex to anchor on the main-tree root.

### Absolute-path mandate

From recorded mistake `codex-eval-session-write-path-nested-in-worktree.md`:

> The Codex evaluator's delegation prompt did not include an explicit, concrete reminder that session writes must use the **main-tree absolute path** (`<main-tree>/.gobbi/projects/<project-name>/sessions/...`), not a path relative to the current working directory or the worktree root. The evaluator's CWD was inside the worktree, so a relative or `pwd`-derived path construction produced the worktree-nested path.

Corrected approach from that mistake:

> Every evaluator delegation prompt that involves session writes must carry an explicit line: "All session writes MUST use the absolute main-tree path `<main-tree>/.gobbi/projects/<project-name>/sessions/{session-id}/...`. Do NOT use relative paths or `pwd`-derived paths. The worktree CWD is NOT the session-write root."

This is mandatory. Inline the full absolute main-tree session path in every prompt that involves writes. Do not rely on the evaluator to construct it correctly from its CWD.

### Cross-tree writes

When the task requires both workspace writes (worktree) and session writes (main-tree), use `--add-dir` to extend the writable set beyond the `--cd` root:

```bash
timeout 600 codex exec \
  --sandbox workspace-write \
  --cd <main-tree> \
  --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/staging \
  - < "$prompt_file"
```

The `timeout 600` here is a foreground bridge cap that sits AT the ~600s Claude Code Bash foreground limit — background per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix) if the call may approach the cap.

### Post-eval sanity check

After any Codex evaluator completes, verify output files landed at the correct main-tree absolute path before advancing:

```bash
find <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/{N}-{loop}/staging -type f -newer <marker-file>
```

If no files appear under the main-tree path, check for worktree-nested residue and apply manager-proxy write fallback.

### Manager-proxy write fallback

If the Codex sandbox prevents writing to the main-tree path (e.g., the `--add-dir` flag was omitted or incorrectly specified), the manager writes the files directly rather than accepting worktree-nested outputs. The manager returns the output content from the Codex stdout and writes it to the contracted session path using the Write tool.

---

## Hang + timeout discipline

### Foreground vs background tradeoff

This section is the **notification-timing** tradeoff, NOT the launch-cap decision — the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix) owns WHEN a run must be backgrounded. Foreground below is the default only for runs that fit under the ~600s Claude Code Bash cap; a run that may exceed it must be backgrounded per the matrix.

**Foreground** (default recommendation, for runs under the cap):
- Bash blocks synchronously until codex exits.
- No notification timing issue — the calling agent knows immediately when codex finishes.
- The agent can read stdout and verify output files before reporting done.
- Downside: no parallelism at the manager level if the manager is doing the calling directly.

**Background** (`run_in_background: true` on the Bash call):
- Codex runs in parallel with other manager work.
- The Claude Code harness delivers completion notifications lazily — batched on the manager's next tool call. If the manager goes fully idle, the notification is delayed indefinitely.
- Stdout is not directly available; validation requires reading output files.
- Downside: notification timing class; manager cannot verify output without a separate tool call.

The assistant-wrapper pattern (Section 2(d)) resolves this tradeoff: the manager spawns assistants in background (parallelism at the manager level), but each assistant runs its own codex exec foreground (synchronous from the assistant's perspective) — **only for a run that fits under the cap**. An assistant's Bash carries the SAME ~600s foreground cap, so a run that may exceed it must be BACKGROUNDED even inside the assistant (or the assistant polls the output file for its closing marker), per the matrix. The manager gets verified DONE via the assistant's Agent completion notification.

For longer-running codex jobs that span multiple worktree-bound tool calls, see [`git/SKILL.md` § Worktree CWD discipline](../git/SKILL.md#worktree-cwd-discipline) — codex inherits CWD from the calling shell, and worktree-bound CWD applies to both file reads/writes and `--cd` defaults.

### Companion plugin controls

For jobs running via the codex companion runtime (not `codex exec` direct):
- `/codex:status` — surfaces the companion's view of the running job.
- `/codex:cancel` — cancels the running job. Both are user-invocable slash commands; the manager must ASK the user to type them.

These controls do NOT apply to direct `codex exec` invocations. For direct exec, `timeout(1)` and Bash job control (`kill $!`) are the controls.

### Files-as-truth completion signal

**The DONE invariant.** The entity that reports `DONE` MUST have read + validated the contracted output files in the SAME turn. A missing Codex proposer/evaluator is not itself a failure (the proposer degrades to Claude-only; the evaluator is a safety gate) — but an UNVALIDATED completion reported as `DONE` IS a process failure.

Never treat stdout parsing or broker.json polling as the completion signal. After codex finishes, verify by:

1. File existence — check all contracted output files exist at the expected absolute paths.
2. Content grep — verify key content is present (verdict lines, perspective markers, required vocabulary).
3. Report BLOCKED if either check fails — do not silently report DONE on missing or malformed output.

```bash
# After codex exec exits (per-loop, codex system dir):
test -f <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/codex/overall.md || echo "MISSING: overall.md"
grep -q "VERDICT:" <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/codex/overall.md || echo "MISSING: verdict line"
```

---

## Use cases

### (a) Dual-system evaluator spawn

The recommended pattern for running Claude + Codex evaluations in parallel. Produced from three empirical failure modes observed this session (documented in decision-record `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`).

**Topology:**

```
manager
  ├── Agent(assistant, background) ─ prompt: "Claude perspective: run evaluation via Read/Grep/Bash, write to <session-path>/{N}-{loop}/evaluation/iter{n}/claude/{perspective}.md, report DONE after file verified"
  └── Agent(assistant, background) ─ prompt: "Codex perspective: run codex exec foreground, write to <session-path>/{N}-{loop}/evaluation/iter{n}/codex/{perspective}.md, verify file + content, report DONE"
       ↑ manager waits for both completion notifications, then aggregates
```

**Worked example — Codex-side assistant delegation prompt sketch:**

```
Load directives: principles skill, rules, codex skill, mistake skill.

You are the Codex-side assistant for this dual-system evaluation.

Task: Run the Codex evaluator on [target artifact] and write findings to the session staging path.

Step 1. Run codex exec via your Bash tool:
  # launch mode per the codex exec launch runtime matrix — BACKGROUND if the run may exceed ~540s; foreground below is safe only under the ~600s cap
  prompt_file="<main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/staging/codex-eval-prompt.md"

  timeout 600 codex exec \
    --sandbox workspace-write \
    --cd <main-tree> \
    --add-dir <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/staging \
    - < "$prompt_file"

Step 2. Verify output files landed at the absolute main-tree path:

  # Must be 8 per-perspective output files (one per evaluation perspective):
  ls <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/codex/ | wc -l  # must be 8

  # Each file must be non-empty:
  find <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/codex -type f -size +0c | wc -l  # must be 8

  # Verdict line must be present in overall.md:
  grep "^VERDICT:" <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/codex/overall.md  # verdict line present

  # Finding vocabulary checks are advisory only; a clean PASS can validly contain no typed findings.

  # If any check fails: STATUS: BLOCKED, do not silent DONE.

Step 3. If any check fails, report BLOCKED with the specific failure. Do NOT report DONE if files are missing or malformed.
Step 4. If all checks pass, report DONE.

Session writes MUST use the absolute main-tree path above.
Do NOT use relative paths or pwd-derived paths.
The worktree CWD is NOT the session-write root.
```

The sketch's `timeout 600 codex exec` is a foreground evaluator call at the ~600s Claude Code Bash cap; if the evaluation may exceed it, launch background per the [§ `codex exec` launch runtime matrix](#codex-exec-launch-runtime-matrix).

After both assistants return DONE, run the post-eval sanity check:

```bash
find <main-tree>/.gobbi/projects/<project-name>/sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/staging -type f | sort
```

Aggregate findings by reading the per-perspective output files directly. Do not rely on assistant-reported summaries alone.

### (b) Codex-rescue for stuck Claude work

When Claude is looping, mis-applying a pattern, or self-confirming without progress, the manager can spawn `codex:codex-rescue` for a fresh perspective:

```
Agent(subagent_type="codex:codex-rescue", ...)
```

**Caveat:** this pattern has a documented fire-and-forget behavior (empirical witness, this session's Planning iter1 attempt 1). The plugin agent forwards the task to the companion runtime and returns immediately with a placeholder. Files may never be written. Use this pattern for ad-hoc unstick attempts where the fire-and-forget risk is tolerable, not for evaluator-perspective work where output files must land reliably.

If reliability matters, use the assistant-wrapper pattern (Section 2(d)) instead.

### (c) User-initiated `/codex:adversarial-review`

For deep adversarial review via the Codex companion, the manager must surface the request to the user. The `/codex:adversarial-review` slash command has `disable-model-invocation: true` — it cannot be triggered programmatically.

At evaluation gates where adversarial review is warranted, the manager surfaces:

> "To run the full Codex adversarial review, please type `/codex:adversarial-review` in the chat."

Do not attempt to invoke this via Bash or the Agent tool. The manager's role is to ask the user at the right moment, not to bypass the user-only restriction.

---

## Cost + sandbox budget awareness

Codex and Claude consume tokens at different rates and from different budget pools. Use the right tool for the right task:

| Situation | Preferred tool |
|---|---|
| Primary implementation or planning work where session record continuity matters | Claude (executor / leader) |
| Adversarial review, fresh-perspective evaluation, "second opinion" on Claude's output | Codex — independent context, different confirmation bias surface |
| Claude looping or self-confirming without progress | Codex-rescue for unstick attempt |

### Effort level

`codex exec` supports `--effort none|minimal|low|medium|high|xhigh`. Higher effort levels multiply token cost. Leave `--effort` unset unless the user has explicitly requested a specific level. The default effort is set in the user's `~/.codex/config.toml`.

### Model selection

Do not pass `--model` unless the user has specified a model. The default model comes from `~/.codex/config.toml`. Overriding the model without user direction can inflate cost or change output quality unexpectedly.

### First-use precondition

`/codex:setup` is the first-use precondition for the Codex companion. Gobbi does not install Codex itself. If Codex is not set up, surface `/codex:setup` to the user before attempting any Codex invocation.

---

### Codex-specific anti-patterns

These extend the top-of-section Anti-Patterns list with the `codex:codex-rescue`, provenance, and entry-point pitfalls not covered above.

- **Spawning `codex:codex-rescue` from a non-manager role.** Leader, executor, evaluator, and assistant lack the `Agent` tool; the call fails immediately. Use `codex exec` via Bash instead (see § Claude Code Bridge).

- **Using `codex:codex-rescue` for evaluator-perspective work.** The plugin agent has documented fire-and-forget behavior — it returns immediately with a placeholder and files may never be written. For reliable per-perspective output, use the assistant-wrapper pattern (§ Use cases (a)).

- **Running `codex exec` via `Bash(run_in_background: true)` then going idle.** The Claude Code harness delivers background-task completion notifications lazily — batched on the manager's next tool call. If the manager goes fully idle, the notification is delayed indefinitely. Use the assistant-wrapper pattern to get synchronous validation inside the subagent, or run codex foreground.

- **Manager reading its own summary of codex eval results instead of the actual per-perspective files.** A summarized handoff from an assistant may drop findings or compress nuance. After evaluation, the manager MUST read the actual output files at the contracted paths before acting on findings.

- **Using `Co-Authored-By:` instead of `AI-Provenance-Record:` in commits that include codex-spawned work.** Codex work is provenance-tracked with `AI-Provenance-Record:` footer, not `Co-Authored-By:`. Pairing the wrong footer misattributes the contribution type.

- **Missing `.agents/skills/codex` directory symlink**: a codex skill that codex itself cannot load is a contradiction. If you create the codex skill at `.gobbi/projects/<project-name>/skills/codex/SKILL.md` and a Claude-facing `.claude/skills/codex/SKILL.md` symlink but DON'T also create the directory-level `.agents/skills/codex -> ../../.gobbi/projects/<project-name>/skills/codex`, then codex CLI (running under `.codex` repo-local entry points per `.codex/AGENTS.md`) cannot find this skill. Verify with `ls -la <main-tree>/.agents/skills/codex` — should resolve to a directory symlink.

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
