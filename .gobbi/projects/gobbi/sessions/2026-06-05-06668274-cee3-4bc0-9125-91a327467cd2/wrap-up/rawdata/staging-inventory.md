---
session: 06668274-cee3-4bc0-9125-91a327467cd2
created: 2026-06-06
---

# Staging Inventory — Session 2026-06-05-06668274

All staging files found across execution/ and planning/ loops for this session.

## Loop: execution

### task-01
- `execution/task-01/staging/decisions/2026-06-05-orchestration-entry-point-removed-as-gobbi-front-door-duplicate.md`
  - type: decisions | scope: project | feature: null | tags: orchestration, docs-sync, workflow
  - routing: → features/workflow/decisions/ (feature tag: workflow)

### task-03
- `execution/task-03/staging/decisions/2026-06-05-always-worktree-model-replaces-direct-mode.md`
  - type: decisions | scope: project | feature: git-workflow | tags: git-workflow, orchestration, configuration, worktree
  - routing: → features/git-workflow/decisions/

- `execution/task-03/staging/decisions/2026-06-05-table-renumber-must-sweep-inbound-row-references.md`
  - type: decisions | mistake-candidate: true | scope: project | domain: process
  - routing: → features/guardrails/mistakes/ (mistake-candidate, scope user-confirmed)

### task-04
- `execution/task-04/staging/backlogs/interview-skill-line72-ties-gate-to-configuration.md`
  - type: backlogs | scope: project | feature: workflow
  - routing: → features/workflow/backlogs/ (feature-scope, feature: workflow)

### task-06
- `execution/task-06/staging/decisions/2026-06-06-session-operation-metadata-recording-from-agent-transcripts.md`
  - type: decisions | scope: project | feature: agents | tags: agents, session-metadata, token-usage
  - routing: → features/agents/decisions/

- `execution/task-06/staging/decisions/verbatim-section-replacement-must-copy-preserved-parts-from-live-file.md`
  - type: decisions | mistake-candidate: true | scope: project | domain: docs-sync
  - routing: → features/guardrails/mistakes/ (mistake-candidate, scope user-confirmed)

### task-07
- `execution/task-07/staging/backlogs/project/wire-metadata-reconciler-into-wrapup-and-claude-mirror.md`
  - type: backlogs | scope: project | project-scope: true
  - routing: → backlogs/ (project-scope)

- `execution/task-07/staging/decisions/2026-06-06-workflow-metadata-fetch-packaged-as-orchestration-scripts.md`
  - type: decisions | scope: project | feature: null | tags: orchestration, session-metadata, shell-scripts
  - routing: → features/agents/decisions/ (delegation prompt specifies feature: agents)

### task-09
- `execution/task-09/staging/backlogs/step1-row4-stale-hook-auto-append-claim.md`
  - type: backlogs | scope: project | feature: agents
  - routing: → features/agents/backlogs/ (feature-scope, feature: agents)

### task-10
- `execution/task-10/staging/decisions/2026-06-06-per-loop-mode-gates-owned-by-mode-docs.md`
  - type: decisions | scope: project | feature: null | tags: orchestration, workflow, mode
  - routing: → features/workflow/decisions/ (delegation prompt specifies feature: workflow)

- `execution/task-10/staging/decisions/trim-to-crossref-must-verify-target-holds-facts.md`
  - type: decisions | mistake-candidate: true | scope: project | domain: docs-sync
  - routing: → features/guardrails/mistakes/ (mistake-candidate, scope user-confirmed)

## Loop: planning

No staging/ directory (planning artifacts are in planning/artifacts/, not staging/). Not a compliance gap — Chat-mode sessions produce planning artifacts but do not necessarily produce staging files.

---

**Total staged files: 11**
