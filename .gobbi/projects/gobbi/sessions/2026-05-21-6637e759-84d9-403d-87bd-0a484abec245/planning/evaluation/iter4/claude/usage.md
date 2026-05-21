# Claude Planning Evaluation iter4 — Usage Perspective

## Stage 0 Artifact Summary

Usage lens = what happens when the next-session executor + manager consume `main.md` as the operational handoff. iter4 closed the docs-sync drift that pointed readers to the superseded `draft-iter2.md`.

## Stage 1 Locked Frame

Usage scenarios:
- U1: A reader following main.md:126 ("See `draft-iter3.md` § 'Manager pre/post-Execution operations'") lands on the iter3-correct command sequence.
- U2: A reader following main.md:154 (Cross-references) lands on a rawdata file containing the full task YAML + self-review + Decisions Log.
- U3: A reader scanning main.md:141 §5a sees the precheck-NEEDS_CONTEXT-no-force guard without needing to chase a pointer.
- U4: A reader scanning main.md:55 for user-locked decisions sees all 10 D-PLAN locks (01, 03, 04, 06, 07, 08, 09, 10, 11, 12).
- U5: No remaining operational pointer in main.md routes the reader to `draft-iter2.md` (the superseded artifact).

## Stage 2 Findings

### Scenario walk

- **U1**: PASS. Line 126 reads "See `draft-iter3.md` § 'Manager pre/post-Execution operations' for the full command sequence." `draft-iter3.md` contains the iter3-corrected §5a precheck at lines 344-358.
- **U2**: PASS-with-low-residual. Line 154 points at `draft-iter3.md` which contains the canonical task YAML + self-review. D-PLAN-12 (added in iter4) is reachable via line 55's `draft-iter4.md` pointer. A reader who only reads line 154 would not see D-PLAN-12, but line 55 (3 lines earlier in the Scope Contract section) gets them there. See F-IT4-CL-U-01 below.
- **U3**: PASS. Line 141 inlines the precheck + NEEDS_CONTEXT + no-force guard. Reader does not need to chase a pointer to know the manager-action shape.
- **U4**: PASS. Line 55 enumerates all 10 D-PLAN locks.
- **U5**: PASS. `grep -nE "draft-iter2\.md" main.md` returns zero matches. Verified empirically.

### Usage-perspective findings

#### F-IT4-CL-U-01 — Line 154 Cross-references pointer is iter3-canonical, but D-PLAN-12 lives only in iter4 rawdata

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Confidence**: `100`
- **Severity**: `Low`
- **Evidence**: `main.md:154` reads "Rawdata draft with full task YAML + self-review report + Decisions Log: `sessions/.../planning/rawdata/draft-iter3.md`". The complete Decisions Log including D-PLAN-12 (the manager-bookkeeping carve-out) lives in `draft-iter4.md`, not `draft-iter3.md`. The iter4 brief explicitly enumerated Edit 2 at this line as iter2→iter3 (not iter4); the manager-bookkeeping addendum at line 55 chose iter4. Split convention.
- **Why it matters**: A reader who consults Cross-references (line 154) gets iter3-canonical rawdata and would miss the D-PLAN-12 carve-out justification. They would only see it if they cross-reference line 55's lock enumeration. Both pointers are reachable; the inconsistency is the issue, not unreachability. The D-PLAN-12 addendum (`draft-iter4.md:765`) records iter4 as "byte-identical to iter3 except for D-PLAN-12", so the practical impact is bounded.
- **Suggested direction**: Two future options — (a) update line 154 to also say `draft-iter4.md`; (b) keep iter3 (canonical task content) and add a parenthetical "(iter4 adds D-PLAN-12 only)". Both out-of-scope for iter4 under the brief discipline (iter4 is the LAST iter under the override).

## Stage 2 Step 3 — Iter3 disposition

| iter3 finding | Disposition | Verification |
|---|---|---|
| F-CX-PLAN-O3-O-01 | **addressed** | Lines 126/141/154 all corrected (Usage scenarios U1, U3 PASS; U2 PASS with low residual). |
| F-CX-PLAN-O3-O-02 | **deferred** | Codex flagged as "only clean if another revision happening" and iter4 chose not to. |

## Verdict

**PASS.** One Low/100 split-convention finding inherent to iter4's enumerated-edit discipline.

## Must-Preserve List

- Zero `draft-iter2.md` operational pointers in main.md.
- Line 141 inline §5a precheck wording (executor / manager can read main.md alone without chasing pointers).
- Line 55 lock enumeration includes -12.
