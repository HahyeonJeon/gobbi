# Overall — Wrap-up promotion + handoff (session 422308da, iter1, claude)

## Summary of the seven perspectives
| Perspective | Verdict | Note |
|---|---|---|
| project | PASS | 10/10 coverage; contract fulfilled |
| structure | PASS | routing/naming/frontmatter/sections all conform; §4.5 gate clean |
| performance | PASS | no dup mistakes; layer2 consolidates not sprawls |
| aesthetics | PASS | self-contained, plain; minor non-gating finding-ID lean |
| usage | PASS | every handoff claim traces to a real path/SHA |
| consistency | finding (Medium/100) | manifest+handoff falsely claim `decision_status` stripped |
| risk | finding (Medium/100) | same defect framed as forward-propagation risk |

## Cross-perspective tension
The single substantive defect surfaces in both Consistency and Risk and is ONE issue, not two: the manifest (lines 42/50/65) and handoff (line 95) claim `decision_status: accepted` was stripped from the promoted decision files "per §2.3 allowlist." On disk, both decision files retain `decision_status: accepted` — correctly, because `decision_status` is a legitimate decisions extension (rules §2.2 line 105) and an explicit KEEP-list key that "must NEVER be stripped" (§4.4 line 238). So the actual promotion is CORRECT; only the audit record describing it is wrong. This is the inverse of the usual leak: not a field that leaked, but a false claim that a (legitimate, retained) field was removed.

Severity calibration: the live memory is uncorrupted — the canonical §4.5 conformance gate prints zero leak files across all project memory, and every promoted file is well-formed. The harm is forward-looking: the promotion-manifest is the trusted audit example a future Wrap-up may copy, and the claim, if believed, would lead an agent to strip a legitimate field and break the §2.2 status model (the exact safety-invariant violation §4.4 guards). That keeps it Medium, not High — it does not corrupt anything today and the fix is a two-line edit to two audit docs, no change to promoted files.

## Karpathy failure-mode scan
- **Verification theater:** PRESENT in mild form — the promoter wrote "stripped per §2.3 allowlist" into the manifest without verifying against the file it had just written and without checking the field against the KEEP list. This is the documented `manager-asserted-unverified-state-into-outward-artifacts` / `wrap-up-promotion-must-strip-staging-frontmatter` family. Caught here; contained because the actual files happen to be correct.
- **Silent drop / coverage gap:** NONE — 10/10 accounted, 3 drops verified against the shipped tree.
- **Dup/sprawl:** NONE — mistakes distinct, layer2 consolidates.
- **Scope creep:** NONE.

## Must-preserve (remediation must not break these)
1. The two promoted decision files MUST keep `decision_status: accepted` — it is a KEEP-list legitimate extension. Do NOT "fix" the files to match the false manifest claim. The fix is to the manifest/handoff text, not the files.
2. Both promoted mistakes are well-formed (4 §4.2 sections, priority/domain, `mistake-candidate` stripped, real cross-links). Preserve.
3. The layer2 file's generalization + claim-type→authoritative-source table — preserve; it is the highest-value artifact of the loop.
4. Handoff's commit/path traceability (all 3 SHAs + subjects + files verified) — preserve.
5. The §4.5 gate-clean state of project memory — preserve.

## Verdict computation
- Critical (conf≥75): none → not FAIL.
- High (conf≥50): none → not REVISE.
- Highest finding: Medium/100 (one issue, double-reported under Consistency + Risk).
- Per thresholds (Critical→FAIL, High→REVISE, else PASS): **PASS.**

The Medium finding is real and should be remediated (correct the two audit docs), but it does not meet the REVISE bar and the live promotion is correct and usable as-is. I record it for the manager to decide whether to patch the manifest/handoff before closing.

## Overall verdict
PASS
