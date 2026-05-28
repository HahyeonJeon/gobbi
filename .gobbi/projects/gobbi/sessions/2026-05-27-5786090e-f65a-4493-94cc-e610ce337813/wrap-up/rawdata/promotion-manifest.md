---
title: Promotion Manifest — session 2026-05-27-5786090e-f65a-4493-94cc-e610ce337813
created: 2026-05-28
step: WORK Step 4 (includes Step 2.5 compliance scan)
---

# Promotion Manifest

Append-only routing-decision log. One entry per staging file.
All scope decisions pre-confirmed by manager — no NEEDS_CONTEXT required.

---

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

| Loop | Staging path | Gap category | Finding type | Action | Result |
|---|---|---|---|---|---|
| execution/P1 | `staging/decisions/prose-brief-light-pass-undersold-template-section-checks.md` | none | general | No action needed — all required frontmatter present | OK |
| execution/P2 | `staging/decisions/subagent-stray-recurred-despite-absolute-path-instruction.md` | none | general | No action needed | OK |
| execution/P2 | `staging/backlogs/project/frontmatter-completeness-followup.md` | template-mismatch | general | Auto-backfill: add `type: backlogs` at promotion time — mechanical class, safe | Auto-backfilled |
| execution/P3a | `staging/decisions/prose-reclassification-target-is-project-level-notes.md` | none | general | No action needed | OK |
| execution/P4 | `staging/decisions/dual-system-codex-caught-template-form-gaps-claude-missed.md` | none | general | No action needed | OK |
| execution/P5b | `staging/decisions/evaluator-revise-may-contradict-the-standard-manager-disputes-with-evidence.md` | none | general | No action needed | OK |
| execution/P6a | `staging/backlogs/project/design-template-stale-vs-adr-standard.md` | none | general | No action needed — `type: backlogs` present | OK |
| execution/P7b | `staging/decisions/section-order-is-part-of-the-contract-not-just-the-set.md` | none | general | No action needed | OK |
| wrap-up | `staging/decisions/subagent-relative-write-paths-stray-cd-doesnt-persist.md` | none | general | No action needed | OK |

**Absent loops (ideation, preparation, planning):** expected — session was execution-only prose wave continuation; no NEEDS_CONTEXT required.

---

## Step 4 — Routing decisions

All 9 promotions are PROJECT-SCOPE (pre-confirmed by manager). No feature-scope items requiring
NEEDS_CONTEXT. §2.3 strip applied to all mistake-candidates: `mistake-candidate: true` removed
at promotion time.

### Mistake-candidates → project mistakes/ (7 files)

| # | Source (staging) | Destination (project memory) | §2.3 strip | Collision check |
|---|---|---|---|---|
| 1 | `execution/P1-agents-prose/staging/decisions/prose-brief-light-pass-undersold-template-section-checks.md` | `.gobbi/projects/gobbi/mistakes/prose-brief-light-pass-undersold-template-section-checks.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 2 | `execution/P2-evaluation-prose/staging/decisions/subagent-stray-recurred-despite-absolute-path-instruction.md` | `.gobbi/projects/gobbi/mistakes/subagent-stray-recurred-despite-absolute-path-instruction.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 3 | `execution/P3a-git-workflow-a-prose/staging/decisions/prose-reclassification-target-is-project-level-notes.md` | `.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 4 | `execution/P4-guardrails-prose/staging/decisions/dual-system-codex-caught-template-form-gaps-claude-missed.md` | `.gobbi/projects/gobbi/mistakes/dual-system-codex-caught-template-form-gaps-claude-missed.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 5 | `execution/P5b-install-runtime-b-prose/staging/decisions/evaluator-revise-may-contradict-the-standard-manager-disputes-with-evidence.md` | `.gobbi/projects/gobbi/mistakes/evaluator-revise-may-contradict-the-standard-manager-disputes-with-evidence.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 6 | `execution/P7b-project-tier-remainder-prose/staging/decisions/section-order-is-part-of-the-contract-not-just-the-set.md` | `.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` | Remove `mistake-candidate: true` | No collision — slug unique |
| 7 | `wrap-up/staging/decisions/subagent-relative-write-paths-stray-cd-doesnt-persist.md` | `.gobbi/projects/gobbi/mistakes/subagent-relative-write-paths-stray-cd-doesnt-persist.md` | Remove `mistake-candidate: true` | No collision — slug unique |

### Backlogs → project backlogs/ (2 files)

| # | Source (staging) | Destination (project memory) | Notes |
|---|---|---|---|
| 8 | `execution/P2-evaluation-prose/staging/backlogs/project/frontmatter-completeness-followup.md` | `.gobbi/projects/gobbi/backlogs/frontmatter-completeness-followup.md` | Auto-backfill: add `type: backlogs` at promotion (§2.5 compliance fix) |
| 9 | `execution/P6a-project-memory-prose/staging/backlogs/project/design-template-stale-vs-adr-standard.md` | `.gobbi/projects/gobbi/backlogs/design-template-stale-vs-adr-standard.md` | No collision — slug unique |

### Archive operation (1 file — git mv)

| Source | Destination | Reason |
|---|---|---|
| `.gobbi/projects/gobbi/backlogs/memory-redesign-remaining-waves.md` | `.gobbi/projects/gobbi/archive/backlogs/2026-05-28-memory-redesign-remaining-waves.md` | status: closed, disposition: resolved — move-on-terminal per wrap-up/SKILL.md |

---

## Layer-2 promotion assessment

Per wrap-up/SKILL.md: Layer-2 promotion (project-mistakes → workspace-level skill storage) is
confirmed by user during DISCUSSION. Manager pre-confirmed scope for these 7 mistakes as
project-scope (Layer 1 only). Layer-2 assessment is manager-owned per DISCUSSION; no
Layer-2 writes performed in this WORK step without explicit DISCUSSION confirmation.
