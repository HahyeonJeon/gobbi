# Usage Evaluation — T04 iter2 (commit 5d2a7c6), gobbi-hook-authoring SKILL.md

Perspective: usage. Confirmation eval of iter1 REVISE remediation. Authoritative files read directly:
`.claude/settings.json` (lines 31-56) and `.claude/hooks/session-start.sh`.

## USAGE-001 (was High) — registration example must include `"type": "command"` + bare command path

RESOLVED. Confidence: 100.
- Evidence: SKILL.md:58 adds `hooks[].type: must be "command" — required field`; SKILL.md:59 states `the bare path ... (no "bash " prefix)`. The JSON example (SKILL.md:65-82) shows every entry as `{ "type": "command", "command": ".claude/hooks/..." }` with no `bash ` prefix.
- Cross-check vs authoritative `.claude/settings.json:32-55`: byte-shape matches — `"type": "command"` present on every hook object; commands are bare paths (`.claude/hooks/session-start.sh`, `.claude/hooks/post-tool-use-agents.sh`). The skill now also includes the SessionStart block that settings.json:32-39 has, which iter1 omitted.
- Regression grep: `grep '"command": "bash '` → NONE.
- Why it matters: a user copying the iter1 example would write a hook entry rejected by Claude Code (missing required `type`) or with a redundant `bash ` prefix that diverges from project convention. Now copy-paste-correct.

## USAGE-002 (was Low) — smoke-test payload must be concrete/runnable, not `...`

RESOLVED. Confidence: 100.
- Evidence: P7 step 1 (SKILL.md:208-218) replaces the `...` placeholder with two concrete, runnable payloads — a SessionStart payload (line 210: includes `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `source`) and a PostToolUse payload (line 215: includes `tool_name`, `tool_use_id`, `tool_input`, `tool_result`). Both piped into the real hook scripts.
- Field-fidelity cross-check: the SessionStart payload fields exactly match the fields `session-start.sh` reads (`.session_id`, `.transcript_path`, `.cwd`, `.hook_event_name`, `.source` — see session-start.sh:51-55). The PostToolUse payload fields match P2's documented PostToolUse fields (SKILL.md:95-99). Payloads are runnable as-is.
- Residual `...` grep matches (SKILL.md:174,175,243) are legitimate shell-syntax illustrations (`(...)`, `{ log ...; }`, `case ... esac`), not payload placeholders — out of scope for this finding and correct.
- Why it matters: a Low-severity teaching gap; the user can now run the smoke test verbatim.

VERDICT (usage): PASS — both usage findings resolved, no new usage defect.
