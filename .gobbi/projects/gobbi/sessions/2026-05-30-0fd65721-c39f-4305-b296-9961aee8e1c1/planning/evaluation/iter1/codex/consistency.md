# Consistency

## COD-CONS-001 — T7 creates a new canonical skill after T1, but the sync gate is worded against the canonical skills set

Type: assumption_risk
Severity: Medium
Confidence: 75

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/artifacts/preparation-readiness.md:92-94` defines the named re-sync trigger as any commit touching `.gobbi/projects/gobbi/skills/` requiring re-materialization of `plugins/gobbi/{skills,agents,hooks}/`.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:106-110` makes T1 verify exactly 18 package skill dirs matching the canonical set.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:200-207` then creates `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` in T7.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:345` and `:365` say the new `claude-plugin` skill must not be added to the plugin package because the 18-skill inventory is frozen.

Why-it-matters:
At terminal state, the canonical skills root will contain the new `claude-plugin` skill while the package is intended to remain at 18 skills. A sync script implemented by globbing the canonical skill root will either start failing after T7 or package an explicitly out-of-scope skill. A script implemented with a fixed allowlist can be correct, but the plan does not make that requirement part of T1/T7 verification.

Suggested-direction:
Pin the sync script to an explicit packaged-skill allowlist and rename the trigger from "any `.gobbi/.../skills/` edit" to "any packaged canonical skill edit" with an explicit `claude-plugin` exclusion. Add a final post-T7 `scripts/sync-plugin-package.sh --check` expectation, or state that `--check` must still pass after T7 with 18 packaged skills.
