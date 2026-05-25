# Restore point — iter 2 pre-REVISE
# Captured: 2026-05-24
# To re-run: copy this file back to draft-iter2.md

# Planning Loop — Bundle C Plan — iter2

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Planning iter2 (REVISE of iter1)
**Author**: leader (PI/PM)
**Status**: DRAFT — 6 implementation tasks (T01..T06), 1 task per CL; addresses iter1 EVAL Highs H1/H2/H3 + folds Medium-equivalent findings; ready for re-EVAL.
**Branch**: `chore/session-2026-05-24-45388fa9` (develop @ `cf426f7`)
**Supersedes**: `<sessionDir>/planning/rawdata/draft-iter1.md` (preserved verbatim at `<sessionDir>/planning/rawdata/restore/iter1-pre-revise.md` per planning/SKILL.md § Restore Point).

---

## REVISE delta (what iter2 changes vs iter1)

Three High findings from iter1 EVAL drove this revision; all addressed. One Medium-equivalent finding folded in (the same root-cause that surfaces in Claude P5 U-F1 and P6 C-F1 — already covered by the H1 fix).

| # | Finding | Where it landed | Fix shape |
|---|---|---|---|
| H1 | T06 awk pattern misses H3; `gobbi/SKILL.md` has no Path Conventions section. | T06 § what + § files + § verifies; § File map (CL-5 group); § Dependency table; § Spec coverage; § Bundle-wide AC | (a) Awk start pattern extended to cover `^### Path [Cc]onventions` (and bolded variants `^\*\*Path [Cc]onventions\*\*`); (b) CL-5 sweep scope reduced from 11 to **10** files — `gobbi/SKILL.md` empirically has no Path Conventions section AND no `{session-id}` row, so M2 codification is not applicable; (c) the env-health gate at line 52 of `gobbi/SKILL.md` is now formally OUT-OF-SCOPE in `files-must-not-touch`, not just an anti-game footnote. |
| H2 | T06 `$FILES` newline-string loop is zsh-broken; second verify block re-uses undefined `$FILES`. | T06 § verifies | Rewrote both verify entries as **self-contained** shell heredoc-style commands using a portable `set --` positional-arg array, declared inside the same verify entry that uses it. No cross-entry variable dependency. Verified pattern works under both bash and zsh. |
| H3 | Many `verifies:` lines are not clean pass/fail commands — English prose, comment-only thresholds, missing `\|\| exit 1`. | T01..T06 § verifies (every task) | Every `verifies` line is now a self-contained shell command that exits 0 on pass, non-zero on fail. Thresholds encoded with `test -eq` / `test -ge` / `\|\| exit 1`. English explanations moved to `# comment` lines that precede the command (not appended to it). Where a verification requires several primitives, the entry uses a single heredoc-style multi-line block that ends with `exit 0` only when all assertions passed. |

All Medium findings in Claude P5/P6 share the H1 root-cause and are subsumed by the CL-5 downscoping + awk extension. No additional Mediums folded in from Codex's iter1 output (codex/ iter1 dir is empty at `<sessionDir>/planning/evaluation/iter1/codex/` — the codex evaluator produced no per-perspective files this iter; the brief's H2/H3 carry Codex's verbatim findings, both addressed).

DAG, sequencing (T01→T02→T03→T04→T05→T06), 7 DLs (DL-1..DL-7), Scope Contract, CL-6 = Option B — all unchanged. Only T06 contracts (11→10 files); no other task's scope changes.

---

## Scope reference

- Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/artifacts/idea.md` (lines 1-580)
- Decisions summary: `<sessionDir>/ideation/artifacts/decisions-summary.md` — 7 user-locked DLs (DL-1..DL-7)
- Preparation readiness: `<sessionDir>/preparation/artifacts/preparation.md` — all 6 CLs PASS, 0 blockers, 1 minor citation-precision concern on CL-6 (folded into T02), 1 inherited error on CL-5 about `gobbi/SKILL.md` (CORRECTED here per iter2 H1)
- Locked Scope Contract: Idea § Scope Contract (CL-1..CL-6, 6 deliverables) — feature `session-foundations-bundle-c`

**Project / Feature / Task triplet** (verbatim from Idea Scope Contract):
- project: `gobbi`
- feature: `session-foundations-bundle-c`
- goal: "Land 6 cohering follow-ups — gobbi-hook-authoring skill (stage + promote, M2-compliant from creation), mistake/SKILL.md consolidated edits + hooks-watchlist backlog clarifier, session-lifecycle worktree-boundaries design doc, f-struct-01 inline close, f-risk-01 M2 delegation-prompt-passing docs sweep across N skills, and orchestration row-5/5.5/6 path-resolution fix (CL-6)."

**Iter2 scope-sharpening note (DL-5 mitigation faithfulness)**: DL-5 (M2-only, M1/M3 NOT chosen) stands. The CL-5 sweep is the M2 codification — a documentation-only change. M2 applies only to files that already document the `{session-id}` path convention. `gobbi/SKILL.md` does not document `{session-id}` in a Path Conventions section (it has no such section and no `{session-id}` row — all 3 CCSI hits are in env-var passthrough tables / runtime-health-gate prose); adding one would be CL-5 scope expansion (out-of-scope per Iron Law 4). Dropping it from the sweep is therefore the correct M2-faithful action — not a re-Ideate trigger; it is the sharper expression of the same locked mitigation choice.

---

## TL;DR

Bundle C decomposes into **6 implementation tasks, 1 per CL**, ordered per Idea § Sequencing/DAG:

`T01 (CL-1) → T02 (CL-6) → T03 (CL-3) → T04 (CL-2) → T05 (CL-4) → T06 (CL-5)`

Every task is sequential (Iron Law 3), independent file-wise (DAG has no fan-out), and ships in the same PR on `chore/session-2026-05-24-45388fa9`. All tasks are `executor` (sonnet); dual-system evaluation (Claude + Codex) is applied per task at the Execution EVALUATION sub-phase (`execution.evaluate.mode: always`).

**CL-5 granularity decision: single sweep task (T06)**, not per-file tasks — see DR-1 below. **CL-5 file count: 10** (was 11 in iter1; `gobbi/SKILL.md` empirically lacks a Path Conventions section, dropped per H1).

Total estimated develop-shipping LOC: **~750–950** (slightly tighter than iter1's ~800–1000 because `gobbi/SKILL.md` is out).
Total estimated executor task count: **6** (unchanged; per Idea D-6 recommended "1 task per CL").

---

## File map

Every file the plan creates or modifies, grouped by CL ownership. Inherited from Idea § Per-Deliverable Scope-Bound Table; conflicts resolved via D-7 revised (`mistake/SKILL.md` exclusively to CL-3). CL-5 file list updated per iter2 H1.

### CL-1 group (1 file — backlog status flip)

- `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` — MODIFY (frontmatter `status: open` → `closed`, add `closed_by: 159eb21`, append closure note citing `session-start.sh:73-77`).

### CL-2 group (3 files — new skill + staged twin + backlog flip)

- `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md` — CREATE (session-staged skill body using `interview/templates/project-skill.md`; M2-compliant Path Conventions from creation, or no Path Conventions section + zero CCSI mentions).
- `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` — CREATE (promoted from staged; identical body; this is the develop-shipping file).
- `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` — MODIFY (frontmatter `status: deferred` → `closed`).

### CL-3 group (2 files — mistake skill consolidated edits + backlog clarifier)

- `.claude/skills/mistake/SKILL.md` — MODIFY (two edits in one file open: add `hooks` to domain-tag examples list at lines 63 + 90; rewrite `{session-id}` Path Conventions row at line 129 to canonical M2 wording). Section heading is `**Path conventions**` (bold) at line 126.
- `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` — MODIFY (frontmatter `status: deferred` → `in-progress`; clarify perpetual-capture-reminder + N≥2 skill-extraction trigger).

### CL-4 group (2 files — design doc + backlog flip)

- `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` — CREATE (per `memorization/templates/design.md`; 5 sections per backlog § "Suggested approach"; lessons section includes inline `shallow-by-design-per-DL-1` note per SC-4.2).
- `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` — MODIFY (frontmatter `status: deferred` → `closed`).

### CL-5 group (10 files swept + 1 backlog disposition) — DOWNSCOPED from iter1

**Iter2 change vs iter1: 11 → 10 files.** `gobbi/SKILL.md` removed from the sweep per H1 (empirically has no Path Conventions section and no `{session-id}` row; all 3 CCSI hits at lines 38 / 52 / 63 are in env-var passthrough tables and the runtime-health-gate Gate-1 prose — none of these are M2 codification surfaces; adding a Path Conventions section to this file is out of CL-5 scope per Iron Law 4).

The 10 files (alphabetical for traceability; heading style per file empirically grep-verified):

1. `.claude/skills/evaluation/SKILL.md` — `**Path conventions**` (bold, line 561)
2. `.claude/skills/execution/SKILL.md` — `**Path conventions**` (bold, line 252)
3. `.claude/skills/ideation/SKILL.md` — `**Path conventions**` (bold, line 462)
4. `.claude/skills/interview/SKILL.md` — `**Path conventions**` (bold, line 321)
5. `.claude/skills/memorization/SKILL.md` — `### Path conventions` (**H3**, line 228) ← new heading variant covered by extended awk
6. `.claude/skills/orchestration/workflow/evaluation.md` — `**Path conventions**` (bold, line 289)
7. `.claude/skills/planning/SKILL.md` — `**Path conventions**` (bold, line 459)
8. `.claude/skills/preparation/SKILL.md` — `**Path conventions**` (bold, line 392)
9. `.claude/skills/research/SKILL.md` — `**Path conventions**` (bold, line 142)
10. `.claude/skills/wrap-up/SKILL.md` — `**Path conventions**` (bold, line 381)

Plus 1 backlog disposition:

- `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` — MODIFY (per SC-6: frontmatter `status: addressed` + `disposition: addressed` + `closed_by: <merge SHA — set post-merge>`; append `## Resolution` section).

### CL-6 group (1 file edited + 1 staged file left in place)

- `.claude/skills/orchestration/SKILL.md` — MODIFY (Step 1 procedure table rows 5/5.5/6 + the "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote per DL-7 = Option B: promote row 5.5 to before row 5; inline-cite the qualified absolute-root rule pointing at `git/SKILL.md` § Memory Access Matrix (with the inline `**Critical rule — write paths**` reference) AND `d-2-qualified-git-rule.md`; reword LOCK #5 footnote so the skipped row is the new row 5, not the old row 5.5).
- `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md` — NO-OP (file already exists; left in place for Wrap-up's `gobbi mistake promote` post-session — see Idea SC-8.3).

**Coordination notes** (carried from Idea § Per-Deliverable table):
- `mistake/SKILL.md` is owned end-to-end by CL-3 (T03). CL-5 (T06) excludes it.
- `orchestration/SKILL.md` is owned end-to-end by CL-6 (T02). CL-5 (T06) excludes it; `orchestration/workflow/evaluation.md` (a sibling sub-document) IS in T06.
- `gobbi/SKILL.md` is now explicitly OUT-OF-SCOPE for Bundle C entirely (no task touches it). The env-health gate at line 52 referencing `$CLAUDE_CODE_SESSION_ID` is left as-is per Idea SC-5 anti-game clause + iter2 H1 confirmation that no Path Conventions surface exists in this file to M2-codify.
- Every backlog status flip listed above is authorized by the owning CL's may-touch row (per Idea D-8).

---

## Tasks

Numbered list. Each task uses the canonical YAML schema. **Implementation tasks run sequentially per the dependency graph in § Dependency table.**

**Verifies-block discipline (iter2 H3 fix)**: every `verifies` entry is a single self-contained shell command (or heredoc-style multi-line block) that **exits 0 on pass and non-zero on fail**. Thresholds are encoded via `test -eq` / `test -ge` / `|| exit 1` constructs — never as comments alone. English explanations live on `# comment` lines preceding the command, never appended to it.

```yaml
id: T01
cl-anchor: CL-1
what: |
  Backlog file `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md`
  closed inline with status flip + commit anchor + closure note citing the in-tree
  resolution at `.claude/hooks/session-start.sh:73-77`.
why: |
  Witness — Idea § Scope Contract → CL-1 (Idea lines 56-58) + DL-3 (decisions-summary
  line 19 — close inline) + commit `159eb21` (env-var-audit PR #265, merged 2026-05-22)
  already implements the Option A fix; Iron Law 8 requires the docs catch-up to ship.
  Preparation confirmed reachable + editable (preparation.md § CL-1).
traces-to:
  - "CK-1 (→ CL-1): Edit `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` frontmatter + append closure note. Anchored: I-2, DL-3." (Idea line 314)
  - "Idea SC-1 verification anchor" (Idea line 123)
requires: []
files:
  - path: .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md
    op: modify
files-may-touch:
  - .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md
files-must-not-touch:
  - .claude/hooks/session-start.sh                # witness, read-only
  - any other backlog file
  - .gobbi/projects/gobbi/skills/**               # not this CL
  - .claude/skills/**                             # not this CL
inputs: []
outputs:
  - bundle-c-cl-1-closure-committed
verifies:
  # SC-1.a: exactly one `status: closed` line in the backlog (the frontmatter row).
  - |
    n=$(grep -cE '^status: closed$' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md)
    test "$n" -eq 1 || { echo "FAIL: expected exactly 1 'status: closed' line, got $n"; exit 1; }
  # SC-1.b: exactly one `closed_by: 159eb21` line in the backlog (the frontmatter row).
  - |
    n=$(grep -cE '^closed_by: 159eb21' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md)
    test "$n" -eq 1 || { echo "FAIL: expected exactly 1 'closed_by: 159eb21' line, got $n"; exit 1; }
  # SC-1.c: closure-note citation present (at least 1 hit referencing session-start.sh lines 73-77).
  - |
    n=$(grep -cE 'session-start\.sh:73-77|session-start\.sh.*73-77' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md)
    test "$n" -ge 1 || { echo "FAIL: closure-note citation missing"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
estimated-loc: 3-5
eval-policy: dual-system (Claude + Codex) per execution.evaluate.mode = always
```

```yaml
id: T02
cl-anchor: CL-6
what: |
  `.claude/skills/orchestration/SKILL.md` Step 1 procedure table rows 5/5.5/6 +
  "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote rewritten per DL-7 = Option B:
  promote row 5.5 to before row 5 (new row 5 = worktree create; new row 5.5 =
  state.json init; new row 6 = session.json init). Each of the new rows 5, 5.5, and 6
  carries an inline citation to `git/SKILL.md` § Memory Access Matrix (the H2 at
  line 17; the inline `**Critical rule — write paths**` is at line 33 — cite the
  H2 anchor, not a non-existent `Memory Access Matrix Critical-Rule` anchor) AND
  to `d-2-qualified-git-rule.md`. LOCK #5 footnote reworded so the skipped row is
  the new row 5 (not the old row 5.5).
why: |
  Witness — staged mistake-candidate at `<sessionDir>/ideation/staging/decisions/session-dir-placed-outside-worktree.md`
  (confidence 95, severity medium) + DL-6 user lock (decisions-summary line 22) +
  DL-7 user lock (decisions-summary line 23 — Option B locked) + Idea § Decisions
  Log D-9 (Idea lines 360-369). Compounding witnesses: bundle-B `d-2-qualified-git-rule.md`
  + `d-4-per-iter-session-commit.md` (`git -C "$worktreePath" add` cannot see main-tree
  session memory). Preparation surfaced one citation-precision concern (preparation.md
  § CL-6 — the Idea cites "Memory Access Matrix Critical-Rule" with a hyphen; actual
  file has `## Memory Access Matrix` H2 at line 17 + inline `**Critical rule — write
  paths**:` at line 33). Executor cites the real anchor wording.
traces-to:
  - "CK-9 (→ CL-6): Edit `.claude/skills/orchestration/SKILL.md` Step 1 rows 5, 5.5, 6 + LOCK #5 footnote per DL-7 = Option B (user-locked 2026-05-24): promote 5.5 to before 5 (worktree-create first, then state.json init, then session.json init). Inline-cite `git/SKILL.md` § Memory Access Matrix Critical-Rule + `d-2-qualified-git-rule.md`. Leave staged mistake-candidate file in place for Wrap-up promotion." (Idea line 325)
  - "Idea SC-8.1 / SC-8.2 / SC-8.3 verification anchors" (Idea lines 158-161)
requires: [T01]
files:
  - path: .claude/skills/orchestration/SKILL.md
    op: modify
  - path: <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md
    op: no-op (left in place)
files-may-touch:
  - .claude/skills/orchestration/SKILL.md
  - <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md  # no-op
files-must-not-touch:
  - .claude/skills/git/SKILL.md                              # cited, not edited
  - .claude/skills/mistake/SKILL.md                          # T03 owns it
  - any of the 10 CL-5 sweep skills                          # T06 owns those
  - .claude/skills/gobbi/SKILL.md                            # explicitly out-of-scope per iter2 H1
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # T04 owns it
  - any session.json / settings.json / state.json file
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md  # locked historical memorial
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-2-qualified-git-rule.md  # locked historical memorial
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-4-per-iter-session-commit.md  # locked historical memorial
inputs: []
outputs:
  - bundle-c-cl-6-orchestration-fix-committed
verifies:
  # SC-8.1: within the Step 1 section of orchestration/SKILL.md, at least 2 hits
  # combining "git/SKILL.md ... Memory Access Matrix" OR "d-2-qualified-git-rule".
  # Rows 5, 5.5, 6 may share a single inline citation.
  - |
    awk '/^## Step 1 |^### Step 1 /,/^## Step 2 |^### Step 2 /' .claude/skills/orchestration/SKILL.md > /tmp/sc8-step1.txt
    n=$(grep -cE 'git/SKILL\.md.*Memory Access Matrix|d-2-qualified-git-rule' /tmp/sc8-step1.txt)
    test "$n" -ge 2 || { echo "FAIL SC-8.1: expected >= 2 citation hits in Step 1, got $n"; exit 1; }
  # SC-8.2: no Option A / Option C language (`mv ... state.json` / `tmp/.../state.json`)
  # in Step 1; Option B locked.
  - |
    awk '/^## Step 1 |^### Step 1 /,/^## Step 2 |^### Step 2 /' .claude/skills/orchestration/SKILL.md > /tmp/sc8-step1.txt
    n=$(grep -cE 'mv .*state\.json|tmp/.*state\.json' /tmp/sc8-step1.txt)
    test "$n" -eq 0 || { echo "FAIL SC-8.2: expected 0 Option-A/C-language hits, got $n"; exit 1; }
  # SC-8.3: staged mistake-candidate file remains in place at session-end (no deletion by CL-6).
  - |
    test -f "<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md" || { echo "FAIL SC-8.3: staged mistake-candidate file missing"; exit 1; }
  # Citation precision (per preparation.md § CL-6 P-3): the non-existent hyphenated
  # `Memory Access Matrix Critical-Rule` anchor must NOT appear.
  - |
    n=$(grep -cE 'Memory Access Matrix.?Critical-Rule|Critical-Rule.*Memory Access Matrix' .claude/skills/orchestration/SKILL.md)
    test "$n" -eq 0 || { echo "FAIL: non-existent hyphenated anchor cited, got $n"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
  - claude    # docs-authoring discipline for .claude/skills/* surface
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
  - <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md  # the witness itself
estimated-loc: 40-80
eval-policy: dual-system (Claude + Codex)
```

```yaml
id: T03
cl-anchor: CL-3
what: |
  `.claude/skills/mistake/SKILL.md` consolidated two-edit pass + watchlist backlog
  status clarifier. Two edits applied in ONE executor task, ONE file open, ONE commit
  per D-7 revised: (a) add `hooks` to the domain-tag examples list at line 63 and
  line 90 (P1 step 3 + P3 step 5 — both are "examples" surfaces; both updated for
  consistency per preparation.md § Out-of-scope gaps); (b) rewrite the
  `{session-id}` Path Conventions row at line 129 to canonical M2 wording.
  Plus update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md`
  frontmatter status to clarify perpetual-capture-reminder + N≥2 skill-extraction
  trigger.
why: |
  Witnesses — (a) `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md`
  § "Suggested approach" tail bullet for the domain-tag edit, plus (b) DL-4 + DL-5 +
  Idea I-3 for the `{session-id}` row edit. D-7 revised (Idea lines 349-352) is the
  controlling decision: CL-3 is the sole owner of `mistake/SKILL.md` edits in this
  bundle.
traces-to:
  - "CK-4 (→ CL-3 edit 1): Edit `.claude/skills/mistake/SKILL.md` to add `hooks` to the documented domain-tag examples list. Anchored: iter1 DL-3 + backlog § \"Suggested approach\" tail bullet." (Idea line 318)
  - "CK-4.5 (→ CL-3 edit 2, NEW per D-7 revised): In the SAME executor task as CK-4, edit `.claude/skills/mistake/SKILL.md` line 129 (`{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`) to the canonical M2 wording per CL-5 § Wording is locked at Ideation. Both edits are committed together." (Idea line 319)
  - "CK-5 (→ CL-3 backlog clarifier): Update `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` status field." (Idea line 320)
  - "Idea SC-3.1 / SC-3.2 verification anchors" (Idea lines 130-133)
requires: [T01, T02]
files:
  - path: .claude/skills/mistake/SKILL.md
    op: modify
  - path: .gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md
    op: modify
files-may-touch:
  - .claude/skills/mistake/SKILL.md
  - .gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md
files-must-not-touch:
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # T04
  - any of the 10 CL-5 sweep skills                              # T06
  - .claude/skills/orchestration/SKILL.md                        # T02
  - .claude/skills/gobbi/SKILL.md                                # out-of-scope per iter2 H1
  - any other backlog file
inputs:
  - bundle-c-cl-6-orchestration-fix-committed   # informational dep — T03 reads no T02 output, ordering only
outputs:
  - bundle-c-cl-3-mistake-skill-and-backlog-committed
  - bundle-c-canonical-m2-wording-on-mistake-skill   # T06 mirrors this string across 10 files
verifies:
  # SC-3.1.a: `hooks` appears in mistake/SKILL.md (at least 1 hit; intended both
  # domain-tag example surfaces near lines 63 + 90).
  - |
    n=$(grep -cE '\bhooks\b' .claude/skills/mistake/SKILL.md)
    test "$n" -ge 1 || { echo "FAIL SC-3.1.a: 'hooks' not found in mistake/SKILL.md"; exit 1; }
  # SC-3.1.b: hooks-domain-mistakes-watchlist clarifier text present (at least 1 hit).
  - |
    n=$(grep -cE 'perpetual.capture.reminder|N>=2|N≥2|extraction trigger' .gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md)
    test "$n" -ge 1 || { echo "FAIL SC-3.1.b: watchlist clarifier text missing"; exit 1; }
  # SC-3.2: M2 row rewritten on mistake/SKILL.md. Bounded awk on Path Conventions
  # block — heading is `**Path conventions**` (bold) at mistake/SKILL.md line 126.
  # Extended awk start pattern (iter2 H1) covers bold + H2 + H3 variants.
  - |
    awk '/^\*\*Path conventions\*\*|^\*\*Path Conventions\*\*|^## Path conventions|^## Path Conventions|^### Path conventions|^### Path Conventions/,/^\*\*[^P]|^## |^### [^P]/' .claude/skills/mistake/SKILL.md > /tmp/sc3-pcblock.txt
    n1=$(grep -cE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/sc3-pcblock.txt)
    test "$n1" -ge 1 || { echo "FAIL SC-3.2: M2-clause-1 (delegation prompt) missing in Path conventions block"; exit 1; }
    n2=$(grep -cE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/sc3-pcblock.txt)
    test "$n2" -ge 1 || { echo "FAIL SC-3.2: M2-clause-2 (do NOT read CCSI) missing in Path conventions block"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
  - claude    # docs-authoring discipline
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
estimated-loc: 8-15
eval-policy: dual-system (Claude + Codex)
```

```yaml
id: T04
cl-anchor: CL-2
what: |
  `gobbi-hook-authoring` project skill authored M2-compliant from creation and
  promoted to develop-shipping path. One executor task that performs three
  coordinated actions: (a) author the canonical SKILL.md body at the session-staged
  path using `interview/templates/project-skill.md`, (b) promote to the
  develop-shipping path `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`
  (file content identical to staged), (c) flip backlog
  `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` frontmatter
  `status: deferred` → `status: closed`. The skill's Path Conventions section (if
  present) MUST NOT cite `$CLAUDE_CODE_SESSION_ID` for the `{session-id}` value —
  it must use the canonical M2 wording from creation (SC-2.2); if no Path
  Conventions section is included, `$CLAUDE_CODE_SESSION_ID` MUST NOT appear
  anywhere in the file (SC-2.2 degraded check). Both hook witnesses
  (`session-start.sh` 79 lines + `post-tool-use-agents.sh` 251 lines) MUST be
  cited by path in the skill body (SC-2.3).
why: |
  Witnesses — N=2 in-tree hooks on develop (Idea I-1) + this-session exercise
  witness (every Agent/Task spawn this session fires `post-tool-use-agents.sh` via
  the PostToolUse|PostToolUseFailure matcher with the `Task|Agent` filter; SC-2.3
  verifies via `jq '.agents | length' session.json` non-zero post-Wrap-up). Template
  at `.claude/skills/interview/templates/project-skill.md` (92 lines, readable).
  Preparation confirmed all preconditions PASS (preparation.md § CL-2).
traces-to:
  - "CK-2 (→ CL-2 stage): Stamp `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../preparation/staging/skills/gobbi-hook-authoring/SKILL.md` using `interview/templates/project-skill.md`. NEW for iter3 (per S3-001): author the Path Conventions section (or skip if not present) using M2 wording." (Idea line 315)
  - "CK-3 (→ CL-2 promote): Promote staged skill to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` via `preparation/SKILL.md` narrow-exception." (Idea line 316)
  - "CK-3.5 (→ CL-2 backlog flip): Update `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` status `deferred` → `closed`." (Idea line 317)
  - "Idea SC-2.1 / SC-2.2 / SC-2.3 verification anchors" (Idea lines 125-128)
requires: [T03]
files:
  - path: <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md
    op: create
  - path: .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md
    op: create
  - path: .gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md
    op: modify
files-may-touch:
  - <worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md
  - .gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md
files-must-not-touch:
  - .claude/skills/mistake/SKILL.md                   # T03
  - any of the 10 CL-5 sweep skills                    # T06
  - .claude/skills/orchestration/SKILL.md              # T02
  - .claude/skills/gobbi/SKILL.md                      # out-of-scope per iter2 H1
  - .claude/hooks/**                                   # witnesses, read-only
  - .claude/skills/interview/templates/project-skill.md  # template, read-only
inputs:
  - bundle-c-cl-3-mistake-skill-and-backlog-committed
outputs:
  - bundle-c-cl-2-gobbi-hook-authoring-skill-shipped
verifies:
  # SC-2.1.a: skill file exists at promoted path.
  - |
    test -f .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md || { echo "FAIL SC-2.1.a: promoted skill file missing"; exit 1; }
  # SC-2.1.b: frontmatter name field present.
  - |
    n=$(grep -cE '^name: gobbi-hook-authoring' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md)
    test "$n" -ge 1 || { echo "FAIL SC-2.1.b: frontmatter name field missing"; exit 1; }
  # SC-2.1.c: at least 4 of the canonical section H2s present (Core Principles /
  # Procedures / Constraints / Output paths).
  - |
    n=$(grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md)
    test "$n" -ge 4 || { echo "FAIL SC-2.1.c: expected >=4 canonical section H2s, got $n"; exit 1; }
  # SC-2.2: Path conventions block check. Extended awk start pattern (iter2 H1)
  # covers bold + H2 + H3 heading variants. If block exists, both M2 clauses
  # must be present; if block is empty (file has no Path conventions section),
  # CCSI must not appear anywhere in the file.
  - |
    awk '/^\*\*Path conventions\*\*|^\*\*Path Conventions\*\*|^## Path conventions|^## Path Conventions|^### Path conventions|^### Path Conventions/,/^\*\*[^P]|^## |^### [^P]/' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md > /tmp/sc22-pcblock.txt
    if test -s /tmp/sc22-pcblock.txt; then
      n1=$(grep -cE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/sc22-pcblock.txt)
      test "$n1" -ge 1 || { echo "FAIL SC-2.2: Path conventions present but M2-clause-1 missing"; exit 1; }
      n2=$(grep -cE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/sc22-pcblock.txt)
      test "$n2" -ge 1 || { echo "FAIL SC-2.2: Path conventions present but M2-clause-2 missing"; exit 1; }
    else
      n=$(grep -cE '\$CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md)
      test "$n" -eq 0 || { echo "FAIL SC-2.2 (degraded): no Path conventions block but CCSI mentioned $n times"; exit 1; }
    fi
  # SC-2.3.a: both hook witnesses cited by path.
  - |
    n=$(grep -cE 'session-start\.sh|post-tool-use-agents\.sh' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md)
    test "$n" -ge 2 || { echo "FAIL SC-2.3.a: expected >=2 hook-witness citations, got $n"; exit 1; }
  # SC-2.3.b: exercise witness — session.json agents[] is non-empty post-Wrap-up.
  - |
    len=$(jq '.agents | length' "<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/session.json")
    test "$len" -ge 1 || { echo "FAIL SC-2.3.b: expected session.json agents[] non-empty, got length $len"; exit 1; }
  # Backlog flip: exactly 1 `status: closed` line.
  - |
    n=$(grep -cE '^status: closed$' .gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md)
    test "$n" -eq 1 || { echo "FAIL: expected exactly 1 'status: closed' line on backlog, got $n"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
  - claude    # skill-authoring docs discipline (.claude/skills/* + .gobbi/.../skills/*)
  - interview # for project-skill.md template + N=2 witness extraction discipline
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
  - .gobbi/projects/gobbi/mistakes/symlink-restore-depth-wrong.md      # claude/skills create + symlink discipline
  - .gobbi/projects/gobbi/mistakes/edit-tool-refuses-symlink-paths.md  # editing inside the workspace-mirrored skill tree
estimated-loc: 150-220
eval-policy: dual-system (Claude + Codex)
```

```yaml
id: T05
cl-anchor: CL-4
what: |
  `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` authored
  using `memorization/templates/design.md`, conforming to the backlog § "Suggested
  approach" 5-section shape (Problem / Approach / Surfaces / Validation /
  Lessons-learned-after-N=2). Lessons section is non-empty AND includes an inline
  one-sentence shallow-by-design note: "Lessons section is intentionally sparse
  as of 2026-05-24 — authored before Wrap-up ran per Bundle C DL-1 (β-1). Deepen
  after subsequent worktree-pr sessions per R-7." Plus flip backlog
  `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md`
  frontmatter `status: deferred` → `status: closed`.
why: |
  Witness — backlog § "When to pick up" trigger ("After T1 ships AND N=2 sessions
  have exercised the worktree-first pattern end-to-end"). T1 shipped at `dfb7d6d`;
  DL-1 user-locked β-1 (this session self-counts as N=2; shallow-lessons trade-off
  accepted). SC-4.2 enforces the inline rationale per Claude R5-001 + Codex P6-F2.
  Preparation confirmed template + target dir + backlog editable
  (preparation.md § CL-4).
traces-to:
  - "CK-6 (→ CL-4): Write `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` using `memorization/templates/design.md`, per backlog § \"Suggested approach\". NEW for iter3 (per R5-001): include inline shallow-by-design note in lessons section." (Idea line 321)
  - "CK-6.5 (→ CL-4 backlog flip): Update `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` status `deferred` → `closed`." (Idea line 322)
  - "Idea SC-4.1 / SC-4.2 verification anchors" (Idea lines 135-137)
requires: [T04]
files:
  - path: .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md
    op: create
  - path: .gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md
    op: modify
files-may-touch:
  - .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md
  - .gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md
files-must-not-touch:
  - any session.json file
  - any backlog file other than the design-doc backlog above
  - any of the 10 CL-5 sweep skills            # T06
  - .claude/skills/orchestration/SKILL.md       # T02
  - .claude/skills/mistake/SKILL.md             # T03
  - .claude/skills/gobbi/SKILL.md               # out-of-scope per iter2 H1
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # T04
inputs:
  - bundle-c-cl-2-gobbi-hook-authoring-skill-shipped
outputs:
  - bundle-c-cl-4-design-doc-shipped
verifies:
  # SC-4.1.a: design file exists.
  - |
    test -f .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md || { echo "FAIL SC-4.1.a: design file missing"; exit 1; }
  # SC-4.1.b: 5 of the canonical section H2s present (Problem / Approach /
  # Surfaces / Validation / Lessons; counts >=5 to allow template-named variants
  # all matching the same H2 prefix set).
  - |
    n=$(grep -cE '^## (Problem|Approach|Surfaces|Validation|Lessons)' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md)
    test "$n" -ge 5 || { echo "FAIL SC-4.1.b: expected >=5 canonical sections, got $n"; exit 1; }
  # SC-4.1.c: Lessons section body is non-trivial — > 100 bytes between the
  # `## Lessons*` heading and the next H2 / EOF.
  - |
    bytes=$(awk '/^## Lessons/{flag=1; next} /^## /{flag=0} flag{print}' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md | wc -c)
    test "$bytes" -gt 100 || { echo "FAIL SC-4.1.c: Lessons section body $bytes bytes (need > 100)"; exit 1; }
  # SC-4.2: inline shallow-by-design rationale present (at least 1 hit).
  - |
    n=$(grep -cE 'shallow-by-design-per-DL-1|intentionally sparse|authored before Wrap-up' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md)
    test "$n" -ge 1 || { echo "FAIL SC-4.2: shallow-by-design rationale missing"; exit 1; }
  # Backlog flip: exactly 1 `status: closed` line.
  - |
    n=$(grep -cE '^status: closed$' .gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md)
    test "$n" -eq 1 || { echo "FAIL: expected exactly 1 'status: closed' line on backlog, got $n"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
  - claude    # docs-authoring discipline
  - memorization  # design.md template
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
estimated-loc: 200-300
eval-policy: dual-system (Claude + Codex)
```

```yaml
id: T06
cl-anchor: CL-5
what: |
  Single-sweep task that applies the canonical M2 wording to the `{session-id}`
  Path Conventions row across **10 skill files** (iter2: was 11; `gobbi/SKILL.md`
  removed per iter2 H1 — empirically has no Path Conventions section, no
  `{session-id}` row, and is therefore not an M2-codification surface; CCSI hits
  on lines 38 / 52 / 63 are env-var-passthrough table cells + the Gate-1 runtime
  health-check prose, intentionally retained as-is per Idea SC-5 anti-game clause).
  `mistake/SKILL.md` also excluded per D-7 revised (CL-3 / T03 already updated it).
  Plus a single backlog disposition update on
  `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` per SC-6.

  The 10 files (exact paths, in sweep order — alphabetical for traceability):
    1. .claude/skills/evaluation/SKILL.md                    # **Path conventions** (bold)
    2. .claude/skills/execution/SKILL.md                     # **Path conventions** (bold)
    3. .claude/skills/ideation/SKILL.md                      # **Path conventions** (bold)
    4. .claude/skills/interview/SKILL.md                     # **Path conventions** (bold)
    5. .claude/skills/memorization/SKILL.md                  # ### Path conventions (H3) — iter2 awk extension
    6. .claude/skills/orchestration/workflow/evaluation.md   # **Path conventions** (bold)
    7. .claude/skills/planning/SKILL.md                      # **Path conventions** (bold)
    8. .claude/skills/preparation/SKILL.md                   # **Path conventions** (bold)
    9. .claude/skills/research/SKILL.md                      # **Path conventions** (bold)
    10. .claude/skills/wrap-up/SKILL.md                      # **Path conventions** (bold)

  The canonical M2 replacement string for the `{session-id}` row (locked at
  Ideation; Preparation polish allowed within bounds — see SC-5 reference-wording
  spot check):
    > "`{session-id}` — Claude Code session ID supplied by the delegation prompt's
    > `session-id:` header field (the parent session's id). Do NOT read
    > `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that
    > env-var holds the subagent's own UUID, not the parent session's."

  Per-file verification (SC-5 per-file bounded awk + grep with extended start
  pattern covering H3 + H2 + bold heading variants). After applying the sweep,
  also update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
  per SC-6 canonical spec: frontmatter `status: addressed` AND `disposition:
  addressed`; append `## Resolution` section citing the 10-skill sweep + the
  `mistake/SKILL.md` consolidated edit (T03) + DL-5 M2 codification + M1/M3 not
  chosen + iter2 H1 downscoping note. `closed_by: <Bundle C merge commit SHA>`
  field added once the PR merges (post-task verification; not part of this
  task's exit gate).
why: |
  Witnesses — `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
  § "Candidate mitigations" M2 verbatim + DL-4 (absorb into Bundle C) + DL-5 (M2
  only; M1/M3 explicitly NOT chosen) + iter2 H1 empirical confirmation that 10 of
  11 originally-listed files have a Path Conventions block with a `{session-id}`
  row, and 1 (`gobbi/SKILL.md`) does not.
  D-7 revised confirms the file list excludes `mistake/SKILL.md` (CL-3).
traces-to:
  - "CK-7 (→ CL-5 docs sweep): For each of the **10** affected skill files (was 11 in iter1, was 12 in iter2-pre-Idea; minus `mistake/SKILL.md` per D-7 revised; minus `gobbi/SKILL.md` per iter2 H1 — see DR-9), update the `{session-id}` Path Conventions row to the canonical M2 wording per CL-5 § Wording is locked at Ideation. Each file edit is verified by SC-5's per-file bounded grep with extended awk start pattern." (Idea line 323, adjusted)
  - "CK-8 (→ CL-5 backlog update): Update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` per SC-6 canonical spec (both `status:` and `disposition:` to `addressed`, append `## Resolution` section)." (Idea line 324)
  - "Idea SC-5 / SC-6 verification anchors" (Idea lines 139-154)
requires: [T05]
files:
  - path: .claude/skills/evaluation/SKILL.md
    op: modify
  - path: .claude/skills/execution/SKILL.md
    op: modify
  - path: .claude/skills/ideation/SKILL.md
    op: modify
  - path: .claude/skills/interview/SKILL.md
    op: modify
  - path: .claude/skills/memorization/SKILL.md
    op: modify
  - path: .claude/skills/orchestration/workflow/evaluation.md
    op: modify
  - path: .claude/skills/planning/SKILL.md
    op: modify
  - path: .claude/skills/preparation/SKILL.md
    op: modify
  - path: .claude/skills/research/SKILL.md
    op: modify
  - path: .claude/skills/wrap-up/SKILL.md
    op: modify
  - path: .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
    op: modify
files-may-touch:
  - .claude/skills/evaluation/SKILL.md
  - .claude/skills/execution/SKILL.md
  - .claude/skills/ideation/SKILL.md
  - .claude/skills/interview/SKILL.md
  - .claude/skills/memorization/SKILL.md
  - .claude/skills/orchestration/workflow/evaluation.md
  - .claude/skills/planning/SKILL.md
  - .claude/skills/preparation/SKILL.md
  - .claude/skills/research/SKILL.md
  - .claude/skills/wrap-up/SKILL.md
  - .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
files-must-not-touch:
  - .claude/skills/mistake/SKILL.md             # T03 owns it; D-7 revised
  - .claude/skills/gobbi/SKILL.md               # explicitly OUT-OF-SCOPE per iter2 H1; no Path Conventions section, not an M2 surface
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md   # T04 owns it
  - .claude/skills/orchestration/SKILL.md       # T02 owns it
  - .claude/skills/git/SKILL.md                 # out of bundle (Iron Law 4)
  - .claude/skills/delegation/SKILL.md          # out of bundle (Iron Law 4)
  - .claude/skills/codex/SKILL.md               # out of bundle
  - .claude/skills/discussion/SKILL.md          # out of bundle
  - any other skill file outside the 10-list
  - any other backlog file
inputs:
  - bundle-c-canonical-m2-wording-on-mistake-skill   # T03's mistake/SKILL.md M2 row is the reference string
  - bundle-c-cl-4-design-doc-shipped
outputs:
  - bundle-c-cl-5-m2-sweep-and-backlog-committed
verifies:
  # SC-5 (per-file bounded check) — for each of the 10 files, both M2 clauses
  # must appear within the Path Conventions block. Loop uses a portable
  # positional-arg array (`set --`) declared inside the verify entry; safe under
  # bash AND zsh (iter2 H2 fix). awk start pattern is extended to cover bold +
  # H2 + H3 heading variants (iter2 H1 fix).
  - |
    set -- \
      .claude/skills/evaluation/SKILL.md \
      .claude/skills/execution/SKILL.md \
      .claude/skills/ideation/SKILL.md \
      .claude/skills/interview/SKILL.md \
      .claude/skills/memorization/SKILL.md \
      .claude/skills/orchestration/workflow/evaluation.md \
      .claude/skills/planning/SKILL.md \
      .claude/skills/preparation/SKILL.md \
      .claude/skills/research/SKILL.md \
      .claude/skills/wrap-up/SKILL.md
    fail=0
    for F in "$@"; do
      awk '/^\*\*Path conventions\*\*|^\*\*Path Conventions\*\*|^## Path conventions|^## Path Conventions|^### Path conventions|^### Path Conventions/,/^\*\*[^P]|^## |^### [^P]/' "$F" > /tmp/sc5-pcblock.txt
      if ! test -s /tmp/sc5-pcblock.txt; then
        echo "FAIL SC-5: Path conventions block not found in $F"
        fail=1
        continue
      fi
      if ! grep -qE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/sc5-pcblock.txt; then
        echo "FAIL SC-5: M2-clause-1 (delegation prompt) missing in $F"
        fail=1
      fi
      if ! grep -qE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/sc5-pcblock.txt; then
        echo "FAIL SC-5: M2-clause-2 (do NOT read CCSI) missing in $F"
        fail=1
      fi
    done
    test "$fail" -eq 0 || exit 1
  # SC-5 reference-wording spot check — wrap-up/SKILL.md is the canonical
  # reference; at least 7 of 10 files must exactly match the M2-clause-1 +
  # M2-clause-2 substrings extracted from wrap-up. Allows minor sentence-flow
  # polish on up to 3 files (iter2 H1 adjusted from 4 in iter1 since list
  # dropped from 11 to 10 — preserves the "exact-match on ~70%" intent).
  # File list re-declared in this entry (iter2 H2 — no cross-entry $FILES dep).
  - |
    set -- \
      .claude/skills/evaluation/SKILL.md \
      .claude/skills/execution/SKILL.md \
      .claude/skills/ideation/SKILL.md \
      .claude/skills/interview/SKILL.md \
      .claude/skills/memorization/SKILL.md \
      .claude/skills/orchestration/workflow/evaluation.md \
      .claude/skills/planning/SKILL.md \
      .claude/skills/preparation/SKILL.md \
      .claude/skills/research/SKILL.md \
      .claude/skills/wrap-up/SKILL.md
    awk '/^\*\*Path conventions\*\*|^\*\*Path Conventions\*\*|^## Path conventions|^## Path Conventions|^### Path conventions|^### Path Conventions/,/^\*\*[^P]|^## |^### [^P]/' .claude/skills/wrap-up/SKILL.md > /tmp/sc5-wrapup.txt
    ref1=$(grep -oE 'delegation prompt[^.]*session-id[^.]*' /tmp/sc5-wrapup.txt | head -1)
    ref2=$(grep -oE 'do NOT read [^.]*CLAUDE_CODE_SESSION_ID[^.]*' /tmp/sc5-wrapup.txt | head -1)
    test -n "$ref1" || { echo "FAIL SC-5-spotcheck: reference clause 1 not extractable from wrap-up/SKILL.md"; exit 1; }
    test -n "$ref2" || { echo "FAIL SC-5-spotcheck: reference clause 2 not extractable from wrap-up/SKILL.md"; exit 1; }
    matches=0
    for F in "$@"; do
      awk '/^\*\*Path conventions\*\*|^\*\*Path Conventions\*\*|^## Path conventions|^## Path Conventions|^### Path conventions|^### Path Conventions/,/^\*\*[^P]|^## |^### [^P]/' "$F" > /tmp/sc5-pcblock.txt
      if grep -qF "$ref1" /tmp/sc5-pcblock.txt && grep -qF "$ref2" /tmp/sc5-pcblock.txt; then
        matches=$((matches+1))
      fi
    done
    test "$matches" -ge 7 || { echo "FAIL SC-5-spotcheck: $matches of 10 exact-matches (need >= 7)"; exit 1; }
  # SC-5 anti-game (Iron Law 11): `gobbi/SKILL.md` is OUT-OF-SCOPE per iter2 H1.
  # Confirm its CCSI references remain intact (lines 38 / 52 / 63 — env-var
  # passthrough + Gate-1 runtime health-check). Floor: at least 3 hits remain.
  - |
    n=$(grep -cE '\$CLAUDE_CODE_SESSION_ID|`CLAUDE_CODE_SESSION_ID`' .claude/skills/gobbi/SKILL.md)
    test "$n" -ge 3 || { echo "FAIL SC-5 anti-game: gobbi/SKILL.md CCSI hits $n (need >= 3)"; exit 1; }
  # SC-6.a: f-risk-01 backlog `status: addressed`.
  - |
    n=$(grep -cE '^status: addressed' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md)
    test "$n" -ge 1 || { echo "FAIL SC-6.a: status: addressed missing"; exit 1; }
  # SC-6.b: f-risk-01 backlog `disposition: addressed`.
  - |
    n=$(grep -cE '^disposition: addressed' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md)
    test "$n" -ge 1 || { echo "FAIL SC-6.b: disposition: addressed missing"; exit 1; }
  # SC-6.c: f-risk-01 backlog has `## Resolution` section.
  - |
    n=$(grep -cE '^## Resolution' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md)
    test "$n" -ge 1 || { echo "FAIL SC-6.c: ## Resolution section missing"; exit 1; }
agent-type: executor
model: sonnet
required-skills:
  - principles
  - mistake
  - execution
  - claude    # docs-authoring discipline across .claude/skills/*
required-mistakes:
  - .gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md  # CL-5 sweep span is the exact context-overflow trigger Bundle B hit
  - .gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - .gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md
estimated-loc: 110-160 (10 × ~10-15 LoC per file + Resolution section on backlog) — iter2 trimmed from 130-180 in iter1 (one file removed)
eval-policy: dual-system (Claude + Codex)
```

---

## Dependency table

Sub-step C Table 1. Tasks are sequenced; each row's `Depends on` is the immediate predecessor. No cycles. File-touched sets are pairwise disjoint at the path level.

| Task | Depends on | Blocks | Files touched (counts) |
|---|---|---|---|
| T01 (CL-1) | — | T02 | 1 backlog file |
| T02 (CL-6) | T01 | T03 | 1 skill file (`orchestration/SKILL.md`) + 1 no-op staged mistake-candidate |
| T03 (CL-3) | T01, T02 | T04 | 1 skill file (`mistake/SKILL.md`) + 1 backlog file |
| T04 (CL-2) | T03 | T05 | 1 staged session-skill (worktree-internal) + 1 promoted skill file + 1 backlog file |
| T05 (CL-4) | T04 | T06 | 1 new design doc + 1 backlog file |
| T06 (CL-5) | T05 | — | **10** skill files (iter2: was 11) + 1 backlog file |

**File-overlap audit (zero conflicts)**:
- `mistake/SKILL.md`: T03 only. T06 explicitly excludes per D-7 revised.
- `orchestration/SKILL.md`: T02 only. T06 excludes; `orchestration/workflow/evaluation.md` (sub-doc) is in T06 but is a different file.
- `gobbi/SKILL.md`: **no task touches it** (iter2 H1 — explicit OUT-OF-SCOPE). It is in every other task's `files-must-not-touch` denylist for belt-and-braces enforcement.
- `gobbi-hook-authoring/SKILL.md`: T04 only (creates the file).
- Each of the 10 CL-5 sweep files: T06 only.
- Each of the 5 backlog files affected: owned by exactly one of T01/T03/T04/T05/T06 per Idea D-8.

Zero cross-task file-touch conflicts. No conflict flags raised.

---

## Parallel lanes

Sub-step C Table 2. Per `planning/SKILL.md` § Sub-step C step 4, lane metadata is documentation only; Execution runs **sequentially** (one task at a time). For audit completeness:

| Lane | Tasks | Order |
|---|---|---|
| L1 (small backlog flips + single-file edits) | T01 → T02 → T03 | sequential |
| L2 (new files + medium edits) | T04 → T05 | sequential |
| L3 (10-file sweep) | T06 | sequential |

**Theoretical parallelism**: T01..T05 touch disjoint file sets and could in principle parallelize, but per the project rules + bundle-B's `manager-context-overflow-with-large-bundle` mistake (≥8 plan tasks risk overflow; 6 sequential tasks at the bundle-C scale are within budget), the Plan instructs Execution to run them sequentially. No parallelism committed; manager runs T01 → T02 → T03 → T04 → T05 → T06.

**Conflict flags**: **none.**

---

## Agent assignments

Sub-step D. Every task is `agent-type: executor`, `model: sonnet` (delegation default). Per-task required skills + required mistakes captured in each task spec above.

| Task | Agent | Model | Required skills | Required mistakes |
|---|---|---|---|---|
| T01 | executor | sonnet (default) | principles, mistake, execution | manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence |
| T02 | executor | sonnet | principles, mistake, execution, claude | manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence, session-dir-placed-outside-worktree (the witness) |
| T03 | executor | sonnet | principles, mistake, execution, claude | manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence |
| T04 | executor | sonnet | principles, mistake, execution, claude, interview | manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence, symlink-restore-depth-wrong, edit-tool-refuses-symlink-paths |
| T05 | executor | sonnet | principles, mistake, execution, claude, memorization | manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence |
| T06 | executor | sonnet | principles, mistake, execution, claude | manager-context-overflow-with-large-bundle, manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck, leader-iter2-verification-claim-without-evidence |

**Non-default justifications**: zero. All tasks use the executor default (sonnet). No leader or assistant role; no model override.

**Evaluation policy** (per `settings.json` `execution.evaluate.mode: always`): every task runs dual-system EVAL (Claude + Codex) at its Execution EVALUATION sub-phase. Single-system fallback per Bundle B's manager-context-overflow mistake is reserved for *iter2 surgical fixes* (matcher rename, footnote insertion); each task's iter1 EVAL is dual-system.

---

## Self-review report

Sub-step E findings against this iter2 draft.

### Spec coverage check

Every Ideation Implementation Checklist item (CK-1..CK-10) maps to exactly one task; CK-7 scope is now sharper (10 files, not 11). CK-10 is the bundle-wide PR-description discipline (Iron Law 10) and is captured in § Bundle-wide Acceptance Criteria below — not as a standalone executor task because authoring the PR description is not an Execution implementation artifact.

| CK | Task | Notes |
|---|---|---|
| CK-1 | T01 | ✓ |
| CK-2 | T04 | session-staged half of CL-2 |
| CK-3 | T04 | promoted half of CL-2 (same task) |
| CK-3.5 | T04 | backlog flip half of CL-2 (same task) |
| CK-4 | T03 | mistake/SKILL.md edit 1 |
| CK-4.5 | T03 | mistake/SKILL.md edit 2 (same task per D-7 revised) |
| CK-5 | T03 | hooks-watchlist backlog clarifier |
| CK-6 | T05 | design doc body |
| CK-6.5 | T05 | backlog flip |
| CK-7 | T06 | **10-file** M2 sweep (iter2 H1: was 11; `gobbi/SKILL.md` empirically excluded — DR-9 below) |
| CK-8 | T06 | f-risk-01 backlog disposition |
| CK-9 | T02 | ✓ |
| CK-10 | (bundle-wide) | § Bundle-wide Acceptance Criteria — Iron Law 10 PR description |

**Coverage**: 12 of 12 Idea CKs mapped (CK-10 captured as bundle-wide criterion, not a task). Every task anchors to a checklist item AND has a witness from Idea § Witnesses / SC anchors. CK-7's scope adjustment (11→10) is captured in DR-9 and does not break the anchor — the canonical CK-7 text says "each of the **N** affected skill files"; N is empirically determined here at 10.

### Placeholder scan

`grep -nE 'TBD|TODO|to be defined|<\.\.\.>|XXX|FIXME'` against this iter2 draft: **0 hits**. The only `<...>` shapes are `<worktreePath>` / `<sessionDir>` / `<Bundle C merge commit SHA>` macros (documented session-path conventions per `planning/SKILL.md` § Path conventions and `<Bundle C merge commit SHA>` is a known post-merge value) — these are NOT placeholder anti-patterns; they are intentional variables filled at execution time per the canonical schema.

### Type / name consistency

- `output` of T03 = `bundle-c-canonical-m2-wording-on-mistake-skill` → consumed as `input` of T06. ✓
- `output` of T04 = `bundle-c-cl-2-gobbi-hook-authoring-skill-shipped` → consumed as `input` of T05. ✓
- File path `.claude/skills/orchestration/workflow/evaluation.md` referenced consistently across T06's files; in T01/T02/T03/T04/T05 must-not-touch lists it is implicitly covered by "any of the 10 CL-5 sweep skills". ✓
- File path `.claude/skills/orchestration/SKILL.md` (parent skill, T02 owns) vs `.claude/skills/orchestration/workflow/evaluation.md` (sub-document, T06 owns) — distinct paths; both consistently referenced. ✓
- File path `.claude/skills/mistake/SKILL.md` referenced consistently with the bolded sub-heading `**Path conventions**` (per preparation.md § CL-3, empirically confirmed at line 126). The SC-3.2 awk range covers both forms. ✓
- File path `.claude/skills/gobbi/SKILL.md` referenced consistently as OUT-OF-SCOPE — listed in `files-must-not-touch` for T02/T03/T04/T05/T06; not in any `files-may-touch`. ✓ (iter2 H1)
- All 10 CL-5 sweep file paths match the empirically-grep-verified `**Path conventions**` (9 files) + `### Path conventions` (1 file: `memorization/SKILL.md` at line 228) headings (iter2 H1 verification). ✓
- Task IDs T01..T06 used consistently across § Dependency table, § Parallel lanes, § Agent assignments, § Spec coverage table. ✓
- "10" / "10-file" / "10-list" referenced consistently across § File map CL-5 group, § Dependency table T06 row, § Bundle-wide Acceptance Criteria, T06 task spec § what, traces-to, files, files-must-not-touch, verifies (both array declarations), outputs metadata. iter1's "11" appears only in DR-9 historical context and § REVISE delta. ✓

**Findings**: zero.

### Cross-check vs Preparation's deferred items

Preparation surfaced two minor concerns plus one factual error (corrected here):
- CL-6 citation precision → T02's `verifies` block includes a negative grep that fails if the executor cites the non-existent `Memory Access Matrix Critical-Rule` anchor; the canonical citation text is shown in T02's `what` block as "git/SKILL.md § Memory Access Matrix (the H2 at line 17; the inline `**Critical rule — write paths**` is at line 33)".
- CL-3 domain-tag double-spot → T03's `what` block instructs the executor to add `hooks` at both lines 63 and 90 for consistency (preparation.md § Out-of-scope gaps recommendation).
- CL-5 gobbi/SKILL.md "one of 3 hits in Path Conventions block" claim → **corrected**: empirically no Path Conventions section exists in `gobbi/SKILL.md`. File dropped from sweep. See DR-9.

### iter1 EVAL Highs disposition

| Finding | Task touched | Fix |
|---|---|---|
| H1 (Claude O-F1 / S-F1 / S-F2 / U-F1 / C-F1) | T06, plus belt-and-braces denylist updates in T02/T03/T04/T05 | (a) awk pattern extended to cover `^### Path [Cc]onventions` (also `^\*\*Path Conventions\*\*` capitalized variant + the `^### [^P]` terminator addition); (b) `gobbi/SKILL.md` dropped from sweep — file count 11→10; (c) `gobbi/SKILL.md` added to every other task's `files-must-not-touch`. |
| H2 (Codex Check 3 sub 1) | T06 (both verify entries) | Replaced newline-string `FILES=...; for F in $FILES; do ...` with portable `set --` positional-arg array re-declared inside each verify entry; safe under bash + zsh; no cross-entry variable dependency. |
| H3 (Codex Check 3 sub 2) | T01..T06 (every verify entry) | Every verify block rewritten as self-contained shell that exits 0 on pass / non-zero on fail. Thresholds encoded via `test -eq` / `test -ge` / `\|\| exit 1`. English explanations moved to `# comment` lines. Multi-assertion blocks aggregate via a `fail=0` counter then `test "$fail" -eq 0 \|\| exit 1`. |

---

## NOT in scope

Carried from Idea § Out-of-Scope + § Deferred; iter2 H1 sharpens with the explicit `gobbi/SKILL.md` exclusion.

- Implementation of any 3rd hook (would change CL-2's N=2 witness premise).
- M1 / M3 mitigation paths for f-risk-01 — DL-5 locks M2; M1 + M3 explicitly rejected.
- Re-litigating DL-1..DL-7 — all user-locked.
- Refactoring `.claude/hooks/session-start.sh` or `.claude/hooks/post-tool-use-agents.sh` — read-only witnesses for CL-2.
- Editing `.claude/skills/mistake/SKILL.md` beyond T03's two consolidated edits.
- **Adding a Path Conventions section to `.claude/skills/gobbi/SKILL.md`** (iter2 H1) — would be a CL-5 scope expansion beyond the M2 codification mitigation that DL-5 locked; the file has no existing `{session-id}` row to M2-codify, and the CCSI hits there are not in conventions-documentation surfaces. **No task touches `gobbi/SKILL.md`.**
- Editing the env-health gate (line 52 of `gobbi/SKILL.md`) — Idea SC-5 anti-game clause + iter2 H1 (file is out-of-scope entirely).
- Bundle B HANDOFF "emergency stop" framing stale — Wrap-up note; not a Bundle C deliverable.
- iter1 Ideation evaluation-files audit-trail gap (Claude P1-002) — session-process deviation; Wrap-up captures.
- Smoke-test gate T1.h post-merge check — Memorization scope; Wrap-up handles.
- Planning/Execution delegation-prompt verification (Codex P7-F2 from Ideation EVAL) — Planning input via Wrap-up briefing; not a Bundle C deliverable.
- Implementing CL-6 row-order text via Option A or Option C — DL-7 locks Option B.
- Updating `git/SKILL.md` itself, `delegation/SKILL.md`, `codex/SKILL.md`, `discussion/SKILL.md`, or any skill outside the 10-list + `mistake/SKILL.md` (T03) + `orchestration/SKILL.md` (T02) + `gobbi-hook-authoring/SKILL.md` (T04 new). Iron Law 4.
- Bundling additional backlog items — no fired trigger; Iron Law 10.
- Authoring CL-6's row 5 / 5.5 / 6 exact replacement text in this Plan — that is Execution-author discretion within the locked Option B semantics + the SC-8.1/SC-8.2 verification anchors.

---

## Bundle-wide Acceptance Criteria

Beyond per-task `verifies` blocks, the Bundle C PR as a whole must satisfy:

1. **SC-7 (single-PR discipline)** — all 6 deliverables land in the same PR on `chore/session-2026-05-24-45388fa9`. Verified post-merge by `git log --oneline cf426f7..<bundle-c-merge-SHA> -- .claude/skills .gobbi/projects/gobbi/skills .gobbi/projects/gobbi/backlogs .gobbi/projects/gobbi/design` showing all 6 CLs represented in the commit range.
2. **CK-10 (Iron Law 10 PR description)** — the PR description cites the witness for each of CL-1..CL-6 by name/path:
    - CL-1 → witness commit `159eb21` + `session-start.sh:73-77`
    - CL-2 → witness N=2 hooks + this-session exercise (session.json agents[] non-empty)
    - CL-3 → witness `hooks-domain-mistakes-watchlist.md` § "Suggested approach" + DL-4 + DL-5
    - CL-4 → witness backlog § "When to pick up" trigger fired (T1 shipped `dfb7d6d`; DL-1 self-counts N=2)
    - CL-5 → witness `f-risk-01-subagent-ccsi-semantics.md` § "Candidate mitigations" M2 + DL-5 + iter2 H1 (10-file count empirically determined)
    - CL-6 → witness `session-dir-placed-outside-worktree.md` (staged mistake-candidate) + DL-7
3. **Documentation-implementation parity (Iron Law 8)** — every code-or-doc change is accompanied by the matching backlog status flip in the same commit-range (CL-1 / CL-2 / CL-3 / CL-4 / CL-5 each own their respective backlog flips; CL-6 has no backlog file).
4. **No out-of-scope file in the diff** — `git diff --name-only cf426f7..<merge-SHA>` lists no path outside the union of `files-may-touch` entries across T01..T06. In particular, `.claude/skills/gobbi/SKILL.md` MUST NOT appear in the diff (iter2 H1).

---

## Decisions log

Decisions taken across Planning iter1 + iter2 WORK passes. No AskUserQuestion exchanges occurred during DISCUSSION (per `planning/SKILL.md` DISCUSSION-is-manager-direct semantics; subagents do not run DISCUSSION here; the leader Sub-step A..E rolls up findings without re-opening user questions). Iter2 adds DR-9.

| # | Decision | Source / Witness | Rationale |
|---|---|---|---|
| DR-1 | **CL-5 ships as a single sweep task (T06), not per-file tasks.** | Idea § D-6 + Bundle B mistake `manager-context-overflow-with-large-bundle.md`. | CL-5 is mechanical: M2 wording locked at Ideation; per-file bounded grep makes verification per-file even from inside one task. Splitting to N tasks would (a) duplicate skill/mistake load across spawns, (b) exceed Bundle B's safe budget, and (c) provide no quality lift because the change is the same on each file. Single-sweep with per-file verification is the right granularity. |
| DR-2 | **Task ordering = T01 → T02 → T03 → T04 → T05 → T06** (verbatim Idea § Sequencing recommendation). | Idea § Sequencing/DAG (lines 197-214). | Sequential per Iron Law 3. CL-1 smallest (gates nothing); CL-6 second because every subsequent session benefits from the orchestration row-order fix; CL-3 third because the canonical M2 wording lands first on `mistake/SKILL.md` and provides the reference string for T06's spot check; CL-2 fourth because CL-4 may cite the new gobbi-hook-authoring skill; CL-4 fifth (clusters new-file work); CL-5 sixth (largest sweep last). No re-ordering judgment overrides this sequencing — leader concurs. |
| DR-3 | **Per-task scope inherits Idea Per-Deliverable Scope-Bound Table's may-touch + must-not-touch entries verbatim, with augmentations** (per task spec body). | Idea § Per-Deliverable Scope-Bound Table (lines 175-191) + preparation.md § CL-3 / CL-6. | Iter2 augmentations (carry from iter1 plus iter2 H1 extension): (a) T03 instructs the executor to add `hooks` at BOTH domain-tag example surfaces (lines 63 + 90); (b) T02 explicitly forbids citing the non-existent `Memory Access Matrix Critical-Rule` anchor; (c) T06 explicitly retains the env-health gate `$CLAUDE_CODE_SESSION_ID` reference in `gobbi/SKILL.md` (Idea SC-5 anti-game clause) — extended in iter2 to mean the entire file is out-of-scope, not just one line; (d) `gobbi/SKILL.md` added to every task's `files-must-not-touch` denylist. |
| DR-4 | **Per-task verifications are executable bash one-liners or heredoc blocks** (grep / awk / test / jq). | Idea § Success Criteria (lines 121-161). | Iter2 H3 fix: every verify block now exits 0 on pass / non-zero on fail; thresholds encoded via `test -eq` / `test -ge` / `\|\| exit 1` (no comment-only thresholds, no English-prose-appended-to-commands). Iter2 H1 fix: CL-5's awk pattern extended to `/^\*\*Path conventions\*\*\|^\*\*Path Conventions\*\*\|^## Path conventions\|^## Path Conventions\|^### Path conventions\|^### Path Conventions/` with terminator `/^\*\*[^P]\|^## \|^### [^P]/` to support H3 (`memorization/SKILL.md` line 228) + bolded + H2 + capitalized variants. Iter2 H2 fix: file lists declared via `set --` positional-arg array inside each verify entry — portable across bash + zsh, no cross-entry variable dependency. |
| DR-5 | **Every task runs dual-system EVAL (Claude + Codex)** at its Execution EVAL sub-phase per `execution.evaluate.mode: always`. | `planning/SKILL.md` § DISCUSSION-Phase-Note on evaluation policy + brief Constraints item 5. | Unchanged. |
| DR-6 | **No USER CHALLENGE escalation triggered.** | leader self-review against `planning/SKILL.md` § USER CHALLENGE primitive. | The iter2 fixes refine decomposition granularity / verification mechanism / file count — none re-litigates a user lock (DL-1..DL-7). DR-9 (file count 11→10) is the sharper expression of DL-5's M2-only mitigation, not a substantive disagreement with user direction. |
| DR-7 | **CK-10 (PR description Iron Law 10 witness) captured as bundle-wide Acceptance Criterion, not a task.** | `planning/SKILL.md` § "Test-writing is NOT a planning task" analogy. | Unchanged. |
| DR-8 | **No backlog candidates filed.** | leader self-review against scope. | Unchanged. All deferred items in Idea § Deferred + § Out-of-Scope already have pointers; no new project-backlog file or feature-backlog file required from Planning. |
| **DR-9 (NEW iter2)** | **CL-5 sweep is 10 files, not 11. `gobbi/SKILL.md` removed.** | Iter1 EVAL H1 (Claude O-F1 / S-F1 / S-F2 / U-F1 / C-F1, Confidence 100) + empirical re-grep of all 11 originally-listed files (run during iter2 WORK; 10/11 have `**Path conventions**` or `### Path conventions` heading with a `{session-id}` row; `gobbi/SKILL.md` has neither). | DL-5's M2 mitigation applies to files that document the `{session-id}` path convention. `gobbi/SKILL.md` does not document this convention (no Path Conventions section, no `{session-id}` row); its CCSI mentions are env-var passthrough table cells (line 38, line 63) and a runtime-health-gate (line 52) — none of these are M2 codification surfaces. Adding a Path Conventions section to this file would be a CL-5 scope expansion beyond the locked mitigation. Dropping it is the **sharper M2-faithful action**, not a re-Ideate trigger. Preparation's earlier claim that "1 of 3 CCSI hits is in a Path Conventions block" is empirically false; this iter corrects it. The user-locked DL-5 (M2 only) is honored — possibly more faithfully than the original "11 files" count. |

### Re-Ideate triggers

**None.** All 7 user-locked decisions (DL-1..DL-7) remain coherent with this iter2 Planning decomposition. DR-9's file-count adjustment is the sharper expression of DL-5's M2 codification (a file with no `{session-id}` row is not an M2 surface) — not a substantive change to the user's locked direction. Each CL maps to exactly one executor task; no task contradicts an Idea constraint; no decision surfaced that requires re-Ideating.

### Open questions for the user

**None.** Planning iter2 closes with zero `NEEDS_CONTEXT` items. The Idea + Preparation inputs (with iter1 EVAL findings now folded in) were complete and consistent; the leader did not need to surface any decision to the user. Sub-step A → E collapsed cleanly without manager-AUQ dispatch.

### Deferred-items section

| Item | Where deferred to | Why |
|---|---|---|
| M1 / M3 alternatives for f-risk-01 | Recorded in `f-risk-01-subagent-ccsi-semantics.md` `## Resolution` (T06 appends) as "alternatives considered" | DL-5 locks M2 only |
| Hooks-domain skill-extraction trigger (N≥2 not yet met) | `hooks-domain-mistakes-watchlist.md` (T03 sets `in-progress`; trigger documented) | N≥2 threshold not yet reached |
| Smoke-test gate T1.h post-merge check | Wrap-up briefing | Memorization scope, not Execution |
| Bundle B HANDOFF "emergency stop" framing stale | Wrap-up briefing | Not a Bundle C deliverable |
| iter1 Ideation evaluation-files audit-trail gap (Claude P1-002) | Wrap-up briefing | Session-process deviation |
| "Lessons learned" depth amendment for `session-lifecycle-worktree-boundaries.md` | Future post-N=2 sessions (R-7) | DL-1 accepts shallow-by-design |
| Bundle C merge commit SHA stamp on `f-risk-01-subagent-ccsi-semantics.md` `closed_by:` | post-merge Wrap-up or follow-up commit | SHA not known until PR merges |
| Planning/Execution delegation-prompt verification (Codex Ideation EVAL P7-F2) | Planning's own Wrap-up briefing → next session's Planning prep | Not a Bundle C deliverable; Planning-process design choice for a future bundle |
| CL-6 row-order text exact wording (rows 5/5.5/6) | Executor discretion bounded by SC-8.1/SC-8.2 + Option B semantics | Ideation explicitly defers to Execution per CL-6 § Out-of-Scope |
| **Authoring a Path Conventions section for `gobbi/SKILL.md` (NEW iter2)** | Future backlog candidate (not filed this iter — no fired trigger; Iron Law 10) | Iter2 DR-9: file currently has no `{session-id}` row to M2-codify. Whether the file SHOULD have a Path Conventions section is a separate design question outside Bundle C scope. |

---

## Memory reads register (this loop — cumulative iter1 + iter2)

| Path | Purpose | Read result |
|---|---|---|
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/artifacts/idea.md` | Locked Idea | Read in full (iter1) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/artifacts/decisions-summary.md` | 7 user-locked DLs | Read in full (iter1) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../preparation/artifacts/preparation.md` | Readiness verdict + CL-6 + CL-5 (now-corrected) concerns | Read in full (iter1) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` | CL-6 mistake-candidate witness | Read in full (iter1) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/rawdata/draft-iter1.md` | Restore point + iter2 baseline | Read in full (iter2) — paginated lines 1-653 + 654-831 |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/claude/overall.md` | Claude evaluator iter1 verdict + O-F1 | Read in full (iter2) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/claude/p2-structure.md` | S-F1 + S-F2 evidence | Read in full (iter2) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/claude/p5-usage.md` | U-F1 evidence | Read in full (iter2) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/claude/p6-consistency.md` | C-F1 evidence | Read in full (iter2) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/claude/{p1,p3,p4,p7}*.md` | Remaining Claude perspectives | Sampled headers (verdicts: PASS/PASS/PASS/PASS) — no additional Mediums to fold in beyond H1 root-cause |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../planning/evaluation/iter1/codex/` | Codex evaluator iter1 outputs | **Empty directory** — no per-perspective files produced this iter; iter2 relies on the brief's verbatim H2/H3 summary from Codex as the authoritative input |
| `.claude/skills/principles/SKILL.md` | Iron Law load (fresh subagent) | Read in full (iter2) |
| `.claude/skills/planning/SKILL.md` | Sub-steps A..E + REVISE Restore-Point procedure + required-sections template + Constraints | Read in full (iter2) |
| `.claude/skills/mistake/SKILL.md` | Mistake discipline | Read in full (iter2) |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Project rule (only one) | Listed; not applicable to this Planning iter |
| `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md` | CL-5 granularity decision (DR-1) | Carry from iter1 |
| `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | Iron Law 7 verbatim discipline | Carry from iter1 |
| `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md` | Iron Law 7 fresh-verification discipline | Carry from iter1 |
| `.claude/skills/{evaluation,execution,gobbi,ideation,interview,memorization,orchestration/workflow/evaluation,planning,preparation,research,wrap-up}/SKILL.md` | iter2 H1 empirical heading-grep across all 11 originally-listed files | Grep-read (only the Path Conventions heading + nearby `{session-id}` row context) — confirmed 10/11 have a `{session-id}` row; `gobbi/SKILL.md` does not |
| `.claude/skills/mistake/SKILL.md` | iter2 H1 confirmation that `**Path conventions**` (bold, line 126) is the heading shape | Grep-confirmed |
| `.claude/skills/git/SKILL.md` | iter2 confirmation of `## Memory Access Matrix` H2 (line 17) + `**Critical rule — write paths**` inline (line 33) for T02 citation precision | Grep-confirmed |
| `<sessionDir>/planning/rawdata/restore/iter1-pre-revise.md` | Restore point captured at REVISE entry per `planning/SKILL.md` § Restore Point | **Written by leader at iter2 entry** (verbatim copy of iter1 draft + 3-line re-run header) |

---

**End of planning/rawdata/draft-iter2.md**
