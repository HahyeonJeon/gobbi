# Preparation Draft — iter1

## Scope reference

This Preparation Loop verifies readiness for the locked Ideation Idea: a destructive single-PR repo reset before bottom-up rebuild. Authority sources:

- Locked Idea: [`ideation/artifacts/idea.md`](../../ideation/artifacts/idea.md) — iter4 PASS draft
- Locked Scope Contract (19 user-confirmed decisions across 6 AskUserQuestion rounds): [`ideation/artifacts/scope-contract.md`](../../ideation/artifacts/scope-contract.md) § Decisions Locked
- Implementation Checklist (Stages 0–G, concrete commands): [`ideation/artifacts/implementation-checklist.md`](../../ideation/artifacts/implementation-checklist.md)
- Design Direction (D1–D11): [`ideation/artifacts/design-direction.md`](../../ideation/artifacts/design-direction.md)
- Handoff briefing: [`ideation/artifacts/handoff.md`](../../ideation/artifacts/handoff.md)
- Resolution log (every finding's final disposition): [`ideation/artifacts/resolution-log.md`](../../ideation/artifacts/resolution-log.md)
- Cross-system divergence audit: [`ideation/artifacts/cross-system-divergence.md`](../../ideation/artifacts/cross-system-divergence.md)

The Scope Contract names `feature: repo-reset`; the task body is procedural destructive file operations (bash + git + gh) targeting code, plugins, session dirs, branches, worktrees, gitignore policy, and a CLAUDE.md surgical 2-line excision, capped by an atomic-guard squash merge.

## Readiness summary

**Zero substantive gaps identified.** Project memory and workspace skills cover the locked Idea completely. The Implementation Checklist is fully self-contained: Stage 0 through Stage G enumerate concrete `git`/`gh`/`find`/`rm`/`sed`-style commands that an executor can run end-to-end without any project-specific skill that does not already exist. All four readiness surfaces verified:

1. **Ideation output sound** — 10 artifacts read end-to-end; no internal contradictions; Sub-step A passes.
2. **Ideation staging covers what Planning will consume** — 32 decisions, 2 design files (D1–D5, D6–D11), 8 discussions, 1 backlog staged. Scenarios/checklists intentionally minimal because the destructive-sweep Idea has no rebuild scope.
3. **Workspace skills present** — all 16 v0.5 skills (`git`, `execution`, `planning`, `evaluation`, `memorization`, `wrap-up`, `principles`, `mistake`, `ideation`, `preparation`, `orchestration`, `gobbi`, `delegation`, `discussion`, `interview`, `research`) under `.claude/skills/` and mirrored under `.gobbi/projects/gobbi/skills/`.
4. **Pre-state matches Implementation Checklist preconditions** — `gh` 2.45.0 supports `--match-head-commit`, `487fc35` is the current `develop` tip, the 4 target branches and 2 worktrees exist at the documented paths, the 13 placeholder-target subdirs + `adversarial-review/` all exist, root manifests match the deletion inventory (with `.claude-plugin/marketplace.json` already showing as `D` in `git status` per the Scope Contract's expectation), and CLAUDE.md lines 61-62 contain the exact v050-overview/v050-cli table-row text the H-1 surgical edit removes.

Gap count: **0**. Generated this loop: **0** skills, **0** memory promotions. Deferred to Planning (already flagged in Ideation handoff): **1** finding (F-CX-O4-01 `--delete-branch` wording) — this is not a Preparation gap; Ideation already routed it to Planning.

No `re-ideate` triggers. Preparation can advance directly to EVALUATION → Planning.

## Design + memory readiness

Sub-step B verification — items checked, gaps found, per-gap resolution applied.

| Item checked | Source signal | Status |
|---|---|---|
| `ideation/staging/decisions/` covers substantive choices | Scope Contract's 19 decisions + 6 AskUserQuestion rounds | **Present** — 32 decision files staged, including the 3 critical iter2/3/4 reframings (`q-iter4-override-atomic-guard.md`, `q-gate-redesign-non-circular-e2-gate.md`, `q-survivor-q-stagee-iter2-evaluator-driven.md`) and the manager mistake-candidate (`manager-bash-pwd-drift-from-worktree-cd.md`) |
| `ideation/staging/design/` covers substantive design topics | D1–D11 in design-direction.md | **Present** — 2 staged files (`d1-d5-core-sweep-architecture.md`, `d6-d11-gates-codex-rebuild-deferred.md`) collectively cover all 11 design decisions |
| `ideation/staging/discussions/` covers AskUserQuestion exchanges | 6 rounds Q1–Q-iter4-Override | **Present** — 8 discussion files staged, grouping the 6 rounds with iter2/3/4 sub-discussions |
| `ideation/staging/scenarios/` covers `scenario_gap` findings | Resolution log iter1–iter4 | **Present (intentionally empty)** — `artifacts/scenarios.md` carries the 16 S1–S14 scenarios inline; no `scenario_gap` finding from EVALUATION required separate staging. The destructive-sweep Idea has no rebuild scope, so scenarios are scoped to the sweep itself |
| `ideation/staging/checklists/` covers checklist gaps | Resolution log iter1–iter4 | **Present (intentionally empty)** — `artifacts/implementation-checklist.md` IS the checklist (Stages 0–G, ~672 lines of concrete commands). No `checklist_gap` finding from EVALUATION required separate staging |
| `ideation/staging/backlogs/project/` covers `deferred` findings | F-CX-O4-01, CLI regenerator risk | **Present** — `cli-regenerates-gobbi-gitignore.md` staged for the CLI-regenerator concern; F-CX-O4-01 cleanup-wording finding staged at `decisions/gh-delete-branch-local-cleanup-wording.md` with `disposition: deferred` per handoff.md |
| Feature directory `features/repo-reset/` exists or bootstrappable | Scope Contract `feature: repo-reset` | **Bootstrappable** — directory does not yet exist; per Sub-step A step 2, "plausibly bootstrappable by Wrap-up" is sufficient. **Note**: per Q-A lock, `features/` is in the 13 placeholder-subdir set, so the post-sweep `features/repo-reset/` would be deleted shortly after creation. H-4 already documents this trade-off ("backlog stays session-scoped; the rebuild session reads from the preserved session dir"). This is by design, not a gap |
| Project mistakes covering the destructive-FS-ops domain | `executor-rationalized-failing-verification-gate.md`, `session-dir-naming-convention-uses-date-prefix.md`, `manager-mispec-grep-c-for-occurrence-count.md` | **Present + encoded** — all 3 mistake files exist at `.gobbi/projects/gobbi/mistakes/`. Per H-2 user-accepted trade-off, the 3 files WILL be deleted by Stage C placeholder-izing of `mistakes/`, but their lessons are encoded inline in the Implementation Checklist (Stage E.2 NEEDS_CONTEXT clause, Stage G non-zero exit NEEDS_CONTEXT clause, M-3 explicit `c676684d-` naming, D2 #16 `$`-anchored grep audit). This is the locked H-2 trade-off, not a gap |
| Project rules relevant to the destructive sweep | `rules/stub-redirect-format.md` | **Present + correctly scoped out** — D4 in design-direction.md explicitly documents that `stub-redirect-format.md` is for supersession stubs (content-moved scenarios), not for the placeholder-after-wipe stubs the sweep creates. D4 supplies an authoritative inline template (≤ 4 lines). No rule conflict; no rule gap |

**Design + memory gap list: empty.** Every readiness signal from Sub-step A is covered by an existing or staged artifact, with the two intentionally-empty staging surfaces (`scenarios/`, `checklists/`) accounted for by the Implementation Checklist's self-contained shape.

## Execution skills readiness

Sub-step C verification — skills checked, missing skills, per-gap resolution.

| Skill needed | Domain coverage | Tier | Status |
|---|---|---|---|
| `git` | branch / worktree / tag / push / `gh pr create` / `gh pr merge` lifecycle | workspace + project (mirror) | **Present** at `.claude/skills/git/SKILL.md` and `.gobbi/projects/gobbi/skills/git/`. Covers `--squash --delete-branch` merge semantics, worktree removal pre-conditions, and the manager-vs-executor lifecycle boundary (manager owns push + PR + merge; executor commits only) |
| `execution` | 5-phase Study → Plan → Execute → Verify → Commit lifecycle, 4-state status enum, scope discipline, fresh-verification gate | workspace + project (mirror) | **Present**. Memory Access Matrix already accommodates write to `.claude/CLAUDE.md` for the H-1 surgical line-61-62 edit ("`.claude/` edits are workspace codebase edits; same in-scope / out-of-scope rule applies") |
| `planning` | Who/When/Where decomposition, task YAML schema | workspace + project (mirror) | **Present** — Planning Loop will consume this skill in the next loop after Preparation PASS |
| `evaluation` | Stage 0–3 procedure, 7 perspectives + Overall, cross-system reconciliation | workspace + project (mirror) | **Present** — both Preparation EVALUATION and downstream Planning/Execution EVALUATION rely on it |
| `memorization` | every-iter / PASS-only procedure, artifact frontmatter schema, cumulative-staging rule | workspace + project (mirror) | **Present** |
| `wrap-up` | session → project promotion routing | workspace + project (mirror) | **Present** — Wrap-up will promote `ideation/staging/` decisions / discussions / design / backlogs after the sweep merges. Per H-4: the post-sweep promotion target for the CLI-regenerator backlog vanishes (placeholdered), so that file stays session-scoped — Wrap-up routing accommodates this |
| `mistake` | check-before-acting + write-after-correction discipline | workspace + project (mirror) | **Present**. Manager-bash-pwd-drift mistake-candidate already staged at `ideation/staging/decisions/manager-bash-pwd-drift-from-worktree-cd.md` |
| `principles` | 12 Iron Laws | workspace + project (mirror) | **Present**. The Implementation Checklist's "no rationalization" clauses at Stage E.2 and Stage G map directly to Iron Law 11 + the `executor-rationalized-failing-verification-gate` mistake |
| `interview` | project-skill template stamping | workspace + project (mirror) | **Present** — would be loaded only if Sub-step D produced a `generate-now` skill decision, which it did not |
| `orchestration` | manager's spawn / reconciliation orchestration across all loops | workspace + project (mirror) | **Present** |
| `gobbi` | session-setup entry point | workspace + project (mirror) | **Present** |
| `delegation` | subagent prompt construction, NEEDS_CONTEXT escalation primitive | workspace + project (mirror) | **Present** |
| `discussion` | AskUserQuestion templates, decision classification | workspace + project (mirror) | **Present** |
| `research` | source-priority procedures | workspace + project (mirror) | **Present** — Ideation already exercised this; not needed in Execution |
| Project-specific skill for "destructive single-PR repo reset" | hypothetical | project | **NOT needed** — the work is procedural file operations governed by an exhaustive Implementation Checklist with concrete commands. There is no novel-design domain a new skill would codify that the Implementation Checklist does not already encode line-by-line |

**Workspace tooling preconditions verified empirically:**

- `gh --version` → `gh version 2.45.0 (2025-07-18)` ✓ (meets `--match-head-commit` minimum of 2.45.0+ per D11)
- `gh pr merge --help | grep match-head-commit` → flag present and documented ✓
- `gh auth status` → authenticated as `HahyeonJeon`, ssh protocol, active account ✓
- `git -C . log --oneline -1 487fc35` → `487fc35 docs(orchestration): add Entry Point section + reciprocal pointers (#259) (#262)` ✓ — matches the Stage 0 tag target SHA
- `git tag -l 'pre-reset*'` → empty ✓ — tag does not yet exist, Stage 0 creates it
- `git worktree list` → 3 entries (main + the 2 documented sweep targets) ✓
- `git branch` → 4 target branches (`fix/257-complete-mirror-sync`, `pr-fin-2-decisions-hold`, `redesign/v050-ideation`, `refactor/257-skills-agents-rules`) + `main` + `develop` ✓
- `find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d | wc -l` → `54` ✓ — matches "53 historical + 1 current"
- 13 placeholder-target subdirs all present + `adversarial-review/` present + `worktrees/` present ✓
- Root manifests inventory: 11 of 12 present (`.claude-plugin/marketplace.json` MISSING because it is already `D` in `git status` per Scope Contract expectation) ✓
- CLAUDE.md lines 61-62 contain the exact v050-overview/v050-cli table rows targeted by H-1 (verified by `sed -n '58,65p'`) ✓

**Execution skills gap list: empty.**

## Generated this loop

(none — no gap required `generate-now`)

The 13 placeholder-tier session-staging directories under `sessions/2026-05-21-6637e759-.../preparation/staging/` (`backlogs/`, `checklists/`, `decisions/`, `design/`, `discussions/`, `references/`, `reports/`, `reviews/`, `scenarios/`, `skills/`) are bootstrapped by the manager per the Preparation Loop's session-tree contract, but they are intentionally empty in this iter1 because no `generate-now` decision was warranted by the gap analysis. Future EVALUATION findings or REVISE iterations may populate them; iter1 leaves them empty.

## Out of scope gaps

Items recorded as not addressed by this Preparation Loop, with severity and pointer:

| Item | Severity | Routing |
|---|---|---|
| F-CX-O4-01 (`--delete-branch` local cleanup wording mismatch in Stage G) | Medium / 75 confidence | **Already deferred to Planning by Ideation handoff** — staged at `ideation/staging/decisions/gh-delete-branch-local-cleanup-wording.md` with `disposition: deferred`. Planning will normalize the Stage G post-merge cleanup language against `gh --delete-branch` actual local behavior. **Not a Preparation gap.** |
| F-OV-02 (Karpathy orthogonal-edits steel-man) | Medium / 50 | **Disputed at Ideation** — user explicitly locked Q3 single-PR; signal recorded for posterity but not actionable in this campaign. Resolution-log § iter1 row `F-OV-02`. |
| F-A4-01, F-U4-01, F-A3-01, F-A3-02 (below-threshold polish) | Low | Below REVISE threshold per Ideation policy; resolution-log marks them `open (below-threshold, documented)`. No Preparation action. |
| CLI-regenerator risk for `.gobbi/.gitignore` (S12, D8) | Medium | Session-scoped backlog at `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`. Per H-4: stays under preserved session dir post-sweep (no project-level promotion target). The rebuild session must read it from the preserved session dir before regenerating `.gobbi/.gitignore`. **Documented, not actionable in this Preparation Loop.** |
| Post-sweep restoration of the 3 deleted mistake files | Low | Per H-2 user-accepted trade-off, lessons encoded inline in the Implementation Checklist. No restoration mechanism required this loop. |
| Variant C of `stub-redirect-format.md` (placeholder-after-wipe stub format) | Low | Deferred follow-up per D4. Will be filed as a rebuild-session task; out of scope this loop. |

None of these items rise to the level of a Preparation gap. They are either (a) already-routed Ideation deferrals, (b) below-threshold polish, (c) post-sweep follow-ups, or (d) user-disputed.

## Decisions log

### Sub-step A (Read Ideation Output)

- Confirmed the 10 Ideation artifacts are mutually consistent:
  - `idea.md` (the locked Idea narrative)
  - `scope-contract.md` (19 decisions across 6 rounds, In-Scope / Out-of-Scope, 14 Success Criteria, Deferred section)
  - `framed-problem.md` (root cause, impact, counterfactual)
  - `design-direction.md` (D1–D11)
  - `implementation-checklist.md` (Stages 0–G, ~672 lines of concrete commands)
  - `scenarios.md` (S1–S14 + S3b + S6b)
  - `resolution-log.md` (every iter1–iter4 finding with disposition)
  - `cross-system-divergence.md` (4-iter dual-EVAL audit trail)
  - `handoff.md` (Preparation briefing)
  - `memory-reads.md` (56 evaluation files + drafts + staging + project-memory reads enumerated)
- No internal contradictions. The iter4 PASS verdict (Claude PASS + Codex PASS at convergence) is supported by the resolution-log's per-finding disposition table.
- Verified the feature directory referenced by the Scope Contract (`feature: repo-reset`) is plausibly bootstrappable by Wrap-up; not a blocker even though it does not yet exist and will be placeholdered post-sweep.

### Sub-step B (Design + Memory Readiness)

- Walked the `ideation/staging/` tree: 32 decisions, 2 design files, 8 discussions, 1 project backlog, 0 scenarios, 0 checklists, 0 references, 0 learnings, 0 feature-backlogs.
- Empty `scenarios/` and `checklists/` staging is intentional — `artifacts/scenarios.md` and `artifacts/implementation-checklist.md` carry that content inline as the iter4 PASS output. No `scenario_gap` or `checklist_gap` finding from EVALUATION required separate staging files.
- Project mistakes covering the domain (3 files) all present at `.gobbi/projects/gobbi/mistakes/`. Their lessons are encoded inline in the Implementation Checklist per H-2 user-accepted trade-off.
- Project rules: only `stub-redirect-format.md` exists; D4 correctly scopes it out for placeholder-after-wipe stubs and supplies an authoritative inline template.

### Sub-step C (Execution Skills Readiness)

- Workspace and project skill mirrors verified: 16 skills present on both sides (16 dirs at `.claude/skills/` matching 16 dirs at `.gobbi/projects/gobbi/skills/`).
- Empirically verified workspace tooling preconditions via Bash:
  - `gh --version` → 2.45.0 (matches D11 minimum)
  - `gh pr merge --help | grep match-head-commit` → flag present
  - `gh auth status` → authenticated, ssh, active
  - `git log --oneline -1 487fc35` → SHA + correct PR title (the merge commit for #262)
  - `git tag -l 'pre-reset*'` → empty (Stage 0 will create the tag fresh)
  - `git worktree list` → 3 entries matching Implementation Checklist Stage F removal targets
  - `git branch` → 4 deletion-target branches + main + develop present
  - 13 placeholder-target subdirs all present + `adversarial-review/` present + worktrees/ present
  - Root manifests: 11 of 12 present, with `.claude-plugin/marketplace.json` confirmed already-deleted-mid-flight per Scope Contract
- Concluded: no missing project-specific skill. The Implementation Checklist is fully self-contained and an executor can run it end-to-end with the existing workspace skills.

### Sub-step D (Gap Resolution)

- Consolidated gap table: **empty.** No row required user AskUserQuestion routing.
- No `re-ideate` triggered.
- No `generate-now` triggered.
- Out-of-scope items listed above are all pre-routed (Planning deferral / below-threshold / post-sweep follow-up / user-disputed); they do not enter the gap-resolution flow.

**Verification commands run during this loop** (and their outputs that supported the empty-gap conclusion):

```bash
ls .gobbi/projects/gobbi/skills/                            # 16 skill dirs
ls .gobbi/projects/gobbi/agents/                            # 5 agent files
ls .gobbi/projects/gobbi/rules/                             # 1 rule file (stub-redirect-format.md)
ls .gobbi/projects/gobbi/mistakes/                          # 40 mistake files (the 3 cited present)
ls .gobbi/projects/gobbi/features/                          # 2 dirs (gobbi-install, orchestration-docs); no repo-reset (expected)
ls .claude/skills/                                          # 16 skill dirs (mirror)
gh --version                                                # 2.45.0
gh pr merge --help | grep match-head-commit                 # flag present
gh auth status                                              # authenticated, ssh, active
git log --oneline -1 487fc35                                # docs(orchestration): add Entry Point ... (#259) (#262)
git tag -l 'pre-reset*'                                     # empty
git worktree list                                           # 3 entries
git branch                                                  # 4 deletion targets + main + develop
find .gobbi/projects/gobbi/sessions/ -maxdepth 1 -mindepth 1 -type d | wc -l   # 54
sed -n '58,65p' .claude/CLAUDE.md                           # confirms v050-overview/v050-cli rows at 61-62
```

All preconditions met. Preparation Loop iter1 verdict candidate: **PASS** — pending EVALUATION.

### Notes for downstream EVALUATION

- **Gap coverage**: every Sub-step B/C surface was scanned; empty result is the right outcome for a procedural destructive-FS-ops task governed by a 672-line concrete-commands checklist.
- **Generation quality**: not applicable — zero artifacts generated this loop.
- **`re-ideate` triggering**: not applicable — no finding rises to "unworkable without re-Ideation."
- **Scope discipline**: no project-wide gaps absorbed; the F-CX-O4-01 deferral was inherited from Ideation handoff and is routed at Planning, not absorbed here.
- **NEEDS_CONTEXT**: none required from the user this loop.
