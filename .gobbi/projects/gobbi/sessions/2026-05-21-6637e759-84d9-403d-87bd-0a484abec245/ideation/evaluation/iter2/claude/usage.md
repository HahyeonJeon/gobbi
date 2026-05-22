# Ideation iter2 — Usage perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Usage consumer = Planning loop + Execution loop's executor + future-self reading at 2 weeks.

## Locked Frame (Stage 1) — iter2 inheritance + new gaps

**Inherited from iter1/claude/usage.md:**

- F-U-01 (High/75, open at iter1) — Executor cannot determine the verification gate for the bare-UUID "LAST" delete (same root as F-S-01).
- F-U-02 (Medium/75, open at iter1) — Stub README rule citation points at a rule doc that doesn't fit.

**Inherited scenario gaps:** S-USE-NEW-1 (executor can determine commit-vs-FS bullets in Stage E), S-USE-NEW-2 (planner reading Stage F can distinguish `-d` vs `-D`).

**New gaps surfaced at iter2:**

- **S-USE-NEW-3**: "Executor consuming Stage E.2 can run the SHA gate without re-asking the user; the gate's two conditions are mechanically checkable."

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Planner produces task list without re-asking user | YES | 15 locks + 2 iter2 round answers; no open questions per WORK exit checklist line 527 |
| Executor knows which file/module to change | YES | Every bullet names path + command |
| Maintainer at 3am understands what + why | YES | Top summary + 10-line deltas block + Framed Problem |
| Failure modes communicated | YES | S6 → E.2 SHA gate; S13 → Stage G post-merge cleanup; S14 → -mindepth 1 |
| Wrong mental model risk | YES | "bare-UUID" / "date-prefixed" / "sweep-branch commit" / "develop commit" terminology now disambiguates the squash-merge boundary |
| **F-U-01 remediation** | Stage E.2 gate concrete | YES — lines 290-297 |
| **F-U-02 remediation** | Inline stub template | YES — D4 lines 366-380 |
| **S-USE-NEW-3** SHA gate mechanically checkable | YES | Two commands stated: `git log --format=%H -1 <branch>` + `grep -F '<sha>' <path>` |

## Typed findings

### F-U-01 — Re-judged as `addressed`

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: High
- **Evidence**: iter2 lines 290-297 (Stage E.2 gate) replace iter1's ambiguous "after the workflow's writes are committed" with two concrete testable conditions:
  1. `git log --format=%H -1 <sweep-branch>` returns a SHA (commit exists in git).
  2. `grep -F '<sha>' .../session.json` returns ≥1 match (SHA written into session.json).
  
  iter2 line 295 explicitly invokes the `executor-rationalized-failing-verification-gate.md` discipline: "If either condition fails, NEEDS_CONTEXT — do NOT rationalize the gate." iter2 D9 (lines 412-424) restates this with the rationale.
- **Resolution**: the executor reading Stage E.2 can now determine the gate without asking the user. The "TERMINAL post-commit" framing eliminates the ambiguity over Wrap-up timing (D9 line 423 clarifies "After E.2, any further Wrap-up writes for THIS session go into the date-prefixed dir, not the bare-UUID dir").

### F-U-02 — Re-judged as `addressed`

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: iter2 D4 (lines 366-380) drops the prior-rule citation and provides an inline authoritative template:
  ```
  # <subdir-name>
  
  <one-line description of the subdir's pre-reset role>. See git tag `pre-reset-2026-05-21` for pre-reset content.
  ```
  iter2 Stage C bullet 4 (line 262) now cites D4's template directly: "Write a one-line stub `<subdir>/README.md` using the inline template from D4 (the artifact's `rules/stub-redirect-format.md` covers supersession stubs, not placeholder stubs; D4's template is the authoritative shape)." A deferred follow-up to extend `stub-redirect-format.md` with "Variant C — placeholder stub" is logged at iter2 line 514.
- **Resolution**: rule mis-citation removed; template promoted into the checklist; follow-up logged for the rule extension.

### F-U-03 — Stage E.2 SHA gate depends on session.json being writable from the sweep branch worktree (NEW)

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: The SHA gate requires the executor to write the sweep-commit SHA into `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json`. But that session.json is already staged in Stage E.1's `git add` (line 279). If the executor commits Stage D + Stage E.1's add together, the staged session.json is now "frozen" in the commit. Writing the SHA into the FS-side session.json after the commit creates a divergence between the committed copy (no SHA) and the FS copy (has SHA). Either (a) the executor runs a follow-on commit to capture the SHA, in which case the gate's SHA (the new HEAD) is again not yet in session.json, creating a chase-condition; or (b) the executor accepts the divergence as transient FS-only state. iter2 D9 (line 423) implicitly favors (b) but does not state it.
- **Why it matters**: A naïve executor may keep trying to commit-then-update, never converging. A careful executor reading Iron Law 11 + the mistake "executor-rationalized-failing-verification-gate" may correctly NEEDS_CONTEXT here. Either way, iter2 should make the convention explicit: the session.json SHA update is FS-only and intentionally diverges from the indexed copy until a follow-on Memorization/Wrap-up commit closes the gap.
- **Suggested direction**: append to D9 (or Stage E.2): "Writing the SHA into session.json is FS-only and intentionally not part of any commit. The divergence from the indexed copy is reconciled at Memorization/Wrap-up by a subsequent commit on the sweep branch."

### F-U-04 — Stage E.2 ownership clarity for the executor handing off (NEW)

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: iter2 D1 line 335 sequences E.2 between E.1 and F. Critical Invariant #4 (line 323) labels E.2 as "TERMINAL POST-COMMIT". A reader could interpret "terminal" as either "end of the Execution phase" or "end of the entire workflow including Wrap-up." iter2 line 423 favors the former. The Planning loop should encode E.2 explicitly so the executor owns it and doesn't defer to Wrap-up.
- **Why it matters**: minor — the executor's owner-of-E.2 question is unambiguous once D9 is read, but Planning shouldn't have to re-derive that.

## Low-confidence appendix

- (25) — Stage E.1 has 5 sub-bullets (deletes 52 dirs), one of which is the multi-line `find ... | xargs -0 rm -rf` (line 286). The explicit enumeration above (52 dirs = c676684d + 2 fixtures + 49 bare-UUIDs) plus the equivalent shell command is a good safety net.

## Must-preserve list

- iter2 D4 inline template (lines 366-380) — preserves the right level of specificity; promote to canonical.
- The S6 + E.2 + Critical Invariant #4 + D9 cluster — together they define the SHA gate; preserve their cross-references.
- iter2 line 295's invocation of `executor-rationalized-failing-verification-gate.md` discipline INSIDE the gate spec — best-in-class anti-rationalization design.
- Stage F's per-branch `-d` vs `-D` enumeration unchanged from iter1; preserved.

## Verdict

PASS — F-U-01 addressed (iter1 High/75 driver); F-U-02 addressed. New findings F-U-03/F-U-04 are Medium/50 and Low/50 respectively (below High≥50 threshold). No High≥50 open findings → PASS.
