# Ideation iter3 — Usage perspective (codex)

## Stage 0 Artifact Summary

The users of this artifact are the Planning loop, the Execution agent, and the future reader trying to understand why most project memory disappeared. Iter3 makes the E.2 session-dir deletion usable by replacing an unsatisfiable SHA-in-session gate with two literal git preconditions and by preserving the "failed gate means NEEDS_CONTEXT" rule.

## Stage 1 Locked Frame

- Scenario U1: The executor can run E.2 without interpretation.
  - Checklist: both gate commands are concrete; neither requires editing `session.json`; failure path is NEEDS_CONTEXT.
- Scenario U2: Stage D and E.1 can be committed separately.
  - Checklist: executor waits for `git ls-tree` to show the kept session dir in the branch tree before deleting the bare-UUID dir.
- Scenario U3: The executor can merge the reviewed PR head, not a stale or rebased head.
  - Checklist: reviewed head is captured; merge refuses if current head differs; post-merge verification does not depend on editable message text.
- Scenario U4 (adversarial): A tired executor sees the captured SHA echoed somewhere and assumes the merge is valid.
  - Checklist: the check is attached to merge mechanics, not just to logs, handoff text, or commit body text.

## Stage 2 Findings

### F-CX-U-03 — The Stage G instructions give the executor a weaker-than-available head guard

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Stage G captures `HEAD_SHA` at `draft-iter3.md:343-345`, then runs `gh pr merge <pr-num> --squash --delete-branch` without a head match at `draft-iter3.md:346`. The post-merge instructions grep commit body text at `draft-iter3.md:347-350`. `gh pr merge --help` shows `--match-head-commit SHA` as the CLI-supported way to require the PR head to match before merge.
- **Why-it-matters**: The executor still has to infer how to handle the race between capture and merge. The usable command should be `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` so a rebase or force-push between capture and merge fails before any wrong commit lands.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-U-01: addressed. The executor no longer needs to know what SHA should appear in `session.json`; no SHA is written there, and E.2 uses branch/tree checks at `draft-iter3.md:318-324`.
- F-CX-U-02: addressed enough for PASS. The draft still uses "terminal" while allowing later Wrap-up writes at `draft-iter3.md:325`, but now it clearly means terminal for the bare-UUID runtime dir, with later writes routed to the date-prefixed dir.
- F-CX-OV-02: open at Medium through F-CX-U-03.

## Per-perspective Verdict

PASS. The remaining usability issue is Medium, below the REVISE threshold.

## Must-Preserve

- Preserve the E.2 NEEDS_CONTEXT clause exactly.
- Preserve "after E.2, write only to the date-prefixed session dir."
- Preserve D4's inline placeholder README template.
- Preserve logging of the captured PR head SHA for audit, but do not confuse logging with merge enforcement.
