# Preparation EVALUATION — Consistency perspective (Claude, iter1)

## Artifact Summary + Memory reads
- Same artifact + memory reads as Project perspective. Baselines RE-RUN at HEAD d2b5b37 (208/17/191, 50, 59).

## Locked Frame (Stage 1)
Seeds from `preparation/evaluation.md` Consistency lens: scope-reference fidelity, summary↔detail sync, "Generated this loop" ↔ staging dir sync, Decisions-log ↔ gap-table sync, internal/external evidence conflict (adversarial). Augmented with the cross-foot of the FIX-1 sub-count framing inside the draft.

## Per-scenario per-check results
- **Scope reference points to actual Ideation artifact** — PASS. Draft L3 cites `ideation/artifacts/` with file list; matches on disk.
- **Design+memory readiness vs Execution skills readiness do not overlap** — PASS. The dangling `claude` skill appears in Execution skills readiness (L87) AND out-of-scope gaps (L113); that is intentional cross-listing of one item by category, not a miscategorized gap.
- **"Generated this loop" consistent with staging dir** — PASS. Draft L100-107 states 0 generate-now + 1 defer artifact; staging tree confirms exactly one file `staging/backlogs/project/dangling-claude-doc-skill-link.md`.
- **Decisions log reflects AskUserQuestion outcomes** — PASS. Two decisions (advance; backlog) recorded L123-132; backlog file well-formed (frontmatter valid, type backlogs, scope project, disposition deferred).
- **Internal FIX-1 sub-count cross-foot** — PARTIAL (see F3). Draft L63 uses "28 backlog disposition files legitimate"; draft L72 + Ideation CN-1 use 27 strict. My RE-RUN gives strictly 27 backlog-disposition files. The "28" is the looser-filter figure the Ideation CN-1 note already flagged for Execution normalization.
- **Internal/external evidence conflict unresolved (adversarial)** — FOUND. The draft asserts "1 new gap" while the live population it scanned already carries two backlog files for that gap. Internal claim vs the artifact's own scanned evidence conflict — surfaced in Project F1, recorded here as consistency-relevant.

## Typed findings

### F3 — draft uses both 28 and 27 for the same backlog-disposition sub-count
- Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: Low
- Evidence: draft L63 "28 backlog disposition files legitimate (preserved)"; draft L72 + L115 reference the 27 strict figure and label the 28-vs-27 cross-foot CN-1; RE-RUN confirms 27 under the single P_live filter. Self-inconsistent within one artifact.
- Why it matters: low — CN-1 is a documented, Execution-deferred cosmetic. But carrying both numbers in the readiness doc without picking one perpetuates the cross-foot into Planning.
- Suggested direction: state 27 (strict P_live) as the canonical preserved-count and footnote the 28 looser figure, or defer per CN-1 explicitly at the point of use.

## Low-confidence appendix
None.

VERDICT: PASS
