---
name: verbatim-claim-precision
description: A REVISE-fix Decisions Log claim of "only N surgical fixes / everything else verbatim" must be checked against the actual diff, not asserted.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [verbatim-claim, revise-fix, decisions-log, cosmetic-edit, claim-fidelity]
author: claude
scenario: ideation-revise-fix-claim-precision
item_status: pending
anchor: novel
implemented_in: null
---

# A REVISE-fix Decisions Log entry must check its own "verbatim" claim against the diff

## What

When a REVISE iteration's Decisions Log entry states "N surgical fixes, everything else unchanged/verbatim," add a check that the claim is verified against the actual diff between the prior and current draft — not merely a description of intent. If the diff contains incidental edits beyond the named fixes, the entry should either name them explicitly or drop the "verbatim" framing.

## Why

**Union of two same-symptom findings, staged as one record.** Claude's evaluator (`EVAL-I3-PROJ-01`, Low/100, Project+Consistency) and Codex's evaluator (`CODEX-I3-CONS-001`, Medium/100, Consistency, `general`/`docs-sync`) independently surfaced the identical root cause at iter 3: the draft's Decisions Log claimed "three surgical fixes... no design change" and "everything else verbatim," but the actual diff (`draft-iter2.md` → `draft-iter3.md`) carried ~7 additional non-fix wording edits beyond FX1/FX2/FX3 — e.g. "a generic SOP" → "a SOP" (line 85), a C12 rewording, a D6-heading attribution drop, and three log-line parenthetical drops. Neither evaluator found that any of the ~7 edits touched a design decision, user lock, invariant, count, or verification, so the "no design change" claim holds — but the "verbatim" claim does not. Staged at the union's higher severity (Codex's Medium/100).

## Verification

For any future REVISE iteration that claims a bounded fix set with "everything else verbatim": run `diff` between the prior-iter and current-iter draft, and confirm every changed line either belongs to a named fix or is explicitly called out as incidental. A checklist item passes only when the diff was actually run and every hunk is accounted for — not when the author's description of intent sounds bounded.

## Status notes

Non-blocking (both severities are below the REVISE/FAIL thresholds). Carried to Wrap-up as a residual open finding; see `1-ideation/outputs/evaluation-summary.md` and `1-ideation/outputs/resolution-log.md` for the full account. No design decision, user lock, invariant, or verification was affected by the ~7 cosmetic edits this finding is about.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — the sibling verification discipline: a claim needs to be checked against the exact evidence, not asserted from intent
