---
name: orchestration-skill-agent-review
description: 3-point Chat-mode dual-system review of the orchestration skill + agents (chat-mode, skill compaction, adversarial review); no implementation — 3 review docs produced.
type: notes
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [evaluation, process, docs-sync]
keywords: [orchestration, chat-mode, compaction, adversarial-review, agent-teams, review-only]
author: claude
features_touched: []
loops_completed: [ideation, wrap-up]
shipped: [blast-radius-map-from-named-files-not-exhaustive-grep, teammate-finalize-brief-crosses-with-in-progress-turn, clean-verdict-unreliable-without-edge-case-stress]
---

# Orchestration skill + agent review (3-point Chat-mode)

## What happened
A Chat-mode session ran a 3-point dual-system review of the orchestration skill and its agents. Each point paired an independent leader pass with a Codex pass; Point 3 added a `claude-code-guide` currency check. The session did NO implementation — the deliverables are three implementation-ready review docs plus one currency ground-truth report. Each point moved through its own Ideation loop; a future session executes the change-sets.

- **Point 1 — Chat-mode compact cycles + doc length.** Proposes compact caps (planning 1 / execution 3 / wrap-up 3) and a ~30% length cut of `chat-mode.md`. Decisions: a planning `REVISE` becomes a user gate; ADRs route to `decisions/`; and — the user's call — split `state.template.json` into `state.auto.json` + `state.chat.json`. Two correctness must-fixes: the compact-cycle counting convention and the settings→state propagation.
- **Point 2 — Orchestration skill compaction.** A full ~40% gate-preserving compaction. De-duplicates `workflow/{loop}.md` against each peer skill via an 8-point loop skeleton plus the in-tree "do not re-derive" pointer pattern. Catalogs ~12 fix-first correctness bugs. Rule B11: a FAIL escalates rather than auto-fixing.
- **Point 3 — Orchestration adversarial review.** Three change-sets: (a) a full scripts refactor (`lib/common.sh` + a record-map manifest + fixtures + a smoke test; fixes C-BUG-1 canonicalization fail-open + 2 agent-token bugs + bash-4 tier assumptions + retires the frozen baseline); (b) an `agent-teams.md` currency refresh (doc baseline v2.1.32 → v2.1.178+); (c) completeness gaps — no `workflow/configuration.md`, a Codex-runtime doc↔mistake contradiction that a runtime matrix resolves, and a scenario suite.

## What shipped
- **3 process mistakes promoted** (the verify-don't-assume family):
  - [[blast-radius-map-from-named-files-not-exhaustive-grep]] → `mistakes/refactor/`
  - [[teammate-finalize-brief-crosses-with-in-progress-turn]] → `mistakes/verification/`
  - [[clean-verdict-unreliable-without-edge-case-stress]] → `mistakes/verification/`
- **3 review docs + 1 currency report promoted to memory:**
  - [[point-01-chat-mode-cycles-and-length]] → `reviews/code-review/2026-07-06-point-01-chat-mode-cycles-and-length.md`
  - [[point-02-orchestration-skill-compaction]] → `reviews/code-review/2026-07-06-point-02-orchestration-skill-compaction.md`
  - [[point-03-orchestration-adversarial-review]] → `reviews/adversarial-review/2026-07-06-point-03-orchestration-adversarial-review.md`
  - [[agent-teams-currency]] → `reports/analytics/2026-07-06-agent-teams-currency.md` (Point 3 §3.2 ground truth)

## What got stuck
The 3 review docs' initially requested destination (`reviews/skill-agent-review/`) was not resolvable: `reviews` uses the kind axis (the area equals `review_kind`), so its area allowlist is the kind enum and `skill-agent-review` is not a member. This was escalated to the manager as a user-decision and resolved: the 3 reviews route by kind (`code-review` for points 1+2, `adversarial-review` for point 3), and the currency report (not a `reviews`-type doc) routes to `reports/analytics/`. All 4 promoted files pass `validate-frontmatter.sh`.

## What shifted
Point 1's `state.template.json` handling shifted mid-session from an MF-2 Config-overlay to the user's chosen split into `state.auto.json` + `state.chat.json`. This crossed with an in-progress teammate turn twice (captured as [[teammate-finalize-brief-crosses-with-in-progress-turn]]), forcing re-briefs and on-disk re-verification.

## Decisions to respect
- **No implementation this session** — the three points are reviews only; a future session executes the change-sets.
- **`state.template.json` splits into `state.auto.json` + `state.chat.json`** (Point 1, user-ratified).
- **Cross-point coordination for the future implementation session:**
  - Point 3's change-set E edits `workflow/{evaluation,record,production}.md`, which Point 2 ALSO compacts — sequence or fold these so one does not clobber the other.
  - Point 1's `maxIterations` "default 5" lines collide with Point 2's edits — land Point 1 first.
  - Do ONE combined dead-xref cleanup: Point 3's dead links + Point 2's 2 missing mistake files + the recurring `skills-mirror-symlinks-not-copies.md`.

## Next session
A future implementation session executes the three change-sets. Priority #1 is Point 3's **Codex runtime matrix** (resolves the runtime doc↔mistake contradiction). Respect the cross-point sequencing above (Point 1 before Point 2's colliding edits; fold Point 3 change-set E with Point 2's compaction of the same `workflow/*` docs).

## Related
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — process mistake promoted this session
- [[teammate-finalize-brief-crosses-with-in-progress-turn]] — process mistake promoted this session
- [[clean-verdict-unreliable-without-edge-case-stress]] — process mistake promoted this session
- [[point-01-chat-mode-cycles-and-length]] — review doc, `reviews/code-review/`
- [[point-02-orchestration-skill-compaction]] — review doc, `reviews/code-review/`
- [[point-03-orchestration-adversarial-review]] — review doc, `reviews/adversarial-review/`
- [[agent-teams-currency]] — currency report, `reports/analytics/`
