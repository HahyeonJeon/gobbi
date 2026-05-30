# Structure — Planning iter1 (Claude)

**Verdict:** PASS

## Artifact Summary

- Plan §3 task table presents 7 ordered task blocks (T1..T7) each rendered as a YAML block with consistent fields. Dependencies expressed via `requires:` arrays. Order specified in §3 header text: T1→T2→T4→T5→T3→T7, T6 in Wrap-up.

## Frame (Structure)

- **S-S1 Task-block schema completeness** — Every task carries: id, what, traces-to, requires, files, out-of-scope-files, pre-resolved-decisions, success-criteria, verification-commands, estimated-risk, risk-rationale, agent, required-skills, required-mistakes.
- **S-S2 Dependency DAG** — `requires:` arrays form a DAG; no cycles; topological order respects user-confirmed execution order.
- **S-S3 Idea-anchor coverage** — `traces-to:` cites resolve to existing §s in the Idea doc.
- **S-S4 No file-collision (overlapping `files:` lists for parallel-eligible tasks)** — Plan-level conflict flag is zero per §2 Success Criteria #4.

## Per-scenario Findings

- **S-S1 ✓** — Verified per task: T1 (lines 92-151), T2 (155-205), T3 (298-362), T4 (209-252), T5 (256-294), T6 (409-452), T7 (366-405) all carry the full field set. Field names consistent across tasks (no `purpose` vs `what` drift; no `verify:` vs `verification-commands:` drift).
- **S-S2 ✓** — Dependency graph:
  - T1: requires []
  - T2: requires []
  - T3: requires [T1, T2] (line 310 — rationale at 311 sound: T3 references chat-mode.md and auto-mode.md by name AND content)
  - T4: requires []
  - T5: requires []
  - T6: requires [T1, T2, T3] (line 416 — rationale at 417 sound: backlog "closed" claim requires shipped artifacts)
  - T7: requires []
  
  Topological order T1, T2, T4, T5, T3, T7 satisfies all deps (T1+T2 before T3 ✓; T1+T2+T3 before T6 ✓). T6 runs in Wrap-up. DAG; no cycles.
- **S-S3 ✓** — Spot-checked anchor citations:
  - T1 traces "Idea §3.1 — Mode posture" → exists at idea.md line 138.
  - T1 traces "Idea §3.3 — Chat MEMORIZATION canonical statement (R5)" → exists at line 218.
  - T3 traces "Idea §6.1 / §6.7" → exist at lines 350+ / 415+.
  - T4 traces "Idea §5 — Defaults table" → exists at line 310.
  - T5 traces "Idea §6.7 — workflow.chat.tasks[] schema" → exists at line 415.
  - T7 traces "Idea §8 Finding #8" → exists at line 542.
  All resolved.
- **S-S4 ✓** — File overlaps:
  - chat-mode.md: T1 only.
  - auto-mode.md: T2 only.
  - SKILL.md: T3 only.
  - settings.default.json: T4 only.
  - state.template.json + session.template.json: T5 only.
  - The two closing backlogs: T6 only (frontmatter stamp + git mv).
  - New backlog: T7 only (create).
  No collisions; T3+T6 share no file even though T3 amends SKILL.md and T6 is a wrap-up artifact.

## New typed findings

- **F-STRUCT-1 (Medium · Confidence 75 · `design_flaw` · `docs-sync`)** — T3 cites SKILL.md "lines 241-242" for the lock (Plan line 321, 333; Idea also says 241-242). Empirical check: `grep -n 'In both modes, the manager NEVER skips'` returns **line 241 only** (one line). The lock is a single line, not two. This isn't fatal — the Plan instructs Execution to strike-through the "second sentence" of the lock, which IS the second sentence WITHIN line 241 ("Mode controls user gates; it does not relax the workflow."). But the line-number citation is off by one and Execution-stage grep-anchor search using "lines 241-242" may confuse the executor. Plan's T3 risk-rationale (a) already says "executor must use grep-anchors not absolute line numbers" — so the mitigation is in place, but the cited range remains inaccurate. Direction (don't prescribe): adjust the cited line range or rely entirely on the grep-anchor pattern. Confidence 75 (grep-verified).
- **F-STRUCT-2 (Low · Confidence 75 · `assumption_risk` · `docs-sync`)** — T3 §pre-resolved-decisions cites anchor "338-405 State Machine" (line 321). SKILL.md ToC shows §Workflow State Machine starts at 338 and §Loop ↔ agent type mapping at 407 (so the State Machine umbrella section ends ~406). Range is approximately correct but bundles `### Loop states`, `### Verdict aggregation`, `### Iteration rule`, AND `### Mode-specific gates within a loop` — the latter is ALSO separately cited as 387-405. Slight overlap in the cited line ranges. Not a contract bug; informational. Confidence 75.
- **F-STRUCT-3 (Low · Confidence 75 · `general` · `docs-sync`)** — Plan §3 T6 lists files with paths `archive/backlogs/2026-MM-DD-{slug}.md` (lines 421, 422, 432, 438, 439). The `MM-DD` placeholder is acceptable (Plan §Self-review explicitly calls out these as reader-substitution markers). The ship date will be substituted by Wrap-up. Informational — flag for transparency.

## Verdict & Must-preserve

- **Verdict: PASS.** All four scenarios pass; F-STRUCT-1 is a Medium docs-sync nick that the executor's grep-anchor discipline already mitigates.
- **Must-preserve:**
  - The consistent task-block schema (every task carries the same field set).
  - `requires:` arrays + rationale comments (T3, T6) — the rationale prevents reorder regressions.
  - Per-task `out-of-scope-files:` (negative scope; T1 explicitly out-of-scopes `.claude/skills/...` mirror, memorization/SKILL.md, etc.).
  - T6's explicit Wrap-up agent ownership (line 445).

## Low-confidence appendix

- §3 T3 anchor "Line 241–242 — the lock" remains usable via the grep-anchor mitigation in the risk-rationale; off-by-one is minor. Confidence on the lock being one line vs two: 100 (grep verified). Confidence the Execution executor will be confused: 25 (mitigation present).
