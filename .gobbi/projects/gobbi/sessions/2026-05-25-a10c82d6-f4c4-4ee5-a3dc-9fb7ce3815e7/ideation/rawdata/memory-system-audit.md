# Memory-System Audit (Ideation rawdata)

Session 2026-05-25-a10c82d6. Read-only audit by assistant (sonnet). Source: live tree at `.gobbi/projects/gobbi/` (canonical, worktrees/ excluded) + memorization/wrap-up/orchestration skills + CLAUDE.md. Full report in session transcript.

## Live project-memory types (count / naming / what it ACTUALLY is)

| Type | Files | Naming observed | Reality |
|---|---|---|---|
| `features/` | 4 dirs (~140 files) | `kebab-slug` (no date) | **task/session work-records** (env-var-audit, bundle-a/b/c), NOT durable product capabilities |
| `backlogs/` | 10 | `kebab-slug.md`; 4 use `item-N-M-` prefix | deferred work items |
| `notes/` | 5 | `YYYY-MM-DD-slug.md` | per-session dev journal |
| `mistakes/` | 20 | `kebab-slug.md` | failure patterns; retain `mistake-candidate:true` post-promotion |
| `rules/` | 1 | `kebab-slug.md` | behavioral rules; live file has NO frontmatter |
| `design/` | 2 | `kebab-slug.md` | cross-feature design; live files use non-template frontmatter keys |
| `decisions/` | 0 (README only) | — | empty at project level |
| `plans/` | 0 (README only) | — | empty at project level (all under features/) |
| `reviews/` | 1 | `YYYY-MM-DD-slug.md` | review/audit outputs; matches template |
| `reports/` | dir absent | — | none produced |
| `learnings/` | 5 | `kebab-slug.md`; 1 uses finding-ID prefix | cross-cutting insights |
| `archive/` | 9 (typed subdirs) | `archive/{type}/YYYY-MM-DD-slug.md` | moved terminal artifacts |
| `references/` | 0 (README only) | — | none at project level |
| `skills/` | 18 dirs | mirror of `.claude/skills/` | project skill overrides — DISPUTED whether it's "memory" |
| `agents/` | 5 md+toml | role defs | not a documented memory type |
| `tmp/` | README only | — | UNDOCUMENTED |

## Key findings

**B — features/ is the keystone problem.** All 4 entries are bounded maintenance/refactor sprints (`env-var-audit`, `gobbi-orchestration-workflow-improvements` aka Bundle A, `session-foundations-bundle-b`, `session-foundations-bundle-c`). None is a durable product capability. NO skill doc defines what qualifies as a "feature"; `feature-readme.md` template allows `status: shipped` so task-records validate. There is NO template governing the feature directory itself or its naming — only an inner `feature-readme.md`.

**Taxonomy is large (13 project types) with overlap.** notes vs decisions vs design vs learnings vs reviews vs reports have fuzzy boundaries. Several types are empty/unused (decisions, plans, reports, references at project level).

**Naming is inconsistent.** Date-prefixed for notes/decisions/plans/reviews/reports/archive; bare slug for backlogs/mistakes/learnings/design/rules/references. Live deviations: loop-phase decision bundles (`ideation-decisions.md`), `item-N-M-` backlog prefixes, finding-ID learning slugs, merged `task-07-08/`.

**Frontmatter drift.** mistakes retain staging `mistake-candidate:true`; design uses ad-hoc keys; rules file has none. Templates exist (17 in memorization/templates/) but live files diverge.

**Contradictions across skills.** (1) `skills/` placement: memory-map.md excludes it as "not memory", wrap-up/SKILL.md lists it as a write target. (2) archive/ flat-slug (memory-map) vs typed-subdir (design doc + live). (3) decisions: one-per-file ADR (template) vs loop-bundle files (live).

**Session memory clutter.** Non-standard subdirs: `wrap-up/evaluation/followups/`, `planning/rawdata/restore/`; undocumented `state.json`, `session.json.lock` at session root; per-perspective eval filenames inconsistent across tasks.

## Implication for redesign
Need: (1) a crisp definition of each memory type with non-overlapping purpose; (2) a feature = durable-capability model distinct from session/task work; (3) one coherent naming convention keyed to type semantics (timeless vs time-stamped); (4) a frontmatter standard per type; (5) resolution of the 3 cross-skill contradictions; (6) a documentation principle (spec + CRUD thinking) in principles/.
