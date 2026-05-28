# T9c Execution Notes — iter2 (re-run)

## Context

Prior iter1 attempt committed to develop (main tree) via cwd-reset bug. This iter2 re-runs T9c cleanly using git -C "$WT" for all git operations.

## Scope (28 docs)

- `mistakes/`: 26 files (25 mistake files + README.md)
- `plans/`: 1 file (README.md)
- `references/`: 1 file (README.md)
- `reviews/`: 2 files (README.md + 2026-05-24-worktree-create-config-step-dual-system-eval.md)
- `rules/`: 1 file (stub-redirect-format.md)
- `features/README.md`: 1 file
- `README.md` (project root): 1 file

## Pre-flight status

### §4.5 gate result: 0 violations (no S-key leaks in T9c scope)

### Files requiring changes:

**Frontmatter missing entirely (6 placeholder READMEs):**
- README.md (project root) — no frontmatter
- features/README.md — no frontmatter
- mistakes/README.md — no frontmatter
- plans/README.md — no frontmatter
- references/README.md — no frontmatter
- reviews/README.md — no frontmatter

**Missing base keys in existing frontmatter:**
- mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md — missing `tags:`
- reviews/2026-05-24-worktree-create-config-step-dual-system-eval.md — missing name, description, type, scope, feature, created, tags (7 keys); has `date:` (→ move to `created:`)

**Title de-crypt (§4.1 concept-first, §1.3 anti-patterns):**
- edit-tool-refuses-symlink-paths.md: `# Mistake Candidate: Edit Tool Refuses Symlink Paths — Use Canonical Path` → drop "Mistake Candidate:" prefix
- naming-standard-needs-positive-guidance-not-just-blocklist.md: `# Mistake — a naming standard must teach what GOOD looks like, not only forbid patterns` → drop "Mistake —" prefix
- symlink-restore-depth-wrong.md: `# Symlink restore recipe used wrong `../` prefix depth (addressed in iter2)` → drop "(addressed in iter2)" coordinate
- reviews/2026-05-24-worktree-create-config-step-dual-system-eval.md: `# Execution Task 01 — Dual-System Adversarial Review` → de-crypt "Task 01" positional index → `# Worktree-Create Config Step Insertion — Dual-System Adversarial Review`

**Already conformant (no changes needed):**
- rules/stub-redirect-format.md: all 9 base keys present, concept-first title
- All other 22 mistake files: frontmatter complete, no S-keys

## Decisions

- README files: type=notes (they are placeholder description/index docs), scope=project
- features/README.md: type=features, scope=project, feature=null (per task spec explicit constraint)
- reviews/README.md: type=notes (placeholder), scope=project
- Mistakes files: NO body reshaping per task spec constraint

## KEEP keys verified

- `title`, `project` — neither appears in T9c mistake files as a standalone key (checked)
- `domain`, `priority`, `supersedes`, `superseded_by` — all preserved throughout
- `feature` key on design-literal (feature: project-memory) — preserved
- `feature` key on naming-standard (feature: project-memory) — preserved
- `feature` key on manager-skipped-dual-system-eval (feature: workflow) — preserved
- `feature` key on sendmessage-continued (feature: project-memory) — preserved
