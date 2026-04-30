# Feature Pass Template

Starting doc for any v0.5.0 feature pass. Read this before Ideation. It captures the cross-feature patterns locked during Pass 2 so each pass starts from the same foundation rather than rediscovering them.

---

## What a Feature Pass Is

A feature pass is a single session that ships "Doc + Fix + Test" for one feature. Each pass opens a feature directory under `.gobbi/projects/gobbi/design/v050-features/{feature}/` and adds or updates:

- `README.md` — feature description for the operator
- `scenarios.md` — Given/When/Then scenario inventory keyed by scenario ID
- `checklist.md` — verification items tracing to scenario IDs, tagged with ISTQB technique
- `review.md` — DRIFT/GAP/NOTE triage with commit-SHA-backed Resolution fields

Code changes and tests accompany the docs in the same pass. The full pass completes in one session — scope down rather than split across sessions.

See `feedback_feature_pass_one_session.md` (in memory) for the constraint that locked this.

---

## Session Layout

Every feature pass uses the worktree at `.gobbi/worktrees/` and a branch off the phase integration branch. The PR base is that phase branch, not `main`.

Session state lives at `.gobbi/projects/gobbi/sessions/{session_id}/`. Step dirs: `ideation/`, `planning/`, `execution/`, `memorization/`. Gotchas captured during the pass go into `.gobbi/projects/gobbi/learnings/gotchas/`.

---

## Locked Patterns from Pass 2

These patterns are the source of truth for any pass that touches the same surface areas.

### Schema migration pattern

New columns use an idempotent `PRAGMA table_info`-guarded ALTER. The guard checks whether the column already exists before issuing `ALTER TABLE ... ADD COLUMN`. This means the migration is safe to run multiple times — second runs are no-ops. The pattern from Pass 2 adding `session_id` and `project_id` columns is the reference implementation; read `packages/cli/src/workflow/migrations.ts` for the exact approach.

### Evaluation wiring

`resolveEvalDecision` is the single function that translates `evaluate.mode` settings into `{ enabled, source }` at step boundaries. Do not inline this logic. The Q2→evalConfig e2e test in `packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` covers the full 4-mode × 3-step matrix — extend it when adding new modes or steps, do not create a separate test.

### Settings path constants

All paths under `.gobbi/` must go through `workspace-paths.ts`. Hard-coding paths like `.gobbi/projects/<name>/settings.json` as literals bypasses the multi-project routing keyed off `basename(repoRoot)` and the `--project` flag. If a function constructs a path by string concatenation rather than calling `workspacePaths(root, projectName)`, it is a bug.

### Step directory creation

`ensureSessionStepDir(sessionDir, step)` is the canonical step-directory creator. Do not call `fs.mkdirSync` directly on step paths. The helper also validates the step name against the enum — it catches stale step names like `plan` that were renamed to `planning`.

### Review.md format

Every feature pass produces a `review.md` with a DRIFT/GAP/NOTE triage table. Each row has: ID, category, description, severity, and Resolution. Resolution entries must include the commit SHA that fixed or deferred the item. No resolution field may say "TBD" after the pass commits — either fix it and cite the SHA or defer it with a filed issue number. The format locks what counts as done versus deferred.

---

## Solo-User Context

Gobbi has one user. Decisions must be made on engineering merit only — ignore backcompat, migration paths for external users, and documentation aimed at new users learning the system. When two approaches are equivalent on engineering merit, prefer the simpler one. See `feedback_solo_user_context.md` in memory for the origin of this constraint.

---

## Scope Discipline

A feature pass covers one feature directory and its immediate code dependencies. Observations about adjacent features go into the `review.md` triage table as deferred items with filed issue numbers — they do not get implemented in the same pass. The pass that ships without scope creep is the pass that finishes in one session.

---

## Verification Before Close

Before committing the final pass:

1. `bun test` — all tests pass, zero fail
2. `bun run typecheck` — zero errors
3. All `TODO(PR ...)` markers for this pass are resolved
4. `review.md` Resolution fields have SHA or issue references, none say TBD
5. `checklist.md` items trace 1:1 to scenario IDs in `scenarios.md`
6. `gobbi-memory/README.md` tier model is consistent with any path references in the new docs
