---
name: vocab-verification-kind-axis-carveout
description: The §9 verification check for zero orphan pool tags must explicitly carve out reviews/reports as kind-axis-routed with intentional tag non-closure.
type: checklists
scope: feature
feature: memory
status: active
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, verification, vocabulary-sweep]
keywords: [reviews, reports, kind-axis, orphan-tags, verification-check, §9]
author: claude
scenario: vocab-verification-kind-axis-carveout
---

# `memory-vocabulary.json` verification — kind-axis carve-out for reviews/reports

Sourced from iter1 Claude evaluator finding F-A2 (checklist_gap/docs-sync, Low/75, Confidence 75, addressed in design by the kind-REQUIRED decision L16). Staged as a durable implementation checklist item for the Execution task that rewrites the verification checks.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | §9 check 3 for the vocab verification tool/script must explicitly distinguish CLOSED pools (subsystem types) from KIND-AXIS types (reviews/reports). The check must state: "reviews and reports pool tags are intentionally unrouted via tagAreaMap — they are kind-axis types; the area resolves from the required `review_kind`/`report_type` frontmatter, not from tags. Tag non-closure on reviews/reports is expected and not a defect." | novel | pending | Run the orphan-check jq against §8 JSON; confirm it reports zero orphans for the 12 subsystem types AND explicitly documents the reviews/reports exemption in its output. |

## Item details

### 1. §9 verification check: kind-axis carve-out

The §9 re-verification section in the design checks "Every subsystem-type pool tag routes to a real area (zero orphans)." This check is TRUE for the 12 subsystem types. However, reviews and reports pool tags (`process`, `git`, `memory`, `codex`, `wrap-up`, `evaluation`, `docs-sync`, `links`, `design` for reviews; `git`, `memory`, `codex` for reports) deliberately do NOT route via the tagAreaMap — they are kind-axis-routed, so no tag→area route exists for them.

Without an explicit carve-out in the check, an implementer re-running the orphan check will find these unrouted pool tags and may treat them as a defect requiring a tagAreaMap entry. That would silently re-introduce the dropped tag-fallback maps for reviews/reports (contradicting L16).

**Anchor reasoning:** No prior reference applies — the kind-axis carve-out is novel to this redesign (the kind-axis area routing did not exist before this session's L5/L6/L16 decisions).

**Verification approach:** The verification script or jq command must output a section like:
```
subsystem-type orphans: 0 (PASS)
reviews/reports tag non-closure: expected (kind-axis-routed — see L16; tagAreaMap absent by design)
```
A passing run explicitly confirms the carve-out, not just "zero subsystem orphans."

## Related

- [[per-type-flat-vocab-model]] — the flat model that introduced per-type pools
- [[reviews-reports-kind-required]] — the decision (L16) that made kind required and dropped tag-fallback maps
