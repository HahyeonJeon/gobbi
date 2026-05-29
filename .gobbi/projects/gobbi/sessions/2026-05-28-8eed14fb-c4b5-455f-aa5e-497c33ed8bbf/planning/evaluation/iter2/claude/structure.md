# Structure — Planning iter2 (Claude)

**Verdict:** REVISE

## Artifact Summary
Surgical-patch Plan; structure (7 tasks, DAG edges, file scopes) unchanged from iter1. Structural concerns concentrate on the new F3 mechanism (capture-and-reread to `/tmp/t4-pre.txt`).

## Memory reads
- evaluation/SKILL.md
- iter1 codex structure.md (codex-structure-001 + 002) and claude structure.md
- planning/SKILL.md, orchestration/SKILL.md

## Locked Frame (Stage 1)

**S-S1 (inherited from iter1)** Task dependencies form a DAG and match documented order.
**S-S2 (inherited)** Required skills are loadable (codex-structure-001 disposition).
**S-S3 (inherited)** Verification structure is concrete and binary (codex-structure-002 disposition).
**S-S4 (adversarial, new)** F3 capture-and-reread mechanism via `/tmp/t4-pre.txt` is robust across executor session boundaries, parallel tasks, and reboots.
**S-S5 (adversarial, new)** YAML comment-as-NOTE inside `required-skills:` lists (F1) is parseable AND read by executors.

## Per-scenario Findings

- **S-S1 ✓** `requires:` edges preserved: T3→{T1,T2} (line 344), T6→{T1,T2,T3} (line 455). DAG intact.
- **S-S2 ✓** F1 disposition addresses codex-structure-001 (claude skill removed from 5 task `required-skills:` blocks). Comment substitution is non-blocking. Inherited Disposition: **addressed**.
- **S-S3 ⚠** Codex-structure-002 (T5 symmetric session.template.json check) — F5 disposition adds the symmetric check at line 318. Inherited Disposition: **addressed**. **BUT:** the assertion still uses unresolved placeholder `<session.template.json>` and `<state.template.json>`. The `$()` substitution will receive `<session.template.json>` as a literal redirection token, which under most shells is a parse error (or treated as input redirection from a file). See F-STRUCT2-1 below.
- **S-S4 ✗** The F3 capture mechanism writes `PRE_T4_REV` to `/tmp/t4-pre.txt` and re-reads it. This is fragile:
  - **No namespacing by session-id or PID** — two concurrent executor sessions running T4 (e.g., re-run after REVISE) clobber each other's pre-rev. The Bash session-state approach (export `PRE_T4_REV` in same shell) would avoid this, but the executor may run pre-flight and post-edit in separate Bash invocations.
  - **`/tmp` is volatile** — wiped on reboot. Not a likely failure path for short tasks but a sharp edge.
  - **The re-read uses `awk '{print $NF}'`** which depends on the line's structure being exactly `Pre-T4 rev = <sha>`. Robust enough but coupled to the write idiom in the same file.
  - A simpler in-session alternative — `git -C "$WT" diff "$PRE_T4_REV" -- file` immediately after the edit while `PRE_T4_REV` is still set in the same shell — sidesteps the issue. The leader's flagged focus area (a) is real.
- **S-S5 ✓** YAML `#` comment between list items is syntactically valid; humans reading the YAML will see the NOTE (it's adjacent to the list items). Leader's flagged focus area (b) clears.

## New typed findings

- **F-STRUCT2-1 (Medium · Confidence 75 · `design_flaw` · `verification`)** — F3's claimed "binary assertion" conversion left ~30+ verification commands using unresolved path placeholders `<chat-mode.md>`, `<auto-mode.md>`, `<SKILL.md>`, `<settings.default.json>`, `<state.template.json>`, `<session.template.json>`, `<new-backlog.md>`, `<archived-chat-backlog>`. Examples: lines 150-153 (T1), 211-214 (T2), 265-269 (T4), 313-318 (T5), 379-384 (T3), 431-434 (T7), 480-481 (T6). When pasted into a shell literally, `<chat-mode.md>` is parsed as input-redirection from a file named `chat-mode.md` (or as a syntax error depending on context). The leader cites this as "reader-substitution shorthand" in §Self-review, but the brief required converting `# expect N` comments to `[ "$(...)" ... ]` binary forms — placeholder substitution is the orthogonal under-specification surfaced by iter1 Claude F-USAGE-2 (Low · 75). It is *materially* unfixed in iter2. The first verification line of each task DOES use full paths (lines 147, 149, 208, 210, 311-312, 376, 378) — so the convention is mixed within a single task.
- **F-STRUCT2-2 (Medium · Confidence 50 · `design_flaw` · `verification`)** — F3 `/tmp/t4-pre.txt` and `/tmp/t5-pre.txt` mechanism is brittle for parallel re-runs (no session-id namespacing) and across-shell continuity (writing to a file is required because the brief permits the executor to run pre-flight and post-edit in separate shells). The leader's flagged focus area (a) anticipated this. Direction-not-prescription: in-session env var with single-shell execution, or namespace the file with session-id.
- **F-STRUCT2-3 (Low · Confidence 75 · `assumption_risk` · `verification`)** — Line 267 `jq` assertion `... = '"[\\"always\\"]"'` is triple-escaped (shell single-quote then escape) — the literal string the shell will compare against is `"[\\"always\\"]"`. The jq `tostring` output for `["always"]` is `"[\"always\"]"`. Likely OK with backslash-escape interpretation but the brittle quoting makes the assertion hard to copy-paste reliably.

## Verdict & Must-preserve

- **Verdict: REVISE.** F-STRUCT2-1 is Medium / Confidence 75: F3's binary-assertion goal is met only partially because the surrounding commands use unresolved placeholders. Per `evaluation/SKILL.md` Stage 2 verdict rule, Medium ≥ 75 in a design_flaw triggers REVISE.
- **Inherited Dispositions:**
  - codex-structure-001 (claude skill) → **addressed**
  - codex-structure-002 (T5 symmetric check) → **addressed** but with caveat (placeholders in command body)
- **Must-preserve:** F1 NOTE shape; F5 symmetric T5 check; T3 grep-anchor discipline; F7 develop..HEAD; F4 line-241 precision; full path on first verification command of each task.

## Low-confidence appendix
- F-STRUCT2-3 (Confidence 75) — the shell-jq quoting is technically OK but reader-hostile.
