# Risk Perspective — Wrap-up promotion + handoff (iter1, claude)

## Frame
What could silently mislead a future session or corrupt project memory? Frontmatter leaks, false audit claims, dropped findings, mis-promoted scope.

## What I verified (adversarial)
- **Strict frontmatter-key leak grep** on all 9 newly-promoted files for `mistake-candidate|item_status|promoted-from|promoted-at|decision_status|implemented_in|anchor|scenario`:
  - 2 mistakes: CLEAN. `mistake-candidate` correctly stripped.
  - 2 decisions: `decision_status: accepted` present — but this is a KEEP-list legitimate extension (§4.4), NOT a leak.
  - 3 backlogs: CLEAN (`item_status`/`anchor`/`implemented_in`/`scenario` all stripped).
  - layer2 + journal: CLEAN.
- **Canonical §4.5 conformance gate** over all project memory → ZERO leak files. No actual frontmatter corruption entered project memory.
- **No silent drop:** 10/10 staging files have a routing disposition.
- **Drop-as-addressed verified against shipped tree** (not trusted from the manifest): all 3 genuinely implemented (chat-mode silent + evaluation.md self-cite; SKILL.md:266; T4 6/3 classification landed).

## Findings

### F-RISK-1 — Audit trail asserts an unperformed (and prohibited) strip operation
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Same as F-CONS-1 — manifest lines 42/50/65 and handoff line 95 claim `decision_status` was stripped "per §2.3 allowlist"; it was not, and §4.4 line 238 forbids stripping it. The promoter wrote a strip-claim into the audit log without verifying it against the file it had just written, and without checking the field against the KEEP list.
- **Why it matters:** This is precisely the family of the pre-loaded mistake `manager-asserted-unverified-state-into-outward-artifacts` and `wrap-up-promotion-must-strip-staging-frontmatter`. The risk is propagation: a future Wrap-up that uses this manifest as a worked example, or an agent normalizing decision files against this audit claim, could strip a legitimate field and break the documented status model (§2.2). The audit record is the one artifact that must be trustworthy about what touched memory; here it is wrong about its own action. Contained because the actual files are correct and the §4.5 gate is clean — so live memory is uncorrupted today; the risk is forward-looking.
- **Suggested direction:** Same as F-CONS-1 — correct the manifest "Frontmatter stripped" lines and the handoff stripped-keys sentence to reflect what was actually (and correctly) done.

## Other risk checks — clean
- No scope creep: mistakes are project-scope `feature: null` (correct — process traps transcend the workflow feature); decisions/backlogs feature-scope `workflow` (correct).
- No supersession errors: all new files `supersedes/superseded_by: null`; no existing file wrongly flipped.
- Cross-links resolve: all `mistakes/…` paths in the new files point at on-disk files.

## Verdict
PASS-with-Medium (no Critical, no High; one Medium/100 — does not cross the FAIL or REVISE thresholds)
