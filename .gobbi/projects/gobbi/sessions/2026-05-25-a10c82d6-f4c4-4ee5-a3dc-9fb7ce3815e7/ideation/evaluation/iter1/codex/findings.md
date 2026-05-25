# Codex Adversarial Design Review — Iter1

Artifact reviewed: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/draft-iter1.md`

## 1. CORRECTNESS

### COR-1 — The "all 18 skills housed under 7 features" claim is factually false

Severity: Critical

Evidence:
- `draft-iter1.md:21` says the 18 skills are grouped at `.claude/skills/gobbi/SKILL.md:156-194`; `draft-iter1.md:49` claims the 7 features house all 18 skills.
- Live canonical count excluding worktrees: `.gobbi/projects/gobbi/skills/` has 18 skill dirs, including `gobbi` and `gobbi-hook-authoring`; `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md:2` names the live `gobbi-hook-authoring` skill.
- Live `.claude/skills/` has 17 skill dirs, not 18, and has no `gobbi-hook-authoring` dir.
- `draft-iter1.md:43` and `draft-iter1.md:49` count `gobbi-install`, but live search count for `*install*` under both `.gobbi/projects/gobbi/skills/` and `.claude/skills/` is 0.
- `draft-iter1.md:38`, `draft-iter1.md:49`, and `draft-iter1.md:461` rely on `_claude`/`claude`; live `test -d` count for `.claude/skills/claude`, `.claude/skills/_claude`, `.gobbi/projects/gobbi/skills/claude`, and `.gobbi/projects/gobbi/skills/_claude` is 0.

Why-it-matters: Deliverable (1) is the canonical feature list and ownership map. The current map assigns ownership to non-existent skills while omitting live skills, so downstream migration and propagation planning would route real files incorrectly.

### COR-2 — The Bundle C feature mapping is weakly supported by the cited README

Severity: Medium

Evidence:
- `draft-iter1.md:60` maps `session-foundations-bundle-c` primarily to `git-workflow`.
- Live `.gobbi/projects/gobbi/features/session-foundations-bundle-c/README.md:15-21` lists shipped items spanning backlog closure, orchestration row reorder, mistake/hook work, session-lifecycle design, CCSI wording, and CLAUDE/AGENTS sweep; only part of that list is directly git-workflow.

Why-it-matters: The migration re-homes sprint artifacts by primary value-feature. A weak primary mapping creates judgment-heavy routing where the design presents the mapping as already settled.

## 2. COMPLETENESS

### COMP-1 — `changelogs/` is used as a memory type without a type spec

Severity: High

Evidence:
- Locked L4 treats `changelogs` as feature-only: `locked-decisions.md:15`; L5 includes it in the temporal split: `locked-decisions.md:18`.
- The draft uses `changelogs/` in the migration and memory model at `draft-iter1.md:62`, `draft-iter1.md:73`, `draft-iter1.md:194`, `draft-iter1.md:259`, `draft-iter1.md:262`, and `draft-iter1.md:422`.
- The 13 type-spec headings run from `draft-iter1.md:72` through `draft-iter1.md:168`; there is no `changelogs/` spec.
- Live `memorization/memory-map.md` already has changelog staging, feature destination, and template rows at `.gobbi/projects/gobbi/skills/memorization/memory-map.md:57`, `:92`, and `:136`.

Why-it-matters: The design creates and migrates changelog files but gives no purpose, boundary, scope, frontmatter, or CRUD lifecycle for them. Implementers cannot apply the stated standards to this live memory surface without inventing rules.

### COMP-2 — The migration plan is not a full migration plan for the live feature files

Severity: High

Evidence:
- Live feature tree count excluding the root `features/README.md`: 136 markdown files across the four current feature dirs; per-feature counts are `env-var-audit` 7, `gobbi-orchestration-workflow-improvements` 22, `session-foundations-bundle-b` 101, and `session-foundations-bundle-c` 6.
- `draft-iter1.md:418` says detailed per-file task decomposition is "the Planning loop's job".
- `draft-iter1.md:422` labels feature re-homing as rough size `~140 files` and "judgment-heavy per-file routing".

Why-it-matters: Deliverable (8) asks for a full migration plan for the live files. The draft gives a strategy and rough sizing, but no per-file inventory or destination mapping for the largest and riskiest category.

## 3. INTERNAL CONSISTENCY

### CONS-1 — The plans spec violates the locked feature-only scope

Severity: High

Evidence:
- Locked L4 says some types are feature-only, explicitly including `plans`: `locked-decisions.md:15`.
- `draft-iter1.md:147` says plans are feature-only for loop output, but also keeps project-level `plans/` for cross-feature roadmaps/release plans.
- `draft-iter1.md:448` repeats the same split: "plans are feature-only for the loop path; project `plans/` = maintainer-authored roadmaps only."
- Live memory-map currently documents project-wide plans at `.gobbi/projects/gobbi/skills/memorization/memory-map.md:108`.

Why-it-matters: This is a direct lock-violation, not a critique of the lock. It leaves `plans/` both feature-only and project-level depending on author path, so the boundary is not hard and non-overlapping.

### CONS-2 — The shared frontmatter base contradicts the `features/` and `archive/` specs

Severity: High

Evidence:
- `draft-iter1.md:77` says feature `README.md` frontmatter uses the shared base, but `draft-iter1.md:75` says a feature directory is its own tier "not project/feature-tagged"; the shared base requires `scope: project | feature` at `draft-iter1.md:294`.
- `draft-iter1.md:170` says archive is not a type-of-content and archived artifacts retain their original type frontmatter; `draft-iter1.md:173` says archive frontmatter is the original type's base plus archival fields; but the shared base enum includes `type: ... | archive` at `draft-iter1.md:293` and the extension table has a separate `archive` row at `draft-iter1.md:319`.

Why-it-matters: Deliverable (5) requires a shared-base plus per-type frontmatter standard. The draft leaves implementers unable to stamp feature and archive frontmatter without choosing between contradictory schema interpretations.

### CONS-3 — The naming standard conflicts with per-type slug word counts

Severity: Medium

Evidence:
- Locked L5 requires atomic slugs of 3-5 words: `locked-decisions.md:18`.
- The draft repeats 3-5 words in the naming rules at `draft-iter1.md:250`.
- Individual specs allow 3-6 words for notes, decisions, and mistakes at `draft-iter1.md:84`, `draft-iter1.md:92`, and `draft-iter1.md:108`.

Why-it-matters: Deliverable (4) is a naming standard. The same document gives incompatible word-count limits, so filename review becomes subjective.

## 4. MIGRATION RISK

### MIG-1 — The dual-tree mirror model and doubled-edit accounting are wrong for the live tree

Severity: High

Evidence:
- `draft-iter1.md:242` describes `memorization/rules.md` as a `×2 mirror`; `draft-iter1.md:395` says every `.claude/skills/...` file is mirrored to `.gobbi/projects/gobbi/skills/...` as a physical copy and physical edits double.
- Live counts: `.claude/skills/` contains 56 symlinks and 0 regular files; `.gobbi/projects/gobbi/skills/` contains 57 regular files.
- Live `stat` evidence: `.claude/skills/memorization/SKILL.md` is a symbolic link, while `.gobbi/projects/gobbi/skills/memorization/SKILL.md` is a regular 38,694-byte file.
- Live compare evidence: `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` exists, but there is no `.claude/skills/gobbi-hook-authoring/SKILL.md`.

Why-it-matters: The migration sizing and propagation risk model are built on physical-copy doubling. The live tree is symlink-backed with one extra unmirrored skill, so the plan both overcounts some edits and misses a real propagation asymmetry.

### MIG-2 — Session cleanup inventory is incomplete relative to live session artifacts

Severity: Medium

Evidence:
- `draft-iter1.md:229` cites one `state.json` example and `draft-iter1.md:230` cites one root `HANDOFF.md` example.
- Live counts under `.gobbi/projects/gobbi/sessions/`: 5 `state.json` files and 2 root `HANDOFF.md` files.
- `draft-iter1.md:425` says session cleanup is going-forward plus opportunistic, no full retro-sweep.

Why-it-matters: The plan's blast-radius statement for session cleanup is not an accurate inventory. Even with the locked no-retro-sweep decision, opportunistic cleanup needs to know how many known deviations exist.

## 5. PRINCIPLE #13

### P13-1 — Principle #13 embeds the false mirror premise

Severity: High

Evidence:
- Principle #13 says mirrored docs require the CRUD plan to list both `.claude/skills/` and `.gobbi/projects/{name}/skills/` copies at `draft-iter1.md:365-367`.
- The same draft's propagation section states physical-copy doubling at `draft-iter1.md:395`.
- Live counts contradict that premise: `.claude/skills/` has 56 symlinks and 0 regular files; `.gobbi/projects/gobbi/skills/` has 57 regular files, including the unmirrored `gobbi-hook-authoring/SKILL.md`.
- The P8/P13 delineation itself is crisp at `draft-iter1.md:370-376`; the defect is the false blast-radius premise inside P13's procedure.

Why-it-matters: Deliverable (6) is the new principle text. As written, it trains future documentation work to scope mirrored files using a model that is not true in the live repo.

VERDICT: FAIL
