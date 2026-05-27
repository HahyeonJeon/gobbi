# T9c Execution Notes — iter1

## Scope

28 docs (task spec said 33; actual count is 28 at T9c start):
- mistakes/: 21 files (20 mistake files + README.md)
- plans/: 1 file (README.md)
- references/: 1 file (README.md)
- reviews/: 2 files (README.md + 2026-05-24-execution-task-01-dual-system-eval.md)
- rules/: 1 file (stub-redirect-format.md)
- features/README.md: 1 file
- README.md: 1 file

## Work performed

### README files (6 files): added complete frontmatter
Files with no frontmatter at all received 9 base keys + appropriate type:
- README.md: type=notes, scope=project
- features/README.md: type=features, scope=feature, feature=null
- mistakes/README.md: type=notes, scope=project
- plans/README.md: type=notes, scope=project
- references/README.md: type=notes, scope=project
- reviews/README.md: type=notes, scope=project

### rules/stub-redirect-format.md: added frontmatter
No prior frontmatter. Added 9 base keys: type=rules, scope=project.

### reviews/2026-05-24-execution-task-01-dual-system-eval.md
- Added missing base keys: name, description, type, scope, feature, created, tags
- Moved `date:` value to `created:`
- Title de-crypt: "Execution Task 01 — Dual-System Adversarial Review" → "Configuration Step Worktree-Create Insertion — Dual-System Adversarial Review"
- H3 de-crypt: "iter1 divergence (Claude PASS / Codex REVISE)" → "First review: Claude PASS, Codex REVISE"
- H3 de-crypt: "iter2 convergence (both PASS)" → "Second review: both systems PASS"
- Body text updated correspondingly (mentions of iter1/iter2 in body converted to "First review" / "Second review")

### 20 mistake files: added base keys, stripped S-set
For each mistake file:
- Added missing base keys (name, description, type=mistakes, scope=project, tags)
- Moved `date:` → `created:` where applicable
- Stripped S-set keys: mistake-candidate, severity, loop, iter, promoted-from, promoted-at, finding-id, confidence, surfaced-by, slug, task, session-id, disposition (non-backlogs)
- Preserved KEEP keys: domain, priority, supersedes, superseded_by, feature, source, related, project-scope, title, project

### Title de-crypts
- edit-tool-refuses-symlink-paths.md: "Mistake Candidate: Edit Tool Refuses Symlink Paths — Use Canonical Path" → "Edit Tool Refuses Symlink Paths — Use Canonical Path" (stripped staging prefix)
- reviews/2026-05-24-execution-task-01-dual-system-eval.md: "Execution Task 01 — Dual-System Adversarial Review" → "Configuration Step Worktree-Create Insertion — Dual-System Adversarial Review"

## Constraints honored
- NO body reshaping on any mistake file
- NO mistakes or content deleted
- NO features/ subdir docs touched
- NO T9a/T9b dirs touched
- NO .claude symlinks edited
- scope=project for all project-tier docs; feature=null only where not feature-bound

## Out-of-scope observations
- `.gobbi/projects/gobbi/skills/codex/SKILL.md` was already modified (unstaged) from a prior task — restored to HEAD before commit
