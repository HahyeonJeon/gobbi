# Preparation iter1 — USAGE perspective (Claude)

Perspective: usage (downstream Planning + Execution consumability)
Verdict: **REVISE**

## Frame

Preparation's output is the input to Planning. A Planning decomposer reading the canonical draft + staged files should be able to construct task briefs with zero ambiguity about which surfaces are touched, which mistakes to cite, which gaps were closed, and which were deferred.

## Findings

### F-U1 (High, Confidence 100, scenario_gap / docs-sync)

**Planning will hit the same 5-vs-7 ambiguity on the workflow phase docs.** Per the staged D-4 design file, Planning is told to add the per-iter cadence rule to 5 files. But `ls .claude/skills/orchestration/workflow/` returns 7. A Planning decomposer running that exact `ls` (which they will, to enumerate the file set for the executor's brief) will see 7 and either (a) trust the staged file's 5 (probably correct but unexplained) or (b) add cadence to all 7 (incorrect per the design intent).

The D-4 staging file's own "Validation" section at line 54 even encodes the 5-file pattern in a `grep -l` command — but a real Planning decomposer needs to know WHY evaluation.md + memorization.md are excluded. The trade-offs section at line 61 hand-waves: "the 5-phase set is fixed by the 5 productive steps + Wrap-up of the gobbi workflow (Configuration is CLI init, not a workflow doc) — change pressure is near-zero." But evaluation.md + memorization.md ARE workflow docs — they exist in the same dir and they're SUB-phase docs of the productive loops, not configuration. The omission is correct per the conceptual model (per-iter cadence applies to loops, not sub-phases) but the design file fails to say so.

Why it matters: Planning will need to re-derive this distinction at decomposition time, which defeats the gap-resolution purpose of D-4.

### F-U2 (High, Confidence 100, scenario_gap / process)

**The mirror policy guidance for T1 executor briefs is contradictory.** The mirror-policy decision file says (line 26) "Executors editing skill files target the workspace path only. The mirror is downstream — never directly edited." The same file then says (line 42 consequences) "Until the mechanism ships, executors must either (a) manually mirror-edit when touching files in both trees, OR (b) flag mirror drift as a known risk." These contradict each other — (a) requires editing the mirror; the headline rule forbids it.

The conditional backlog further amplifies (line 38): "Bundle B's recommended interim choice — **(a) manually mirror-edit** for T1's skill file edits — because T1's edits are core session-architecture rules and mirror drift would be load-bearing. Add this as a Planning task-brief requirement."

Plus F-P1's deeper problem: the workspace files are file-level symlinks into the mirror. So "manually mirror-edit" through symlinks is a no-op (one edit, one underlying file). The Planning brief author will be confused by all three layers.

Why it matters: Planning task-brief authors need an unambiguous rule. Right now they have three rules saying conflicting things. This will produce REVISE rounds at Planning evaluation time.

### F-U3 (Medium, Confidence 100, general / docs-sync)

**The "Path correction" Planning intake note is well-placed and useful.** draft-iter1.md line 200 explicitly tells Planning: cite `.claude/skills/orchestration/templates/session.template.json`, NOT `.claude/templates/session.template.json`. This is exactly the kind of intake clarification Planning needs. Good.

### F-U4 (Medium, Confidence 100, general / process)

**The D-3 binding requirement is mechanically checkable** — Planning evaluator can `grep` each T1 task brief for the 3 file basenames. That's a high-value gate per Iron Law 7. Good.

### F-U5 (Low, Confidence 50, scenario_gap / process)

**Planning intake notes section is consistent across the draft and the rawdata** — both rawdata `§ Notes for Planning intake` and draft-iter1.md `§ Notes for Planning intake` carry the same 4-5 bullets. Useful redundancy for Planning's intake.

## Must-preserve list

- The Notes-for-Planning-intake section at the bottom of draft-iter1.md — preserve, it's exactly what Planning needs.
- The D-3 mechanical grep-checkability of brief compliance — preserve.
- The Path correction (session.template.json canonical path) — preserve.

## Verdict

**REVISE** — two High/100 findings: the 5-vs-7 ambiguity on workflow docs (F-U1) and the contradictory mirror-policy guidance for T1 executor briefs (F-U2). Both will cause Planning rework if left unaddressed.

