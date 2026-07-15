# Workflow — Metadata (Orchestration)

**Doc kind:** reference-orchestration.

The per-session `session.json` schema and the token-recording model: the session frame, `workflow.{step}` routing, the `agents[]` / `usage` fields, the integration-count value telemetry, and the teammate-aware accounting for Agent Teams. Loaded by the manager, which writes the session frame while the runtime hooks write the token fields.

---

## Workflow Metadata

The manager records session-level operation metadata in a per-session `session.json`: the session frame
(identity, targeting, environment, git context) plus the runtime record of every step and every spawned
agent. The per-agent record answers one question — **how many tokens did each agent use** (keyed by its
subagent-id and role) — for monitoring and after-the-fact token-budget analysis. It MUST be recorded as the
session runs.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](../templates/session.template.json) |

### Recording workflow metadata

Token recording is **runtime-specific**. In Claude Code, token recording is hook-driven. In native Codex, use the Codex rollout / metadata path when available and tolerate missing per-agent detail until Gobbi adds full Codex metadata parity.

Claude Code uses two hooks to write `agents[].tokensUsed` + `usage.*`,
each reading from a complete transcript:

- **PostToolUse hook** ([`post-tool-use-agents.sh`](../../../../../../.claude/hooks/post-tool-use-agents.sh), matcher
  `Task\|Agent`) — fires after each subagent returns. It seeds that subagent's `agents[]` entry **best-effort**
  from that agent's OWN complete transcript at `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`
  (`<agentId>` is the short `toolUseResult.agentId`, e.g. `a7363717821bc156d`, also the file stem;
  `isSidechain: true`). "Best-effort" = cumulative from that agent's own transcript at the moment it returned —
  correct for a single-turn agent, but not guaranteed final for a continued one.
- **SessionEnd hook** ([`session-end.sh`](../../../../../../.claude/hooks/session-end.sh)) — fires once at session
  termination, runs LAST after every transcript is complete, and is the **single authoritative writer** of
  cumulative `agents[].tokensUsed` totals and `usage.*`. It invokes
  [`reconcile-session-metadata.sh`](../scripts/reconcile-session-metadata.sh), which reconciles every entry from its
  own complete subagent transcript, computes the **manager rollup** (`agents[0].tokensUsed` summed from the main
  transcript `$CLAUDE_TRANSCRIPT_PATH`, `isSidechain == false`), captures codex tokens, and recomputes
  `usage.sessionTotal` + `usage.codex` + `usage.grandTotal` + `usage.computedAt`.

**Authority rule.** In Claude Code, SessionEnd is the single authoritative writer of `agents[].tokensUsed` cumulative totals and
`usage.*`; PostToolUse seeds each subagent entry best-effort from that agent's own complete transcript; SessionEnd
runs last and reconciles from the complete transcripts (the correctness guarantee). Not-fired degraded path: if
SessionEnd does not fire, values are the PostToolUse best-effort (still cumulative-from-own-transcript, not
final-turn).

**Native Codex degraded path.** Native Codex sessions use `CODEX_THREAD_ID` for identity and the rollout path from `~/.codex/state_5.sqlite` for audit when discoverable. Gobbi hook scripts are Codex-safe, but they do not yet seed Codex custom-agent entries with the same fidelity as Claude Code `Task` / `Agent` hooks. Do not treat missing Claude hook metadata as a native Codex bootstrap failure.

**Field reference.**

| Key | Shape |
|---|---|
| `workflow.{step}` | Per step (same keys as `state.json` / `settings.json`). Configuration carries `startedAt` / `finishedAt` only; steps 2-6 add `iter` (final loop count) + `verdict` (`pass` \| `fail` \| `skipped`). |
| `workflow.{loop}.integration` | <ul><li>Per-step **value telemetry** — one object per productive loop (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`); absent on `configuration` and `chat`. Seeded all-`0` by the template.</li><li>Four counts: `changing_rows`, `kept_own_rows`, `total_rows`, `escalated_rows` — derived from the loop's dual-system integration log (`reconciliation-iter{n}.md`) by the count rule below.</li><li>Measures how much the Codex proposal moved the canonical artifact: it answers "did the dual run add value?" (D4.1 — distinguish "Codex added nothing" from an escalation-only loop) and feeds the two-consecutive-no-value → single-mode-candidate signal (D1.6).</li><li>`execution` additionally carries `tasks: []` — one element per task: `{ taskNo, slug, iter, changing_rows, kept_own_rows, total_rows, escalated_rows }` (`taskNo` + `slug` identify the task, `iter` is the task's final loop count, then the four counts; D4.3 per-task value). The loop-level four counts are the SUM over `tasks[]` of each count (the roll-up invariant — see [`record/SKILL.md` § Value-telemetry integration counts](../../record/SKILL.md#value-telemetry-integration-counts)).</li><li>A `single`-mode loop runs Claude-only — no Codex proposal, no `reconciliation-iter{n}.md` — so its counts stay seeded `0`.</li></ul> |
| `workflow.chat.tasks[]` | <ul><li>Chat sessions only (`settings.mode == "chat"`; empty for Auto).</li><li>One entry per task slice: `taskNo`, `slug`, `startedAt`, `finishedAt`.</li><li>Per-loop sub-records `ideation` / `preparation` / `planning` / `execution` — same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as `workflow.{step}`.</li><li>`taskRecord: { path, writtenAt }`.</li><li>`preparation` defaults to `state: "Skipped"`.</li><li>Present in both `state.json` (the live state-machine projection, R3) and `session.json` (archives the final iter + verdict per slice, R2).</li><li>Both mode state templates (`templates/state.auto.json` / `templates/state.chat.json`) and `templates/session.template.json` seed `workflow.chat: { tasks: [] }`; Auto sessions seed the empty array from `state.auto.json` and leave it empty.</li></ul> |
| `agents[]` | <ul><li>Flat array, one entry per spawn, **manager as `agents[0]`** (template ships the manager seed, `tokensUsed` zeroed).</li><li>Identity: `id` (short `agentId`; manager = own session id), `name`, `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`) = the ROLE, `kind` (`manager` \| `subagent` \| `teammate`) = the SPAWN MECHANISM, `model`, `system`, `transcriptPath` (THIS agent's transcript), `teammateName` (the Agent-Teams `members[].name`; `null` for a plain subagent).</li><li>Routing: `step`, `phase` (`null` for the manager entry), `iter` (`null` for Configuration + manager), `sub_step` (`null` if single). For a CONTINUED agent (multiple turns under one `id`), these top-level routing fields hold the LATEST turn; the full per-turn history lives in `turns[]`.</li><li>Continuation: `continuationOf` (`id` of the predecessor entry this re-primed agent continues, e.g. after `/compact` killed the in-process teammate; `null` if not a continuation), `turns[]` (one object per continuation turn: `{ step, phase, iter, sub_step, tokensUsed, startedAt, finishedAt }`) so a continued agent's per-turn routing is preserved instead of clobbered by the upsert-by-`id`.</li><li>Lifecycle: `status` (`ok` \| `failed`), `startedAt`, `finishedAt`.</li><li>Back-compat: `kind` / `teammateName` / `continuationOf` / `turns` are additive and optional — an entry written before this schema (or by the unmodified hook) omits them; readers treat absent `kind` as `subagent`, absent `turns` as `[]`, absent `continuationOf` as `null`.</li></ul> |
| `agents[].tokensUsed` | `{input, output, cacheRead, cacheCreation, total}` — **cumulative** across ALL of this agent's turns, from THIS agent's own transcript. `total = input + output + cacheRead + cacheCreation`. |
| `usage` | <ul><li>`usage.sessionTotal` = sum of every `agents[].tokensUsed.total` (Claude-system agents).</li><li>`usage.codex` = `{input, output, cacheRead, cacheCreation, total}` for the external Codex system; only `total` is known from the Codex stdout / rollout, the breakdown stays `0` unless already populated (D6).</li><li>`usage.grandTotal` = `usage.sessionTotal + usage.codex.total` — the cross-system total (D6).</li><li>`usage.computedAt` = ISO timestamp of the last rollup.</li></ul> |

**Integration-count rule (value telemetry).** RECORD parses the loop's dual-system integration log
`sessions/.../{N}-{loop}/working/reconciliation-iter{n}.md` (Execution: the per-task
`4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md`) and counts its decision column:

- `total_rows` — every data row in the delta table (the integration decisions made this loop).
- `changing_rows` — rows whose decision is `took-codex` **or** `merged-selective` (the Codex proposal changed the canonical artifact).
- `kept_own_rows` — rows whose decision is `kept-own` (the producer kept its own element; Codex added nothing here).
- `escalated_rows` — rows whose decision is `escalated` (a LARGE gap surfaced to the user, not self-decided).

RECORD writes the four counts into `session.json.workflow.{loop}.integration`; for Execution it also appends the
per-task `{ taskNo, slug, ...counts }` element to `workflow.execution.integration.tasks[]`. A `single`-mode loop has
no `reconciliation-iter{n}.md`, so its counts stay seeded `0`. Worked example: an integration log with 16 rows split
`took-codex 4 / merged-selective 9 / kept-own 2 / escalated 1` yields `changing_rows: 13`, `kept_own_rows: 2`,
`total_rows: 16`, `escalated_rows: 1`.

**Procedure — when / who / how.** The manager writes the session *frame* (identity, git, `workflow.{step}`
routing); the *token* fields (`agents[].tokensUsed`, `usage.*`) are written by the two hooks per the Authority
rule above. The one token-write the manager still owns is a continued **teammate** turn — a teammate is not a
`Task`/`Agent` result, so no PostToolUse fires for it (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)).

| When | Who | What is written |
|---|---|---|
| Session start (Configuration) | manager | Frame: identity + targeting + environment + `startedAt` + `git` (from settings). Manager seed: fill `agents[0]` (`type: "manager"`) — `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`; `tokensUsed` stays zeroed until a hook rollup. |
| Worktree creation | manager | `git.branch` + `git.worktreePath`. |
| PR opened | manager | `git.pr` (stays `null` until then — including while a PR is deferred for missing `gh`). |
| Each step transition / loop close / step exit | manager | `workflow.{step}.startedAt` / `finishedAt`; `iter` (steps 2-6); `verdict` (steps 2-6). For Chat: the matching `workflow.chat.tasks[]` sub-records. |
| Each subagent return (immediate) | PostToolUse hook | Seeds the just-returned subagent's `agents[]` entry **best-effort** by `id`, summing `tokensUsed` from that agent's OWN complete transcript. This is the `Task`/`Agent`-hook path; it does NOT fire for a teammate turn (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)). The seed is reconciled at SessionEnd — it is not the final value. |
| Each teammate continuation turn | manager | A continued teammate is not a `Task`/`Agent` result, so the PostToolUse hook does not capture it: the manager appends a `turns[]` record (`step`/`phase`/`iter`/`sub_step` + that turn's `tokensUsed`/timestamps), sets the top-level routing to the latest turn, and sets `continuationOf` on a re-primed entry. The plain upsert-by-`id` alone would clobber per-turn routing — see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams). |
| Session end (authoritative reconcile) | SessionEnd hook | Runs LAST, after every transcript is complete. The **single authoritative writer** of cumulative `agents[].tokensUsed` + `usage.*`: re-reconciles every `agents[]` entry from its own complete transcript, refreshes `agents[0]` (manager rollup) from the main transcript, captures codex tokens, and recomputes `usage.sessionTotal` + `usage.codex` + `usage.grandTotal` + `usage.computedAt`. It is the correctness guarantee the PostToolUse seed is reconciled against. |
| RECORD / Wrap-up (optional safety net) | manager (invokes script) | The same reconcile may be run mid-session as an idempotent safety net — it does NOT replace SessionEnd, which always runs last. The parent-transcript enumeration covers only `Task`/`Agent` subagents — a teammate session is reconciled separately from its OWN transcript (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)). |
| Session end | manager | `finishedAt` (top-level). |

Packaged as composable scripts in [`scripts/`](../scripts/):

- [`agent-token-usage.sh`](../scripts/agent-token-usage.sh): cumulative `tokensUsed` for one transcript (`--main` for the manager rollup from the main transcript).
- [`reconcile-session-metadata.sh`](../scripts/reconcile-session-metadata.sh): bulk reconcile — enumerate → per-agent sum → manager rollup → upsert `agents[]` → recompute `usage.sessionTotal` / `usage.codex` / `usage.grandTotal` (atomic, under `flock`); idempotent. Invoked by the **SessionEnd hook** as the authoritative pass; may also be run at RECORD / Wrap-up as a safety net. This script reads ONLY the parent transcript's `subagents/` directory — it does NOT see teammate sessions (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)).

### Teammate-aware metadata (Agent Teams)

The continuation design (`orchestration/delegation.md` § Continue vs Fresh) lets the manager continue the same
leader / executor / assistant as an **Agent-Teams teammate** instead of always spawning fresh. A teammate is NOT a plain
`Task`/`Agent` subagent: it is a **separate, persistent Claude Code session** addressed by name via
`SendMessage`. That difference breaks three assumptions the rollup above is built on, so the metadata model
MUST be teammate-aware. Without it, a continued teammate chain's turns and tokens are invisible — the audit
trail is incomplete and the **F4** cost gate measures the wrong baseline.

**Discovery — find teammates via the team config, not the spawn list.** The parent transcript's `Task`/`Agent`
spawn list does NOT enumerate teammate turns. The manager finds the teammates that participated by reading
the team config `members` array at `~/.claude/teams/{team-name}/config.json` — each member carries
`name` / `agentId` / `agentType`. That `agentId` is the key for the teammate's `agents[]` entry; `name` is
stored as `teammateName`.

**Transcript ownership / location — read from the teammate's OWN session.** Each teammate has its own session
transcript. It is NOT a file under the parent's `${main_transcript%.jsonl}/subagents/` directory (that
directory holds only `Task`/`Agent` sidechain transcripts, `agent-<agentId>.jsonl`). A teammate's turns and
`tokensUsed` are read from the teammate's own session transcript, resolved from its `agentId` via the team
config / the teammate session's `transcriptPath`. Store that path in the entry's `transcriptPath`.

**Token accounting — the rollup MUST include teammate sessions.** `usage.sessionTotal` and the F4 measurement
sum `agents[].tokensUsed.total` across ALL entries, including teammate entries reconciled from their own
sessions. A rollup that counts only the parent `session.json.agents[]` `Task`/`Agent` sums is INVALID — a
continued teammate chain's tokens would be missing, and continuation could show a false cost win.

**Relation to the `Task`/`Agent` hook.** `.claude/hooks/post-tool-use-agents.sh` fires on `Task|Agent` tool
results and upserts `agents[]` by `id` (upsert block ~lines 222–235, last-write-wins). A teammate continuation
is NOT a `Task`/`Agent` tool result in the parent transcript, so the hook does NOT capture it. Two consequences:

- **Teammate turns are captured by the manager, not the hook.** For each teammate turn the manager appends a
  `turns[]` record on that teammate's `agents[]` entry (keyed by `agentId`) and the Wrap-up reconcile re-sums
  `tokensUsed` from the teammate's own session transcript discovered via the `members` array.
- **The upsert-by-`id` would clobber per-turn routing.** Even for a `Task`/`Agent` continuation that reuses one
  `id`, the hook's last-write-wins upsert overwrites the prior turn's `step`/`phase`/`iter`/`sub_step`. The
  `turns[]` sub-array + `continuationOf` pointer preserve per-turn routing instead of collapsing N turns into
  one lossy entry. `continuationOf` links a re-primed entry to its predecessor when a new `id` is issued.

**Resume / rewind non-survival.** In-process teammates are NOT restored by `/resume` or `/rewind`. A continued
teammate chain therefore cannot promise resume-survival: after `/compact`, `/clear`, or resume, the manager
spawns a FRESH agent re-primed from durable session record and records it as a new entry with `continuationOf`
pointing at the dead predecessor — never as a silent re-use of the gone teammate.

**F4 cost-measurement criterion (teammate-aware).** A continued-agent run MUST show lower cumulative
re-read / token cost than the equivalent fresh-spawn baseline, measured via a `tokensUsed` rollup that
**includes teammate-session token usage**. Because a teammate is a separate session whose tokens are NOT in
the parent `subagents/` rollup, an F4 comparison that omits teammate sessions measures the wrong thing and can
hand a false win to a chain that actually costs more.
