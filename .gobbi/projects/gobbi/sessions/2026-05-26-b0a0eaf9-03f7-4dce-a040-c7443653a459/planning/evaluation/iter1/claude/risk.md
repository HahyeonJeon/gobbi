# Planning Evaluation — Risk (Claude, iter1)

## Artifact Summary + Memory reads
(Shared summary in project.md.) Risk focus: blast radius, rollback granularity, main-tree edit hazard, scope-leak blast.
**Memory reads:** executor-main-tree-edit-near-miss; executor-mirror-path-vs-worktree-physical-copy; worktree-physical-file-missing-when-checked-out; skills-mirror-symlinks-not-copies; edit-tool-refuses-symlink-paths; sendmessage-continued-cwd-resets-to-main-tree; design-literal-retire-instruction-without-replacement.

## Locked Frame (Stage 1)
- **S1 Per-task rollback boundary clear** — each task is an atomic commit; pause-after-N is coherent.
- **S2 Main-tree edit hazard contained** — worktree-physical edits only; T10 dual-tree AGENTS.md handled.
- **S3 Shared-file infra (rules.md) isolated** — only T0/T11 touch rules.md, sequenced.
- **S4 (adversarial) A task silently widens scope / touches frozen archive** — D10 blast.
- **S5 (adversarial) Symlink write-through corrupts the canonical file** — rules.md + AGENTS.md symlinks.
- **S6 Never-delete invariant on narrative (D9)** — reclassify-to-notes, not delete.

## Per-scenario per-check results
- **S1:** YES — each task commits (git in always-skills); per-group grouping makes pause-after-N coherent; sequential execution. Rollback = revert the task's commit.
- **S2:** PARTIAL — T10 correctly targets the WORKTREE `.codex/AGENTS.md` (verified: worktree inode 120855987 ≠ main-tree 120455203, so it IS a separate physical copy; editing it in-worktree is correct). The CRITICAL mistake column + git-diff verify guard the main-tree hazard well. BUT the symlink mismodel (DOC-USAGE-2 / DOC-RISK-1) remains.
- **S3:** YES — only T0 + T11 touch `skills/memorization/rules.md`; T11 requires T0; conflict flag documented (line 570). `.claude/.../rules.md` symlink correctly flagged DO-NOT-EDIT (T0/T11 mistakes column).
- **S4:** **NO** — frozen archive blast via the `**` globs (DOC-PROJECT-1/DOC-CONS-1). Editing a frozen archive doc is a low-reversibility scope violation (the doc is intentionally frozen).
- **S5:** PARTIAL — rules.md symlink handled (T0/T11 mistakes). AGENTS.md symlink NOT modeled (T10 treats it as a 2nd real file). An Edit through the `AGENTS.md` symlink path either refuses or writes through to `.codex/AGENTS.md` — at best confusing, at worst a double-write. See DOC-RISK-1.
- **S6:** YES — D9 reclassify-not-delete injected into every prose task (mistakes column `never-delete`, `reclassify-to-notes`); `design-literal-retire-instruction-without-replacement` cited. Never-delete invariant preserved.

## Typed findings

### DOC-RISK-1 — AGENTS.md symlink mismodel risks an Edit-tool refusal or write-through (T10)
- **Type:** assumption_risk · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** Medium
- **Evidence:** `AGENTS.md -> .codex/AGENTS.md` (symlink) in both trees (verified `ls -la`). T10 `files:` lists both as `op: modify`. Loaded mistake `edit-tool-refuses-symlink-paths`: the Edit tool refuses symlink paths. So "modify AGENTS.md" is either a refusal (executor stalls) or, if force-resolved, a redundant write to the same `.codex/AGENTS.md`. Risk is bounded (one narrow count-fix task, Low scope) but the failure mode is concrete.
- **Why it matters:** Wasted iter / executor confusion on a task the plan itself flags CRITICAL. The mitigation should be "edit the real file, not the symlink" (as T0 does for rules.md) — T10 does the opposite by listing the symlink as an edit target.
- **Suggested direction:** drop `AGENTS.md` from T10 `files:`; edit `.codex/AGENTS.md` only; note the symlink auto-reflects.

### DOC-RISK-2 — Frozen-archive edit is a low-reversibility scope violation (Risk lens of DOC-PROJECT-1)
- **Type:** design_flaw · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** High
- **Evidence:** `**` globs in T9a/P5/P6/N1 reach frozen `features/*/archive/` docs (2 content + 5 READMEs). Archive is the deliberately-frozen tier (D10, move-on-terminal model). Conforming/rewriting a frozen doc mutates a record that is supposed to be immutable — and the git-diff verify (scoped to "worktree <feature> paths") would not flag it as anomalous since archive is under the feature path.
- **Why it matters:** Blast radius extends into the immutable archive tier; the verify cannot catch it. High because it silently breaches a locked invariant across 4 tasks.
- **Suggested direction:** add archive exclusion to the `files:` globs (cross-ref DOC-PROJECT-1).

## Low-confidence appendix
- (none)

## Verdict
Risk: **REVISE** — DOC-RISK-2 High/100 open; DOC-RISK-1 Medium/100. Rollback, rules.md isolation, never-delete are sound.
