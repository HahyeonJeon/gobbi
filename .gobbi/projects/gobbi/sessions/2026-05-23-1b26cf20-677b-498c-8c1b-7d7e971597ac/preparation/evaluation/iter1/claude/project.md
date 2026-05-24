# Preparation iter1 — PROJECT perspective (Claude)

Perspective: project (contract / scope / alignment with locked Ideation)
Verdict: **FAIL**

## Frame

Locked Ideation Scope Contract (bundle-b-ideation-pass.md) — T1 + T3, T2 deferred. Preparation must verify readiness of project memory + workspace skills against this contract and ship a gap-resolution plan with no out-of-scope content. Per `preparation/SKILL.md` WORK § 274: "WORK does not introduce design decisions, plans, or implementations beyond what the user approved in DISCUSSION."

## Findings

### F-P1 (Critical, Confidence 100, scenario_gap / process)

**The "Mirror propagation policy" lock is empirically false on disk; Preparation shipped a user-locked decision that contradicts the on-disk reality.**

Evidence:
- `ls -la /playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/` shows every `.md` file (including all 7 files: ideation/preparation/planning/execution/wrap-up/evaluation/memorization) is a **symlink pointing into `.gobbi/projects/gobbi/skills/orchestration/workflow/`**.
- `find .claude/skills/ -maxdepth 2 -type l` returns 24 file-level symlinks pointing into the project mirror across nearly every skill (`git/SKILL.md`, `orchestration/SKILL.md`, `delegation/SKILL.md`, `preparation/SKILL.md`, `planning/SKILL.md`, etc.).
- The Mirror policy decision file (`mirror-propagation-policy-workspace-canonical.md`) asserts at line 17: "Project mirror at `.gobbi/projects/gobbi/skills/` — appears to be a parallel directory tree of the same shape, populated with what look like copies (not symlinks — verified `ls -la` shows real directories with `drwxrwxr-x` permissions)."
- This verification was directionally backwards. The leader checked **directories** in `.gobbi/projects/gobbi/skills/` (correctly found those are real dirs) but never checked **files** in `.claude/skills/` (which ARE symlinks pointing the other way).

Why it matters:
- The user-locked stance "workspace is canonical, mirror auto-syncs" is **factually inverted** — on disk the mirror is the source-of-truth and the workspace is the derived symlink layer.
- T1 executors briefed to "edit the workspace path only" will edit through symlinks — `vim .claude/skills/orchestration/workflow/preparation.md` follows the symlink and edits the mirror file. So the surface behavior is fine BUT every downstream document that frames it as "workspace canonical" lies about the topology and creates a 2-source-of-truth confusion for any reader trying to make sense of the policy.
- The "sync mechanism is absent" backlog (`workspace-to-mirror-sync-mechanism.md`) is incorrect: a **symlink-based sync mechanism already exists** (Option 2 in that very backlog!). The leader proposed Option 1 (`gobbi sync` CLI) as the recommended starting point — that would create a SECOND, redundant sync mechanism on top of the symlinks.
- The user's lock was made on a false empirical premise. The user should be presented with the corrected topology and asked to re-confirm or re-direct.

Suggested direction (for manager + user discussion, not for evaluator to implement):
- Re-empirically verify the mirror topology (run `find .claude/skills/ -type l` in the user's presence).
- Re-frame the decision: either (a) "mirror is the file-system canonical; workspace is symlinks; we treat the workspace path as the public API and the mirror path as the implementation detail" OR (b) flip the symlink direction so the workspace really is canonical.
- The conditional `workspace-to-mirror-sync-mechanism.md` backlog should be either retired (mechanism = file symlinks) or re-scoped to "verify symlink coverage is complete and add a guard against orphan files."

### F-P2 (High, Confidence 100, checklist_gap / docs-sync)

**D-4 staged design file enumerates 5 workflow phase docs but the actual directory contains 7.**

Evidence:
- `ls .claude/skills/orchestration/workflow/` returns: `evaluation.md  execution.md  ideation.md  memorization.md  planning.md  preparation.md  wrap-up.md` (7 files).
- The D-4 staged design file (`workflow-phase-doc-set-for-per-iter-cadence.md`) lines 36-42 lists 5: ideation/preparation/planning/execution/wrap-up.
- The Ideation artifact line 155 says "all 5 workflow phase docs" — but Ideation did not enumerate which 5, and the WORK phase did not flag the off-by-2 ambiguity.

Why it matters:
- A Planning decomposer running `ls .claude/skills/orchestration/workflow/` will find 7 files and need to decide whether to add the cadence rule to `evaluation.md` and `memorization.md` too.
- The leader's stated rationale ("the 5-phase set is fixed by the 5 productive steps + Wrap-up of the gobbi workflow (Configuration is CLI init, not a workflow doc)") is plausible but conflates "5 productive steps" (the Iron-Law-level conceptual count) with "files under workflow/" (which includes 2 sub-phase docs).
- The design file should either (a) explicitly state "the 5 productive-step + wrap-up docs; evaluation.md + memorization.md are sub-phase docs and intentionally excluded because per-iter cadence applies at the loop level, not the sub-phase level" OR (b) be expanded to cover 7 docs.
- This is the exact ambiguity D-4 was created to remove. Leaving it implicit defeats the gap-resolution.

Suggested direction:
- Expand the D-4 staged design file to disambiguate explicitly: either justify the 5-doc set vs the 7-doc dir, OR add the 2 sub-phase docs with their own cadence guidance (likely "no per-iter commit; subordinate to host loop's commit"), OR push the decision back to a one-card AskUserQuestion before Planning.

### F-P3 (Medium, Confidence 75, scenario_gap / process)

**WORK phase introduced a decision (mirror-policy lock + sync-mechanism backlog) that was raised mid-DISCUSSION round 2 but the empirical sync-mechanism scan happened DURING WORK, not DISCUSSION.**

Evidence:
- `preparation/SKILL.md` § 213: "WORK does NOT write directly to project memory."
- `preparation/SKILL.md` § 274: "WORK does not introduce design decisions, plans, or implementations beyond what the user approved in DISCUSSION."
- draft-iter1.md line 141 says the empirical sync-mechanism check was executed "(this WORK phase)" — meaning the leader did discovery work during WORK that produced a NEW finding (no mechanism exists) that ITSELF produced a NEW staged backlog (the conditional sync-mechanism backlog at line 116-117).
- This was not in the locked Sub-step D gap-resolution table. It is a NEW gap surfaced during WORK.

Why it matters:
- Per the WORK discipline rule, the leader should have either (a) re-entered DISCUSSION when the WORK-phase scan returned a result that triggered a new artifact, or (b) constrained the WORK scan to confirmation only (not "if absent, generate a new conditional backlog").
- The actual outcome is mild — the conditional backlog is sensible — but the discipline boundary was crossed without re-DISCUSSION. This is a process-quality finding.

(Coupled with F-P1: the sync-mechanism scan was also empirically incomplete because it did not check file-level symlinks in `.claude/skills/`. So the WORK-introduced artifact is also wrong on substance.)

### F-P4 (Low, Confidence 100, general / process)

**The D-3 staging file is internally consistent and the three cited mistake paths all exist** — confirmed via `ls -la`. Files are 3716 / 4121 / 3668 bytes respectively. Citation discipline passes.

The D-3 staging file is also well-templated (Context / Decision / Rationale / Alternatives / Consequences / Related) and follows the `decisions.md` frontmatter shape.

## Must-preserve list

- D-3 staged decision: the binding "Planning brief Load Directives must cite 3 specific mistakes" is high-value process discipline. Keep it.
- D-3 mistake citations all empirically verified — preserve the file basenames and the explicit-citation discipline.
- The Sub-step A → D structure of the rawdata is a clean preparation-phase narrative; preserve the format.
- The Decisions Log table (15 rows) is a complete audit trail of AskUserQuestion outcomes.
- The exit checklist at the end of draft-iter1.md is rigorous and useful.

## Verdict

**FAIL** (per evaluation/SKILL.md thresholds: any Critical with confidence ≥75).

F-P1 is Critical/100 — the canonical user-locked decision is empirically false. The remediation requires re-DISCUSSION with the user (to confirm or pivot the policy now that the on-disk reality is known) and a corrected sync-mechanism backlog (likely retired or re-scoped). F-P2 (High/100) further requires either expanding the D-4 staging file or pushing the 5-vs-7 question back to user confirmation.

