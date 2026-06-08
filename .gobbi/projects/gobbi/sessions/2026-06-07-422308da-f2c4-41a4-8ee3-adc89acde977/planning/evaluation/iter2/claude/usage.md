# Planning Eval — Usage (claude, iter2)

## Frame
Can an executor run each task from the Plan alone (anchors resolvable, verification runnable, skills/mistakes attached)?

## Walk
- iter1 S-1 (un-runnable T4 drift check) is FIXED. T4(c) now verifies the SKILL.md §3/§6 pointer BY STABLE SECTION NAME (grep "auto-mode.md §3" / "auto-mode.md §6"), not by line number; the supporting prose cites line 266 (live-correct) only as a locator. Independently verified: live SKILL.md line 266 holds the `auto-mode.md §3 — Always-Ask codification … §6 — maxIterations exhaustion` pointer. The drift check is now runnable AND line-shift-resilient.
- T4(d) exhaustive-classification check is runnable: it greps a named verb set (AskUserQuestion / escalate to / Surface to user / Flag for user) and matches each hit to the 9-site list. My independent grep returns exactly those 9 operative sites (109/119/137/194/196/197 safety; 239/246/258 routine) plus line 125 (descriptive prose restating the 119 major-divergence flow) and line 247 (resolution-recording follow-up to the 246 Stuck site) — neither is a separate gate. No 10th survivor.
- Agent assignments: all executor/opus, with edit-mechanics + cotouch-enumeration mistakes attached to T1/T4. Skills list flags the `claude` skill absence as non-blocking (readiness Item 4). Runnable.

## Findings
None. Both previously un-runnable checks (drift-guard, exhaustive classification) are now executable as written.
