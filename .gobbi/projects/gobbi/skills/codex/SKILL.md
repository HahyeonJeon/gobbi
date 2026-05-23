---
name: codex
description: Best-practices anchor for invoking Codex CLI from within Claude Code. Covers `codex exec` (universal), `codex:codex-rescue` (manager-only), `/codex:adversarial-review` (user-only), sandbox + CWD discipline, hang/timeout patterns, and dual-system evaluation use cases.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Codex

Best-practices anchor for invoking the Codex CLI from within Claude Code. This skill documents invocation patterns, sandbox discipline, timeout handling, and dual-system evaluation use cases derived from empirical session witnesses. Load it before any task that involves spawning or directing a Codex process.

---

## When to load

Load this skill whenever the current task involves running Codex — regardless of whether Codex is the primary agent or a supporting evaluator. Concrete load triggers:

- **Manager preparing to spawn a Codex evaluator** — via `Agent(subagent_type="codex:codex-rescue", ...)` or via the assistant-wrapper dual-system pattern (Section 2(d)). Load before constructing the delegation prompt so that sandbox, CWD, and timeout constraints are inlined correctly.
- **Manager directing the user to type `/codex:adversarial-review`** — the slash command is user-only; load this skill to understand what to ASK versus what to invoke.
- **Any subagent (leader / executor / evaluator / assistant) that will run `codex exec` via its own Bash tool** — load before writing the Bash invocation to get sandbox mode and `--cd` / `--add-dir` flags right.
- **Delegation prompts for tasks that involve Codex** — include this skill in the Load Directives block per `delegation/SKILL.md`. Fresh subagents do not inherit the manager's loaded skills; the skill must be explicitly listed.

The skill is NOT needed for tasks that have no Codex involvement. Do not load it speculatively.

---

## Invocation patterns

Four patterns, in priority order. Choose based on the agent role and the required behavior.

### (a) `codex exec` via Bash — universal primary

The universal pattern. Works from any role — manager, leader, executor, evaluator, assistant — because every agent's `tools:` config includes `Bash`. This is the correct default in all non-manager contexts and the recommended default even for the manager when parallelism or file-based validation is needed.

Canonical form:

```bash
timeout 600 codex exec \
  --sandbox workspace-write \
  --cd /playinganalytics/git/gobbi \
  --add-dir /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id> \
  "<inline prompt or @prompt-file>"
```

Key flags:
- `--sandbox workspace-write` — required for any write operation; use `read-only` when no writes are needed.
- `--cd <main-tree>` — sets the project root that Codex auto-detects. Use the main-tree absolute path (`/playinganalytics/git/gobbi`), not a worktree root. See Section 4 for why.
- `--add-dir <session-path>` — extends the writable set to cover session staging paths outside the project root. Pass the full absolute path.
- `timeout 600` — shell-level timeout wrapper. `codex exec` has no built-in execution cap; see Section 5.

Omit `--effort` and `--model` unless the user has explicitly requested a specific value.

### (b) `Agent(subagent_type="codex:codex-rescue", ...)` — manager-only secondary

The plugin agent `codex:codex-rescue` is a thin Bash wrapper — its own `tools` surface is `Bash` only. The manager can spawn it via the `Agent` tool, but this pattern has a known fire-and-forget behavior (empirical witness, this session's Planning iter1 attempt 1): the agent forwards the task to the companion runtime and returns immediately with a placeholder. The companion broker.json shows `status=running` with a dead pid; no files are written.

Use `codex:codex-rescue` only for ad-hoc rescue of stuck Claude work (see Section 6(b)) where the fire-and-forget risk is acceptable. Do NOT use it as the backbone for evaluator-perspective work where output files must land reliably.

Managers-only restriction: subagents (leader / executor / evaluator / assistant) lack the `Agent` tool — they cannot spawn `codex:codex-rescue`. See Section 3 for the empirical tool-surface witness.

### (c) `/codex:adversarial-review` — user-only

The `/codex:adversarial-review` slash command has `disable-model-invocation: true` in its frontmatter, which means it cannot be triggered by the manager or any subagent programmatically. It is user-initiated only.

When deep adversarial review via the Codex companion is wanted at an evaluation gate, the manager MUST surface the request to the user and ASK them to type the slash command directly. Example manager language: "To run the full adversarial review via the Codex companion, please type `/codex:adversarial-review` in the chat." Never attempt to invoke it via `Bash` or `Agent`.

### (d) Assistant-wrapper pattern — recommended for dual-system evaluation

The recommended topology for parallel dual-system evaluation (empirical decision, this session — see decision-record `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`).

The problem with running `codex exec` background from the manager directly: the Claude Code harness delivers background-task completion notifications lazily — batched on the manager's next tool call. If the manager goes idle after spawning background codex, no awareness of completion arrives. Manager-direct background codex also provides no per-invocation validation before the manager proceeds.

The assistant-wrapper fixes this by pushing the validation into the subagent:

1. Manager spawns 2 `assistant` subagents **in parallel** via `Agent(subagent_type="assistant", run_in_background: true, ...)` — one Claude-side, one Codex-side.
2. Each assistant delegation prompt includes this `codex` skill in its Load Directives.
3. The Codex-side assistant's prompt instructs it to run `codex exec` **foreground** (no `run_in_background` inside the subagent's Bash call). The Bash blocks synchronously until codex exits.
4. After codex exits, the assistant reads the output files at the contracted paths, verifies they exist, greps for required content (verdict lines, perspective files, 5-Type vocabulary: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`), and reports `DONE` only after validation passes.
5. The assistant reports `BLOCKED` if codex output is missing or malformed — never silent `DONE`.
6. The Claude-side assistant runs its evaluation independently via Read/Grep tools.
7. Both assistants return via Agent completion notification (background topology from the manager's perspective) — but because each assistant validated its own output, the notification carries a verified result, not a raw "codex finished, hope it worked".

Topology sketch:

```
manager
  ├── Agent(assistant, background) → [Claude-side eval: Read/Grep tools → verified DONE]
  └── Agent(assistant, background) → [Codex-side eval: Bash(codex exec foreground) → file verify → verified DONE]
       ↑ both return to manager; manager aggregates findings after both complete
```

This pattern eliminates the notification timing class, eliminates fire-and-forget risk, and produces a `DONE` that the manager can trust as verified. See Section 6(a) for a full worked example.

---

## Why subagents must use `codex exec`

Subagents other than the manager cannot spawn `codex:codex-rescue` because they lack the `Agent` tool. This is an empirical fact of the agent `tools:` surfaces:

| Agent | `tools:` line | Can call `Agent`? |
|---|---|---|
| `manager` | `"*"` | Yes |
| `leader` | `Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` | No |
| `executor` | `Read, Grep, Glob, Bash, Write, Edit` | No |
| `evaluator` | `Read, Grep, Glob, Bash` | No |
| `assistant` | `Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch` | No |

Source: `.claude/agents/{manager,leader,executor,evaluator,assistant}.md` frontmatter `tools:` lines (verified 2026-05-23).

The `codex:codex-rescue` plugin agent itself is also `tools: Bash` only — it is a thin Bash wrapper that forwards to the companion runtime.

Consequence: a leader, executor, evaluator, or assistant that tries to call `Agent(subagent_type="codex:codex-rescue", ...)` fails immediately — the Agent tool is not available to it. The universal lowest-common-denominator is `codex exec` via `Bash`, which all roles have. This is why `codex exec` via Bash is the primary pattern (Section 2(a)) and why the assistant-wrapper topology works: the assistant uses its `Bash` tool to run `codex exec` foreground.

Example (inside an evaluator or assistant):

```bash
# CORRECT — Bash is available to all roles
timeout 600 codex exec --sandbox read-only --cd /playinganalytics/git/gobbi \
  "evaluate the following artifact for consistency..."

# WRONG — Agent tool is not available to non-manager roles; this call fails
# Agent(subagent_type="codex:codex-rescue", ...)
```

**Empirical witnesses cited above (from session `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068` Ideation research):**

- I1: `codex exec` is the only invocation path universally available across manager + subagent contexts — `codex:codex-rescue` is a thin Bash forwarder, not a general-purpose wrapper
- I2: `/codex:adversarial-review` has `disable-model-invocation: true` — user-only; manager must ask user to type it (Section 2(c))
- I3: Codex sandbox defaults to `read-only`; write requires `--sandbox workspace-write` — Linux sandbox uses bubblewrap; `workspace-write` allows writes to CWD subtree only
- I4: Codex CWD defaults to `process.cwd()`; set explicitly via `--cd`. The worktree-nested-path mistake traces to this (Section 4)
- I5: No built-in timeout in `codex exec`. Shell `timeout 600 codex exec ...` is the mechanism (Section 5)
- I13: `.claude/agents/{leader,executor,evaluator,assistant}.md` — all lack Agent tool. Only manager has `tools: "*"`. `codex:codex-rescue` itself declares `tools: Bash` (thin wrapper)
- I14: `.agents/skills/` has 16 directory symlinks pre-ship; adding codex brings count to 17. Both `.claude/skills/codex/SKILL.md` (file-level) and `.agents/skills/codex` (directory-level) mandatory — dogfood requires codex to load its own skill
- E1: Codex CLI uses app-server + thread-based execution; `--resume-last` continues prior thread; no resume = fresh context
- E2: Linux sandbox: `workspace-write` writes to CWD subtree; `--add-dir <DIR>` extends writable set for cross-tree writes
- E3: Effort levels `none|minimal|low|medium|high|xhigh`; unset = user config default; leave unset unless user requests
- E4: Default model from `~/.codex/config.toml`; do NOT override `--model` without user direction
- E5: `/codex:setup` is the first-use precondition; gobbi does not install codex itself

---

## Sandbox + CWD discipline

### Sandbox modes

| Mode | When to use |
|---|---|
| `read-only` | Default for evaluation and review — no writes to the filesystem. Cheapest blast radius. |
| `workspace-write` | Required for any file write — session staging artifacts, output files. Specify explicitly; never assume. |
| `danger-full-access` | Unrestricted filesystem access. Never use as a default; only on explicit user instruction. |

Prefer `read-only` unless writes are required. The principle of least privilege: if the task is evaluation only, `read-only` is sufficient and reduces the blast radius if something goes wrong.

### CWD inheritance

`codex exec` inherits the CWD from the calling shell. In Claude Code, each Bash tool call gets its CWD reset to the session start directory (typically the worktree root when running in a worktree context). This means:

- Relative paths inside the prompt resolve against the worktree root, not the main-tree root.
- Codex auto-detects the "project root" based on git context, which may be the worktree root rather than the main repository root.

This session (Planning iter1 attempt 2) observed a concrete failure: codex auto-detected the worktree root as the project boundary and rejected absolute session paths as "writing outside of the project". The workaround: `--cd /playinganalytics/git/gobbi` forces codex to anchor on the main-tree root.

### Absolute-path mandate

From recorded mistake `codex-eval-session-write-path-nested-in-worktree.md`:

> The Codex evaluator's delegation prompt did not include an explicit, concrete reminder that session writes must use the **main-tree absolute path** (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`), not a path relative to the current working directory or the worktree root. The evaluator's CWD was inside the worktree, so a relative or `pwd`-derived path construction produced the worktree-nested path.

Corrected approach from that mistake:

> Every evaluator delegation prompt that involves session writes must carry an explicit line: "All session writes MUST use the absolute main-tree path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...`. Do NOT use relative paths or `pwd`-derived paths. The worktree CWD is NOT the session-write root."

This is mandatory. Inline the full absolute main-tree session path in every prompt that involves writes. Do not rely on the evaluator to construct it correctly from its CWD.

### Cross-tree writes

When the task requires both workspace writes (worktree) and session writes (main-tree), use `--add-dir` to extend the writable set beyond the `--cd` root:

```bash
timeout 600 codex exec \
  --sandbox workspace-write \
  --cd /playinganalytics/git/gobbi \
  --add-dir /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/staging \
  "<prompt>"
```

### Post-eval sanity check

After any Codex evaluator completes, verify output files landed at the correct main-tree absolute path before advancing:

```bash
find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/<loop>/staging -type f -newer <marker-file>
```

If no files appear under the main-tree path, check for worktree-nested residue and apply manager-proxy write fallback.

### Manager-proxy write fallback

If the Codex sandbox prevents writing to the main-tree path (e.g., the `--add-dir` flag was omitted or incorrectly specified), the manager writes the files directly rather than accepting worktree-nested outputs. The manager returns the output content from the Codex stdout and writes it to the contracted session path using the Write tool.

---

## Hang + timeout discipline

### No built-in timeout

`codex exec` has no built-in execution timeout. `DEFAULT_STATUS_WAIT_TIMEOUT_MS` in the companion broker controls a status-poll interval, not an execution cap. A prompt that loops or encounters an unexpected environment can run indefinitely.

Wrap every non-interactive `codex exec` call in the shell `timeout(1)` utility:

```bash
timeout 600 codex exec --sandbox workspace-write ...
```

600 seconds (10 minutes) is a reasonable upper bound for most evaluation tasks. Adjust for known-heavy tasks, but always set a bound.

### Foreground vs background tradeoff

**Foreground** (default recommendation):
- Bash blocks synchronously until codex exits.
- No notification timing issue — the calling agent knows immediately when codex finishes.
- The agent can read stdout and verify output files before reporting done.
- Downside: no parallelism at the manager level if the manager is doing the calling directly.

**Background** (`run_in_background: true` on the Bash call):
- Codex runs in parallel with other manager work.
- The Claude Code harness delivers completion notifications lazily — batched on the manager's next tool call. If the manager goes fully idle, the notification is delayed indefinitely.
- Stdout is not directly available; validation requires reading output files.
- Downside: notification timing class; manager cannot verify output without a separate tool call.

The assistant-wrapper pattern (Section 2(d)) resolves this tradeoff: the manager spawns assistants in background (parallelism at the manager level), but each assistant runs its own codex exec foreground (synchronous from the assistant's perspective). The manager gets verified DONE via the assistant's Agent completion notification.

For longer-running codex jobs that span multiple worktree-bound tool calls, see `git/SKILL.md § Worktree CWD discipline` — codex inherits CWD from the calling shell, and worktree-bound CWD applies to both file reads/writes and `--cd` defaults.

### Companion plugin controls

For jobs running via the codex companion runtime (not `codex exec` direct):
- `/codex:status` — surfaces the companion's view of the running job.
- `/codex:cancel` — cancels the running job. Both are user-invocable slash commands; the manager must ASK the user to type them.

These controls do NOT apply to direct `codex exec` invocations. For direct exec, `timeout(1)` and Bash job control (`kill $!`) are the controls.

### Files-as-truth completion signal

Never treat stdout parsing or broker.json polling as the completion signal. After codex finishes, verify by:

1. File existence — check all contracted output files exist at the expected absolute paths.
2. Content grep — verify key content is present (verdict lines, perspective markers, required vocabulary).
3. Report BLOCKED if either check fails — do not silently report DONE on missing or malformed output.

```bash
# After codex exec exits:
test -f /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<id>/evaluation/iter1/overall.md || echo "MISSING: overall.md"
grep -q "VERDICT:" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<id>/evaluation/iter1/overall.md || echo "MISSING: verdict line"
```

---

## Use cases

### (a) Dual-system evaluator spawn

The recommended pattern for running Claude + Codex evaluations in parallel. Produced from three empirical failure modes observed this session (documented in decision-record `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`).

**Topology:**

```
manager
  ├── Agent(assistant, background) ─ prompt: "Claude perspective: run evaluation via Read/Grep/Bash, write to <session-path>/evaluation/iter1/claude-perspective.md, report DONE after file verified"
  └── Agent(assistant, background) ─ prompt: "Codex perspective: run codex exec foreground, write to <session-path>/evaluation/iter1/codex-perspective.md, verify file + content, report DONE"
       ↑ manager waits for both completion notifications, then aggregates
```

**Worked example — Codex-side assistant delegation prompt sketch:**

```
Load directives: principles skill, rules, codex skill, mistake skill.

You are the Codex-side assistant for this dual-system evaluation.

Task: Run the Codex evaluator on [target artifact] and write findings to the session staging path.

Step 1. Run codex exec FOREGROUND via your Bash tool:
  timeout 600 codex exec \
    --sandbox workspace-write \
    --cd /playinganalytics/git/gobbi \
    --add-dir /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/staging \
    "@/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/staging/codex-eval-prompt.md"

Step 2. Verify output files landed at the absolute main-tree path:

  # Must be 8 per-perspective output files (one per evaluation perspective):
  ls /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/evaluation/iter<m>/codex/ | wc -l  # must be 8

  # 5-Type vocabulary must appear in output (scenario_gap, checklist_gap, design_flaw, assumption_risk, general):
  grep -E "scenario_gap|checklist_gap|design_flaw|assumption_risk|general" \
    /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/evaluation/iter<m>/codex/*.md | wc -l  # >= 1 hit per file (5 vocab present)

  # Verdict line must be present in overall.md:
  grep "^VERDICT:" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/evaluation/iter<m>/codex/overall.md  # verdict line present

  # If any check fails: STATUS: BLOCKED, do not silent DONE.

Step 3. If any check fails, report BLOCKED with the specific failure. Do NOT report DONE if files are missing or malformed.
Step 4. If all checks pass, report DONE.

Session writes MUST use the absolute main-tree path above.
Do NOT use relative paths or pwd-derived paths.
The worktree CWD is NOT the session-write root.
```

After both assistants return DONE, run the post-eval sanity check:

```bash
find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/execution/<task-id>/staging -type f | sort
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
| Primary implementation or planning work where session memory continuity matters | Claude (executor / leader) |
| Adversarial review, fresh-perspective evaluation, "second opinion" on Claude's output | Codex — independent context, different confirmation bias surface |
| Claude looping or self-confirming without progress | Codex-rescue for unstick attempt |

### Effort level

`codex exec` supports `--effort none|minimal|low|medium|high|xhigh`. Higher effort levels multiply token cost. Leave `--effort` unset unless the user has explicitly requested a specific level. The default effort is set in the user's `~/.codex/config.toml`.

### Model selection

Do not pass `--model` unless the user has specified a model. The default model comes from `~/.codex/config.toml`. Overriding the model without user direction can inflate cost or change output quality unexpectedly.

### Sandbox mode and blast radius

`read-only` is the cheapest sandbox mode from a blast-radius perspective — any accidental write fails immediately rather than writing to the wrong path. Use `read-only` for evaluation tasks. Use `workspace-write` only when writes are required and the target paths are explicitly controlled via `--cd` and `--add-dir`.

`danger-full-access` is unrestricted. Never use it as a default. Only use it on explicit user instruction after discussing the risk.

### Timeout bounds

Wrap every `codex exec` call with `timeout 600`. This prevents cost runaway from infinite loops or hung processes. If a task legitimately requires more than 10 minutes, get user approval before raising the cap.

### First-use precondition

`/codex:setup` is the first-use precondition for the Codex companion. Gobbi does not install Codex itself. If Codex is not set up, surface `/codex:setup` to the user before attempting any Codex invocation.

---

## Anti-patterns

- **Spawning `codex:codex-rescue` from a non-manager role.** Leader, executor, evaluator, and assistant lack the `Agent` tool; the call fails immediately. Use `codex exec` via Bash instead (Section 2(a)).

- **Using `codex:codex-rescue` for evaluator-perspective work.** The plugin agent has documented fire-and-forget behavior — it returns immediately with a placeholder and files may never be written. For reliable per-perspective output, use the assistant-wrapper pattern (Section 2(d)).

- **Running `codex exec` via `Bash(run_in_background: true)` then going idle.** The Claude Code harness delivers background-task completion notifications lazily — batched on the manager's next tool call. If the manager goes fully idle, the notification is delayed indefinitely. Use the assistant-wrapper pattern to get synchronous validation inside the subagent, or run codex foreground.

- **Omitting `--cd` and `--add-dir` when writing to paths outside the auto-detected project root.** Codex auto-detects the project root from git context. In a worktree, the auto-detected root may be the worktree directory, not the main repository root. Writes to main-tree absolute session paths are then rejected as "outside the project." Always pass `--cd /playinganalytics/git/gobbi` and `--add-dir <session-path>` for cross-tree writes.

- **Trusting stdout or broker.json as the completion signal.** The companion broker.json may be stale, unused for direct exec, or may show `running` with a dead pid. Verify by file existence and content grep only (Section 5 — files-as-truth discipline).

- **Omitting `timeout 600` from `codex exec` invocations.** `codex exec` has no built-in execution cap. A prompt that loops or encounters an unexpected environment can run indefinitely, burning tokens without limit. Always wrap with `timeout 600` (or an explicitly user-approved cap).

- **Manager reading its own summary of codex eval results instead of the actual per-perspective files.** A summarized handoff from an assistant may drop findings or compress nuance. After evaluation, the manager MUST read the actual output files at the contracted paths before acting on findings.

- **Using `Co-Authored-By:` instead of `AI-Provenance-Record:` in commits that include codex-spawned work.** Codex work is provenance-tracked with `AI-Provenance-Record:` footer, not `Co-Authored-By:`. Pairing the wrong footer misattributes the contribution type.

- **Missing `.agents/skills/codex` directory symlink**: a codex skill that codex itself cannot load is a contradiction. If you create the codex skill at `.gobbi/projects/gobbi/skills/codex/SKILL.md` and a Claude-facing `.claude/skills/codex/SKILL.md` symlink but DON'T also create the directory-level `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex`, then codex CLI (running under `.codex` repo-local entry points per `.codex/AGENTS.md`) cannot find this skill. Verify with `ls -la /playinganalytics/git/gobbi/.agents/skills/codex` — should resolve to a directory symlink.

---

**Constraints** (body block per locked Idea Design A (8 H2 section contract) — NOT an H2 section):

- MUST load this skill before constructing any delegation prompt or Bash invocation that involves Codex.
- MUST include this skill in every subagent delegation prompt's Load Directives block when the task involves Codex — fresh subagents do not inherit.
- MUST use `--sandbox workspace-write` (or more restrictive) for any write operation; never assume write access without specifying the sandbox mode.
- MUST inline the full absolute main-tree session path in every Codex delegation prompt that involves session writes: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` — see `mistakes/codex-eval-session-write-path-nested-in-worktree.md`.
- MUST pass `--cd /playinganalytics/git/gobbi` when the session path is outside the codex auto-detected project root (worktree context).
- MUST run the post-eval `find` sanity check after any Codex evaluator completes to confirm writes landed at the correct main-tree path.
- MUST wrap every `codex exec` invocation in `timeout 600` (or an explicitly user-approved timeout) — no built-in execution cap exists.
- MUST use the assistant-wrapper pattern for dual-system evaluation — not manager-direct background Bash and not `codex:codex-rescue` plugin agent.
- MUST verify Codex output by file existence and content grep (files-as-truth) before reporting DONE; do NOT rely on stdout parsing or broker.json.
- MUST ASK the user to type `/codex:adversarial-review` rather than invoking it programmatically (`disable-model-invocation: true`).
- NEVER attempt to spawn `codex:codex-rescue` from a non-manager role (leader / executor / evaluator / assistant) — the Agent tool is not available to them.
- NEVER use `codex:codex-rescue` as the backbone for per-perspective evaluator output — fire-and-forget behavior means files may not land.
- NEVER set `--effort` or `--model` without explicit user instruction.
- NEVER use `danger-full-access` sandbox mode as a default — only on explicit user instruction.
- ALWAYS use `AI-Provenance-Record:` (not `Co-Authored-By:`) in commits that trace to codex-spawned work.
