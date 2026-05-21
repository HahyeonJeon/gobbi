# Ideation iter3 — Structure (claude)

## Stage 0 Artifact Summary

iter3 splits the Stage E.2 gate from iter2's self-referential SHA-in-session.json into two non-circular pre-conditions (`git log --format=%H -1` + `git ls-tree`). Stage G adds 1 pre-merge step (`HEAD_SHA` capture) + 1 post-merge step (body grep against `$HEAD_SHA`). All other structural shape preserved.

## Stage 1 Locked Frame (Structure)

- S-S1: Commit-vs-FS labeling consistent across stages.
- S-S2: Ordering invariants enumerate every load-bearing edge.
- S-S3 (adversarial): Bisect-safe commit allowance does NOT undermine the new Stage E.2 gate.

## Inherited Findings Dispositions

| ID | iter2 verdict | iter3 disposition | Evidence |
|---|---|---|---|
| F-S-01 (Stage D↔E commit boundary) | addressed | **addressed (preserved + reshaped)** | iter2 H-3's structural split (E.1/E.2) survives; only the E.2 gate's contents are replaced. |
| F-S-02 (`-mindepth 1`) | addressed | **addressed (preserved)** | Stage F line 332 verbatim |
| F-S-03 (commit-vs-FS labels) | addressed | **addressed (preserved)** | Inline labels intact |
| F-S-05 (E.2 session.json divergence) | open Medium/50 | **superseded** | iter3 Q-Gate-Redesign drops the session.json update entirely — the divergence concern evaporates because there is no longer ANY session.json mutation in the gate. |

## Stage 2 Findings (Structure)

### F-S3-01 — Stage E.2 gate's Pre-condition 2 robust against bisect-safe commit splits

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: addressed (verified)
- **Confidence**: 100
- **Severity**: n/a (no finding)
- **Evidence**: iter3 line 314 explicitly allows the kept session-dir `git add` to land "with Stage D's gitignore edits, or as a follow-on bisect-safe commit on the sweep branch." Pre-condition 2 uses `git ls-tree <sweep-branch> ...` (the branch tip), not a specific commit — so the gate passes whether the session dir is in one commit or split across two. This is structurally sound.

### F-S3-02 — Critical Invariant #7 (head-SHA capture/verify ordering) cleanly stated

- **Type**: general
- **Domain**: process
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: n/a
- **Evidence**: Lines 362-363 add Invariant #7 explicitly: capture BEFORE `gh pr merge`, verify AFTER. The structural sequence is unambiguous.

### F-S3-03 — D6 validation-summary table updated coherently

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: n/a
- **Evidence**: Lines 433-445 — D6 table replaces the iter2 D9 row ("SHA gate") with "D9 E.2 gate (iter3 Q-Gate-Redesign)" and adds D10 + D11 rows for the new mechanics. Internally consistent.

## Karpathy Failure Modes (Structure lens)

- **Wrong assumptions**: NO — the self-reference assumption is explicitly corrected at D9 (lines 461-470).
- **Overcomplexity**: NO — gate simplified, not bloated.
- **Orthogonal edits**: NO.
- **Imperative-over-declarative**: NO — gate stated declaratively as two binary pre-conditions.

## Must-Preserve list (Structure lens)

1. Stage E.1/E.2 split structure (the FS-only terminal post-commit operation).
2. NEEDS_CONTEXT discipline on gate failure (lines 323, preserved per `executor-rationalized-failing-verification-gate.md`).
3. The 7 critical ordering invariants block (lines 354-362).
4. Commit-vs-FS inline labeling.
5. Stage 0 archival tag at `487fc35` before any deletion.

## Verdict

**PASS**.

Driver: The structural fix is sound. The E.2 gate is non-circular and verifiable by deterministic `git` plumbing. The bisect-safe commit allowance is structurally compatible with Pre-condition 2 (uses branch tip, not a specific commit). The Stage G capture/verify pair is well-ordered. No structural finding rises to High/50.

(Caveat: the *correctness* of the D11 verify step depends on a `gh pr merge --squash` behavior that may not hold — that finding is Consistency-domain, not Structure.)
