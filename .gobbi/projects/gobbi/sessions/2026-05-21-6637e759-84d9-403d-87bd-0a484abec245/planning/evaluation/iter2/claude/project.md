# Planning iter2 — Project perspective (Claude)

## Stage 0 — Artifact summary

Target: iter2 draft of repo-reset Plan applying 4 surgical fixes + 5 bundled cleanups against iter1 REVISE/FAIL. Perspective: does the work honor the user's project contract (19 Ideation locks, 5 D-PLAN locks, the iron laws, and `git/SKILL.md` Role Boundaries)?

## Stage 1 — Locked frame

Project scenarios for this iter2 verification:
- S-P1 Tag push has moved from Task 01 to Manager pre-Task-02 §1b. (Iron Law 9 + `git/SKILL.md` Role Boundaries)
- S-P2 Stage F (worktree-remove + branch -d/-D) has moved from Task 02 to Manager post-Task-02 §5a + §5b.
- S-P3 Task 02 commit count is locked to EXACTLY 3 (Fix 2 / D-PLAN-06).
- S-P4 D-PLAN-03 supersession flag lives in Plan's Decisions Log only — Ideation artifact NOT edited (Iron Law 4 — scope bounded by user contract; Ideation iter4 PASS status preserved).
- S-P5 Self-review spec-coverage matrix re-attributes Stage 0 push / Stage A branch-open / Stage F per their corrected owners (Fix 4).
- S-P6 All 19 Ideation locks remain unchanged; the 5 bundled cleanups do not introduce scope creep.

## Stage 2 — Findings against the iter1 finding ledger

| iter1 ID | iter1 verdict | iter2 disposition | Confidence | Evidence |
|---|---|---|---|---|
| F-CL-P-01 (Stage F role-boundary leak, High/75) | open | **addressed** | 100 | Task 02 `what:` (line 175-184) "scope narrowed to Stages A through E.2 (no Stage F)"; Manager §5a + §5b host worktree-remove + branch-delete (lines 341-357); spec-coverage matrix line 481 reassigns Stage F to Manager. Restore-point diff confirms Task 02 `files:` no longer contains worktree/refs entries that iter1 lines 234-239 had. |
| F-CL-P-02 (traces-to missing F-CX-PREP-O-02 + Q-Gate-Redesign, Low/50) | open | **addressed** | 90 | Task 02 `traces-to:` line 192-193 now explicitly cites both `F-CX-PREP-O-02` and `iter3 Q-Gate-Redesign`. |
| F-CX-PLAN-O-01 (Critical/90 push + cleanup in executor) | open | **addressed** | 100 | Same evidence as F-CL-P-01 + Task 01 `what:` line 151 "STOPS at 'tag created locally'"; manager-pushes the tag at §1b (line 322-328). All cited iter1 line ranges no longer exist with the executor as owner. |

**New iter2-only findings:**

### F-CL2-P-01 — Tag flag/type inconsistency between executor-prose and YAML

- Type: design_flaw
- Domain: process / docs-sync
- Disposition: open
- Confidence: 90
- Severity: Medium
- Evidence:
  - Line 54: "create local **annotated** tag"
  - Line 151 (Task 01 `what:`): "Create **lightweight** tag"
  - Line 154 (`traces-to:`): "`git tag pre-reset-2026-05-21 487fc35` (**lightweight tag**; no -a flag, no message required)"
  - Line 448 (Agent assignments Task 01 Special discipline): "The executor stops at **`git tag -a pre-reset-2026-05-21 487fc35`**"
- Why it matters: `-a` without `-m` opens an interactive editor; a sonnet executor running headless will hang or NEEDS_CONTEXT. The contradictory prose ("annotated" vs "lightweight") and the imperative `git tag -a` form at line 448 collides with line 154's "no -a flag" canonical form. The iter1 draft was consistent on "lightweight"; iter2's Fix 1 rewrite of the Special-discipline cell introduced this drift.
- Suggested direction: pick one (the Scope Contract uses "lightweight" per Q-F; honor that), and edit lines 54 + 448 to match line 154.

### F-CL2-P-02 — Stage F worktree-remove sequence lacks `git status`-clean pre-check that `git/SKILL.md` mandates

- Type: scenario_gap
- Domain: process / git-discipline
- Disposition: open
- Confidence: 80
- Severity: Medium
- Evidence:
  - `git/SKILL.md` Procedure P5 step 3 (line 198): "Before removing the worktree: run `git status` inside it to confirm a clean working tree AND that the branch is merged into base. Then `git worktree remove`. **Never use `--force` / `-f` without explicit user approval**."
  - `git/SKILL.md` Forbidden Operations row (line 121): `git worktree remove --force` requires user approval; the safe-list rationale requires the clean-tree precheck.
  - iter2 Manager §5a (lines 341-348) prescribes `git worktree remove .../redesign-v050-ideation` directly with "NO `--force`" annotation, BUT does NOT include a `cd <worktree> && git status` precheck. Same for the second worktree.
  - The two stale worktrees being removed are NOT the sweep worktree — they predate this session (`redesign/v050-ideation` and `refactor/257-skills-agents-rules` per the git status block) and may legitimately contain uncommitted work that the user expects to preserve.
- Why it matters: `git worktree remove` without `--force` will fail if the tree is unclean — that's the safety. But the iter2 Plan doesn't tell the manager how to RESPOND to that failure. Per `git/SKILL.md` Failure Modes (line 236), the recovery is "Run `git status` inside the worktree first — if unclean, commit or discard explicitly before retrying". This belongs in the Plan so the manager doesn't reach for `--force` under pressure.
- Suggested direction: add a precondition step `cd <worktree> && git status` before each remove; if unclean, NEEDS_CONTEXT to user (do NOT silently force).

### F-CL2-P-03 — Tag push at Manager §1b lacks the `gh auth status` precheck

- Type: scenario_gap
- Domain: process / git-discipline
- Disposition: open
- Confidence: 60
- Severity: Low
- Evidence:
  - `git/SKILL.md` Procedure P1 step 2: "Run `gh auth status` to confirm authentication". This is at session-start, but P2 step 2 says "re-verify at point of use".
  - iter2 Manager §1b (lines 324-328) is a `git push origin pre-reset-2026-05-21` only — no `git remote get-url origin` or `gh auth status` re-verification before push.
- Why it matters: If session-start P1 ran successfully but auth has since expired (long-running session, token revoked), the push will fail with an opaque git error. Per P2's "re-verify at point of use" principle, this is a thin omission.
- Suggested direction: prepend `git remote get-url origin` or `gh auth status` as a 1-line precheck to §1b.

## Stage 3 — Project verdict

Three iter1 Project-domain findings ALL addressed. Three new iter2-only findings: one Medium/90 (tag flag drift caused by the Fix 1 rewrite), one Medium/80 (Stage F precheck), one Low/60 (auth precheck). None are Critical. The Medium/90 F-CL2-P-01 is the most pressing — it's a regression introduced by iter2 itself. Per verdict thresholds (no Critical ≥ 75; one Medium ≥ 75 = High-equivalent threshold not met but worth surfacing): the Project perspective verdict on iter2 is **REVISE** for the tag flag inconsistency and Stage F precheck gap.

Verdict: **REVISE** (driven by F-CL2-P-01 + F-CL2-P-02; the Critical role-boundary leak that drove iter1 FAIL is fully resolved).

## Must-preserve list

- Fix 1 role-boundary remediation (Task 01 local-only; Manager §1b push; Manager §5a/§5b cleanup) — convergent evaluator authority, do NOT regress.
- D-PLAN-03 supersession flag at Plan level (NOT in Ideation artifact) — Iron Law 4.
- Task 02 `traces-to:` enriched with F-CX-PREP-O-02 + Q-Gate-Redesign anchors.
- Special discipline cell in Task 02 Agent assignments (the explicit "NO push, NO PR-create, NO merge, NO worktree-remove, NO local-branch delete, NO `--force`" line) — the executor's guardrail.

```
STATUS: DONE
VERDICT: REVISE
```
