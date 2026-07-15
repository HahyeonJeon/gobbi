---
name: startup-session-shape-and-promotion
description: startup owns its own unnumbered session shape and self-promotes at startup-close; Wrap-up EXCLUDES startup/ from its promotion inventory.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-13
session: 0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [wrap-up, refactor]
keywords: [startup, session-shape, startup-close-promotion, wrap-up-exclusion, double-promotion]
author: claude
supersedes: interview-bootstrap-exception
superseded_by: null
---

# startup owns its own session shape and self-promotes; Wrap-up EXCLUDES startup/

## Context

The `interview` bootstrap skill is being replaced by the `startup` skill. The old
`interview-bootstrap-exception` decision established that `interview/` was a bootstrap
surface — not a workflow loop, not swept to the flat-4-slot + number-prefix shape — and
that `interview/staging/` remained a **valid Wrap-up promotion source** (interview wrote
to its `staging/` in mature reruns and deferred to Wrap-up to promote). `startup` changes
that promotion model, so the session-shape + promotion-ownership facts must be re-decided.

## Decision

1. **`startup/` owns its own unnumbered session shape.** It is NOT a workflow loop, carries
   no `{N}-` prefix, and is never smuggled into the fixed `1-ideation … 5-wrap-up` set. It
   uses a `startup/` dir with a `working/` + `staging/` + `outputs/` interior. The shape is
   owned by `startup/recording.md` § 3; the scaffold script rejects `startup/` as a
   `<step-dir>` exactly as it did `interview/`.
2. **`startup` self-promotes at startup-close.** Startup runs its own atomic startup-close
   promotion (`startup/recording.md` § 9) — validate-whole-set → safe-order write → verify →
   halt-on-failure, gated by an Always-Ask user-approval plus the standing memory guards. It
   writes its user-approved baseline directly to memory BEFORE any productive loop runs.
   Unlike interview, startup does NOT defer to Wrap-up in mature reruns — it always
   self-promotes.
3. **Wrap-up EXCLUDES `startup/` from its promotion inventory.** Because startup already
   promoted its approved set at startup-close, by the time any same-session Wrap-up runs
   `startup/staging/` is already durable. Enumerating it would re-promote (a
   double-promotion), so Wrap-up's promotion-inventory rule EXCLUDES the entire `startup/`
   tree — even though it holds a `staging/`.
4. **`startup`-close promotion is a second bounded pre-Wrap-up memory writer.** The Wrap-up
   sole-writer invariant is amended: startup-close promotion joins Preparation's
   `generate-now` skill promotion as one of two bounded exceptions to "Wrap-up is the sole
   writer to memory."

## Rationale

startup self-promotes because its user-approved baseline must be readable by the very first
productive loop (Ideation Sub-step A, Preparation) in the same session — an end-of-session
Wrap-up promotion would arrive too late. Excluding `startup/` from Wrap-up's inventory is the
matching half: a surface that promotes itself must NOT also be swept by Wrap-up, or every
startup record lands in memory twice. The exclusion is a NAMED exclusion (not "drop all
non-loop dirs"), so the Chat-mode per-slice `staging/` — a genuine non-loop promotion source
— is still enumerated. This models both traps: do not over-narrow (drop Chat-mode staging)
and do not over-broaden (re-include `startup/`).

## Alternatives considered

- **Keep the interview model (startup defers to Wrap-up).** Rejected: startup's approved
  baseline must be durable before the first productive loop reads memory; deferring to
  Wrap-up would leave the baseline unavailable during the session.
- **Let Wrap-up promote startup/ and skip startup-close promotion.** Rejected for the same
  reason, and it would put the user-confirmed answer-by-answer baseline through Wrap-up's
  dual-system gate, which has no productive-loop artifact to evaluate.
- **Drop all non-loop dirs from Wrap-up's inventory.** Rejected: that would also drop the
  Chat-mode per-slice `staging/`, losing legitimate promotions.

## Consequences

- `wrap-up/SKILL.md` and `record/record-map.md` both state the same rule: inventory
  `staging/` only, with `startup/` as a named exclusion (double-promotion guard). The two
  docs must stay in agreement.
- `memory/SKILL.md`, `record/SKILL.md`, and `gobbi/SKILL.md` name `startup`-close promotion
  as the bounded pre-Wrap-up exception in place of the interview bootstrap exception.
- The scaffold + record-map machinery still structurally rejects `startup/` as a
  `<step-dir>`; startup materializes its own `startup/` surface, out of scope for the
  loop-dir spec.
- The old `interview-bootstrap-exception` decision is superseded in place (`status:
  superseded` + `superseded_by:`); Wrap-up moves it to `archive/` on move-on-terminal.

## Related

- [[interview-bootstrap-exception]] — the superseded decision this replaces
