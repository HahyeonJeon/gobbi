# Planning Evaluation — Usage (Claude, iter1)

## Artifact Summary + Memory reads
(Shared summary in project.md.) Usage focus: can a fresh executor run any task in isolation from its `files:`/`inputs:`/`verifies:` alone?
**Memory reads:** planning/evaluation.md (3am-fresh-executor seed); mistakes edit-tool-refuses-symlink-paths, executor-mirror-path-vs-worktree-physical-copy.

## Locked Frame (Stage 1)
- **S1 Fresh executor can begin task N from its fields alone** — files + inputs + verifies self-contained.
- **S2 Executor knows exactly which files to open** — globs resolve to a clear, correct file set.
- **S3 Failure modes / required mistakes communicated** — per-task mistakes column injected.
- **S4 (adversarial) Executor must guess what a glob means** — `**/*.md` ambiguity vs the stated count.

## Per-scenario per-check results
- **S1:** MOSTLY — each task has files/inputs/outputs/verifies + a per-task mistakes column. T0 inputs cite the design-options + templates. Good self-containment.
- **S2:** **PARTIAL** — for T9a/P5/P6/N1 the `files:` glob (`**/*.md`, `**/README.md`) resolves to MORE files than the task's stated count (includes nested archive). A fresh executor reading "all 26 docs" (T9a) but globbing `features/workflow/**/*.md` gets 27. Ambiguous which is authoritative. See DOC-USAGE-1.
- **S3:** YES — mistakes column per task; T10 flagged CRITICAL for the dual-tree AGENTS.md hazard; symlink/cwd-reset/never-delete injected appropriately.
- **S4:** **NO** — T10's framing tells the executor to edit two separate files when AGENTS.md is a symlink. See DOC-USAGE-2.

## Typed findings

### DOC-USAGE-1 — `files:` glob count diverges from the task's stated doc count (archive over-match)
- **Type:** checklist_gap · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** Medium
- **Evidence:** T9a says "all 26 docs" but `files: features/workflow/**/*.md` matches 27 (incl `archive/decisions/2026-05-23-iter1-user-redirects.md`). P5 says 44, glob matches 45. N1 says "18 READMEs" but `**/README.md` matches 23. A fresh executor cannot tell from the task alone whether to edit 26 or 27. (Substantive scope version is DOC-PROJECT-1; this is the executor-confusion lens.)
- **Why it matters:** Executor either over-edits (touches archive, D10 violation) or improvises an exclusion not in the field — both are planning gaps the executor should not have to resolve.
- **Suggested direction:** make the `files:` glob and the stated count agree (add archive exclusion to the glob).

### DOC-USAGE-2 — T10 instructs editing AGENTS.md as a separate file, but it is a symlink to .codex/AGENTS.md
- **Type:** design_flaw · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 100 · **Severity:** Medium
- **Evidence:** Plan line 354: "Update AGENTS.md and .codex/AGENTS.md ... both files exist in BOTH the main tree and the worktree." `files:` lists `AGENTS.md` (op: modify) AND `.codex/AGENTS.md` (op: modify) as two edits (lines 359-362). Empirically `AGENTS.md` is a **symlink → .codex/AGENTS.md** in BOTH the worktree and the main tree (`ls -la`: `AGENTS.md -> .codex/AGENTS.md`). There is ONE real file. The loaded mistake `edit-tool-refuses-symlink-paths` states the Edit tool refuses symlink paths — an executor told to "modify AGENTS.md" will hit that refusal. The verify `grep -c '13 principles' AGENTS.md .codex/AGENTS.md` will pass (symlink resolves), masking that only one file should be edited.
- **Why it matters:** The executor either fails on the symlink Edit or is confused about why "two files" show as one diff. The mitigation mistake is loaded but the task's own framing contradicts it (says "both files" rather than "one canonical file + a symlink"). T10's worktree-edit target IS correct (worktree `.codex/AGENTS.md` is a distinct inode from main tree — verified), so the main-tree hazard is handled; the symlink mismodel is the gap.
- **Suggested direction:** restate T10 to edit `.codex/AGENTS.md` only (the real file); note `AGENTS.md` is a symlink that auto-reflects (mirror of the rules.md symlink pattern in T0).

## Low-confidence appendix
- (none)

## Verdict
Usage: **PASS** — two Medium findings (DOC-USAGE-1/2); neither alone trips the REVISE floor (no High≥50 here), but both feed the Overall REVISE via their scope/consistency siblings. Recorded as Medium open.
