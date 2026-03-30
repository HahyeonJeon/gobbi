# Docs Refactoring

Discussion memo for restructuring `.claude/` documentation categories and naming conventions. This will drive the next implementation task.

---

## Decision 1: Category System

Replace the current subcategories (Core/Workflow/Utils) with a new top-level category system.

### Category: Work (12 skills)

Principle: **Workflow participants** — skills loaded during the ideate-plan-execute-collect cycle.

| Skill | Role |
|-------|------|
| _orchestration | Coordinator, phase transitions |
| _discuss | Structured discussion at every stage |
| _ideation | Step 1: brainstorming, options |
| _plan | Step 2: task decomposition |
| _delegation | Step 3: subagent briefing |
| _execution | Step 3: single-task execution guide |
| _collection | Step 4: persist workflow trail |
| _note | Writes at every step |
| _evaluation | Quality gates, evaluator dispatch |
| _git | Worktree/PR lifecycle |
| _notification | Session notifications |
| _gotcha | Mistake knowledge base |

### Category: Docs (5 skills)

Principle: **`.claude/` documentation authoring** — skills about writing and maintaining claude docs.

| Skill | Status |
|-------|--------|
| _claude | Exists — core writing standard |
| _claude-skills | Rename from `_claude_skills` |
| _claude-agents | Rename from `_claude_agents` |
| _claude-rules | **New** — promote from `_claude/rules.md` child doc |
| _claude-project | **New** — promote from `_claude/project.md` child doc |

Note: `_claude_skills` child docs (authoring.md, verification.md) stay as child docs, not promoted to standalone skills.

## Decision 1b: Child Skill Categories

Parent skills in Work can have child skill categories. These describe more specific principles and guidelines under the parent.

### Category: Evaluation (3 child skills of _evaluation)

Stage-specific evaluation criteria. **Promoted from `__` to `_`** (hidden, not internal).

| Skill | Status |
|-------|--------|
| _ideation-evaluation | Rename from `__ideation_evaluation`, promote to `_` |
| _plan-evaluation | Rename from `__plan_evaluation`, promote to `_` |
| _execution-evaluation | Rename from `__execution_evaluation`, promote to `_` |

### Category: Git (child skills of _git)

Placeholder — specific child skills TBD in future tasks.

### Category: Notification (3 child skills of _notification)

Channel-specific notification skills. **New** — created from scratch, not split from _notification.

| Skill | Status |
|-------|--------|
| _slack | **New** — Slack notification setup and integration |
| _telegram | **New** — Telegram notification setup and integration |
| _discord | **New** — Discord notification setup and integration |

### Category: Gotcha (2 child skills of _gotcha)

Skills describing how to record gotchas. **New** — created from scratch.

| Skill | Status |
|-------|--------|
| _project-gotcha | **New** — how to record project-specific gotchas |
| _skills-gotcha | **New** — how to record skill-specific gotchas |

Future direction: each skill will have its own `gotchas.md` file for recording gotchas, replacing the current centralized model where all gotcha files live under `_gotcha/{skill}.md`.

### Remaining (to be categorized)

- gobbi (interface entry point)
- 5 evaluation perspective skills — separate category (details TBD)
- __validate, __benchmark (dev tooling)
- _audit, _project-context (session utils)

---

## Decision 2: Global Naming Convention Change

**Hyphens replace underscores** as word separators in all skill and agent names.

- Visibility tier prefixes unchanged: `_` (hidden), `__` (internal), none (interface)
- Single-word names unaffected: `_plan`, `_git`, `_gotcha`, `_note`, `_audit`, `_claude`, etc.
- Multi-word names change: `_claude_skills` → `_claude-skills`, `__evaluation_project` → `__evaluation-project`, `__skills_grader` → `__skills-grader`, `_project_context` → `_project-context`

Affects:
- All skill directory names under `.claude/skills/`
- All agent filenames under `.claude/agents/`
- The naming convention rule (`__gobbi_convention.md` → `__gobbi-convention.md`)
- All cross-references in skill docs, agent definitions, gotcha files, CLAUDE.md, and settings.json

> **Note:** Decision 2 was superseded. PR #31 adopted underscore naming instead of hyphens.

---

## Decision 3: Gotcha System Redesign

Current model: all gotcha files centralized under `_gotcha/` skill directory (`_gotcha/_orchestration.md`, `_gotcha/_git.md`, etc.).

Future model: each skill has its own `gotchas.md` file in its skill directory. Two child skills (_project-gotcha, _skills-gotcha) under _gotcha describe how to record each type.

---

## Pending Decisions

- Categories for remaining skills: gobbi (interface), 5 evaluation perspectives, __validate, __benchmark, _audit, _project-context
- Whether agents follow the same category system as skills
- Benchmark scenarios categorization
