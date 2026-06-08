---
name: session-memory-redesign-m-g
description: Session-memory lifecycle redesign — Clusters M (metadata telemetry) + G (gitignore + finalized notes record) shipped; S/R/D1 deferred
type: notes
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [session-memory, metadata, hooks, gitignore, telemetry, project-memory]
features_touched: [project-memory]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [weak-verify-gate-nonzero-passes-wrong-source, verify-paths-bare-hooks-dir-nonexistent, session-memory-lifecycle, 2026-06-08-session-memory-lifecycle-redesign, implement-session-memory-clusters-s-r-d1]
---

# Session-memory lifecycle redesign — Clusters M + G

## What happened

This session redesigned gobbi's session-memory subsystem. The framed problem: `sessions/` was
tracked in git (polluting commits with scratch), token telemetry (`tokensUsed`) was unreliable
because the manager summed final-turn usage rather than cumulative own-transcript usage, and
there was no finalized per-session record promoted into durable memory.

Ideation locked 8 decisions (D1–D8): `sessions/` becomes fully ephemeral (D1, retiring the
`git-workflow` D-4 per-iteration commit cadence); deterministic hook-driven metadata recording
replaces manager discipline (D5 — PostToolUse for subagent tokens, SessionEnd for the manager
rollup); the session staging tier flattens (D3); the durable record is promoted to a finalized
`notes/{date}-{slug}-{ssid}/` shape at Wrap-up. Planning decomposed a 17-task plan; the session
scoped in **Clusters M (metadata telemetry) + G (gitignore + finalized record)** = 10 tasks,
and deferred Clusters S (staging flatten), R (notes record + generator script), and D1's
remaining git-workflow cluster work.

Execution implemented the 10 tasks across two hooks (`post-tool-use-agents.sh`,
`session-end.sh`) + the reconciler (`reconcile-session-metadata.sh`) + the orchestration doc
amendments + the `sessions/` gitignore migration. The dual-system Execution evaluation
(Claude + Codex) PASSed after one REVISE round — see below.

## What shipped

11 commits on the worktree branch (`claude-2026-06-08-c7673705`):
`b210a40`, `6cedca9`, `4e80e1b`, `35bd3e2e`, `d29b9a44`, `be2afde`, `41ddc77`, `5be417e`,
`f2fdd6c4` (the 9 Cluster M+G implementation commits), plus the REVISE remediation pair
`8e4c759` (SessionEnd preserves + populates `usage.codex`) and `bb104d9f` (grandTotal-formula
doc fix). Concretely shipped: deterministic PostToolUse subagent-token seeding (cumulative
own-transcript sum, never seeds `toolu_` ids), SessionEnd manager rollup + codex capture +
reconcile, `sessions/` gitignored + untracked (`git rm -r --cached`, files left on disk), and
the orchestration § Workflow Metadata rewritten to the hook-driven Authority rule (SessionEnd
authoritative; PostToolUse best-effort seed).

Project-memory promotions this Wrap-up: 24 feature-scoped files into
`features/project-memory/` (1 design, 3 discussions, 3 references, 5 checklists, 7 decisions,
2 scenarios, 1 plan, 2 feature backlogs); 2 new project mistakes
(`weak-verify-gate-nonzero-passes-wrong-source`, `verify-paths-bare-hooks-dir-nonexistent`);
2 amended project mistakes (`executor-mirror-path-vs-worktree-physical-copy` strengthened with
the 4-executor recurrence; `cotouch-enumeration-must-cover-semantic-equivalents` extended with
the D1 cross-feature-pointer vector); 5 project backlogs (the Execution-eval follow-ups).

## What got stuck

The Codex evaluator caught a **Critical** bug the Claude evaluator missed: SessionEnd's
reconcile **erased `usage.codex.total` to 0** on every run that supplied no codex source
(fixture-proven, confidence 100). This was a genuine data-loss defect, not a doc nit — it
forced the REVISE round. The fix (`8e4c759`): the reconciler now tracks `codex_supplied` and
overwrites `usage.codex.total` ONLY when a codex source is provided, otherwise preserves the
existing value; SessionEnd grew a `capture_codex_total()` that scans `~/.codex/sessions/`
rollouts matched by cwd+mtime and passes a precomputed `--codex-total`. This is the headline
"dual-system eval earns its keep" moment of the session — single-system eval would have shipped
the erasure.

## What shifted

The write surface bit four separate executors: each, on first attempt, edited the **main-tree**
canonical copy of a hook/script instead of the **worktree** copy — even with an absolute path —
because the `.claude/` symlink mirror plus the worktree's own branch-isolated `.gobbi/.../` copy
combine to mislead. Each was caught by `git -C <worktree> status` showing the file unstaged in
the worktree. This is the highest-frequency write-safety failure on record; it is now folded
into `executor-mirror-path-vs-worktree-physical-copy` and flagged as a Layer-2 candidate.

Scope held firm: S/R/D1 were deferred deliberately (one coherent backlog,
`implement-session-memory-clusters-s-r-d1`), not dropped.

## Decisions to respect

- The 8 D-decisions (D1–D8) are locked — see `features/project-memory/decisions/2026-06-08-*`
  and `features/project-memory/design/session-memory-lifecycle.md`.
- **Authority rule:** SessionEnd is the authoritative telemetry writer; PostToolUse is a
  best-effort seed. Do not weaken to "either writer is final".
- **Never seed `toolu_` ids; bail when agentId unresolvable** (post-tool-use-agents.sh).
- Transcript copy lives in MEMORIZATION, NOT in the hooks — this protects the 500ms latency
  gate (latency-optimize choice).
- `usage.codex.total` is preserve-on-empty; codex correlation is cwd+mtime (known limitation,
  backlogged for a session_id stamp).
- `sessions/` is fully ephemeral; D-4 per-iteration commit cadence is retired.

## Next session

Pick up `backlogs/` follow-ups: the coupled resolver edges
(`resolver-maxdepth-misses-worktree-session-json` + `resolver-disambiguation-heuristic-bail`),
`reconcile-null-key-strip-reshapes-schema`, and `codex-rollout-session-id-correlation`. Then
implement the deferred Clusters S/R/D1 (`features/project-memory/backlogs/implement-session-memory-clusters-s-r-d1.md`).
