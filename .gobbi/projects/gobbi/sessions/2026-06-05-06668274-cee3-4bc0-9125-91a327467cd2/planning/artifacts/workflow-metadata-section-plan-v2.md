---
name: workflow-metadata-section-plan-v2
description: REVISED (v2) verbatim reframed "## Workflow Metadata" section for orchestration/SKILL.md — simplified to record CUMULATIVE per-agent token usage (input/output/cacheRead/cacheCreation/total) summed from each agent's OWN transcript, keyed by subagent-id + role. Drops toolStats / toolUse headline totalTokens / finalTurnUsage / duration / tool-use count. Plus the session.template.json schema edit (schemaVersion 1→2), the blast-radius doc reconciliations, and the hook backlog draft.
type: plans
scope: project
feature: null
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, session-json, agents-metadata, telemetry, docs-reframe, schema-change, cumulative-tokens]
domain: docs
supersedes: workflow-metadata-section-plan
---

# Planning artifact v2 — reframe `## Workflow Metadata` into a cumulative-token recording procedure

This artifact SUPERSEDES `workflow-metadata-section-plan.md` (v1). It is a DRAFT for an executor to land later. PLAN/DRAFT only — no target files were edited besides this one artifact.

## What changed from v1 (the user clarification)

The user clarified the intent: **record how many tokens each agent used, keyed by subagent-id and role.** The token figures must be the **true cumulative usage** of each agent. Three consequences:

1. **Source moved.** The per-agent breakdown is no longer read from the parent `toolUseResult` (which exposes only a final-turn `usage` block and a headline `totalTokens` that is a *different metric*). It is now summed from **each agent's OWN transcript file** — verified this session: every subagent has `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`, and the manager's turns are in the main transcript itself.
2. **Fields dropped.** `finalTurnUsage`, the headline `totalTokens` (toolUse figure, e.g. 76170), `totalDurationMs`, `totalToolUseCount`, and any `toolStats` tool-level breakdown are all REMOVED. The user does not want tool stats; duration is already derivable from `startedAt`/`finishedAt`.
3. **Manager is no longer special.** It has a transcript like any agent, so its real `tokensUsed` now lives in its own `agents[0]` entry. The session rollup simplifies to a single `usage.sessionTotal` + `computedAt`; the separate `usage.manager` block is dropped.

The single executor task this plan decomposes into is a **documentation + template-JSON** task (no source-code logic change). The hook SCRIPT code-fix is explicitly OUT of scope — captured as the §D backlog.

---

## Verified facts (Principle 7 — run fresh this session against the live transcript)

> Re-run, not recalled. The `leader-iter2-verification-claim-without-evidence` mistake demands the exact numbers come from the canonical source, not a prior draft.

- **Subagent transcript path formula confirmed:** `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`. The dir holds 34 files (17 `agent-*.jsonl` + 17 `.meta.json`). The `<agentId>` (short id, e.g. `a7363717821bc156d`) is exactly the `toolUseResult.agentId` and exactly the filename stem.
- **Subagent cumulative fetch verified** for executor `a7363717821bc156d`: `{ input: 16578, output: 5992, cacheRead: 2268657, cacheCreation: 253097, total: 2544324 }` — matches the brief field-for-field.
- **Manager cumulative fetch verified** over the main transcript (`isSidechain==false`): a live, still-growing total (read this session as ~70.3M: input 37166 / output 646175 / cacheRead 66.5M / cacheCreation 3.05M). It grows as the session runs, so the plan pins the *mechanism*, not a frozen number.
- **Headline ≠ cumulative confirmed:** the same agent's parent `toolUseResult.totalTokens` reads `76170`, vs its cumulative own-transcript sum `2544324`. Different metric — the headline is NOT used.
- **Enumeration source confirmed:** scanning the parent transcript for `toolUseResult` (guarded with `(.toolUseResult|type=="object")`) yields the 16 spawns so far, each with `agentId` + `agentType` + `tool_use_id`. (One transcript line carries `toolUseResult` as a string, not an object — the guard is REQUIRED or jq errors.)
- **The 1-of-N gap still confirmed:** `jq '.agents | length'` on the worktree `session.json` = `1` (manager seed only); the hook never populated the rest (worktree-path bug — §D).

---

## SPEC (Principle 13)

- **What:** Reframe the `## Workflow Metadata` H2 in `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (canonical; `.claude/skills/orchestration/SKILL.md` is a symlink — ONE file to edit) so the `### Workflow runtime` portion reads as a *recording procedure*: for each operation-metadata kind, **when** it is written, **who** writes it, and **how** (the concrete `jq` fetch). The per-agent record carries a single CUMULATIVE `tokensUsed` block (`input`/`output`/`cacheRead`/`cacheCreation`/`total`) summed from THAT agent's own transcript — uniform for manager and subagents. Add a session-level `usage` rollup of one field (`sessionTotal`) plus `computedAt`. Keep the `### Session metadata` H3 unchanged. Update `templates/session.template.json` to the new shape and bump `schemaVersion` 1→2.
- **File types:** `orchestration/SKILL.md` is an instruction-document skill (Principle 14 governs its language). `templates/session.template.json` is a JSON template (schema source of truth — the live `session.json` is seeded from it). Both are canonical files under `.gobbi/projects/gobbi/skills/orchestration/`.
- **Must-not bleed:** Do NOT absorb the memorization staging→promotion discipline, the git write-root rationale, or the state.json schema. Those stay owned by their skills; this section carries brief pointers only. Do NOT duplicate the structured-header contract — that stays owned by `delegation/SKILL.md § Hook Integration` (this section points to it).

## CRUD plan

- **Update** — `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` lines ~355-389: replace the whole `## Workflow Metadata` block (H2 through end-of-file) with the verbatim section in §A. Anchor on the literal `## Workflow Metadata` heading; the section currently runs to EOF, so the replacement is "from `## Workflow Metadata` to end of file."
- **Update** — `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`: replace the `agents[]` manager-seed entry shape per §B, replace the session-level `usage` rollup per §B, bump `schemaVersion` 1→2.
- **Update** — `.gobbi/projects/gobbi/skills/delegation/SKILL.md § Hook Integration` (lines ~211-230): reconcile the hook's described responsibility (it routes step/phase/iter/sub-step + may seed entries; the manager's `jq` over each agent's own transcript is the token source of truth) per §C-1. Intent UNCHANGED from v1.
- **Update** — `.gobbi/projects/gobbi/features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` lines 68-71: re-map the four `tokensUsed.* ← usage.*` rows to **cumulative sum of the agent's own transcript** (NOT `toolUseResult.usage`, NOT `toolUseResult.totalTokens`) per §C-2, and add the `total` row.
- **Update** — `.gobbi/projects/gobbi/features/install-runtime/design/metadata-extraction-input-vs-result.md` line 32: re-map `toolUseResult.usage.* → agents[].tokensUsed` to "**cumulative** `tokensUsed` ← sum of the agent's OWN transcript `message.usage` per turn" per §C-3; the parent `toolUseResult` keeps only the enumeration role (id/type/tool_use_id).
- **Update** — `.gobbi/projects/gobbi/features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` line 22: update the persisted-field enumeration to the new field set per §C-4.
- **Create** — `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` (the §D backlog). Routed to the `agents` feature backlog (sibling backlogs already exist: `schema-extension-agents-status-field.md`, `privacy-retention-agents-metadata-deferred.md`). The executor/Wrap-up places it; §D provides the body.
- **Read (consistency only, no edit)** — `git/SKILL.md § Memory Access Matrix`; `memorization/SKILL.md § MEMORIZATION Phase` (reconcile cadence); `workflow/{ideation,planning,execution,wrap-up}.md § Per-iteration session-memory commit cadence`; `reconstruct-agents.sh` (shares the bug; named in §D, not edited here).
- **Blast radius — confirmed by grep (excl. `sessions/` and `worktrees/`):** references to `tokensUsed` / `totalTokens` / the hook updating tokens outside the section itself are: `delegation/SKILL.md § Hook Integration` (C-1), `install-runtime/references/...-empirical.md` (C-2), `install-runtime/design/metadata-extraction-input-vs-result.md` (C-3), `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (C-4), and the two code consumers `post-tool-use-agents.sh` + `reconstruct-agents.sh` (NOT edited — §D backlog). The `Workflow Status Display` section does NOT read agents[] tokens (grep-confirmed), so no edit there.

---

## A. Verbatim new section (drop-in replacement for current lines ~355-389, H2 → EOF)

> Executor: paste everything between the BEGIN/END fences below verbatim, replacing the current
> `## Workflow Metadata` block. The section currently runs from `## Workflow Metadata` to end of file
> (no trailing `---`); end the replacement at end of file the same way. The `### Session metadata` H3
> anchor is preserved unchanged to avoid extra blast-radius; only `### Workflow runtime` is restructured
> and one new H3 (`### Recording operation metadata`) is added.

<!-- BEGIN REPLACEMENT -->
## Workflow Metadata

The manager maintains session-level operation metadata in a per-session `session.json` file — identity and git context (the session's frame) plus the runtime record of every step and every spawned agent. The per-agent record answers one question: **how many tokens did each agent use** (keyed by its subagent-id and role). This metadata exists for monitoring and after-the-fact analysis of how a session spent its token budget, so it MUST actually be recorded as the session runs. This section documents the fields, then the recording procedure: for each metadata kind, *when* it is written, *who* writes it, and *how*.

| Field | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](templates/session.template.json) |
| Writer | manager (the manager agent) — see [§ Recording operation metadata](#recording-operation-metadata) for the per-kind division of labor |
| Reader | manager — recalls session metadata (per-agent token totals, step timings, git context) on resume and for end-of-session analysis |

The file divides into two conceptual sections: **Session metadata** (identity / targeting / environment / time / git context — set at session start, mostly immutable) and **Workflow runtime** (per-step runtime data + per-agent token usage + a session-level total — appended during execution). Each is documented separately below; the recording procedure follows.

### Session metadata

Identity / targeting / environment / time / git — the frame of the session. Set at session start (or at git milestones) and rarely mutated thereafter.

| Field | Value |
|---|---|
| Top-level fields (in serialization order) | `schemaVersion`, `sessionId`, `previousSessionId` (prior session's `sessionId` for continuation chains; `null` for fresh sessions), `project` / `feature` / `task` (targeting hierarchy: project = repo/workspace, feature = larger objective the session contributes to, task = this session's specific goal), `system` (`claude-code` \| `codex`), `startedAt`, `finishedAt`, `transcriptPath` (tilde-form path to the session transcript file — stamped from `$CLAUDE_TRANSCRIPT_PATH` env var with `$HOME` substituted as `~/`; `null` if absent), `git`. Order rule: identity → targeting → environment → time bounds → transcript → git context. |
| Git block (in serialization order) | `git.repo` (`owner/name` shorthand from `gh repo view`), `git.baseBranch` (base branch the work descends from), `git.branch` (working branch — current HEAD in `direct`, feature branch in `worktree-pr`), `git.worktreePath` (absolute path to worktree in `worktree-pr` mode; `null` in `direct`), `git.issue` (GitHub issue number anchoring the work; `null` if none), `git.pr` (PR number once opened; `null` until then). The git workflow mode itself lives in `settings.json` and is not duplicated here. |
| Update points | session start (stamp identity + targeting + environment + `startedAt` + `git` resolved from settings); worktree creation (stamp `git.branch` + `git.worktreePath` in `worktree-pr` mode); PR opened (stamp `git.pr`); session end (stamp top-level `finishedAt`) |

### Workflow runtime

Per-step runtime data + per-agent token usage + a session-level total — appended throughout execution. The three top-level keys for this section are `workflow` (per-step), `agents` (per-spawn, manager included), and `usage` (session-level total).

| Field | Value |
|---|---|
| `workflow` shape | Keyed by step name (same keys as `state.json` and `settings.json`). The Configuration entry carries only `startedAt` / `finishedAt` (single pass, no iteration or verdict). Steps 2-6 entries also carry `iter` (final loop iteration count, archived from state.json `iter` on step exit) and `verdict` (final outcome — `pass` \| `fail` \| `skipped`). |
| `workflow` update points | each step transition (set `workflow.{step}.startedAt` / `finishedAt`); each loop iteration close (increment `workflow.{step}.iter` for steps 2-6); each step exit (stamp `workflow.{step}.verdict` for steps 2-6 — `pass` \| `fail` \| `skipped`) |
| `workflow.chat.tasks[]` (additive — Chat sessions only) | Present when `settings.mode == "chat"`; Auto sessions leave this array empty. Each entry: `taskNo` (zero-padded ordinal within session), `slug` (subject-descriptive kebab-case), `startedAt`, `finishedAt`, per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as the top-level `workflow.{step}` entries — same parser, different path), plus `taskRecord: { path, writtenAt }`. The `preparation` sub-record carries `state: "Skipped"` by default. Update points: on slice start (stamp `taskNo`, `slug`, `startedAt`); on each loop transition within the slice; on task-record write (stamp `taskRecord`); on slice exit (stamp `finishedAt`). |
| `agents` shape | Flat top-level array — one entry per spawn, **manager included as `agents[0]`**. The template ships with the manager entry pre-populated (`type: "manager"`, `tokensUsed` zeroed) as the seed shape. Each entry self-identifies its step and phase, and carries that agent's CUMULATIVE token usage. The manager is not special: it has its own transcript (the main session transcript), so its `tokensUsed` is recorded in this entry like any other agent. |
| Per-agent record — identity + routing fields | `id` (subagent session id — the short `agentId` from `toolUseResult`, e.g. `a7363717821bc156d`; for the manager, its own session id), `name` (display name from spawn), `type` / role (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`), `step` (`configuration` \| `ideation` \| `preparation` \| `planning` \| `execution` \| `wrap-up`), `phase` (which phase spawned the agent — `DISCUSSION` is manager-only; `WORK` carries the loop verb; `EVALUATION`; `MEMORIZATION`; `null` for the manager entry), `iter` (loop iteration; `null` for Configuration and the manager entry), `sub_step` (disambiguates parallel spawns sharing `(step, phase, iter)`; `null` if single), `model`, `system` (`claude-code` \| `codex`), `transcriptPath` (path to THIS agent's transcript — the file the token sum is computed from), `status` (`ok` \| `failed`), `startedAt`, `finishedAt`. (Wall-clock duration is derivable from `startedAt`/`finishedAt`; it is not stored.) |
| Per-agent record — token usage | `tokensUsed` (`{input, output, cacheRead, cacheCreation, total}`) — the **cumulative** token usage summed across ALL of this agent's turns, computed from THIS agent's own transcript. `total` = `input + output + cacheRead + cacheCreation`. This is the true cumulative figure, NOT the parent `toolUseResult.totalTokens` (a different, smaller headline metric) and NOT the final-turn `toolUseResult.usage` (one turn only). See [§ Recording operation metadata](#recording-operation-metadata) for the exact fetch. |
| `agents` update points | session start (manager fills the `agents[0]` manager seed — `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`; `tokensUsed` stays zeroed until a rollup); each subagent return (manager stamps that agent's entry — identity/routing now, `tokensUsed` summed from the agent's own transcript — see [§ Recording operation metadata](#recording-operation-metadata)); MEMORIZATION / Wrap-up (manager bulk-reconciles the whole array — including its own `agents[0]` `tokensUsed` from the main transcript — as an idempotent safety net). The PostToolUse hook `post-tool-use-agents.sh` may seed routing fields (`step` / `phase` / `iter` / `sub_step`) but is NOT the source of truth for tokens — see the procedure below. |
| `usage` shape (session-level total) | `usage.sessionTotal` — the sum of every `agents[].tokensUsed.total` (manager + all subagents). `usage.computedAt` — ISO timestamp of the last rollup. |
| `usage` update points | MEMORIZATION (per iteration) and Wrap-up: recomputed from the `agents[]` array each time — idempotent. |

### Recording operation metadata

The token usage MUST be recorded as the session runs; in practice it has been missed (a worktree-path bug in the PostToolUse hook left `agents[]` at the manager-seed entry only — see the backlog [`features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`](../../../features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md)). The recording mechanism that is the **source of truth** is the manager running `jq` over **each agent's own transcript** — NOT the hook, and NOT the parent `toolUseResult`.

**Where the numbers live.** Every agent has its OWN transcript file, which carries that agent's full per-turn history:

- **Subagents:** `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl` — i.e. `<projects>/<parent-session-id>/subagents/agent-<agentId>.jsonl`. The `<agentId>` is the short `toolUseResult.agentId` (e.g. `a7363717821bc156d`), which is also the file stem. These files carry the subagent's full per-turn history (`isSidechain: true`).
- **Manager (main agent):** the main session transcript `$CLAUDE_TRANSCRIPT_PATH` itself, filtering its own `isSidechain == false` assistant entries.

The parent transcript is used ONLY to **enumerate** the spawns (their `agentId`, `agentType`/role, and `tool_use_id`). The TOKEN numbers come from each agent's own transcript. (`toolUseResult.totalTokens` is a different, much smaller metric — do not use it; `toolUseResult.usage` is final-turn only — do not use it.) See the empirical shape reference [`features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`](../../../features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md).

**When + who + how — the recording procedure.**

| Metadata kind | When written | Who | How (concrete fetch) |
|---|---|---|---|
| Manager seed entry | Configuration Step 1 (row 4) | manager | Fill `agents[0]` (`type: "manager"`) with `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`. `tokensUsed` stays zeroed until the first rollup. |
| Per-subagent entry | On each subagent return (immediate) | manager | (1) Enumerate the just-returned spawn from the parent transcript by its `tool_use_id` to get `agentId` + `agentType` (fetch **(a)**). (2) Sum that agent's cumulative `tokensUsed` from its OWN transcript `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl` (fetch **(b)**). Upsert the matching `agents[]` entry. |
| Bulk reconcile (safety net) | MEMORIZATION (per iteration) + Wrap-up | manager | Re-enumerate all spawns (fetch **(a)** without the `tool_use_id` filter), re-sum each agent's own transcript (fetch **(b)** per file), and idempotently refresh every `agents[]` entry by `id`. Also refresh `agents[0]` (manager) `tokensUsed` from the main transcript (fetch **(c)**). Last write wins on retries. |
| Session `usage.sessionTotal` | MEMORIZATION (per iteration) + Wrap-up | manager | Sum every `agents[].tokensUsed.total` (manager + subagents); stamp `usage.computedAt`. Idempotent. |

Fetch **(a) — enumerate spawns** from the parent transcript (drop the `--arg tuid` / `select` line for the bulk variant). The `type=="object"` guard is required because one transcript line carries `toolUseResult` as a string:

```bash
jq -rc --arg tuid "$TOOL_USE_ID" '
  select((.toolUseResult | type == "object") and .toolUseResult.agentId != null)
  | select((.message.content[0].tool_use_id // "") == $tuid)
  | { id: .toolUseResult.agentId, type: .toolUseResult.agentType,
      tool_use_id: .message.content[0].tool_use_id }
' "$CLAUDE_TRANSCRIPT_PATH"
```

Fetch **(b) — a subagent's cumulative `tokensUsed`** from its OWN transcript (point `$AGENT_TRANSCRIPT` at `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`):

```bash
jq -s '[ .[] | select(.type == "assistant") | .message.usage ]
  | { input:         (map(.input_tokens                // 0) | add),
      output:        (map(.output_tokens               // 0) | add),
      cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
      cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
  | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
' "$AGENT_TRANSCRIPT"
```

Fetch **(c) — the manager's cumulative `tokensUsed`** — the same sum over the MAIN transcript, adding `and .isSidechain == false` (the main transcript also holds the subagents' sidechain turns, so the manager's own turns must be filtered):

```bash
jq -s '[ .[] | select(.type == "assistant" and .isSidechain == false) | .message.usage ]
  | { input:         (map(.input_tokens                // 0) | add),
      output:        (map(.output_tokens               // 0) | add),
      cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
      cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
  | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
' "$CLAUDE_TRANSCRIPT_PATH"
```

**The hook's accurate (limited) role.** `post-tool-use-agents.sh` (registered for matcher `Task|Agent` on `PostToolUse` + `PostToolUseFailure`) reads the delegation prompt's structured headers (`Your phase:` / `Your iteration:` / `Your sub-step:` / `Your step:` — owned by [`delegation/SKILL.md` § Hook Integration](../delegation/SKILL.md#hook-integration)) and may upsert an entry's routing fields cheaply. It is harmless and stays registered, but it is doubly wrong for tokens: (1) under the always-worktree model its session-dir resolver scans the main-tree `cwd`, where the worktree's `session.json` does not exist, so the upsert is often skipped entirely; (2) even when it fires it reads the parent `usage` (final turn) from the WRONG file — not the agent's own transcript summed across turns. The manager-`jq` procedure above (each agent's own transcript) is the source of truth; the verify-and-fix reconstructor [`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh) shares both limits and is likewise a convenience, not the authority. Both are tracked for repair in the backlog above.
<!-- END REPLACEMENT -->

---

## B. `templates/session.template.json` edit (exact old→new JSON)

Three changes: (1) bump `schemaVersion` 1→2; (2) replace the `agents[]` manager-seed entry shape; (3) replace the top-level `usage` rollup with the simplified `{ sessionTotal, computedAt }`.

**B-1 — `schemaVersion` (line 2):**

```diff
-  "schemaVersion": 1,
+  "schemaVersion": 2,
```

**B-2 — `agents[]` manager-seed entry (current lines 29-49) → new shape:**

OLD:
```json
  "agents": [
    {
      "id": null,
      "name": null,
      "type": "manager",
      "step": null,
      "phase": null,
      "iter": null,
      "model": null,
      "system": null,
      "transcriptPath": null,
      "tokensUsed": {
        "input": 0,
        "output": 0,
        "cacheRead": 0,
        "cacheCreation": 0
      },
      "startedAt": null,
      "finishedAt": null
    }
  ],
```

NEW:
```json
  "agents": [
    {
      "id": null,
      "name": null,
      "type": "manager",
      "step": null,
      "phase": null,
      "iter": null,
      "sub_step": null,
      "model": null,
      "system": null,
      "transcriptPath": null,
      "status": null,
      "tokensUsed": {
        "input": 0,
        "output": 0,
        "cacheRead": 0,
        "cacheCreation": 0,
        "total": 0
      },
      "startedAt": null,
      "finishedAt": null
    }
  ],
```

**B-3 — top-level `usage` rollup (replace the existing `usage` object, or insert after the `agents` array if absent):**

OLD (if present from v1-era template — the simplified replacement):
```json
  "usage": {
    "manager": { "input": 0, "output": 0, "cacheRead": 0, "cacheCreation": 0 },
    "subagentsTotalTokens": 0,
    "computedAt": null
  }
```

NEW:
```json
  "usage": {
    "sessionTotal": 0,
    "computedAt": null
  }
```

Notes for the executor:
- The seed `tokensUsed` block KEEPS its name (`tokensUsed`) and `{input,output,cacheRead,cacheCreation}` inner fields, and ADDS `total`. No `finalTurnUsage`, no `totalTokens`, no `totalDurationMs`, no `totalToolUseCount`, no `toolStats` — those are not in the schema.
- Adds `sub_step` and `status` to the routing fields (parity with the per-agent record).
- `usage` drops the per-`manager` block (the manager's usage now lives in `agents[0].tokensUsed`) and the `subagentsTotalTokens` name; it is now `{ sessionTotal, computedAt }`.
- Validate the result parses: `jq -e . templates/session.template.json`.

---

## C. Blast-radius edits

### C-1 — `delegation/SKILL.md § Hook Integration` (lines ~211-230)  — INTENT UNCHANGED from v1

The opening paragraph currently frames the hook as the thing that "upserts `session.json.agents[]` on every `Task` / `Agent` tool call." Reconcile it so the hook is the *routing-metadata* contributor, with manager-`jq` named as the token source of truth.

- Keep: the structured-header convention table — it stays the hook's machine-readable contract and is correct.
- Edit the framing from "the hook ... upserts `session.json.agents[]` on every tool call" to state that the hook *routes* `step` / `phase` / `iter` / `sub-step` from the headers and *may seed* an `agents[]` entry, but that **per-agent token usage is recorded by the manager via `jq` over each agent's own transcript** — pointer to `orchestration/SKILL.md § Recording operation metadata`. Note the worktree-path limitation in one clause and link the backlog.
- Edit the final sentence: keep "omitting headers leaves routing fields `null`," but adjust the lead-in implying the hook is the entry-creator to "the manager (or the hook, when it can resolve the session.json) records entries; omitting the headers leaves routing fields `null`."

(Surgical wording, not a rewrite. The "who owns tokens" framing now says "manager-`jq` over each agent's own transcript," matching §A.)

### C-2 — `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` (lines 68-71)

This reference encoded the OLD `tokensUsed ← usage.*` mapping. Under the new model the per-agent breakdown is NOT from `toolUseResult.usage` at all — it is the cumulative sum of the agent's OWN transcript.

OLD rows (68-71):
```
| `tokensUsed.input` | `usage.input_tokens` |
| `tokensUsed.output` | `usage.output_tokens` |
| `tokensUsed.cacheRead` | `usage.cache_read_input_tokens` |
| `tokensUsed.cacheCreation` | `usage.cache_creation_input_tokens` |
```

NEW (replace the four rows; the source is the agent's OWN transcript, not this `toolUseResult`):
```
| `tokensUsed.input` (cumulative) | Σ `message.usage.input_tokens` over the agent's OWN transcript `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl` (manager: main transcript, `isSidechain==false`) |
| `tokensUsed.output` (cumulative) | Σ `message.usage.output_tokens` over the same file |
| `tokensUsed.cacheRead` (cumulative) | Σ `message.usage.cache_read_input_tokens` over the same file |
| `tokensUsed.cacheCreation` (cumulative) | Σ `message.usage.cache_creation_input_tokens` over the same file |
| `tokensUsed.total` (cumulative) | `input + output + cacheRead + cacheCreation` |
```

Add a one-line note under the table: *"The parent `toolUseResult` is used ONLY to enumerate spawns (`agentId` / `agentType` / `tool_use_id`); its `usage` is the FINAL turn only and its `totalTokens` is a different, smaller headline metric — neither is the cumulative figure. The cumulative `tokensUsed` is summed from each agent's OWN transcript. Earlier drafts mapped `tokensUsed ← toolUseResult.usage.*`, which captured only the last turn — corrected to the own-transcript sum above (session 06668274)."*

### C-3 — `features/install-runtime/design/metadata-extraction-input-vs-result.md` (line 32)

OLD:
```
- `toolUseResult.usage.*` → `agents[].tokensUsed`
```
NEW:
```
- `toolUseResult.agentId` / `agentType` / `tool_use_id` → enumerate the spawn ONLY (identity + join key)
- `agents[].tokensUsed.{input,output,cacheRead,cacheCreation,total}` ← **cumulative** sum of `message.usage` per turn over the agent's OWN transcript (`${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`; manager: main transcript with `isSidechain==false`) — NOT `toolUseResult.usage` (final turn only), NOT `toolUseResult.totalTokens` (different headline metric)
```

### C-4 — `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (line 22)

This backlog enumerates the persisted per-agent fields. It currently lists `tokensUsed` (and the old field set). Update the enumeration to the new set so the privacy backlog stays accurate: the persisted per-agent fields are now `id`, `name`, `type`, `step`, `phase`, `iter`, `sub_step`, `model`, `system`, `transcriptPath`, `status`, `tokensUsed` (`{input, output, cacheRead, cacheCreation, total}` — cumulative), `startedAt`, `finishedAt`; plus the session-level `usage.sessionTotal`. Remove any reference to `finalTurnUsage` / `totalTokens` / `totalDurationMs` / `totalToolUseCount` / `toolStats` (none are persisted). One-clause edit; no scope change to that backlog.

---

## D. Backlog file content (draft) — hook + reconstructor worktree-path / wrong-source bug

> Placement: `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`. The
> executor or Wrap-up creates it (this is the final body). Frontmatter per `memorization/rules.md` base
> schema for `type: backlogs`, `scope: feature`, `feature: agents`.

```markdown
---
name: post-tool-use-hook-cannot-resolve-worktree-session-json
description: The PostToolUse agents hook (and the reconstructor) resolve session.json from the main-tree cwd, but under the always-worktree model the real session.json lives in the worktree — so agents[] is never populated; both also read final-turn usage from the parent toolUseResult instead of summing each agent's own transcript for the cumulative figure.
type: backlogs
scope: feature
feature: agents
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [hook, worktree, session-json, agents-metadata, telemetry, bug]
priority: high
related: [hook-silence-no-agents-mutation-diagnostic, schema-extension-agents-status-field]
---

# Hook cannot resolve the worktree's `session.json`; also reads the wrong token source

## Trigger

Session 06668274 (Chat, task 06) spawned many subagents (executor / evaluator / assistant / leader), yet `session.json.agents[]` held only the 1 manager seed entry at session end. The hook `post-tool-use-agents.sh` IS registered (matcher `Task|Agent` on `PostToolUse` + `PostToolUseFailure`) and IS coded to upsert agents[], but it populated nothing this session. Verified empirically (the live transcript carries all the spawn `toolUseResult` payloads; the worktree `session.json` carries 1 entry).

## Root cause (two independent defects)

1. **Worktree-path mismatch.** `post-tool-use-agents.sh` resolves the session dir from its stdin `cwd`: `resolve_project_name`/`resolve_session_dir` scan `$cwd/.gobbi/projects/<name>/sessions/*-<session_id>`. Under the always-worktree model the session runs with `cwd` at the MAIN tree, but the live `session.json` lives in the WORKTREE (`.../worktrees/.../.gobbi/projects/<name>/sessions/...`). The main-tree path for this session's id does not exist, so `resolve_session_dir` fails and the hook `bail`s silently with exit 0. Result: no upsert, ever, for worktree sessions. `reconstruct-agents.sh` shares this defect (same main-tree `$(pwd)` assumption).

2. **Wrong token source (final-turn, wrong file).** Even when the hook DOES fire, it reads token data from the parent `toolUseResult.usage.*` — the subagent's FINAL-turn breakdown from the PARENT transcript. That is doubly wrong: it is the final turn only (not cumulative), and it is the wrong file (the cumulative figure must be summed from the agent's OWN transcript, `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`). The parent `toolUseResult.totalTokens` is a different, much smaller headline metric and is not the cumulative sum either. `reconstruct-agents.sh` has the same wrong-source read.

## Proposed fix (code — separate session)

- **Resolver:** teach both scripts to prefer the worktree `session.json`. Options to evaluate: (a) read `session.json.git.worktreePath` from the main-tree session dir if one exists, or have the manager pass the worktree path via the hook payload/env; (b) search worktrees under `.gobbi/projects/<name>/worktrees/*/.gobbi/projects/<name>/sessions/` for the matching session-id. Pick at code-fix ideation.
- **Tokens:** change both scripts to compute each agent's CUMULATIVE `tokensUsed` (`{input, output, cacheRead, cacheCreation, total}`) by summing `message.usage` per turn over the agent's OWN transcript (`${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`; manager from the main transcript with `isSidechain==false`), matching the new `agents[]` schema (schemaVersion 2). Stop reading `toolUseResult.usage` / `toolUseResult.totalTokens`. See `orchestration/SKILL.md § Recording operation metadata` (reframed session 06668274) for the exact `jq`.

## Interim mitigation (already in place)

Per the reframed `orchestration/SKILL.md § Recording operation metadata`, the **manager** records each agent's cumulative token usage via `jq` over that agent's own transcript (per-subagent on return + bulk reconcile at MEMORIZATION/Wrap-up). The hook/reconstructor are convenience seeders of routing fields, not the source of truth for tokens — so the missing/incorrect-token defect no longer blocks accurate session telemetry. This backlog tracks repairing the automated path so the manual `jq` step has a working fallback.

## Related

- `features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md` — the scenario describing this silent-failure surface.
- `features/agents/backlogs/schema-extension-agents-status-field.md` — adjacent agents[] schema work.
```

---

## E. Ordered implementation sequence + verification greps

Single executor task (`docs` + template JSON). Sequence within the task:

1. **§A** — Replace `## Workflow Metadata` (H2 → EOF) in `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` with the §A verbatim block.
   - Verify: `grep -n "### Recording operation metadata" .gobbi/projects/gobbi/skills/orchestration/SKILL.md` returns one hit; `grep -c "cumulative" ...SKILL.md` ≥ 1; the section ends the file.
   - Verify NO dropped vocabulary survives: `grep -nE "finalTurnUsage|totalTokens|totalDurationMs|totalToolUseCount|toolStats" .gobbi/projects/gobbi/skills/orchestration/SKILL.md` returns ONLY the lines that explicitly say "do NOT use `toolUseResult.totalTokens`" (the cautionary mentions) — no field-definition use.
2. **§B** — Edit `templates/session.template.json` (schemaVersion, agents seed, usage rollup).
   - Verify: `jq -e '.schemaVersion == 2 and (.agents[0].tokensUsed|has("input") and has("total")) and (.agents[0]|has("tokensUsed") and (has("finalTurnUsage")|not) and (has("totalTokens")|not) and (has("totalDurationMs")|not) and (has("totalToolUseCount")|not) and (has("toolStats")|not)) and (.usage|has("sessionTotal") and has("computedAt") and (has("manager")|not) and (has("subagentsTotalTokens")|not))' templates/session.template.json` prints `true`.
3. **§C-1..C-4** — Apply the four blast-radius edits.
   - Verify: `grep -rnE "finalTurnUsage|totalDurationMs|totalToolUseCount|toolStats" .claude .gobbi/projects/gobbi --include=*.md --include=*.json | grep -v /sessions/ | grep -v /worktrees/` returns NOTHING (the dropped fields are gone from all docs/templates).
   - Verify: `grep -rn "tokensUsed" .claude .gobbi/projects/gobbi --include=*.md --include=*.json | grep -v /sessions/ | grep -v /worktrees/` shows `tokensUsed` only as the CUMULATIVE block in §A, §B (template), C-2/C-3/C-4 docs, and the two code scripts (`post-tool-use-agents.sh`, `reconstruct-agents.sh` — §D, not edited here).
4. **§D** — Create `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` with the §D body.
   - Verify: `test -f`; confirm frontmatter `type: backlogs`, `feature: agents`.
5. **Symlink check** — `readlink .claude/skills/orchestration/SKILL.md` resolves to the canonical file (no second copy to edit); same for `delegation/SKILL.md`.
6. **Anchor integrity** — the new section adds anchor `#recording-operation-metadata` and keeps `#session-metadata`; `grep -n "#session-metadata\|#recording-operation-metadata" .gobbi/projects/gobbi/skills/orchestration/SKILL.md`.

---

## F. NOT in scope

- **Hook / reconstructor code fix** — drafted as the §D backlog; the SCRIPT is not edited by this task.
- **CLI automation of the manager-`jq` stamping** — documented as a manager step; wiring it into a command is a future session.
- **Disabling the hook** — left registered (open question F-Q3 below).
- **Workflow Status Display rendering of usage** — the status display does not currently surface tokens; adding a usage line is a possible follow-up, not this task.

---

## G. Open questions / risks for the user

`user-question:`
- **F-Q1 — `tokensUsed.total` field.** This plan stores `total` alongside `{input,output,cacheRead,cacheCreation}` (precomputed sum) so a reader does not re-derive it. Alternative: store the four categories only and let consumers sum. Recommended: keep `total` (cheap, matches the verified fetch, one obvious headline-per-agent). Confirm, or drop `total`?
- **F-Q2 — session `usage` shape.** This plan simplifies `usage` to `{ sessionTotal, computedAt }` (sum of every `agents[].tokensUsed.total`). The manager's usage now lives in `agents[0]`, so no separate `usage.manager` is needed. Recommended: this shape. Confirm, or keep a richer rollup (e.g. per-role subtotals)?
- **F-Q3 — hook: leave registered or disable.** Left registered (harmless; seeds routing fields). Risk: a half-populated entry (routing set, tokens zero) could mislead a reader who does not know the manager-`jq` step overwrites tokens at MEMORIZATION. Recommended: leave registered AND have the bulk reconcile overwrite `tokensUsed` from each agent's own transcript (final state always correct). Confirm, or disable the hook until the §D code fix lands?
- **F-Q4 — schemaVersion bump.** Bumps `schemaVersion` 1→2 (the `agents[]` `tokensUsed` gains `total`; `usage` reshapes). Solo-user project, no live migration concern. Confirm the bump (recommended), or keep schemaVersion 1?

---

## H. Verification evidence (grounding this plan — Principle 7)

Run fresh this session against `$CLAUDE_TRANSCRIPT_PATH`, its `subagents/` dir, and the worktree `session.json`:

- **Subagent transcript path formula confirmed:** `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl` exists; `agent-a7363717821bc156d.jsonl` present (190 KB). The dir holds 17 `agent-*.jsonl` files.
- **Subagent cumulative fetch (b) verified** for `a7363717821bc156d`: `{ input: 16578, output: 5992, cacheRead: 2268657, cacheCreation: 253097, total: 2544324 }` — exact match to the brief.
- **Manager cumulative fetch (c) verified** over the main transcript (`isSidechain==false`): a live, growing total (~70.3M read this session). Mechanism confirmed; the exact number drifts upward as the session runs, so the plan stores the mechanism, not a frozen figure.
- **Headline ≠ cumulative confirmed:** `a7363717821bc156d` parent `toolUseResult.totalTokens` = `76170`, vs cumulative own-transcript sum `2544324`. Different metric — the headline is not used.
- **Enumeration fetch (a) verified:** the guarded scan of the parent transcript yields 16 spawns, each with `agentId` + `agentType` + `tool_use_id`. The `(.toolUseResult|type=="object")` guard is required — one transcript line carries `toolUseResult` as a string and errors without it.
- **The 1-of-N gap confirmed:** `jq '.agents | length'` on the worktree `session.json` = `1` (manager seed only) — the hook never populated the rest (worktree-path bug, §D).
- **Prior-art reference located:** `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` lines 68-71 map `tokensUsed ← usage.*` — the C-2 edit re-maps to the own-transcript cumulative sum.
