# Staging Inventory — session 0fd65721-c39f-4305-b296-9961aee8e1c1
Generated: 2026-05-31

Total staging files: 25 (across 4 loops)
Execution staging: 0 files (execution artifacts are under execution/artifacts/, not staging/)

---

## ideation/staging/ — 16 files

### backlogs/feature/ (2)
1. `ideation/staging/backlogs/feature/publish-gobbi-to-public-marketplace.md`
   type: backlogs | scope: feature | feature: install-runtime | status: deferred | priority: medium
2. `ideation/staging/backlogs/feature/reconcile-codex-plugin-and-claude-plugin-manifests.md`
   type: backlogs | scope: feature | feature: install-runtime | status: deferred | priority: low

### decisions/ (4)
3. `ideation/staging/decisions/2026-05-30-bounded-package-root-path-unnamed.md`
   type: decisions | scope: feature | feature: install-runtime | decision_status: proposed
   (Open decision carried forward; RESOLVED in preparation loop by bounded-package-root-and-marketplace-source-resolved.md)
4. `ideation/staging/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md`
   type: decisions | scope: feature | feature: install-runtime | decision_status: proposed
   (Open decision carried forward; RESOLVED in preparation loop by drift-resync-trigger-and-mechanical-gate-resolved.md)
5. `ideation/staging/decisions/2026-05-30-permissions-auto-grant-assumption.md`
   type: decisions | scope: feature | feature: install-runtime | decision_status: proposed
   (Open assumption-risk carried forward; RESOLVED in preparation loop by permissions-disposition-keep-project-local-verify-empirically.md)
6. `ideation/staging/decisions/subagent-wrote-session-memory-to-main-tree-not-worktree.md`
   mistake-candidate: true | domain: process
   PRE-RESOLVED: DROP — duplicate of existing worktree-write-path mistake family

### design/ (1)
7. `ideation/staging/design/gobbi-plugin-bounded-package.md`
   type: design | scope: feature | feature: install-runtime | status: active

### discussions/ (2)
8. `ideation/staging/discussions/2026-05-30-bounded-package-only-skills-agents-hooks.md`
   type: discussions | scope: feature | feature: install-runtime | outcome: bounded package decision
9. `ideation/staging/discussions/2026-05-30-fresh-gobbi-plugin-not-resurrection.md`
   type: discussions | scope: feature | feature: install-runtime | outcome: fresh build decision

### references/ (6)
10. `ideation/staging/references/claude-code-plugin-manifest-schema.md`
    type: reference | tags: [claude-plugin, plugin-json, schema, hooks, skills, agents]
11. `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`
    type: reference
12. `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`
    type: reference
13. `ideation/staging/references/plugin-cache-symlink-dereferencing-and-path-traversal.md`
    type: reference
14. `ideation/staging/references/plugin-hooks-config-and-plugin-root-var.md`
    type: reference
15. `ideation/staging/references/prior-gobbi-core-plugin-package-history.md`
    type: reference

### scenarios/ (1)
16. `ideation/staging/scenarios/worktree-faithful-install-path-default.md`
    type: scenarios | scope: feature | feature: install-runtime

---

## preparation/staging/ — 6 files

### decisions/ (5)
17. `preparation/staging/decisions/bounded-package-root-and-marketplace-source-resolved.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified
18. `preparation/staging/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified
19. `preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified
20. `preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified
21. `preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified

### design/ (1)
22. `preparation/staging/design/gobbi-plugin-component-inventory-and-layout.md`
    type: design | scope: feature | feature: install-runtime | status: active

---

## planning/staging/ — 3 files

### decisions/ (2)
23. `planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified
24. `planning/staging/decisions/plugin-plan-decomposition-and-ordering.md`
    type: decisions | scope: feature | feature: install-runtime | decision_status: ratified

### plans/ (1)
25. `planning/staging/plans/gobbi-claude-code-plugin-build.md`
    type: plans | scope: feature | feature: install-runtime | status: active

---

## execution/staging/ — 0 files

The execution loop produced an artifact (execution/artifacts/execution-summary.md) but no staging files.
This is expected: execution-level changelogs and decisions from the executor tasks were captured in
the execution-summary artifact rather than dedicated staging files.

Step 2.5 compliance note: The execution staging dir is absent (zero-staging). This was intentional
per the session's Execution loop shape — the executor's summary covers all 8 tasks with verification
evidence. No NEEDS_CONTEXT required: execution staging absence is consistent with the documented
session outcome (all tasks shipped; evaluation PASS at iter-2; no deferred execution-only findings).
