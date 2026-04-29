# PI output paths are step-conditional

---
priority: medium
tech-stack: gobbi-skills, claude-code
enforcement: advisory
---

**What happened**

`_innovation` and `_best-practice` skills said PI agent output goes to `research/innovative.md` (the v0.4.x path). PR #207's first attempt collapsed this to `ideation/review/innovative.md` — a path that does NOT exist in the canonical `_note` layout. Both the Project and Overall evaluators caught the regression: actual canonical paths are `<step>/innovative.md` for the step's main artifact and `<step>/evaluation/innovative.md` for eval sub-phase work, where `<step>` is `ideation`, `planning`, or `execution`.

**User feedback**

Cross-validated finding in PR #207's eval pass (Project F-3 + Overall F-1). Fixed in remediation commit `288d48e`.

**Correct approach**

When an Innovation or Best-practice PI agent runs:

- **As part of an Ideation step** — output to `ideation/innovative.md` (or `ideation/best.md`)
- **As part of an evaluation sub-phase** (`ideation_eval`, `planning_eval`, `execution_eval`) — output to `<step>/evaluation/innovative.md` (or `<step>/evaluation/best.md`)

Skill text describing the output path should mention BOTH contexts explicitly, OR be unambiguous about which context the skill is operating in. Do NOT collapse to a single path that doesn't exist in `_note` canonical layout.

**Why this matters**

The PI agent's output path is consumed by the orchestrator's synthesis step — the orchestrator reads from the canonical path. A skill instructing the PI agent to write to a non-canonical path (like `ideation/review/innovative.md`) means the orchestrator's read silently fails or hits the wrong file.

The canonical layout is in `_note/SKILL.md` lines 60-90. Verify against that and against observed runtime sessions (e.g., `sessions/320426b9-…/execution/evaluation/innovative.md` exists).

See PR #207 commit `288d48e` for the corrected wording. Captured during session `be54be80` on 2026-04-27.
