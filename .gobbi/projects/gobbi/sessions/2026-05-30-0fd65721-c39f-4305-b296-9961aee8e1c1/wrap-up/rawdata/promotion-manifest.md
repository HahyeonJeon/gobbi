# Promotion Manifest — session 0fd65721-c39f-4305-b296-9961aee8e1c1
Generated: 2026-05-31
Feature destination: install-runtime
Project: gobbi

This is the append-only routing-decision log. Each entry: staging path → decision (PROMOTE | DROP | BACKLOG) + destination + rationale.

---

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

| Loop | Finding | Category | Action |
|---|---|---|---|
| ideation | 16 staging files present, well-shaped {slug}.md convention | PASS | No gap |
| preparation | 6 staging files present, well-shaped | PASS | No gap |
| planning | 3 staging files present, well-shaped | PASS | No gap |
| execution | staging/ absent (zero-staging) | zero-staging | Auto-record: intentional — executor produced summary artifact, not staged findings. No judgment-required findings. Cleared. |

Step 2.5 result: ALL CLEAR. No shape-mismatch, template-mismatch, or directory-absent gaps requiring NEEDS_CONTEXT. Execution zero-staging is intentional and recorded.

---

## Routing decisions (25 staging files)

### File 1
- **Source:** `ideation/staging/backlogs/feature/publish-gobbi-to-public-marketplace.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/backlogs/publish-gobbi-to-public-marketplace.md`
- **Route rule:** `staging/backlogs/feature/{slug}.md` → `features/{feature-name}/backlogs/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `title` field kept (legitimate backlog extension); `project` field kept (legitimate per backlogs type)
- **Status:** written

### File 2
- **Source:** `ideation/staging/backlogs/feature/reconcile-codex-plugin-and-claude-plugin-manifests.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/backlogs/reconcile-codex-plugin-and-claude-plugin-manifests.md`
- **Route rule:** `staging/backlogs/feature/{slug}.md` → `features/{feature-name}/backlogs/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 3
- **Source:** `ideation/staging/decisions/2026-05-30-bounded-package-root-path-unnamed.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/2026-05-30-bounded-package-root-path-unnamed.md`
- **Route rule:** `staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md`
- **Note:** This is an OPEN/proposed decision from Ideation that was subsequently RESOLVED in Preparation (bounded-package-root-and-marketplace-source-resolved.md supersedes it). Both are promoted: the open one documents the problem statement; the resolved one documents the resolution. No supersession action applied at promotion time (the decision body itself documents the open state; the resolution file is separate).
- **Collision:** no existing file at destination
- **Strip:** `supersedes: null` and `superseded_by: null` are standard decision extension fields — kept
- **Status:** written

### File 4
- **Source:** `ideation/staging/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Note:** Open/proposed decision from Ideation, subsequently RESOLVED in Preparation. Both promoted.
- **Collision:** no existing file at destination
- **Status:** written

### File 5
- **Source:** `ideation/staging/decisions/2026-05-30-permissions-auto-grant-assumption.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/2026-05-30-permissions-auto-grant-assumption.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Note:** Open/proposed decision from Ideation, subsequently RESOLVED in Preparation.
- **Collision:** no existing file at destination
- **Status:** written

### File 6
- **Source:** `ideation/staging/decisions/subagent-wrote-session-memory-to-main-tree-not-worktree.md`
- **Decision:** DROP (PRE-RESOLVED)
- **Destination:** (none — dropped)
- **Rationale:** `mistake-candidate: true`. PRE-CONFIRMED DUPLICATE: this worktree-write-path mistake is already covered by the existing mistake family in `.gobbi/projects/gobbi/mistakes/` — specifically `subagent-relative-path-write-strays-to-main-tree.md`, `subagent-relative-write-paths-stray-cd-doesnt-persist.md`, `subagent-stray-recurred-despite-absolute-path-instruction.md`, `codex-subprocess-writes-to-main-tree.md`, and `session-dir-placed-outside-worktree.md`. The trap is already live; promoting a duplicate would create noise without adding new prevention guidance. Manager pre-confirmed this scope decision; no NEEDS_CONTEXT required.
- **Status:** dropped-as-duplicate

### File 7
- **Source:** `ideation/staging/design/gobbi-plugin-bounded-package.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/design/gobbi-plugin-bounded-package.md`
- **Route rule:** `staging/design/{slug}.md` → `features/{feature-name}/design/{slug}.md` (default; feature-scoped)
- **Collision:** no existing file at destination
- **Strip:** `related` field is a per-type extension (legitimate for design type) — kept; session-only refs in related list are internal pointers and acceptable
- **Status:** written

### File 8
- **Source:** `ideation/staging/discussions/2026-05-30-bounded-package-only-skills-agents-hooks.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/discussions/2026-05-30-bounded-package-only-skills-agents-hooks.md`
- **Route rule:** `staging/discussions/{slug}.md` → `features/{feature-name}/discussions/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `loop: ideation` → strip (session-routing residue per rules.md §4.4); `outcome` → KEEP (in per-type KEEP list per rules.md §4.4)
- **Status:** written

### File 9
- **Source:** `ideation/staging/discussions/2026-05-30-fresh-gobbi-plugin-not-resurrection.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/discussions/2026-05-30-fresh-gobbi-plugin-not-resurrection.md`
- **Route rule:** `staging/discussions/{slug}.md` → `features/{feature-name}/discussions/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `loop: ideation` → strip
- **Status:** written

### File 10
- **Source:** `ideation/staging/references/claude-code-plugin-manifest-schema.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/claude-code-plugin-manifest-schema.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `title` → KEEP (legitimate references extension); `source` → KEEP; `accessed` → KEEP; `ref_type` absent but fine
- **Status:** written

### File 11
- **Source:** `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/marketplace-json-schema-and-skills-dir-plugins.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 12
- **Source:** `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 13
- **Source:** `ideation/staging/references/plugin-cache-symlink-dereferencing-and-path-traversal.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/plugin-cache-symlink-dereferencing-and-path-traversal.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 14
- **Source:** `ideation/staging/references/plugin-hooks-config-and-plugin-root-var.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/plugin-hooks-config-and-plugin-root-var.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 15
- **Source:** `ideation/staging/references/prior-gobbi-core-plugin-package-history.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/references/prior-gobbi-core-plugin-package-history.md`
- **Route rule:** `staging/references/{slug}.md` → `features/{feature-name}/references/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 16
- **Source:** `ideation/staging/scenarios/worktree-faithful-install-path-default.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/scenarios/worktree-faithful-install-path-default.md`
- **Route rule:** `staging/scenarios/{slug}.md` → `features/{feature-name}/scenarios/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 17
- **Source:** `preparation/staging/decisions/bounded-package-root-and-marketplace-source-resolved.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/bounded-package-root-and-marketplace-source-resolved.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Note:** Resolves ideation decision #3 (STRUCT-1). `related:` field lists ideation staging path — acceptable provenance pointer; the decision itself is self-contained.
- **Collision:** no existing file at destination
- **Strip:** `mistake-candidate: false` → strip (staging-only routing field per rules.md §2.3); `related:` list → KEEP
- **Status:** written

### File 18
- **Source:** `preparation/staging/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Strip:** `mistake-candidate: false` → strip
- **Status:** written

### File 19
- **Source:** `preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Strip:** `mistake-candidate: false` → strip
- **Status:** written

### File 20
- **Source:** `preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/permissions-disposition-keep-project-local-verify-empirically.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Strip:** `mistake-candidate: false` → strip
- **Status:** written

### File 21
- **Source:** `preparation/staging/decisions/worktree-test-default-git-ref-source-with-sentinel.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/worktree-test-default-git-ref-source-with-sentinel.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Strip:** `mistake-candidate: false` → strip
- **Status:** written

### File 22
- **Source:** `preparation/staging/design/gobbi-plugin-component-inventory-and-layout.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/design/gobbi-plugin-component-inventory-and-layout.md`
- **Route rule:** `staging/design/{slug}.md` → `features/{feature-name}/design/{slug}.md`
- **Collision:** no existing file at destination
- **Status:** written

### File 23
- **Source:** `planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/package-includes-claude-plugin-skill-resync-after-t7.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `mistake-candidate: false` → strip; `related:` list → KEEP
- **Status:** written

### File 24
- **Source:** `planning/staging/decisions/plugin-plan-decomposition-and-ordering.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/decisions/plugin-plan-decomposition-and-ordering.md`
- **Route rule:** `staging/decisions/{slug}.md` → `features/{feature-name}/decisions/{slug}.md`
- **Collision:** no existing file at destination
- **Strip:** `mistake-candidate: false` → strip; `related:` list → KEEP
- **Status:** written

### File 25
- **Source:** `planning/staging/plans/gobbi-claude-code-plugin-build.md`
- **Decision:** PROMOTE
- **Destination:** `features/install-runtime/plans/2026-05-30-gobbi-claude-code-plugin-build.md`
- **Route rule:** `planning/staging/plans/{slug}.md` → `features/{feature-name}/plans/{date}-{slug}.md`
- **Collision:** plans/ dir absent → created; no collision
- **Status:** written

---

## Summary

| Outcome | Count |
|---|---|
| PROMOTED | 24 |
| DROPPED | 1 (mistake-candidate duplicate) |
| BACKLOGGED | 0 |
| **Total accounted** | **25** |

All 25 staging files accounted for. 0 silent drops.
