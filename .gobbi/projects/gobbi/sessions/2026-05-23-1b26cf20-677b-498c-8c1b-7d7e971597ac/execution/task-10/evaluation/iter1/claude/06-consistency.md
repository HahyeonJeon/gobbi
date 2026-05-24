# Perspective: Consistency

## Frame execution

This perspective drives the eval. The contract is: does the doc match what T07/T08/T09 actually do?

### CC1 — Structured-header regex: doc vs T07 source

- **Doc** (`delegation/SKILL.md` L215): "The hook reads four headers via case-insensitive line-anchored regex `^Your (phase|iteration|sub-step|step): (.+)$` from `tool_input.prompt`."
- **T07** (`.claude/hooks/post-tool-use-agents.sh` L134-135):
  ```
  | grep -m1 -iE "^Your[[:space:]]+${_key}:[[:space:]]+.+"
  | sed -E "s/^Your[[:space:]]+${_key}:[[:space:]]+//I"
  ```
- **Diff**: T07 uses `[[:space:]]+` (one or more whitespace), doc shows a single literal space. T07 case-insensitive matches the doc claim. T07 has no end-of-line `$` anchor (`grep` is line-oriented so this is functionally equivalent for the intent).

**Materiality**: a delegation prompt with `Your phase:  ideation` (two spaces) parses correctly under T07 but a strict reader of the doc would believe it must be exactly `Your phase: ideation` (one space). Low risk in practice, but the doc is *narrower* than the implementation. Stating "case-insensitive, with one or more whitespace after the colon" would be accurate.

### CC2 — `endStatus` vs `status` field name mismatch — CRITICAL

- **Doc** (`orchestration/SKILL.md` L415, agents update-points cell): "the same hook, firing on PostToolUseFailure as well, updates `finishedAt` / `tokensUsed` / `endStatus`".
- **T07** (`.claude/hooks/post-tool-use-agents.sh` L165-167, L176, L199): assigns `status="ok"` (or `"failed"` for PostToolUseFailure) and writes `status: $status` into the per-agent record. ALSO writes `hook_event: $event`.
- **No `endStatus` field exists anywhere in T07 output, T08 output, the session template, or the schema.** Confirmed via `grep -rE 'endStatus' .claude/ .gobbi/projects/gobbi/skills/` — the only hit is the row we just added.

**Materiality**: a reader who builds tooling against `agents[*].endStatus` will hit `undefined` on every entry. The orchestration table is the canonical schema reference for `session.json.agents[]` — naming a non-existent field at the schema-reference site is a docs-sync defect of the highest severity for this perspective.

### CC3 — Per-agent record schema row missing `status` field

The orchestration Workflow-Metadata table has a `Per-agent record` row enumerating fields (`id`, `name`, `type`, `step`, `phase`, `iter`, `model`, `system`, `transcriptPath`, `tokensUsed`, `startedAt`, `finishedAt`). T07 writes additional fields not in this enumeration: `tool_use_id`, `status`, `hook_event`, `totalDurationMs`. T10 did not introduce this gap, but the update-points row's invented `endStatus` widens the inconsistency on the same line that should have caught it. Pre-existing drift outside T10 scope, flagged here for traceability.

### CC4 — `Task|Agent` matcher narrative

- **Doc** (`orchestration/SKILL.md` row 6): "registered for matcher `Task|Agent` on both `PostToolUse` and `PostToolUseFailure`".
- **Ground truth** (`.claude/settings.json` `.hooks.PostToolUse[].matcher` + `.hooks.PostToolUseFailure[].matcher`): both return `Task|Agent`. ✓
- Cross-reference to "see Task 09" is accurate — T09 iter2 (commit `512ca9c`) widened the matcher.

### CC5 — Lock file co-location and atomic `mv`

- **Doc** (`delegation/SKILL.md`): "wrap their `session.json` read-modify-write in a POSIX `flock -x` exclusive lock (held on a sidecar `.lock` file co-located with `session.json`), then commit the new contents via `mv` for atomic replacement."
- **T07** (`.claude/hooks/post-tool-use-agents.sh` L216, L248): `lock_file="$session_json.lock"`, `mv -f "$tmp_file" "$session_json"`. ✓
- **T08** (`.claude/scripts/reconstruct-agents.sh` L194, L236): same pattern. ✓
- The "concurrent subagent spawns are safe under arbitrary spawn concurrency" claim is correct given T07's implementation (flock + atomic mv).

### CC6 — Template-shipping claim

See F-U-1 / F-U-2 under Usage. The delegation doc says "Per-role templates ship the headers pre-filled with `<<slot>>` markers" but only 2 of 4 headers ship in 3 of 4 templates. Logged under Usage; cross-referenced here as a consistency defect (doc vs template artifacts).

### CC7 — Cross-cell consistency inside orchestration/SKILL.md

Row 6 says "matcher `Task|Agent`" once. The Workflow-Metadata update-points cell at L415 does NOT repeat the matcher value, instead saying "PostToolUse hook `post-tool-use-agents.sh` upserts an entry by `tool_use_id`, reading `step` / `phase` / `iter` / `sub-step` from delegation structured headers". The two cells are consistent in narrative; the metadata cell trusts the row-6 detail. Acceptable; intentional cross-link.

## New findings

- **F-C-1 [docs-sync, High, 100]**: `endStatus` field named in orchestration row L415 does not exist in T07 output, T08 output, the session template, or any consumer. The actual field is `status` with values `"ok"` / `"failed"`. Schema-reference site (Workflow-Metadata table) is exactly where this name MUST be authoritative; downstream tooling built against the doc will misread.
- **F-C-2 [docs-sync, Low, 100]**: Documented header regex `^Your (phase|iteration|sub-step|step): (.+)$` is narrower than T07's actual `^Your[[:space:]]+...:[[:space:]]+.+`. T07 tolerates multiple whitespace; doc implies exactly one space. Reader writing prompts may believe stricter contract than required. Materially low since templates produce single-space form anyway.
- **F-C-3 [docs-sync, Medium, 100]**: Per-agent record row in Workflow-Metadata table does not enumerate `status`, `tool_use_id`, `hook_event`, `totalDurationMs` — all fields T07 writes. Pre-existing drift; T10 had the opportunity to fix it concurrent with adding `endStatus` (which itself is wrong, see F-C-1) and did not. Filed as Medium because pre-existing scope, but T10's addition of a non-existent field on the same row makes it harder to defer.

## Verdict

REVISE — F-C-1 is High @ 100 confidence (≥50 threshold met) → REVISE.
