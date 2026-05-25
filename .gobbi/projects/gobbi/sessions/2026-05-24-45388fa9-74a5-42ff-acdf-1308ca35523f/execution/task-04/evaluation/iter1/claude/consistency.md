# Consistency — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
See project.md. Consistency = skill ↔ witnesses ↔ settings.json ↔ template ↔ backlog all in sync; whole-file accuracy (per promoted mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep` — I read the FULL skill + BOTH hooks, not just the changed section).
**Memory reads**: as project.md (incl. both whole-file-grep mistakes, applied below).

## Locked Frame (Stage 1)
- **S1 Every factual claim in the skill matches its witness hook** — whole-file cross-check, not just headline patterns (mistake-derived scenario).
- **S2 Staged twin == promoted file (byte-identical)** — promotion identity.
- **S3 Backlog status + closure note in sync with the deliverable.**
- **S4 settings.json registration claims match the real settings.json.**
- **S5 (adversarial) Skill cites a line count / field / matcher that has drifted from the witness.**
- **S6 (mistake-derived) Did the skill invent a pattern the backlog "suggested" but no witness uses?** — guards against codifying speculation (Principle 10).

## Per-scenario per-check results
Whole-file cross-check of every substantive claim:
- exit-0 always in PostToolUse: skill L31/L211 ↔ hook never `exit 1` (grep confirmed) — MATCH.
- strict-mode scoping: skill L35 (`set -euo pipefail` for session-start, `set -uo pipefail` no -e for post-tool) ↔ hooks L27 / L26 — MATCH.
- bail() = log + exit 0: skill ↔ hook L31 — MATCH.
- jq -r @sh: skill L39/P3 ↔ hook L51-55 — MATCH.
- REQUIRED/OPTIONAL/PASSTHROUGH tiers: skill P3 ↔ hook L48-77 (5 required, 3 optional, 3 passthrough %q) — MATCH.
- %q bash-only passthrough: skill L115 ↔ hook L71-75 — MATCH.
- flock -x critical section + tmp-validate + mv -f: skill P4 ↔ hook L219-249 — MATCH (jq pipeline reproduced faithfully).
- tool-name case filter Task|Agent exit 0: skill P1/L226 ↔ hook L55-58 — MATCH.
- P6 resolver (project.json DORMANT → dir scan exactly-one → session-dir suffix match): skill L192-195 ↔ hook L68-111 — MATCH.
- stdin fields (session_id/cwd/hook_event_name/transcript_path; tool_* for PostToolUse; source/agent_* for SessionStart): skill P2 ↔ hooks — MATCH.
- S1 RESULT: 1 mismatch found → CLA-CONS-001 (command shape). Plus the "only" overstatement (CLA-AES-001) and P5 simplification (CLA-STRUCT-001) already filed.
- S2 YES — `diff staged promoted` → IDENTICAL.
- S3 YES — backlog `status: closed` + Closure section naming session/T04/CL-2/N=2 witnesses; consistent with commit.
- S4 NO — see CLA-CONS-001.
- S5 — line counts "79 lines" / "251 lines" verified correct against the witnesses; matcher `startup|resume|clear|compact` and `Task|Agent` verified correct against settings.json — MATCH.
- S6 YES (good) — backlog "suggested approach" L52 mentions `@json`; the skill correctly omits any `@json` claim (grep = 0) because no witness uses it. Witness-bound discipline upheld.

## Typed findings

### CLA-CONS-001 — Registration command shape in the skill does not match the real settings.json
- Type: `general` / Domain: `docs-sync` / Disposition: open / Confidence: 100 / Severity: Medium
- Evidence: skill L58/L67/L73/L201 = `"bash .claude/hooks/..."`; `.claude/settings.json` L36/44/52 = `{ "type": "command", "command": ".claude/hooks/..." }`. Bare path, no `bash` prefix, includes `"type": "command"`.
- Why it matters: the skill's Procedures section is meant to be the canonical registration reference; it drifts from the authoritative in-tree witness (settings.json). Same root issue as CLA-USAGE-001 — filed once per perspective (shared root, distinct lens) per the finding-batching guard.
- Suggested direction: mirror settings.json verbatim.

(CLA-STRUCT-001 P5-simplification and CLA-AES-001 "only" are cross-referenced here as Consistency-adjacent but owned by their home perspectives.)

**Verdict: PASS**
(Highest Consistency finding is Medium/100 — below High/≥50 REVISE threshold.)

## Low-confidence appendix
(none)
