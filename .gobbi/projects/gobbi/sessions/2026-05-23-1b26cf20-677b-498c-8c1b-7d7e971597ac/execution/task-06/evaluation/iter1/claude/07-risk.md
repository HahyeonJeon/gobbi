# Risk Perspective — Task 06 iter1

**Target:** commit `32b9adc` — what could go wrong downstream?

## Risk register

### R1 — Cross-link rot (HIGH likelihood, LOW impact)
The footnote points at `git/SKILL.md#core-principles`. Anchor exists today but is not enforced by any link-check. If git/SKILL.md is restructured, the link silently breaks.
- Materializes: cosmetic confusion for readers; no behavioral impact.

### R2 — Unimplemented schema key (MEDIUM likelihood, MEDIUM impact)
Footnote describes behavior switching on `settings.git.workflow.mode` — a key absent from `settings.default.json`. If a future task or contributor implements the manager-side switch by reading this key, they will get `undefined` and the resolved mode will fall to the default branch (whichever branch comes first in the manager's logic).
- Materializes: manager picks unintended branch silently. A `direct` user may get `worktree-pr` behavior or vice versa.
- See consistency C-02.

### R3 — Smoke-test never runs (MEDIUM likelihood, MEDIUM impact)
The "first post-merge session's Memorization phase" instruction is documentation-only. No hook, no CI check, no automated invocation. The first post-merge manager must remember to run the check.
- Materializes: regression in branch-naming goes undetected for multiple sessions. The very purpose of the smoke test (catch row 5.5 implementation drift early) is defeated.
- See usage U-01.

### R4 — Cross-link target does not deliver promised content (HIGH likelihood, MEDIUM impact)
git/SKILL.md § Core Principles does not define `direct` vs `worktree-pr` mode contracts. A reader following the link will not find what was promised and may either invent their own interpretation or escalate the ambiguity.
- Materializes immediately for any reader who follows the link with the goal stated in the footnote.
- See consistency C-01.

### R5 — Footnote contract drift from row 5.5 (LOW likelihood, MEDIUM impact)
Row 5.5 (T01) says "if `direct`: skip — `git.branch` will be stamped from the current HEAD in row 6". Footnote (line 109) repeats: "`git.branch` is stamped from the current HEAD in row 6". Consistent today. If row 5.5 changes the contract (e.g., adds a state to handle), the footnote may not be updated in lockstep.

### R6 — Smoke-test regex too strict (LOW likelihood, LOW impact)
Regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` fails for uppercase hex (would need `[a-fA-F0-9]{8}`) and any future ssid-short width change. RFC 4122 mandates lowercase, so this is defensible — but the regex carries the assumption silently.

### R7 — Direct-mode rationalization creep (MEDIUM likelihood, HIGH impact in principle)
The footnote lists two legitimate opt-out scenarios. A motivated manager could rationalize a third ("session is just doc-fixes; that's pure-read enough") — exactly the failure mode the explicit "two situations" language was meant to block. Footnote says "Outside these two situations the default is `worktree-pr`" but does not state a refusal-discipline.
- Mitigations in the footnote: the explicit "not a fallback-on-error path" framing helps. The bullet list specificity helps.

## Findings

- **R-01** — Type: `assumption_risk` / Domain: `docs-sync` / Disposition: `open` / Confidence: `100` / Severity: `Medium`
  - Refer to consistency C-01 + risk R4. The cross-link target does not contain the promised content. From a risk lens this is an active failure mode that triggers on the next read, not a hypothetical.

- **R-02** — Type: `assumption_risk` / Domain: `process` / Disposition: `open` / Confidence: `75` / Severity: `Medium`
  - Smoke-test gate is doc-only, not enrolled in any phase doc / hook / CI. Likely to be forgotten between merge and first post-merge session.

- **R-03** — Type: `general` / Domain: `process` / Disposition: `open` / Confidence: `50` / Severity: `Low`
  - Direct-mode rationalization creep risk (R7). The footnote is well-worded but lacks an explicit "if in doubt, default to worktree-pr" instruction.

## Verdict (risk perspective)

**REVISE.** R-01 + R-02 (both Medium, Confidence ≥ 75) represent two active failure modes the change introduces or fails to mitigate.

## Preserve list

- The "not a fallback-on-error path" disambiguation — a real defense against rationalization.
- The explicit two-scenario specificity for legitimate opt-out.
