# Ideation iter3 — Consistency (claude)

## Stage 0 Artifact Summary

iter3 adds the head-SHA capture/verify mechanism (D11). The artifact internally claims this mechanism works because "GitHub's default squash-merge commit body includes the source commit short-SHAs in a trailer block." This empirical claim is verifiable against this repo's history.

## Stage 1 Locked Frame (Consistency)

- S-C1: Cross-section claims about external tools match observed tool behavior.
- S-C2: Section X claims match section Y claims (internal coherence).
- S-C3 (adversarial): Every assertion presented as an empirical fact about `gh`/`git` behavior is checked against this repo's actual history.

## Inherited Findings Dispositions

| ID | iter2 verdict | iter3 disposition |
|---|---|---|
| F-C-01 (Success #2 multi-commit) | addressed | **addressed (preserved)** |
| F-C-02 (post-merge `git branch -d`) | addressed | **addressed (preserved)** |
| F-C-03 (worktrees/ design ↔ command) | addressed | **addressed (preserved)** |
| F-C-04 (`.gitignore` line numbers) | addressed | **addressed (preserved)** |
| F-C-05 (D2 #15 inline audit redundancy) | open Low | **open** |
| F-C-06 (Success #5 sequencing) | open Low | **open** |

## Stage 2 Findings (Consistency)

### F-C3-01 — D11 Option A's empirical claim about `gh pr merge --squash` body format contradicts this repo's actual squash-merge history

- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**:
  - iter3 line 486 (D11 Option A): "GitHub's default squash-merge commit body includes the source commit short-SHAs in a trailer block ('* <short-sha> <commit-subject>')".
  - iter3 line 488 (D11 Option B): "...the merge commit body, which GitHub's squash trailer **always includes**."
  - iter3 line 218 (I11): "`gh pr merge --squash` produces a single commit on develop whose default body cites the source PR's SHA in GitHub's squash-merge trailer."
  - **Disconfirming evidence from this repo's `git log`**:
    - `git log -1 --format=%B 487fc35` (PR #262, the most recent squash-merge, *closed just yesterday*): body contains only the 2 source-commit subjects + `Closes #259` + `AI-Provenance-Record` trailers. No source-commit SHA. `grep -oE '[a-f0-9]{40}' returns empty.
    - `git log -1 --format=%B 228fbdc` (PR #261): body is empty except `fix(mirrors): complete v0.5 plugin/runtime mirror sync (#261)`. No SHA.
    - `git log -1 --format=%B adae51e` (PR #260, 19-iter campaign): body has only the squash subject + "(closes #257)". No SHA.
    - `git log -1 --format=%B f3769cc` and `cd9eb86`: same — only commit-subject content, no source SHA trailer.
- **Why-it-matters**: I11 is presented as a Research Insight that anchors D11's design. The insight is empirically incorrect for this repo's PR-merge style. Internal consistency is broken: D11 asserts a behavior, I11 cites that behavior as observed, but recent merges in this exact repo refute it. This makes the iter3 F-CX-OV-02 fix mechanically inert.
- **Suggested direction**: Verify against `gh pr merge --squash` behavior directly (run `gh help pr merge` and confirm) OR rewrite the verify step to use `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` against the develop tip's `git rev-parse HEAD`. The latter is the actually-supported GitHub-CLI guarantee.

### F-C3-02 — D2 #20-21 (post-merge verify) cite "grep -F $HEAD_SHA" but this repo's squash-bodies do not contain HEAD_SHA

- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High (same root as F-C3-01)
- **Evidence**: Lines 402-403 of iter3 enumerate the verify commands. They depend on F-C3-01's claim. Same disconfirming evidence.
- **Why-it-matters**: D2 is the executor-facing verification gate enumeration. Items #20-21 will fail on every happy-path merge as observed in this repo's actual squash history.

## Karpathy Failure Modes (Consistency lens)

- **Wrong assumptions**: YES — I11's empirical claim about squash-merge body shape does not hold in this repo. iter3 trusts the claim.
- **Overcomplexity**: NO.
- **Orthogonal edits**: NO.
- **Imperative-over-declarative**: NO.

## Must-Preserve list (Consistency lens)

1. The `gh pr view --json mergeCommit -q .mergeCommit.oid` capture pattern (D11 Option A, first half) — that field DOES exist and is reliable.
2. The `gh pr view --json headRefOid -q .headRefOid` capture pattern — the field IS supported and is the right pre-merge anchor.
3. The Stage E.2 non-circular gate.

## Verdict

**REVISE**.

Driver: F-C3-01 + F-C3-02 — both High/100. iter3's I11 + D11 + D2 #20-21 + Success #14 cluster around an empirically incorrect assertion about `gh pr merge --squash` body format. This repo's last 5 squash-merges all refute the assertion. The fix mechanism is inert at best, false-alarm-generating at worst.

(Note for the manager: the underlying intent — proving that the merged commit corresponds to the reviewed tip — is sound and is the legitimate F-CX-OV-02 concern. The proper mechanism is `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` compared against `git rev-parse develop` after pull, not a body-grep for the source SHA.)
