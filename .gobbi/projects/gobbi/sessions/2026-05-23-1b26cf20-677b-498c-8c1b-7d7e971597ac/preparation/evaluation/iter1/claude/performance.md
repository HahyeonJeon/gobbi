# Preparation iter1 — PERFORMANCE perspective (Claude)

Perspective: performance (effort proportionality, scope-minimality, generation-vs-defer calibration)
Verdict: **PASS**

## Frame

A good Preparation loop produces minimal-scope artifacts (smallest possible interventions) and defers anything that can be deferred without blocking Planning. The cost of over-generation (Principle 10 violation) is durable mis-skilling and N=1 trap. The cost of under-generation is downstream Planning rework.

## Findings

### F-Pe1 (Low, Confidence 100, general / process)

**The 4-skip / 3-defer / 2-generate split is well-calibrated.** Of 9 base gaps + 1 round-2 lock + 1 conditional WORK-phase scan = 11 total surface decisions:
- D-1 (feature dir) — skip; Wrap-up bootstraps. Correct: pre-creation is wasted work.
- D-5 (.claude/scripts/) — skip; executor `mkdir -p` is part of T3-I-T3.b. Correct: pre-creation is wasted work AND would require a second commit for the directory alone.
- D-8 (no separate session-architecture skill) — skip; T1 edits ARE the codification. Correct application of Principle 10 — extracting a skill that duplicates the source-of-truth surfaces would create a 2-source drift.
- D-9 (no shell-script-conventions skill at N=1) — skip; N=1 trap explicitly cited. Correct.
- D-2 (hooks-domain mistakes watchlist) — defer; speculative pre-emptive stage would be Principle 10 violation. Correct.
- D-6 (aggregated session-lifecycle design doc) — defer until N=2 sessions exercise the pattern. Correct cadence — matches the Bundle A item-e witness-accumulation precedent.
- D-7 (gobbi-hook-authoring skill) — defer until post-T3 ship at N=2. Correct application of the witness-accumulation rule explicitly tied to Bundle A item-e.
- D-3 (Planning-brief mistake-load) — generate-now (annotation only); single tiny decision file binding 3 file basenames into every T1 brief. Smallest possible intervention. Correct.
- D-4 (workflow phase doc set enumeration) — generate-now (tiny design file). Correct in shape (small file) but content has the 5-vs-7 ambiguity (see project.md F-P2) — that's a content issue, not an effort calibration issue.
- Mirror policy lock + sync-mechanism backlog — both correctly minimal artifacts.

### F-Pe2 (Low, Confidence 75, general / process)

**Effort estimates on each backlog are reasonable.** "medium" for the lifecycle design doc, "medium" for the sync mechanism, "medium" for the hook-authoring skill, "ad-hoc per execution session" for the hooks watchlist. These match the actual complexity of the work.

### F-Pe3 (Low, Confidence 100, general / process)

**No over-generation detected.** The loop did not invent any out-of-scope new skill, design doc, or rule beyond what the user approved. The "Out of scope" section at line 185-192 of draft-iter1.md explicitly lists 4 items that surfaced but were not absorbed (T2 deferral, schema extension, project.json bootstrap, Memory Access Matrix cleanup). Good discipline.

### F-Pe4 (Low, Confidence 50, assumption_risk / process)

**One small over-investment risk in the sync-mechanism backlog**: it proposes 3 implementation options (`gobbi sync` CLI / symlinks / PostToolUse hook) when Preparation's job is to defer not architect. Future-session implementer might cargo-cult Option 1 (`gobbi sync` CLI, the recommended option) without re-investigating that file-symlinks already partially solve the problem (per F-P1 in project.md). Confidence 50 because the backlog is correctly stamped as future-session work; over-investment is mild.

## Must-preserve list

- The 4-skip / 3-defer / 2-generate ratio is healthy — preserve the discipline of minimizing in-loop generation.
- The witness-accumulation cadence (N=2 trigger for hook-authoring skill + lifecycle design doc) is well-cited and consistent with Bundle A item-e precedent.
- The "ad-hoc per execution session" effort note for the hooks watchlist is appropriately minimal — no upfront work, just a reminder.

## Verdict

**PASS** (effort calibration is healthy; no over-generation; defer/skip choices align with Principle 10).

