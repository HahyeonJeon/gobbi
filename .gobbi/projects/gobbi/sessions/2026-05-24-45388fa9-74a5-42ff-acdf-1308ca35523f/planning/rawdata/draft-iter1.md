# Planning Loop — Bundle C Plan — iter1

**Session**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Phase**: Planning iter1
**Author**: leader (PI/PM)
**Status**: DRAFT — 6 implementation tasks (T01..T06), 1 task per CL; no blocker; no open user question
**Branch**: `chore/session-2026-05-24-45388fa9` (develop @ `cf426f7`)

---

## Scope reference

- Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/artifacts/idea.md` (lines 1-580)
- Decisions summary: `<sessionDir>/ideation/artifacts/decisions-summary.md` — 7 user-locked DLs (DL-1..DL-7)
- Preparation readiness: `<sessionDir>/preparation/artifacts/preparation.md` — all 6 CLs PASS, 0 blockers, 1 minor citation-precision concern on CL-6 (defer to Execution per P-3)
- Locked Scope Contract: Idea § Scope Contract (CL-1..CL-6, 6 deliverables) — feature `session-foundations-bundle-c`

**Project / Feature / Task triplet** (verbatim from Idea Scope Contract):
- project: `gobbi`
- feature: `session-foundations-bundle-c`
- goal: "Land 6 cohering follow-ups — gobbi-hook-authoring skill (stage + promote, M2-compliant from creation), mistake/SKILL.md consolidated edits + hooks-watchlist backlog clarifier, session-lifecycle worktree-boundaries design doc, f-struct-01 inline close, f-risk-01 M2 delegation-prompt-passing docs sweep across 11 skills, and orchestration row-5/5.5/6 path-resolution fix (CL-6)."

---

## TL;DR

Bundle C decomposes into **6 implementation tasks, 1 per CL**, ordered per Idea § Sequencing/DAG:

`T01 (CL-1) → T02 (CL-6) → T03 (CL-3) → T04 (CL-2) → T05 (CL-4) → T06 (CL-5)`

Every task is sequential (Iron Law 3), independent file-wise (DAG has no fan-out), and ships in the same PR on `chore/session-2026-05-24-45388fa9`. All tasks are `executor` (sonnet); dual-system evaluation (Claude + Codex) is applied per task at the Execution EVALUATION sub-phase (settings `execution.evaluate.mode: always`).

**CL-5 granularity decision: single sweep task (T06)**, not 11 per-file tasks. Rationale below in § Decisions Log / DR-1.

Total estimated develop-shipping LOC: **~800–1000** per Idea § Risk § "Honest sizing" iter3 row.
Total estimated executor task count: **6** (per Idea D-6 recommended "1 task per CL"; Bundle B's ≥8-task overflow mistake bounds this to ≤7).

---

## File map

Every file the plan creates or modifies, grouped by CL ownership. Inherited verbatim from Idea § Per-Deliverable Scope-Bound Table; conflicts resolved via D-7 revised (`mistake/SKILL.md` exclusively to CL-3).

### CL-1 group (1 file — backlog status flip)

- `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` — MODIFY (frontmatter `status: open` → `closed`, add `closed_by: 159eb21`, append closure note citing `session-start.sh:73-77`).

### CL-2 group (3 files — new skill + staged twin + backlog flip)

- `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md` — CREATE (session-staged skill body using `interview/templates/project-skill.md`; M2-compliant Path Conventions from creation).
- `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` — CREATE (promoted from staged; identical body; this is the develop-shipping file).
- `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` — MODIFY (frontmatter `status: deferred` → `closed`).

### CL-3 group (2 files — mistake skill consolidated edits + backlog clarifier)

- `.claude/skills/mistake/SKILL.md` — MODIFY (two edits in one file open: add `hooks` to domain-tag examples list at lines 63 + 90; rewrite `{session-id}` Path Conventions row at line 129 to canonical M2 wording).
- `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` — MODIFY (frontmatter `status: deferred` → `in-progress`; clarify perpetual-capture-reminder + N≥2 skill-extraction trigger).

### CL-4 group (2 files — design doc + backlog flip)

- `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` — CREATE (per `memorization/templates/design.md`; 5 sections per backlog § "Suggested approach"; lessons section includes inline `shallow-by-design-per-DL-1` note per SC-4.2).
- `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` — MODIFY (frontmatter `status: deferred` → `closed`).

### CL-5 group (12 files — 11 SKILL files swept + 1 backlog disposition)

- `.claude/skills/wrap-up/SKILL.md` — MODIFY (Path Conventions `{session-id}` row → canonical M2 wording).
- `.claude/skills/research/SKILL.md` — MODIFY (same).
- `.claude/skills/orchestration/workflow/evaluation.md` — MODIFY (same).
- `.claude/skills/planning/SKILL.md` — MODIFY (same).
- `.claude/skills/execution/SKILL.md` — MODIFY (same).
- `.claude/skills/ideation/SKILL.md` — MODIFY (same).
- `.claude/skills/memorization/SKILL.md` — MODIFY (same).
- `.claude/skills/interview/SKILL.md` — MODIFY (same).
- `.claude/skills/evaluation/SKILL.md` — MODIFY (same).
- `.claude/skills/preparation/SKILL.md` — MODIFY (same).
- `.claude/skills/gobbi/SKILL.md` — MODIFY (Path Conventions `{session-id}` row only; the env-health gate at line 52 referencing `$CLAUDE_CODE_SESSION_ID` is OUT OF EDIT scope per Idea SC-5 anti-game clause).
- `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` — MODIFY (per SC-6: frontmatter `status: addressed` + `disposition: addressed` + `closed_by: <merge SHA — set post-merge>`; append `## Resolution` section).

### CL-6 group (1 file edited + 1 staged file left in place)

- `.claude/skills/orchestration/SKILL.md` — MODIFY (Step 1 procedure table rows 5/5.5/6 + the "Row 5.5 — Direct-mode opt-out (LOCK #5)" footnote per DL-7 = Option B: promote row 5.5 to before row 5; inline-cite the qualified absolute-root rule pointing at `git/SKILL.md` § Memory Access Matrix (Critical rule — write paths) AND `d-2-qualified-git-rule.md`; reword LOCK #5 footnote so the skipped row is the new row 5, not the old row 5.5).
- `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md` — NO-OP (file already exists; left in place for Wrap-up's `gobbi mistake promote` post-session — see Idea SC-8.3).

**Coordination notes** (carried from Idea § Per-Deliverable table):
- `mistake/SKILL.md` is owned end-to-end by CL-3 (T03). CL-5 (T06) explicitly excludes it.
- `orchestration/SKILL.md` is owned end-to-end by CL-6 (T02). CL-5 (T06) excludes it; `orchestration/workflow/evaluation.md` (a sibling sub-document) is in T06.
- Every backlog status flip listed above is authorized by the owning CL's may-touch row (per Idea D-8).

---

## Tasks

Numbered list. Each task uses the canonical YAML schema. **Implementation tasks run sequentially per the dependency graph in § Dependency table.**

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
  - "grep -E '^status: closed$' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md returns exactly 1 line"
  - "grep -E '^closed_by: 159eb21' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md returns exactly 1 line"
  - "grep -nE 'session-start\\.sh:73-77|session-start\\.sh.*73-77' .gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md returns >= 1 hit (closure-note citation present)"
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
  carries an inline citation to `git/SKILL.md` § Memory Access Matrix (Critical rule —
  write paths) AND to `d-2-qualified-git-rule.md`. LOCK #5 footnote reworded so the
  skipped row is the new row 5 (not the old row 5.5).
why: |
  Witness — staged mistake-candidate at `<sessionDir>/ideation/staging/decisions/session-dir-placed-outside-worktree.md`
  (confidence 95, severity medium) + DL-6 user lock (decisions-summary line 22) +
  DL-7 user lock (decisions-summary line 23 — Option B locked) + Idea § Decisions
  Log D-9 (Idea lines 360-369). Compounding witnesses: bundle-B `d-2-qualified-git-rule.md`
  + `d-4-per-iter-session-commit.md` (`git -C "$worktreePath" add` cannot see main-tree
  session memory). Preparation surfaced one citation-precision concern (preparation.md
  § CL-6 — the Idea cites "Memory Access Matrix Critical-Rule" with a hyphen; actual
  file has `## Memory Access Matrix` H2 line 17 + inline `**Critical rule — write
  paths**:` line 33). Executor cites the real anchor wording.
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
  - any of the 11 CL-5 sweep skills                          # T06 owns those
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # T04 owns it
  - any session.json / settings.json / state.json file
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md  # locked historical memorial
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-2-qualified-git-rule.md  # locked historical memorial
  - .gobbi/projects/gobbi/features/session-foundations-bundle-b/design/d-4-per-iter-session-commit.md  # locked historical memorial
inputs: []
outputs:
  - bundle-c-cl-6-orchestration-fix-committed
verifies:
  - |
    # SC-8.1: inline citations to git/SKILL.md § Memory Access Matrix (or the actual
    # anchor wording per preparation.md citation-precision note) AND to
    # d-2-qualified-git-rule.md appear within the Step 1 range. The Idea sets floor
    # at >=2 hits (rows 5/5.5/6 may share a single inline citation).
    awk '/^## Step 1 — Workflow Configuration|^### Step 1 — Workflow Configuration|^## Step 1 |^### Step 1 /,/^## Step 2 |^### Step 2 /' .claude/skills/orchestration/SKILL.md > /tmp/step1.txt
    grep -cE 'git/SKILL\.md.*Memory Access Matrix|d-2-qualified-git-rule' /tmp/step1.txt   # floor >= 2
  - |
    # SC-8.2: row order matches DL-7 = Option B; no migration / tmp staging language.
    awk '/^### Step 1 — Workflow Configuration|^## Step 1 /,/^### Step 2 |^## Step 2 /' .claude/skills/orchestration/SKILL.md > /tmp/step1.txt
    grep -cE 'mv .*state\.json|tmp/.*state\.json' /tmp/step1.txt   # must be 0 (Option A/C language excluded)
  - |
    # SC-8.3: staged mistake-candidate file present at session-end (no deletion by CL-6).
    test -f "<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md"
  - |
    # Citation precision (per preparation.md § CL-6 P-3): the cited anchor must
    # match what actually exists in git/SKILL.md (Memory Access Matrix H2 at line 17 +
    # inline "Critical rule — write paths" at line 33). Executor should cite either
    # "Memory Access Matrix" or "Memory Access Matrix (Critical rule — write paths)" —
    # NOT a hyphenated "Memory Access Matrix Critical-Rule" anchor that does not exist.
    grep -cE 'Memory Access Matrix.?Critical-Rule|Critical-Rule.*Memory Access Matrix' .claude/skills/orchestration/SKILL.md  # must be 0
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
  - any of the 11 CL-5 sweep skills                              # T06
  - .claude/skills/orchestration/SKILL.md                        # T02
  - any other backlog file
inputs:
  - bundle-c-cl-6-orchestration-fix-committed   # informational dep — T03 reads no T02 output, ordering only
outputs:
  - bundle-c-cl-3-mistake-skill-and-backlog-committed
  - bundle-c-canonical-m2-wording-on-mistake-skill   # T06 mirrors this string across 11 files
verifies:
  - |
    # SC-3.1: hooks listed in domain-tag examples; backlog clarifier in place.
    grep -nE '\bhooks\b' .claude/skills/mistake/SKILL.md  # >= 1 hit in domain-tag example surfaces (lines ~63 + ~90)
    grep -nE 'perpetual.capture.reminder|N>=2|N≥2|extraction trigger' .gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md  # >= 1 hit
  - |
    # SC-3.2: M2 row rewritten on mistake/SKILL.md; bounded `awk` on Path Conventions
    # block (delimited by `**Path conventions**` bolded sub-heading, NOT `## `).
    awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' .claude/skills/mistake/SKILL.md > /tmp/pcblock.txt
    grep -cE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/pcblock.txt   # >= 1
    grep -cE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/pcblock.txt  # >= 1
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
  - any of the 11 CL-5 sweep skills                    # T06
  - .claude/skills/orchestration/SKILL.md              # T02
  - .claude/hooks/**                                   # witnesses, read-only
  - .claude/skills/interview/templates/project-skill.md  # template, read-only
inputs:
  - bundle-c-cl-3-mistake-skill-and-backlog-committed
outputs:
  - bundle-c-cl-2-gobbi-hook-authoring-skill-shipped
verifies:
  - |
    # SC-2.1: skill exists on develop-shipping path with valid frontmatter + four
    # canonical sections (Core Principles + Procedures + Constraints + Output paths).
    test -f .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md
    grep -nE '^name: gobbi-hook-authoring' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # frontmatter
    grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # >= 4
  - |
    # SC-2.2 (primary path — Path Conventions section present): M2 clauses in
    # Path Conventions block.
    awk '/^## Path conventions|^## Path Conventions|^\*\*Path conventions\*\*/,/^## |^\*\*/' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md > /tmp/pcblock.txt
    if test -s /tmp/pcblock.txt; then
      grep -cE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/pcblock.txt   # >= 1
      grep -cE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/pcblock.txt  # >= 1
    else
      # SC-2.2 (degraded path — no Path Conventions section): zero CCSI mentions anywhere.
      grep -cE '\$CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # must be 0
    fi
  - |
    # SC-2.3 (witness citations + exercise witness).
    grep -nE 'session-start\.sh|post-tool-use-agents\.sh' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # both hooks cited
    jq '.agents | length' "<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/session.json"  # non-zero post-Wrap-up
  - |
    # Backlog flip applied.
    grep -E '^status: closed$' .gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md  # exactly 1 line
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
  - any of the 11 CL-5 sweep skills            # T06
  - .claude/skills/orchestration/SKILL.md       # T02
  - .claude/skills/mistake/SKILL.md             # T03
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md  # T04
inputs:
  - bundle-c-cl-2-gobbi-hook-authoring-skill-shipped
outputs:
  - bundle-c-cl-4-design-doc-shipped
verifies:
  - |
    # SC-4.1: file exists; 5 sections present; lessons section non-empty.
    test -f .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md
    grep -cE '^## (Problem|Approach|Surfaces|Validation|Lessons)' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md  # >= 5 (or match template's exact heading text)
    # lessons section non-empty (body characters between Lessons heading and next H2 / EOF)
    awk '/^## Lessons/,/^## |^$/{print}' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md | wc -c   # > 100 bytes
  - |
    # SC-4.2: inline shallow-by-design rationale present in doc body.
    grep -cE 'shallow-by-design-per-DL-1|intentionally sparse|authored before Wrap-up' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md  # >= 1
  - |
    # Backlog flip applied.
    grep -E '^status: closed$' .gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md  # exactly 1 line
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
  Path Conventions row across **11 skill files** (enumerated below; `mistake/SKILL.md`
  excluded per D-7 revised; CL-3 / T03 already updated it) plus a single backlog
  disposition update on `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
  per SC-6.

  The 11 files (exact paths, in sweep order — alphabetical for traceability):
    1. .claude/skills/evaluation/SKILL.md
    2. .claude/skills/execution/SKILL.md
    3. .claude/skills/gobbi/SKILL.md            # Path Conventions row ONLY; env-health gate at line 52 NOT edited
    4. .claude/skills/ideation/SKILL.md
    5. .claude/skills/interview/SKILL.md
    6. .claude/skills/memorization/SKILL.md
    7. .claude/skills/orchestration/workflow/evaluation.md
    8. .claude/skills/planning/SKILL.md
    9. .claude/skills/preparation/SKILL.md
    10. .claude/skills/research/SKILL.md
    11. .claude/skills/wrap-up/SKILL.md

  The canonical M2 replacement string for the `{session-id}` row (locked at
  Ideation; Preparation polish allowed within bounds — see SC-5 reference-wording
  spot check):
    > "`{session-id}` — Claude Code session ID supplied by the delegation prompt's
    > `session-id:` header field (the parent session's id). Do NOT read
    > `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that
    > env-var holds the subagent's own UUID, not the parent session's."

  Per-file verification (SC-5 per-file bounded awk + grep). After applying the
  sweep, also update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
  per SC-6 canonical spec: frontmatter `status: addressed` AND `disposition:
  addressed`; append `## Resolution` section citing the 11-skill sweep + the
  `mistake/SKILL.md` consolidated edit (T03) + DL-5 M2 codification + M1/M3 not
  chosen. `closed_by: <Bundle C merge commit SHA>` field added once the PR merges
  (post-task verification; not part of this task's exit gate).
why: |
  Witnesses — `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`
  § "Candidate mitigations" M2 verbatim + DL-4 (absorb into Bundle C) + DL-5 (M2
  only; M1/M3 explicitly NOT chosen). Preparation confirmed all 11 files readable
  with the documented CCSI hit pattern (preparation.md § CL-5 table; 10 single-hit
  files + 1 three-hit file `gobbi/SKILL.md` where 2 of 3 hits are out-of-block).
  D-7 revised confirms the 11-file (not 12) sweep is authoritative.
traces-to:
  - "CK-7 (→ CL-5 docs sweep): For each of the **11** affected skill files (was 12; minus `mistake/SKILL.md` per D-7 revised), update the `{session-id}` Path Conventions row to the canonical M2 wording per CL-5 § Wording is locked at Ideation. Each file edit is verified by SC-5's per-file bounded grep." (Idea line 323)
  - "CK-8 (→ CL-5 backlog update): Update `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` per SC-6 canonical spec (both `status:` and `disposition:` to `addressed`, append `## Resolution` section)." (Idea line 324)
  - "Idea SC-5 / SC-6 verification anchors" (Idea lines 139-154)
requires: [T05]
files:
  - path: .claude/skills/evaluation/SKILL.md
    op: modify
  - path: .claude/skills/execution/SKILL.md
    op: modify
  - path: .claude/skills/gobbi/SKILL.md
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
  - .claude/skills/gobbi/SKILL.md
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
  - .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md   # T04 owns it
  - .claude/skills/orchestration/SKILL.md       # T02 owns it
  - .claude/skills/git/SKILL.md                 # out of bundle (Iron Law 4)
  - .claude/skills/delegation/SKILL.md          # out of bundle (Iron Law 4)
  - .claude/skills/codex/SKILL.md               # out of bundle
  - .claude/skills/discussion/SKILL.md          # out of bundle
  - any other skill file outside the 11-list
  - any other backlog file
inputs:
  - bundle-c-canonical-m2-wording-on-mistake-skill   # T03's mistake/SKILL.md M2 row is the reference string
  - bundle-c-cl-4-design-doc-shipped
outputs:
  - bundle-c-cl-5-m2-sweep-and-backlog-committed
verifies:
  - |
    # SC-5 (per-file bounded check) — for each of the 11 files F, both M2 clauses
    # must appear within the Path Conventions block. Loop the 11 files; each must pass.
    FILES="
      .claude/skills/evaluation/SKILL.md
      .claude/skills/execution/SKILL.md
      .claude/skills/gobbi/SKILL.md
      .claude/skills/ideation/SKILL.md
      .claude/skills/interview/SKILL.md
      .claude/skills/memorization/SKILL.md
      .claude/skills/orchestration/workflow/evaluation.md
      .claude/skills/planning/SKILL.md
      .claude/skills/preparation/SKILL.md
      .claude/skills/research/SKILL.md
      .claude/skills/wrap-up/SKILL.md
    "
    for F in $FILES; do
      awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' "$F" > /tmp/pcblock.txt
      grep -qE 'delegation prompt.*session-id|session-id.*delegation prompt' /tmp/pcblock.txt || { echo "FAIL M2-clause-1 in $F"; exit 1; }
      grep -qE 'do NOT read .CLAUDE_CODE_SESSION_ID|do not read .CLAUDE_CODE_SESSION_ID' /tmp/pcblock.txt || { echo "FAIL M2-clause-2 in $F"; exit 1; }
    done
  - |
    # SC-5 reference-wording spot check — wrap-up/SKILL.md is the canonical reference;
    # at least 7 of 11 files must exactly match the M2-clause-1 + M2-clause-2 substrings
    # extracted from wrap-up. Allows minor sentence-flow polish on up to 4 files.
    awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' .claude/skills/wrap-up/SKILL.md > /tmp/wrapup-pc.txt
    REF_CLAUSE_1=$(grep -oE 'delegation prompt[^.]*session-id[^.]*' /tmp/wrapup-pc.txt | head -1)
    REF_CLAUSE_2=$(grep -oE 'do NOT read [^.]*CLAUDE_CODE_SESSION_ID[^.]*' /tmp/wrapup-pc.txt | head -1)
    MATCHES=0
    for F in $FILES; do
      awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' "$F" > /tmp/pcblock.txt
      if grep -qF "$REF_CLAUSE_1" /tmp/pcblock.txt && grep -qF "$REF_CLAUSE_2" /tmp/pcblock.txt; then
        MATCHES=$((MATCHES+1))
      fi
    done
    test "$MATCHES" -ge 7  # >= 7 of 11 exact-match
  - |
    # SC-5 anti-game (Iron Law 11) — out-of-block CCSI occurrences allowed (e.g.,
    # gobbi/SKILL.md env-health gate at line 52); the bounded check above is the
    # only constraint. No further negative check required here.
    # gobbi/SKILL.md retains its env-health $CLAUDE_CODE_SESSION_ID reference (not edited).
    grep -nE '\$CLAUDE_CODE_SESSION_ID' .claude/skills/gobbi/SKILL.md  # >= 2 hits remain (env-health + any retained out-of-block usage)
  - |
    # SC-6: f-risk-01 backlog disposition (canonical).
    grep -E '^status: addressed' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
    grep -E '^disposition: addressed' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
    grep -E '^## Resolution' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
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
estimated-loc: 130-180 (11 × ~10-15 LoC per file + Resolution section on backlog)
eval-policy: dual-system (Claude + Codex)
```

---

## Dependency table

Sub-step C Table 1. Tasks are sequenced; each row's `Depends on` is the immediate predecessor. No cycles. File-touched sets are pairwise disjoint at the path level except where commented.

| Task | Depends on | Blocks | Files touched (counts) |
|---|---|---|---|
| T01 (CL-1) | — | T02 | 1 backlog file |
| T02 (CL-6) | T01 | T03 | 1 skill file (`orchestration/SKILL.md`) + 1 no-op staged mistake-candidate |
| T03 (CL-3) | T02 | T04 | 1 skill file (`mistake/SKILL.md`) + 1 backlog file |
| T04 (CL-2) | T03 | T05 | 1 staged session-skill (worktree-internal) + 1 promoted skill file + 1 backlog file |
| T05 (CL-4) | T04 | T06 | 1 new design doc + 1 backlog file |
| T06 (CL-5) | T05 | — | 11 skill files + 1 backlog file |

**File-overlap audit (zero conflicts)**:
- `mistake/SKILL.md`: T03 only. T06 (CL-5) explicitly excludes per D-7 revised.
- `orchestration/SKILL.md`: T02 only. T06 (CL-5) excludes; `orchestration/workflow/evaluation.md` (sub-doc) is in T06 but is a different file.
- `gobbi-hook-authoring/SKILL.md`: T04 only (creates the file).
- Each of the 11 CL-5 sweep files: T06 only.
- Each of the 5 backlog files affected: owned by exactly one of T01/T03/T04/T05/T06 per Idea D-8.

Zero cross-task file-touch conflicts. No conflict flags raised.

---

## Parallel lanes

Sub-step C Table 2. Per `planning/SKILL.md` § Sub-step C step 4, lane metadata is documentation only; Execution runs **sequentially** (one task at a time). For audit completeness:

| Lane | Tasks | Order |
|---|---|---|
| L1 (small backlog flips + single-file edits) | T01 → T02 → T03 | sequential |
| L2 (new files + medium edits) | T04 → T05 | sequential |
| L3 (11-file sweep) | T06 | sequential |

**Theoretical parallelism**: T01, T02, T03, T04, T05 all touch disjoint file sets (per the audit above) and could in principle parallelize, but per the project rules + bundle-B's `manager-context-overflow-with-large-bundle` mistake (≥8 plan tasks risk overflow; 6 sequential tasks at the bundle-C scale are within budget), the Plan instructs Execution to run them sequentially. No parallelism is committed; the manager runs T01 → T02 → T03 → T04 → T05 → T06.

**Conflict flags**: **none.**

---

## Agent assignments

Sub-step D. Every task is `agent-type: executor`, `model: sonnet` (delegation default). Per-task required skills + required mistakes captured in each task spec above. Summary table for cross-task review:

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

Sub-step E findings against this draft.

### Spec coverage check

Every Ideation Implementation Checklist item (CK-1..CK-10) maps to exactly one task. CK-10 is the bundle-wide PR-description discipline (Iron Law 10) and is captured in § Bundle-wide Acceptance Criteria below — not as a standalone executor task because authoring the PR description is not an Execution implementation artifact (it lives in the integration / wrap step). The Plan's CK→Task table:

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
| CK-7 | T06 | 11-file M2 sweep |
| CK-8 | T06 | f-risk-01 backlog disposition |
| CK-9 | T02 | ✓ |
| CK-10 | (bundle-wide) | § Bundle-wide Acceptance Criteria — Iron Law 10 PR description |

**Coverage**: 12 of 12 Idea CKs mapped (CK-10 captured as bundle-wide criterion, not a task). Every task anchors to a checklist item AND has a witness from Idea § Witnesses / SC anchors.

### Placeholder scan

- `grep -nE 'TBD|TODO|to be defined|<\.\.\.>|XXX|FIXME'` against this draft: **0 hits** (verified by file content; the only `<...>` shape is `<worktreePath>` / `<sessionDir>` / `<Bundle C merge commit SHA>` macros which are documented session-path conventions per `planning/SKILL.md` § Path conventions and `<Bundle C merge commit SHA>` which is a known post-merge value — these are NOT placeholder anti-patterns; they are intentional variables filled at execution time per the canonical schema).

### Type / name consistency

- `output` of T03 = `bundle-c-canonical-m2-wording-on-mistake-skill` → consumed as `input` of T06. ✓
- `output` of T04 = `bundle-c-cl-2-gobbi-hook-authoring-skill-shipped` → consumed as `input` of T05. ✓
- File path `.claude/skills/orchestration/workflow/evaluation.md` referenced consistently across T06's files, must-not-touch lists in T02/T03/T04/T05. ✓
- File path `.claude/skills/orchestration/SKILL.md` (parent skill, T02 owns) vs `.claude/skills/orchestration/workflow/evaluation.md` (sub-document, T06 owns) — distinct paths; both consistently referenced. ✓
- File path `.claude/skills/mistake/SKILL.md` referenced consistently with the bolded sub-heading `**Path conventions**` (per preparation.md § CL-3 — NOT `## Path conventions`). The SC-3.2 awk range covers both forms. ✓
- All 11 CL-5 sweep file paths match Preparation's enumerated table (preparation.md § CL-5 readiness table). ✓
- Task IDs T01..T06 used consistently across § Dependency table, § Parallel lanes, § Agent assignments, § Spec coverage table. ✓

**Findings**: zero.

### Cross-check vs Preparation's deferred items

Preparation surfaced two minor concerns (CL-6 citation precision + CL-3 single-spot-vs-both for domain-tag examples). Both are folded into task specs:
- CL-6 citation precision → T02's `verifies` block includes a negative-grep that fails if the executor cites the non-existent `Memory Access Matrix Critical-Rule` anchor; the canonical citation text is shown in T02's `what` block as "git/SKILL.md § Memory Access Matrix (Critical rule — write paths)".
- CL-3 domain-tag double-spot → T03's `what` block instructs the executor to add `hooks` at both lines 63 and 90 for consistency (preparation.md § Out-of-scope gaps recommendation).

---

## NOT in scope

Carried from Idea § Out-of-Scope + § Deferred. Explicit deferrals:

- Implementation of any 3rd hook (would change CL-2's N=2 witness premise).
- M1 / M3 mitigation paths for f-risk-01 — DL-5 locks M2; M1 + M3 explicitly rejected.
- Re-litigating DL-1 / DL-2 / DL-3 / DL-4 / DL-5 / DL-6 / DL-7 — all user-locked.
- Refactoring `.claude/hooks/session-start.sh` or `.claude/hooks/post-tool-use-agents.sh` — read-only witnesses for CL-2.
- Editing `.claude/skills/mistake/SKILL.md` beyond T03's two consolidated edits.
- Bundle B HANDOFF "emergency stop" framing stale — Wrap-up note; not a Bundle C deliverable.
- iter1 Ideation evaluation-files audit-trail gap (Claude P1-002) — session-process deviation; Wrap-up captures.
- Smoke-test gate T1.h post-merge check — Memorization scope; Wrap-up handles.
- Planning/Execution delegation-prompt verification (Codex P7-F2 from Ideation EVAL) — Planning input via Wrap-up briefing; not a Bundle C deliverable.
- Implementing CL-6 row-order text via Option A or Option C — DL-7 locks Option B.
- Updating `git/SKILL.md` itself, `delegation/SKILL.md`, `codex/SKILL.md`, `discussion/SKILL.md`, or any skill outside the 11-list + `mistake/SKILL.md` (T03) + `orchestration/SKILL.md` (T02) + `gobbi-hook-authoring/SKILL.md` (T04 new). Iron Law 4.
- Bundling additional backlog items (e.g., `normalize-path-conventions-h3`, `item-1-2-broader-delegation-contract-verifier`) — no fired trigger; Iron Law 10.
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
    - CL-5 → witness `f-risk-01-subagent-ccsi-semantics.md` § "Candidate mitigations" M2 + DL-5
    - CL-6 → witness `session-dir-placed-outside-worktree.md` (staged mistake-candidate) + DL-7
3. **Documentation-implementation parity (Iron Law 8)** — every code-or-doc change is accompanied by the matching backlog status flip in the same commit-range (CL-1 / CL-2 / CL-3 / CL-4 / CL-5 each own their respective backlog flips; CL-6 has no backlog file).
4. **No out-of-scope file in the diff** — `git diff --name-only cf426f7..<merge-SHA>` lists no path outside the union of `files-may-touch` entries across T01..T06.

---

## Decisions log

Decisions taken during this Planning iter1 WORK pass. No AskUserQuestion exchanges occurred during DISCUSSION (per `planning/SKILL.md` DISCUSSION-is-manager-direct semantics; subagents do not run DISCUSSION here; the leader Sub-step A..E rolls up findings without re-opening user questions).

| # | Decision | Source / Witness | Rationale |
|---|---|---|---|
| DR-1 | **CL-5 ships as a single sweep task (T06), not 11 per-file tasks.** | Idea § D-6 ("≤ 14 implementation tasks if CL-5 ships as a single sweep task + CL-6 ships as a single Option-B task; recommended path: 1 task per CL") + Bundle B mistake `manager-context-overflow-with-large-bundle.md` (≥8 plan tasks risk overflow; 11 tasks for CL-5 alone would push the total to 16 + would cumulatively trip the budget). | CL-5 is mechanical: M2 wording locked at Ideation; per-file bounded grep makes verification per-file even from inside one task. Splitting to 11 tasks would (a) duplicate skill/mistake load across 11 spawns, (b) exceed Bundle B's safe budget, and (c) provide no quality lift because the change is the same on each file. Single-sweep with per-file verification is the right granularity. **R-1 in the Idea (Planning decomposition decision) is resolved here in favor of 1 task.** |
| DR-2 | **Task ordering = T01 → T02 → T03 → T04 → T05 → T06** (verbatim Idea § Sequencing recommendation). | Idea § Sequencing/DAG (lines 197-214). | Sequential per Iron Law 3. CL-1 smallest (gates nothing); CL-6 second because every subsequent session benefits from the orchestration row-order fix; CL-3 third because the canonical M2 wording lands first on `mistake/SKILL.md` and provides the reference string for T06's spot check; CL-2 fourth because CL-4 may cite the new gobbi-hook-authoring skill; CL-4 fifth (clusters new-file work); CL-5 sixth (largest sweep last). No re-ordering judgment overrides this sequencing — leader concurs. |
| DR-3 | **Per-task scope inherits Idea Per-Deliverable Scope-Bound Table's may-touch + must-not-touch entries verbatim, with three small augmentations** (per task spec body). | Idea § Per-Deliverable Scope-Bound Table (lines 175-191) + preparation.md § CL-3 / CL-6. | Three augmentations: (a) T03 instructs the executor to add `hooks` at BOTH domain-tag example surfaces (lines 63 + 90) per preparation.md § Out-of-scope gaps; (b) T02 explicitly forbids citing the non-existent `Memory Access Matrix Critical-Rule` anchor (the actual file uses `## Memory Access Matrix` + inline `**Critical rule — write paths**:`); (c) T06 explicitly retains the env-health gate `$CLAUDE_CODE_SESSION_ID` reference in `gobbi/SKILL.md` (Idea SC-5 anti-game clause). All three augmentations are derived from Preparation's verifications and do not change Idea-locked scope. |
| DR-4 | **Per-task verifications are executable bash one-liners** (grep / awk / test / jq) per Idea SC-1..SC-8. | Idea § Success Criteria (lines 121-161). | CL-5's awk pattern `awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /'` is verified correct as written: starts at the Path Conventions block (delimited by either `**Path conventions**` bolded sub-heading per `mistake/SKILL.md` line 126 OR `## Path conventions` H2 per most other SKILL files); ends at the next `**` (non-Path) sub-heading OR the next `## ` H2. The `^\*\*[^P]` anchor avoids re-matching the start line. Verified against `mistake/SKILL.md` (preparation.md § CL-3 line 54) and against `wrap-up/SKILL.md` shape. |
| DR-5 | **Every task runs dual-system EVAL (Claude + Codex)** at its Execution EVAL sub-phase per `execution.evaluate.mode: always`. | `planning/SKILL.md` § DISCUSSION-Phase-Note on evaluation policy + brief Constraints item 5. | No iter2-surgical-fix optimization applied at Planning time — that lever is a Manager mid-Execution call per the Bundle B mistake, not a Planning pre-decision. |
| DR-6 | **No USER CHALLENGE escalation triggered.** | leader self-review against `planning/SKILL.md` § USER CHALLENGE primitive. | The leader's research-backed analysis does not substantively disagree with any user-locked DL (DL-1..DL-7). Every leader decision in this plan (DR-1..DR-5) refines decomposition granularity / sequencing / verification, none re-litigates a user lock. No 5-field card raised. |
| DR-7 | **CK-10 (PR description Iron Law 10 witness) captured as bundle-wide Acceptance Criterion, not a task.** | `planning/SKILL.md` § "Test-writing is NOT a planning task" analogy — PR-description authoring is wrap-time integration, not Execution-implementation. | Bundle B's Plan (reference shape) also captured equivalent bundle-wide criteria in its Verification strategy summary, not as a numbered sub-task. Idea CK-10 is bundle-level discipline (Iron Law 10), not file-level work. |
| DR-8 | **No backlog candidates filed.** | leader self-review against scope. | All deferred items in Idea § Deferred + § Out-of-Scope already have their pointers (existing backlogs / Wrap-up briefing / Iron Law 4 skips). No new project-backlog file or feature-backlog file is required from Planning. |

### Re-Ideate triggers

**None.** All 7 user-locked decisions (DL-1..DL-7) remain coherent with the Planning decomposition. Each CL maps to exactly one executor task; no task contradicts an Idea constraint; no decision surfaced that requires re-Ideating.

### Open questions for the user

**None.** Planning iter1 closes with zero `NEEDS_CONTEXT` items. The Idea + Preparation inputs were complete and consistent; the leader did not need to surface any decision to the user. Sub-step A → E collapsed cleanly without manager-AUQ dispatch.

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

---

## Memory reads register (this loop)

| Path | Purpose | Read result |
|---|---|---|
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/artifacts/idea.md` | Locked Idea (580 lines) | Read in full (paginated: lines 1-320 + 320-580) |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/artifacts/decisions-summary.md` | 7 user-locked DLs | Read in full |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../preparation/artifacts/preparation.md` | Readiness verdict + CL-6 citation-precision concern | Read in full |
| `<worktreePath>/.gobbi/projects/gobbi/sessions/2026-05-24-.../ideation/staging/decisions/session-dir-placed-outside-worktree.md` | CL-6 mistake-candidate witness | Read in full |
| `.claude/skills/principles/SKILL.md` | Iron Law load (fresh subagent) | Read in full |
| `.claude/skills/planning/SKILL.md` | Sub-steps A..E procedure + required-sections template + Constraints | Read in full |
| `.claude/skills/mistake/SKILL.md` | Mistake discipline | Read in full |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Project rule (only one) | Read; not applicable to this Planning iter |
| `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md` | CL-5 granularity decision (DR-1) — anchors single-sweep choice | Read in full |
| `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | Iron Law 7 verbatim discipline for every executor brief | Read in full |
| `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md` | Iron Law 7 fresh-verification discipline | Read in full |
| `.gobbi/projects/gobbi/features/session-foundations-bundle-b/plans/2026-05-24-session-foundations-bundle-b.md` | Reference plan shape (bundle B) | Read in full (53 lines) |
| `.gobbi/projects/gobbi/mistakes/` (15 files, names only) | Domain-filter scan | Listed via `ls`; read 3 files in full (above) + relied on Ideation iter3's already-applied filter for the remaining 12 |

---

**End of planning/rawdata/draft-iter1.md**
