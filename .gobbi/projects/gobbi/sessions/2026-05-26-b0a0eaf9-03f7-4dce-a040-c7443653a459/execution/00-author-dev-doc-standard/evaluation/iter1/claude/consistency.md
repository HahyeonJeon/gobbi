# Consistency perspective — T0 §4 (iter1, claude)

**Lens:** Terminology, internal coherence, agreement with §1-3 and the locked design, no contradictions.

## Verified
- "Zero-context reader" term defined once (§4.1) and reused consistently.
- §4.4 set S = exactly design-options FIX-1 S (`finding-id, confidence, severity, surfaced-by, promoted-from, promoted-at, mistake-candidate` + conditional `disposition`). Both spellings enumerated in a table; the gate regex `^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at):` uses `[-_]` alternation = matches both. Empirically justified: census shows finding-id(36)/finding_id(4), promoted-from(25)/promoted_from(5), promoted-at(25)/promoted_at(5) BOTH present.
- Conditional `disposition`: §4.4 says in S only when NOT under backlogs/; §2.2 line 110 documents `disposition: open|deferred` legit on backlogs. Consistent; safety invariant stated identically to design.
- §4.5 deliberately OMITS `disposition` from the gate regex and explains why (would false-positive on legit backlog files) — consistent with §4.4 conditional rule. Self-consistent.
- The iter2 cross-foot discrepancy (CN-1: 28 vs 27 disposition sub-count) did NOT leak into §4 — §4 states no baseline counts at all, avoiding the cosmetic inconsistency. Good.

## Findings
**CN-1 — `disposition: addressed` exists in live tree but §2.2 only documents `open|deferred` (Type: general; Domain: docs-sync; Disposition: open; Confidence: 75; Severity: Low)**
- Evidence: `phase-doc-count-verification.md:9` carries `disposition: addressed`. §4.4/§2.2 only sanction `disposition: open|deferred`. So `disposition: addressed` on a non-backlog file is correctly a leak, but `disposition: addressed` is also not even a documented backlog value.
- Why it matters: pre-existing data drift, not a §4 contradiction — §4 actually handles it correctly (flags it as a leak outside backlogs). Out of T0 scope; surfaced for the conformance-wave backlog.
- Suggested direction: none for T0; track in conformance wave.

## Verdict
PASS — §4 is internally and externally consistent with §1-3 and the locked design.
