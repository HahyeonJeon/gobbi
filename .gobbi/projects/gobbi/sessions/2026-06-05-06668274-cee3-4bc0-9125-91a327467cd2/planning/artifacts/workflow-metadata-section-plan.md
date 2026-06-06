---
name: workflow-metadata-section-plan
description: Verbatim reframed "## Workflow Metadata" section (replacing orchestration/SKILL.md current lines ~355-389) as an operation-metadata RECORDING PROCEDURE, plus the session.template.json schema edit, the blast-radius doc reconciliations, and the hook-worktree-path backlog draft.
type: plans
scope: project
feature: null
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, session-json, agents-metadata, telemetry, docs-reframe, schema-change]
domain: docs
---

# Planning artifact — reframe `## Workflow Metadata` into an operation-metadata recording procedure

This artifact is a DRAFT for an executor to land later. PLAN/DRAFT only — no target files were edited besides this one artifact. It contains:

1. **§A** — the complete verbatim new `## Workflow Metadata` section (drop-in replacement for current `orchestration/SKILL.md` lines ~355-389), reframed as a recording procedure (timing + who + how, with the concrete `jq` fetches).
2. **§B** — the exact `templates/session.template.json` edit (old→new JSON for the `agents[]` per-entry shape + manager seed + new session-level rollup).
3. **§C** — the blast-radius edits (every other canonical-tree reference to `tokensUsed` / the hook updating tokens), each with its edit.
4. **§D** — the backlog file content for the hook worktree-path + final-turn-usage bug.
5. **§E** — ordered implementation sequence + verification greps.
6. **§F** — open questions / risks for the user.
7. **§G** — verification evidence (the jq checks + hook read that ground this plan).

The single executor task this plan decomposes into is a **documentation + template-JSON** task (no source-code logic change). The hook SCRIPT code-fix is explicitly OUT of scope — it is captured as the §D backlog.

---

## SPEC (Principle 13)

- **What:** Reframe the `## Workflow Metadata` H2 in `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (canonical; `.claude/skills/orchestration/SKILL.md` is a symlink — ONE file to edit) so the `### Workflow runtime` portion reads as a *recording procedure*: for each operation-metadata kind, **when** it is written, **who** writes it, and **how** (the concrete `jq` fetch from the transcript). Keep the `### Session metadata` H3 and the `### Workflow runtime` field documentation, compact (tables + bullets), in the style the Step-1 and `## Workflow Session Memory` sibling sections established this session. Redesign the `agents[]` per-entry metadata to record what the transcript actually provides (cumulative `totalTokens` + duration + tool-use count + final-turn `usage` clearly labeled), and add a session-level usage rollup. Update `templates/session.template.json` to the new shape.
- **File types:** `orchestration/SKILL.md` is an instruction-document skill (Principle 14 governs its language). `templates/session.template.json` is a JSON template (schema source of truth — the live `session.json` is seeded from it). Both are canonical files under `.gobbi/projects/gobbi/skills/orchestration/`.
- **Must-not bleed:** Do NOT absorb the memorization staging→promotion discipline, the git write-root rationale, or the state.json schema. Those stay owned by their skills; this section carries brief pointers only. Do NOT duplicate the structured-header contract — that stays owned by `delegation/SKILL.md § Hook Integration` (this section points to it).

## CRUD plan

- **Update** — `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` lines ~355-389: replace the whole `## Workflow Metadata` block (H2 through end-of-file) with the verbatim section in §A. Anchor the replacement on the literal `## Workflow Metadata` heading; the section currently runs to EOF (line 389), so the replacement is "from `## Workflow Metadata` to end of file."
- **Update** — `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`: replace the `agents[]` manager-seed entry shape (lines 29-49) per §B, and add the session-level `usage` rollup object per §B. Bump `schemaVersion` 1→2.
- **Update** — `.gobbi/projects/gobbi/skills/delegation/SKILL.md § Hook Integration` (lines 211-230): reconcile the hook's described responsibility (it routes step/phase/iter/sub-step + may seed entries; manager-jq is the source of truth for tokens) per §C-1.
- **Update** — `.gobbi/projects/gobbi/features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` lines 68-71: correct the `tokensUsed ← usage.*` mapping rows to the cumulative `totalTokens` framing per §C-2 (this reference is the prior-art doc that encoded the final-turn bug).
- **Update** — `.gobbi/projects/gobbi/features/install-runtime/design/metadata-extraction-input-vs-result.md` line 32: correct the `toolUseResult.usage.* → agents[].tokensUsed` mapping note per §C-3.
- **Create** — `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` (the §D backlog). Routed to the `agents` feature backlog (the hook + agents-metadata live there; sibling backlogs already exist: `schema-extension-agents-status-field.md`, `privacy-retention-agents-metadata-deferred.md`). The executor/Wrap-up places it; §D provides the body.
- **Read (consistency only, no edit)** — `git/SKILL.md § Memory Access Matrix` (write-root rule the new §A points to), `memorization/SKILL.md § MEMORIZATION Phase` (the reconcile cadence §A points to), `workflow/{ideation,planning,execution,wrap-up}.md § Per-iteration session-memory commit cadence` (consumers of the `session.json` upsert — confirmed no token-shape coupling), `reconstruct-agents.sh` (shares the bug; named in §D, not edited here).
- **Blast radius — confirmed by grep (excl. `sessions/` and `worktrees/`):** references to `tokensUsed` / `totalTokens` / the hook updating tokens outside the section itself are: `delegation/SKILL.md § Hook Integration` (C-1), `install-runtime/references/...-empirical.md` (C-2), `install-runtime/design/metadata-extraction-input-vs-result.md` (C-3), `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (privacy backlog — lists `tokensUsed` as a persisted field; the new field set must stay consistent with it, see C-4), and the two code consumers `post-tool-use-agents.sh` + `reconstruct-agents.sh` (NOT edited — §D backlog). The `Workflow Status Display` section (lines 156-206) does NOT read agents[] tokens (grep-confirmed empty), so no edit there.

---

## A. Verbatim new section (drop-in replacement for current lines ~355-389, H2 → EOF)

> Executor: paste everything between the BEGIN/END fences below verbatim, replacing the current
> `## Workflow Metadata` block. The section currently runs from `## Workflow Metadata` to end of file
> (no trailing `---`); end the replacement at end of file the same way. The `### Session metadata` H3
> anchor is preserved unchanged to avoid extra blast-radius; only `### Workflow runtime` is restructured
> and one new H3 (`### Recording operation metadata`) is added.

<!-- BEGIN REPLACEMENT -->
## Workflow Metadata

The manager maintains session-level operation metadata in a per-session `session.json` file — identity and git context (the session's frame) plus the runtime record of every step and every spawned agent (tokens, cache, duration, tool-use counts). This metadata exists for monitoring and after-the-fact analysis of how a session spent its budget, so it MUST actually be recorded as the session runs. This section documents the fields, then the recording procedure: for each metadata kind, *when* it is written, *who* writes it, and *how*.

| Field | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](templates/session.template.json) |
| Writer | manager (the manager agent) — see [§ Recording operation metadata](#recording-operation-metadata) for the per-kind division of labor |
| Reader | manager — recalls session metadata (token totals, cache, step timings, git context) on resume and for end-of-session analysis |

The file divides into two conceptual sections: **Session metadata** (identity / targeting / environment / time / git context — set at session start, mostly immutable) and **Workflow runtime** (per-step runtime data + per-agent operation metadata + a session-level usage rollup — appended during execution). Each is documented separately below; the recording procedure follows.

### Session metadata

Identity / targeting / environment / time / git — the frame of the session. Set at session start (or at git milestones) and rarely mutated thereafter.

| Field | Value |
|---|---|
| Top-level fields (in serialization order) | `schemaVersion`, `sessionId`, `previousSessionId` (prior session's `sessionId` for continuation chains; `null` for fresh sessions), `project` / `feature` / `task` (targeting hierarchy: project = repo/workspace, feature = larger objective the session contributes to, task = this session's specific goal), `system` (`claude-code` \| `codex`), `startedAt`, `finishedAt`, `transcriptPath` (tilde-form path to the session transcript file — stamped from `$CLAUDE_TRANSCRIPT_PATH` env var with `$HOME` substituted as `~/`; `null` if absent), `git`. Order rule: identity → targeting → environment → time bounds → transcript → git context. |
| Git block (in serialization order) | `git.repo` (`owner/name` shorthand from `gh repo view`), `git.baseBranch` (base branch the work descends from), `git.branch` (working branch — current HEAD in `direct`, feature branch in `worktree-pr`), `git.worktreePath` (absolute path to worktree in `worktree-pr` mode; `null` in `direct`), `git.issue` (GitHub issue number anchoring the work; `null` if none), `git.pr` (PR number once opened; `null` until then). The git workflow mode itself lives in `settings.json` and is not duplicated here. |
| Update points | session start (stamp identity + targeting + environment + `startedAt` + `git` resolved from settings); worktree creation (stamp `git.branch` + `git.worktreePath` in `worktree-pr` mode); PR opened (stamp `git.pr`); session end (stamp top-level `finishedAt`) |

### Workflow runtime

Per-step runtime data + per-agent operation metadata + a session-level usage rollup — appended throughout execution. The three top-level keys for this section are `workflow` (per-step), `agents` (per-spawn), and `usage` (session-level rollup).

| Field | Value |
|---|---|
| `workflow` shape | Keyed by step name (same keys as `state.json` and `settings.json`). The Configuration entry carries only `startedAt` / `finishedAt` (single pass, no iteration or verdict). Steps 2-6 entries also carry `iter` (final loop iteration count, archived from state.json `iter` on step exit) and `verdict` (final outcome — `pass` \| `fail` \| `skipped`). |
| `workflow` update points | each step transition (set `workflow.{step}.startedAt` / `finishedAt`); each loop iteration close (increment `workflow.{step}.iter` for steps 2-6); each step exit (stamp `workflow.{step}.verdict` for steps 2-6 — `pass` \| `fail` \| `skipped`) |
| `workflow.chat.tasks[]` (additive — Chat sessions only) | Present when `settings.mode == "chat"`; Auto sessions leave this array empty. Each entry: `taskNo` (zero-padded ordinal within session), `slug` (subject-descriptive kebab-case), `startedAt`, `finishedAt`, per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as the top-level `workflow.{step}` entries — same parser, different path), plus `taskRecord: { path, writtenAt }`. The `preparation` sub-record carries `state: "Skipped"` by default (R1). Update points: on slice start (stamp `taskNo`, `slug`, `startedAt`); on each loop transition within the slice; on task-record write (stamp `taskRecord`); on slice exit (stamp `finishedAt`). |
| `agents` shape | Flat top-level array — one entry per spawn, manager included. The template ships with the manager entry pre-populated (`type: "manager"`, operation-metadata fields zeroed/`null`) as the seed shape. Each entry self-identifies its step and phase. |
| Per-agent record — routing fields | `id` (subagent session id — the `agentId` from `toolUseResult`), `tool_use_id` (the Agent spawn's tool_use id — the join key against the transcript), `name` (display name from spawn), `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`), `step` (`configuration` \| `ideation` \| `preparation` \| `planning` \| `execution` \| `wrap-up`), `phase` (which phase spawned the agent — `DISCUSSION` is manager-only; `WORK` carries the loop verb; `EVALUATION`; `MEMORIZATION`; `null` for the manager entry), `iter` (loop iteration; `null` for Configuration and the manager entry), `sub_step` (disambiguates parallel spawns sharing `(step, phase, iter)`; `null` if single), `model`, `system` (`claude-code` \| `codex`), `transcriptPath`, `status` (`ok` \| `failed`), `startedAt`, `finishedAt` |
| Per-agent record — operation metadata | `totalTokens` (**cumulative** total the subagent consumed across all its turns — the single headline number for budget analysis; from `toolUseResult.totalTokens`), `totalDurationMs` (wall-clock duration of the spawn; from `toolUseResult.totalDurationMs`), `totalToolUseCount` (tool calls the subagent made; from `toolUseResult.totalToolUseCount`), and `finalTurnUsage` (`{input, output, cacheRead, cacheCreation}`) — the **final-turn-only** breakdown from `toolUseResult.usage` (so `input` reads ~2 and the bulk shows as `cacheRead`; this is NOT cumulative and must not be summed as if it were). **Why both:** `totalTokens` is the cumulative figure for analysis; `finalTurnUsage` is the only per-category breakdown the transcript exposes for a subagent, kept for cache-vs-fresh visibility with the explicit caveat that it is final-turn only. |
| `agents` update points | session start (manager fills the manager seed entry — `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`; operation-metadata fields stay zero/`null` for the manager — the manager's totals live in the session-level `usage` rollup, not here); each subagent return (manager stamps that agent's entry from the transcript — see [§ Recording operation metadata](#recording-operation-metadata)); MEMORIZATION / Wrap-up (manager bulk-reconciles the whole array against the transcript as an idempotent safety net). The PostToolUse hook `post-tool-use-agents.sh` may seed routing fields (`step` / `phase` / `iter` / `sub_step`) but is NOT the source of truth for tokens — see the procedure below. |
| `usage` shape (session-level rollup) | `usage.manager` (`{input, output, cacheRead, cacheCreation}`) — the main-agent cumulative usage, summed from the transcript's main-chain `assistant` entries. `usage.subagentsTotalTokens` — sum of every `agents[].totalTokens`. `usage.computedAt` — ISO timestamp of the last rollup. The manager has no per-spawn `toolUseResult` (it is the main chain, not a spawned agent), so its usage is captured here, not in `agents[]`. |
| `usage` update points | MEMORIZATION (per iteration) and Wrap-up: recomputed from the transcript each time — idempotent. |

### Recording operation metadata

The operation metadata MUST be recorded as the session runs; in practice it has been missed (a worktree-path bug in the PostToolUse hook left `agents[]` at the manager-seed entry only — see the backlog [`features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`](../../../features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md)). The recording mechanism that is the **source of truth** is the manager running `jq` over the session transcript — NOT the hook. The hook stays registered (it routes step/phase/iter and may seed entries cheaply) but its token extraction is unreliable and reads the final turn only, so it is not relied on for tokens.

**Where the numbers live.** Each subagent's operation metadata lands in the *parent* transcript (`$CLAUDE_TRANSCRIPT_PATH`, appended live): the Agent spawn's completion is a `type:"user"` line whose `message.content[0].tool_use_id` matches the spawn, carrying a sibling top-level `toolUseResult` object with `agentId`, `agentType`, `totalTokens`, `totalDurationMs`, `totalToolUseCount`, and `usage` (final-turn only). The manager's own usage is in the main-chain `assistant` lines (`isSidechain == false`); the subagents' internal turns are NOT in this transcript (they live in separate sidechain files), so the parent transcript summarizes each subagent only via its `toolUseResult`. See the empirical shape reference [`features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`](../../../features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md).

**When + who + how — the recording procedure.**

| Metadata kind | When written | Who | How (concrete fetch) |
|---|---|---|---|
| Manager seed entry | Configuration Step 1 (row 4) | manager | Fill the template's `agents[0]` (`type: "manager"`) with `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`. Operation-metadata fields stay zero/`null` here — the manager's totals live in the `usage` rollup, not in this entry. |
| Per-subagent entry | On each subagent return (immediate) | manager | Read the just-returned spawn's `toolUseResult` from the transcript, keyed by its `tool_use_id`, and upsert the matching `agents[]` entry. Per-spawn fetch (a): see the **(a)** command below. Timing: the `toolUseResult` is appended the instant the Agent call returns, so it is fetchable immediately. |
| Bulk reconcile (safety net) | MEMORIZATION (per iteration) + Wrap-up | manager | Scan the whole transcript for every `toolUseResult` and idempotently backfill/refresh every `agents[]` entry by `tool_use_id` (last write wins on retries). This catches any spawn whose per-return stamp was missed. Bulk fetch: command **(a)** without the `tool_use_id` filter. |
| Session `usage` rollup | MEMORIZATION (per iteration) + Wrap-up | manager | Sum the main-chain `assistant` usage for `usage.manager` (fetch **(b)** below), sum `agents[].totalTokens` for `usage.subagentsTotalTokens`, stamp `usage.computedAt`. Idempotent — recomputed from the transcript each time. |

Fetch **(a) — per-subagent operation metadata** (drop the `--arg tuid` / `select` line for the bulk variant):

```bash
jq -c --arg tuid "$TOOL_USE_ID" '
  select(.toolUseResult.totalTokens != null)
  | select((.message.content[0].tool_use_id // "") == $tuid)
  | {
      tool_use_id: .message.content[0].tool_use_id,
      id:          .toolUseResult.agentId,
      type:        .toolUseResult.agentType,
      totalTokens:       .toolUseResult.totalTokens,
      totalDurationMs:   .toolUseResult.totalDurationMs,
      totalToolUseCount: .toolUseResult.totalToolUseCount,
      finalTurnUsage: {
        input:         (.toolUseResult.usage.input_tokens                // 0),
        output:        (.toolUseResult.usage.output_tokens               // 0),
        cacheRead:     (.toolUseResult.usage.cache_read_input_tokens     // 0),
        cacheCreation: (.toolUseResult.usage.cache_creation_input_tokens // 0)
      }
    }
' "$CLAUDE_TRANSCRIPT_PATH"
```

Fetch **(b) — manager (main-chain) cumulative usage** for `usage.manager`:

```bash
jq -s '
  [ .[] | select(.type == "assistant" and .isSidechain == false) | .message.usage ]
  | { input:         (map(.input_tokens               // 0) | add),
      output:        (map(.output_tokens              // 0) | add),
      cacheRead:     (map(.cache_read_input_tokens     // 0) | add),
      cacheCreation: (map(.cache_creation_input_tokens // 0) | add) }
' "$CLAUDE_TRANSCRIPT_PATH"
```

**The hook's accurate (limited) role.** `post-tool-use-agents.sh` (registered for matcher `Task|Agent` on `PostToolUse` + `PostToolUseFailure`) reads the delegation prompt's structured headers (`Your phase:` / `Your iteration:` / `Your sub-step:` / `Your step:` — owned by [`delegation/SKILL.md` § Hook Integration](../delegation/SKILL.md#hook-integration)) and may upsert an entry's routing fields cheaply. It is harmless and stays registered, but two limits make it unreliable for tokens: (1) under the always-worktree model its session-dir resolver scans the main-tree `cwd`, where the worktree's `session.json` does not exist, so the upsert is often skipped entirely; (2) even when it fires it reads `usage` (final turn), not `totalTokens` (cumulative). The manager-`jq` procedure above is the source of truth; the verify-and-fix reconstructor [`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh) shares both limits and is likewise a convenience, not the authority. Both are tracked for repair in the backlog above.
<!-- END REPLACEMENT -->

---

## B. `templates/session.template.json` edit (exact old→new JSON)

Two changes: (1) bump `schemaVersion` 1→2; (2) replace the `agents[]` manager-seed entry shape; (3) add a top-level `usage` rollup object after `agents`.

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
      "tool_use_id": null,
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
      "totalTokens": 0,
      "totalDurationMs": null,
      "totalToolUseCount": null,
      "finalTurnUsage": {
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

**B-3 — new top-level `usage` rollup (insert after the `agents` array, before the closing `}`):**

```json
  "usage": {
    "manager": {
      "input": 0,
      "output": 0,
      "cacheRead": 0,
      "cacheCreation": 0
    },
    "subagentsTotalTokens": 0,
    "computedAt": null
  }
```

Notes for the executor:
- The seed entry renames `tokensUsed` → `finalTurnUsage` (same `{input,output,cacheRead,cacheCreation}` inner shape) and adds `tool_use_id`, `sub_step`, `status`, `totalTokens`, `totalDurationMs`, `totalToolUseCount`. The manager seed keeps `totalTokens: 0` and the rest `null`/`0` — the manager's real usage lives in `usage.manager`.
- Validate the result parses: `jq -e . templates/session.template.json`.

---

## C. Blast-radius edits

### C-1 — `delegation/SKILL.md § Hook Integration` (lines 211-230)

The opening paragraph (line 213) currently frames the hook as the thing that "upserts `session.json.agents[]` on every `Task` / `Agent` tool call." Reconcile it so the hook is the *routing-metadata* contributor, with manager-`jq` named as the token source of truth. Replace the first sentence of line 213's paragraph and add one reconciling sentence:

- Keep: the structured-header convention table (lines 219-224) — it stays the hook's machine-readable contract and is correct.
- Edit line 213's framing from "the hook ... upserts `session.json.agents[]` on every tool call" to state that the hook *routes* `step` / `phase` / `iter` / `sub-step` from the headers and *may seed* an `agents[]` entry, but that **per-agent operation metadata (tokens, duration, tool-use count) is recorded by the manager via `jq` over the transcript** — pointer to `orchestration/SKILL.md § Recording operation metadata`. Note the worktree-path limitation in one clause and link the backlog.
- Edit line 226's final sentence: it says omitting headers "leaves `session.json.agents[]` entries with `phase` / `iter` / `sub-step` set to `null`." Keep that, but adjust the lead-in that implies the hook is the entry-creator to "the manager (or the hook, when it can resolve the session.json) records entries; omitting the headers leaves routing fields `null`."

(Surgical wording, not a rewrite — the section's structured-header contract is unchanged; only the "who owns tokens" framing is corrected.)

### C-2 — `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` (lines 68-71)

This reference is the prior-art doc that encoded the final-turn-usage mapping. Correct the mapping table so the cumulative source is named and the final-turn caveat is explicit:

OLD rows (68-71):
```
| `tokensUsed.input` | `usage.input_tokens` |
| `tokensUsed.output` | `usage.output_tokens` |
| `tokensUsed.cacheRead` | `usage.cache_read_input_tokens` |
| `tokensUsed.cacheCreation` | `usage.cache_creation_input_tokens` |
```

NEW (replace the four rows; add the cumulative row above them):
```
| `totalTokens` (cumulative — the headline figure) | `totalTokens` (NOT `usage.*`; `usage` is final-turn only) |
| `totalDurationMs` | `totalDurationMs` |
| `totalToolUseCount` | `totalToolUseCount` |
| `finalTurnUsage.input` (final-turn only, not cumulative) | `usage.input_tokens` |
| `finalTurnUsage.output` | `usage.output_tokens` |
| `finalTurnUsage.cacheRead` | `usage.cache_read_input_tokens` |
| `finalTurnUsage.cacheCreation` | `usage.cache_creation_input_tokens` |
```

Add a one-line note under the table: *"`usage.input_tokens` reads ~2 for a subagent because `usage` is the FINAL turn only; the cumulative total is `totalTokens`. Earlier drafts mapped `tokensUsed ← usage.*`, which under-counted by orders of magnitude — corrected to the field names above (session 06668274)."*

### C-3 — `features/install-runtime/design/metadata-extraction-input-vs-result.md` (line 32)

OLD:
```
- `toolUseResult.usage.*` → `agents[].tokensUsed`
```
NEW:
```
- `toolUseResult.totalTokens` → `agents[].totalTokens` (cumulative — the analysis figure)
- `toolUseResult.{totalDurationMs,totalToolUseCount}` → `agents[].{totalDurationMs,totalToolUseCount}`
- `toolUseResult.usage.*` → `agents[].finalTurnUsage.*` (FINAL turn only — not cumulative; do not sum as a total)
```

### C-4 — `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (line 22)

This backlog enumerates the persisted per-agent fields for a future privacy policy. It currently lists `tokensUsed`. Update the field enumeration to the new set so the privacy backlog stays accurate: replace `tokensUsed` with `totalTokens`, `totalDurationMs`, `totalToolUseCount`, `finalTurnUsage` (and note the new session-level `usage` rollup as additional persisted usage data). One-clause edit; no scope change to that backlog.

---

## D. Backlog file content (draft) — hook + reconstructor worktree-path / final-turn bug

> Placement: `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`. The
> executor or Wrap-up creates it (strip nothing — this is the final body). Frontmatter per
> `memorization/rules.md` base schema for `type: backlogs`, `scope: feature`, `feature: agents`.

```markdown
---
name: post-tool-use-hook-cannot-resolve-worktree-session-json
description: The PostToolUse agents hook (and the reconstructor) resolve session.json from the main-tree cwd, but under the always-worktree model the real session.json lives in the worktree — so agents[] is never populated; both also read final-turn usage instead of cumulative totalTokens.
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

# Hook cannot resolve the worktree's `session.json`; also reads final-turn usage

## Trigger

Session 06668274 (Chat, task 06) spawned 15 subagents (6 executor, 5 evaluator, 2 assistant, 2 leader), yet `session.json.agents[]` held only the 1 manager seed entry at session end. The hook `post-tool-use-agents.sh` IS registered (matcher `Task|Agent` on `PostToolUse` + `PostToolUseFailure`) and IS coded to upsert agents[], but it populated nothing this session. Verified empirically (the live transcript carries all 15 `toolUseResult` payloads; the worktree `session.json` carries 1 entry).

## Root cause (two independent defects)

1. **Worktree-path mismatch.** `post-tool-use-agents.sh` resolves the session dir from its stdin `cwd`: `resolve_project_name`/`resolve_session_dir` scan `$cwd/.gobbi/projects/<name>/sessions/*-<session_id>` (script lines ~81, ~98). Under the always-worktree model the session runs with `cwd` at the MAIN tree (`/playinganalytics/git/gobbi`), but the live `session.json` lives in the WORKTREE (`.../worktrees/chore/session-<date>-<short>/.gobbi/projects/<name>/sessions/...`). The main-tree path for this session's id does not exist, so `resolve_session_dir` returns non-one and the hook `bail`s ("resolver failed (session dir)") with exit 0 — silently, by design (a hook that blocks Claude is worse than a missed entry). Result: no upsert, ever, for worktree sessions.
   - `reconstruct-agents.sh` shares this defect: it resolves from `$(pwd)/.gobbi/projects/...` (script lines ~68-73), same main-tree assumption.

2. **Final-turn usage, not cumulative.** Even when the hook DOES fire (e.g. a direct-mode/main-tree session), it stamps `tokensUsed` from `toolUseResult.usage.*` (lines ~202-207) — the subagent's FINAL-turn breakdown, where `input_tokens` reads ~2 and the bulk is `cache_read`. The cumulative figure is `toolUseResult.totalTokens`, which the hook ignores. So tokens are under-counted by orders of magnitude. `reconstruct-agents.sh` has the same `usage.*`-only read (lines ~154-160). Empirical confirmation: a stale 2026-05-27 session.json in the worktree had 44 agents[] entries (hook fired in that tree) with ALL `tokensUsed` zeroed.

## Proposed fix (code — separate session)

- **Resolver:** teach both scripts to prefer the worktree `session.json`. Options to evaluate: (a) honor the dormant `.gobbi/project.json` resolver step (D-3-3-resolver step (i)) and have the manager write a pointer to the worktree session dir; (b) read `session.json.git.worktreePath` from the main-tree session dir if one exists, or have the manager pass the worktree path via the hook payload/env; (c) search worktrees under `.gobbi/projects/<name>/worktrees/*/.gobbi/projects/<name>/sessions/` for the matching session-id. Pick at code-fix ideation.
- **Tokens:** change both scripts to record `totalTokens` (cumulative), `totalDurationMs`, `totalToolUseCount` from `toolUseResult`, and store `usage.*` under `finalTurnUsage` (labeled final-turn), matching the new `agents[]` schema (schemaVersion 2). See `orchestration/SKILL.md § Workflow Metadata` (reframed session 06668274) for the target shape.

## Interim mitigation (already in place)

Per the reframed `orchestration/SKILL.md § Recording operation metadata`, the **manager** records agent operation metadata via `jq` over the transcript (per-subagent on return + bulk reconcile at MEMORIZATION/Wrap-up). The hook/reconstructor are convenience seeders, not the source of truth — so the missing-tokens defect no longer blocks accurate session telemetry. This backlog tracks repairing the automated path so the manual `jq` step has a working fallback.

## Related

- `features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md` — the existing scenario describing exactly this silent-failure surface (the operator cannot tell "hook ran, no output" from "hook never fired").
- `features/agents/backlogs/schema-extension-agents-status-field.md` — adjacent agents[] schema work.
```

---

## E. Ordered implementation sequence + verification greps

Single executor task (`docs` + template JSON). Sequence within the task:

1. **§A** — Replace `## Workflow Metadata` (H2 → EOF) in `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` with the §A verbatim block.
   - Verify: `grep -n "### Recording operation metadata" .gobbi/projects/gobbi/skills/orchestration/SKILL.md` returns one hit; `grep -c "finalTurnUsage" ...SKILL.md` ≥ 1; the section ends the file (`tail -1` is the `<!-- END REPLACEMENT -->` removed → last line is the hook paragraph).
2. **§B** — Edit `templates/session.template.json` (schemaVersion, agents seed, usage rollup).
   - Verify: `jq -e '.schemaVersion == 2 and (.agents[0]|has("totalTokens") and has("finalTurnUsage") and (has("tokensUsed")|not)) and (.usage|has("manager") and has("subagentsTotalTokens"))' templates/session.template.json` prints `true`.
3. **§C-1..C-4** — Apply the four blast-radius edits.
   - Verify: `grep -rn "tokensUsed" .claude .gobbi/projects/gobbi --include=*.md --include=*.json | grep -v /sessions/ | grep -v /worktrees/` returns ONLY the two code scripts (`post-tool-use-agents.sh`, `reconstruct-agents.sh`) — every `.md`/`.json` doc reference is gone (the scripts are §D, not edited here).
4. **§D** — Create `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` with the §D body.
   - Verify: `test -f` + `jq` is N/A (markdown); confirm frontmatter `type: backlogs`, `feature: agents`.
5. **Symlink check** — `readlink .claude/skills/orchestration/SKILL.md` resolves to the canonical file (no second copy to edit); same for `delegation/SKILL.md`. (Confirmed during planning.)
6. **Anchor integrity** — the new section adds anchor `#recording-operation-metadata` and keeps `#session-metadata`; intra-file links to `#workflow-runtime` (if any) still resolve — `grep -n "#workflow-runtime\|#session-metadata\|#recording-operation-metadata" .gobbi/projects/gobbi/skills/orchestration/SKILL.md`.

---

## F. NOT in scope

- **Hook / reconstructor code fix** — drafted as the §D backlog; the SCRIPT is not edited by this task (locked decision D3).
- **CLI automation of the manager-`jq` stamping** — the procedure is documented as a manager step; wiring it into a command is a future session (consistent with the existing "CLI automation deferred" note in Step 1 row 6).
- **Disabling the hook** — left registered per D3 (open question F-Q3 below).
- **Workflow Status Display rendering of usage** — the status display does not currently surface tokens; adding a usage line is a possible follow-up, not this task.

---

## G. Open questions / risks for the user

`user-question:`
- **F-Q1 — exact new field names.** This plan proposes `agents[].{totalTokens, totalDurationMs, totalToolUseCount, finalTurnUsage:{input,output,cacheRead,cacheCreation}}` and renames the old `tokensUsed` → `finalTurnUsage`. Alternative: keep the name `tokensUsed` for the inner block (less blast-radius churn) but it would be misleading (it is final-turn, not "used"). Recommended: rename to `finalTurnUsage` for accuracy. Confirm the rename, or keep `tokensUsed`?
- **F-Q2 — session-level `usage` rollup.** This plan adds a top-level `usage` object (`manager` main-chain usage + `subagentsTotalTokens` + `computedAt`). D2 said "propose, don't force." Recommended: include it — the manager has no `toolUseResult` of its own, so without this rollup the largest single consumer (the main agent) has no recorded usage at all. Include the `usage` rollup, or drop it and leave manager usage unrecorded?
- **F-Q3 — hook: leave registered or disable.** D3 keeps it registered (harmless; seeds routing fields). Risk: a half-populated entry (routing fields set, tokens zero) could mislead a reader who does not know the manager-`jq` step is the real source. Recommended: leave registered AND have the manager-`jq` bulk reconcile overwrite tokens at MEMORIZATION (so the final state is always correct). Confirm, or disable the hook entirely until the §D code fix lands?
- **F-Q4 — schemaVersion bump.** This plan bumps `schemaVersion` 1→2 because the `agents[]` entry shape changes (field rename + additions) and a top-level `usage` key is added. Solo-user project, no live migration concern — but any code that reads `session.json` by `schemaVersion` should be checked. Confirm the bump (recommended), or keep schemaVersion 1 since there is no migration tooling?

---

## H. Verification evidence (grounding this plan — Principle 7)

Run fresh this session against `$CLAUDE_TRANSCRIPT_PATH` and the worktree `session.json`:

- **15 subagent `toolUseResult` records confirmed**, broken down by `agentType`: 6 executor, 5 evaluator, 2 assistant, 2 leader. Each carries `totalTokens` (e.g. an executor at 76170), `totalDurationMs`, `totalToolUseCount`, and `usage` with `input_tokens: 2` (final-turn; bulk in `cache_read_input_tokens`).
- **The 1-of-15 gap confirmed:** `jq '.agents | length'` on `.../sessions/2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2/session.json` = `1` (only the manager seed). The main-tree path for this session id does not exist (`no matches found`) — the direct evidence for the resolver worktree-path bug.
- **Manager main-chain aggregation works:** fetch (b) over the transcript returned `{turns: 244, input: 36346, output: 563863, cacheRead: 56449515, cacheCreation: 2908747}` — the manager's cumulative usage, available for the `usage.manager` rollup.
- **Hook root cause read from source:** `post-tool-use-agents.sh` resolver scans `$cwd/.gobbi/projects` (lines 81, 98) → worktree mismatch → silent `bail`; token extraction reads `usage.*` (lines 202-207), not `totalTokens`. `reconstruct-agents.sh` shares both (resolver lines 68-73; usage read lines 154-160). A stale 2026-05-27 session.json in the worktree (44 agents, all `tokensUsed` zero) corroborates the final-turn read when the hook does fire.
- **Prior-art reference located:** `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` already documents the `toolUseResult` shape and (incorrectly) maps `tokensUsed ← usage.*` — the C-2 edit corrects it.
