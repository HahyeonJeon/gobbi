# Usage Perspective — Task 06 iter2 (Claude)

**Target:** commit `c6a3e46`.

## Stage 0 — Target Understanding

User-facing usability of the LOCK #5 footnote — can a future manager (a) opt out into direct mode and (b) run the smoke-test gate as written?

## Stage 1 — Frame

- U1.a — A reader can determine direct vs worktree-pr behavior from the footnote alone (no chase to nonexistent target).
- U1.b — The smoke-test `jq` command, copy-pasted literally, produces output that the anchored regex actually matches.
- U1.c — `worktreePath` smoke check works literally.
- U1.d (adversarial) — A naive operator following the docs verbatim does not get false confidence or false failure.
- U1.e — Setting key referenced in the doc (`settings.git.workflow.mode`) — does it work end-to-end? (inherited iter1 U-01 / COD-USAGE-T06-001)

## Stage 2 — Evaluation

- U1.a — **yes**. Three behavioral axes (worktree creation, branch stamping, PR cadence) are inline; the reader does not need to follow a link to understand mode differences.
- U1.b — **yes**. Tool-verified: `jq -r '.git.branch'` on a stub `{"git":{"branch":"chore/session-2026-05-23-1b26cf20"}}` returns `chore/session-2026-05-23-1b26cf20` (no quotes), and `grep -E '^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$'` matches. The COD-USAGE-T06-002 false-fail path is closed.
- U1.c — **yes**. `jq -r '.git.worktreePath'` returns the raw path string (or `null` literal). Operator can `[ "$(jq -r ...)" != "null" ]` test it.
- U1.d — **mostly**. The smoke-test prose is now correct, but the doc still says "Run this check" without showing an explicit `grep -E ... && echo PASS || echo FAIL` chained assertion. The COD-RISK-T06-001 / U-01 / R-02 "manual prose only, no fail-closed gate" concern is **explicitly deferred to T07/T08** per the iter2 commit message. This is a documented deferral, not an open defect.
- U1.e — **open / deferred**. `settings.git.workflow.mode` still has no schema entry in `orchestration/templates/settings.default.json` (the `git` block contains only `repo / baseBranch / pr / issue / worktree / branch`; no `workflow.mode`). The iter2 commit message explicitly defers this to T01. The doc still references a key the schema does not yet honor; an operator who sets `settings.git.workflow.mode: "direct"` in their settings.json will have no schema validation of the key until T01 ships. **Inherited, deferred** — not a NEW iter2 finding, just unresolved.

## Findings

### U-01 (carried forward, deferred) — Direct-mode setting key not actionable from settings template

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: **deferred** (T01 backlog per iter2 commit body)
- Confidence: 100
- Severity: High (Codex iter1) / Medium (Claude iter1)
- Evidence: `orchestration/templates/settings.default.json` git block has no `workflow.mode` field; doc references `settings.git.workflow.mode` at lines 103, 109, 116.
- Why it matters: doc and schema disagree about whether the opt-out path exists in the settings schema.
- Iter2 disposition rationale: T01 owns settings.default.json; T06 cannot remediate without scope expansion. Commit body explicitly tracks this deferral.

## Verdict

**PASS-with-deferral**

The iter2 in-scope Usage fixes (jq -r) PASS. The Usage finding that remains open (settings key absence) is a deferred T01 inheritance, not a T06 defect of its own.
