# Staging Inventory — session 34563fb4-361d-4348-aa75-8bc9f1fbff05

Captured: 2026-06-01
Loops with staging: execution/task-01/staging/decisions/
Other loops: ideation (rawdata only, no staging); wrap-up (this loop)

## execution/task-01/staging/decisions/

| File | Type | mistake-candidate | domain | Action |
|------|------|-------------------|--------|--------|
| `codex-webfetch-undercounts-recently-added-table-row.md` | decisions | true | docs-sync | Promote to project mistakes/ |
| `docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md` | decisions | true | docs-sync | Promote to project mistakes/ |

Both files have user-confirmed scope=project (pre-resolved decision in delegation prompt).

## Step 2.5 Compliance Scan

Both staging files present with:
- `type: decisions` — correct vocabulary
- `mistake-candidate: true` — routing flag set
- `loop: execution` — staging-only field, will be stripped on promotion
- `scope: feature` (staging); will be changed to `scope: project` on promotion (pre-resolved)
- `feature: guardrails` — staging-only for routing; will be dropped on promotion (scope becomes project)

Shape: both are per-concept {slug}.md files — compliant with one-record-one-concept rule.
Gap category: none. Both files are well-formed for promotion.

No `design_flaw` or `assumption_risk` types present — no NEEDS_CONTEXT escalation required for Step 2.5.
