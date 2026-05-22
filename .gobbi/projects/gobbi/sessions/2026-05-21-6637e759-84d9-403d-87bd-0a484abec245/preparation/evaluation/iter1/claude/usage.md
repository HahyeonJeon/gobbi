---
loop: preparation
iter: 1
perspective: usage
evaluator_system: claude
artifact_under_eval: preparation/rawdata/draft-iter1.md
---

# Usage — Preparation iter1

## Lens
For the next consumer — Planning leader, Execution executor, Wrap-up assistant — is the Preparation output usable?

## Stage 0 — Target Understanding
The downstream consumers of this Preparation artifact are: (a) Planning leader (immediately, to decompose Stages 0–G into ordered tasks), (b) Execution executor (to run the locked checklist), (c) Wrap-up assistant (to promote Ideation+Preparation staging to project memory). The Preparation audit is a "no surprises" document: if the executor reads it before Execution, they should not need to ask the user a clarifying question.

## Stage 1 — Frame
Seed scenarios from `preparation/evaluation.md § Usage`:
- S1: Planning leader can start without asking clarifying questions.
- S2: Execution executor can apply staged skills without seeing DISCUSSION.
- S3: Wrap-up assistant can route every staging file without ambiguity.
- S4: Consumer forms the right mental model (adversarial).
- S5: Observability / "diagnosable at 3am".

## Stage 2 — Scenario walk

**S1 — Planning can start cold**
- The draft enumerates each Out-of-scope deferral with the routing destination (Planning / below-threshold / post-sweep / user-disputed) — Planning knows immediately what's on its plate (F-CX-O4-01 cleanup-wording fix) and what's not (everything else).
- Sub-step C's empirical-precondition verification block (lines 70–82) gives Planning concrete evidence that the Implementation Checklist's preconditions hold today. Planning can decompose without re-verifying.
- ✓

**S2 — Executor without DISCUSSION**
- No skills generated this loop, so the "staged skill standalone" check is N/A. The pre-existing 16 workspace + 16 project skills are battle-tested and standalone.
- The 3 mistake files cited by the Sub-step B table (executor-rationalized-failing-verification-gate, session-dir-naming-convention-uses-date-prefix, manager-mispec-grep-c-for-occurrence-count) are inlined-in-checklist per H-2. An executor reading the Implementation Checklist sees the lesson at the point-of-use. ✓

**S3 — Wrap-up routing**
- Inherited Ideation staging: 32 decisions → `decisions/` (project promotion target — but Stage C wipes `decisions/`, so per H-4 it stays session-scoped); 2 design files → `design/` (Stage C wipes); 8 discussions → typically session-scoped anyway; 1 backlog → `backlogs/project/` (Stage C wipes).
- Leader correctly notes the routing-target-vanishes problem in Sub-step B row 6 ("CLI-regenerator risk: Per H-4, stays under preserved session dir post-sweep") AND in Sub-step C skill row "Wrap-up" ("the post-sweep promotion target for the CLI-regenerator backlog vanishes (placeholdered), so that file stays session-scoped — Wrap-up routing accommodates this").
- This is a CRITICAL piece of downstream coordination — Wrap-up would otherwise try to promote into a placeholder dir. The leader documented it. ✓

**S4 — Right mental model**
- "Generated this loop: 0 skills, 0 memory promotions" is unambiguous. No skill-skeleton is being passed off as generated.
- Deferred items are tagged with severity AND routing AND rationale. A consumer cannot confuse a deferral for a resolution. ✓

**S5 — Observability**
- Each Sub-step B/C row cites the source signal (Scope Contract item, design-direction.md decision, Ideation handoff item). At-3am: a maintainer asking "why was this skill marked Present?" can trace back to the cited signal.
- The "Verification commands run during this loop" block at lines 156–172 is reproducible — any maintainer can re-run the bash commands and re-check. ✓

## Stage 2 — Adversarial probe results

I tried to find a usage gap a downstream consumer would hit:
- **Planning leader needs to know what Stage G's `gh pr merge --delete-branch` actually does locally**: the Implementation Checklist's "post-merge local cleanup `git branch -d <sweep-branch>`" (Stage G, M-2) covers this, AND F-CX-O4-01 deferred to Planning explicitly. The leader correctly does NOT absorb F-CX-O4-01 into Preparation — it's a wording-normalization, not a readiness gap.
- **Execution executor needs to know whether `.gobbi/.gitignore` requires `git add -f`**: Investigating, `.gobbi/.gitignore` is currently NOT git-tracked (caught by `.gobbi/*` in root `.gitignore`). The Implementation Checklist Stage D line 60 says `git add .gitignore .gobbi/.gitignore` — the `.gobbi/.gitignore` portion is effectively a no-op (file stays ignored). The on-disk edit IS what takes effect for `git check-ignore` purposes. The Stage D verification `git check-ignore .gobbi/projects/gobbi/sessions/.../session.json` returns exit 1 correctly because root `.gitignore`'s `.gobbi/projects/*/sessions/` line is being removed AND `.gobbi/.gitignore`'s `sessions/` line is being removed — both on disk. **This is consistent, but the wording in Stage D is slightly imprecise about whether the `git add` of `.gobbi/.gitignore` succeeds.** Not a Preparation gap (it's an Implementation Checklist phrasing nit, not a readiness gap) — but Planning may want to clarify the `.gobbi/.gitignore` add-step as "edit-on-disk (file is gitignored; `git add` is a no-op)". Marking as Low / 50 awareness only, not a finding.
- **Wrap-up routing for the 3 mistake-promotion candidates** (manager-bash-pwd-drift-from-worktree-cd staged at `ideation/staging/decisions/`, not under `mistakes/`): per the leader's table line 36 and Sub-step B line 129, the file is correctly slug-named and frontmatter-typed. Wrap-up's routing handles it. ✓

## Findings

(none — the `.gobbi/.gitignore` add-step phrasing observation is below threshold and is an Implementation Checklist concern, not a Preparation readiness gap)

## Must-preserve list
- The explicit per-stage routing in the Out-of-scope-gaps table.
- The Sub-step C "Wrap-up" row's note about the CLI-regenerator backlog staying session-scoped (this is the crucial downstream-coordination signal).
- The "Verification commands run during this loop" block at lines 156–172 — reproducibility.

## Verdict
**PASS** — Downstream consumers can use the Preparation audit without surprises. The H-4 routing-target-vanishes coordination is documented.
