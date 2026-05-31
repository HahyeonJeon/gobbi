## Findings

### C1 — Resolved decision pairs are not connected with `supersedes` / `superseded_by`

Type: design_flaw

Severity: High

Confidence: 100

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/wrap-up/rawdata/promotion-manifest.md:47` says the resolved bounded-package decision "supersedes" the open ideation decision, but also says "No supersession action applied at promotion time."
- Frontmatter command output:

```text
.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-30-bounded-package-root-path-unnamed.md
status: active
supersedes: null
superseded_by: null
decision_status: proposed
.gobbi/projects/gobbi/features/install-runtime/decisions/bounded-package-root-and-marketplace-source-resolved.md
status: active
supersedes: null
superseded_by: null
decision_status: ratified
.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md
status: active
supersedes: null
superseded_by: null
decision_status: proposed
.gobbi/projects/gobbi/features/install-runtime/decisions/drift-resync-trigger-and-mechanical-gate-resolved.md
status: active
supersedes: null
superseded_by: null
decision_status: ratified
.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-30-permissions-auto-grant-assumption.md
status: active
supersedes: null
superseded_by: null
decision_status: proposed
.gobbi/projects/gobbi/features/install-runtime/decisions/permissions-disposition-keep-project-local-verify-empirically.md
status: active
supersedes: null
superseded_by: null
decision_status: ratified
```

Why-it-matters:
Project memory now contains active proposed decisions and active ratified resolution decisions for the same topics. The manifest's human prose says they are resolved, but the machine-readable lifecycle fields do not, so future sessions can treat stale proposed decisions as live.

Suggested-direction:
For each open-to-resolved pair, either mark the earlier proposed decision as superseded with `superseded_by:` pointing to the resolution and set the resolution's `supersedes:`, or change the earlier file's lifecycle/body so it is explicitly a historical problem statement rather than an active proposed decision.
