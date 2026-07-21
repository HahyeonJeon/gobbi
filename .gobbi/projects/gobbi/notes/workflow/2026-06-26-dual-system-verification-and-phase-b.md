---
name: dual-system-verification-and-phase-b
description: Built the Claude-Codex dual-system verification frame and shipped all six Phase-B hardening candidates (C1-C6) plus the live F1 mirror fix in one session
type: notes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, evaluation, verification]
keywords: [dual-system, verification-frame, phase-b, C1-C6, F1, dogfood]
author: claude
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [dual-system-verification-frame, verification-frame-phase-b-shipped, manager-locked-decision-without-audit-trail-sync, iter-artifact-edited-in-place-destroys-snapshot, literal-grep-gate-false-fails-legitimate-usage, executor-edited-main-tree-not-worktree-copy, git-stash-in-worktree-recurred-despite-loaded, recorded-mistakes-recurred-recording-is-not-enforcement]
---

# Dual-system verification frame + Phase B shipped

## What happened

This ~4-hour session both VERIFIED and IMPROVED the Claude–Codex dual-system. Ideation built a
verification frame for the locked D1–D9 proposer model: a scenario set plus six per-dimension pass/fail
checklists (per-step value, integration quality, gap classification, cost, exec reliability,
independence). Ideation ran three iters (iter1 FAIL → iter2 Claude-PASS/Codex-REVISE → iter3 PASS) and
was itself produced dual (a blind Codex proposal selectively integrated; iter2/iter3 were Claude-only
remediation passes with evaluation kept dual). The user locked the D1 topology decision: keep Option A
(parallel-blind-integrate); defer the consult sub-mode; reject pure interactive-advisor. Phase B then
implemented every candidate the frame surfaced — C1–C6 plus the live F1 mirror defect — across eight
commits (`f51f8d27` … `7fea07ef`), with Execution dual-evaluated and remediated to PASS.

The session was a deliberate dogfood: the dual-system was used to build the very frame that verifies
it. Production sharpened the artifact at Ideation and Planning; the dual EVALUATION caught real defects
the producer missed, including the manager's OWN audit-trail gap.

## What shipped

- `features/workflow/design/workflow/dual-system-verification-frame.md` — the canonical frame.
- `features/workflow/changelogs/workflow/2026-06-26-verification-frame-phase-b-shipped.md` — C1–C6 + F1.
- 3 feature decisions (`features/workflow/decisions/{codex,evaluation,workflow}/`) — the C1/C5/C6 choices.
- 1 scenario + 1 checklist under `features/workflow/{scenarios,checklists}/process/` — the iter-snapshot
  freeze discipline and the literal-grep-gate brittleness rule.
- 7 learnings (`learnings/{evaluation,codex,process}/`) — dual-eval value, dual-production value,
  remediation-iter single-mode, cross-system divergence, codex-exec operational facts.
- 6 project mistakes (`mistakes/{verification,git,assumption}/`) — see Decisions to respect.
- 2 Layer-2 promotions (`skills/mistake/`) — literal-grep-gate brittleness + recording-is-not-enforcement.
- 8 code commits on branch `claude-2026-06-26-babc6f3b-e845-4ed3-9625-c14ea9237fd8` (NOT yet a PR — git
  is the manager's stage 5).

## What got stuck

Nothing blocked. Two friction points worth noting: the Execution Codex eval at xhigh over the
multi-file change-set over-ran (15k+ output lines, ~17 min, wrapper checkpointed) — budget timeouts
≥1500s for this shape. And two ALREADY-recorded mistakes (main-tree write, git-stash-in-worktree) both
recurred this session despite being loadable — the trigger for the "recording is not enforcement"
meta-mistake.

## What shifted

The C6 Execution telemetry shape shifted from aggregate-only to per-task during Execution eval, because
the Codex evaluator caught the per-task schema drift from the locked plan (one of two divergence-caught
defects). The C4 validator shifted to escape-aware parsing after it false-failed the project's own real
logs (it had passed only synthetic fixtures).

## Decisions to respect

- **D1 topology is LOCKED to Option A** (parallel-blind-integrate). The consult sub-mode (Option C) is
  DEFERRED, evidence-gated — re-open only on the (i)–(iv) flip-evidence in the frame. Do not re-litigate.
- **C5 is doc/process, not a script** — the independence gate is a manual classification (D6.2), because
  a literal grep is wrong on both sides. See `features/workflow/decisions/evaluation/2026-06-26-independence-gate-doc-not-script.md`.
- **A loaded mistake is not an enforced gate** — `mistakes/assumption/recorded-mistakes-recurred-recording-is-not-enforcement.md`.
  Delegation briefs must INLINE the exact forbidden command + a pre-action assertion, not just "load the mistake".
- **Verification gates check structure/semantics, not body-wide substrings** —
  `mistakes/verification/literal-grep-gate-false-fails-legitimate-usage.md`.

## Next session

Git stage 5 is pending (manager-owned): commit the promotion writes + the 8 Phase-B commits, push, open
the PR. Next session must VERIFY the C2 mirror-consistency standing guard and the C4 Integration-Log
validator actually run green in Wrap-up's standing-guard suite on a fresh session — they were added this
session but their first real cross-session exercise is next time. Also: improve the mistake-cue
mechanism (turn recorded mistakes into inlined delegation-brief assertions) so the two recurrences this
session do not repeat.

## Related

- [[dual-system-verification-frame]] — the frame this session built
- [[2026-06-26-verification-frame-phase-b-shipped]] — what shipped
- [[recorded-mistakes-recurred-recording-is-not-enforcement]] — the session's sharpest process lesson
