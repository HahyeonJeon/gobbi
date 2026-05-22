# Ideation iter3 — Risk (claude)

## Stage 0 Artifact Summary

iter3 removes the iter2 self-referential gate (good — risk reduction) and adds a head-SHA capture+verify (intended risk reduction). The capture step is sound; the verify step's mechanism risks producing false alarms.

## Stage 1 Locked Frame (Risk)

- S-R1: Destructive operations have non-rationalizable gates.
- S-R2 (adversarial): Gate failure modes don't train the operator to ignore the gate.
- S-R3: Recovery paths are concrete.

## Inherited Findings Dispositions

| ID | iter2 verdict | iter3 disposition |
|---|---|---|
| F-R-01 (`.codex/` symlink note) | addressed | **addressed (preserved)** |
| F-R-02 (mistake files deleted) | addressed | **addressed (preserved)** — user-accepted H-2 trade-off |
| F-R-03 (D2 gate honesty) | addressed | **addressed (preserved)** — and reinforced by Q-Gate-Redesign |
| F-R-04 (tag push irreversibility) | open Low n/a-solo | **open (unchanged)** |
| F-R-05 (H-2 depends on draft survival) | open Low informational | **open (preserved)** |
| F-R-06 (untracked-mistake-file ordering) | open Low | **open (unchanged)** |

## Stage 2 Findings (Risk)

### F-R3-01 — D11 verify step is a false-alarm generator that trains the operator to bypass the gate (meta-risk)

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**:
  - The verify step (D11 lines 485-487, D2 #20-21, Success #14, Stage G lines 347-350) requires that the squash commit body contain `$HEAD_SHA`. This repo's most recent 5 squash-merges (487fc35, 228fbdc, cd9eb86, adae51e, f3769cc) all show no source-SHA references in their bodies — only commit subjects and `Closes #N` trailers.
  - As written, the executor will fire NEEDS_CONTEXT on every honest happy-path merge.
  - iter3 line 349-350: "If neither matches: NEEDS_CONTEXT — the merged commit may not correspond to the reviewed tip (possible force-push or merge-strategy substitution). Do not rationalize."
- **Why-it-matters**: This is the *exact* failure mode that `executor-rationalized-failing-verification-gate.md` warns against, escalated one level: a verification gate that is structurally unable to pass in the happy path forces the operator (here, the manager) to develop an institutional habit of waiving the gate. Once the habit is established, the gate stops protecting against the *real* force-push attack it was designed to detect. The remediation thus *worsens* the risk surface relative to having no check at all: at iter2 there was no check (acknowledged risk); at iter3 there is a check that fires falsely, which the manager will learn to ignore, which means a real force-push event slips through under the same fatigue.
- **Suggested direction**: Replace the body-grep verify with a structural check that succeeds on the happy path and fails only on substitution. The canonical sound mechanism is:
  - Capture: `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)` (pre-merge — unchanged from iter3).
  - Verify: confirm `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` returns a non-empty value (GitHub recorded a successful merge of the PR whose head we captured). The mergeCommit field on a squash-merged PR is GitHub's authoritative record that the API-merge succeeded against the recorded `headRefOid`. There is no need to grep the commit body.

### F-R3-02 — Stage E.2 gate now genuinely non-circular and rationally pass-able

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: n/a (positive finding)
- **Evidence**: Lines 318-326. Pre-condition 1 (`git log --format=%H -1 <sweep-branch>`) succeeds for any non-empty branch. Pre-condition 2 (`git ls-tree <sweep-branch> ...`) succeeds as long as the kept session dir was added in any commit on the sweep branch. Both succeed in the normal flow. The F-CX-OV-01 fix is genuine.

## Karpathy Failure Modes (Risk lens)

- **Wrong assumptions**: YES (carried via D11/I11 — same as Usage/Consistency findings).
- **Overcomplexity**: NO.
- **Orthogonal edits**: NO.
- **Imperative-over-declarative**: NO.

## Must-Preserve list (Risk lens)

1. Pre-reset tag at `487fc35` BEFORE deletion (Stage 0).
2. NEEDS_CONTEXT discipline on E.2 gate failure (preserved cleanly).
3. The `executor-rationalized-failing-verification-gate.md` mistake's principle of non-rationalizable gates.
4. The HEAD_SHA capture step — useful for audit log.
5. F-R-02's user-accepted H-2 trade-off acknowledgement.

## Verdict

**REVISE**.

Driver: F-R3-01 — High/100. The new Stage G verify mechanism is a false-alarm generator on this repo's observed squash-merge style. This is a *meta-risk*: it doesn't just fail to detect the force-push attack it targets — it trains the operator to ignore the gate, which then fails to detect the real attack the next time too. The fix needs to use `gh pr view --json mergeCommit` directly (which IS supported) instead of grepping the commit body for a SHA.
