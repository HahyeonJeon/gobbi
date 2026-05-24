---
perspective: usage
artifact: commit 79b8925 (Task 04 iter1)
loop: execution
iter: 1
verdict: PASS
evaluator: claude
evaluated-at: 2026-05-24
---

# Usage Perspective — Task 04 iter1

## Scope

Does an agent actually loading these skills end up better-equipped to perform the bootstrap and dispatch correctly? Does the wording make the next-action obvious?

## Findings

### F-USAGE-1 — Delegation note is operationally actionable

- **Type:** `general`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 100
- **Severity:** Low (positive)
- **Evidence:** delegation/SKILL.md:109 — the note tells the manager what to add to the delegation prompt ("delegation prompt must remind the subagent..."), AND it specifies both branches (worktreePath set vs null), AND it points to the canonical source. This matches the gobbi-mistake `codex-eval-session-write-path-nested-in-worktree.md` which roots the failure in "delegation prompt did not include an explicit, concrete reminder." The new paragraph directly closes that gap.
- **Why it matters (positive):** A manager loading delegation/SKILL.md before constructing a delegation prompt now has a numbered prompt-line to include. Reduces the chance of repeating the bac669ad session's Codex-write-to-worktree mistake.

### F-USAGE-2 — gobbi/SKILL.md cross-ref provides closure but not action

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** gobbi/SKILL.md:91 — informational ("for the full Configuration Step 1 row order, including row 5.5..."). It tells the reader **where to look** but does not change manager behavior at bootstrap. A fresh manager loading gobbi/SKILL.md still must load orchestration/SKILL.md and execute Step 1 row 5.5 — the orchestration skill is already explicitly required by Session Bootstrap Order step 1 ("Load core skills").
- **Why it matters:** Cross-refs in the front-door skill help orientation but they are not behavior-changing. The Plan accepted this with the "Add cross-reference" wording in the `what:` field, so this is by design. Noted as informational only.
- **No action needed:** The cross-ref is fit for purpose per the Plan contract.

### F-USAGE-3 — "Front door" framing in commit message vs actual location

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Commit message reads: "Keeps gobbi/SKILL.md as the front door; orchestration owns the detailed row-order procedure." The placement of the new line **inside section 4 (Ask the user one setup question)** does not strongly support this framing — see structure.md F-STRUCT-1. A reader who entered gobbi/SKILL.md looking for "where is the worktree created?" would scan H3 headings 1-6 and not find an obvious pointer; the cross-ref is buried mid-section.
- **Why it matters:** The "front-door" promise in the commit message is only partially fulfilled by the actual line placement. If the goal is wayfinding, an H3-anchored sub-note (e.g., a new `### 4a.` or a note inside `### 6. Enter the workflow`) would serve readers better.
- **Suggested direction:** Optional follow-up — discuss with user whether the cross-ref should be relocated for findability. Not blocking.

## Stage 1 Frame — Scenarios Checked

| Scenario | Result |
|---|---|
| Fresh manager loading gobbi/SKILL.md can find the cross-ref when looking for worktree creation | WEAK — buried under section 4 (mode question) |
| Manager loading delegation/SKILL.md before dispatching a session-writing subagent has actionable guidance | PASS — clear actionable rule |
| Cross-ref link slugs resolve to real sections | PASS (`#step-1--workflow-configuration` exists at line 86; `#memory-access-matrix` exists at line 17 of git/SKILL.md) |
| Reader can derive next action from the new text alone | delegation PASS; gobbi WEAK (informational only) |
| Subagent receiving a delegation prompt would correctly use `worktreePath` | PASS — note phrasing is explicit on both branches |

## Must-Preserve

- The explicit "use … when set; fall back to … when null" both-branches phrasing in delegation/SKILL.md:109. If a future revision drops the direct-mode branch, it would re-introduce the bug the qualifier was added to prevent.
- The cross-ref to `git/SKILL.md § Memory Access Matrix` — keep as the canonical anchor so the rule stays single-sourced.

## Verdict

**PASS** — one Low/100 (positive), two Low/50-75 informational findings. No blockers.
