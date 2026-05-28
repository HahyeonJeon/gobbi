# Preparation Readiness — Memory-System Redesign

**Verdict: READY (PASS, manager-verified).** 2 non-blocking gaps identified; both deferred per user approval. No `generate-now` skills required this loop. No `re-ideate` triggers found.

## Scope reference

Ideation artifacts: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md`

Locked decisions: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md` (L1–L8 + RATIFY-1..8 outcomes)

Scope Contract: the locked design defines the scope as the memory-system redesign for the gobbi project: (a) authoring `memorization/rules.md` + companion symlink (L5/L6/RATIFY-6), (b) propagating the new standard across 7 propagation targets and 17 templates (§7), (c) adding Principle #13 (L7), (d) re-homing 4 sprint-features into the 7 ratified value-features (RATIFY-1), and (e) performing the migration edits to live memory files (§8 categories A–E). Feature: `project-memory`.

## Readiness summary

Sub-step B (design + memory readiness): 0 blocking gaps found. All 7 propagation targets exist in the live tree. All 17 memorization templates present. `memorization/rules.md` was absent at Ideation time and has since been CREATED this session (Wave 0-core, commit 90c46fd) — the primary generate-now artifact is already in place. 4 delegation templates (assistant, evaluator, executor, leader) confirmed as Load-Directive edit targets.

Sub-step C (execution skills readiness): 0 blocking gaps found. No project-specific generate-now skill required. The canonical mirror model is confirmed: edit `.gobbi/.../skills/` (worktree-absolute); `.claude/skills/` symlinks auto-reflect; `gobbi-hook-authoring` is canonical-only (no `.claude/skills/` symlink).

2 non-blocking gaps deferred (FLAG-2 and L8). Both follow-ups staged for Wrap-up to promote to project `backlogs/`.

## Design + memory readiness

**Propagation targets verified (live main tree, 2026-05-25):**

| Target | Status |
|---|---|
| `principles/SKILL.md` | Present — edit target for Principle #13 (L7) |
| `memorization/SKILL.md` | Present — edit target for staging-field-stripping, per-perspective filenames, task quartet |
| `memorization/memory-map.md` | Present — edit target for type specs, rules.md cross-ref, archive typed-subdir, session.json.lock row |
| `wrap-up/SKILL.md` | Present — edit target for frontmatter-allowlist-on-promotion, routing-table confirmation |
| `orchestration/SKILL.md` | Present — edit target for canonical session tree, eval filenames, state.json retirement |
| `delegation/SKILL.md` | Present — edit target for memorization/rules.md Load-Directive wiring (HIGH-2) |
| `CLAUDE.md` | Present (real file, not a skill mirror) — edit target for Iron Law row 13 + prose bump |

All 7 confirmed present. ✓

**Templates:**
- `memorization/templates/` holds all 17 templates (13 type templates + 4 feature-subdir templates). ✓
- All 17 are in scope for §7 #8 alignment (naming, frontmatter, scope per their per-type spec).

**`memorization/rules.md` (the primary generate-now artifact):**
- Was absent at Ideation time. Created this session (Wave 0-core, commit 90c46fd). ✓ — no longer a gap.

**4 delegation templates confirmed:**
- `delegation/templates/{assistant,evaluator,executor,leader}.md` — Load-Directive edit targets for wiring `memorization/rules.md` alongside `memorization/SKILL.md`. ✓

**Ideation artifacts (locked design):**
- `ideation/artifacts/memory-system-redesign-design.md` — full design present, iter2, dual-system eval PASS (manager-verified). ✓
- `ideation/rawdata/locked-decisions.md` — 8 locks (L1–L8) + RATIFY resolutions. ✓

No scenario-staging gaps, no checklist-staging gaps, no decision-staging gaps blocking this scope. The ideation staging `decisions/skills-mirror-is-symlinks-not-physical-copies.md` confirms the mirror model correction is already staged.

## Execution skills readiness

No project-specific execution skill needs to be generated for this loop. The work is documentation-and-migration (doc edits, git mv, frontmatter fixes) — the executor loads standard skills (`git`, `memorization/SKILL.md`, `memorization/rules.md`, `principles`). All three are present in the live canonical tree.

`memorization/rules.md` is the newly created standard; it is already available for executor load (Wave 0-core committed it at 90c46fd). No further generate-now required.

The 4 delegation templates (`delegation/templates/*.md`) are confirmed as Load-Directive edit targets but do not themselves need to be authored from scratch — they already exist and require only the `memorization/rules.md` wiring addition.

## Generated this loop

No new staging artifacts generated during Preparation WORK. The one artifact that would normally be a generate-now output — `memorization/rules.md` — was created during Execution Wave 0-core (commit 90c46fd) before this Preparation loop ran; it pre-exists the loop and is confirmed present.

Two follow-up files staged (deferred findings, not generate-now skills):

- `preparation/staging/decisions/claude-doc-standard-skill-missing.md` — FLAG-2 follow-up (backlog candidate for `project-memory` feature, project-scope)
- `preparation/staging/decisions/skills-agents-canonical-location-contradiction.md` — L8 follow-up (backlog candidate for `project-memory` feature, project-scope)

## Out of scope gaps

**FLAG-2 — `skills/claude/SKILL.md` absent (non-blocking).**
CLAUDE.md links `skills/claude/SKILL.md` but no `claude` or `_claude` directory exists under `.claude/skills/` or the canonical `.gobbi/.../skills/` tree (18 canonical dirs confirmed, none named `claude`/`_claude`). Principle #13 now cites the doc standard generically rather than naming a specific skill (MED-8 remediation), so this is not a hard blocker for the current session. Relevance: `project-memory` feature, the doc-authoring standard's intended home; the CLAUDE.md "claude skill" navigation row is itself a dangling reference. Deferred to `backlogs/` for a future session.

**L8 — `skills/` + `agents/` canonical-location contradiction (non-blocking).**
The `memorization/memory-map.md` and `wrap-up/SKILL.md` describe differing canonical locations for the `skills/` and `agents/` directories (memory-map excludes them from its write surface; wrap-up lists them as a write target). This touches symlink/plugin mirroring. Explicitly out of scope per L8 lock — do not relocate or rework `.gobbi/projects/gobbi/skills/` (18 dirs) or `agents/` this session. Deferred to `backlogs/` for a future session.

**No other gaps.** No missing scenarios, checklists, or decisions in project memory block the current scope.

## Decisions log

### User decisions made during Preparation DISCUSSION

The locked decisions from Ideation (L1–L8) are carried forward verbatim. The RATIFY resolutions were obtained during Ideation DISCUSSION, and they bind Planning. Key resolutions:

| Lock | Decision | Status |
|---|---|---|
| L1 | 7 developer-vibe features: `workflow`, `project-memory`, `agents`, `evaluation`, `guardrails`, `git-workflow`, `install-runtime`. 18 canonical skill dirs mapped. 4 sprint-features re-homed. | LOCKED |
| L2 | Session = verb; durable narrative in `notes/` + `sessions/`; conclusions promote into features. | LOCKED |
| L3 | All 13 project-level types retained with crisp per-type specs. | LOCKED |
| L4 | Per-type declared scope + promote-up trigger. | LOCKED |
| L5 | Naming: directory-as-category + atomic concept slug (≤6 words / ≤~35 chars); temporal split (date-prefixed for time-indexed types; bare-slug for evergreen). | LOCKED |
| L6 | Frontmatter: shared base + per-type extensions on every memory file; staging-only fields stripped on promotion. | LOCKED |
| L7 | Add Principle #13: "NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN." | LOCKED |
| L8 | `skills/` + `agents/` directories: OUT OF SCOPE this session. File a follow-up for the memory-map-vs-wrap-up canonical-location contradiction. | LOCKED |

**RATIFY resolutions (Ideation AskUserQuestion outcomes):**

| Item | Resolution |
|---|---|
| RATIFY-1 | 7 value-features ratified with dev-vibe slugs as listed. `guardrails` kept unified; `install-runtime` kept broad. 4-sprint→value-feature mapping approved. |
| RATIFY-2 | Rules frontmatter: L6 wins. Base frontmatter added to every memory file (rule file included); `stub-redirect-format.md`'s "No frontmatter" clause rescoped to stub-redirect TARGET docs only. |
| RATIFY-3 | `plans/` is feature-only for the loop path (HARD). Project-level `plans/` = maintainer-authored roadmaps only, never loop-written. |
| RATIFY-4 | `planning/rawdata/restore/` folds into `rawdata/`. No separate sub-scratch tier. |
| RATIFY-5 | Drop `promoted-from`/`promoted-at` provenance frontmatter. `git log` + base `session` field suffice. |
| RATIFY-6 | Memory-rules home: dedicated `memorization/rules.md` sibling (one canonical file + one `.claude` symlink), cross-referenced from `memory-map.md`. Three-way disambiguation added. |
| RATIFY-7 | Session-memory cleanup: going-forward + opportunistic only. NO full retro-sweep of closed sessions. |
| RATIFY-8 | Remove `tmp/`. Route scratch to `{loop}/rawdata/`. No second scratch tier documented. |

**gobbi-install — non-feature classification confirmed.** `gobbi-install` is a CLI effort (not a skill dir). Install/runtime knowledge documented in `gobbi/SKILL.md` + the install dir. No `gobbi-install` feature created.

**Full migration in scope.** User chose full migration this session (categories A–E per §8). Sequence: standards-first (E), then re-homing (A), then renames (B), frontmatter fixes (C), session-memory cleanup (D going-forward + opportunistic).

**FLAG-2 + L8 classification — non-blocking, deferred.** Both confirmed out of scope for this session. Staged as follow-up backlog candidates for Wrap-up to promote.
