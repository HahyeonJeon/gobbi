# Codex Planning Evaluation iter3 — Usage Perspective

## Stage 0 Artifact Summary

Artifact: the iter3 raw planning draft and staged main plan. What: execution-facing instructions for manager and executors. Why: enter Execution only if the plan is unambiguous after iter2 REVISE. How: Task 01 local tag, manager push/worktree setup, Task 02 cleanup sweep, manager cleanup/PR/merge.

Memory reads: evaluator/planning skills, project rule, Scope Contract, Implementation Checklist, iter2 overall findings from Claude and Codex, raw/staged planning artifacts, git skill role-boundary/forbidden-operation snippets, and local grep evidence.

## Stage 1 Locked Frame

Scenario U1: A fresh executor can run Task 01 without asking about tag form.
- Check: the executable command is `git tag pre-reset-2026-05-21 487fc35`.
- Check: no imperative `git tag -a` remains.

Scenario U2: The manager can run §5a without guessing recovery behavior.
- Check: both stale worktrees have `cd <path> && git status --porcelain` prechecks.
- Check: non-empty output routes to NEEDS_CONTEXT.
- Check: `--force` is prohibited without explicit user authorization.

Scenario U3 (adversarial): A manager using the staged plan instead of rawdata sees stale iter2 instructions.
- Check: staged plan detailed manager actions include the iter3 §5a precheck or point to the iter3 rawdata.
- Check: staged cross-references do not route the reader to `draft-iter2.md` for the full command sequence.

Coverage matrix: agent/operator accessibility applies; the staged plan must be safe for tired 3am use.

## Stage 2 Findings

### F-CX-PLAN-O3-U-01

- **Title:** Staged plan can route the manager back to iter2's unsafe command sequence
- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** `100`
- **Severity:** `High`
- **Evidence:** `main.md:126` says "See `draft-iter2.md` § \"Manager pre/post-Execution operations\" for the full command sequence"; `main.md:154` says the full rawdata draft is `draft-iter2.md`. The fixed command sequence is in `draft-iter3.md:344-358`. `main.md:141` still summarizes §5a as direct `git worktree remove ...` operations with no `git status --porcelain` precheck or NEEDS_CONTEXT recovery.
- **FP-check:** Not pre-existing for iter3: these are in the current staged plan. Not out-of-scope: the user provided `staging/plans/main.md` as the iter3 staged plan and explicitly asked to verify the §5a precheck. Not style: following `draft-iter2.md` reintroduces iter2's known `git tag -a`/missing-precheck defects.
- **Why it matters:** A manager consuming `main.md` as the concise operational plan can follow the stale reference and skip the exact precheck that iter3 was supposed to add.
- **Suggested direction:** Update staged plan references to `draft-iter3.md` and mirror the §5a precheck/NEEDS_CONTEXT/NO `--force` detail in `main.md:141`.

### Stage 2 Step 3 — Iter2 Finding Disposition

| Iter2 finding | Disposition | Evidence |
|---|---|---|
| F-CL2-P-01 / F-CL2-A-02 / F-CL2-C-01 / F-CL2-R-03 | addressed | Task 01 line `draft-iter3.md:462`; no imperative `git tag -a` remains. |
| F-CL2-P-02 / F-CL2-R-01 | open | Rawdata fixed at `draft-iter3.md:347-358`, but staged `main.md:126/:141/:154` can still route to a no-precheck iter2 sequence. |
| F-CX-PLAN-O2-01 | addressed | `draft-iter3.md:462`; grep shows only historical `git tag -a pre-reset...` at `draft-iter3.md:719`. |
| F-CX-PLAN-O2-02 | addressed | `main.md:98`. |
| F-CL2-P-03 | deferred | `draft-iter3.md:825`. |
| F-CL2-R-02 | deferred | `draft-iter3.md:826`. |
| F-CL2-S-01 | deferred | `draft-iter3.md:827`. |
| F-CL2-S-02 | deferred | `draft-iter3.md:828`. |
| F-CL2-U-01 | deferred | `draft-iter3.md:829`. |
| F-CL2-U-02 | deferred | `draft-iter3.md:830`. |

## Per-Perspective Verdict

**REVISE.** F-CX-PLAN-O3-U-01 is High/100.

## Must-Preserve List

- Preserve the rawdata §5a fix exactly as written.
- Preserve corrected mistake-load timing at `main.md:98`.
- Preserve Task 01 lightweight command and local-only scope.
