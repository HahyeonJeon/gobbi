---
session: 06668274-cee3-4bc0-9125-91a327467cd2
created: 2026-06-06
---

# Promotion Manifest — Session 2026-06-05-06668274

Append-only routing-decision log. One entry per staged file.

---

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

- **Loop: execution** — staging present; 11 files; all per-finding `{slug}.md` shape; frontmatter types are `decisions` and `backlogs` (on-vocabulary). 3 mistake-candidates use `type: decisions` with `mistake-candidate: true` — correct staging shape; Wrap-up routes them to `mistakes/`. No gaps.
- **Loop: planning** — no `staging/` directory. Planning produced artifacts (planning/artifacts/*.md) not staging files. In Chat mode, planning artifacts are not routed through staging — this is the expected shape. No compliance gap.

---

## Promotion decisions

### 1. `execution/task-01/staging/decisions/2026-06-05-orchestration-entry-point-removed-as-gobbi-front-door-duplicate.md`
- **Action:** PROMOTED
- **Destination:** `features/workflow/decisions/2026-06-05-orchestration-entry-point-removed-as-gobbi-front-door-duplicate.md`
- **Routing basis:** `staging/decisions/` with no `mistake-candidate` → `features/{feature}/decisions/`; feature = workflow (per delegation routing + decision tags).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed; decision_status, supersedes, superseded_by are allowed for decisions type.

---

### 2. `execution/task-03/staging/decisions/2026-06-05-always-worktree-model-replaces-direct-mode.md`
- **Action:** PROMOTED
- **Destination:** `features/git-workflow/decisions/2026-06-05-always-worktree-model-replaces-direct-mode.md`
- **Routing basis:** `staging/decisions/` → `features/{feature}/decisions/`; feature = git-workflow (explicit in frontmatter).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 3. `execution/task-03/staging/decisions/2026-06-05-table-renumber-must-sweep-inbound-row-references.md`
- **Action:** PROMOTED (mistake-candidate → features/guardrails/mistakes/)
- **Destination:** `features/guardrails/mistakes/table-renumber-must-sweep-inbound-row-references.md`
- **Routing basis:** `mistake-candidate: true` → `features/guardrails/mistakes/` (user-confirmed scope from delegation prompt).
- **Dedup decision:** RELATED but DISTINCT from two existing renumber mistakes.
  - `renumber-verify-target-still-owns-the-subdiscipline.md` — addresses lineage-based renumbering pointing at the wrong principle after a merge (content ownership mismatch). DIFFERENT TRAP.
  - `renumber-distinguish-live-pointers-from-historical-records.md` — addresses live-vs-historical partitioning before a sweep. DIFFERENT TRAP.
  - My candidate addresses: positional-reference blindness (row numbers are not concept keywords, so keyword sweeps miss them). Distinct trap, distinct fix. Added cross-refs to both existing files.
- **Frontmatter stripped:** `mistake-candidate: true`, `decision_status` (not in mistakes-type allowlist), `scope: project` → strip (guardrails feature scope overrides).
- **Layer-2 candidate:** YES — staged file notes this; generalizes to any numbered table/list with inbound positional cross-refs across all projects.

---

### 4. `execution/task-04/staging/backlogs/interview-skill-line72-ties-gate-to-configuration.md`
- **Action:** PROMOTED
- **Destination:** `features/workflow/backlogs/interview-skill-line72-ties-gate-to-configuration.md`
- **Routing basis:** `staging/backlogs/feature/` → `features/{feature}/backlogs/`; feature = workflow (per frontmatter `feature: workflow`). Note: file is in `staging/backlogs/` (not `staging/backlogs/feature/`) but frontmatter `scope: project` with `feature: workflow` — the feature: workflow frontmatter scopes it to the workflow feature. Routing as feature-scoped.
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 5. `execution/task-06/staging/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md`
- **Action:** PROMOTED
- **Destination:** `features/agents/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md`
- **Routing basis:** `staging/decisions/` → `features/{feature}/decisions/`; feature = agents (per delegation routing + frontmatter).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 6. `execution/task-06/staging/decisions/verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md`
- **Action:** PROMOTED (mistake-candidate → features/guardrails/mistakes/)
- **Destination:** `features/guardrails/mistakes/verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md`
- **Routing basis:** `mistake-candidate: true` → `features/guardrails/mistakes/` (user-confirmed scope).
- **Dedup decision:** RELATED but DISTINCT from `paste-complete-approved-content-into-delegation-verbatim.md`.
  - `paste-complete-approved-content-into-delegation-verbatim.md` — about: assembling a delegation prompt from approved content; trap is dropping a block when transcribing. Context: delegation assembly. DIFFERENT CONTEXT.
  - My candidate: about: authoring a section drop-in replacement; trap is reconstructing "preserved" subsections from memory rather than reading the live file. Context: execution (doc editing). The root is related (content completeness) but the scenario, fix, and detection triggers are different.
  - Added cross-ref to `paste-complete-approved-content-into-delegation-verbatim.md`.
- **Frontmatter stripped:** `mistake-candidate: true`, `decision_status` (not in mistakes-type allowlist).
- **Layer-2 candidate:** YES — staged file notes this; generalizes to any multi-task branch session performing whole-section replacements.

---

### 7. `execution/task-07/staging/backlogs/project/wire-metadata-reconciler-into-wrapup-and-claude-mirror.md`
- **Action:** PROMOTED
- **Destination:** `backlogs/wire-metadata-reconciler-into-wrapup-and-claude-mirror.md`
- **Routing basis:** `staging/backlogs/project/` → `backlogs/` (project-scope, confirmed by `project-scope: true` frontmatter).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** `project-scope: true` (staging-only routing modifier).

---

### 8. `execution/task-07/staging/decisions/2026-06-06-workflow-metadata-fetch-packaged-as-orchestration-scripts.md`
- **Action:** PROMOTED
- **Destination:** `features/agents/decisions/2026-06-06-workflow-metadata-fetch-packaged-as-orchestration-scripts.md`
- **Routing basis:** `staging/decisions/` → `features/{feature}/decisions/`; feature = agents (per delegation routing; this decision is about session metadata telemetry and orchestration scripts, which live under the agents feature).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 9. `execution/task-09/staging/backlogs/step1-row4-stale-hook-auto-append-claim.md`
- **Action:** PROMOTED
- **Destination:** `features/agents/backlogs/step1-row4-stale-hook-auto-append-claim.md`
- **Routing basis:** `staging/backlogs/` → `features/{feature}/backlogs/`; feature = agents (per frontmatter `feature: agents`).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 10. `execution/task-10/staging/decisions/2026-06-06-per-loop-mode-gates-owned-by-mode-docs.md`
- **Action:** PROMOTED
- **Destination:** `features/workflow/decisions/2026-06-06-per-loop-mode-gates-owned-by-mode-docs.md`
- **Routing basis:** `staging/decisions/` → `features/{feature}/decisions/`; feature = workflow (per delegation routing + decision tags).
- **Collision:** No existing file at destination.
- **Frontmatter stripped:** none needed.

---

### 11. `execution/task-10/staging/decisions/trim-to-crossref-must-verify-target-holds-facts.md`
- **Action:** PROMOTED (mistake-candidate → features/guardrails/mistakes/)
- **Destination:** `features/guardrails/mistakes/trim-to-crossref-must-verify-target-holds-facts.md`
- **Routing basis:** `mistake-candidate: true` → `features/guardrails/mistakes/` (user-confirmed scope).
- **Dedup decision:** UNIQUE — no existing guardrails mistake covers the "trim-to-cross-ref without verifying target holds facts" trap. The `paste-complete-approved-content-into-delegation-verbatim.md` mistake is about delegation completeness, not content relocation. The staged file already cross-refs the sibling `verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md`.
- **Frontmatter stripped:** `mistake-candidate: true`, `decision_status` (not in mistakes-type allowlist).
- **Layer-2 candidate:** YES — staged file notes this; applies to any compaction pass that trims content to a cross-ref, across all projects.

---

## Summary

- PROMOTED: 11 of 11 staged files
- SKIPPED (exact duplicate): 0
- CROSS-REF'd (related-but-distinct): 2 (mistakes 1 + 2 above)
- UNIQUE (no existing analog): 1 (mistake 3 above)
- Layer-2 candidates flagged: 3 (all three mistake promotions)
