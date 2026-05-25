# Consistency Evaluation — T04 iter2 (commit 5d2a7c6), gobbi-hook-authoring SKILL.md

Perspective: consistency (teaching skill vs. authoritative in-tree files). Read directly:
`.claude/hooks/session-start.sh`, `.claude/settings.json`.

## CONSISTENCY-001 (was Medium) — invented `hook_event_name.source` must be the real top-level `source`

RESOLVED. Confidence: 100.
- Evidence: SKILL.md:57 now reads "matched against `tool_name` ... or the top-level `source` field (for SessionStart)" and "the matcher is matched against the top-level `source` field (distinct from `hook_event_name`)". The invented nested `hook_event_name.source` path is gone.
- Regression grep: `grep 'hook_event_name\.source'` → NONE.
- Cross-check vs authoritative `session-start.sh:19,55`: `source -> CLAUDE_HOOK_SOURCE (FIX 5; distinct from hook_event_name)` and `jq -r '@sh "export CLAUDE_HOOK_SOURCE=\(.source)"'` — `.source` is unambiguously a top-level field, distinct from `.hook_event_name` (read separately at line 54). The skill's new wording exactly mirrors the script's own "distinct from hook_event_name" framing.
- P2 cross-reference: SKILL.md:102 lists `source` as a top-level SessionStart field — internally consistent with the corrected P1.
- Why it matters: iter1 told the reader to match a JSON path that does not exist; the matcher would never fire. Now correct.

## CONSISTENCY-002 (was Medium) — SessionStart exit-1 must cover all 3 fatal conditions, not "only" env-file guard

RESOLVED. Confidence: 100.
- Evidence: SKILL.md:31 now reads exit 1 "(fatal) for: the `$CLAUDE_ENV_FILE` env-file guard (unset or unwritable), an empty or missing stdin payload, and required-export failures under `set -euo pipefail` strict mode." The iter1 "exits 1 only if `$CLAUDE_ENV_FILE` is unset or unwritable" is gone.
- Regression grep: `grep 'only if .*unwritable'` → NONE.
- Cross-check vs authoritative `session-start.sh`: three exit-1 sources confirmed —
  (1) env-file unset → exit 1 (lines 32-35); unwritable → exit 1 (lines 37-40);
  (2) empty payload → `[[ -n "$payload" ]] || { ...; exit 1; }` (line 46);
  (3) `set -euo pipefail` (line 27) — any failed `jq` required-export (lines 51-55) aborts non-zero.
  The skill's three enumerated conditions map 1:1 to the script. Accurate and complete.
- Why it matters: iter1 under-described the contract, implying a reader could drop the empty-payload guard and strict mode. Now the full fatal-condition set is documented.

## Twin consistency (must-preserve)

PASS. Confidence: 100. Staged twin and promoted twin are byte-identical (md5 8d97fc94c3b409693f3fb6d95c893d81 for both; `diff` empty).

VERDICT (consistency): PASS — both consistency findings resolved against authoritative files; twins identical.
