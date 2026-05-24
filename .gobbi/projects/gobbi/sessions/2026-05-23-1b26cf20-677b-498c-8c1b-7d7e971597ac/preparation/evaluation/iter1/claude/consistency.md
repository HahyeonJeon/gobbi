# Preparation iter1 — CONSISTENCY perspective (Claude)

Perspective: consistency (cross-file claims align; numbers / counts / paths agree)
Verdict: **REVISE**

## Findings

### F-C1 (High, Confidence 100, scenario_gap / docs-sync)

**The "5 workflow phase docs" claim is consistent across the artifacts but inconsistent with the file system.**

- Ideation artifact line 155: "all 5 workflow phase docs"
- draft-iter1.md line 53: "5 files" / line 89: "5 workflow phase docs"
- D-4 staging file lines 34-42: lists 5
- Actual `ls .claude/skills/orchestration/workflow/`: 7 files (`ideation evaluation execution ideation memorization planning preparation wrap-up`)

All artifacts say "5" — but the directory has 7. Internal consistency among artifacts is fine; external consistency with reality fails. (Detailed in project.md F-P2 and usage.md F-U1.)

### F-C2 (Critical, Confidence 100, scenario_gap / docs-sync)

**The mirror-policy claim and the file-system reality are inverted.**

Claim (draft-iter1.md line 137-138, mirror-policy decision file line 17): "workspace `.claude/skills/` is canonical; project mirror at `.gobbi/projects/gobbi/skills/` derives from it via an auto-sync mechanism."

Reality (verified by `find .claude/skills/ -maxdepth 2 -type l`): 24 file-level symlinks exist under `.claude/skills/` pointing INTO `.gobbi/projects/gobbi/skills/`. The mirror is the on-disk source; the workspace is the symlink layer.

Also: the decision file's own evidence (line 17) — "verified `ls -la` shows real directories" — confirms only that the **directories** are real on both sides. The leader did not check **files**.

(Detailed in project.md F-P1.)

### F-C3 (High, Confidence 100, scenario_gap / docs-sync)

**"NO MECHANISM EXISTS" claim is empirically wrong** — a symlink-based sync mechanism is the on-disk reality for the file layer. The leader's own backlog (`workspace-to-mirror-sync-mechanism.md` line 60-64) proposes symlinks as Option 2 — but symlinks already partially exist; the conditional backlog should be re-scoped to "verify symlink coverage is complete" not "no mechanism exists, choose one of 3 options."

### F-C4 (Medium, Confidence 100, general / docs-sync)

**The Decisions Log row 12 mis-reports the sync-mechanism check outcome.** Row 12: "Sync-mechanism check outcome (this WORK phase, empirical) → No auto-sync mechanism exists." This is reported as a definite finding when in fact the check was incomplete (did not survey `.claude/skills/*/*.md` for symlinks).

### F-C5 (Low, Confidence 100, general / process)

**D-3 mistake citations are internally consistent.** Each of the 3 cited files (`codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`) is named the same in the rawdata, the draft, and the decision file. Empirically verified to exist (3716 / 3668 / 4121 bytes).

### F-C6 (Low, Confidence 100, general / docs-sync)

**The Scope Contract in draft-iter1.md is consistent with the locked Ideation artifact.** Both say T1 + T3 in scope, T2 deferred. The Scope Contract — out-of-scope list at line 18 of the draft enumerates the same deferral set the Ideation Scope Contract specified.

## Must-preserve list

- Internal cross-file consistency (D-3 mistake basenames, scope contract, decision log structure) — preserve.
- The empirical-check call-outs with exact commands run — preserve the format, but re-run them against the file layer (not just directory layer).

## Verdict

**REVISE** — F-C2 is Critical, but it's the same finding as project.md F-P1; the consistency perspective surfaces it as an internal-vs-external consistency split. Combined with F-C1 (5-vs-7 phase docs) and F-C3 (sync-mechanism claim), three artifacts need updates to re-align with file-system reality before Planning can consume them safely.

