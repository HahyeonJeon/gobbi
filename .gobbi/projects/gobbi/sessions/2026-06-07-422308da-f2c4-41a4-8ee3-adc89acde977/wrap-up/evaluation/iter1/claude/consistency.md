# Consistency Perspective — Wrap-up promotion + handoff (iter1, claude)

## Frame
Do the audit-trail documents (manifest, inventory, handoff) agree with each other AND with the on-disk reality? Internal consistency of the promotion record.

## What I verified
- Manifest Summary table (10 rows + L2) vs inventory tables vs handoff promotion-summary: counts agree (2 dec / 2 mistake / 3 backlog / 1 layer2 / 3 drop / 10 total).
- Actual on-disk files match every routing destination.

## Findings

### F-CONS-1 — Manifest and handoff falsely claim `decision_status: accepted` was stripped on promotion
- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:**
  - Manifest line 50 (File #4): "Frontmatter stripped: `decision_status: accepted` (staging-routing field)".
  - Manifest line 65 (File #6 rationale also references decision_status as staging-routing); manifest line 42 (File #3) and the handoff line 95: "staging-routing fields (`decision_status`, `item_status`, `anchor`, `implemented_in`, `scenario`) stripped per §2.3 allowlist."
  - Actual promoted files: `features/workflow/decisions/2026-06-07-routine-triage-vs-safety-gate-classification.md:13` and `2026-06-07-rebase-worktree-to-current-develop.md:13` BOTH contain `decision_status: accepted`. It was NOT stripped.
  - Standard: `memorization/rules.md §2.2` line 105 lists `decision_status` as a legitimate decisions extension; §4.4 KEEP list line 238 names `decision_status` among keys that "must NEVER be stripped". Retaining it is CORRECT; the strip the manifest claims would have VIOLATED the safety invariant.
- **Why it matters:** The promotion-manifest is the append-only audit record of what Wrap-up did to project memory. It asserts an operation (strip `decision_status`) that (a) did not happen and (b) must not happen per the standard. A future agent who trusts the manifest will believe decision files ship without `decision_status` and may "fix" correct files by stripping a legitimate field — the exact safety-invariant violation §4.4 guards against. This is the inverse failure of mistake `wrap-up-promotion-must-strip-staging-frontmatter` and a direct instance of `manager-asserted-unverified-state-into-outward-artifacts` (asserting an unverified operation into an outward-facing record). The actual files are fine; the record lies.
- **Suggested direction:** Correct the manifest's "Frontmatter stripped" lines for files #1/#3/#4/#6 to list only the keys actually stripped (`mistake-candidate` on #3/#6; nothing else for #1/#4 since `decision_status` is a KEEP-list extension), and correct the handoff line-95 sentence to remove `decision_status` from the stripped-keys list. No change to the promoted files themselves.

## Verdict
REVISE (one Medium; below the High≥50 REVISE bar by severity — see note)

NOTE on verdict: per threshold rules a lone Medium does not by itself force REVISE (REVISE requires High conf≥50). This perspective records the finding as Medium/100; the Overall verdict aggregates. Marking this perspective REVISE here would over-state; I record it as the finding and defer the gate to Overall, which computes PASS-with-Medium.
