# Planning iter2 — Structure perspective (Claude)

## Stage 0 — Artifact summary

Target: iter2 draft Plan. Perspective: is the task graph well-formed, are commit boundaries declarative, are verification gates anchored?

## Stage 1 — Locked frame

- S-S1 DAG is well-formed (Task 01 → Task 02, single lane); manager-ops sit outside the planned-task graph.
- S-S2 Commit-count contract is EXACTLY 3 (D-PLAN-06 / Fix 2).
- S-S3 Stage D + Stage E.1 share a single commit; the staging order is explicit (D edits staged first, then E.1's `git add`, then a single `git commit`).
- S-S4 Verifies blocks A/B/C/D map to verifiable git invocations.
- S-S5 Stage E.2 gate uses read-only `git log` + `git ls-tree` (not SHA-in-session.json).
- S-S6 Self-review spec-coverage matrix matches the task definitions.

## Stage 2 — Findings against iter1 ledger

| iter1 ID | iter1 verdict | iter2 disposition | Confidence | Evidence |
|---|---|---|---|---|
| F-CL-S-01 (Stage E.1 commit boundary ambiguous, High/75) | open | **addressed** | 95 | Line 104-106 (File map § Stage D+E.1 header) makes the boundary unambiguous; line 460(d) ("D+E.1 share a commit by staging D's edits and E.1's add before the single `git commit`") nails the procedural recipe; verifies block C line 280 now says `git rev-list --count develop..<sweep-branch>` == 3 (was "≥4"). |
| F-CL-S-02 (Success #5 verifies wrong post-state, Low/50) | open | **addressed** | 90 | Line 286 labels the executor-side check as `#5-pre` explicitly; Success Criteria matrix line 500 has the authoritative Success #5 attribute to Manager post-merge with the literal Scope Contract regex. The "joint" semantic gone. |
| F-CL-S-03 (Stage E.2 traces-to non-verbatim, Low/50) | open | **partial** | 60 | Line 191 still has the Plan-side gloss "TERMINAL post-commit operation (NOT part of any commit)" — same wording as iter1 line 180. The leader's iter2 self-review does NOT address F-CL-S-03 directly. However this was a Low/50 in iter1; not part of the four surgical fixes. Acceptable as deferred. |
| F-CX-PLAN-O-02 (≥4 commits impossible since Stage F is local-only-no-commit, High/80) | open | **addressed** | 100 | Lines 281, 458, 659, 661 lock the commit count to EXACTLY 3 and explicitly attribute commit 3 to D+E.1; Stage F no longer contributes any commit (it's manager-direct refs/worktree work, not a commit at all). |

**New iter2-only findings:**

### F-CL2-S-01 — `verifies:` block C is missing an explicit `git commit` instruction for commit 3

- Type: checklist_gap
- Domain: process
- Disposition: open
- Confidence: 65
- Severity: Low
- Evidence:
  - Line 460(d): "D+E.1 share a commit by staging D's edits and E.1's add before the single `git commit`" — this is in the Special-discipline cell of Agent assignments, NOT in the imperative body of Task 02's `what:` or `files:` ordering.
  - Task 02 `files:` lines 249-256 list D + E.1 entries in order but do not say "after all of these are staged, run `git commit`".
  - The verifies block C asserts the POST-condition (3 commits exist) but not the procedural step that produces commit 3.
- Why it matters: Sonnet executor reading the `files:` block plus the `verifies:` post-condition has to infer the staging-then-commit order from a cell three sections away. The Fix-2 recipe is correct but its placement is fragile.
- Suggested direction: add one line at the end of the Stage D+E.1 sub-list in File map: "→ `git commit -m '<msg>'` (single commit; do NOT amend)". Mirror in `what:` if space permits.

### F-CL2-S-02 — Spec-coverage matrix loses parallel "Stage A — branch-open" entry vs. "Stage A — Discovery"

- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 70
- Severity: Low
- Evidence: Self-review § 1 matrix lines 474-475 has Stage A split into two rows. But Task 02 `traces-to:` line 186 still cites a single "Stage A — Discovery + pre-flight (S1, S4, S7)" without acknowledging the split. The matrix shows the split; the `traces-to:` doesn't.
- Why it matters: Self-review matrix is authoritative for ownership, but `traces-to:` is what the executor reads to know what it owns. A reader of only `traces-to:` would still think Stage A's branch-open is in Task 02. The Fix-4 correction lives in the matrix but is missing from the more-frequently-referenced `traces-to:`.
- Suggested direction: edit `traces-to:` line 186 to "Stage A — Discovery + pre-flight scans (S1, S4, S7) — note branch-open is Manager pre-Task-02 §2 per D-PLAN-07".

## Stage 3 — Structure verdict

The 2 High-severity structural defects from iter1 (F-CL-S-01 commit ambiguity + F-CX-PLAN-O-02 ≥4 contradiction) are decisively addressed. F-CL-S-03 partial (acceptable, Low). Two new Low-severity gaps surface in iter2 (commit instruction placement + Stage A `traces-to:` not updated to match matrix split). Neither is High or Critical. **PASS** with deferred cleanup.

Verdict: **PASS**

## Must-preserve list

- D-PLAN-06 exact-3-commit lock + verifies block C `rev-list --count == 3`.
- The "Stage D's edits staged before E.1's `git add` before the single `git commit`" ordering recipe.
- Stage E.2 read-only gate (`git log` + `git ls-tree`).
- Spec-coverage matrix shape (12 rows, ✓ marker, owner column).

```
STATUS: DONE
VERDICT: PASS
```
