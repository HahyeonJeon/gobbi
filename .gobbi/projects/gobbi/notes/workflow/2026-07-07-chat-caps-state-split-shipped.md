---
name: chat-caps-state-split-shipped
description: Point-1 Task 1.1 shipped — Chat compact caps + state-template split + MF-1/MF-2 fixes; Task 1.2 (length) follows.
type: notes
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf-p1
tags: [process, docs-sync]
keywords: [chat-mode, maxIterations, state-template, point-1, point-2]
author: claude
features_touched: [workflow]
steps_completed: [execution, wrap-up]
shipped: [pin-convention-sweep-derived-displays]
---

# Point 1 Task 1.1 — Chat compact caps + state-template split shipped

## What happened

This session implemented Point-1 **Task 1.1** from `reviews/code-review/2026-07-06-point-01-chat-mode-cycles-and-length.md` — the first of two ordered tasks the review split out (Task 1.1: caps + correctness fixes; Task 1.2: the length cut, deferred). Execution ran two dual-system evaluation rounds against the change; both surfaced real defects that were fixed before this note was written: a contradiction in the Planning-REVISE handling row, and a `iter`/`maxIterations` counting-convention ambiguity that survived into a normative state-transition table even after the primary rule was pinned (see `learnings/process/pin-convention-sweep-derived-displays.md`, shipped this session).

## What shipped

Commit `a1ab11b4` (full: `a1ab11b459eb53ecf78b54f220421560fcc92d23`) on this branch:

- **Chat compact caps** — `templates/settings.chat.json`: planning `maxIterations` 5→1, execution 5→3, wrap-up 5→3 (ideation stays 5, preparation stays 0/skip, `evaluate.mode` unchanged). Auto side (`settings.auto.json`, `auto-mode.md`, `state.auto.json`) untouched — all keep 5.
- **State-template split (MF-2 / the review's fork #3)** — `templates/state.template.json` replaced by `templates/state.auto.json` (all-5) + `templates/state.chat.json` (5/0/1/3/3), deployed across all four template surfaces (canonical + `.claude` per-file symlinks + `.agents`/`plugins/gobbi` copies). `record/scripts/init-record-map.sh` now stubs `state.$mode.json` so a fresh `state.json` is born mode-correct.
- **Parity guard** — `record/scripts/verify-record-map.sh` now asserts `state.{mode}.json` caps == `settings.{mode}.json` caps per productive loop; fail-closed on missing `jq`; stress-tested against injected drift.
- **MF-1** — `orchestration/SKILL.md`'s iteration rule now pins "`maxIterations` = max WORK passes", so `maxIterations: 1` means exactly one WORK pass (a shared rule; Auto reads it too, no behavior change there).
- **MF-2's Config-row-4 requirement** — Config stamps any customize-gate `maxIterations` override into `state.json` from resolved settings, documented at `SKILL.md` rows 4/4R.
- Doc consistency updates across `chat-mode.md` (~11 sites incl. the §5 per-loop rewrite and the §8.2 Planning-REVISE → user-gate reword) and `workflow/{evaluation,planning,execution,wrap-up,preparation,record}.md`.

## What got stuck

Nothing is stuck — Task 1.1 is fully shipped and verified. The two eval-round catches (Planning-REVISE contradiction; the §8.2 convention-ambiguity survivor) were both root-caused and fixed within this session, not deferred.

## What shifted

- **Task 1.2 (the review's ~30% chat-mode.md length cut) is explicitly the follow-up, not part of this session.** It must be authored against the **POST-1.1** `chat-mode.md` — Task 1.1 renumbered several of its anchors (the §5 rewrite, the §8.2 table edits), so a Task 1.2 session must re-read the file fresh rather than reuse the review's original line numbers. Task 1.2 also carries a locked requirement from the review: reclassify the §1 ADR/provenance history to a `decisions/` record — never delete it (per `memory/rules.md` §4.3).
- **The Point-1 → Point-2 dependency is now cleared.** Point 1's cap edits landed first, so Point 2's memory-compaction design (issue/design `#339`) can now be implemented without colliding with a stale "`maxIterations` default 5" assumption anywhere in the cap vocabulary.

## Decisions to respect

- Task 1.2 starts from the current (post-1.1) `chat-mode.md`, not the review's line numbers — re-verify anchors before editing.
- The §1 ADR history in `chat-mode.md` is reclassified to `decisions/` when Task 1.2 runs; it is never deleted.
- A cross-point item survives, undone: the **combined dead-xref cleanup** — the dangling `mistakes/skills-mirror-symlinks-not-copies.md` reference (cited in the review's out-of-scope follow-ups), the 2 other missing mistake files flagged during this Point-1 arc, and the Point-3 dead links — is still open. It was deliberately kept out of Task 1.1's scope and is not yet scheduled.
- Auto-mode caps and `state.auto.json` are untouched by design; do not fold Auto cap changes into a Chat-scoped task.

## Next session

Two independent next steps are both unblocked: (1) implement Task 1.2 (the chat-mode.md length condensation) against the post-1.1 file, per the review's K1-K7 cut list; (2) start the Point 2 compaction design/implementation now that the Point-1 → Point-2 cap-value dependency is cleared. The combined dead-xref cleanup (see Decisions to respect) remains an open, unscheduled follow-up either session could pick up opportunistically.

## Related

- [[point-01-chat-mode-cycles-and-length]] — the review this task implemented (Task 1.1 of 2)
- [[pin-convention-sweep-derived-displays]] — the learning promoted this session from the §8.2 eval catch
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — the enumeration mistake this session's eval catch is a recurrence-adjacent case of
