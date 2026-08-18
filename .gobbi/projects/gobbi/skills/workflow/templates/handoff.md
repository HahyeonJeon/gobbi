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
| Evaluation | {report, gate, receipt, verdict, and iteration evidence} |
| Decisions | {material decisions and authority, or None} |
| Decision boundary | {Phase 1 user decisions; later frames have no design question; User Review is continue-only} |
| Findings | {dispositions and fresh-evaluation evidence, or None} |
| Preserved state | {unrelated work, retained objects, exclusions, and risks, or None} |

## Continuation

| Item | Value |
|---|---|
| Next TODO | {`P1 · User Review`, `P2 · User Review`, or `P3 · User Review` on Complete; None on Stopped} |
| First unproved action | {exact action, or None} |
| Recovery worktree | {same Absolute worktree recorded above} |
| Recovery session root | {same Session root recorded above} |
| First safe command | {exact command, or None} |
| Recovery limits | {exact blocker or ambiguity, or None} |

Keep every section and fixed table row. Use `Complete` only when every phase claim is directly verified; use
`Stopped` for an incomplete or failed phase. On Complete, `Next TODO` is the matching User Review title, not
the next phase, and this file does not activate the next phase. Never recover into a different worktree or
session directory, and never treat this handoff as proof without rereading its named evidence.
