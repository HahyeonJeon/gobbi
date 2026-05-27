## Findings

1. **Type:** design_flaw
   **Severity:** High
   **Confidence:** 100
   **Evidence:** The exact T9c scope at `14041db` is 28 files. The conformance script over `git show 14041db:<path>` reported `gate_leaks 0`, `base_missing 0`, and `cryptic_hits 0`, but also reported `scope_errors 1`: `.gobbi/projects/gobbi/features/README.md` has `scope: feature` at frontmatter line 5. The prompt's §2.1 gate says T9c docs are project-tier docs and flags any `scope: feature` document.
   **Fix:** Change `.gobbi/projects/gobbi/features/README.md` to `scope: project` while keeping `feature: null`.

2. **Type:** design_flaw
   **Severity:** Critical
   **Confidence:** 100
   **Evidence:** The KEEP safety invariant is violated. A frontmatter comparison of `14041db^` to `14041db` found KEEP-listed keys stripped from six mistake files: `title` was removed from `codex-eval-session-write-path-nested-in-worktree.md`, `codex-subprocess-writes-to-main-tree.md`, `evaluator-returned-verdict-inline-no-per-perspective-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`, `manager-rm-rf-without-investigating-tracked-files.md`, and `session-dir-placed-outside-worktree.md`; `project` was removed from `codex-eval-session-write-path-nested-in-worktree.md`, `evaluator-returned-verdict-inline-no-per-perspective-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`, and `manager-rm-rf-without-investigating-tracked-files.md`. `title` and `project` are explicitly in the §4.4 KEEP list, and the prompt makes "ZERO KEEP stripped" a pass condition.
   **Fix:** Restore those stripped KEEP fields exactly, or update the standard and evaluation contract before removing them. Do not treat KEEP-listed keys as staging residue.

VERDICT: REVISE
