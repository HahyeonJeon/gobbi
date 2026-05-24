---
perspective: risk
artifact: commit 79b8925 (Task 04 iter1)
loop: execution
iter: 1
verdict: PASS
evaluator: claude
evaluated-at: 2026-05-24
---

# Risk Perspective — Task 04 iter1

## Scope

Edge cases, failure modes, hidden coupling. Specifically: does the cross-ref break if orchestration/SKILL.md row 5.5 anchor changes? Does the qualified rule one-liner in delegation/SKILL.md drift from git/SKILL.md?

## Findings

### F-RISK-1 — Cross-ref slug fragility (gobbi/SKILL.md:91 → orchestration/SKILL.md)

- **Type:** `assumption_risk`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** The cross-ref points to anchor `#step-1--workflow-configuration`. This slug is auto-derived from the H3 text `### Step 1 — Workflow Configuration`. If a future edit renames the H3 (e.g., to `### Step 1 — Configuration Loop`), the slug becomes `#step-1--configuration-loop` and the cross-ref silently becomes a dead link. The text body of the cross-ref (which talks about row 5.5) would still be readable, but the link itself stops resolving.
- **Why it matters:** Markdown anchors don't break the build (markdown is lenient). The reader hits a broken anchor and lands at the top of orchestration/SKILL.md, then must search. Silent decay.
- **Mitigation observed:** This same risk applies to other existing cross-refs in gobbi/SKILL.md (lines 84, 89 also reference `#step-1--workflow-configuration`). T04 did not introduce a NEW kind of risk; it added one more instance of an already-present coupling. The fix path is a docs-drift detector (out of scope for T04).
- **Suggested direction:** Out of scope for T04. Optional follow-up: lint-checker that grep-scans cross-ref slugs against actual H3 slugs in target files.

### F-RISK-2 — One-liner shadow restatement may drift from canonical rule

- **Type:** `assumption_risk`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** delegation/SKILL.md:109 contains a one-liner that restates the qualified rule from git/SKILL.md:33 ("use `session.json.git.worktreePath` as the absolute root when that field is set ... fall back to the main tree's absolute path when `worktreePath` is null"). If the canonical rule in git/SKILL.md is amended (e.g., a third mode is added, or the field name changes), this delegation/SKILL.md shadow may not be updated.
- **Why it matters:** Two-place storage of a rule is the classic spec-drift vector. Today's shadow is faithful (verified, see consistency.md F-CONS-2). The risk is over the time horizon of future edits.
- **Mitigation observed:** The shadow is preceded by an explicit `See [...git/SKILL.md § Memory Access Matrix...]` pointer, making the reader's "ground truth" clear. The shadow is short (~30 words of substantive rule), so the maintenance burden is small.
- **Suggested direction:** Accept as-is; the cross-ref pointer is the discipline that limits drift damage. Not blocking.

### F-RISK-3 — Direct mode behavioral coverage

- **Type:** `general`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 100
- **Severity:** Low (positive)
- **Evidence:** delegation/SKILL.md:109 explicitly names both modes (worktree-first via `worktreePath` set; direct mode via `worktreePath` null). The qualifier handles the edge case the Ideation T1-I-T1.i task was concerned about — i.e., a subagent receiving a delegation prompt in a direct-mode session would otherwise have no specific guidance and might still hardcode a worktree path.
- **Why it matters (positive):** Closes the direct-mode edge case the T01/T02 work introduced (the entire concept of `worktreePath: null` only exists because of direct mode). T04 propagates that mode-coverage into the delegation discipline.

### F-RISK-4 — Worktree-active session validates the qualifier in production

- **Type:** `general`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 100
- **Severity:** Low (positive)
- **Evidence:** This very session (`2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`) is running in a worktree at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/268-session-foundations-bundle-b/`. The session.json (if checked) would have `git.worktreePath` set to that path. The new delegation/SKILL.md:109 rule is being lived through in the very session that produced it — including this evaluator's own delegation prompt and write paths.

## Stage 1 Frame — Scenarios Checked

| Scenario | Result |
|---|---|
| Cross-ref anchor breakage on H3 rename | RISK acknowledged; identical risk pre-existed in gobbi/SKILL.md (no net new risk) |
| Spec drift between shadow rule and canonical rule | RISK low; cross-ref pointer mitigates |
| Edge case: direct-mode session (worktreePath null) handled by new note | PASS |
| Edge case: worktree-active session reads new note correctly | PASS (this very session) |
| New cross-ref introduces circular dependency | PASS — chain is gobbi → orchestration → git; no cycle |
| New rule conflicts with any other delegation/SKILL.md rule | PASS — no other write-path rules in delegation/SKILL.md before this commit |

## Must-Preserve

- The explicit both-branches phrasing (worktreePath-set vs worktreePath-null) — this is the defense against the direct-mode edge case T01 introduced.
- The cross-ref pointer to git/SKILL.md § Memory Access Matrix — this is the discipline that limits future drift damage.

## Verdict

**PASS** — two Low/75 assumption-risk findings (slug fragility + shadow restatement), both inherited risks rather than newly introduced. Two Low/100 positive findings on edge-case coverage. No High or Critical.
