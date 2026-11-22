# Workflow Handoff

> **Output role:** Canonical ignored phase-completion and recovery checkpoint<br>
> **Phase:** {Phase 1 | Phase 2 | Phase 3}<br>
> **Status:** {Complete | Stopped}<br>
> **Recorded at:** {exact UTC timestamp}

## Identity

| Item | Value | Evidence |
|---|---|---|
| Full UUID | {full lowercase hyphenated UUID} | {configuration path and hash} |
| Work branch | {exact branch} | {direct Git observation} |
| Base branch and bound head | {exact branch, commit, and tree} | {configuration and direct Git observation} |
| Absolute worktree | {exact configured worktree} | {registration and containment observation} |
| Session root | {exact configured session root} | {containment and ignored-state observation} |
| Work head and tree | {full commit and tree IDs} | {direct Git observation} |

## Result

{State the completed phase result or exact stopped state in one short paragraph.}

## Evidence

| Claim | Direct evidence |
|---|---|
| Completed work | {accepted result locators, ordered member hashes, commits, or exact partial state} |
| Verification | {checks and material results} |
| Review | {each reviewer report path, the receipt and its verdict, dropped and follow-up items, and fix rounds, or None when the work item skipped REVIEW} |
| Decisions | {material decisions, rulings, and authority, or None} |
| Decision boundary | {Phase 1 user decisions; later frames have no design question; User Review is continue-only} |
| Findings | {dispositions and verification evidence for the corrected tree under Review Step 3.3, or None} |
| Preserved state | {unrelated work, retained objects, exclusions, and risks, or None} |

## Continuation

{For Complete, state the next phase or completed closure and whether the user's Continue is pending or recorded.
For Stopped, name the first unproved action, its blocker, and the first safe recovery command. Use the worktree
and session root in Identity.}

Keep Identity complete and link existing records for evidence. Use `Complete` when owners have verified the
phase claims and all required review points have passed, and `Stopped` for an incomplete or failed phase.
Recover in the recorded worktree and session directory from these results, consulting the named owner for
missing or conflicting evidence. The next phase starts on the user's recorded Continue for this phase.
