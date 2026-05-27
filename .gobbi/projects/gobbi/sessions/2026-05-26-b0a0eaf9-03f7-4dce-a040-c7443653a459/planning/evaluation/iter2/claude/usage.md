# Planning Eval iter2 — Usage perspective (Claude, executor-facing)

**Frame:** Can the executor follow each task unambiguously? (was PASS, DOC-USAGE-1/2 Medium).

## iter1 findings under this lens
- **DOC-USAGE-1 (task count ≠ glob match count for archive, Medium/100): CLOSED.** Stated doc counts now match what the archive-safe glob actually selects (workflow 26 = `find -not archive`; install-runtime 44). T9a/P6/N1 verifies even include the `find ... -not -path '*/archive/*'` count assertion (26 / 30 / 18) as an executor self-check.
- **DOC-USAGE-2 (T10 symlink confusion, Medium/100): CLOSED.** T10 now tells the executor exactly: edit ONLY `.codex/AGENTS.md`, do NOT edit the AGENTS.md symlink path, edit the WORKTREE copy. `readlink` self-check in verifies. Unambiguous.

## Fresh pass
- Each task names its files, leak baseline, base-key count, and git-diff scope — executable. T6/T7 name the 5 underscore files so the executor knows the witnesses.
- Recommended execution order (line 697-698) is a single linear sequence — easy to follow.

**Verdict: PASS** — executor ambiguity removed.
