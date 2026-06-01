# Promotion Manifest — session 34563fb4-361d-4348-aa75-8bc9f1fbff05

Generated: 2026-06-01

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

| Loop | Gap category | Finding | Action |
|------|-------------|---------|--------|
| ideation | `directory-absent` for staging/ | ideation loop used rawdata-only; no staging was produced (rawdata/hooks-docs-webfetch-verification.md is rawdata, not staging) | OK — manager pre-confirmed this session structure; ideation produced rawdata input for execution planning, not staged findings |
| execution/task-01 | none | Both staging files present, correct shape, correct vocabulary | Auto-pass |

No judgment-required gaps; no NEEDS_CONTEXT escalations.

---

## Staging file disposition (execution/task-01/staging/decisions/)

| Source staging file | Routing modifier | Destination | Action | Notes |
|---------------------|-----------------|-------------|--------|-------|
| `codex-webfetch-undercounts-recently-added-table-row.md` | `mistake-candidate: true`; user-confirmed `scope: project` | `.gobbi/projects/gobbi/mistakes/codex-webfetch-undercounts-recently-added-table-row.md` | PROMOTED | Stripped: `mistake-candidate`, `loop`, `feature`; changed `scope: feature` → `scope: project`; added `priority: medium` |
| `docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md` | `mistake-candidate: true`; user-confirmed `scope: project` | `.gobbi/projects/gobbi/mistakes/docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md` | PROMOTED | Stripped: `mistake-candidate`, `loop`, `feature`; changed `scope: feature` → `scope: project`; added `priority: medium` |

---

## Archive moves (move-on-terminal; terminal state was `status: addressed`)

| Source (pre-move) | Pre-move edits | Destination | Action |
|-------------------|----------------|-------------|--------|
| `features/guardrails/backlogs/hook-event-count-31-vs-29-docs-sync.md` | Added `archived_at: 2026-06-01`, `archive_reason: addressed` (already had `status: addressed`, `disposition: addressed`, `shipped_in`) | `archive/backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` | git mv OK |
| `features/guardrails/backlogs/posttooluse-failure-webfetch-verification-gap.md` | Added `archived_at: 2026-06-01`, `archive_reason: addressed` (already had `status: addressed`, `disposition: addressed`, `shipped_in`) | `archive/backlogs/2026-06-01-posttooluse-failure-webfetch-verification-gap.md` | git mv OK |
| `features/guardrails/checklists/hook-event-count-31-vs-29-docs-sync.md` | Added `archived_at: 2026-06-01`, `archive_reason: addressed` (already had `status: addressed`, `disposition: addressed`, `shipped_in`) | `archive/checklists/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` | git mv OK — `archive/checklists/` dir created (new) |
| `features/guardrails/backlogs/principles-anti-rationalizations-label-residue.md` | Flipped `status: active`→`addressed`, `disposition: open`→`addressed`; added `shipped_in: "#285"`, `archived_at: 2026-06-01`, `archive_reason: addressed`; appended `## Resolution (2026-06-01)` body section | `archive/backlogs/2026-06-01-principles-anti-rationalizations-label-residue.md` | git mv OK |

---

## Inbound reference repoints

| File | Lines updated | Old reference | New reference |
|------|--------------|---------------|---------------|
| `features/guardrails/references/claude-code-posttooluse-hook-schema.md` | lines 35-36 | `checklists/hook-event-count-31-vs-29-docs-sync.md` and `backlogs/hook-event-count-31-vs-29-docs-sync.md` | `../../../archive/checklists/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` and `../../../archive/backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` |
| `features/guardrails/references/claude-code-posttooluse-hook-schema.md` | line 36 | `backlogs/posttooluse-failure-webfetch-verification-gap.md` | `../../../archive/backlogs/2026-06-01-posttooluse-failure-webfetch-verification-gap.md` |

Relative paths verified to resolve correctly (ls confirmed all three archive targets exist).

---

## Journal note

| Artifact | Location | Type |
|----------|----------|------|
| `2026-06-01-hook-event-count-and-residue-closure.md` | `notes/2026-06-01-hook-event-count-and-residue-closure.md` | notes (Wrap-up Step 6 direct write) |

---

## Closure gate

- `grep -rn '"31 hook' .gobbi/projects/gobbi/features/guardrails/` → 0 matches (verified post-archive-moves)
- `goodhart-factor-when-demanded-deferred.md` remains in `features/guardrails/backlogs/` (untouched, still active)
- `cross-layer-drift-gate.md` remains in `features/guardrails/checklists/` (untouched, still active)
