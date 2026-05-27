---
name: evaluator-revise-may-contradict-the-standard-manager-disputes-with-evidence
description: An evaluator REVISE verdict can contradict the locked standard; manager must ground-truth every divergent finding against the spec, not just the brief, and dispute with evidence rather than remediating.
type: decisions
scope: project
feature: null
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, evaluation, dual-system]
mistake-candidate: true
domain: process
supersedes: null
superseded_by: null
decision_status: accepted
---

# When an evaluator REVISE contradicts the standard, manager disputes with evidence and does not remediate

## Context

On P5b (prose wave — 20 docs in `features/install-runtime/`), the dual-system evaluation produced a split verdict: Claude PASS / Codex REVISE with 2 High findings. The pessimistic-union default would treat any REVISE as blocking and trigger a remediation round.

Both Codex findings, when ground-truthed against `memorization/rules.md` §4.3 (line 186) and the checklist template, directly contradicted the locked §4 standard:

- **F1 (checklists with `## Source`/`## Related` are "ad-hoc"):** §4.3 explicitly permits `## Source` footers; 4 prior-PASSED checklists already carry additive `## Related` sections. Stripping them would degrade conformance.
- **F2 (precise session-coordinate refs "weakened" to generic prose):** §4.3 mandates stripping iteration markers (`iter1`, `draft-iter3`, evaluation path pointers) from evergreen bodies and routing provenance to a `## Source` footer — exactly what P5b did. Re-inserting `evaluation/iter1/claude/structure.md` pointers would be a §4.3 violation.

Claude PASSed correctly and performed full evidence-backed verification (D5 scan, §4.5 gate, 13 cross-ref checks).

## Decision

The manager ground-truthed both Codex findings against the locked §4 standard, dispositioned them DISPUTED with cited evidence (`memorization/rules.md §4.3:186`, checklist template, prior-PASSED precedent), and accepted Claude's PASS as the operative verdict. No remediation was performed.

## Rationale

Remediating a REVISE finding that contradicts the standard moves the work FURTHER from conformance, not closer. The manager is the arbiter against the spec — not the evaluator brief, not the pessimistic-union rule. When a finding demands an action the standard explicitly prohibits-the-opposite-of, the correct disposition is DISPUTED + no remediation.

Dual-system evaluation provides real value (Codex caught genuine issues on P4) but the evaluator operates against the brief, not always the full standard. The brief cannot carry the full §4 standard verbatim; evaluators can over-apply a quoted clause beyond its actual scope.

## Alternatives considered

- **Remediate per Codex findings:** Would strip §4.3-sanctioned `## Source` footers and re-insert session-coordinate paths §4.3 mandates removing — net conformance regression. Rejected.
- **Pessimistic union (any REVISE → REVISE):** Would have forced a remediation round that degrades the work. Rejected when findings contradict the standard.
- **Accept Codex and reject Claude:** Codex had no evidence-backed verification (no D5 scan output, no gate results); Claude had full diff-based evidence. Rejected.

## Consequences

- The manager MUST ground-truth every divergent evaluator finding against the LOCKED STANDARD, not just the evaluation brief, before deciding whether to remediate or dispute.
- A REVISE finding that demands an action the standard explicitly forbids (or permits-the-opposite-of) is dispositioned `disputed`, not remediated.
- The dispute record MUST cite the specific standard section + line number + precedent evidence so the rationale is reproducible.
- Dual-system evaluation value is preserved: the pattern (Codex catches real issues, Claude catches others) is real; the manager arbitrates divergence against the spec.

## How to detect this situation

An evaluator finding demands an action that the §4 standard (or the applicable rules file) explicitly permits-the-opposite-of. Tests:

1. The finding says "remove X" but the rules file explicitly permits X.
2. The finding says "re-insert Y" but the rules file explicitly mandates stripping Y.
3. The finding cites a template clause in isolation when the full template/rules says something broader.
4. Prior work already passed with the same pattern the finding now flags as a violation.

Any of these is a signal to ground-truth before remediating.

## Corrected approach

1. Read the finding's claim.
2. Open the relevant standard section (e.g., `memorization/rules.md §4.3`, the specific template).
3. Ask: does the standard permit or mandate the opposite of what the finding demands?
4. If yes: disposition `disputed`, cite the standard + line number + precedent, do NOT remediate.
5. If no (finding is aligned with the standard): remediate normally.

## Related

- [[evaluator-false-pass-without-diffing]] — the complementary failure: evaluator claims PASS without evidence. This mistake is the REVISE-direction failure: evaluator claims REVISE when the standard says PASS.
- `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P5b-install-runtime-b-prose/artifacts/verification-report.md` — the P5b dispute record with full citations.
