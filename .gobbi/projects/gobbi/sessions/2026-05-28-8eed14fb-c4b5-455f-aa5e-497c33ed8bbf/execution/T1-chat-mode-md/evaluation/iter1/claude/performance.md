# Performance Perspective — chat-mode.md (T1, iter1)

**Verdict:** PASS

**Scope:** For a markdown skill sub-document, "performance" means: reader cost (time-to-spec-answer), token cost when loaded as a skill, scan-cost (heading density), redundancy (DRY), and the runtime cost of the procedure the doc specifies (not its prose). Adversarial bias: longer is not always better — Iron Law 11 (no improvement that games the tool) says do not pad for verbosity.

## Quantitative profile

| Metric | Value | Notes |
|---|---|---|
| Total lines | 509 | vs Plan floor 200; 2.5× minimum |
| Total chars (approx) | ~28 KB | ~6-7K tokens at 4 chars/token |
| H2 sections | 10 + Cross-refs | dense but navigable |
| H3 sections | 8 (under §6 and §8) | proportional split |
| Fenced code blocks | 5 (1 diagram + 1 settings + 1 status + 2 tree) | spec-essential |
| Tables | 4 (header form, top-tier, per-task-tier, state-transition, settings) | all load-bearing |
| Term-lock occurrences | 22 × "per-task slice" | reinforced naturally |
| R5 canonical statement | exactly 1 (§4 anchor); 14 short-form pointers | optimal — single source + pointers |

## Reader-cost analysis

A reader asking "what is Chat MEMORIZATION's behavior?" finds:
- the cross-reference in §1 (L5) within ~5 seconds
- §4 anchor at L133 within ~15 seconds via the heading scan
- the four-bullet skeleton in ~10 more seconds

Total time-to-answer: ~30 seconds for the highest-traffic question. Acceptable.

A reader asking "where does task-record live?" finds:
- §6.1 (L215) directly via heading scan
- D-A statement at L217 + D-B layout at L234 within ~20 seconds

A reader asking "what does the state machine do when Preparation hits maxIter=0?" finds:
- §8.2 row at L391 ("loop-entry guard reads `maxIterations: 0`") — directly indexed

The doc is queryable.

## Redundancy analysis (Iron Law 11 — gaming)

The doc deliberately re-states some content at three locations: term lock (§2 + §3 diagram + §5), the §4 R5 canonical statement (§4 itself + 14 short-form pointers + state-table cells). I view this as **acceptable redundancy** because:
- Term lock at three locations defends against future drift (the mistake `section-order-is-part-of-the-contract` rationale).
- §4 short-form pointers are pointers, not copies — they all forward to §4.
- The discuss-first contract appears in §5 (per-loop discipline) and §10 (mode-level statement). §10 explicitly explains the duplication is intentional ("Documenting at both settings-level (§9) and mode-level (§10) prevents silent regression").

No findings of padding-for-line-count or gaming-the-200-line-floor. The doc is structural, not bulked.

## Runtime cost of the specified procedure

The procedure the doc specifies (per-task slice loop) has runtime properties worth flagging:
- Each per-task slice contains 3 nested loops (Ideation + mini-Planning + mini-Execution), each with maxIter=2.
- Worst case: 3 loops × 2 iter × (DISCUSSION + WORK + EVAL + MEMO + ITER) = 30 row-actions per task, plus the user-review gate at end.
- Iter cap of 2 (vs Auto's 3) keeps the per-task budget bounded — explicit signal "reframe or split" if hit.

The state-transition table §8.2 is exhaustive: 18 rows covering Ideation/Planning/Execution × {InProgress / PASS / REVISE / Aborted} + Skipped + task-record-written + user-review-gate transitions. No missing transitions found.

## Findings

**No findings above Low severity.**

Low / observational:
- §8.3 worked example renders Tasks 01 + 02 as collapsed single-line rows but the doc does not specify the literal format of the "Completed tasks" collapsed line — there's prose at L437-L438 saying "collapsed to one line each", but no spec-mode declaration. Likely fine; a future renderer implementer could ask. Confidence: 25. Severity: Low. Type: `checklist_gap`. Domain: `docs-sync`.
- §9 settings table uses key paths like `workflow.preparation.maxIterations` etc. without cross-linking to the settings schema doc. A reader needing to verify the key paths exist must grep elsewhere. Confidence: 25. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`.

## Must-preserve list

- Iter cap of 2 in §9 (the narrower-than-Auto signal that hitting cap = "reframe or split").
- Single R5 canonical statement at §4 with all other references as short-form pointers (do not duplicate the four-bullet skeleton elsewhere).
- The 18-row state-transition table density — collapsing rows would lose transition coverage.
- Term-lock occurrences at 22 — do not de-dupe for "DRY" reasons; the lock is the defense.

## Overall verdict

**PASS.** Reader-cost is acceptable, redundancy is structural and intentional, no padding for line-count. Specified procedure has bounded runtime cost. Density is proportional to the spec's scope.
