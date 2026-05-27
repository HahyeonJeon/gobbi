# Usage perspective — T0 §4 (iter1, claude)

**Lens:** Can an evaluator/agent actually APPLY §4 to score a doc? Is it a scorable checklist or vague?

## Verified — scorability
- §4.1 gives 5 binary bullets (names subject in first line / carries own context / self-contained prose / obeys type contract / does one type's job) — each yes/no checkable against a doc.
- §4.2 gives a per-type section-name checklist — an evaluator can run "does this decisions/ file have Context→Decision→Rationale→Alternatives→Consequences?" pass/fail per row. Matches design D4 validation method ("evaluator runs the section checklist").
- §4.3 ships a runnable advisory grep AND a clear "review each hit" caveat.
- §4.4/§4.5 ship a runnable, deterministic gate.

## Gate execution (I ran it)
- §4.5 gate ran cleanly, exit 0, surfaced ~65 live leak files; all genuine (sampled `phase-doc-count-verification.md` carries finding-id/disposition/confidence/severity = real leaks). Skips archive (verified: 7 archive files would match but excluded).
- §4.3 advisory grep ran: 153 candidate files. High count is EXPECTED — doc explicitly labels it "advisory, not a hard gate; review each hit, since a literal mention inside a quote or a `## Source` footer is legitimate." Disclosed, not a defect.
- §4.5 conditional-disposition check (described in prose, not pre-canned): I reconstructed it (`find ... -not -path '*/backlogs/*' | xargs grep '^disposition:'`) — runs and correctly excludes the 41 legit backlog disposition files.

## Findings
**US-1 — §4.5 conditional-disposition check is prose-only, not a copy-paste command (Type: checklist_gap; Domain: process; Disposition: open; Confidence: 50; Severity: Low)**
- Evidence: §4.5 says "run the same `find` and grep for `^disposition:`, then exclude `*/backlogs/*`" — but unlike the main gate, no ready-to-paste block is given. An operator must assemble it.
- Why it matters: minor friction; the main gate (the high-value path) IS canned. The disposition sub-check being prose lowers reproducibility slightly.
- Suggested direction: optionally add a second fenced command for the disposition sub-check. Low priority.

## Verdict
PASS — §4 is a genuinely scorable, runnable standard; both gates execute as documented.
