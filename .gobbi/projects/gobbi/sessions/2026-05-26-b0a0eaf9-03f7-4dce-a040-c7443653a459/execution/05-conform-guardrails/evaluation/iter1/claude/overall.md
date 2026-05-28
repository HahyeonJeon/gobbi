# T5 Conformance — Overall (Claude, iter1)

**Target:** commit 8e6ae25 — conform `features/guardrails` (10 docs) to memorization `rules.md` §4.

## Contract gates (all verified with own commands)

| Gate | Contract | Result |
|---|---|---|
| §4.5 leak gate (archive-safe, hyphen+underscore) | 0 (was 5) | **0** — PASS |
| non-backlog `disposition` leak | 0 | **0** — PASS |
| 9 base keys on all 10 docs | all 10 (was 1) | **10/10** — PASS |
| disposition preserved on 3 backlogs | deferred/open/open | **preserved** — PASS |
| scope: git diff only `features/guardrails/` | clean | **9 files, all in-scope** — PASS |

Every contracted T5 acceptance criterion passes on fresh evidence. The changelog (`2026-05-26-bundle-b-rehome.md`) was correctly left untouched ("already clean").

## CRITICAL PROBE verdict — backlog body reformatting

**Was content lost?** No. Line-by-line diff of all 3 backlogs (goodhart, hook-event-count, posttooluse): the ADR sections (Decision / Rationale / Alternatives considered / Consequences) were re-homed into the backlogs-template sections (Why deferred / Suggested approach), and **every rationale, alternative, and consequence proposition survives**. Provenance (finding-ids) moved from frontmatter into labeled `## Related`/`## Originating session` body lines, consistent with §2.3. The de-crypt of session coordinates (T3→"hook + reconstructor scope", row 5.5→"worktreePath row", draft-iter3.md→descriptive prose) is faithful.

**Was it over-scope?** Yes — and this is the one real concern. The plan deliberately separates **Wave 1 mechanical (T5)** from **Wave 2 prose (P4-prose-guardrails, deferred)**, and assigns §4.2 per-type section-contract reshaping (D4) to P4 (task-list:105), not T5 (task-list:67, which lists only the 4 mechanical gates). The 3-backlog reshape and the discussion-body rewrite ARE D4/§4.2 work. So the executor did faithful prose-wave work inside the mechanical task — overstepping T5's bound (Iron Law 4).

Per the brief's own rubric: "dropped rationale = REVISE/High; faithful-but-over-scope = note + your severity." Nothing was dropped, so this is the **faithful-but-over-scope** branch → **note, severity Medium** (F-CONS-1 / F-RISK-2). A Medium does not meet the REVISE threshold (High≥50).

## Cross-perspective synthesis

- Project / Structure / Performance / Aesthetics / Usage / Risk: PASS. Consistency: PASS with a noted Medium boundary breach.
- Two recurring sub-issues, both Low/Medium and neither a content defect:
  - **Over-scope (Medium, F-CONS-1/F-RISK-2):** deferred P4 prose partially pre-executed without a marker. Process discipline + future-work clarity, no deliverable harm.
  - **`related:` removal on references (Low, F-STRUCT-1/F-RISK-1):** brief said this was deferred/out-of-scope; executor removed it anyway. Non-S key, git-recoverable.
  - **Residual cryptic ref (Low, F-AESTH-1):** checklist still names `draft-iter3.md`; belongs to the deferred prose wave.

## Karpathy failure-mode scan
- No hallucinated success: all gate claims independently reproduced.
- No tool-gaming: the strip is a genuine type-aware allowlist, not a blanket grep; disposition correctly conditional.
- No silent scope creep that destroys value: the over-scope was additive and faithful, not destructive.

## Must-preserve list
- The 9-base-key frontmatter on all 10 docs.
- The type-aware S-strip that preserved `disposition`/`priority`/`ref_type`/`value_proposition`/`subsystems`.
- The faithful ADR→backlogs-template content mapping — a future P4 pass must NOT re-litigate and drop the preserved rationale/alternatives/consequences.

## Verdict rationale
All contracted gates pass; the critical probe finds zero content loss; the only real concern (prose-wave over-scope) is faithful and Medium, which per the threshold rules and the brief's rubric is a noted PASS, not REVISE. No Critical (≥75) and no High (≥50) findings.

VERDICT: PASS
