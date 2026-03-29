# Gotcha: gobbi-plan

Mistakes in planning and task decomposition.

---

### Use EnterPlanMode when writing an improved plan

**Priority:** High

**What happened:** After plan evaluation feedback, the orchestrator rewrote the improved plan in conversation text instead of using EnterPlanMode. The improved plan was not persisted to the plan file and lacked the structured exploration that plan mode provides.

**User feedback:** When writing an improved plan, use EnterPlanMode tool.

**Correct approach:** Every time the plan needs revision (after evaluation feedback, after user discussion), call EnterPlanMode to enter plan mode. Explore the codebase as needed, write the improved plan, then call ExitPlanMode to present it. This ensures the plan is always written to the plan file and benefits from read-only exploration before committing to changes.
