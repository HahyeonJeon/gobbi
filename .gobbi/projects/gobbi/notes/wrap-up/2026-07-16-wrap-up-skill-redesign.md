---
name: wrap-up-skill-redesign
description: "Full dual-system /gobbi redesigned the wrap-up skill to the skill-writing standard: 604-line SKILL.md monolith → 171L six-section SOP + promotion.md (463L) + compaction.md (271L) + hardened triad; 4-iter Ideation, 7-task Execution, Codex caught 4 REVISE-loop-semantics bugs Claude missed at Execution eval. PR to develop."
type: notes
scope: project
feature: null
status: active
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [wrap-up, evaluation, process]
keywords: [wrap-up-redesign, skill-writing-standard, six-section-sop, promotion-md, compaction-md, dual-system, e1-e5-e6-e10, promotion-stage-rename, always-count-hard-cap, session-usage-limit]
author: claude
---

# Wrap-up skill redesign (2026-07-16)

Full dual-system `/gobbi` (Auto). Redesigned `skills/wrap-up/` to the `skill-writing` standard + fixed genuinely-wrong behaviors. **Branch `claude-2026-07-16-e5c0af1d-...`; 8 commits; PR → develop.**

## What shipped
- `SKILL.md` **604 → 171L** six-section SOP (Intro/Principles/Rules/Procedure/References). Depth moved to two children:
  - `promotion.md` (463L) — the routing table (anchor `#staging--memory-routing`), area-resolution, strip-allowlist, collision policy, archive routing, compliance-scan, post-promotion green-check.
  - `compaction.md` (271L) — Stage-2c always-count + hard-cap gate.
- Hardened eval triad: `scenario.md` (39 scenarios) + `checklist.md` (39, 1:1 mirror) + `evaluation.md`; `mistakes.md` (6 traps).
- 5 concept-principles replacing ~12 blockquotes; the disguised rules → § Rules.

## Behavior fixes (user chose "fix where wrong")
- **E1**: Step-2.5 treats prior staging as IMMUTABLE — mechanical normalization via a correction overlay, applied only to the promoted destination.
- **E5**: idempotency keyed on `{session-id, source-relative-path}` + the frozen manifest (finding-id demoted to staging-time hint — it's stripped on promotion, so it couldn't key collisions).
- **E6**: complete manifest + destination preimages validated before the first write.
- **E10**: Stage-3 checks only "no premature finalization + valid plan"; Stage-5 verifies its own git outcomes.
- **Rename**: the stage-2 sub-phase NAME renamed to "Promotion" (3-meaning disambiguation — only that stage-2 name renamed; the historical D18 references + the agent-lifecycle verb are PRESERVED; the guard `check-residual-vocab.sh` allowlist de-obsoleted).
- **Compaction**: `enabled` gates auto-merge only; always count post-promotion; over-hardCap → Always-Ask (verified evidence: `mistakes/verification/` had 44 live files vs hardCap 15).
- **Deferred (backlog)**: E7 (non-staging promotion → typed staging), E8 (prep-skill fallback→escalate), E9 (audit-only scratch model), E11 (handoff pointer model). See `backlogs/wrap-up/`.

## Process (this session)
- **Ideation: 4 iters + 4 dual-system eval rounds.** Codex found NON-overlapping High findings every round (form-conformance, research-traceability, claim-owner ledger, missed anchor links, then narrow completeness) — the design converged only after root-fixing "grep-derive all co-touch sets + anchor-existence spot-check (link guard is anchor-blind)".
- **Execution: 7 tasks, full dual-system production per task.** T1 promotion.md → T2 compaction.md → T3 SKILL.md → T4 triad → T6 config → T5 consumer-sweep (25 files) → T7 mirrors+guards. Pipelined the Codex proposers ahead of the executors.
- **Execution eval: REVISE.** Design-fidelity PASS + all guards green, but Codex caught **4 High findings Claude judged minor** — all one theme: the REVISE→Stage-1 loop semantics were stated inconsistently (SKILL.md contradicted itself: :82 Stage 1 vs :119 Stage 2), and the baseline-snapshot / handoff-path / memory-owner details inherited it; plus the E7-contradicting "Wrap-Up Additions" trap displaced the mandated `baseline-immutable-across-REVISE` trap. All 4 fixed (commit e649683d).

## Headlines / durable lessons
- **Dual-system caught real bugs Claude missed at EVERY gate** — most starkly at Execution eval (4 High semantic bugs Claude called "minor"). See `learnings/`.
- The **Claude session usage limit** was hit mid Execution-eval (killed the Claude evaluator) → finished the REVISE fixes via a Codex executor + manager verification (user chose "fix now, Codex+manager").
- Guard-invocation scope matters — see `backlogs/tooling/`.

## Pointers
- Design: `sessions/2026-07-16-e5c0af1d-.../1-ideation/outputs/ideation-output.md` (625L, 4-iter locked).
- Plan: `sessions/.../3-planning/working/plan-iter1.md` (7 tasks).
- Commits: 1e96fe4e c8fd767f 0d1b3c3f e869ed5d 47b497a6 c6d1fdd4 43591a56 e649683d.
