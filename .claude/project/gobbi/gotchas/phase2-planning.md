# Phase 2 Planning Gotchas

Gotchas discovered during v0.5.0 Phase 2 planning workflow (session 0f8427c1, 2026-04-16).

---

## GitHub labels referenced in plans must exist before issue creation

**Priority:** Medium

**What happened:** The Phase 2 plan specified creating an umbrella issue with labels `phase-2`, `breaking-change`, `major-version`. The project-perspective evaluator ran `gh label list` and confirmed NONE of these labels existed in the repo. `gh issue create --label "phase-2"` would have failed with "label not found."

**User feedback:** Flagged by plan evaluator (MAJOR-3 project). No user correction, but the gap would have blocked Step 4 execution.

**Correct approach:** Before any `gh issue create` with labels, verify the labels exist: `gh label list | grep -E "^(phase-2|breaking-change|major-version)"`. If missing, create them first: `gh label create phase-2 --description "v0.5.0 Phase 2 umbrella" --color "0052cc"`. Repeat for each referenced label. Ideally the plan itself should include this as a prerequisite step.

---

## Plugin config lives at `plugins/gobbi/.claude-plugin/plugin.json`, not `plugins/gobbi/plugin.json`

**Priority:** High

**What happened:** Research synthesis and an early draft of the plan referenced `plugins/gobbi/plugin.json`. The project-perspective evaluator discovered via `find` that the actual path is `plugins/gobbi/.claude-plugin/plugin.json`. Had this gone into execution, PR F.6 would have created a spurious `plugins/gobbi/plugin.json` while leaving the actual config at 0.4.5.

**User feedback:** Flagged by multiple eval perspectives.

**Correct approach:** The Claude Code plugin directory convention places `plugin.json` inside a `.claude-plugin/` subdirectory. When referencing plugin config files, `find plugins/ -name 'plugin.json'` to confirm the actual location before writing it into design docs or plans.

---

## Always verify new library recommendations against current package.json

**Priority:** High

**What happened:** Research recommended `ajv` for JSON Schema validation. The research synthesis and plan built on the assumption it was already installed. The project-perspective evaluator caught that `packages/cli/package.json` had ZERO production dependencies — a deliberate architectural choice — and adding `ajv` was a meaningful first-production-dep change that hadn't been flagged as such.

**User feedback:** Flagged by plan evaluator (CRIT-2 project). Addressed by user via AskUserQuestion with explicit approval of adding ajv as first production dep.

**Correct approach:** During research phase, when recommending any library, read the target project's package.json (or equivalent) and explicitly state whether the library is pre-existing or new. For projects with dependency-count opinions, frame any new dependency as an architectural decision requiring user approval. "Use ajv" is not a complete recommendation without "(new production dep — package.json currently has zero)."
