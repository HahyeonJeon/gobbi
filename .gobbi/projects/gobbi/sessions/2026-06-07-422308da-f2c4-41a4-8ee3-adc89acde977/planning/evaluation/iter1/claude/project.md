# Planning Eval — Project perspective (claude, iter1)

## Artifact Summary + Memory reads
- Target: `planning/rawdata/draft-iter1.md` — HYBRID decomposition (3 per-file tasks + 1 consistency task) of the locked docs-only Idea (harden Auto-mode evaluation discipline across 3 files).
- Read in full: the Plan, the locked Idea (`ideation/artifacts/idea.md`, status final, PASS Claude+Codex), the readiness report (`preparation/artifacts/readiness.md`, status final).
- Memory reads: `cotouch-enumeration-must-cover-semantic-equivalents.md` (semantic-equivalent sweep discipline), `section-order-is-part-of-the-contract.md`, `planning-leader-asserted-file-type-without-verifying.md`.
- Lens: does the Plan implement the right idea, the whole idea, and only the idea?

## Locked Frame (Stage 1)
- S1 Every task traces to ≥1 Idea item (checklist).
- S2 Every Idea design item is covered by ≥1 task (no orphan).
- S3 No task implements outside the Idea Scope Contract.
- S4 Plan terminal state == Idea success criteria.
- S5 (adversarial) No "while we're here" creep.

## Per-scenario per-check results
- S1 PASS. Every task has a `traces-to:` list; T1→Design File 2 + Problems 1/2/3 + D8; T2→Design File 1 + Problems 1/2/3 + restructure + D5; T3→Design File 3 + Problem 3a + D4; T4→Cross-file risks + checklist 6-8 + readiness C1. Traces resolve to real Idea sections.
- S2 MOSTLY PASS, one gap. Named Idea items all map: File 1 (evaluation.md sharpen/mode-split/safety-labels/framing) → T1; File 2 (§7.1-7.4 + forward pointers + Cross-refs) → T2; File 3 (line-27 reconcile) → T3; cross-file risks 1-7 → T4. GAP: the Idea's 3+3 routine-triage/safety-gate classification (D8) does not enumerate every mid-loop AskUserQuestion in evaluation.md; line 109 (different-root-causes → AskUserQuestion before DISCUSSION re-entry), line 137 (any FAIL → escalate), line 197 (cost-budget surface) are mid-loop, mode-agnostic, and unclassified. The Plan inherits this enumeration verbatim and adds no completeness sweep. See finding P-1 (routed primarily to Risk/Consistency; noted here as a whole-idea coverage gap).
- S3 PASS. Scope Contract copied (3 in-scope files; orchestration/SKILL.md, chat-mode.md, discussion/SKILL.md, principles/SKILL.md read-only). No new requirement introduced.
- S4 PASS. After T1-T4, the three Idea success criteria are addressed (no pre-eval question; spawns 2; auto-iterate + safety gates). Subject to the S2 gap for completeness.
- S5 PASS. No adjacent-improvement creep; the Plan explicitly excludes the stale "Principle 11" in the mistake file (D7 / NOT-in-scope) and CLAUDE.md line 31.

## Typed findings
None at Project severity beyond the cross-cut gap recorded as P-1 under Risk. Project lens: the Plan implements the right idea and only the idea; the whole-idea completeness concern is the inherited enumeration gap, recorded once at Risk to avoid double-counting.

## Low-confidence appendix
- Whether line 109/137/197 are routine-triage (mode-split candidates) or legitimate safety gates is a design-classification call owned by the locked Idea (D8). I do not re-open the Idea; I flag only that the Plan adds no gate to detect such survivors. Confidence on "these rows are mid-loop and unclassified": 75 (tool-verified). Confidence on "they SHOULD be mode-split": 25 (design call, out of my scope).
