---
name: plugin-plan-decomposition-and-ordering
description: Planning-loop decomposition decisions for the gobbi plugin build — why 8 tasks, why sync-script+materialize is one task, why the cache gate has no standalone task (but is explicitly task-verified), why the claude-plugin skill is near-last + ships in the package, why the permissions edit is conditional, and why T5/T6 are operator-assisted.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, planning, decomposition, task-ordering]
decision_status: ratified
mistake-candidate: false
supersedes: null
superseded_by: null
related:
  - planning/staging/plans/gobbi-claude-code-plugin-build.md
  - planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md
---

# Plugin plan — decomposition + ordering decisions

Leader-level Planning decisions (no USER CHALLENGE; no new user-ownable choices arose — every design decision was ratified at Ideation/Preparation, except the iter-2 manager-directed auto-decision D-8). iter-2 entries reflect the dual-system eval remediation (Claude PASS / Codex REVISE, both converged on the same gaps).

- **D-2 — sync-script + materialization = ONE task (T1).** The `scripts/sync-plugin-package.sh` IS the materialization mechanism; its output is the `plugins/gobbi/{skills,agents,hooks}/` real-copy trees. Splitting "write script" from "produce trees" would split one category and one commit. The drift-resync decision left mechanism to Execution; T1 honors that (build-vs-CI-vs-tracked is the executor's call within T1).
- **D-3 — the post-install cache-contents allow-set gate has no standalone task, but IS now explicitly task-verified (iter-2).** It has no independent deliverable file, but the R1 guard is asserted with executable clauses in both halves: T1's `--check` allow-set membership clause (f) enforces that `plugins/gobbi/` top level is EXACTLY `{.claude-plugin, skills, agents, hooks}` pre-install (AUTONOMOUS, source-package); the T5 install step asserts the installed cache top level equals the same allow-set (OPERATOR-RUN). Folding it avoids a no-deliverable task while keeping the R1 guard explicit and the autonomous half install-independent. (iter-2 remediation of RK-1 / COD-PROJ-001 / COD-OVERALL-001.)
- **D-4 — `claude-plugin` skill (T7) placed after the runtime checks (T5/T6).** Its gobbi section must document the empirically-resolved hook double-fire behavior (T5) and the auto-grant finding (T6). Authoring it earlier would commit unverified premises to a durable skill (Principle 7).
- **D-5 — T6 permissions edit is CONDITIONAL (operator-confirmed).** DD-9 ratified: add `Skill(codex)` + `Skill(gobbi-hook-authoring)` to `.claude/settings.json` ONLY IF the operator-run invocability check proves auto-grant FALSE; if TRUE, settings.json is left unchanged.
- **D-7 — DD-7 install-test is exercised inside T5 (not a standalone task), as the OPERATOR-RUN portion.** The git-ref-source + worktree-sentinel install is the precondition for both fire-once (T5) and invocability (T6); it produces no separate deliverable. The live install is operator-run (see D-9).
- **D-8 — package SHIPS the `claude-plugin` skill → final 19 (iter-2 AUTO-DECISION).** See the dedicated staged decision `package-includes-claude-plugin-skill-resync-after-t7.md`. T1 materializes 18 packaged skills; T7 re-runs the sync to capture the new 19th. T1's verifier is reworded off the hard-coded "18" to "all canonical packaged-skill dirs present at materialization time (18 at T1)". (iter-2 remediation of COD-CONS-001.)
- **D-9 — T5/T6 are OPERATOR-ASSISTED (iter-2).** A spawned executor cannot install a plugin out-of-process, start a fresh clean Claude session, trigger live hook events, or interactively invoke skills/agents. The autonomous executor deliverable is the validation script + assert harness + a documented step-by-step operator procedure (+ for T6 the conditional-edit logic guarded on an operator-supplied finding). The live install + clean session + invocation is operator-run (manager/user returns the marker log / cache listing / auto-grant result). The task does NOT claim autonomous verification of the installed state — doing so would stall Execution or fabricate evidence. (iter-2 remediation of OV-1 / ST-2 / US-1 / COD-RISK-001 / COD-OVERALL-002.)
- **D-10 — T5 harness mechanics pinned + cleanup/isolation boundary (iter-2).** Install source = worktree-faithful git-ref marketplace from the SESSION branch (NOT develop/main); marker file = one line per fire under an isolated marker dir keyed on `hook_event_name`; deterministic triggers = SessionStart (fresh session / `/clear`), PostToolUse (Task exit 0), PostToolUseFailure (Task engineered to exit non-zero); cleanup/isolation = isolated temp Claude config/HOME when possible, else record pre-state + `claude plugin uninstall` + `marketplace remove` + cache clear so the dev env is not polluted. (iter-2 remediation of COD-USAGE-001 + COD-RISK-001.)
- **D-W — worktree-absolute write paths are mandatory for every executor task.** Per `subagent-relative-write-paths-stray-cd-doesnt-persist` + `executor-mirror-path-vs-worktree-physical-copy`: `cd` does not persist across tool boundaries, so every Write must prefix the worktree-absolute root.

All 8 tasks → `executor` (sonnet default); none needs `leader` sub-planning or qualifies as `assistant`-trivial. T5/T6 carry an operator-assist contract (D-9) but remain executor-owned for the autonomous script-authoring deliverable.
