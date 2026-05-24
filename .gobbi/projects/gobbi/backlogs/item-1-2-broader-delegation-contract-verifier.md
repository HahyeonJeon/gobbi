---
title: "Item 1-2 broader re-framing — delegation contract verifier"
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [process, delegation, gate-bypass, contract-verification, deferred]
disposition: open
---

# Item 1-2 broader re-framing — delegation contract verifier

## Context

During Sub-step A forcing-question 6 (re-framing check) for Item 1-2 (skill-loading discipline), the leader surfaced a broader re-framing: the skill-loading problem is one face of a larger pattern — agents repeatedly bypass declared verification gates because the gates are "ought" statements rather than enforced mechanisms. Iron Law 7's "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE" is structurally equivalent to "delegation prompts must list required skills" — both are gates that the agent must self-enforce.

A more ambitious framing: **introduce a "delegation contract verifier"** — a mechanical pre-dispatch check that validates not just Load Directives but ALL required gate citations (e.g., spec citations must be fresh-read; verification-claim sentences must cite a grep that ran in the current session).

## Why deferred

User locked the literal-ask scope in CP-1.2-β Option Recommended (matrix + Load-Directives validator). The broader contract verifier was deferred as a follow-up to keep this loop's scope manageable. Note: Item 1-2 itself (the literal-ask version) was further deferred at Sub-step D round 1 — see `item-1-2-skill-loading-discipline.md`. This broader re-framing is therefore deferred behind that deferral.

## When to pick up

- After Item 1-2 (literal-ask) ships and produces an empirical baseline for how a mechanical validator behaves at scale.
- If the gate-bypass pattern recurs in surface forms NOT covered by the load-directives matrix (e.g., a manager-side citation freshness failure that isn't a skill-load failure).
- As a graduation step from Item 1-2 — once the matrix + validator pattern is proven for skill loading, generalize to spec citations + verification claims.

## Suggested approach

1. Enumerate all "declared gates" across the principles + workflow skills:
   - Iron Law 7 (fresh verification evidence)
   - Iron Law 12 (What / Why / How explicit)
   - Iron Law 6 (specificity, not vagueness)
   - Delegation Load Directives (Item 1-2's narrow target)
   - Spec citation freshness (witnessed by `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck`)
2. For each, specify a mechanically-verifiable signature in the delegation prompt or in the agent's tool-call sequence.
3. Build a unified validator that runs at multiple lifecycle hooks (pre-dispatch + post-tool-use + pre-completion-claim).
4. May intersect with T3's PostToolUse hook and / or Item 2-1 (Auto-mode silence) — same architectural layer.

## Effort estimate

Large — multi-session campaign. Should not be picked up before Item 1-2 (literal-ask) ships.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A forcing-question 6 for Item 1-2 (re-framing check)
- Sub-step A CP-1.2-β (user locked literal-ask scope; broader deferred)
