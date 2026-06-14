---
name: dual-runtime-git-skill
description: Made the gobbi git skill dual-runtime (Claude Code + Codex) — research, dual-system REVISE on codex prior-art, 7-task plan, Execution with 2 remediation rounds to dual PASS
type: notes
scope: project
feature: null
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, dual-runtime, codex, claude-code, probe, sandbox]
features_touched: [git-workflow]
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [features/git-workflow/plans/2026-06-14-dual-runtime-git-skill.md, features/git-workflow/changelogs/2026-06-14-dual-runtime-git-skill-shipped.md, mistakes/grep-absence-claim-needs-exact-pattern.md, mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md]
---

# Dual-runtime git skill (Claude Code + Codex)

## What happened

The session made the gobbi git skill correctly cover git/GitHub operations across BOTH agent
runtimes. The starting problem: the git skill was single-runtime-in-disguise — a Claude-Code
document with Codex present only as a branch-name prefix, and zero coverage of Codex sandbox /
approval / network constraints.

**Ideation.** The user locked two scope decisions up front: Codex is first-class (equal coverage,
no Codex-lite shortcut), and scope = git skill docs + git-related runtime wiring (`.codex/`, agent
prompts, hooks additively) + new helper scripts if research justified them. Research ran equally on
both runtimes and confirmed the gap: 11 MISSING / 4 PARTIAL / 1 INCORRECT dual-runtime items. The
single biggest gap: on default Codex (`workspace-write` + `on-request`), network is OFF, so
`git push` / `gh` are blocked until the user enables `network_access` or approves an escalation.

The Ideation iter1 artifact hit a **dual-system REVISE**. Both Claude and Codex evaluators
independently flagged the same root: the draft asserted "grep confirms zero hits for sandbox terms
across `skills/`" without engaging `skills/codex/SKILL.md` — which already owns the Codex sandbox
vocabulary (`sandbox_mode`, `workspace-write`, `danger-full-access`) and even cross-references the
git skill via a dangling link at `:254`. The gap was the git skill's, not the skill tree's. The
leader applied R1–R5 in iter2 (engage + align with codex/SKILL.md; narrow the probe to per-field
reliability; add an ask-only remediation guard; correct the false leader.md/manager.md claims; fix
line-counts + feature-memory readiness), the manager spot-verified, and — by user decision — there
was no second full dual-system eval (corrections, not new design).

**Planning.** The 7-task plan decomposed the work bottom-up: T01 Runtime git environment section →
T02 posture probe script → T03 wire probe + five-trigger deferral + remediation menu → T04
sandbox-boundary split + merge-conflict handling + runtime-tagged failure modes → T05 Worktree CWD
discipline section → T06 codex/SKILL.md:254 repoint → T07 runtime wiring in conventions + agent
prompts + Codex config/agents. T01/T03/T04/T05 share the single `git/SKILL.md` lane and run strictly
sequential; T05→T06 is target-before-link ordered. The OQ-1/OQ-5/OQ-7 open questions were resolved
at Planning (one dedicated section not inline tags; behavioral read-only detection + re-launch/plan-
only policy; "runtime git posture" concept vs "git posture probe" script). DD-6 hooks were NOT
scheduled — deferred to backlog pending user confirmation.

**Execution.** All seven tasks landed across 9 commits (`9d522168..ab25dce0`). Two remediation
rounds against dual-system Execution evaluators:
- Round 1 (F1–F4): F1 false "codex/SKILL.md is canonical owner / do not re-derive" claim → reframed
  git skill as the honest home of the git-relevant model; F2 docs claimed the probe detects
  read-only → made read-only detection behavioral (blocked `git worktree add` / first `git commit`),
  probe honestly reports `sandbox_mode: unknown`; F3 probe checked Claude before Codex → check
  `CODEX_THREAD_ID` first; F4 approval-policy enumeration softened from a false closed set.
- Round 2 (CONSISTENCY-1): P1 still said the probe could show `approval-not-granted` → attributed
  approval denial to its behavioral source, not the probe field.

Both Execution iter2 evaluators returned **PASS** with no Critical/High open.

## What shipped

- `features/git-workflow/` bootstrapped (new value-feature dir + README).
- Memory promotions: 9 references + 7 design + 3 decisions + 2 discussions + 1 scenario + 1
  checklist + 1 plan + 1 feature-backlog + 1 synthesized changelog.
- 2 project-scope process mistakes: `mistakes/grep-absence-claim-needs-exact-pattern.md`,
  `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md`.
- The skill/config/agent code itself (9 commits) is committed on the session branch — the manager
  pushes + opens the PR at stage 5.

## What got stuck

Nothing blocked. Two residual non-blocking items carried to backlog/handoff: DD-6 git-lifecycle
hook telemetry (deferred at Planning) and an OQ-5 read-only-policy nuance that landed as behavioral
detection rather than a probe field.

## What shifted

- The "git-metadata hooks" premise in the initial brief was a misdiagnosis (INT-4): the two hooks
  are pure token reconcilers, and `session-end.sh:49-51` deliberately skips native Codex. Hooks
  stayed in scope only as an *additive* opportunity, never a re-point of existing logic — then were
  deferred at Planning.
- The probe scope narrowed from "reports sandbox/network/approval" to per-field reliability: network
  is reliably detectable; sandbox-mode + approval-policy are best-effort and report `unknown`.
- Codex moved from "branch-name prefix" framing to a first-class equal runtime throughout the skill.

## Decisions to respect

- **Codex is first-class.** Equal coverage with Claude Code; no Codex-lite shortcut. (discussions/2026-06-14-codex-first-class-scope)
- **Safe-by-default; no network by default.** gobbi ships no `network_access = true`; every
  sandbox/network remediation is an Always-Ask user decision the manager OFFERS but never
  auto-applies. `.codex/config.toml` at HEAD is comment-only. (design/five-trigger-pr-deferred-remediation-menu, checklists/remediation-must-be-ask-only)
- **Probe honesty:** `unknown` ≠ enabled; network reported disabled only on a reliable signal;
  read-only Codex is detected behaviorally, not via a probe field. (design/runtime-posture-probe-script, decisions/probe-data-source-reliability)
- **git/SKILL.md is the honest home of the git-relevant runtime model;** codex/SKILL.md is the
  Codex execution/entry-point alignment source — cross-reference, do not duplicate. (decisions/codex-skill-prior-art-not-engaged)
- **Manager/subagent split maps onto the sandbox boundary:** subagents commit (in-boundary);
  manager pushes/PRs (out-of-boundary). (design/commit-push-split-sandbox-boundary)
- OQ-1 (one dedicated section, not inline tags), OQ-5 (read-only → re-launch/plan-only), OQ-7
  (naming) are locked — do not reopen without cause.

## Next session

Manager pushes the 9 commits + the memory promotions and opens the PR against `develop` (stage 5).
Pick up candidates: the DD-6 git-lifecycle hook telemetry backlog
(`features/git-workflow/backlogs/git-lifecycle-telemetry-in-hooks.md`) if the user wants it, under
its own field-list spec + verification + dual-system eval.
