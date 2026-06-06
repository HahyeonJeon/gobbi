---
artifact_type: plan
title: Workflow Metadata section compact redesign + fetch scripts
session: 06668274-cee3-4bc0-9125-91a327467cd2
created: 2026-06-06
status: ready-for-execution
scope: |
  Redesign the `## Workflow Metadata` section of orchestration/SKILL.md (lines 297-391)
  to be more compact, AND create two real fetch scripts under skills/orchestration/scripts/.
  PLAN/DRAFT only — the executor edits the section + creates+chmods+run-verifies the scripts.
---

# Workflow Metadata — compact redesign + fetch scripts (plan)

## 0. Spec + CRUD (Iron Law 6/13)

**SPEC.** Two coupled deliverables, one trigger (user request, Chat session 06668274 task 07):
1. Rewrite `## Workflow Metadata` (orchestration/SKILL.md:297-391 → EOF) — compact: proper table column
   headers, no filler meta-prose, `### Session metadata` removed (its git-stamp **timing** folded into the
   merged procedure), `### Workflow runtime` + `### Recording operation metadata` merged into ONE H3.
2. Create `skills/orchestration/scripts/{agent-token-usage.sh,reconcile-session-metadata.sh}` — a composable
   per-agent fetch unit + a top-level reconcile orchestrator, grounded on the task-06 verified fetch logic.

**Memory types touched.** orchestration/SKILL.md = workflow-governor skill doc (canonical under
`.gobbi/projects/gobbi/skills/orchestration/`, mirror-symlinked into `.claude/skills/`). The two scripts =
executable helpers co-located with that skill. delegation/SKILL.md = sibling skill doc (one inbound link to repoint).

**CRUD plan (file / line granularity).**
- **Read (verbatim source — Iron Law: copy preserved text from the LIVE file, never reconstruct):**
  - `skills/orchestration/SKILL.md:297-391` (the section to replace) — already read in full at plan time; §A below is the drop-in.
  - `skills/orchestration/templates/session.template.json` (schemaVersion 2 — agents[] + usage shapes).
  - `hooks/post-tool-use-agents.sh` (flock + atomic-mv pattern to mirror — §B reconcile script copies this shape).
- **Create:**
  - `skills/orchestration/scripts/agent-token-usage.sh` (§B.1).
  - `skills/orchestration/scripts/reconcile-session-metadata.sh` (§B.2).
  - (executor: `chmod +x` both; mirror-symlink follow-up — see §E open question Q4.)
- **Update:**
  - `skills/orchestration/SKILL.md:297-391` → replace verbatim with §A (the new section, H2 name unchanged).
  - `skills/delegation/SKILL.md:213` → repoint the one `#recording-operation-metadata` anchor to the new H3
    anchor `#recording-workflow-metadata` (§C).
- **Delete:** none (no physical deletes). The `### Session metadata` and `### Workflow runtime` headings are
  removed as part of the §A verbatim replacement — that is content replacement, not a file delete.

**Blast-radius note (Iron Law 13).** The whole-section replacement carries preserved-content risk
(see mistake `verbatim-section-replacement-must-copy-preserved-parts-from-live-file`). The new
section §A below is authored by copying every retained fact from the CURRENT 297-391 (read this session),
NOT from any earlier draft. The executor MUST still `git diff HEAD` after the edit and confirm no
out-of-scope deletions (esp. the already-applied always-worktree language + fixed relative links).

---

## 1. Scope reference

- **Project / Feature / Task:** gobbi / orchestration-docs / "compact the Workflow Metadata section + add real fetch scripts".
- **Locked decisions (user, this session):**
  - D1 — First table: drop `Writer` + `Reader` rows; keep only `Location` + `Initial template`; give the table content-appropriate column headers (not `Field | Value`).
  - D2 — Remove reader-unnecessary meta-text (e.g. the "This section documents the fields, then the recording procedure…" sentence) and other filler.
  - D3 — Remove `### Session metadata` (template self-documents the fields) BUT fold the git-field stamp-timing into the merged procedure (worktree creation → `git.branch`/`git.worktreePath`; PR opened → `git.pr`; session end → `finishedAt`). Do not lose the timing.
  - D4 — Merge `### Workflow runtime` + `### Recording operation metadata` into ONE H3 (compact: tables + bulleted lists).
  - D5 — Create a composable script SET: a per-agent fetch unit + a top-level reconcile orchestrator, under `skills/orchestration/scripts/`.
- **Merged H3 name (chosen):** `### Recording workflow metadata` → anchor `#recording-workflow-metadata`.
  Rationale: "recording" keeps continuity with the retired `### Recording operation metadata` (minimal inbound-link churn,
  one repoint); "workflow metadata" matches the H2 and the actual content (the section now records workflow + agents + usage,
  not just "operation" metadata). Plain, literal, names its subject (Iron Law 7).

---

## 2. File map

| File | Op | Responsibility |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (lines 297-391) | modify | Replace the whole `## Workflow Metadata` section with §A drop-in (H2 name unchanged; one merged H3) |
| `.gobbi/projects/gobbi/skills/orchestration/scripts/agent-token-usage.sh` | create | Per-agent cumulative-tokens fetch unit (one transcript → `{input,output,cacheRead,cacheCreation,total}` JSON) |
| `.gobbi/projects/gobbi/skills/orchestration/scripts/reconcile-session-metadata.sh` | create | Reconcile orchestrator (enumerate spawns → per-agent tokens → manager tokens → upsert agents[] → recompute usage → atomic write) |
| `.gobbi/projects/gobbi/skills/delegation/SKILL.md` (line 213) | modify | Repoint `#recording-operation-metadata` → `#recording-workflow-metadata` |

> Path note: edit the CANONICAL files under `.gobbi/projects/gobbi/skills/...` (the `.claude/skills/...` paths are mirror symlinks; editing canonical updates both). New scripts dir `scripts/` is created under the canonical orchestration skill.

---

## §A — New `## Workflow Metadata` section (verbatim drop-in for lines 297-391)

> The executor replaces lines 297-391 (`## Workflow Metadata` heading through EOF) with EXACTLY the block
> between the BEGIN/END markers below. The H2 line `## Workflow Metadata` is preserved (chat-mode.md:569 links
> to it by name). All retained facts copied from the current 297-391 read this session.

<!-- BEGIN DROP-IN (do not include this comment line) -->

```markdown
## Workflow Metadata

The manager records session-level operation metadata in a per-session `session.json`: the session frame
(identity, targeting, environment, git context) plus the runtime record of every step and every spawned
agent. The per-agent record answers one question — **how many tokens did each agent use** (keyed by its
subagent-id and role) — for monitoring and after-the-fact token-budget analysis. It MUST be recorded as the
session runs.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](templates/session.template.json) |

The file has two parts. **Session frame** — `schemaVersion`, `sessionId`, `previousSessionId`, targeting
(`project` / `feature` / `task`), `system`, `startedAt` / `finishedAt`, `transcriptPath` (tilde-form of
`$CLAUDE_TRANSCRIPT_PATH`, `$HOME`→`~/`; `null` if absent), and the `git` block (`repo`, `baseBranch`,
`branch`, `worktreePath`, `issue`, `pr`). The template self-documents these fields; their stamp **timing**
is in the procedure below. **Runtime** — `workflow` (per-step), `agents` (per-spawn, manager included), and
`usage` (session total), appended as the session runs.

### Recording workflow metadata

The **source of truth for tokens is the manager running `jq` over each agent's own transcript** — NOT the
PostToolUse hook, and NOT the parent `toolUseResult`. Each agent has its own transcript carrying its full
per-turn history:

- **Subagents:** `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl` — `<agentId>` is the
  short `toolUseResult.agentId` (e.g. `a7363717821bc156d`), which is also the file stem (`isSidechain: true`).
- **Manager (main agent):** the main transcript `$CLAUDE_TRANSCRIPT_PATH`, filtering `isSidechain == false`.

The parent transcript is used ONLY to **enumerate** spawns (their `agentId`, `agentType`/role, `tool_use_id`);
the token numbers come from each agent's own transcript. (`toolUseResult.totalTokens` is a different, smaller
metric — do not use; `toolUseResult.usage` is final-turn only — do not use.) Empirical shape reference:
[`features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`](../../features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md).

**Field reference.**

| Key | Shape |
|---|---|
| `workflow.{step}` | Per step (same keys as `state.json` / `settings.json`). Configuration carries `startedAt` / `finishedAt` only; steps 2-6 add `iter` (final loop count) + `verdict` (`pass` \| `fail` \| `skipped`). |
| `workflow.chat.tasks[]` | Chat sessions only (`settings.mode == "chat"`; empty for Auto). One entry per task slice: `taskNo`, `slug`, `startedAt`, `finishedAt`, per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as `workflow.{step}`), and `taskRecord: { path, writtenAt }`. `preparation` defaults to `state: "Skipped"`. |
| `agents[]` | Flat array, one entry per spawn, **manager as `agents[0]`** (template ships the manager seed, `tokensUsed` zeroed). Identity/routing: `id` (short `agentId`; manager = own session id), `name`, `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`), `step`, `phase` (`null` for the manager entry), `iter` (`null` for Configuration + manager), `sub_step` (`null` if single), `model`, `system`, `transcriptPath` (THIS agent's transcript), `status` (`ok` \| `failed`), `startedAt`, `finishedAt`. |
| `agents[].tokensUsed` | `{input, output, cacheRead, cacheCreation, total}` — **cumulative** across ALL of this agent's turns, from THIS agent's own transcript. `total = input + output + cacheRead + cacheCreation`. |
| `usage` | `usage.sessionTotal` = sum of every `agents[].tokensUsed.total`; `usage.computedAt` = ISO timestamp of the last rollup. |

**Procedure — when / who / how.** The manager owns all writes.

| When | What is written |
|---|---|
| Session start (Configuration) | Frame: identity + targeting + environment + `startedAt` + `git` (from settings). Manager seed: fill `agents[0]` (`type: "manager"`) — `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`; `tokensUsed` stays zeroed until a rollup. |
| Worktree creation | `git.branch` + `git.worktreePath`. |
| PR opened | `git.pr` (stays `null` until then — including while a PR is deferred for missing `gh`). |
| Each step transition / loop close / step exit | `workflow.{step}.startedAt` / `finishedAt`; `iter` (steps 2-6); `verdict` (steps 2-6). For Chat: the matching `workflow.chat.tasks[]` sub-records. |
| Each subagent return (immediate) | Enumerate the just-returned spawn from the parent transcript by `tool_use_id` (fetch **(a)**); sum its `tokensUsed` from its own transcript (fetch **(b)**); upsert the matching `agents[]` entry by `id`. |
| MEMORIZATION (per iter) + Wrap-up (bulk reconcile, idempotent safety net) | Re-enumerate all spawns (fetch **(a)**, no `tool_use_id` filter); re-sum each agent's own transcript (fetch **(b)**); refresh `agents[0]` (manager) from the main transcript (fetch **(c)**); upsert every entry by `id` (last write wins); recompute `usage.sessionTotal` + stamp `usage.computedAt`. |
| Session end | `finishedAt` (top-level). |

These fetches are packaged as composable scripts in
[`scripts/`](scripts/): [`agent-token-usage.sh`](scripts/agent-token-usage.sh) computes one transcript's
cumulative `tokensUsed`; [`reconcile-session-metadata.sh`](scripts/reconcile-session-metadata.sh) is the
bulk-reconcile orchestrator (enumerate → per-agent sum → manager sum → upsert `agents[]` → recompute `usage`,
written atomically under `flock`). Run the reconciler at MEMORIZATION and Wrap-up; it is idempotent.

Fetch **(a) — enumerate spawns** from the parent transcript (drop the `--arg tuid` / `select` line for the
bulk variant). The `type=="object"` guard is required because one transcript line carries `toolUseResult` as a string:

```bash
jq -rc --arg tuid "$TOOL_USE_ID" '
  select((.toolUseResult | type == "object") and .toolUseResult.agentId != null)
  | select((.message.content[0].tool_use_id // "") == $tuid)
  | { id: .toolUseResult.agentId, type: .toolUseResult.agentType,
      tool_use_id: .message.content[0].tool_use_id }
' "$CLAUDE_TRANSCRIPT_PATH"
```

Fetch **(b) — a subagent's cumulative `tokensUsed`** from its OWN transcript (point `$AGENT_TRANSCRIPT` at
`${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`):

```bash
jq -s '[ .[] | select(.type == "assistant") | .message.usage ]
  | { input:         (map(.input_tokens                // 0) | add),
      output:        (map(.output_tokens               // 0) | add),
      cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
      cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
  | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
' "$AGENT_TRANSCRIPT"
```

Fetch **(c) — the manager's cumulative `tokensUsed`** — the same sum over the MAIN transcript, adding
`and .isSidechain == false` (the main transcript also holds subagents' sidechain turns):

```bash
jq -s '[ .[] | select(.type == "assistant" and .isSidechain == false) | .message.usage ]
  | { input:         (map(.input_tokens                // 0) | add),
      output:        (map(.output_tokens               // 0) | add),
      cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
      cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
  | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
' "$CLAUDE_TRANSCRIPT_PATH"
```

**The hook's limited role.** `post-tool-use-agents.sh` (matcher `Task|Agent` on `PostToolUse` +
`PostToolUseFailure`) reads the delegation prompt's structured headers (`Your phase:` / `Your iteration:` /
`Your sub-step:` / `Your step:`, owned by [`delegation/SKILL.md` § Hook Integration](../delegation/SKILL.md#hook-integration))
and may seed an entry's routing fields. It is NOT the token source of truth: under the always-worktree model
its resolver scans the main-tree `cwd` where the worktree `session.json` does not exist (so the upsert is often
skipped), and even when it fires it reads the parent `usage` (final turn) from the wrong file. The convenience
reconstructor [`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh)
shares both limits. Both are tracked for repair in
[`features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`](../../features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md).
```

<!-- END DROP-IN -->

**§A authoring notes (for the executor — NOT part of the drop-in):**
- The H2 `## Workflow Metadata` line is line 297 today; keep it identical so `chat-mode.md:569`'s
  `§ Workflow Metadata` link survives. `workflow.chat.tasks[]` is still documented (field-reference table) so
  that link's referent is intact.
- Removed filler vs. current: the "This section documents the fields, then the recording procedure…" sentence
  (current line 299 tail); the "The file divides into two conceptual sections… Each is documented separately
  below; the recording procedure follows." sentence (current line 308); the `Writer` + `Reader` rows (current
  305-306). The first table header is now `Item | Value` (content-appropriate: a label + its value) — NOT the
  ambiguous `Field | Value`. The field-reference table header is `Key | Shape`. The procedure table header is
  `When | What is written`.
- All three `jq` fetch blocks are copied verbatim from current 358-389 (re-verified live this session — see §D).
- The git-stamp timing (D3) is folded into the procedure's `When` rows (worktree creation / PR opened / session
  end), so no timing is lost despite `### Session metadata` removal.
- The internal `#recording-operation-metadata` self-links in the current section (305, 331, 332) are gone —
  the new section either inlines the procedure or links the new H3 by context, so no stale internal anchors remain.

---

## §B — Script reference implementations + exact paths

> The executor creates these two files VERBATIM, then `chmod +x` both, then run-verifies per §D.
> Both: `set -uo pipefail`; usage/help on bad args; graceful bail (stderr + nonzero) on missing transcript;
> jq-only logic (no `sh`-breaking bashisms in the jq pipelines); header comment block.

### §B.1 — `skills/orchestration/scripts/agent-token-usage.sh`

```bash
#!/usr/bin/env bash
# agent-token-usage.sh — cumulative token usage for ONE agent transcript.
#
# Purpose:
#   Sum an agent's per-turn token usage across its OWN transcript and print the
#   {input, output, cacheRead, cacheCreation, total} object that becomes an
#   `agents[].tokensUsed` entry in session.json. This is the source-of-truth
#   fetch (orchestration/SKILL.md § Recording workflow metadata, fetch (b)/(c)).
#
# Args:
#   $1  <agent-transcript-path>  Path to the transcript .jsonl to sum.
#                                 - Subagent: ${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl
#                                 - Manager:  the main transcript $CLAUDE_TRANSCRIPT_PATH (pass --main)
#   --main                       Also filter `.isSidechain == false`. Use ONLY for the
#                                 main transcript, where subagent sidechain turns are interleaved
#                                 with the manager's own turns. Omit for a subagent file
#                                 (a subagent transcript holds only that agent's turns).
#
# Output (stdout): one JSON object, e.g.
#   {"input":4954,"output":26469,"cacheRead":6867697,"cacheCreation":241592,"total":7140712}
#
# Example:
#   ./agent-token-usage.sh "${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-a7363717821bc156d.jsonl"
#   ./agent-token-usage.sh --main "$CLAUDE_TRANSCRIPT_PATH"
#
# Exit: 0 on success; 2 on bad args / missing file (message to stderr).

set -uo pipefail

usage() {
    cat >&2 <<'EOF'
usage: agent-token-usage.sh [--main] <agent-transcript-path>
  Prints cumulative {input,output,cacheRead,cacheCreation,total} for one transcript.
  --main : also filter `.isSidechain == false` (use for the main/manager transcript).
EOF
}

main_filter=""
transcript=""
for arg in "$@"; do
    case "$arg" in
        --main) main_filter=" and .isSidechain == false" ;;
        -h|--help) usage; exit 0 ;;
        -*) printf 'agent-token-usage.sh: unknown option: %s\n' "$arg" >&2; usage; exit 2 ;;
        *) transcript="$arg" ;;
    esac
done

[ -n "$transcript" ] || { printf 'agent-token-usage.sh: missing <agent-transcript-path>\n' >&2; usage; exit 2; }
[ -f "$transcript" ] || { printf 'agent-token-usage.sh: transcript not found: %s\n' "$transcript" >&2; exit 2; }

jq -s --arg mf "$main_filter" '
    [ .[] | select(.type == "assistant") | select(.isSidechain != true or ($mf == "")) ]
    | .  # placeholder kept literal below
' /dev/null >/dev/null 2>&1 || true   # no-op guard; real pipeline follows

# Real pipeline. The --main flag selects whether to constrain to isSidechain==false.
if [ -n "$main_filter" ]; then
    jq -s '[ .[] | select(.type == "assistant" and .isSidechain == false) | .message.usage ]
      | { input:         (map(.input_tokens                // 0) | add),
          output:        (map(.output_tokens               // 0) | add),
          cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
          cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
      | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
    ' "$transcript"
else
    jq -s '[ .[] | select(.type == "assistant") | .message.usage ]
      | { input:         (map(.input_tokens                // 0) | add),
          output:        (map(.output_tokens               // 0) | add),
          cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
          cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
      | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
    ' "$transcript"
fi
```

> **Executor cleanup note (§B.1):** the `jq -s --arg mf … /dev/null` line above is a stray no-op guard left
> from drafting — DELETE it when creating the file (it adds nothing). The real logic is the `if [ -n "$main_filter" ]`
> branch. Keeping the two explicit `jq` branches (rather than string-splicing the filter into one pipeline) keeps
> the jq programs literal and `sh`-safe, at the cost of a little duplication — acceptable for a small unit.

### §B.2 — `skills/orchestration/scripts/reconcile-session-metadata.sh`

```bash
#!/usr/bin/env bash
# reconcile-session-metadata.sh — bulk-reconcile agents[] + usage in session.json.
#
# Purpose:
#   The MEMORIZATION / Wrap-up safety net (orchestration/SKILL.md § Recording workflow
#   metadata, "bulk reconcile" row). Enumerates every spawn from the main transcript,
#   computes each agent's cumulative tokensUsed from its OWN transcript, computes the
#   manager's tokensUsed from the main transcript, upserts every agents[] entry by `id`
#   (idempotent, last-write-wins), recomputes usage.sessionTotal + usage.computedAt,
#   and writes session.json back atomically under flock (mirrors post-tool-use-agents.sh).
#
# Args:
#   $1  <session.json>      Path to the session.json to update in place.
#   $2  <main-transcript>   The main/manager transcript .jsonl ($CLAUDE_TRANSCRIPT_PATH).
#
# Derived:
#   subagent transcripts live at ${main-transcript%.jsonl}/subagents/agent-<agentId>.jsonl
#
# Output (stderr): a one-line summary; (stdout) nothing on success.
# Exit: 0 on success; 2 on bad args / missing inputs; 3 on jq/write failure.
#
# Example:
#   ./reconcile-session-metadata.sh \
#       .gobbi/projects/gobbi/sessions/2026-06-05-06668274-.../session.json \
#       "$CLAUDE_TRANSCRIPT_PATH"

set -uo pipefail

SELF="reconcile-session-metadata.sh"
log()  { printf '%s: %s\n' "$SELF" "$*" >&2; }
die()  { log "$*"; exit "${2:-2}"; }

usage() {
    cat >&2 <<'EOF'
usage: reconcile-session-metadata.sh <session.json> <main-transcript>
  Reconciles agents[].tokensUsed + usage from the live transcripts. Idempotent.
EOF
}

[ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ] && { usage; exit 0; }
session_json="${1:-}"
main_transcript="${2:-}"
[ -n "$session_json" ] && [ -n "$main_transcript" ] || { usage; die "missing args"; }
[ -f "$session_json" ]    || die "session.json not found: $session_json"
[ -f "$main_transcript" ] || die "main transcript not found: $main_transcript"

subagents_dir="${main_transcript%.jsonl}/subagents"
script_dir="$(cd "$(dirname "$0")" && pwd)"
unit="$script_dir/agent-token-usage.sh"
[ -x "$unit" ] || die "unit script not executable: $unit" 2

now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# 1) Enumerate spawns from the main transcript (fetch (a), bulk variant).
#    De-dup by id (last line wins per id is fine; we only need identity/role here).
spawns="$(jq -rc '
    select((.toolUseResult | type == "object") and .toolUseResult.agentId != null)
    | { id: .toolUseResult.agentId, type: .toolUseResult.agentType,
        tool_use_id: (.message.content[0].tool_use_id // null) }
' "$main_transcript" 2>/dev/null | jq -rc -s 'unique_by(.id) | .[]')" || die "enumerate failed" 3

# 2) Build an updates array: one object per agent with id/type/transcriptPath/tokensUsed.
updates="[]"
while IFS= read -r spawn; do
    [ -n "$spawn" ] || continue
    aid="$(printf '%s' "$spawn" | jq -r '.id')"
    atype="$(printf '%s' "$spawn" | jq -r '.type // empty')"
    atrans="$subagents_dir/agent-${aid}.jsonl"
    if [ -f "$atrans" ]; then
        tok="$("$unit" "$atrans" 2>/dev/null)" || { log "unit failed for $aid (skipped)"; continue; }
    else
        log "subagent transcript absent for $aid (skipped): $atrans"
        continue
    fi
    updates="$(jq -c --arg id "$aid" --arg type "$atype" --arg tp "$atrans" \
        --argjson tok "$tok" '. + [{ id:$id, type:$type, transcriptPath:$tp, tokensUsed:$tok }]' \
        <<<"$updates")" || die "build updates failed" 3
done <<<"$spawns"

# 3) Manager (agents[0]) tokensUsed from the main transcript (fetch (c)).
mgr_tok="$("$unit" --main "$main_transcript" 2>/dev/null)" || die "manager sum failed" 3

# 4) flock-serialized read-modify-write with atomic mv (mirrors post-tool-use-agents.sh).
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"
(
    flock -x 9 || die "flock failed on $lock_file" 3

    if ! jq \
        --argjson updates "$updates" \
        --argjson mgr "$mgr_tok" \
        --arg now "$now" '
        # Upsert each update by id into agents[]; create if absent, else merge tokensUsed+transcriptPath.
        reduce $updates[] as $u (.;
            .agents = (
                (.agents // [])
                | (map(.id) | index($u.id)) as $idx
                | if $idx == null
                  then . + [ { id:$u.id, name:null, type:$u.type, step:null, phase:null,
                               iter:null, sub_step:null, model:null, system:null,
                               transcriptPath:$u.transcriptPath, status:null,
                               tokensUsed:$u.tokensUsed, startedAt:null, finishedAt:null } ]
                  else .[0:$idx]
                       + [ .[$idx] + { transcriptPath:$u.transcriptPath, tokensUsed:$u.tokensUsed } ]
                       + .[$idx+1:]
                  end
            )
        )
        # Refresh agents[0] (manager) tokensUsed from fetch (c).
        | (if (.agents | length) > 0
           then .agents[0].tokensUsed = $mgr
           else . end)
        # Recompute usage.
        | .usage.sessionTotal = ([ .agents[].tokensUsed.total // 0 ] | add)
        | .usage.computedAt   = $now
        ' "$session_json" > "$tmp_file"; then
        log "jq reconcile failed"; rm -f "$tmp_file"; exit 3
    fi

    jq -e . "$tmp_file" >/dev/null 2>&1 || { log "tmp file failed JSON validation"; rm -f "$tmp_file"; exit 3; }
    mv -f "$tmp_file" "$session_json"
) 9>"$lock_file"
rc=$?
[ "$rc" -eq 0 ] || exit "$rc"

log "reconciled $(jq '.agents | length' "$session_json") agents; sessionTotal=$(jq '.usage.sessionTotal' "$session_json")"
exit 0
```

> **Design notes (§B.2):**
> - **Composability:** the reconciler calls the unit (`agent-token-usage.sh`) for every subagent file and once
>   with `--main` for the manager — the token-sum logic lives in ONE place (the unit), the orchestration in the
>   other. This is the locked "per-agent fetch unit + top-level reconcile orchestrator" set.
> - **Idempotent / last-write-wins:** upsert-by-`id`; re-running over the same transcripts yields the same
>   `agents[]` + `usage`. Routing fields (`name`/`step`/`phase`/`iter`/`sub_step`/`model`/`status`) the hook or
>   manager set elsewhere are PRESERVED on existing entries (the merge only overwrites `transcriptPath` +
>   `tokensUsed`); new entries seed those as `null` for a later routing pass to fill.
> - **flock + atomic mv:** copied from `post-tool-use-agents.sh` (D-3-5). `flock` confirmed available at plan time.
> - **Defensive:** missing subagent transcript → skip that agent (log to stderr), do not abort; bad args /
>   missing session.json or main transcript → exit 2; jq/write failure → exit 3.
> - **manager `agents[0]` assumption:** the template seeds `agents[0]` as the manager. The reconciler refreshes
>   `agents[0].tokensUsed` from fetch (c). If `agents[]` is empty (degenerate), it skips the manager refresh
>   rather than crashing. (See §E Q2 — should the manager be matched by `type=="manager"` instead of index 0?)

---

## §C — Blast radius (inbound references)

Grepped the canonical skills tree (`.gobbi/projects/gobbi/skills/`, excluding `sessions/` + `worktrees/`) for
`#recording-operation-metadata`, `#session-metadata`, `#workflow-runtime`, and `§ Workflow Metadata`.

| # | File:line | Current ref | Action |
|---|---|---|---|
| 1 | `skills/delegation/SKILL.md:213` | `[…](../orchestration/SKILL.md#recording-operation-metadata)` | **REPOINT** → `#recording-workflow-metadata`. Exact edit: change the link target `…/SKILL.md#recording-operation-metadata)` to `…/SKILL.md#recording-workflow-metadata)`. The surrounding sentence ("recorded by the manager via `jq` over each agent's own transcript") stays accurate. |
| 2 | `skills/orchestration/SKILL.md:305` | `[§ Recording operation metadata](#recording-operation-metadata)` (Writer row) | **REMOVED** — the Writer row is deleted (D1); the whole §A replacement supersedes it. No repoint needed. |
| 3 | `skills/orchestration/SKILL.md:331` | `See [§ Recording operation metadata](#recording-operation-metadata)` (tokensUsed row) | **REMOVED/RESOLVED** by §A — the new field-reference + inlined fetches make the internal back-link unnecessary; §A carries no stale `#recording-operation-metadata` anchor. |
| 4 | `skills/orchestration/SKILL.md:332` | `see [§ Recording operation metadata](#recording-operation-metadata)` (agents update-points row) | **REMOVED/RESOLVED** by §A (same as #3). |
| 5 | `skills/orchestration/chat-mode.md:569` | ``§ Workflow Metadata` for the `workflow.chat.tasks[]` … schema` | **NO CHANGE** — references the H2 section by NAME (`§ Workflow Metadata`), which is preserved, and `workflow.chat.tasks[]` is still documented in §A's field-reference table. Link referent intact. Executor: confirm post-edit that `workflow.chat.tasks[]` row is present in §A (it is). |

Anchors `#session-metadata` and `#workflow-runtime` had **no inbound references** anywhere in the canonical
tree (the only producers were the headings themselves, which §A removes). `gobbi/SKILL.md` and
`evaluation/SKILL.md` link orchestration anchors `#step-1-…` and `#workflow-session-memory` — **different
sections, unaffected**.

**Net blast radius: 1 real repoint (delegation:213) + 0 other external repoints.** Items 2-4 are self-contained
in the replaced section; item 5 needs no change.

---

## §D — Implementation sequence + verification

Execution runs sequentially (one task at a time). Suggested order:

| # | Step | Verification (FRESH evidence required — Iron Law: run it, read the output) |
|---|---|---|
| 1 | Create `skills/orchestration/scripts/agent-token-usage.sh` (§B.1, drop the stray no-op guard line per the note) + `chmod +x`. | `bash -n agent-token-usage.sh` (syntax). Run on a real subagent file: `./agent-token-usage.sh "${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-a7363717821bc156d.jsonl"` → expect `{"input":...,"output":...,"cacheRead":...,"cacheCreation":...,"total":...}` with `total == input+output+cacheRead+cacheCreation`. Run `--main`: `./agent-token-usage.sh --main "$CLAUDE_TRANSCRIPT_PATH"` → a strictly larger `total`. Bad-arg path: `./agent-token-usage.sh /no/such/file` → exit 2 + stderr message. |
| 2 | Create `skills/orchestration/scripts/reconcile-session-metadata.sh` (§B.2) + `chmod +x`. | `bash -n`. **Idempotency / dry check:** copy the live session.json to a scratch path, run the reconciler against it twice with `$CLAUDE_TRANSCRIPT_PATH`, and confirm: (a) exit 0 both times; (b) `jq '.agents | length'` ≥ number of distinct enumerated agentIds + manager; (c) `jq '.usage.sessionTotal'` equals `jq '[.agents[].tokensUsed.total]|add'`; (d) the two runs produce byte-identical output except `usage.computedAt` (idempotent). Do NOT run against the real session.json (the manager owns it) — use a scratch copy. |
| 3 | Replace `skills/orchestration/SKILL.md:297-391` with §A drop-in. | `git diff HEAD -- skills/orchestration/SKILL.md`: confirm (a) H2 `## Workflow Metadata` unchanged; (b) exactly one H3 `### Recording workflow metadata`; (c) `### Session metadata` + `### Workflow runtime` headings GONE; (d) NO out-of-scope deletions (the always-worktree language + fixed relative links from earlier commits are untouched — diff shows only this section's lines). Anchor check: `grep -n '^### ' skills/orchestration/SKILL.md` near the section shows the new H3 only. |
| 4 | Repoint `skills/delegation/SKILL.md:213` → `#recording-workflow-metadata` (§C item 1). | `grep -n 'recording-operation-metadata' skills/delegation/SKILL.md` → ZERO hits. `grep -n 'recording-workflow-metadata' skills/delegation/SKILL.md` → 1 hit at line 213. |
| 5 | Tree-wide anchor sweep. | `grep -rn '#recording-operation-metadata\|#session-metadata\|#workflow-runtime' .gobbi/projects/gobbi/skills/ | grep -vE '/sessions/|/worktrees/'` → ZERO hits (all retired anchors gone, no dangling inbound links). |

**Live verification already performed at plan time (this session):** all three fetches (a)/(b)/(c) were run
against `$CLAUDE_TRANSCRIPT_PATH` and produced valid output — (a) enumerated 22 distinct agentIds; (b) for
`agent-a011246c714ec2ea1.jsonl` returned `total=7140712` (= 4954+26469+6867697+241592, arithmetic checks); (c)
manager returned `total=92428287`. Every enumerated `agentId` mapped 1:1 to an existing
`subagents/agent-<agentId>.jsonl` file. `jq` and `flock` confirmed on PATH.

---

## §E — Open questions / risks

- **Q1 — merged H3 anchor name.** Chose `### Recording workflow metadata` (`#recording-workflow-metadata`).
  Alternatives considered: keep `### Recording operation metadata` (zero repoint, but "operation" is narrower than
  the merged content) or `### Recording`. RISK: low — only one inbound link (delegation:213) repoints either way
  if the name changes at all. If the user prefers zero churn, keeping the old name `### Recording operation
  metadata` is viable and drops §C item 1. **Recommend the new name** (matches H2 + content; Iron Law 7).
- **Q2 — manager match in the reconciler: index 0 vs `type=="manager"`.** §B.2 refreshes `agents[0]` as the
  manager (matches the template seed). If a future flow reorders `agents[]` so the manager is not index 0, this
  would mis-stamp. SAFER alternative: match by `type=="manager"` (or by `id == .sessionId`). RISK: low today
  (template always seeds manager at index 0; the hook upserts by id and appends). **Recommend keeping index-0**
  for simplicity now and noting the `type=="manager"` hardening as a follow-up.
- **Q3 — should the reconciler also stamp routing fields?** It deliberately does NOT (it only owns
  `tokensUsed` + `transcriptPath`; routing is the hook's / manager's job). This keeps single-responsibility but
  means a fresh `agents[]` entry it creates has `null` routing until a later pass fills it. Acceptable per the
  source-of-truth split. No action needed; documented in §B.2 design notes.
- **Q4 — script mirror-symlink + reference from delegation/hook backlog.** The new `scripts/` dir lives under
  canonical `.gobbi/projects/gobbi/skills/orchestration/`. Decide whether `.claude/skills/orchestration/scripts/`
  needs mirror symlinks (consistency with how SKILL.md is mirrored) — likely YES for discoverability, but it is a
  separate concern from this section edit. Also: the hook-repair backlog
  (`post-tool-use-hook-cannot-resolve-worktree-session-json.md`) could reference `reconcile-session-metadata.sh`
  as the canonical safety-net implementation — **recommend a follow-up note**, not in this scope.
- **Q5 — `flock` portability.** Confirmed present at plan time. The reconciler degrades to exit 3 (not a silent
  pass) if `flock` is missing, matching the hook's defensive posture. No bashism in the jq pipelines (the `jq`
  programs are `sh`-safe; the wrapper uses bash `[[`-free `[ ]` tests and `<<<` herestrings — note `<<<` is a
  bashism, so the shebang is `#!/usr/bin/env bash`, NOT `sh`). If strict POSIX `sh` is later required, the
  herestrings would need `printf | jq` rewrites — out of scope now.

---

## Self-review (planning checklist)

- [x] SPEC + CRUD written before any edit (§0); blast radius enumerated (§C) — Iron Law 6/13.
- [x] Preserved text copied from the LIVE 297-391 (read this session), not reconstructed — honors
      `verbatim-section-replacement-must-copy-preserved-parts-from-live-file`. §A notes flag the `git diff HEAD`
      check for out-of-scope reverts.
- [x] Section ORDER preserved as a contract (`section-order-is-part-of-the-contract`): H2 intro → first table →
      frame paragraph → single H3 (source-of-truth → field reference → procedure → fetches → hook role). §D step 3
      verifies heading order.
- [x] Every deliverable anchored to a locked user decision (D1-D5) — §1.
- [x] All three `jq` fetches re-verified against the live transcript with fresh evidence (§D) — Iron Law 7.
- [x] Two scripts are single-responsibility + composable (unit called by orchestrator) — locked set.
- [x] No placeholders/TODOs in the drop-in or the scripts (the one stray no-op line is flagged for deletion with
      an explicit note, not left silent).
- [x] Type/name consistency: anchor `#recording-workflow-metadata` used identically in §A, §C, §D; field/key names
      match the template (`agents[]`, `tokensUsed`, `usage.sessionTotal`, `usage.computedAt`).
- [x] Scope boundary: PLAN/DRAFT only; the executor creates+chmods+run-verifies the scripts and edits the section.
      No target files edited by this plan.
