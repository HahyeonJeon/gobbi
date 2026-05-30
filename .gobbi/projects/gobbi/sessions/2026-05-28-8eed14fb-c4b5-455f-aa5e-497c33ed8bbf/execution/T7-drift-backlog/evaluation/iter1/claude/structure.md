# T7 evaluation — structure perspective (iter1)

**Target:** `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`

**Perspective:** structure — body organization, section contract, atomicity (§3, §4.2).

## Stage 0–1: Frame
- §4.2 has no explicit section contract for `backlogs/` in the table; backlogs follow their template's section shape.
- Reference `chat-mode-tiki-taka-redesign.md` shape: Context → Why deferred → When to pick up → Suggested approach → Effort → Originating session → Anchor.
- §3 atomicity: one record, one concept.

## Stage 2
- Section shape: Context → Why it matters → Why deferred → Resolution options → Origin. Diverges from reference template but coherently maps: Context+Why-it-matters substitutes for "Context"; Resolution-options substitutes for "Suggested approach"; Origin substitutes for "Originating session". `When to pick up` and `Effort estimate` are absent.
- Atomicity: ONE concept (the drift between two sources). Not a bundle.
- ADR-adjacent shape acceptable; backlogs do not have a hard section contract in §4.2.

## Findings
**F1** — Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 50 · Severity: Low
- Evidence: Missing `When to pick up` (signal/trigger for resumption) and `Effort estimate` sections present in reference template.
- Why it matters: A picking-up session reading this backlog has no estimate of touch-points (the doc says "at least two files" in passing inside option text but not as a structured field). Trigger conditions ("after X stabilizes") are absent.
- Suggested direction: user decides whether to add the two sections or treat reference template as illustrative-not-mandatory.

## Verdict
**PASS** — Body is atomic, well-structured, self-contained. Missing reference-template sections is a structural delta, not a defect; backlogs lack a mandatory §4.2 contract.
